import { useCallback } from 'react'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'
import { getFullDecimalMultiplier } from '@pancakeswap/utils/getFullDecimalMultiplier'
import { useMasterchefV1, useSousChef } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'
import { stakeFarm } from 'utils/calls'
import { useAccount } from 'wagmi'

const options = {
  gasLimit: DEFAULT_GAS_LIMIT,
}

const sousStake = async (sousChefContract: any, amount: any, gasPrice: string, decimals = 18) => {
  return sousChefContract.deposit(new BigNumber(amount).times(getFullDecimalMultiplier(decimals)).toString(), {
    ...options,
    gasPrice,
  })
}

const sousStakeBnb = async (sousChefContract, amount, gasPrice: string) => {
  return sousChefContract.deposit(new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString(), {
    ...options,
    gasPrice,
  })
}

const useStakePool = (sousId: number, isUsingBnb = false) => {
  const { address: account } = useAccount()

  const sousChefContract = useSousChef(sousId)
  const gasPrice = useGasPrice()
  const masterChefContract = useMasterchefV1()

  const handleStake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        const value = new BigNumber(amount).times(DEFAULT_TOKEN_DECIMAL).toString()
        return masterChefContract.enterStaking(value, {
          ...options,
          gasPrice,
        })
      } else if (isUsingBnb) {
        return sousStakeBnb(sousChefContract, amount, gasPrice)
      }
      return sousStake(sousChefContract, amount, gasPrice, decimals)
    },
    [isUsingBnb, sousChefContract, gasPrice],
  )

  return { onStake: handleStake }
}

export default useStakePool
