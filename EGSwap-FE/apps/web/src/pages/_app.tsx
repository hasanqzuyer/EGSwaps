import '@pancakeswap/ui/css/reset.css'

import 'tailwindcss/tailwind.css'

import { ResetCSS, ScrollToTopButtonV2, ToastListener } from '@pancakeswap/uikit'
import { ThemeProvider as NextThemeProvider, useTheme as useNextTheme } from 'next-themes'
import BigNumber from 'bignumber.js'
import GlobalCheckClaimStatus from 'components/GlobalCheckClaimStatus'
import { NetworkModal } from 'components/NetworkModal'
import { FixedSubgraphHealthIndicator } from 'components/SubgraphHealthIndicator/FixedSubgraphHealthIndicator'
import TransactionsDetailModal from 'components/TransactionDetailModal'
import { useAccountEventListener } from 'hooks/useAccountEventListener'
import useEagerConnect from 'hooks/useEagerConnect'
import useEagerConnectMP from 'hooks/useEagerConnect.bmp'
import useLockedEndNotification from 'hooks/useLockedEndNotification'
import useSentryUser from 'hooks/useSentryUser'
import useThemeCookie from 'hooks/useThemeCookie'
import useUserAgent from 'hooks/useUserAgent'
import { NextPage } from 'next'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import Script from 'next/script'
import { Fragment } from 'react'
import { DefaultSeo } from 'next-seo'
import { PageMeta } from 'components/Layout/Page'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, useStore } from 'state'
import { usePollBlockNumber } from 'state/block/hooks'
import { Blocklist, Updaters } from '..'
import { SEO } from '../../next-seo.config'
import { SentryErrorBoundary } from '../components/ErrorBoundary'
import Menu from '../components/Menu'
import Providers from '../Providers'
import GlobalStyle from '../style/Global'
import { PriceScrollBar } from 'components/PriceScrollBar'
import useSignMessageOnConnect from 'hooks/useSignMessageOnConnect'
import { useRouter } from 'next/router'

const EasterEgg = dynamic(() => import('components/EasterEgg'), { ssr: false })

const isApolloPage = () => {
  return window.location.href.includes('perp')
}

// This config is required for number formatting
BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

function GlobalHooks() {
  usePollBlockNumber()
  useEagerConnect()
  useUserAgent()
  useAccountEventListener()
  useSentryUser()
  useThemeCookie()
  useLockedEndNotification()
  useSignMessageOnConnect()
  return null
}

function MPGlobalHooks() {
  usePollBlockNumber()
  useEagerConnectMP()
  useUserAgent()
  useAccountEventListener()
  useSentryUser()
  useLockedEndNotification()
  useSignMessageOnConnect()
  return null
}

const FORCED_THEME_PAGES = { egspectre: 'light', egspectreOrders: 'light', egramp: 'dark' }

function MyApp(props: AppProps<{ initialReduxState: any }>) {
  const { pageProps, Component } = props
  const store = useStore(pageProps.initialReduxState)
  const componentName = Component.displayName || Component.name || 'Unknown'

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, minimum-scale=1, viewport-fit=cover"
        />
        <meta
          name="description"
          content="Cheaper and faster than Uniswap? Discover PancakeSwap, the leading DEX on BNB Smart Chain (BSC) with the best farms in DeFi and a lottery for CAKE."
        />
        <meta name="theme-color" content="#1490ef" />
        {(Component as NextPageWithLayout).mp && (
          // eslint-disable-next-line @next/next/no-sync-scripts
          <script src="https://public.bnbstatic.com/static/js/mp-webview-sdk/webview-v1.0.0.min.js" id="mp-webview" />
        )}
        {/* <!-- Google tag (gtag.js) --> */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5177TQT1P0"></script>
        <script src="https://cryptorank.io/widget/marquee.js"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-5177TQT1P0');
          `}
        </script>
        {/* <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=G-5177TQT1P0`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5177TQT1P0', {
              page_path: window.location.pathname,
            });
          `,
          }}
        /> */}
      </Head>
      <DefaultSeo {...SEO} />
      <meta key="twitter:image" name="twitter:image" content="https://egswap.exchange/egswap-logo.jpg" />
      <NextThemeProvider storageKey="egswap.theme" forcedTheme={FORCED_THEME_PAGES[componentName] || null}>
        <Providers store={store}>
          <PageMeta />
          {(Component as NextPageWithLayout).Meta && (
            // @ts-ignore
            <Component.Meta {...pageProps} />
          )}
          <Blocklist>
            {(Component as NextPageWithLayout).mp ? <MPGlobalHooks /> : <GlobalHooks />}
            <ResetCSS />
            <GlobalStyle />
            <GlobalCheckClaimStatus excludeLocations={[]} />
            <PersistGate loading={null} persistor={persistor}>
              <Updaters />
              <App {...props} />
            </PersistGate>
          </Blocklist>
        </Providers>
      </NextThemeProvider>
    </>
  )
}

type NextPageWithLayout = NextPage & {
  Layout?: React.FC<React.PropsWithChildren<unknown>>
  /** render component without all layouts */
  pure?: true
  /** is mini program */
  mp?: boolean
  /**
   * allow chain per page, empty array bypass chain block modal
   * @default [ChainId.BSC]
   * */
  chains?: number[]
  isShowScrollToTopButton?: true
  /**
   * Meta component for page, hacky solution for static build page to avoid `PersistGate` which blocks the page from rendering
   */
  Meta?: React.FC<React.PropsWithChildren<unknown>>
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const ProductionErrorBoundary = process.env.NODE_ENV === 'production' ? SentryErrorBoundary : Fragment

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  if (Component.pure) {
    return <Component {...pageProps} />
  }

  const router = useRouter()

  // Use the layout defined at the page level, if available
  const Layout = Component.Layout || Fragment
  const ShowMenu = Component.mp ? Fragment : Menu
  const isShowScrollToTopButton = Component.isShowScrollToTopButton || true
  const pageInIframe = window.location !== window.parent.location

  return (
    <ProductionErrorBoundary>
      {pageInIframe ? (
        <>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </>
      ) : (
        <>
          <ShowMenu>
            {!isApolloPage() && router.pathname !== '/embed-swap' ? <PriceScrollBar /> : <></>}
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ShowMenu>
        </>
      )}

      <EasterEgg iterations={2} />
      <ToastListener />
      <FixedSubgraphHealthIndicator />
      <NetworkModal pageSupportedChains={Component.chains} />
      <TransactionsDetailModal />
      {isShowScrollToTopButton && <ScrollToTopButtonV2 />}
    </ProductionErrorBoundary>
  )
}

export default MyApp
