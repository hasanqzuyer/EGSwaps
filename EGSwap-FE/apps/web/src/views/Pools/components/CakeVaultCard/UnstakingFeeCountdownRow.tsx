import { Flex, Text, TooltipText, useTooltip } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import useWithdrawalFeeTimer from 'views/Pools/hooks/useWithdrawalFeeTimer'
import { secondsToHours } from 'date-fns'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { secondsToDay } from 'utils/timeHelper'
import { VaultKey } from 'state/types'
import WithdrawalFeeTimer from './WithdrawalFeeTimer'
import { fetchUserStakedTime, fetchUserStakeBalances } from 'state/pools/fetchPoolsUser'
import { useEffect, useState } from 'react'

interface UnstakingFeeCountdownRowProps {
  isTableVariant?: boolean
  vaultKey: VaultKey
}

const UnstakingFeeCountdownRow: React.FC<React.PropsWithChildren<UnstakingFeeCountdownRowProps>> = ({
  isTableVariant,
  vaultKey,
}) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const {
    userData: { lastDepositedTime, userShares },
    fees: { withdrawalFee, withdrawalFeePeriod },
  } = useVaultPoolByKey(vaultKey)

  const feeAsDecimal = 5 // = withdrawalFee / 100 || '-'
  const withdrawalDayPeriod = 30 // = withdrawalFeePeriod ? secondsToDay(withdrawalFeePeriod) : '-'
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Text bold mb="4px">
        {t('Unstaking fee: %fee%%', { fee: feeAsDecimal })}
      </Text>
      <Text>
        {t(
          'Only applies within %num% days of staking. Unstaking after %num% days will not include a fee. Timer resets every time you stake new EG in the pool.',
          {
            num: withdrawalDayPeriod,
          },
        )}
      </Text>
    </>,
    { placement: 'bottom-start' },
  )
  const [stakingTime, setStakingTime] = useState<any>(0)
  const [stakedBalance, setStakedBalance] = useState<any>(0)
  useEffect(() => {
    if (!account) return
    fetchUserStakedTime(account)
      .then((data) => {
        setStakingTime(data)
      })
      .catch((err) => console.log(err))
    fetchUserStakeBalances(account)
      .then((data) => {
        setStakedBalance(data)
      })
      .catch((err) => console.log(err))
  }, [account, stakedBalance])

  const { secondsRemaining, hasUnstakingFee } = useWithdrawalFeeTimer(
    Number(stakingTime),
    userShares,
    withdrawalFeePeriod,
  )

  // The user has made a deposit, but has no fee
  const noFeeToPay = lastDepositedTime && !hasUnstakingFee && userShares.gt(0)

  // Show the timer if a user is connected, has deposited, and has an unstaking fee
  const shouldShowTimer = account && Number(stakedBalance[0]) > 0

  //aria// const withdrawalFeePeriodHour = withdrawalFeePeriod ? secondsToHours(withdrawalFeePeriod) : '-'
  const withdrawalFeePeriodHour = 30
  const getRowText = () => {
    if (noFeeToPay) {
      return t('Unstaking Fee')
    }
    if (shouldShowTimer) {
      return t('unstaking fee before')
    }
    return t('unstaking fee if withdrawn within %num% days', { num: withdrawalFeePeriodHour })
  }

  return (
    <Flex
      alignItems={isTableVariant ? 'flex-start' : 'center'}
      justifyContent="space-between"
      flexDirection={isTableVariant ? 'column' : 'row'}
    >
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small textTransform="lowercase">
        {noFeeToPay ? '0' : feeAsDecimal}% {getRowText()}
      </TooltipText>
      {shouldShowTimer && <WithdrawalFeeTimer secondsRemaining={secondsRemaining} />}
    </Flex>
  )
}

export default UnstakingFeeCountdownRow
