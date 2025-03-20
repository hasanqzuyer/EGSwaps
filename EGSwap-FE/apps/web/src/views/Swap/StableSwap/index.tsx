import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount, NATIVE, Percent } from '@pancakeswap/sdk'
import { useTheme } from '@pancakeswap/hooks'
import {
  ArrowDownIcon,
  AutoColumn,
  Badge,
  Box,
  Button,
  Checkbox,
  Flex,
  Message,
  MessageText,
  Skeleton,
  Swap as SwapUI,
  Text,
  useModal,
} from '@pancakeswap/uikit'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import { useIsTransactionUnsupported } from 'hooks/Trades'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import { useStableSwapByDefault } from 'state/user/smartRouter'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import AccessRisk from 'views/Swap/components/AccessRisk'

import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { AutoRow } from 'components/Layout/Row'
import { CommonBasesType } from 'components/SearchModal/types'
import { useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import useWrapCallback, { WrapType } from 'hooks/useWrapCallback'
import { useAtomValue } from 'jotai'
import { Field } from 'state/swap/actions'
import { useDerivedSwapInfo, useExternalSwapInfo, useSwapState } from 'state/swap/hooks'
import { useExpertModeManager, useUserSlippageTolerance } from 'state/user/hooks'
import { currencyId } from 'utils/currencyId'
import SettingsModal from '../../../components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from '../../../components/Menu/GlobalSettings/types'
import { combinedTokenMapFromOfficialsUrlsAtom } from '../../../state/lists/hooks'
import AddressInputPanel from '../components/AddressInputPanel'
import AdvancedSwapDetailsDropdown from '../components/AdvancedSwapDetailsDropdown'
import CurrencyInputHeader from '../components/CurrencyInputHeader'
import { ArrowWrapper, Wrapper } from '../components/styleds'
import SwapCommitButton from '../components/SwapCommitButton'
import useRefreshBlockNumberID from '../hooks/useRefreshBlockNumber'
import useWarningImport from '../hooks/useWarningImport'
import { MMAndAMMDealDisplay } from '../MMLinkPools/components/MMAndAMMDealDisplay'
import MMCommitButton from '../MMLinkPools/components/MMCommitButton'
import { MMSlippageTolerance } from '../MMLinkPools/components/MMSlippageTolerance'
import { MMLiquidityWarning } from '../MMLinkPools/components/MMLiquidityWarning'
import { parseMMError, shouldShowMMSpecificError, shouldShowMMLiquidityError } from '../MMLinkPools/utils/exchange'
import { SwapFeaturesContext } from '../SwapFeaturesContext'
import SmartSwapCommitButton from './components/SmartSwapCommitButton'
import { useDerivedSwapInfoWithStableSwap, useIsSmartRouterBetter, useTradeInfo } from './hooks'
import { MMError } from '../MMLinkPools/apis'
import { useDerivedSwapInfoWithMM } from '../MMLinkPools/hooks/useDerivedSwapInfoWithMM'
import { useDisconnect, useAccount } from 'wagmi';
import { useRouter } from 'next/router'
import { GoPlus, ErrorCode } from "@goplus/sdk-node";

export const SmartSwapForm: React.FC<{ handleOutputSelect: (newCurrencyOutput: Currency) => void }> = ({
  handleOutputSelect,
}) => {
  const { isAccessTokenSupported } = useContext(SwapFeaturesContext)
  const { t } = useTranslation()
  const { isDark, isBlue } = useTheme()
  const { refreshBlockNumber, isLoading } = useRefreshBlockNumberID()
  const warningSwapHandler = useWarningImport()
  const tokenMap = useAtomValue(combinedTokenMapFromOfficialsUrlsAtom)

  const { account, chainId } = useActiveWeb3React()

  // for expert mode
  const [isExpertMode] = useExpertModeManager()

  // get custom setting values for user
  const [allowedSlippage, setAllowedSlippage] = useState(100);
  const [allowUseSmartRouter, setAllowUseSmartRouter] = useState(false)

  // swap state & price data

  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()
  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.INPUT]: inputCurrency ?? undefined,
      [Field.OUTPUT]: outputCurrency ?? undefined,
    }),
    [inputCurrency, outputCurrency],
  )
  const [isStableSwapByDefault] = useStableSwapByDefault()

  const { v2Trade, inputError: swapInputError } = useDerivedSwapInfo(
    independentField,
    typedValue,
    inputCurrency,
    outputCurrency,
    recipient,
  )
  let useExternalSwap = true
  const { externalTrade, inputError: externalSwapInputError } = useExternalSwapInfo(
    independentField,
    typedValue,
    inputCurrency,
    outputCurrency,
    recipient,
  )

  const {
    trade: tradeWithStableSwap,
    currencyBalances,
    parsedAmount,
    inputError: stableSwapInputError,
  } = useDerivedSwapInfoWithStableSwap(independentField, typedValue, inputCurrency, outputCurrency)

  const { mmTradeInfo, mmOrderBookTrade, mmRFQTrade, mmQuoteExpiryRemainingSec, isMMBetter } = useDerivedSwapInfoWithMM(
    independentField,
    typedValue,
    inputCurrency,
    outputCurrency,
    v2Trade,
    tradeWithStableSwap,
  )

  const isSmartRouterBetter = useIsSmartRouterBetter({ trade: tradeWithStableSwap, v2Trade })
  const tradeInfo = useTradeInfo({
    trade: tradeWithStableSwap,
    v2Trade,
    externalTrade,
    useSmartRouter: (allowUseSmartRouter || isStableSwapByDefault) && isSmartRouterBetter,
    useExternalSwap,
    allowedSlippage,
    chainId,
    swapInputError,
    externalSwapInputError,
    stableSwapInputError,
  })

  const outputAddress: string = tradeInfo?.outputAmount?.currency["address"];
  const tokenOutputAddress = [outputAddress]; // output token address for goplus API

  // It will only return 1 result for the 1st token address if not called getAccessToken before
  useEffect(() => {
    const getSlippage = async () => {
      const res = await GoPlus.tokenSecurity(chainId.toString(), tokenOutputAddress, 30);
      if (res.code != ErrorCode.SUCCESS) {
        console.error("getting of token tax fee error--", res.message);
      } else {
        const goplusOutputAddress = outputAddress.toLowerCase(); // @goplus/sdk-node API provide address that has lowercase string
        if (res.result[goplusOutputAddress]) {
          const sell_tax = res.result[goplusOutputAddress]["sell_tax"];
          const buy_tax = res.result[goplusOutputAddress]["buy_tax"];
          const allowedSlippage_temp = 10000 * ((sell_tax > buy_tax) ? sell_tax : buy_tax) + 100; // tax fee % + 1%
          setAllowedSlippage(allowedSlippage_temp);
        }
      }
    }
    getSlippage();
  }, [tokenOutputAddress, allowedSlippage]);

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(currencies[Field.INPUT], currencies[Field.OUTPUT], typedValue)
  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]:
          independentField === Field.INPUT
            ? parsedAmount
            : isMMBetter
            ? mmTradeInfo.inputAmount
            : tradeInfo?.inputAmount,
        [Field.OUTPUT]:
          independentField === Field.OUTPUT
            ? parsedAmount
            : isMMBetter
            ? mmTradeInfo.outputAmount
            : tradeInfo?.outputAmount,
      }

  const { onSwitchTokens, onCurrencySelection, onUserInput, onChangeRecipient } = useSwapActionHandlers()

  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput],
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput],
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  const amountToApprove = isMMBetter
    ? mmTradeInfo?.slippageAdjustedAmounts[Field.INPUT]
    : tradeInfo?.slippageAdjustedAmounts[Field.INPUT]
  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallback(
    amountToApprove,
    isMMBetter ? mmTradeInfo?.routerAddress : tradeInfo?.routerAddress,
  )

  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // mark when a user has submitted an approval, reset onTokenSelection for input field
  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  const maxAmountInput: CurrencyAmount<Currency> | undefined = maxAmountSpend(currencyBalances[Field.INPUT])

  const handleInputSelect = useCallback(
    (newCurrencyInput) => {
      setApprovalSubmitted(false) // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, newCurrencyInput)

      warningSwapHandler(newCurrencyInput)

      const newCurrencyInputId = currencyId(newCurrencyInput)
      if (newCurrencyInputId === outputCurrencyId) {
        replaceBrowserHistory('outputCurrency', inputCurrencyId)
      }
      replaceBrowserHistory('inputCurrency', newCurrencyInputId)
    },
    [inputCurrencyId, outputCurrencyId, onCurrencySelection, warningSwapHandler],
  )

  const handleMaxInput = useCallback(() => {
    if (maxAmountInput) {
      onUserInput(Field.INPUT, maxAmountInput.toExact())
    }
  }, [maxAmountInput, onUserInput])

  const handlePercentInput = useCallback(
    (percent) => {
      if (maxAmountInput) {
        onUserInput(Field.INPUT, maxAmountInput.multiply(new Percent(percent, 100)).toExact())
      }
    },
    [maxAmountInput, onUserInput],
  )

  const swapIsUnsupported = useIsTransactionUnsupported(currencies?.INPUT, currencies?.OUTPUT)

  const hasAmount = Boolean(parsedAmount)

  const onRefreshPrice = useCallback(() => {
    if (hasAmount) {
      refreshBlockNumber()
    }
  }, [hasAmount, refreshBlockNumber])

  const smartRouterOn = !!tradeInfo && !tradeInfo.fallbackV2

  // Switch from exact out to exact in if smart router trade is better and user already allowed to use smart swap
  useEffect(() => {
    if (smartRouterOn && independentField === Field.OUTPUT && v2Trade) {
      onUserInput(Field.INPUT, v2Trade.inputAmount.toSignificant(6))
    }
  }, [smartRouterOn, independentField, onUserInput, v2Trade])

  useEffect(() => {
    // Reset approval submit state after switch between old router and new router
    setApprovalSubmitted(false)
  }, [smartRouterOn])

  const onUseSmartRouterChecked = useCallback(() => setAllowUseSmartRouter(!allowUseSmartRouter), [allowUseSmartRouter])

  const allowRecipient = isExpertMode && !showWrap && !smartRouterOn

  const [onPresentSettingsModal] = useModal(<SettingsModal mode={SettingsMode.SWAP_LIQUIDITY} />)
  const { disconnect } = useDisconnect();
  const router = useRouter();
  // console.log('tradeInfo', tradeInfo)
  return (
    <>
      {(router.pathname == "/embed-swap" && account) ?
        <Box pl="20px" pt="10px">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ paddingRight: "10px" }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-wallet" viewBox="0 0 16 16"> <path d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5V3zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a1.99 1.99 0 0 1-1-.268zM1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1z" /> </svg>
              </span>
              <span>{account.slice(0, 6)}...{account.slice(-6)}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span onClick={() => disconnect()} style={{ cursor: "pointer", paddingRight: "10px" }}>{t('Disconnect Wallet')} </span>
              <span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-power" viewBox="0 0 16 16"> <path d="M7.5 1v7h1V1h-1z" /> <path d="M3 8.812a4.999 4.999 0 0 1 2.578-4.375l-.485-.874A6 6 0 1 0 11 3.616l-.501.865A5 5 0 1 1 3 8.812z" /> </svg>
              </span>
            </div>
          </div>
        </Box>
        : <></>}
      <MMAndAMMDealDisplay
        independentField={independentField}
        isMMBetter={isMMBetter}
        tradeWithStableSwap={tradeWithStableSwap}
        v2Trade={v2Trade}
        mmTrade={mmTradeInfo?.trade || mmOrderBookTrade?.trade}
        mmQuoteExpiryRemainingSec={mmQuoteExpiryRemainingSec}
        errorMessage={
          mmRFQTrade?.error instanceof MMError
            ? mmRFQTrade?.error?.internalError
            : mmRFQTrade?.error?.message || mmOrderBookTrade?.inputError
        }
        rfqId={mmRFQTrade?.rfqId}
      />
      <CurrencyInputHeader
        title={router.pathname == "/embed-swap" ? 'Swap' : 'EGSwap'}
        subtitle={'Safely trade tokens in an instant'}
        hasAmount={hasAmount}
        onRefreshPrice={onRefreshPrice}
      />
      <Wrapper id="swap-page" style={{ minHeight: '412px' }}>
        <AutoColumn>
          <CurrencyInputPanel
            label={independentField === Field.OUTPUT && !showWrap && tradeInfo ? t('From (estimated)') : t('From')}
            value={formattedAmounts[Field.INPUT]}
            showMaxButton
            maxAmount={maxAmountInput}
            showQuickInputButton
            currency={currencies[Field.INPUT]}
            onUserInput={handleTypeInput}
            onPercentInput={handlePercentInput}
            onMax={handleMaxInput}
            onCurrencySelect={handleInputSelect}
            otherCurrency={currencies[Field.OUTPUT]}
            id="swap-currency-input"
            showCommonBases
            // showUSDPrice={!!tokenMap[chainId]?.[inputCurrencyId] || inputCurrencyId === NATIVE[chainId]?.symbol}
            showUSDPrice={true}
            commonBasesType={CommonBasesType.SWAP_LIMITORDER}
            externalSwap={tradeInfo?.externalSwap}
          />
          {/* {isAccessTokenSupported && inputCurrency?.isToken && (
            <Box>
              <AccessRisk token={inputCurrency} />
            </Box>
          )} */}

          <AutoColumn justify="space-between">
            <AutoRow justify={isExpertMode ? 'space-between' : 'center'} style={{ paddingBottom: '15px' }}>
              <SwapUI.SwitchButton
                onClick={() => {
                  setApprovalSubmitted(false) // reset 2 step UI for approvals
                  onSwitchTokens()
                  replaceBrowserHistory('inputCurrency', outputCurrencyId)
                  replaceBrowserHistory('outputCurrency', inputCurrencyId)
                }}
              />
              {allowRecipient && recipient === null ? (
                <Button variant="text" id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                  {t('+ Add a send (optional)')}
                </Button>
              ) : null}
            </AutoRow>
          </AutoColumn>
          <CurrencyInputPanel
            value={formattedAmounts[Field.OUTPUT]}
            onUserInput={handleTypeOutput}
            label={independentField === Field.INPUT && !showWrap && tradeInfo ? t('To (estimated)') : t('To')}
            showMaxButton={false}
            currency={currencies[Field.OUTPUT]}
            onCurrencySelect={handleOutputSelect}
            otherCurrency={currencies[Field.INPUT]}
            id="swap-currency-output"
            showCommonBases
            disabled={smartRouterOn}
            // showUSDPrice={!!tokenMap[chainId]?.[outputCurrencyId] || outputCurrencyId === NATIVE[chainId]?.symbol}
            showUSDPrice={true}
            commonBasesType={CommonBasesType.SWAP_LIMITORDER}
            externalSwap={tradeInfo?.externalSwap}
          />

          {/* {isAccessTokenSupported && outputCurrency?.isToken && (
            <Box>
              <AccessRisk token={outputCurrency} />
            </Box>
          )} */}

          {isSmartRouterBetter && !isStableSwapByDefault && (
            <AutoColumn>
              {allowUseSmartRouter && (
                <Message variant="warning" mb="8px">
                  <MessageText>{t('This route includes StableSwap and can’t edit output')}</MessageText>
                </Message>
              )}
              <Flex alignItems="center" onClick={onUseSmartRouterChecked}>
                <Checkbox
                  scale="sm"
                  name="allowUseSmartRouter"
                  type="checkbox"
                  checked={allowUseSmartRouter}
                  onChange={onUseSmartRouterChecked}
                />
                <Text ml="8px" style={{ userSelect: 'none' }}>
                  {t('Use StableSwap for better fees')}
                </Text>
              </Flex>
            </AutoColumn>
          )}

          {allowRecipient && recipient !== null ? (
            <>
              <AutoRow justify="space-between" style={{ padding: '0 1rem' }}>
                <ArrowWrapper clickable={false}>
                  <ArrowDownIcon width="16px" />
                </ArrowWrapper>
                <Button variant="text" id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                  {t('- Remove send')}
                </Button>
              </AutoRow>
              <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
            </>
          ) : null}

          {showWrap ? null : (
            <SwapUI.Info
              price={
                (Boolean(tradeInfo) || Boolean(mmTradeInfo)) && (
                  <div className="flex flex-col w-full gap-5">
                    <SwapUI.InfoLabel color={isDark || isBlue ? '#8c8c8c' : '#2f2f2f'}>{t('Price')}</SwapUI.InfoLabel>
                    {isLoading ? (
                      <Skeleton width="100%" ml="8px" height="24px" />
                    ) : (
                      <div className="flex flex-row w-full justify-between">
                        {tradeInfo?.externalSwap ? (
                          <Badge title="Smart Router" variants="type1" />
                        ) : (
                          <Badge title="EGSwap Router" variants="type2" />
                        )}
                        <SwapUI.TradePrice
                          price={isMMBetter ? mmTradeInfo?.executionPrice : tradeInfo?.executionPrice}
                        />
                      </div>
                    )}
                  </div>
                )
              }
              allowedSlippage={allowedSlippage}
              onSlippageClick={!isMMBetter ? onPresentSettingsModal : null}
              allowedSlippageSlot={
                isMMBetter || (!externalTrade && !v2Trade && !isExpertMode) ? <MMSlippageTolerance /> : undefined
              }
            />
          )}
        </AutoColumn>

        <Box mt="0.25rem">
          {!tradeWithStableSwap &&
          !v2Trade &&
          mmOrderBookTrade?.inputError &&
          shouldShowMMSpecificError(mmOrderBookTrade?.inputError) ? (
            <Button width="100%" disabled style={{ textAlign: 'left' }}>
              {parseMMError(mmOrderBookTrade?.inputError)}
            </Button>
          ) : isMMBetter ? (
            <MMCommitButton
              swapIsUnsupported={swapIsUnsupported}
              account={account}
              showWrap={showWrap}
              wrapInputError={wrapInputError}
              onWrap={onWrap}
              wrapType={wrapType}
              approval={approval}
              approveCallback={approveCallback}
              approvalSubmitted={approvalSubmitted}
              currencies={currencies}
              isExpertMode={isExpertMode}
              rfqTrade={mmRFQTrade}
              swapInputError={mmOrderBookTrade?.inputError || parseMMError(mmRFQTrade?.error?.message)}
              currencyBalances={mmOrderBookTrade.currencyBalances}
              recipient={recipient}
              onUserInput={onUserInput}
            />
          ) : tradeInfo?.externalSwap ? (
            <SwapCommitButton
              swapIsUnsupported={swapIsUnsupported}
              account={account}
              showWrap={showWrap}
              wrapInputError={wrapInputError}
              onWrap={onWrap}
              wrapType={wrapType}
              parsedIndepentFieldAmount={parsedAmounts[independentField]}
              approval={approval}
              approveCallback={approveCallback}
              approvalSubmitted={approvalSubmitted}
              currencies={currencies}
              isExpertMode={isExpertMode}
              trade={externalTrade}
              swapInputError={tradeInfo.inputError}
              currencyBalances={currencyBalances}
              recipient={recipient}
              allowedSlippage={allowedSlippage}
              onUserInput={onUserInput}
              externalSwap={true}
            />
          ) : tradeInfo?.fallbackV2 ? (
            <SwapCommitButton
              swapIsUnsupported={swapIsUnsupported}
              account={account}
              showWrap={showWrap}
              wrapInputError={wrapInputError}
              onWrap={onWrap}
              wrapType={wrapType}
              parsedIndepentFieldAmount={parsedAmounts[independentField]}
              approval={approval}
              approveCallback={approveCallback}
              approvalSubmitted={approvalSubmitted}
              currencies={currencies}
              isExpertMode={isExpertMode}
              trade={v2Trade}
              swapInputError={tradeInfo.inputError}
              currencyBalances={currencyBalances}
              recipient={recipient}
              allowedSlippage={allowedSlippage}
              onUserInput={onUserInput}
              externalSwap={false}
            />
          ) : (
            <SmartSwapCommitButton
              swapIsUnsupported={swapIsUnsupported}
              account={account}
              showWrap={showWrap}
              wrapInputError={wrapInputError}
              onWrap={onWrap}
              wrapType={wrapType}
              parsedIndepentFieldAmount={parsedAmounts[independentField]}
              approval={approval}
              approveCallback={approveCallback}
              approvalSubmitted={approvalSubmitted}
              currencies={currencies}
              isExpertMode={isExpertMode}
              trade={tradeWithStableSwap}
              swapInputError={swapInputError}
              currencyBalances={currencyBalances}
              recipient={recipient}
              allowedSlippage={allowedSlippage}
              onUserInput={onUserInput}
            />
          )}
        </Box>
        {router.pathname != "/embed-swap" ? (
          <></>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px 0',
          }}>
            <img src="/images/logo-egswap-light.png" style={{ height: '32px', marginRight: '4px' }} />
            <span style={{ marginRight: '4px' }}>Powered by EGSwap</span>
          </div>
        )}
      </Wrapper>
      {/* {!swapIsUnsupported ? (
        !showWrap && tradeInfo && !isMMBetter ? (
          <AdvancedSwapDetailsDropdown
            hasStablePair={smartRouterOn}
            pairs={tradeInfo.route.pairs}
            path={tradeInfo.route.path}
            priceImpactWithoutFee={tradeInfo.priceImpactWithoutFee}
            realizedLPFee={tradeInfo.realizedLPFee}
            slippageAdjustedAmounts={tradeInfo.slippageAdjustedAmounts}
            inputAmount={tradeInfo.inputAmount}
            outputAmount={tradeInfo.outputAmount}
            tradeType={tradeInfo.tradeType}
          />
        ) : (
          mmTradeInfo && (
            <AdvancedSwapDetailsDropdown
              isMM
              hasStablePair={false}
              pairs={mmTradeInfo.route.pairs}
              path={mmTradeInfo.route.path}
              priceImpactWithoutFee={mmTradeInfo.priceImpactWithoutFee}
              realizedLPFee={mmTradeInfo.realizedLPFee}
              slippageAdjustedAmounts={mmTradeInfo.slippageAdjustedAmounts}
              inputAmount={mmTradeInfo.inputAmount}
              outputAmount={mmTradeInfo.outputAmount}
              tradeType={mmTradeInfo.tradeType}
            />
          )
        )
      ) : (
        <UnsupportedCurrencyFooter currencies={[currencies.INPUT, currencies.OUTPUT]} />
      )} */}

      {(shouldShowMMLiquidityError(mmOrderBookTrade?.inputError) || mmRFQTrade?.error) &&
        !v2Trade &&
        !tradeWithStableSwap && (
          <Box mt="5px">
            <MMLiquidityWarning />
          </Box>
        )}
    </>
  )
}
