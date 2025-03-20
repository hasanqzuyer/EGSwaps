import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall, { multicallv3 } from 'utils/multicall'
import { getMasterchefV1Contract } from 'utils/contractHelpers'
import { getAddress, getMulticallAddress } from 'utils/addressHelpers'
import BigNumber from 'bignumber.js'
import uniq from 'lodash/uniq'
import fromPairs from 'lodash/fromPairs'
import multiCallAbi from 'config/abi/Multicall.json'
import multiCallV3Abi from 'config/abi/MulticallV3.json'

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonBnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol !== 'BNB')
const bnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol === 'BNB')
// const nonMasterPools = poolsConfig.filter((pool) => pool.sousId !== -1)
const nonMasterPools = poolsConfig.filter((pool) => pool.sousId !== 0)
// aria

const multicallAddress = getMulticallAddress()
const masterChefContract = getMasterchefV1Contract()

export const fetchPoolsAllowance = async (account) => {
  const calls = nonBnbPools.map((pool) => ({
    address: pool.stakingToken.address,
    name: 'allowance',
    params: [account, getAddress(pool.contractAddress)],
  }))

  const allowances = await multicall(erc20ABI, calls)
  return fromPairs(nonBnbPools.map((pool, index) => [pool.sousId, new BigNumber(allowances[index]).toJSON()]))
}

export const fetchUserBalances = async (account) => {
  // Non BNB pools
  const tokens = uniq(nonBnbPools.map((pool) => pool.stakingToken.address))
  const tokenBalanceCalls = tokens.map((token) => ({
    abi: erc20ABI,
    address: token,
    name: 'balanceOf',
    params: [account],
  }))
  const bnbBalanceCall = {
    abi: multiCallV3Abi,
    address: multicallAddress,
    name: 'getEthBalance',
    params: [account],
  }
  const tokenBnbBalancesRaw = await multicallv3({ calls: [...tokenBalanceCalls, bnbBalanceCall] })
  const bnbBalance = tokenBnbBalancesRaw.pop()
  const tokenBalances = fromPairs(tokens.map((token, index) => [token, tokenBnbBalancesRaw[index]]))

  const poolTokenBalances = fromPairs(
    nonBnbPools
      .map((pool) => {
        if (!tokenBalances[pool.stakingToken.address]) return null
        return [pool.sousId, new BigNumber(tokenBalances[pool.stakingToken.address]).toJSON()]
      })
      .filter(Boolean),
  )

  // BNB pools
  const bnbBalanceJson = new BigNumber(bnbBalance.toString()).toJSON()
  const bnbBalances = fromPairs(bnbPools.map((pool) => [pool.sousId, bnbBalanceJson]))

  return { ...poolTokenBalances, ...bnbBalances }
}

export const fetchUserStakeBalances = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [account],
  }))
  const userInfo = await multicall(sousChefABI, calls)

  const stakedBalances = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(userInfo[index].amount._hex).toJSON(),
    }),
    {},
  )
  const { amount: masterPoolAmount } = await masterChefContract.userInfo('0', account)

  //aria
  return { ...stakedBalances, 0: new BigNumber(masterPoolAmount.toString()).toJSON() }
  // return fromPairs(
  //   nonMasterPools.map((pool, index) => [pool.sousId, new BigNumber(userInfo[index].amount._hex).toJSON()]),
  // )
}

export const fetchUserStakedTime = async (account) => {
  const { stakingTime: masterPoolStakingTime } = await masterChefContract.userInfo('0', account)
  return masterPoolStakingTime.toString()
}

export const fetchUserPendingRewards = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'pendingReward',
    params: [account],
  }))
  const res = await multicall(sousChefABI, calls)

  const pendingRewards = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  )

  // Cake / Cake pool
  const pendingReward = await masterChefContract.pendingEG('0', account)

  return { ...pendingRewards, 0: new BigNumber(pendingReward.toString()).toJSON() }
  // aria
  // return fromPairs(nonMasterPools.map((pool, index) => [pool.sousId, new BigNumber(res[index]).toJSON()]))
}
