import { Flex, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useWithdrawalFeeTimer from 'views/Pools/hooks/useWithdrawalFeeTimer'
import { secondsToHours } from 'date-fns'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { secondsToDay } from 'utils/timeHelper'
import { VaultKey } from 'state/types'
import WithdrawalFeeTimer from './WithdrawalFeeTimer'

interface UnstakingFeeCountdownRowProps {
  isTableVariant?: boolean
  vaultKey: VaultKey
}

const UnstakingFeeCountdownRowNew: React.FC<React.PropsWithChildren<UnstakingFeeCountdownRowProps>> = ({
  isTableVariant,
  vaultKey,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const {
    userData: { lastDepositedTime, userShares },
    fees: { withdrawalFee, withdrawalFeePeriod },
  } = useVaultPoolByKey(vaultKey)

  const feeAsDecimal = withdrawalFee / 100 || '-'
  const withdrawalDayPeriod = withdrawalFeePeriod ? secondsToDay(withdrawalFeePeriod) : '-'
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text bold mb="4px">
        {t('Unstaking fee: 0.1%')}
      </Text>
      <Text>
        {t(
          'Only applies within 3 days of staking. Unstaking after 3 days will not include a fee. Timer resets every time you stake new EG in the pool.',
        )}
      </Text>
    </>,
    { placement: 'bottom-start' },
  )

  const { secondsRemaining, hasUnstakingFee } = useWithdrawalFeeTimer(
    parseInt(lastDepositedTime, 10),
    userShares,
    withdrawalFeePeriod,
  )

  // The user has made a deposit, but has no fee
  const noFeeToPay = lastDepositedTime && !hasUnstakingFee && userShares.gt(0)

  // Show the timer if a user is connected, has deposited, and has an unstaking fee
  const shouldShowTimer = account && lastDepositedTime && hasUnstakingFee

  const withdrawalFeePeriodHour = withdrawalFeePeriod ? secondsToHours(withdrawalFeePeriod) : '-'

  const getRowText = () => {
    if (noFeeToPay) {
      return t('Unstaking Fee')
    }
    if (shouldShowTimer) {
      return t('unstaking fee before')
    }
    return t('unstaking fee if withdrawn within 30 days')
  }

  return (
    <Flex
      alignItems={isTableVariant ? 'flex-start' : 'center'}
      justifyContent="space-between"
      flexDirection={isTableVariant ? 'column' : 'row'}
    >
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small textTransform="lowercase">
        {'5'}% {getRowText()}
      </TooltipText>
      {shouldShowTimer && <WithdrawalFeeTimer secondsRemaining={secondsRemaining} />}
    </Flex>
  )
}

export default UnstakingFeeCountdownRowNew
