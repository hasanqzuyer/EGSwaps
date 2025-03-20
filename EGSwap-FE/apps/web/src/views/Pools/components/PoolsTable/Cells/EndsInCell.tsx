import styled from 'styled-components'
import { Flex, Link, Skeleton, Text, TimerIcon, Balance, Pool, useTooltip } from '@pancakeswap/uikit'
import { getBlockExploreLink } from 'utils'
import { useCurrentBlock } from 'state/block/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { getPoolBlockInfo } from 'views/Pools/helpers'
import { Token } from '@pancakeswap/sdk'

interface FinishCellProps {
  pool: Pool.DeserializedPool<Token>
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

interface EndTimeTooltipComponentProps {
  endTime: number
}

export const EndTimeTooltipComponent: React.FC<React.PropsWithChildren<EndTimeTooltipComponentProps>> = ({
  endTime,
}) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  return (
    <>
      <Text bold>{t('End Time')}:</Text>
      <Text>
        {new Date(endTime * 1000).toLocaleString(locale, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        })}
      </Text>
    </>
  )
}

const EndsInCell: React.FC<React.PropsWithChildren<FinishCellProps>> = ({ pool }) => {
  const { sousId, totalStaked, startBlock, endBlock, isFinished } = pool
  const currentBlock = useCurrentBlock()
  const { t } = useTranslation()

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock)

  const isCakePool = sousId === 0
  // const isCakePool = sousId === 0
  // aria

  const remainSeconds = blocksToDisplay * 3
  const remainDays = remainSeconds / 86400
  const timestamp = Date.now() / 1000 + remainSeconds

  const {
    targetRef: endTimeTargetRef,
    tooltip: endTimeTooltip,
    tooltipVisible: endTimeTooltipVisible,
  } = useTooltip(<EndTimeTooltipComponent endTime={timestamp} />, {
    placement: 'top',
  })

  const renderBlocks = shouldShowBlockCountdown ? (
    <Flex alignItems="center">
      <Balance fontSize="16px" value={remainDays} decimals={0} />
      <Text ml="4px" textTransform="lowercase">
        {remainDays < 1 ? t('Day') : t('Days')}
      </Text>
      <Link
        external
        href={getBlockExploreLink(hasPoolStarted ? endBlock : startBlock, 'countdown')}
        onClick={(e) => e.stopPropagation()}
      >
        <span ref={endTimeTargetRef}>
          <TimerIcon ml="4px" color="primary" />
          {endTimeTooltipVisible && endTimeTooltip}
        </span>
      </Link>
    </Flex>
  ) : (
    <Text></Text>
  )

  // A bit hacky way to determine if public data is loading relying on totalStaked
  // Opted to go for this since we don't really need a separate publicDataLoaded flag
  // anywhere else
  const isLoadingBlockData = !currentBlock || (!blocksRemaining && !blocksUntilStart)
  const isLoadingPublicData = hasPoolStarted ? !totalStaked.gt(0) || isLoadingBlockData : isLoadingBlockData
  const showLoading = isLoadingPublicData && !isCakePool && !isFinished
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {!isCakePool ? (hasPoolStarted || !shouldShowBlockCountdown ? t('Ends in') : t('Starts in')) : ''}
        </Text>
        {showLoading ? <Skeleton width="80px" height="16px" /> : renderBlocks}
      </Pool.CellContent>
    </StyledCell>
  )
}

export default EndsInCell
