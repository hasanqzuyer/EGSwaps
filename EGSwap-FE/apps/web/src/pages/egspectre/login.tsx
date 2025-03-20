import { useState, useEffect, useReducer } from 'react'
import { useRouter } from 'next/router'
import Page from 'views/Page'
import { Button, Flex, useToast } from '@pancakeswap/uikit'
import CircularProgress from '@mui/material/CircularProgress'
import { apiPost } from 'hooks/api'
import { useAccount } from 'wagmi'
import { useSignMessage } from '@pancakeswap/wagmi'

const Login: React.FC<React.PropsWithChildren> = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { signMessageAsync } = useSignMessage()

  const { address: account } = useAccount()
  const { toastError } = useToast()

  const handleLogin = async () => {
    if (!account) {
      toastError('Warning', 'Please connect wallet.')
      return
    }
    try {
      setIsLoading(true)
      const params = { wallet_address: account }
      const res = await apiPost('admin/getMessage', params, 'POST')
      const { sign_message } = res.data
      const signature = await signMessageAsync({ message: sign_message })
      const signInParams = { wallet_address: account, signature }
      const tokenRes = await apiPost('admin/signIn', signInParams, 'POST')
      const { jwt_token } = tokenRes.data
      if (jwt_token) {
        localStorage.setItem('@egspectreToken', jwt_token)
        router.push(`/egspectre/manage`)
      }
      setIsLoading(false)
    } catch (error) {
      toastError('Warning', 'Invalid admin wallet.')
      setIsLoading(false)
    }
  }
  return (
    <Page>
      <Flex
        width={['789px', '100%']}
        minHeight={'100vh'}
        flexDirection="column"
        position="relative"
        alignItems="center"
      >
        <div className="mt-8 sm:mt-6 rounded-xl max-w-[500px] w-full overflow-hidden mb-20 sm:mb-6">
          <div
            className="flex flex-col p-[30px] sm:px-5 sm:py-7"
            style={{
              background: 'linear-gradient(180deg, #0E1D47 0%, #213366 48.96%, #0E1D47 100%)',
            }}
          >
            <p className="text-white my-3 mx-auto">{account ? `Wallet: ${account}` : 'Connect Wallet first.'}</p>
            <Button
              onClick={handleLogin}
              style={{
                justifyContent: 'center',
                background: '#F0DC62',
                width: 160,
                height: 40,
                borderRadius: 20,
                color: 'black',
                fontSize: 14,
              }}
              minWidth="192px"
              // disabled={}
              className="mx-auto mt-8"
            >
              {isLoading ? <CircularProgress size={20} /> : 'Login'}
            </Button>
          </div>
        </div>
      </Flex>
    </Page>
  )
}

export default Login
