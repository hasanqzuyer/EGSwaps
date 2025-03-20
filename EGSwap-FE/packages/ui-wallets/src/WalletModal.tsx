import { usePreloadImages } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { AtomBox } from '@pancakeswap/ui/components/AtomBox'
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Image,
  LinkExternal,
  ModalV2,
  ModalV2Props,
  ModalWrapper,
  MoreHorizontalIcon,
  SvgProps,
  Tab,
  TabMenu,
  Text,
  WarningIcon,
} from '@pancakeswap/uikit'
import { atom, useAtom } from 'jotai'
import { lazy, PropsWithChildren, Suspense, useMemo, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { StepIntro } from './components/Intro'
import {
  desktopWalletSelectionClass,
  modalWrapperClass,
  walletIconClass,
  promotedGradientClass,
  walletSelectWrapperClass,
} from './WalletModal.css'
import {IS_CONNECTED_WALLET} from '../../../apps/web/src/config/constants'

const Qrcode = lazy(() => import('./components/QRCode'))

type LinkOfTextAndLink = string | { text: string; url: string }

type DeviceLink = {
  desktop?: LinkOfTextAndLink
  mobile?: LinkOfTextAndLink
}

type LinkOfDevice = string | DeviceLink

export type WalletConfigV2<T = unknown> = {
  id: string
  title: string
  icon: string | React.FC<React.PropsWithChildren<SvgProps>>
  connectorId: T
  deepLink?: string
  installed?: boolean
  guide?: LinkOfDevice
  downloadLink?: LinkOfDevice
  mobileOnly?: boolean
  qrCode?: () => Promise<string>
}

interface WalletModalV2Props<T = unknown> extends ModalV2Props {
  wallets: WalletConfigV2<T>[]
  login: (connectorId: T) => Promise<any>
  docLink: string
  docText: string
  onDismiss: () => void
  onLogin?: () => void
}

export class WalletConnectorNotFoundError extends Error {}

export class WalletSwitchChainError extends Error {}

const errorAtom = atom<string>('')

const selectedWalletAtom = atom<WalletConfigV2<unknown> | null>(null)

export function useSelectedWallet<T>() {
  // @ts-ignore
  return useAtom<WalletConfigV2<T> | null>(selectedWalletAtom)
}

const TabContainer = ({ children, docLink, docText }: PropsWithChildren<{ docLink: string; docText: string }>) => {
  const [index, setIndex] = useState(0)
  const { t } = useTranslation()

  return (
    <AtomBox position="relative" zIndex="modal" className={modalWrapperClass}>
      <AtomBox position="absolute" style={{ top: '-50px' }}>
        <TabMenu activeIndex={index} onItemClick={setIndex} gap="0px" isColorInverse>
          <Tab>{t('Connect Wallet')}</Tab>
          <Tab>{t('What’s a Web3 Wallet?')}</Tab>
        </TabMenu>
      </AtomBox>
      <AtomBox
        display="flex"
        position="relative"
        background="gradientCardHeader"
        borderRadius="card"
        borderBottomRadius={{
          xs: '0',
          md: 'card',
        }}
        zIndex="modal"
        width="full"
      >
        {index === 0 && children}
        {index === 1 && <StepIntro docLink={docLink} docText={docText} />}
      </AtomBox>
    </AtomBox>
  )
}

const MOBILE_DEFAULT_DISPLAY_COUNT = 6

function MobileModal<T>({
  wallets,
  connectWallet,
  docLink,
  docText,
}: Pick<WalletModalV2Props<T>, 'wallets' | 'docLink' | 'docText'> & {
  connectWallet: (wallet: WalletConfigV2<T>) => void
}) {
  const { t } = useTranslation()

  const [selected] = useSelectedWallet()
  const [error] = useAtom(errorAtom)

  const installedWallets: WalletConfigV2<T>[] = wallets.filter((w) => w.installed)
  const walletsToShow: WalletConfigV2<T>[] = wallets.filter((w) => {
    if (installedWallets.length) {
      return w.installed
    }
    return w.installed !== false || w.deepLink
  })

  return (
    <AtomBox width="full">
      {error ? (
        <AtomBox
          display="flex"
          flexDirection="column"
          alignItems="center"
          style={{ gap: '24px' }}
          textAlign="center"
          p="24px"
        >
          {selected && typeof selected.icon === 'string' && <Image src={selected.icon} width={108} height={108} />}
          <div style={{ maxWidth: '246px' }}>
            <ErrorMessage message={error} />
          </div>
        </AtomBox>
      ) : (
        <Text color="textSubtle" small p="24px">
          {t(
            'Start by connecting with one of the wallets below. Be sure to store your private keys or seed phrase securely. Never share them with anyone.',
          )}
        </Text>
      )}
      <AtomBox flex={1} py="16px" style={{ maxHeight: '230px' }} overflow="auto">
        <WalletSelect
          displayCount={MOBILE_DEFAULT_DISPLAY_COUNT}
          wallets={walletsToShow}
          onClick={(wallet) => {
            connectWallet(wallet)
            if (wallet.deepLink && wallet.installed === false) {
              window.open(wallet.deepLink)
            }
          }}
        />
      </AtomBox>
      <AtomBox p="24px" borderTop="1">
        <AtomBox>
          <Text textAlign="center" color="textSubtle" as="p" mb="24px">
            {t('Haven’t got a crypto wallet yet?')}
          </Text>
        </AtomBox>
        <Button as="a" href={docLink} variant="subtle" width="100%" external>
          {docText}
        </Button>
      </AtomBox>
    </AtomBox>
  )
}

function WalletSelect<T>({
  wallets,
  onClick,
  displayCount = 6,
}: {
  wallets: WalletConfigV2<T>[]
  onClick: (wallet: WalletConfigV2<T>) => void
  displayCount?: number
}) {
  const { t } = useTranslation()
  const [showMore, setShowMore] = useState(false)
  const walletDisplayCount = wallets.length > displayCount ? displayCount - 1 : displayCount
  const walletsToShow = showMore ? wallets : wallets.slice(0, walletDisplayCount)
  const [selected] = useSelectedWallet()
  return (
    <AtomBox
      display="flex"
      flexDirection="column"
      // px={{ xs: '16px', sm: '48px' }}
      pb="12px"
      className={`${walletSelectWrapperClass} w-[90%] md:w-full`}
    >
      {walletsToShow.map((wallet) => {
        const isImage = typeof wallet.icon === 'string'
        const Icon = wallet.icon

        return (
          <div
            key={wallet.id}
            style={{ justifyContent: 'flex-start', letterSpacing: 'normal', padding: '16px 24px', gap: 16 }}
            className="flex items-center bg-[#edf6f5] rounded-[1.5rem] hover:bg-[#d0e4f0] cursor-pointer w-[100%]"
            onClick={() => onClick(wallet)}
            aria-hidden="true"
          >
            <AtomBox className={wallet.installed && promotedGradientClass} p="2px" borderRadius="12px" mb="4px">
              <AtomBox
                bgc="dropdown"
                display="flex"
                position="relative"
                justifyContent="center"
                alignItems="center"
                className={walletIconClass}
                style={{ borderRadius: '13px' }}
              >
                {isImage ? (
                  <Image src={Icon as string} width={50} height={50} />
                ) : (
                  <Icon width={24} height={24} color="textSubtle" />
                )}
                {wallet.id === selected?.id && (
                  <AtomBox position="absolute" inset="0" bgc="secondary" opacity="0.5" borderRadius="12px" />
                )}
              </AtomBox>
            </AtomBox>
            <Text fontSize="1.125rem" textAlign="center" color="#22326e">
              {wallet.title}
            </Text>
          </div>
        )
      })}
      {!showMore && wallets.length > walletDisplayCount && (
        <AtomBox display="flex" justifyContent="center" alignItems="center" flexDirection="column">
          <Button height="auto" variant="text" as={AtomBox} flexDirection="column" onClick={() => setShowMore(true)}>
            <AtomBox
              className={walletIconClass}
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgc="dropdown"
            >
              <MoreHorizontalIcon color="text" />
            </AtomBox>
            <Text fontSize="12px" textAlign="center" mt="4px">
              {t('More')}
            </Text>
          </Button>
        </AtomBox>
      )}
    </AtomBox>
  )
}

export const walletLocalStorageKey = 'wallet'

const lastUsedWalletNameAtom = atom<string>('')

lastUsedWalletNameAtom.onMount = (set) => {
  const preferred = localStorage?.getItem(walletLocalStorageKey)
  if (preferred) {
    set(preferred)
  }
}

function sortWallets<T>(wallets: WalletConfigV2<T>[], lastUsedWalletName: string | null) {
  const sorted = [...wallets].sort((a, b) => {
    if (a.installed === b.installed) return 0
    return a.installed === true ? -1 : 1
  })

  if (!lastUsedWalletName) {
    return sorted
  }
  const foundLastUsedWallet = wallets.find((w) => w.title === lastUsedWalletName)
  if (!foundLastUsedWallet) return sorted
  return [foundLastUsedWallet, ...sorted.filter((w) => w.id !== foundLastUsedWallet.id)]
}

function DesktopModal<T>({
  wallets: wallets_,
  connectWallet,
  docLink,
  docText,
  onDismiss,
}: Pick<WalletModalV2Props<T>, 'wallets' | 'docLink' | 'docText' | 'onDismiss'> & {
  connectWallet: (wallet: WalletConfigV2<T>) => void
}) {
  const wallets: WalletConfigV2<T>[] = wallets_
    .filter((w) => {
      return w.installed !== false || (!w.installed && (w.guide || w.downloadLink || w.qrCode))
    })
    .filter((w) => w.id === 'metamask' || w.id === 'binance' || w.id === 'walletconnect')
  const [selected] = useSelectedWallet<T>()
  const [error] = useAtom(errorAtom)
  const [qrCode, setQrCode] = useState<string | undefined>(undefined)
  const { t } = useTranslation()

  const connectToWallet = (wallet: WalletConfigV2<T>) => {
    connectWallet(wallet)
  }

  return (
    <>
      <AtomBox
        display="flex"
        flexDirection="column"
        bg="backgroundAlt"
        py="32px"
        zIndex="modal"
        borderRadius="card"
        // className={desktopWalletSelectionClass}
        className="w-[700px] md:w-full"
      >
        <AtomBox px="48px" style={{ marginBottom: 24 }}>
          <span
            className="text-[1.25rem] font-bold "
            style={{
              backgroundImage: 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitBackgroundClip: 'text',
            }}
          >
            Select your wallet
          </span>
        </AtomBox>
        <div className="flex flex-row gap-5">
          <div className="flex flex-1 justify-center md:hidden">
            <img src="/images/logo-egswap-light.png" />
          </div>
          <div className="flex flex-1 md:px-8">
            <WalletSelect
              wallets={wallets}
              onClick={(w) => {
                connectToWallet(w)
                setQrCode(undefined)
                if (w.qrCode) {
                  w.qrCode().then((uri) => {
                    setQrCode(uri)
                  })
                }
              }}
            />
          </div>
        </div>
      </AtomBox>
      {/* <AtomBox
        flex={1}
        mx="24px"
        display={{
          xs: 'none',
          sm: 'flex',
        }}
        justifyContent="center"
        flexDirection="column"
        alignItems="center"
      >
        <AtomBox display="flex" flexDirection="column" alignItems="center" style={{ gap: '24px' }} textAlign="center">
          {!selected && <Intro docLink={docLink} docText={docText} />}
          {selected && selected.installed !== false && (
            <>
              {typeof selected.icon === 'string' && <Image src={selected.icon} width={108} height={108} />}
              <Heading as="h1" fontSize="20px" color="secondary">
                {t('Opening')} {selected.title}
              </Heading>
              {error ? (
                <ErrorContent message={error} onRetry={() => connectToWallet(selected)} />
              ) : (
                <Text>{t('Please confirm in %wallet%', { wallet: selected.title })}</Text>
              )}
            </>
          )}
          {selected && selected.installed === false && <NotInstalled qrCode={qrCode} wallet={selected} />}
        </AtomBox>
      </AtomBox> */}
      <Flex className="bg-[#b9d9eb] rounded absolute top-5 right-5">
        <IconButton onClick={onDismiss} variant="text" scale="sm" className="hover:scale-105">
          <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 transition-transform group-hover:scale-110">
            <path
              d="m3 21 9-9m0 0 9 9m-9-9L3 3m9 9 9-9"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </IconButton>
      </Flex>
    </>
  )
}

export function WalletModalV2<T = unknown>(props: WalletModalV2Props<T>) {
  const { wallets: _wallets, login, docLink, docText, onLogin, ...rest } = props

  const [lastUsedWalletName] = useAtom(lastUsedWalletNameAtom)

  const wallets = useMemo(() => sortWallets(_wallets, lastUsedWalletName), [_wallets, lastUsedWalletName])
  const [, setSelected] = useSelectedWallet<T>()
  const [, setError] = useAtom(errorAtom)
  const { t } = useTranslation()

  const imageSources = useMemo(
    () =>
      wallets
        .map((w) => w.icon)
        .filter((icon) => typeof icon === 'string')
        .concat('https://cdn.pancakeswap.com/wallets/wallet_intro.png') as string[],
    [wallets],
  )

  usePreloadImages(imageSources.slice(0, MOBILE_DEFAULT_DISPLAY_COUNT))

  const connectWallet = (wallet: WalletConfigV2<T>) => {
    setSelected(wallet)
    setError('')
    if (wallet.installed !== false) {
      login(wallet.connectorId)
        .then((v) => {
          if (v) {
            localStorage.setItem(IS_CONNECTED_WALLET, "true");
            localStorage.setItem(walletLocalStorageKey, wallet.title)
            if (onLogin) {
              onLogin()
            }
          }
        })
        .catch((err) => {
          localStorage.setItem(IS_CONNECTED_WALLET, "false");
          if (err instanceof WalletConnectorNotFoundError) {
            setError(t('no provider found'))
          } else if (err instanceof WalletSwitchChainError) {
            setError(err.message)
          } else {
            setError(t('Error connecting, please authorize wallet to access.'))
          }
        })
    }
  }

  return (
    <ModalV2 closeOnOverlayClick {...rest}>
      <ModalWrapper onDismiss={props.onDismiss} style={{ overflow: 'visible', border: 'none' }}>
        <AtomBox position="relative">
          {/* <TabContainer docLink={docLink} docText={docText}>
            {isMobile ? (
              <MobileModal connectWallet={connectWallet} wallets={wallets} docLink={docLink} docText={docText} />
            ) : (
              <DesktopModal connectWallet={connectWallet} wallets={wallets} docLink={docLink} docText={docText} />
            )}
          </TabContainer> */}
          <DesktopModal
            connectWallet={connectWallet}
            wallets={wallets}
            docLink={docLink}
            docText={docText}
            onDismiss={props.onDismiss}
          />
        </AtomBox>
      </ModalWrapper>
    </ModalV2>
  )
}

const Intro = ({ docLink, docText }: { docLink: string; docText: string }) => {
  const { t } = useTranslation()
  return (
    <>
      <Heading as="h1" fontSize="20px" color="secondary">
        {t('Haven’t got a wallet yet?')}
      </Heading>
      <Image src="https://cdn.pancakeswap.com/wallets/wallet_intro.png" width={198} height={178} />
      <Button as={LinkExternal} color="backgroundAlt" variant="subtle" href={docLink}>
        {docText}
      </Button>
    </>
  )
}

const NotInstalled = ({ wallet, qrCode }: { wallet: WalletConfigV2; qrCode?: string }) => {
  const { t } = useTranslation()
  return (
    <>
      <Heading as="h1" fontSize="20px" color="secondary">
        {t('%wallet% is not installed', { wallet: wallet.title })}
      </Heading>
      {qrCode && (
        <Suspense>
          <AtomBox overflow="hidden" borderRadius="card" style={{ width: '288px', height: '288px' }}>
            <Qrcode url={qrCode} image={typeof wallet.icon === 'string' ? wallet.icon : undefined} />
          </AtomBox>
        </Suspense>
      )}
      {!qrCode && (
        <Text maxWidth="246px" m="auto">
          {t('Please install the %wallet% browser extension to connect the %wallet% wallet.', {
            wallet: wallet.title,
          })}
        </Text>
      )}
      {wallet.guide && (
        <Button variant="subtle" as="a" href={getDesktopLink(wallet.guide)} external>
          {getDesktopText(wallet.guide, t('Setup Guide'))}
        </Button>
      )}
      {wallet.downloadLink && (
        <Button variant="subtle" as="a" href={getDesktopLink(wallet.downloadLink)} external>
          {getDesktopText(wallet.downloadLink, t('Install'))}
        </Button>
      )}
    </>
  )
}

const ErrorMessage = ({ message }: { message: string }) => (
  <Text bold color="failure">
    <WarningIcon width="16px" color="failure" style={{ verticalAlign: 'middle' }} /> {message}
  </Text>
)

const ErrorContent = ({ onRetry, message }: { onRetry: () => void; message: string }) => {
  const { t } = useTranslation()
  return (
    <>
      <ErrorMessage message={message} />
      <Button variant="subtle" onClick={onRetry}>
        {t('Retry')}
      </Button>
    </>
  )
}

const getDesktopLink = (linkDevice: LinkOfDevice) =>
  typeof linkDevice === 'string'
    ? linkDevice
    : typeof linkDevice.desktop === 'string'
    ? linkDevice.desktop
    : linkDevice.desktop?.url

const getDesktopText = (linkDevice: LinkOfDevice, fallback: string) =>
  typeof linkDevice === 'string'
    ? fallback
    : typeof linkDevice.desktop === 'string'
    ? fallback
    : linkDevice.desktop?.text ?? fallback
