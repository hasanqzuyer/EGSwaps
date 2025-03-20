import { ModalProvider, light, dark, blue, UIKitProvider } from '@pancakeswap/uikit'
import { Provider } from 'react-redux'
import { SWRConfig } from 'swr'
import { LanguageProvider } from '@pancakeswap/localization'
import { fetchStatusMiddleware } from 'hooks/useSWRContract'
import { Store } from '@reduxjs/toolkit'
import { useTheme as useNextTheme } from 'next-themes'
import { WagmiProvider } from '@pancakeswap/wagmi'
import { client } from 'utils/wagmi'
import { HistoryManagerProvider } from 'contexts/HistoryContext'

const StyledUIKitProvider: React.FC<React.PropsWithChildren> = ({ children, ...props }) => {
  const { resolvedTheme } = useNextTheme()
  return (
    <UIKitProvider theme={resolvedTheme === 'dark' ? dark : resolvedTheme === 'blue' ? blue : light} {...props}>
      {children}
    </UIKitProvider>
  )
}

const Providers: React.FC<
  React.PropsWithChildren<{ store: Store & { componentName?: string }; children: React.ReactNode }>
> = ({ children, store }) => {
  return (
    <WagmiProvider client={client}>
      <Provider store={store}>
        <StyledUIKitProvider>
          <LanguageProvider>
            <SWRConfig
              value={{
                use: [fetchStatusMiddleware],
              }}
            >
              <HistoryManagerProvider>
                <ModalProvider>{children}</ModalProvider>
              </HistoryManagerProvider>
            </SWRConfig>
          </LanguageProvider>
        </StyledUIKitProvider>
      </Provider>
    </WagmiProvider>
  )
}

export default Providers
