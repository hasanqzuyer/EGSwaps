import { Flex, Skeleton, Text, Balance, Pool, Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import useGetEGPrice from 'views/Pools/hooks/useGetEGPrice'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const TotalStakedCell: React.FC<React.PropsWithChildren<TotalStakedCellProps>> = ({
  stakingToken,
  totalStaked,
  totalStakedBalance,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { egPrice } = useGetEGPrice()
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="#009BCC" fontWeight="700" textAlign="left">
          {t('Total staked')}
        </Text>
        {totalStaked && totalStaked.gte(0) ? (
          <Flex height="32px" flexDirection="column">
            <Box mr="8px" height="32px">
              <Balance
                mt="4px"
                fontSize={isMobile ? '14px' : '16px'}
                bold={!isMobile}
                value={totalStakedBalance}
                decimals={0}
                unit={` ${stakingToken.symbol}`}
              />
              <Balance
                display="inline"
                fontSize="12px"
                color="#495B8D"
                decimals={2}
                prefix="~"
                value={egPrice * totalStakedBalance}
                unit=" USD"
              />
            </Box>
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </Pool.CellContent>
    </StyledCell>
  )
}

export default TotalStakedCell
