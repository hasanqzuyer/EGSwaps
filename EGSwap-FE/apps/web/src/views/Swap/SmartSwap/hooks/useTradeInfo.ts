import { useMemo } from 'react'
import { ChainId, Currency, CurrencyAmount, Percent, Price, Trade, TradeType } from '@pancakeswap/sdk'
import { Pair, RouteType, Trade as SmartRouterTrade, TradeWithStableSwap } from '@pancakeswap/smart-router/evm'

import { Field } from 'state/swap/actions'
import { ROUTER_ADDRESS, EGSWAP_SMART_ROUTER_ADDRESS, EGSWAP_SMART_ROUTER_ADDRESS_MAP } from 'config/constants/exchange'
import {
  computeSlippageAdjustedAmounts as computeSlippageAdjustedAmountsForV2Trade,
  computeTradePriceBreakdown as computeTradePriceBreakdownForV2Trade,
  computeSlippageAdjustedAmountsKyberSwap
} from 'utils/exchange'

import { computeSlippageAdjustedAmounts, computeTradePriceBreakdown, SMART_ROUTER_ADDRESS } from '../utils/exchange'
import BigNumber from 'bignumber.js'
import { KyberSwapClass } from 'state/swap/hooks'
import { Route } from 'state/swap/lib/types'

interface Options {
  trade?: TradeWithStableSwap<Currency, Currency, TradeType> | null
  v2Trade?: Trade<Currency, Currency, TradeType> | null
  externalTrade?: Trade<Currency, Currency, TradeType> | null
  kyberSwapTrade?: KyberSwapClass<Currency,Currency,TradeType> | null
  useExternalSwap?: boolean
  useSmartRouter?: boolean
  allowedSlippage: number
  chainId: ChainId
  swapInputError: string
  externalSwapInputError: string
  stableSwapInputError: string
}

interface Info {
  tradeType: TradeType
  inputAmount: CurrencyAmount<Currency>
  outputAmount: CurrencyAmount<Currency>
  route: {
    pairs: Pair[]
    path: Currency[]
  } | Route[][]
  slippageAdjustedAmounts: { [field in Field]?: CurrencyAmount<Currency> }
  executionPrice: Price<Currency, Currency>
  routerAddress: string
  priceImpactWithoutFee?: Percent
  realizedLPFee?: CurrencyAmount<Currency> | null
  fallbackV2: boolean
  externalSwap: boolean
  kyberSwap: boolean
  inputError: string
}

export function useTradeInfo({
  trade,
  v2Trade,
  externalTrade,
  kyberSwapTrade,
  useExternalSwap,
  useSmartRouter = true,
  allowedSlippage = 0,
  chainId,
  swapInputError,
  externalSwapInputError,
  stableSwapInputError,
}: Options): Info | null {
  return useMemo(() => {
    if (!trade && !v2Trade && !externalTrade && !kyberSwapTrade) {
      return null
    }
    const smartRouterAvailable = useSmartRouter && !!trade
    const fallbackV2 = !smartRouterAvailable || trade?.route.routeType === RouteType.V2
    const routerFee = 0.25;
    console.log('V2Trade____inputAmount----', v2Trade?.inputAmount.toSignificant(6));
    console.log('V2Trade____outputAmount----', v2Trade?.outputAmount.toSignificant(6));
    console.log('externalSwap____inputAmount----', (v2Trade?.tradeType == TradeType.EXACT_INPUT) ? externalTrade?.inputAmount.toSignificant(6) : BigNumber(externalTrade?.inputAmount.toSignificant(6)).multipliedBy(100 + routerFee).div(100).toFixed());
    console.log('externalSwap____outputAmount----', (v2Trade?.tradeType == TradeType.EXACT_INPUT) ? (BigNumber(externalTrade?.outputAmount.toSignificant(6)).multipliedBy(100 - routerFee).div(100)).toFixed() : externalTrade?.outputAmount.toSignificant(6));
    console.log('KyberSwapTrade____inputAmount----', kyberSwapTrade?.inputAmount?.toSignificant(6));
    console.log('kyberSwapTrade____outputAmount----', kyberSwapTrade?.outputAmount?.toSignificant(6));
    const v2TradeInputAmount: BigNumber = BigNumber(v2Trade?.inputAmount.toSignificant(6));
    const v2TradeOutputAmount: BigNumber = BigNumber(v2Trade?.outputAmount.toSignificant(6));
    const kyberSwapTradeInputAmount: BigNumber = BigNumber(kyberSwapTrade?.inputAmount.toSignificant(6));
    const kyberSwapTradeOutputAmount: BigNumber = BigNumber(kyberSwapTrade?.outputAmount.toSignificant(6));
    const externalTradeInputAmount: BigNumber = BigNumber(externalTrade?.inputAmount.toSignificant(6)).multipliedBy(100 + routerFee).div(100);
    const externalTradeOutputAmount: BigNumber = BigNumber(externalTrade?.outputAmount.toSignificant(6)).multipliedBy(100 - routerFee).div(100);
    if (fallbackV2) {
      if (v2Trade && (!useExternalSwap || !externalTrade || (v2Trade.tradeType == TradeType.EXACT_INPUT ? (externalTradeOutputAmount.comparedTo(v2TradeOutputAmount) == -1) : (externalTradeInputAmount.comparedTo(v2TradeInputAmount) == 1)))) {
        const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdownForV2Trade(v2Trade)
        return {
          tradeType: v2Trade.tradeType,
          fallbackV2,
          route: v2Trade.route,
          inputAmount: v2Trade.inputAmount,
          outputAmount: v2Trade.outputAmount,
          slippageAdjustedAmounts: computeSlippageAdjustedAmountsForV2Trade(v2Trade, allowedSlippage),
          executionPrice: v2Trade.executionPrice,
          routerAddress: ROUTER_ADDRESS[chainId],
          priceImpactWithoutFee,
          realizedLPFee,
          externalSwap: false,
          inputError: swapInputError,
          kyberSwap: false
        }
      }
      else if (useExternalSwap && externalTrade) {
        const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdownForV2Trade(externalTrade)
        return {
          tradeType: externalTrade.tradeType,
          fallbackV2,
          route: externalTrade.route,
          inputAmount: externalTrade.inputAmount,
          outputAmount: externalTrade.outputAmount,
          slippageAdjustedAmounts: computeSlippageAdjustedAmountsForV2Trade(externalTrade, allowedSlippage),
          executionPrice: externalTrade.executionPrice,
          routerAddress: EGSWAP_SMART_ROUTER_ADDRESS_MAP[chainId],
          priceImpactWithoutFee,
          realizedLPFee,
          externalSwap: true,
          inputError: externalSwapInputError,
          kyberSwap: false
        }
      }
    }
    if (kyberSwapTrade) {
      console.log('KyberSwap is working!');
      return {
        tradeType: kyberSwapTrade.tradeType,
        fallbackV2,
        route: kyberSwapTrade.route,
        inputAmount: kyberSwapTrade.inputAmount,
        outputAmount: kyberSwapTrade.outputAmount,
        slippageAdjustedAmounts: computeSlippageAdjustedAmountsKyberSwap(kyberSwapTrade, allowedSlippage),
        executionPrice: kyberSwapTrade.executionPrice,
        routerAddress: kyberSwapTrade.routerAddress,
        priceImpactWithoutFee: null,
        realizedLPFee: null,
        externalSwap: false,
        inputError: kyberSwapTrade.inputError,
        kyberSwap: true
      }
    }

    const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(trade)
    return {
      tradeType: trade.tradeType,
      fallbackV2,
      route: trade.route,
      inputAmount: trade.inputAmount,
      outputAmount: trade.outputAmount,
      slippageAdjustedAmounts: computeSlippageAdjustedAmounts(trade, allowedSlippage),
      executionPrice: SmartRouterTrade.executionPrice(trade),
      routerAddress: SMART_ROUTER_ADDRESS[chainId],
      priceImpactWithoutFee,
      realizedLPFee,
      externalSwap: false,
      inputError: stableSwapInputError,
      kyberSwap: false
    }
  }, [useSmartRouter, trade, v2Trade, externalTrade, kyberSwapTrade, useExternalSwap, allowedSlippage, chainId, stableSwapInputError, swapInputError])
}
