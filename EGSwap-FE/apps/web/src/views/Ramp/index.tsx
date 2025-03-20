import styled from 'styled-components'
import { RampForm, useRampWidget } from '@eg-ecosystem-internal/ramp'
import { Box, Flex } from '@pancakeswap/uikit'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { WalletModalV2 } from '@pancakeswap/ui-wallets'
import { useTranslation } from '@pancakeswap/localization'
import { createWallets } from 'config/wallet'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useActiveHandle } from 'hooks/useEagerConnect.bmp'
import useAuth from 'hooks/useAuth'
import { useEffect, useMemo, useState } from 'react'
import { useAccount, useConnect } from 'wagmi'
import useTheme from 'hooks/useTheme'
import { useTheme as styledUseTheme } from 'styled-components'

export const Container = styled.div`
  min-width: 600px;
  width: 30%;

  @media (max-width: 600px) {
    min-width: 50px;
    width: 100%;
  }

  .button-underline {
    ::after {
      background-image: linear-gradient(90deg, #64acff -10%, #75e1b4 33%, #68d9dd 66%, #64acff 110%);
    }
  }
  input {
    color: #22326e !important;
  }
`

export default function Ramp() {
  const { account } = useActiveWeb3React()
  const handleActive = useActiveHandle()
  const { login } = useAuth()
  const { open } = useRampWidget()
  const [openModal, setIsOpenModal] = useState<boolean>(false)
  const { connectAsync } = useConnect()
  const { chainId } = useActiveChainId()
  const {
    t,
    currentLanguage: { code },
  } = useTranslation()

  const wallets: any = useMemo(() => createWallets(chainId, connectAsync), [chainId, connectAsync])

  const handleClick = () => {
    if (typeof __NEZHA_BRIDGE__ !== 'undefined') {
      handleActive()
    } else {
      setIsOpenModal(true)
    }
  }

  const { theme, isDark } = useTheme()
  const themeStyled = styledUseTheme()
  return (
    <>
      <div>
        <div
          className="h-[656px] w-full flex justify-center items-center bg-[url(/images/home/new/EGRampHero.jpg)] md:pt-0 md:items-start"
          style={{ backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="max-w-[1254px] w-full flex flex-col md:px-4">
            <span
              className="text-[62px] font-bold"
              style={{
                backgroundImage: 'linear-gradient( 90deg, #2CF0D6 -10%, #75e1b4 33%, #68d9dd 66%, #22CE77 110% )',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitBackgroundClip: 'text',
              }}
            >
              EGRamp
            </span>
            <span className="text-[48px] font-bold mt-2 text-white md:text-[32px] max-w-2xl leading-tight">
              Buy/Sell Crypto With Credit & Debit Cards
            </span>

            <div className="flex flex-wrap gap-4 my-10 max-w-[670px] md:ml-auto md:mr-auto">
              <img className="h-11" src="/images/egramp/mastercard.png" alt="Algorand" />
              <img className="h-11" src="/images/egramp/visa.png" alt="Algorand" />
              <img className="h-11" src="/images/egramp/apple.png" alt="Algorand" />
              <img className="h-11" src="/images/egramp/googlepay.png" alt="Algorand" />
              <img className="h-11" src="/images/egramp/sepa.png" alt="Algorand" />
              <img className="h-11" src="/images/egramp/faster.png" alt="Algorand" />
              <img className="h-11" src="/images/egramp/ob.png" alt="Algorand" />
            </div>
          </div>
        </div>
      </div>
      <Box className="flex justify-center sm:py-20 py-24 dark:bg-[#050f2d] bg-[#faf9fa] px-8">
        <Flex width={['328px', '100%']} flexDirection="column" justifyContent="center" alignItems="center">
          <Container>
            <h1 className="font-title w-full text-indigo-rainbow text-2xl font-bold dark:text-white">EGRamp</h1>
            <p className="font-body text-indigo-rainbow text-lg dark:text-white">
              Buy EG with credit/debit card below OR{' '}
              <button
                type="button"
                className="button-underline text-gradient underline gradient-blue relative animate-pulse font-bold after:bg-gradient after:gradient-blue after:block after:h-1 after:w-full after:!h-[0.15rem]"
                onClick={() => {
                  open({
                    defaultToken: 'BNB',
                    allowedOperations: ['BUY', 'SELL'],
                    environment: 'production',
                  })
                }}
              >
                Buy/Sell any other crypto here
              </button>
              .
            </p>
          </Container>

          <Flex flexDirection="column" paddingTop={32}>
            <Container>
              <RampForm
                enviroment="production"
                apiUrl="https://swap-api.elongate.cc/api/v1"
                autoConnect={!!account}
                showWalletConnectButton={false}
                walletConnectConnector={{
                  projectId: 'd7cb900f9f8191646cae8820b135712c',
                }}
                connectWallet={handleClick}
                themeSelector={false}
              />
              <div className="mt-[15px] flex flex-row items-center justify-center sm:flex-col text-indigo-rainbow dark:text-white">
                <span className="mx-2 text-[12px] sm:mb-3">Before using EGRamp,</span>
                <a
                  href="https://docs.egswap.exchange/features/egramp/how-to-buy-using-fiat"
                  target="_blank"
                  className="cursor-pointer border-b border-solid pb-1 text-[12px] font-bold hover:scale-105"
                >
                  👀 Check the Tutorial
                </a>
              </div>
            </Container>
          </Flex>
          <WalletModalV2
            docText={t('Learn How to Connect')}
            docLink={''}
            isOpen={openModal}
            wallets={wallets}
            login={login}
            onLogin={() => setIsOpenModal(false)}
            onDismiss={() => setIsOpenModal(false)}
          />
        </Flex>
      </Box>
    </>
  )
}
