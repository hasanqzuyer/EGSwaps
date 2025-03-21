import { useCallback, useMemo, memo } from 'react'
import { Currency, Trade, TradeType } from '@pancakeswap/sdk'
import { ConfirmationModalContent } from '@pancakeswap/uikit'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { Field } from 'state/swap/actions'
import { computeSlippageAdjustedAmounts, computeSlippageAdjustedAmountsKyberSwap } from 'utils/exchange'
import SwapModalFooter from './SwapModalFooter'
import SwapModalHeader from './SwapModalHeader'
import StableSwapModalFooter from '../StableSwap/components/StableSwapModalFooter'
import { computeTradePriceBreakdown } from '../SmartSwap/utils/exchange'

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
function tradeMeaningfullyDiffers(
  tradeA: Trade<Currency, Currency, TradeType>,
  tradeB: Trade<Currency, Currency, TradeType>,
): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !tradeA.inputAmount.currency.equals(tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !tradeA.outputAmount.currency.equals(tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  )
}

const TransactionConfirmSwapContent = ({
  trade,
  originalTrade,
  onAcceptChanges,
  allowedSlippage,
  onConfirm,
  recipient,
  currencyBalances,
  isStable,
}) => {
  const showAcceptChanges = useMemo(
    () => Boolean(trade && originalTrade && tradeMeaningfullyDiffers(trade, originalTrade)),
    [originalTrade, trade],
  )

  const slippageAdjustedAmounts = useMemo(
    () => {
      if ("routerAddress" in trade)  return computeSlippageAdjustedAmountsKyberSwap(trade, allowedSlippage) //KyberSwap if "routerAddress" in trade structure
      else return computeSlippageAdjustedAmounts(trade, allowedSlippage)
    }, 
    [trade, allowedSlippage],
  )

  const isEnoughInputBalance = useMemo(() => {
    if (trade?.tradeType !== TradeType.EXACT_OUTPUT) return null

    const isInputBalanceExist = !!(currencyBalances && currencyBalances[Field.INPUT])
    const isInputBalanceBNB = isInputBalanceExist && currencyBalances[Field.INPUT].currency.isNative
    const inputCurrencyAmount = isInputBalanceExist
      ? isInputBalanceBNB
        ? maxAmountSpend(currencyBalances[Field.INPUT])
        : currencyBalances[Field.INPUT]
      : null
    return inputCurrencyAmount && slippageAdjustedAmounts && slippageAdjustedAmounts[Field.INPUT]
      ? inputCurrencyAmount.greaterThan(slippageAdjustedAmounts[Field.INPUT]) ||
          inputCurrencyAmount.equalTo(slippageAdjustedAmounts[Field.INPUT])
      : false
  }, [currencyBalances, trade, slippageAdjustedAmounts])

  const { priceImpactWithoutFee } = useMemo(() => {
    return isStable ? { priceImpactWithoutFee: undefined } : computeTradePriceBreakdown(trade)
  }, [isStable, trade])

  const modalHeader = useCallback(() => {
    return trade ? (
      <SwapModalHeader
        inputAmount={trade.inputAmount}
        outputAmount={trade.outputAmount}
        tradeType={trade.tradeType}
        priceImpactWithoutFee={priceImpactWithoutFee}
        allowedSlippage={allowedSlippage}
        slippageAdjustedAmounts={slippageAdjustedAmounts}
        isEnoughInputBalance={isEnoughInputBalance}
        recipient={recipient}
        showAcceptChanges={showAcceptChanges}
        onAcceptChanges={onAcceptChanges}
      />
    ) : null
  }, [
    allowedSlippage,
    onAcceptChanges,
    recipient,
    showAcceptChanges,
    trade,
    slippageAdjustedAmounts,
    isEnoughInputBalance,
    priceImpactWithoutFee,
  ])

  const modalBottom = useCallback(() => {
    const SwapModalF = isStable ? StableSwapModalFooter : SwapModalFooter

    return trade ? (
      <SwapModalF
        onConfirm={onConfirm}
        trade={trade}
        disabledConfirm={showAcceptChanges}
        slippageAdjustedAmounts={slippageAdjustedAmounts}
        isEnoughInputBalance={isEnoughInputBalance}
      />
    ) : null
  }, [onConfirm, showAcceptChanges, trade, isEnoughInputBalance, slippageAdjustedAmounts, isStable])

  return <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />
}

export default memo(TransactionConfirmSwapContent)
