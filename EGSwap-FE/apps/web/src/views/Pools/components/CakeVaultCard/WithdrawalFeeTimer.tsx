import { Text } from '@pancakeswap/uikit'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { useTranslation } from '@pancakeswap/localization'

const WithdrawalFeeTimer: React.FC<React.PropsWithChildren<{ secondsRemaining: number }>> = ({ secondsRemaining }) => {
  const { t } = useTranslation()
  const { days, hours, minutes } = getTimePeriods(secondsRemaining)

  const showDays = secondsRemaining > 0 ? days : 0
  const showHours = secondsRemaining > 0 ? hours : 0
  const showMinutes = secondsRemaining > 0 ? minutes : 0

  return (
    <Text bold fontSize="14px">
      {t('%day%d:%hour%h:%minute%m', { day: showDays, hour: showHours, minute: showMinutes })}
    </Text>
  )
}

export default WithdrawalFeeTimer
