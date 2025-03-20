import { Currency, CurrencyAmount, Fraction, JSBI, Percent, Trade, TradeType } from '@pancakeswap/sdk'
import IPancakeRouter02ABI from 'config/abi/IPancakeRouter02.json'
import { IPancakeRouter02 } from 'config/abi/types/IPancakeRouter02'
import {
  ALLOWED_PRICE_IMPACT_HIGH,
  ALLOWED_PRICE_IMPACT_LOW,
  ALLOWED_PRICE_IMPACT_MEDIUM,
  BIPS_BASE,
  BLOCKED_PRICE_IMPACT_NON_EXPERT,
  INPUT_FRACTION_AFTER_FEE,
  ONE_HUNDRED_PERCENT,
  ROUTER_ADDRESS,
  EGSWAP_SMART_ROUTER_ADDRESS,
  EGSWAP_SMART_ROUTER_ADDRESS_MAP
} from 'config/constants/exchange'

import { useActiveChainId } from 'hooks/useActiveChainId'
import { useContract } from 'hooks/useContract'
import { StableTrade } from 'views/Swap/StableSwap/hooks/useStableTradeExactIn'
import { Field } from '../state/swap/actions'
import { KyberSwapClass } from 'state/swap/hooks'
import invariant from 'tiny-invariant'
import {ZERO, ONE} from '@pancakeswap/swap-sdk-core'

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  try {
    return new Percent(JSBI.BigInt(num), BIPS_BASE)
  } catch (e) {
    console.log('Error when converting...', e)
    return new Percent(0)
  }
}

export function calculateSlippageAmount(value: CurrencyAmount<Currency>, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`)
  }
  return [
    JSBI.divide(JSBI.multiply(value.quotient, JSBI.BigInt(10000 - slippage)), BIPS_BASE),
    JSBI.divide(JSBI.multiply(value.quotient, JSBI.BigInt(10000 + slippage)), BIPS_BASE),
  ]
}

export function useRouterContract(externalSwap: boolean = false) {
  const { chainId } = useActiveChainId()
  let router_address = ROUTER_ADDRESS[chainId];
  if(externalSwap){
    router_address = EGSWAP_SMART_ROUTER_ADDRESS_MAP[chainId];
  }
  return useContract<IPancakeRouter02>(router_address, IPancakeRouter02ABI, true)
}

// computes price breakdown for the trade
export function computeTradePriceBreakdown(trade: Trade<Currency, Currency, TradeType> | KyberSwapClass<Currency, Currency, TradeType> | null): {
  priceImpactWithoutFee: Percent | undefined
  realizedLPFee: CurrencyAmount<Currency> | undefined | null
} {
  if (trade && "routerAddress" in trade) { //KyberSwap
    return { priceImpactWithoutFee: undefined, realizedLPFee: undefined }
  }
  // for each hop in our trade, take away the x*y=k price impact from 0.3% fees
  // e.g. for 3 tokens/2 hops: 1 - ((1 - .03) * (1-.03))
  const realizedLPFee = !trade
    ? undefined
    : ONE_HUNDRED_PERCENT.subtract(
        trade.route.pairs.reduce<Fraction>(
          (currentFee: Fraction): Fraction => currentFee.multiply(INPUT_FRACTION_AFTER_FEE),
          ONE_HUNDRED_PERCENT,
        ),
      )

  // remove lp fees from price impact
  const priceImpactWithoutFeeFraction = trade && realizedLPFee ? trade?.priceImpact.subtract(realizedLPFee) : undefined

  // the x*y=k impact
  const priceImpactWithoutFeePercent = priceImpactWithoutFeeFraction
    ? new Percent(priceImpactWithoutFeeFraction?.numerator, priceImpactWithoutFeeFraction?.denominator)
    : undefined

  // the amount of the input that accrues to LPs
  const realizedLPFeeAmount =
    realizedLPFee &&
    trade &&
    CurrencyAmount.fromRawAmount(
      trade.inputAmount.currency,
      realizedLPFee.multiply(trade.inputAmount.quotient).quotient,
    )

  return { priceImpactWithoutFee: priceImpactWithoutFeePercent, realizedLPFee: realizedLPFeeAmount }
}

// computes the minimum amount out and maximum amount in for a trade given a user specified allowed slippage in bips

export function computeSlippageAdjustedAmounts(
  trade: Trade<Currency, Currency, TradeType> | StableTrade | undefined,
  allowedSlippage: number,
): { [field in Field]?: CurrencyAmount<Currency> } {
  const pct = basisPointsToPercent(allowedSlippage)
  return {
    [Field.INPUT]: trade?.maximumAmountIn(pct),
    [Field.OUTPUT]: trade?.minimumAmountOut(pct),
  }
}


/**
 * Get the maximum amount in that can be spent via this trade for the given slippage tolerance
 * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
 */
export function maximumAmountInKyberSwap(trade: KyberSwapClass<Currency, Currency, TradeType>, slippageTolerance: Percent): CurrencyAmount < any > {
  invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')
  if(trade.tradeType === TradeType.EXACT_INPUT) {
  return trade.inputAmount
  }
  const slippageAdjustedAmountIn = new Fraction(ONE)
    .add(slippageTolerance)
    .multiply(trade.inputAmount.quotient).quotient
  return CurrencyAmount.fromRawAmount(trade.inputAmount.currency, slippageAdjustedAmountIn)
}

/**
 * Get the minimum amount that must be received from this trade for the given slippage tolerance
 * @param slippageTolerance tolerance of unfavorable slippage from the execution price of this trade
 */
export function minimumAmountOutKyberSwap(trade: KyberSwapClass<Currency, Currency, TradeType>, slippageTolerance: Percent): CurrencyAmount<any> {
  invariant(!slippageTolerance.lessThan(ZERO), 'SLIPPAGE_TOLERANCE')
  if (trade.tradeType === TradeType.EXACT_OUTPUT) {
    return trade.outputAmount
  }
  const slippageAdjustedAmountOut = new Fraction(ONE)
    .add(slippageTolerance)
    .invert()
    .multiply(trade.outputAmount.quotient).quotient
  return CurrencyAmount.fromRawAmount(trade.outputAmount.currency, slippageAdjustedAmountOut)
}

export function computeSlippageAdjustedAmountsKyberSwap(
  trade: KyberSwapClass<Currency, Currency, TradeType> | undefined,
  allowedSlippage: number,
): { [field in Field]?: CurrencyAmount<Currency> } {
  if (!trade) return;
  const pct = basisPointsToPercent(allowedSlippage)
  return {
    [Field.INPUT]: maximumAmountInKyberSwap(trade, pct),
    [Field.OUTPUT]: minimumAmountOutKyberSwap(trade, pct),
  }
}
export function warningSeverity(priceImpact: Percent | undefined): 0 | 1 | 2 | 3 | 4 {
  if (!priceImpact?.lessThan(BLOCKED_PRICE_IMPACT_NON_EXPERT)) return 4
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_HIGH)) return 3
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_MEDIUM)) return 2
  if (!priceImpact?.lessThan(ALLOWED_PRICE_IMPACT_LOW)) return 1
  return 0
}

export function formatExecutionPrice(
  trade?: Trade<Currency, Currency, TradeType> | StableTrade,
  inverted?: boolean,
): string {
  if (!trade) {
    return ''
  }
  return inverted
    ? `${trade.executionPrice.invert().toSignificant(6)} ${trade.inputAmount.currency.symbol} / ${trade.outputAmount.currency.symbol
    }`
    : `${trade.executionPrice.toSignificant(6)} ${trade.outputAmount.currency.symbol} / ${trade.inputAmount.currency.symbol
    }`
}
