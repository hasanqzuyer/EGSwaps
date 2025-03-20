import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import {
  Box,
  Flex,
  InjectedModalProps,
  Link,
  Modal,
  ExpertModal,
  PancakeToggle,
  QuestionHelper,
  Text,
  ThemeSwitcher,
  Toggle,
} from '@pancakeswap/uikit'
import { SUPPORT_ZAP } from 'config/constants/supportChains'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useTheme from 'hooks/useTheme'
import { useCallback, useState } from 'react'
import { useSwapActionHandlers } from 'state/swap/useSwapActionHandlers'
import {
  useAudioModeManager,
  useExpertModeManager,
  useSubgraphHealthIndicatorManager,
  useUserExpertModeAcknowledgementShow,
  useUserSingleHopOnly,
  useUserUsernameVisibility,
  useZapModeManager,
} from 'state/user/hooks'
import { useUserTokenRisk } from 'state/user/hooks/useUserTokenRisk'
import { useStableSwapByDefault } from 'state/user/smartRouter'
import { useEGSmartRouterByDefault } from 'state/user/egSmartRouter'
import { useMMLinkedPoolByDefault } from 'state/user/mmLinkedPool'
import styled from 'styled-components'
import GasSettings from './GasSettings'
import TransactionSettings from './TransactionSettings'
import { SettingsMode } from './types'

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  height: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    max-height: 90vh;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    max-height: none;
  }
`
const GradientText = styled.span<{ font?: number; mx?: number; fw?: number; isBlue?: boolean }>`
  background-image: ${({ isBlue }) => isBlue ? "linear-gradient(180deg, #8B5FFF 0%, #7A33FF 100%)" : "linear-gradient(90deg, #2cf0d6 0%, #22ce77 100%)"};
  background-clip: text;
  color: transparent;
  -webkit-background-clip: text;
  font-size: ${({ font }) => font}px;
  margin: 0 ${({ mx }) => mx ?? 0}px;
  font-weight: ${({ fw }) => fw ?? 400};
  line-height: 1.2;
`

export const withCustomOnDismiss =
  (Component) =>
  ({
    onDismiss,
    customOnDismiss,
    mode,
    ...props
  }: {
    onDismiss?: () => void
    customOnDismiss: () => void
    mode: SettingsMode
  }) => {
    const handleDismiss = useCallback(() => {
      onDismiss?.()
      if (customOnDismiss) {
        customOnDismiss()
      }
    }, [customOnDismiss, onDismiss])

    return <Component {...props} mode={mode} onDismiss={handleDismiss} />
  }

const SettingsModal: React.FC<React.PropsWithChildren<InjectedModalProps>> = ({ onDismiss, mode }) => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgementShow()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const [audioPlay, toggleSetAudioMode] = useAudioModeManager()
  const [zapMode, toggleZapMode] = useZapModeManager()
  const [subgraphHealth, setSubgraphHealth] = useSubgraphHealthIndicatorManager()
  const [userUsernameVisibility, setUserUsernameVisibility] = useUserUsernameVisibility()
  const { onChangeRecipient } = useSwapActionHandlers()
  const { chainId } = useActiveChainId()
  const [isStableSwapByDefault, setIsStableSwapByDefault] = useStableSwapByDefault()
  const [isEgSmartRouterByDefault, setIsEgSmartRouterByDefault] = useEGSmartRouterByDefault()
  const [isMMLinkedPoolByDefault, setIsMMLinkedPoolByDefault] = useMMLinkedPoolByDefault()
  const [tokenRisk, setTokenRisk] = useUserTokenRisk()

  const { t } = useTranslation()
  const { isDark, isBlue, setTheme } = useTheme()

  const checkedStyle = {
    border: `1px solid ${isDark ? '#22CE77' : isBlue ? '#6630FF' : 'transparent'}`,
    background: isDark 
      ? '#2f2f2f' 
      : isBlue 
      ? 'linear-gradient(180deg, #6630FF 0%, #5900C9 100%)'
      : 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)',
  }
  
  const normalStyle = {
    border: `1px solid ${isDark ? '#2f2f2f' : isBlue ? '#6630FF' : 'transparent'}`,
    background: isDark 
      ? '#181818' 
      : isBlue 
      ? '#2f2f2f'
      : '#e1e1e1',
  }

  if (showConfirmExpertModal) {
    return (
      <ExpertModal
        setShowConfirmExpertModal={setShowConfirmExpertModal}
        onDismiss={onDismiss}
        toggleExpertMode={toggleExpertMode}
        setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
      />
    )
  }

  const handleExpertModeToggle = () => {
    if (expertMode || !showExpertModeAcknowledgement) {
      onChangeRecipient(null)
      toggleExpertMode()
    } else {
      setShowConfirmExpertModal(true)
    }
  }

  const headBgColor = isDark ? '#0F0F0F' : '#E1E1E1'

  return (
    <Modal title={t('Settings')} headerBackground={headBgColor} onDismiss={onDismiss}>
      <ScrollableContainer>
        {mode === SettingsMode.GLOBAL && (
          <>
            <Flex pb="24px" flexDirection="column">
              <Text bold textTransform="uppercase" fontSize="18px" color="secondary" mb="24px">
                {t('Global')}
              </Text>
              <Flex justifyContent="space-between" mb="24px">
                <Text>{t('Dark mode')}</Text>
                <ThemeSwitcher isDark={isDark} toggleTheme={() => setTheme(isDark ? 'light' : 'dark')} />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mb="24px">
                <Flex alignItems="center">
                  <Text>{t('Subgraph Health Indicator')}</Text>
                  <QuestionHelper
                    text={t(
                      'Turn on subgraph health indicator all the time. Default is to show the indicator only when the network is delayed',
                    )}
                    placement="top-start"
                    ml="4px"
                  />
                </Flex>
                <Toggle
                  id="toggle-subgraph-health-button"
                  checked={subgraphHealth}
                  scale="lg"
                  onChange={() => {
                    setSubgraphHealth(!subgraphHealth)
                  }}
                />
              </Flex>
              <Flex justifyContent="space-between" alignItems="center" mb="24px">
                <Flex alignItems="center">
                  <Text>{t('Show username')}</Text>
                  <QuestionHelper
                    text={t('Shows username of wallet instead of bunnies')}
                    placement="top-start"
                    ml="4px"
                  />
                </Flex>
                <Toggle
                  id="toggle-username-visibility"
                  checked={userUsernameVisibility}
                  scale="lg"
                  onChange={() => {
                    setUserUsernameVisibility(!userUsernameVisibility)
                  }}
                />
              </Flex>
              {chainId === ChainId.BSC && (
                <>
                  <Flex justifyContent="space-between" alignItems="center" mb="24px">
                    <Flex alignItems="center">
                      <Text>{t('Token Risk Scanning')}</Text>
                      <QuestionHelper
                        text={
                          <>
                            <Text>{t('Automatic risk scanning for the selected token')}</Text>
                            <Text as="span">{t('Risk scan results are provided by a third party')}</Text>
                            <Link style={{ display: 'inline' }} ml="4px" external href="https://www.avengerdao.org">
                              AvengerDAO
                            </Link>
                            <Text my="8px">
                              {t(
                                'It is a tool for indicative purposes only to allow users to check the reference risk level of a BNB Chain Smart Contract. Please do your own research - interactions with any BNB Chain Smart Contract is at your own risk.',
                              )}
                            </Text>
                          </>
                        }
                        placement="top-start"
                        ml="4px"
                      />
                    </Flex>
                    <Toggle
                      id="toggle-username-visibility"
                      checked={tokenRisk}
                      scale="lg"
                      onChange={() => {
                        setTokenRisk(!tokenRisk)
                      }}
                    />
                  </Flex>
                  <GasSettings />
                </>
              )}
            </Flex>
          </>
        )}
        {mode === SettingsMode.SWAP_LIQUIDITY && (
          <>
            <Flex pt="3px" flexDirection="column">
              <GradientText font={22} fw={700} isBlue={isBlue}>
                {t('Swaps & Liquidity')}
              </GradientText>
              <Flex justifyContent="space-between" alignItems="center" mb="24px">
                {chainId === ChainId.BSC && <GasSettings />}
              </Flex>
              <TransactionSettings />
            </Flex>
            {SUPPORT_ZAP.includes(chainId) && (
              <Flex justifyContent="space-between" alignItems="center" mb="24px">
                <Flex alignItems="center">
                  <Text style={{ color: isDark || isBlue ? 'white' : '#2f2f2f' }}>{t('Zap (Beta)')}</Text>
                  <QuestionHelper
                    text={
                      <Box>
                        <Text>
                          {t(
                            'Zap enables simple liquidity provision. Add liquidity with one token and one click, without manual swapping or token balancing.',
                          )}
                        </Text>
                        <Text>
                          {t(
                            'If you experience any issue when adding or removing liquidity, please disable Zap and retry.',
                          )}
                        </Text>
                      </Box>
                    }
                    placement="top-start"
                    ml="4px"
                  />
                </Flex>
                <Toggle
                  checked={zapMode}
                  scale="lg"
                  onChange={() => {
                    toggleZapMode(!zapMode)
                  }}
                  style={zapMode ? checkedStyle : normalStyle}
                />
              </Flex>
            )}
            <Flex justifyContent="space-between" alignItems="center" mb="24px">
              <Flex alignItems="center">
                <Text style={{ color: isDark || isBlue ? 'white' : '#2f2f2f' }}>{t('Expert Mode')}</Text>
                <QuestionHelper
                  text={t('Bypasses confirmation modals and allows high slippage trades. Use at your own risk.')}
                  placement="top-start"
                  ml="4px"
                />
              </Flex>
              <Toggle
                id="toggle-expert-mode-button"
                scale="lg"
                checked={expertMode}
                onChange={handleExpertModeToggle}
                style={expertMode ? checkedStyle : normalStyle}
              />
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mb="24px">
              <Flex alignItems="center">
                <Text style={{ color: isDark || isBlue ? 'white' : '#2f2f2f' }}>{t('Disable Multihops')}</Text>
                <QuestionHelper text={t('Restricts swaps to direct pairs only.')} placement="top-start" ml="4px" />
              </Flex>
              <Toggle
                id="toggle-disable-multihop-button"
                checked={singleHopOnly}
                scale="lg"
                onChange={() => {
                  setSingleHopOnly(!singleHopOnly)
                }}
                style={singleHopOnly ? checkedStyle : normalStyle}
              />
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mb="24px">
              <Flex alignItems="center">
                <Text style={{ color: isDark || isBlue ? 'white' : '#2f2f2f' }}>{t('Swap sounds')}</Text>
                <QuestionHelper
                  text={t('Fun sounds to make a truly immersive trading experience')}
                  placement="top-start"
                  ml="4px"
                />
              </Flex>
              <Toggle
                checked={audioPlay}
                onChange={toggleSetAudioMode}
                scale="lg"
                style={audioPlay ? checkedStyle : normalStyle}
              />
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mb="24px">
              <Flex alignItems="center">
                <Text style={{ color: isDark || isBlue ? 'white' : '#2f2f2f' }}>{t('MM Linked Pool')}</Text>
                <QuestionHelper
                  text={t('Trade through the market makers if they provide better deal')}
                  placement="top-start"
                  ml="4px"
                />
              </Flex>
              <Toggle
                id="toggle-disable-mm-button"
                checked={isMMLinkedPoolByDefault}
                onChange={(e) => setIsMMLinkedPoolByDefault(e.target.checked)}
                scale="lg"
                style={isMMLinkedPoolByDefault ? checkedStyle : normalStyle}
              />
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mb="24px">
              <Flex alignItems="center">
                <Text style={{ color: isDark || isBlue ? 'white' : '#2f2f2f' }}>{t('Use StableSwap by default')}</Text>
                <QuestionHelper
                  text={
                    <Flex>
                      <Text mr="5px">
                        {t(
                          'Stableswap will enable users to save fees on trades. Output cannot be edited for routes that include StableSwap',
                        )}
                      </Text>
                    </Flex>
                  }
                  placement="top-start"
                  ml="4px"
                />
              </Flex>
              <Toggle
                id="toggle-disable-smartRouter-button"
                checked={isStableSwapByDefault}
                onChange={(e) => setIsStableSwapByDefault(e.target.checked)}
                scale="lg"
                style={isStableSwapByDefault ? checkedStyle : normalStyle}
              />
            </Flex>
            <Flex justifyContent="space-between" alignItems="center" mb="24px">
              <Flex alignItems="center">
                <Text style={{ color: isDark || isBlue ? 'white' : '#2f2f2f' }}>{t('Use EGSmartRouter')}</Text>
                <QuestionHelper
                  text={
                    <Flex>
                      <Text mr="5px">
                        {t(
                          'Default is use Smart Router but if it is turned off, you can use use EGRouter.',
                        )}
                      </Text>
                    </Flex>
                  }
                  placement="top-start"
                  ml="4px"
                />
              </Flex>
              <Toggle
                id="toggle-disable-smartRouter-button"
                checked={isEgSmartRouterByDefault}
                onChange={(e) => setIsEgSmartRouterByDefault(e.target.checked)}
                scale="lg"
                style={isEgSmartRouterByDefault ? checkedStyle : normalStyle}
              />
            </Flex>
          </>
        )}
      </ScrollableContainer>
    </Modal>
  )
}

export default SettingsModal
