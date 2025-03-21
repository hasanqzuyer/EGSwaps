import styled from 'styled-components'

import { useAccount } from 'wagmi'
import { Heading, Flex, Text, Link, FlexLayout, PageHeader, Loading, Pool, ViewMode } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { usePoolsPageFetch, usePoolsWithVault } from 'state/pools/hooks'
import Page from 'components/Layout/Page'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Token } from '@pancakeswap/sdk'
import { TokenPairImage } from 'components/TokenImage'

import CardActions from './components/PoolCard/CardActions'
import AprRow from './components/PoolCard/AprRow'
import CardFooter from './components/PoolCard/CardFooter'
import CakeVaultCard from './components/CakeVaultCard'
import PoolControls from './components/PoolControls'
import PoolRow, { VaultPoolRow } from './components/PoolsTable/PoolRow'

import Image from 'next/image'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const FinishedTextContainer = styled(Flex)`
  padding-bottom: 32px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const FinishedTextLink = styled(Link)`
  font-weight: 400;
  white-space: nowrap;
  text-decoration: underline;
`

const Pools: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { pools, userDataLoaded } = usePoolsWithVault()

  usePoolsPageFetch()

  return (
    <>
      <PageHeader background="no-repeat center/cover url('/images/pools/EGSwap_Pools_BG.jpg')">
        <Flex justifyContent="space-between" alignItems="center" flexDirection={['column', null, null, 'row']}>
          <Flex
            flex="1"
            flexDirection="column"
            mr={['8px', 0]}
            height="250px"
            justifyContent="center"
            alignItems="center"
          >
            <Heading as="h1" scale="xxl" color="white" mb="24px">
              EGSwap Pools
            </Heading>
            <Heading scale="md" color="white">
              Stake Tokens, Earn Rewards
            </Heading>
            <Heading scale="md" color="white">
              {t('High APR, low risk.')}
            </Heading>
          </Flex>
          {/* <Flex maxWidth={['none', 371, null, 671]} maxHeight={['none', 189, null, 342]}>
            <Image src="/images/pools/pools-header-image.png" alt="" width={671} height={342} />
          </Flex> */}
        </Flex>
      </PageHeader>
      <Page>
        <PoolControls pools={pools}>
          {({ chosenPools, viewMode, stakedOnly, normalizedUrlSearch, showFinishedPools }) => (
            <>
              {/* {showFinishedPools && (
                <FinishedTextContainer>
                  <Text fontSize={['16px', null, '20px']} color="failure" pr="4px">
                    {t('Looking for v1 CAKE syrup pools?')}
                  </Text>
                  <FinishedTextLink href="/migration" fontSize={['16px', null, '20px']} color="failure">
                    {t('Go to migration page')}.
                  </FinishedTextLink>
                </FinishedTextContainer>
              )} */}
              {account && !userDataLoaded && stakedOnly && (
                <Flex justifyContent="center" mb="4px">
                  <Loading />
                </Flex>
              )}
              {viewMode === ViewMode.CARD ? (
                <CardLayout>
                  {chosenPools.map((pool) => (
                    // pool.vaultKey ? (
                    //   <CakeVaultCard key={pool.vaultKey} pool={pool} showStakedOnly={stakedOnly} />
                    // ) :
                    <Pool.PoolCard<Token>
                      key={pool.sousId}
                      pool={pool}
                      isStaked={Boolean(pool?.userData?.stakedBalance?.gt(0))}
                      cardContent={
                        account ? (
                          <CardActions pool={pool} stakedBalance={pool?.userData?.stakedBalance} />
                        ) : (
                          <>
                            <Text mb="10px" textTransform="uppercase" fontSize="12px" color="#009BCC" bold>
                              {t('Start earning')}
                            </Text>
                            <ConnectWalletButton style={{ width: '100%' }} />
                          </>
                        )
                      }
                      tokenPairImage={
                        <TokenPairImage
                          primaryToken={pool.earningToken}
                          secondaryToken={pool.stakingToken}
                          width={64}
                          height={64}
                        />
                      }
                      cardFooter={<CardFooter pool={pool} account={account} />}
                      aprRow={<AprRow pool={pool} stakedBalance={pool?.userData?.stakedBalance} />}
                    />
                  ))}
                </CardLayout>
              ) : (
                <Pool.PoolsTable>
                  {chosenPools.map((pool) => (
                    // pool.vaultKey ? (
                    //   <VaultPoolRow
                    //     initialActivity={normalizedUrlSearch.toLowerCase() === pool.earningToken.symbol?.toLowerCase()}
                    //     key={pool.vaultKey}
                    //     vaultKey={pool.vaultKey}
                    //     account={account}
                    //   />
                    // ) :
                    <PoolRow
                      initialActivity={normalizedUrlSearch.toLowerCase() === pool.earningToken.symbol?.toLowerCase()}
                      key={pool.sousId}
                      pool={pool}
                      account={account}
                    />
                  ))}
                </Pool.PoolsTable>
              )}
              {/* <Image
                mx="auto"
                mt="12px"
                src="/images/decorations/3d-syrup-bunnies.png"
                alt="Pancake illustration"
                width={192}
                height={184.5}
              /> */}
            </>
          )}
        </PoolControls>
      </Page>
    </>
  )
}

export default Pools
