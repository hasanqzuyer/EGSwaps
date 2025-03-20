import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

declare const FuturesSDK: any

const Container = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  margin-top: 54px;
`

const Apollo: React.FC<React.PropsWithChildren> = () => {
  const { origin, protocol } = window.location
  const isDev = protocol === 'http:'
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    const container = document.getElementById('apollox')
    if (!isLoaded) {
      setIsLoaded(true)
      FuturesSDK.createTradeUI({
        container,
        config: {
          brokerId: 109,
          staticBaseUrl: `/libs/static/`,
          futuresWsHost: 'wss://fstream.apollox.finance/plain',
          apiBaseUrl: isDev ? `${origin}` : undefined, // in production, you don't need to configurate this, it's default as APX's url
          headerConfig: {},
          lightPalette: {
            primaryHover: '#223266', // background hover
            primary: '#0d153d', // background; text hover,
            sellHover: '#80ccb5',
            sell: '#21995d',
            buy: '#0d153d',
            buyHover: '#223266',
            t: {
              primary: '#213266'
            }
          },
          darkPalette: {
            t: {
              primary: '#fff'
            }
          },
          defaultTheme: 'dark',
        },
        state: {
          symbol: 'BTCUSD',
          lng: 'en',
        },
      })
    }
  }, [isLoaded, setIsLoaded])

  return <Container id="apollox"></Container>
}

export default Apollo
