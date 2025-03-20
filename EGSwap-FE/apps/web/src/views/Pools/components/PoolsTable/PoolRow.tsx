import { memo, useEffect, useMemo, useState } from 'react'
import { useMatchBreakpoints, Pool } from '@pancakeswap/uikit'
import { usePool, useDeserializedPoolByVaultKey, useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

import NameCell from './Cells/NameCell'
import EarningsCell from './Cells/EarningsCell'
import AprCell from './Cells/AprCell'
import TotalStakedCell from './Cells/TotalStakedCell'
import EndsInCell from './Cells/EndsInCell'
import ActionPanel from './ActionPanel/ActionPanel'
import AutoEarningsCell from './Cells/AutoEarningsCell'
import AutoAprCell from './Cells/AutoAprCell'
import StakedCell from './Cells/StakedCell'
import { getMasterchefV1Contract } from 'utils/contractHelpers'
import BigNumber from 'bignumber.js'
import { Token } from '@pancakeswap/sdk'

export const VaultPoolRow: React.FC<
  React.PropsWithChildren<{ vaultKey: VaultKey; account: string; initialActivity?: boolean }>
> = memo(({ vaultKey, account, initialActivity }) => {
  const { isLg, isXl, isXxl } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const isXLargerScreen = isXl || isXxl
  const pool = useDeserializedPoolByVaultKey(vaultKey)
  const { totalCakeInVault } = useVaultPoolByKey(vaultKey)

  const { stakingToken, totalStaked } = pool

  const totalStakedBalance = useMemo(() => {
    return getBalanceNumber(totalCakeInVault, stakingToken.decimals)
  }, [stakingToken.decimals, totalCakeInVault])

  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <NameCell pool={pool} />
      {isXLargerScreen && <AutoEarningsCell pool={pool} account={account} />}
      {isXLargerScreen ? <StakedCell pool={pool} account={account} /> : null}
      <AutoAprCell pool={pool} />
      {isLargerScreen && (
        <TotalStakedCell
          stakingToken={stakingToken}
          totalStaked={totalStaked}
          totalStakedBalance={totalStakedBalance}
        />
      )}
    </Pool.ExpandRow>
  )
})

const PoolRow: React.FC<
  React.PropsWithChildren<{ pool: Pool.DeserializedPool<Token>; account: string; initialActivity?: boolean }>
> = ({ pool, account, initialActivity }) => {
  const { isLg, isXl, isXxl, isDesktop } = useMatchBreakpoints()
  const isLargerScreen = isLg || isXl || isXxl
  const { pool: poolInfo } = usePool(pool.sousId)
  const { stakingToken, totalStaked } = pool
  const masterChefContract = getMasterchefV1Contract()

  const [_totalStaked, setTotalStaked] = useState(0)

  const totalStakedBalance = useMemo(() => {
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [stakingToken.decimals, totalStaked])

  useEffect(() => {
    if (stakingToken.address == '0x74AFe449D1BEFfc90456CfEbD700AB391abD7DAF' && pool.sousId === 0) {
      const getStakedAmount = async () => {
        let stakedAmount = await masterChefContract.totalStakeAmount()

        setTotalStaked(getBalanceNumber(new BigNumber(stakedAmount.toString()), stakingToken.decimals))
      }
      getStakedAmount()
    } else {
      setTotalStaked(totalStakedBalance)
    }
  }, [totalStakedBalance])

  return (
    <Pool.ExpandRow initialActivity={initialActivity} panel={<ActionPanel account={account} pool={pool} expanded />}>
      <NameCell pool={poolInfo} />
      <EarningsCell pool={poolInfo} account={account} />
      {isLargerScreen && (
        <TotalStakedCell
          stakingToken={stakingToken}
          totalStaked={new BigNumber(_totalStaked)}
          totalStakedBalance={_totalStaked}
        />
      )}
      <AprCell pool={poolInfo} />
      {isDesktop && <EndsInCell pool={poolInfo} />}
    </Pool.ExpandRow>
  )
}

export default memo(PoolRow)
