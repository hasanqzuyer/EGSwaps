import { useCallback, useEffect } from 'react'
import { useAccount, useDisconnect } from 'wagmi'
import { verifyMessage } from '@ethersproject/wallet'
import { useSignMessage } from '@pancakeswap/wagmi'
import { useModal, Modal, ModalBody, Text, AutoColumn } from '@pancakeswap/uikit'
import { ConnectorNames } from 'config/wallet'
import { ChainId } from '@pancakeswap/sdk'

export const NETWORK_CONNECTION_STORAGE_KEY = '@eg-ecosystem/network-connection'

export type NetworkConnection = {
  connectorId: ConnectorNames
  chainId: number
  verifiedAccounts: {
    [key: string]: {
      signedMessage: string
      version: number
      uiid: string
    }
  }
  connectedAccount: string
}

export const getNetworkConnection = (): NetworkConnection | null => {
  const value = localStorage.getItem(NETWORK_CONNECTION_STORAGE_KEY)

  if (!value) {
    return null
  }

  try {
    return JSON.parse(value) as NetworkConnection
  } catch (_: unknown) {
    return null
  }
}

export const removeNetworkConnection = () => localStorage.removeItem(NETWORK_CONNECTION_STORAGE_KEY)

export const addConnectorInfo = (connectorInfo: { chainId?: ChainId; connectorId?: ConnectorNames } = {}) => {
  localStorage.setItem(
    NETWORK_CONNECTION_STORAGE_KEY,
    JSON.stringify({
      ...(getNetworkConnection() || {}),
      ...connectorInfo,
    }),
  )
}

export const removeConnectorInfo = () => {
  const { connectorId, chainId, ...networkConnection } = getNetworkConnection() || {}

  localStorage.setItem(
    NETWORK_CONNECTION_STORAGE_KEY,
    JSON.stringify({
      ...networkConnection,
    }),
  )
}

export const addVerifiedAccount = (
  account: string,
  verifiedAccount: { signedMessage: string; version: number; uiid: string },
) => {
  const networkConnection = getNetworkConnection()

  localStorage.setItem(
    NETWORK_CONNECTION_STORAGE_KEY,
    JSON.stringify({
      ...networkConnection,
      verifiedAccounts: {
        ...networkConnection?.verifiedAccounts,
        [account]: verifiedAccount,
      },
    }),
  )
}

export const removeVerifiedAccount = (account: string) => {
  const networkConnection = getNetworkConnection()
  const { [account]: noop, ...verifiedAccounts } = networkConnection?.verifiedAccounts || {}

  localStorage.setItem(
    NETWORK_CONNECTION_STORAGE_KEY,
    JSON.stringify({
      ...networkConnection,
      verifiedAccounts,
    }),
  )
}

export const addConnectedAccount = (account: string) => {
  localStorage.setItem(
    NETWORK_CONNECTION_STORAGE_KEY,
    JSON.stringify({
      ...(getNetworkConnection() || {}),
      connectedAccount: account,
    }),
  )
}

export const removeConnectedAccount = () => {
  const { connectedAccount, ...networkConnection } = getNetworkConnection() || {}

  localStorage.setItem(
    NETWORK_CONNECTION_STORAGE_KEY,
    JSON.stringify({
      ...networkConnection,
    }),
  )
}

const getDynamicSignMessage = (uiid = crypto.randomUUID()) => ({
  message: `Hello from EGSwap! Please Sign this message to verify that this wallet belongs to you so we can log you in. This won’t cost you any BNB as there is no gas fee to pay for this transaction.\n\nTo stop hackers from using your wallet, here is a unique message ID they can not guess: ${uiid}`,
  uiid,
  version: 1,
})

const useSignMessageOnConnect = () => {
  const { address: account } = useAccount()
  const { disconnectAsync } = useDisconnect()
  const { signMessageAsync } = useSignMessage()

  const [show, dismiss] = useModal(
    <Modal title="Sign In" hideCloseButton>
      <ModalBody maxWidth="460px">
        <AutoColumn gap="md">
          <Text textAlign="center">
            Almost there! To finalize the sign in proccess your wallet will ask you to digitally sign a message to prove
            your ownership.
          </Text>
          <Text textAlign="center" small>
            Taking a while? Check your wallet and click "Sign"
          </Text>
        </AutoColumn>
      </ModalBody>
    </Modal>,
    false,
  )

  const handleLogin = useCallback(
    async (message: string, signedMessage: string) => {
      if (!account) {
        return
      }

      addConnectedAccount(account)

      const recoveredAddress = verifyMessage(message, signedMessage)

      if (account !== recoveredAddress) {
        removeVerifiedAccount(account)
        disconnectAsync()
      }
    },
    [disconnectAsync, account],
  )

  useEffect(() => {
    if (!account) {
      return
    }

    const { verifiedAccounts } = getNetworkConnection() || {}

    const { signedMessage, uiid, version } = (verifiedAccounts && verifiedAccounts[account]) || {}

    const { message: verifiedMessage, version: verifiedVersion } = getDynamicSignMessage(uiid)

    if (verifiedVersion === version && signedMessage) {
      handleLogin(verifiedMessage, signedMessage)

      return
    }

    show()

    const dynamicMessage = getDynamicSignMessage()

    signMessageAsync({ message: dynamicMessage.message })
      .then((signedMessage) => {
        addVerifiedAccount(account, {
          signedMessage,
          uiid: dynamicMessage.uiid,
          version: dynamicMessage.version,
        })

        handleLogin(dynamicMessage.message, signedMessage)
      })
      .catch(() => disconnectAsync())
      .finally(() => dismiss())
  }, [account, handleLogin, show, signMessageAsync, disconnectAsync])
}

export default useSignMessageOnConnect
