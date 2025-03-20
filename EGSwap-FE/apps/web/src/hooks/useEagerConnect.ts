import { useClient, useConnect } from 'wagmi'
import { useCallback, useEffect } from 'react'
import {IS_CONNECTED_WALLET} from 'config/constants'

const SAFE_ID = 'safe'

const useEagerConnect = () => {
  const client = useClient()
  const { connectAsync, connectors } = useConnect()

  const isApolloPage = useCallback(() => {
    return window.location.href.includes('perp')
  }, [])

  useEffect(() => {
    const connectedWallet = localStorage?.getItem(IS_CONNECTED_WALLET);
    if (!isApolloPage()) {
      const connectorInstance = connectors.find((c) => c.id === SAFE_ID && c.ready)
      if (
        connectorInstance &&
        // @ts-ignore
        !window.cy
      ) {
        connectAsync({ connector: connectorInstance }).catch(() => {
          if (connectedWallet == "true") {
            client.autoConnect()
          }
        })
      } else {
          if (connectedWallet == "true") {
            client.autoConnect()
          }
      }
    }
  }, [isApolloPage, client, connectAsync, connectors])
}

export default useEagerConnect
