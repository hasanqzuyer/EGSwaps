import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { useTranslation } from '@pancakeswap/localization'
import { SwapParameters, TradeType, Currency } from '@pancakeswap/sdk'
import isZero from '@pancakeswap/utils/isZero'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { isStableSwap, V2TradeAndStableSwap } from 'config/constants/types'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useMemo } from 'react'
import { useGasPrice } from 'state/user/hooks'
import { logSwap, logTx } from 'utils/log'

import { INITIAL_ALLOWED_SLIPPAGE } from '../config/constants'
import { useTransactionAdder } from '../state/transactions/hooks'
import { calculateGasMargin, isAddress } from '../utils'
import { basisPointsToPercent } from '../utils/exchange'
import { transactionErrorToUserReadableMessage } from '../utils/transactionErrorToUserReadableMessage'
import { KyberSwapClass } from 'state/swap/hooks'
import {minimumAmountOutKyberSwap, maximumAmountInKyberSwap} from '../utils/exchange'
import { Swapper } from 'state/swap/lib'
import { useSigner } from 'wagmi'
import {ethers} from "ethers";

export enum SwapCallbackState {
  INVALID,
  LOADING,
  VALID,
}

interface SwapCall {
  contract: Contract
  parameters: SwapParameters
}

interface SuccessfulCall extends SwapCallEstimate {
  gasEstimate: BigNumber
}

interface FailedCall extends SwapCallEstimate {
  error: string
}

interface SwapCallEstimate {
  call: SwapCall
}

// returns a function that will execute a swap, if the parameters are all valid
// and the user has approved the slippage adjusted input amount for the trade
export function useSwapCallback(
  trade: V2TradeAndStableSwap, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddress: string | null, // the address of the recipient of the trade, or null if swap should be returned to sender
  swapCalls: SwapCall[],
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId } = useActiveWeb3React()
  const gasPrice = useGasPrice()

  const { t } = useTranslation()

  const addTransaction = useTransactionAdder()

  const recipient = recipientAddress === null ? account : recipientAddress

  return useMemo(() => {
    if (!trade || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddress !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      }
      return { state: SwapCallbackState.LOADING, callback: null, error: null }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        const estimatedCalls: SwapCallEstimate[] = await Promise.all(
          swapCalls.map((call) => {
            const {
              parameters: { methodName, args, value },
              contract,
            } = call
            const options = !value || isZero(value) ? {} : { value }

            return contract.estimateGas[methodName](...args, options)
              .then((gasEstimate) => {
                return {
                  call,
                  gasEstimate,
                }
              })
              .catch((gasError) => {
                console.error('Gas estimate failed, trying eth_call to extract error', call)

                return contract.callStatic[methodName](...args, options)
                  .then((result) => {
                    console.error('Unexpected successful call after failed estimate gas', call, gasError, result)
                    return { call, error: t('Unexpected issue with estimating the gas. Please try again.') }
                  })
                  .catch((callError) => {
                    console.error('Call threw error', call, callError)

                    return { call, error: transactionErrorToUserReadableMessage(callError, t) }
                  })
              })
          }),
        )

        // a successful estimation is a bignumber gas estimate and the next call is also a bignumber gas estimate
        const successfulEstimation = estimatedCalls.find(
          (el, ix, list): el is SuccessfulCall =>
            'gasEstimate' in el && (ix === list.length - 1 || 'gasEstimate' in list[ix + 1]),
        )

        if (!successfulEstimation) {
          const errorCalls = estimatedCalls.filter((call): call is FailedCall => 'error' in call)
          if (errorCalls.length > 0) throw new Error(errorCalls[errorCalls.length - 1].error)
          throw new Error(t('Unexpected error. Could not estimate gas for the swap.'))
        }

        const {
          call: {
            contract,
            parameters: { methodName, args, value },
          },
          gasEstimate,
        } = successfulEstimation

        return contract[methodName](...args, {
          gasLimit: calculateGasMargin(gasEstimate),
          gasPrice,
          ...(value && !isZero(value) ? { value, from: account } : { from: account }),
        })
          .then((response: any) => {
            const inputSymbol = trade.inputAmount.currency.symbol
            const outputSymbol = trade.outputAmount.currency.symbol
            const pct = basisPointsToPercent(allowedSlippage)
            const inputAmount =
              trade.tradeType === TradeType.EXACT_INPUT
                ? trade.inputAmount.toSignificant(3)
                : trade.maximumAmountIn(pct).toSignificant(3)

            const outputAmount =
              trade.tradeType === TradeType.EXACT_OUTPUT
                ? trade.outputAmount.toSignificant(3)
                : trade.minimumAmountOut(pct).toSignificant(3)

            const base = `Swap ${
              trade.tradeType === TradeType.EXACT_OUTPUT ? 'max.' : ''
            } ${inputAmount} ${inputSymbol} for ${
              trade.tradeType === TradeType.EXACT_INPUT ? 'min.' : ''
            } ${outputAmount} ${outputSymbol}`

            const recipientAddressText =
              recipientAddress && isAddress(recipientAddress) ? truncateHash(recipientAddress) : recipientAddress

            const withRecipient = recipient === account ? base : `${base} to ${recipientAddressText}`

            const translatableWithRecipient =
              trade.tradeType === TradeType.EXACT_OUTPUT
                ? recipient === account
                  ? 'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol%'
                  : 'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol% to %recipientAddress%'
                : recipient === account
                ? 'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol%'
                : 'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol% to %recipientAddress%'

            addTransaction(response, {
              summary: withRecipient,
              translatableSummary: {
                text: translatableWithRecipient,
                data: {
                  inputAmount,
                  inputSymbol,
                  outputAmount,
                  outputSymbol,
                  ...(recipient !== account && { recipientAddress: recipientAddressText }),
                },
              },
              type: 'swap',
            })
            logSwap({
              chainId,
              inputAmount,
              outputAmount,
              input: trade.inputAmount.currency,
              output: trade.outputAmount.currency,
              type: isStableSwap(trade) ? 'StableSwap' : 'V2Swap',
            })
            logTx({ account, chainId, hash: response.hash })

            return response.hash
          })
          .catch((error: any) => {
            // if the user rejected the tx, pass this along
            if (error?.code === 4001) {
              throw new Error('Transaction rejected.')
            } else {
              // otherwise, the error was unexpected and we need to convey that
              console.error(`Swap failed`, error, methodName, args, value)
              throw new Error(t('Swap failed: %message%', { message: transactionErrorToUserReadableMessage(error, t) }))
            }
          })
      },
      error: null,
    }
  }, [trade, account, chainId, recipient, recipientAddress, swapCalls, gasPrice, t, addTransaction, allowedSlippage])
}

export function useKyberSwapCallback(
  trade: KyberSwapClass<Currency, Currency, TradeType>, // trade to execute, required
  allowedSlippage: number = INITIAL_ALLOWED_SLIPPAGE, // in bips
  recipientAddress: string | null // the address of the recipient of the trade, or null if swap should be returned to sender
): { state: SwapCallbackState; callback: null | (() => Promise<string>); error: string | null } {
  const { account, chainId } = useActiveWeb3React()
  const gasPrice = useGasPrice()

  const { t } = useTranslation()

  const addTransaction = useTransactionAdder()

  const recipient = recipientAddress === null ? account : recipientAddress
  const {data: signer} = useSigner({chainId: chainId}); // Wagmi Signer
  const swapper = new Swapper(signer);

  return useMemo(() => {
    if (!trade || !account || !chainId) {
      return { state: SwapCallbackState.INVALID, callback: null, error: 'Missing dependencies' }
    }
    if (!recipient) {
      if (recipientAddress !== null) {
        return { state: SwapCallbackState.INVALID, callback: null, error: 'Invalid recipient' }
      }
      return { state: SwapCallbackState.LOADING, callback: null, error: null }
    }

    return {
      state: SwapCallbackState.VALID,
      callback: async function onSwap(): Promise<string> {
        try {
          let outputAddress: string =  trade.outputAmount.currency.wrapped.address; // output token address for goplus API
          let inputAddress: string = trade.inputAmount.currency.wrapped.address; // input token address for goplus API
          if (trade.outputAmount.currency.isNative) {
            // outputAddress = WNATIVE[outputCurrency?.chainId].address;
            outputAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
          }
          if (trade.inputAmount.currency.isNative) {
            // inputAddress = WNATIVE[inputCurrency?.chainId].address;
            inputAddress = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
          }
          const txHash = await swapper.swap(inputAddress, outputAddress,  ethers.utils.parseEther(trade.inputAmount.toExact() === "" ? "0" : trade.inputAmount.toExact()).toString(), chainId, allowedSlippage);
          // const response = await swapper.quote(inputAddress, outputAddress, ethers.utils.parseEther(typedValue === "" ? "0" : typedValue).toString(), chainId);
          const inputSymbol = trade.inputAmount.currency.symbol
          const outputSymbol = trade.outputAmount.currency.symbol
          const pct = basisPointsToPercent(allowedSlippage)
          const inputAmount =
            trade.tradeType === TradeType.EXACT_INPUT
              ? trade.inputAmount.toSignificant(3)
              : minimumAmountOutKyberSwap(trade, pct).toSignificant(3)
      
          const outputAmount =
            trade.tradeType === TradeType.EXACT_OUTPUT
              ? trade.outputAmount.toSignificant(3)
              : minimumAmountOutKyberSwap(trade, pct).toSignificant(3)
      
          const base = `Swap ${
            trade.tradeType === TradeType.EXACT_OUTPUT ? 'max.' : ''
          } ${inputAmount} ${inputSymbol} for ${
            trade.tradeType === TradeType.EXACT_INPUT ? 'min.' : ''
          } ${outputAmount} ${outputSymbol}`
      
          const recipientAddressText =
            recipientAddress && isAddress(recipientAddress) ? truncateHash(recipientAddress) : recipientAddress
      
          const withRecipient = recipient === account ? base : `${base} to ${recipientAddressText}`
      
          const translatableWithRecipient =
            trade.tradeType === TradeType.EXACT_OUTPUT
              ? recipient === account
                ? 'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol%'
                : 'Swap max. %inputAmount% %inputSymbol% for %outputAmount% %outputSymbol% to %recipientAddress%'
              : recipient === account
                ? 'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol%'
                : 'Swap %inputAmount% %inputSymbol% for min. %outputAmount% %outputSymbol% to %recipientAddress%'
      
          addTransaction(txHash, {
            summary: withRecipient,
            translatableSummary: {
              text: translatableWithRecipient,
              data: {
                inputAmount,
                inputSymbol,
                outputAmount,
                outputSymbol,
                ...(recipient !== account && { recipientAddress: recipientAddressText }),
              },
            },
            type: 'swap',
          })
      
          logSwap({
            chainId,
            inputAmount,
            outputAmount,
            input: trade.inputAmount.currency,
            output: trade.outputAmount.currency,
            type: 'KyberSwap'
          })
      
          logTx({ account, chainId, hash: txHash })
      
          return txHash
        } catch (error) {
          // if the user rejected the tx, pass this along
          if ((error as any)?.code === 4001) {
            throw new Error('Transaction rejected.')
          } else {
            // otherwise, the error was unexpected and we need to convey that
            console.error(`KyberSwap failed`, error)
            throw new Error(`Swap failed`)
          }
        }
      },
      error: null,
    }
  }, [trade, account, chainId, recipient, recipientAddress, gasPrice, t, addTransaction, allowedSlippage])
}