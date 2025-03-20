import { useEffect, useMemo, useState } from 'react'
import { Currency, Pair, Token, Percent, CurrencyAmount } from '@pancakeswap/sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex, Box, NumericalInput, CopyButton } from '@pancakeswap/uikit'
import styled, { css } from 'styled-components'
import { isAddress } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'

import { useBUSDCurrencyAmount } from 'hooks/useBUSDPrice'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { StablePair } from 'views/AddLiquidity/AddStableLiquidity/hooks/useStableLPDerivedMintInfo'

import { useAccount } from 'wagmi'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'

import AddToWalletButton from '../AddToWallet/AddToWalletButton'
import { useTheme } from '@pancakeswap/hooks'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: flex-end;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text', scale: 'sm' })<{ zapStyle?: ZapStyle }>`
  padding: 0 0.5rem;
  ${({ zapStyle, theme }) =>
    zapStyle &&
    css`
      padding: 8px;
      background: ${theme.colors.background};
      border: 1px solid ${theme.colors.cardBorder};
      border-radius: ${zapStyle === 'zap' ? '0px' : '8px'} 8px 0px 0px;
      height: auto;
    `};
`
const LabelRow = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
`
const InputPanel = styled.div`
  display: flex;
  flex-flow: column nowrap;
  position: relative;
  // background-color: ${({ theme }) => theme.colors.backgroundAlt};
  background-color: transparent;
  z-index: 1;
`
const Container = styled.div<{ zapStyle?: ZapStyle; error?: boolean }>`
  border-radius: 14px;
  background-color: ${({ theme }) => theme.colors.input};
  box-shadow: ${({ theme, error }) => theme.shadows[error ? 'warning' : 'inset']};
  ${({ zapStyle }) =>
    !!zapStyle &&
    css`
      border-radius: 0px 16px 16px 16px;
    `};
`

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  opacity: 0.6;
  background-color: ${({ theme }) => theme.colors.backgroundAlt};
`

type ZapStyle = 'noZap' | 'zap'

interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onInputBlur?: () => void
  onPercentInput?: (percent: number) => void
  onMax?: () => void
  showQuickInputButton?: boolean
  showMaxButton: boolean
  maxAmount?: CurrencyAmount<Currency>
  lpPercent?: string
  label?: string
  onCurrencySelect?: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | StablePair | null
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  commonBasesType?: string
  showSearchInput?: boolean
  zapStyle?: ZapStyle
  beforeButton?: React.ReactNode
  disabled?: boolean
  error?: boolean
  showUSDPrice?: boolean
  tokensToShow?: Token[]
  externalSwap?: boolean
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onInputBlur,
  onPercentInput,
  onMax,
  showQuickInputButton = false,
  showMaxButton,
  maxAmount,
  lpPercent,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  zapStyle,
  beforeButton,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
  commonBasesType,
  showSearchInput,
  disabled,
  error,
  showUSDPrice,
  tokensToShow,
  externalSwap = false,
}: CurrencyInputPanelProps) {
  const { address: account } = useAccount()
  let selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { t } = useTranslation()

  const token = pair ? pair.liquidityToken : currency?.isToken ? currency : null
  const tokenAddress = token ? isAddress(token.address) : null
  const theme = useTheme()
  const { isBlue } = useTheme()

  const amountInDollar = useBUSDCurrencyAmount(
    showUSDPrice ? currency : undefined,
    Number.isFinite(+value) ? +value : undefined,
    externalSwap,
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
      commonBasesType={commonBasesType}
      showSearchInput={showSearchInput}
      tokensToShow={tokensToShow}
    />,
  )

  const percentAmount = useMemo(
    () => ({
      25: maxAmount ? maxAmount.multiply(new Percent(25, 100)).toExact() : undefined,
      50: maxAmount ? maxAmount.multiply(new Percent(50, 100)).toExact() : undefined,
      75: maxAmount ? maxAmount.multiply(new Percent(75, 100)).toExact() : undefined,
    }),
    [maxAmount],
  )

  const [currentClickedPercent, setCurrentClickedPercent] = useState('')

  const isAtPercentMax = (maxAmount && value === maxAmount.toExact()) || (lpPercent && lpPercent === '100')

  return (
    <Box position="relative" id={id}>
      <InputPanel>
        <Container as="label" zapStyle={zapStyle} error={error}>
          <Flex alignItems="center" justifyContent="space-between" className="px-4 pt-2">
            <span className={`text-[0.75rem] text-[${theme.isDark || theme.isBlue ? '#ffffff' : '#2f2f2f'}]`}>{label}</span>
            {account && (
              <Text
                onClick={!disabled && onMax}
                color="textSubtle"
                fontSize="12px"
                style={{ display: 'inline', cursor: 'pointer', color: theme.isDark || theme.isBlue ? '#ffffff' : '#2f2f2f' }}
              >
                {!hideBalance && !!currency
                  ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                  : ' -'}
              </Text>
            )}
          </Flex>
          <LabelRow>
            <Flex>
              {beforeButton}
              <CurrencySelectButton
                zapStyle={zapStyle}
                className="open-currency-select-button"
                selected={!!currency}
                onClick={() => {
                  if (!disableCurrencySelect) {
                    onPresentCurrencyModal()
                  }
                }}
              >
                <Flex alignItems="center" justifyContent="space-between">
                  {pair ? (
                    <DoubleCurrencyLogo currency0={pair.token0} currency1={pair.token1} size={16} margin />
                  ) : currency ? (
                    <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
                  ) : null}
                  {pair ? (
                    <Text id="pair" bold>
                      {pair?.token0.symbol}:{pair?.token1.symbol}
                    </Text>
                  ) : (
                    <Text id="pair" bold>
                      {(currency && currency.symbol && currency.symbol.length > 10
                        ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                            currency.symbol.length - 5,
                            currency.symbol.length,
                          )}`
                        : currency?.symbol) || t('Select a currency')}
                    </Text>
                  )}
                  {!disableCurrencySelect && <ChevronDownIcon />}
                </Flex>
              </CurrencySelectButton>
              {token && tokenAddress ? (
                <Flex style={{ gap: '4px' }} ml="4px" alignItems="center">
                  <CopyButton
                    width="16px"
                    buttonColor={isBlue ? '#6630FF' : 'newPrimary'}
                    text={tokenAddress}
                    tooltipMessage={t('Token address copied')}
                  />
                  <AddToWalletButton
                    variant="text"
                    p="0"
                    height="auto"
                    width="fit-content"
                    tokenAddress={tokenAddress}
                    tokenSymbol={token.symbol}
                    tokenDecimals={token.decimals}
                    tokenLogo={token instanceof WrappedTokenInfo ? token.logoURI : undefined}
                  />
                </Flex>
              ) : null}
            </Flex>
            <NumericalInput
              error={error}
              disabled={disabled}
              className="token-amount-input"
              id={`dark-theme-placeholder-${label}`}
              label={label}
              value={value}
              onBlur={onInputBlur}
              onUserInput={(val) => {
                onUserInput(val)
                setCurrentClickedPercent('')
              }}
            />
          </LabelRow>
          {!!currency && showUSDPrice && (
            <Flex justifyContent="flex-end" mr="1rem">
              <Flex maxWidth="200px">
                {Number.isFinite(amountInDollar) ? (
                  <span className={`${theme.isDark || theme.isBlue ? 'text-white' : 'text-[#2f2f2f]'} text-xs`}>
                    ~{formatNumber(amountInDollar)} USD
                  </span>
                ) : (
                  <Box height="18px" />
                )}
              </Flex>
            </Flex>
          )}
        </Container>
        <InputRow selected={disableCurrencySelect} style={{ padding: '15px 0' }}>
          {label === 'From' && (
            <Flex alignItems="right" justifyContent="space-between" width="100%">
              {[0, 25, 50, 75].map((percent) => {
                const isAtClickedPercent = currentClickedPercent === percent.toString()
                const isAtCurrentPercent =
                  (maxAmount && value !== '0' && value === percentAmount[percent]) ||
                  (lpPercent && lpPercent === percent.toString())

                return (
                  <div
                    key={`btn_quickCurrency${percent}`}
                    className={`max-w-[98px] w-full h-[27px] rounded-md flex items-center justify-center text-sm border border-solid ${
                      theme.isBlue ? 'border-[#6630FF]' : 'border-[#22CE77]'
                    } ${
                      isAtClickedPercent || isAtCurrentPercent ? 'text-[#fff]' : isBlue ? 'text-[#fff]' : 'text-[#24D489]'
                    } cursor-pointer md:mx-2 ${
                      isAtClickedPercent || isAtCurrentPercent
                        ? (isBlue ? 'bg-gradient-to-b from-[#6630FF] to-[#5900C9]' : 'bg-gradient-to-r from-[#2CF0D6] to-[#22CE77]')
                        : (theme.isDark || theme.isBlue)
                        ? 'bg-[#2f2f2f]'
                        : 'bg-[#ECECEC]'
                    }`}
                    onClick={() => {
                      onPercentInput(percent)
                      setCurrentClickedPercent(percent.toString())
                    }}
                    aria-hidden="true"
                  >
                    {percent}%
                  </div>
                )
                return (
                  <Button
                    key={`btn_quickCurrency${percent}`}
                    onClick={() => {
                      onPercentInput(percent)
                      setCurrentClickedPercent(percent.toString())
                    }}
                    scale="xs"
                    mr="5px"
                    variant={isAtClickedPercent || isAtCurrentPercent ? 'primary' : 'secondary'}
                    style={{ textTransform: 'uppercase' }}
                  >
                    {percent}%
                  </Button>
                )
              })}
              {showMaxButton && (
                <div
                  className={`max-w-[98px] w-full h-[27px] rounded-md flex items-center justify-center text-sm border border-solid ${
                    isBlue ? 'border-[#6630FF]' : 'border-[#22CE77]'
                  } ${
                    currentClickedPercent === 'MAX' ? 'text-[#fff]' : isBlue ? 'text-[#fff]' : 'text-[#24D489]'
                  } cursor-pointer md:mx-2 ${
                    currentClickedPercent === 'MAX'
                      ? (isBlue ? 'bg-gradient-to-b from-[#6630FF] to-[#5900C9]' : 'bg-gradient-to-r from-[#2CF0D6] to-[#22CE77]')
                      : (theme.isDark || theme.isBlue)
                      ? 'bg-[#2f2f2f]'
                      : 'bg-[#ECECEC]'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    onMax?.()
                    setCurrentClickedPercent('MAX')
                  }}
                  aria-hidden="true"
                >
                  {t('Max')}
                </div>
              )}
            </Flex>
          )}
        </InputRow>
        {disabled && <Overlay />}
      </InputPanel>
    </Box>
  )
}
