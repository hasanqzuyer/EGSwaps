import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import { useToast } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import OutsideClickHandler from 'react-outside-click-handler'
import styled, { keyframes } from 'styled-components'
import Page from 'views/Page'
import { Button, Flex, Swap as SwapUI, Toggle, QuestionHelper } from '@pancakeswap/uikit'
import RefreshImg from '../../assets/refresh.png'
import { apiPost } from 'hooks/api'
import { EGSPECTRE_HOW_IT_WORKS_LINK, MEMO_REQUIRED_TOKENS } from 'config/constants'

const CustomInput = styled.div<{ isInvalid: boolean }>`
  box-shadow: ${(props) => (props.isInvalid ? 'inset 0 0 10px rgba(255, 0, 0, 0.6)' : 'none')};
`
const bounceAnimation = keyframes`
  0%, 100% {
    transform: translateY(0) translateX(6px);
    opacity: 0.3;
  }
  50% {
    transform: translateY(-10px);
    opacity: 1;
  }
`

const AnimatedImage = styled.img<{ delay: boolean }>`
  animation: ${bounceAnimation} 5s linear infinite ${(props) => (props.delay ? '1.5s' : '')};
`
export const SwapButton = styled(Button)<{ loading: string; isMaintenance: boolean }>`
  justify-content: center;
  background-color: ${({ isMaintenance }) =>
    isMaintenance ? 'grey' : '#F0DC62'} !important;
  width: 160px;
  height: 40px;
  border-radius: 20px;
  color: #000 !important;
  font-size: 14px;
  span {
    width: 127px;
    text-align: ${({ loading }) => (loading === '-1' ? 'center' : 'left')};
  }
`

export const SupernovaButton = styled(Button)<{ loading: string; isMaintenance: boolean }>`
  justify-content: center;
  background: linear-gradient(180deg, rgb(101.81999757885933, 48.000000938773155, 255) 0%, rgb(88.64055678248405, 0, 201.45581156015396) 100%) !important;
  color: white;
  width: 160px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid #6C40EB;
  font-size: 14px;
  span {
    width: 127px;
    color: white;
    text-align: ${({ loading }) => (loading === '-1' ? 'center' : 'left')};
  }
`

export const FeenixButton = styled(Button)<{ loading: string; isMaintenance: boolean }>`
  justify-content: center;
  background: linear-gradient(180deg, #ffb902 0%, #b68400 100%) !important;
  width: 160px;
  height: 40px;
  border-radius: 5px;
  border: 1px solid rgb(196, 194, 189);
  font-size: 14px;
  span {
    width: 127px;
    color: #000000;
    text-align: ${({ loading }) => (loading === '-1' ? 'center' : 'left')};
  }
`

interface ITokenPair {
  color: string
  displayName: string
  id: string
  keyword: string
  logo: string
  name: string
  networkId: string
}

const Egspectre: React.FC<React.PropsWithChildren> = () => {
  const router = useRouter()
  const { toastError } = useToast()
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [loadingDots, setLoadingDots] = useState(-1)
  const [isRotated, setIsRotated] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false)
  const [tokenList, setTokenList] = useState([])
  const [networks, setNetworks] = useState([])
  const [fromDropdownOpen, setFromDropdownOpen] = useState<boolean>(false)
  const [toDropdownOpen, setToDropdownOpen] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [sendAmount, setSendAmount] = useState('')
  const [toAmount, setToAmount] = useState('')
  const [receiveAddress, setReceiveAddress] = useState('')
  const [memoTag, setMemoTag] = useState('')
  const [memoRequired, setMemoRequired] = useState(false)
  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(0)
  const [regexList, setRegexList] = useState({})
  const [isInvalidAddr, setIsInvalidAddr] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [swapClicked, setSwapClicked] = useState(false)
  const [warningObj, setWarningObj] = useState({
    warning_status: false,
    message: '',
  })
  const [fromToken, setFromToken] = useState<ITokenPair>({
    color: '#f6921a',
    displayName: 'BTC',
    id: '643cf284a188d950049784c2',
    keyword: 'bitcoin btc',
    logo: 'https://raw.githubusercontent.com/EG-Ecosystem/EGSpectreTokens/main/BTC.png',
    name: 'BTC',
    networkId: '645c70266ab29ef10248592b',
  })
  const [toToken, setToToken] = useState<ITokenPair>({
    color: '#8C8C8C',
    displayName: 'ETH',
    id: '643cf350a188d950049784c5',
    keyword: 'ethereum eth',
    logo: 'https://raw.githubusercontent.com/EG-Ecosystem/EGSpectreTokens/main/ETH.png',
    name: 'ETH',
    networkId: '645b9e9d8f2bb1218f0a6f6e',
  })

  useEffect(() => {
    const getTokenList = async () => {
      const networkRes = await apiPost('quotes/networks')
      const tokenRes = await apiPost('quotes/tokens')
      setNetworks(networkRes.data)
      setTokenList(tokenRes.data)
      const transformedData: Record<string, string> = networkRes.data.reduce(
        (result: { [x: string]: any }, item: { id: string | number; validation_address: any }) => {
          result[item.id] = item.validation_address
          return result
        },
        {},
      )
      setRegexList(transformedData)
    }
    getTokenList()
  }, [])

  const getNetowrks = (id: string) => networks.find((network) => network.id === id).name
  const getProtocals = (id: string) => {
    const network = networks.find((network) => network.id === id)
    return network ? network.protocol || network.name : ''
  }

  const handleAmountChange = (e: { target: { value: string } }) => {
    let inputStr = e.target.value
    if (inputStr.includes('-')) return
    if (inputStr.charAt(0) === '.') inputStr = '0' + inputStr
    if (inputStr.charAt(0) === '0' && inputStr.charAt(1) !== '.') inputStr = '0'
    const rx_live = /^[+-]?\d*(?:[.,]\d*)?$/
    if (rx_live.test(inputStr)) setSendAmount(inputStr)
  }

  const checkWalletValidation = (addr: string) => {
    if (addr !== '') {
      const validationRegex = regexList[toToken.networkId] || ''
      const regexPattern = new RegExp(validationRegex)
      if (regexPattern && !regexPattern.test(addr)) {
        setIsInvalidAddr(true)
      } else setIsInvalidAddr(false)
    } else setIsInvalidAddr(false)
  }

  const handleReceiveAddress = (e: { target: { value: string } }) => {
    const addr = e.target.value
    checkWalletValidation(addr)
    setReceiveAddress(addr)
  }

  // region callPriceAPI
  const callPriceAPI = async () => {
    if (parseFloat(sendAmount) > 0) {
      setIsLoading(true)
      setLoadingDots(1)
      const intervalId = setInterval(() => {
        setLoadingDots((dots) => (dots + 1) % 4) // Cycle through 0, 1, 2, 3
      }, 500)

      // Create an AbortController instance
      const controller = new AbortController()
      const { signal } = controller

      try {
        // Set up timeout to cancel the API call after 10 seconds
        const timeCounter = setTimeout(() => {
          controller.abort() // Abort the API call
          clearInterval(intervalId) // Stop the loading animation
          setIsLoading(false) // Set loading state to false
          setLoadingDots(-1) // Reset loading animation state
          setToAmount('0') // Set toAmount to 0
          toastError('Error', 'No price quotes available for this pair. Please check back later.') // Display timeout error
        }, 10000)

        const params = {
          from_amount: sendAmount,
          from_symbol: fromToken.name,
          to_symbol: toToken.name,
          is_anon: isAnonymous,
        }

        const res = await apiPost('quotes', params, 'POST', signal) // Pass the signal to the API call

        // Clear the timeout since the API call succeeded before the timeout
        clearTimeout(timeCounter)

        if (res?.message.name === 'AbortError') return

        const resultAmount = res.data.toAmount.toString()
        setToAmount(resultAmount === '-1' ? '0' : parseFloat(sendAmount) < res.data.minAmount * 2 ? '0' : resultAmount)
        setIsLoading(false)
        setLoadingDots(-1)
        setMinAmount(res.data.minAmount * 2)
        clearInterval(intervalId)
        res.data.maxAmount !== null && setMaxAmount(res.data.maxAmount)

        if (res.data.maxAmount === 0 && res.data.minAmount === 0 && res.data.toAmount === 0)
          toastError('Error', 'No price quotes available for this pair. Please check back later.')
      } catch (error: any) {
        clearInterval(intervalId)
        setLoadingDots(-1)
        setIsLoading(false)
        toastError('Something went wrong', 'Please try again')
      }
    }
  }

  useEffect(() => {
    setIsLoading(false)
    setMemoRequired(MEMO_REQUIRED_TOKENS.includes(toToken.name))
    const timeOutId = setTimeout(() => {
      callPriceAPI()
    }, 1000)
    checkWalletValidation(receiveAddress)

    return () => {
      clearTimeout(timeOutId)
    }
  }, [fromToken, toToken, sendAmount, isAnonymous])

  const searchOrderFunc = async (node: HTMLInputElement) => {
    if (node?.value === '' || node?.value.length > 24)
      toastError('Invalid EGSpectre ID', 'This EGSpectre ID is invalid. For any further inquiries, contact Support.')
    else {
      setIsSearching(true)
      const orderRes = await apiPost(`orders/${node?.value}`)
      setIsSearching(false)
      if (orderRes.code === 200) {
        // Get the current Unix timestamp in seconds
        const currentTimestamp = Math.floor(Date.now() / 1000)
        // Get the creation timestamp from orderRes
        const creationTimestamp = orderRes.data.creation_time
        // Calculate the difference in seconds
        const timeDifference = currentTimestamp - creationTimestamp
        // Define the threshold for 48 hours (48 hours * 60 minutes * 60 seconds)
        const threshold = 48 * 60 * 60
        if (timeDifference > threshold) {
          toastError(
            'Your order history has been deleted',
            'This EGSpectre ID has been deleted after 48 hours for security purposes. For  any further inquiries, contact Support.',
          )
        } else {
          router.push(`/egspectre/${node?.value}`)
        }
      } else
        toastError('Invalid EGSpectre ID', 'This EGSpectre ID is invalid. For any further inquiries, contact Support.')
    }
  }

  // for desktop
  const searchOrderId = useCallback(async () => {
    const node = document.getElementById('egspectre-search') as HTMLInputElement | null
    searchOrderFunc(node)
  }, [])

  // for mobile
  const searchMobileOrderId = useCallback(() => {
    const node = document.getElementById('egspectre-mobile-search') as HTMLInputElement | null
    searchOrderFunc(node)
  }, [])

  useEffect(() => {
    const node = document.getElementById('egspectre-search')
    node.addEventListener('keyup', function (event: KeyboardEvent) {
      if (event.key === 'Enter') searchOrderId()
    })
  }, [])

  const checkMaintenanceStatus = async () => {
    try {
      const res = await apiPost('admin/getMaintenanceMode')
      setMaintenanceMode(res.data.maintenance_status)
    } catch (error) {
      console.log('maintenance_status_err==', error)
    }
  }
  const checkWarningStatus = async () => {
    try {
      const res = await apiPost('admin/getWarningStatus')
      const { warning_status, message } = res.data
      setWarningObj({ warning_status, message })
    } catch (error) {
      console.log('checkWarningStatus_err==', error)
    }
  }

  useEffect(() => {
    checkMaintenanceStatus()
    checkWarningStatus()
  }, [])

  const isBlacklistedWallet = async (walletAddress: string): Promise<boolean> => {
    const resp = await fetch(`/api/chainanalysis/${walletAddress}`)
    const validResponse = await resp.json()

    return !!validResponse?.isSanctioned
  }

  // region handleExchange
  const handleExchange = async () => {
    if (sendAmount === '') {
      toastError('Warning', 'Please enter the amount to send.')
      return
    }
    if (receiveAddress === '') {
      toastError('Warning', 'Please enter the receiver address')
      return
    }
    if (isInvalidAddr) {
      toastError('Warning', 'Invalid wallet address')
      return
    }

    const isBlacklisted = await isBlacklistedWallet(receiveAddress)

    if (isBlacklisted) {
      toastError('Error', 'Your Order Cannot be Processed. Please Contact Support')
      return
    }
    setSwapClicked(true)
    setIsLoading(true)
    setLoadingDots(1)
    const intervalId = setInterval(() => {
      setLoadingDots((dots) => (dots + 1) % 4) // Cycle through 0, 1, 2, 3
    }, 500)
    try {
      const params = {
        from_amount: sendAmount,
        to_address: receiveAddress,
        from_symbol: fromToken.name,
        to_symbol: toToken.name,
        is_anon: isAnonymous,
        source: 'egswap',
        domain: location.origin || 'https://egswap.exchange',
        memo_tag: memoTag,
      }
      const exchangeRes = await apiPost('orders', params, 'POST')
      setIsLoading(false)
      clearInterval(intervalId)
      setLoadingDots(-1)
      if (exchangeRes.message === 'Success') {
        router.push(`/egspectre/${exchangeRes.data.egSpectreId}`)
      }
    } catch (error) {
      console.log('exchange error=>', error)
    }
  }

  return (
    <Page>
      {maintenanceMode ? (
        <p className="max-w-[493px] text-[13px] my-[15px] font-medium leading-normal text-center bg-[#f1433d] rounded-xl p-[10px]">
          EGSpectre is undergoing planned improvements. We'll be back soon. Thank you for your patience!
        </p>
      ) : warningObj.warning_status ? (
        <p className="max-w-[493px] w-full text-[13px] my-[15px] font-medium leading-normal text-center bg-[#95C3E3] rounded-xl py-3 px-5">
          {warningObj.message}
        </p>
      ) : null}
      <div className="flex flex-row md:flex-col min-h-[80vh] max-w-6xl md:items-center items-start justify-between w-full gap-3 pt-20 relative">
        <div className="w-full max-w-[493px] relative">
          <span className="text-[28px] font-bold text-[#101f49] leading-tight">Trade in Ghost (Spectre) mode</span>
          <p className="text-[14px] sm:text-sm mt-8 mb-4 font-medium leading-6 text-[#5b8aab]">
            ✓ Safeguard the confidentially of your transactions.
          </p>
          <p className="text-[14px] sm:text-sm my-4 font-medium leading-6 text-[#5b8aab]">
            ✓ Effortlessly execute private cross-chain swaps.
          </p>
          <p className="text-[14px] sm:text-sm my-4 font-medium leading-6 text-[#5b8aab]">
            ✓ EGSpectre offers an exceptional level of privacy, ensuring that no traceable link exists between
            originating and destination wallets.
          </p>
          <p className="text-[14px] sm:text-sm my-4 font-medium leading-6 text-[#5b8aab]">
            ✓ Zero Gas Fees. No need to connect your wallet!
          </p>
          <p className="sm:hidden relative block text-[13px] my-[25px] font-medium leading-normal text-[#195B89] bg-[#95C3E3] rounded-xl p-[10px] z-1">
            As a testament to our unwavering commitment to your security, EGSpectre automatically purges order details
            within a 48-hour window. Should you require any assistance, our dedicated support team is at your service
            round the clock, 24/7.
          </p>
          <div
            className="sm:hidden relative flex flex-row items-center justify-between w-[334px] h-10 max-w-md bg-white rounded-full px-3 z-20"
            style={{
              boxShadow: '2px 2px 3px 0px rgba(0, 0, 0, 0.15) inset',
              border: '1px solid #D0D0D0',
            }}
          >
            <input
              type="text"
              id="egspectre-search"
              className="border-none outline-none text-xs w-full z-20"
              placeholder="Search by EGSpectre ID"
            />
            {isSearching ? (
              <img src={RefreshImg.src} alt="" className={`w-[24px] h-[24px] animate-spin`} />
            ) : (
              <img
                src="/images/anon/search.png"
                alt="search"
                className="cursor-pointer hover:scale-110 active:scale-100 z-20"
                width={20}
                onClick={searchOrderId}
              />
            )}
          </div>
          <img
            src="/images/anon/sunglass.png"
            alt="search"
            className="md:hidden block w-full max-w-[483px] absolute -bottom-56 -right-1/4 z-0"
          />
          <AnimatedImage
            src="/images/anon/star.png"
            alt="search"
            className="md:hidden block w-[41px] absolute -bottom-32 left-24 z-1"
            delay={false}
          />
          <AnimatedImage
            src="/images/anon/star2.png"
            alt="search"
            className="md:hidden block w-[26px] absolute -bottom-52 left-3/4 z-1"
            delay={true}
          />
        </div>
        <div
          className="flex flex-col p-[30px] rounded-3xl max-w-[529px] w-full h-min z-10 relative"
          style={{
            background: 'linear-gradient(180deg, #0E1D47 0%, #213366 48.96%, #0E1D47 100%)',
            boxShadow: '0px 4px 34px 0px rgba(0, 0, 0, 0.60)',
          }}
        >
          <div className="flex justify-between">
            <div className="flex flex-col">
              <span
                className="text-[22px] font-bold mb-3"
                style={{
                  backgroundImage: 'linear-gradient( 90deg, #75E1B4 -10%, #68D9DD 50%, #64ACFF 110% )',
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                }}
              >
                EGSpectre
              </span>
              <span className="text-[0.875rem] font-medium text-[#5b8aab]">Anonymous, Compliant, Zero Gas Fees</span>
              <Flex alignItems={'center'} mt="15px">
                <span className="text-[0.875rem] font-medium text-white mr-2">Private</span>
                <Toggle
                  checked={!isAnonymous}
                  onChange={(e) => setIsAnonymous(!isAnonymous)}
                  scale="md"
                  style={{
                    backgroundColor: isAnonymous ? '#E1E1E1' : '#22CE77',
                  }}
                  handleStyle={{ backgroundColor: '#142350 !important' }}
                />
                <span className="text-[0.875rem] font-medium text-white ml-2">Discreet</span>
                <QuestionHelper
                  text={t(
                    'Discreet mode is cheaper, faster and provides a higher level of privacy than public transactions. Although these are hard to trace, but not totally anonymous.',
                  )}
                  placement="top-start"
                  ml="4px"
                />
              </Flex>
            </div>
            <img
              src={RefreshImg.src}
              alt=""
              className={`w-[24px] h-[24px] ${isLoading ? 'animate-spin' : 'cursor-pointer hover:scale-110'}`}
              onClick={() => callPriceAPI()}
            />
          </div>

          <div
            className={`rounded-[14px] w-full h-[62px] p-[10px] mt-[15px] flex flex-col justify-between relative ${
              fromDropdownOpen ? 'rounded-b-none' : ''
            }`}
            style={{
              background: 'linear-gradient(190deg, #FFF 23.04%, #D1D1D1 92.49%)',
            }}
          >
            <span className="text-[12px] text-[#22326E]">From</span>
            <div className="flex w-full justify-between">
              <input
                placeholder="0.0"
                type="string"
                className="outline-none border-none w-full bg-transparent"
                value={sendAmount}
                onChange={handleAmountChange}
              />
              <div
                className="flex items-center gap-1 cursor-pointer whitespace-nowrap mr-3 text-xs"
                onClick={() => setFromDropdownOpen(!fromDropdownOpen)}
              >
                <img src={fromToken.logo} className="h-[16px] w-[16px]" alt="" />
                {fromToken.displayName.split(' ')[0]} ({getProtocals(fromToken.networkId)})
              </div>
            </div>
            {parseFloat(sendAmount) <= minAmount && minAmount !== 0 && !isLoading && (
              <span className="text-red-600 text-[12px]">Min amount: {minAmount}</span>
            )}
            {parseFloat(sendAmount) >= maxAmount && maxAmount !== 0 && !isLoading && (
              <span className="text-red-600 text-[12px]">Max amount: {maxAmount}</span>
            )}
            {fromDropdownOpen && (
              <OutsideClickHandler
                onOutsideClick={() => {
                  setFromDropdownOpen(false)
                }}
              >
                <div
                  className="absolute p-2.5 left-0 top-[100%] z-10 w-full rounded-b-lg max-h-[300px] overflow-y-auto"
                  style={{
                    background: 'linear-gradient(180deg, #D1D1D1 0%, #FFF 28.65%, #FFF 100%)',
                  }}
                >
                  <div className="w-full h-10 rounded-lg px-2.5 flex items-center justify-between bg-white">
                    <input
                      placeholder="Search by token name or network"
                      className="w-full outline-none border-none bg-transparent text-xs font-normal leading-normal text-[#22326E]"
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      autoFocus={true}
                    />
                    <img src="/images/anon/search.png" alt="search" width={20} />
                  </div>
                  {tokenList &&
                    tokenList
                      .filter((elem) => elem.keyword.includes(searchValue.toLowerCase()))
                      .map((t, i) => (
                        <div
                          key={t.name}
                          className="py-4 flex items-center gap-2 text-xs cursor-pointer hover:bg-[#b3e2f0]"
                          onClick={() => {
                            setFromToken(t)
                            setFromDropdownOpen(false)
                            setSearchValue('')
                          }}
                          style={{ borderBottom: '1px solid #BFBFBF' }}
                        >
                          <img src={t.logo} className="h-4 w-4" alt="" />
                          {t.displayName.split(' ')[0]}
                          <span className="ml-auto" style={{ color: t.color }}>
                            {getNetowrks(t.networkId)}
                          </span>
                        </div>
                      ))}
                </div>
              </OutsideClickHandler>
            )}
          </div>

          <img
            src="/images/anon/exchange.png"
            className={`w-7 h-7 mx-auto my-[15px] cursor-pointer hover:opacity-80 active:translate-y-[1px] transition-all ${
              isRotated ? 'rotate-180' : ''
            }`}
            alt="exchange-logo"
            onMouseUp={() => setIsRotated(!isRotated)}
            onClick={() => {
              setToToken(fromToken)
              setFromToken(toToken)
            }}
          />

          <div
            className={`rounded-[14px] w-full h-[62px] p-[10px] flex flex-col justify-between relative ${
              toDropdownOpen ? 'rounded-b-none' : ''
            }`}
            style={{
              background: 'linear-gradient(190deg, #FFF 23.04%, #D1D1D1 92.49%)',
            }}
          >
            <span className="text-[12px] text-[#22326E]">To</span>
            <div className="flex w-full justify-between">
              <input
                placeholder="0.0"
                type="string"
                value={toAmount}
                disabled
                className="outline-none border-none w-full bg-transparent"
              />

              <div
                className="flex items-center gap-1 cursor-pointer whitespace-nowrap mr-3 text-xs"
                onClick={() => setToDropdownOpen(!toDropdownOpen)}
              >
                <img src={toToken.logo} className="h-[16px] w-[16px]" alt="" />
                {toToken.displayName.split(' ')[0]} ({getProtocals(toToken.networkId)})
              </div>
            </div>
            {toDropdownOpen && (
              <OutsideClickHandler
                onOutsideClick={() => {
                  setToDropdownOpen(false)
                }}
              >
                <div
                  className="absolute p-2.5 left-0 top-[100%] z-10 w-full rounded-b-lg max-h-[300px] overflow-y-auto"
                  style={{
                    background: 'linear-gradient(180deg, #D1D1D1 0%, #FFF 28.65%, #FFF 100%)',
                  }}
                >
                  <div className="w-full h-10 rounded-lg px-2.5 flex items-center justify-between bg-white">
                    <input
                      placeholder="Search by token name or network"
                      className="w-full outline-none border-none text-xs font-normal leading-normal text-[#22326E]"
                      type="text"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      autoFocus={true}
                    />
                    <img src="/images/anon/search.png" alt="search" width={20} />
                  </div>
                  {tokenList &&
                    tokenList
                      .filter((elem) => elem.keyword.includes(searchValue.toLowerCase()))
                      .map((t, i) => (
                        <div
                          key={t.name}
                          className="py-4 flex items-center gap-2 text-xs cursor-pointer hover:bg-[#b3e2f0]"
                          onClick={() => {
                            setToToken(t)
                            setToDropdownOpen(false)
                            setSearchValue('')
                            setMemoTag('')
                          }}
                          style={{ borderBottom: '1px solid #BFBFBF' }}
                        >
                          <img src={t.logo} className="h-4 w-4" alt="" />
                          {t.displayName.split(' ')[0]}
                          <span className="ml-auto" style={{ color: t.color }}>
                            {getNetowrks(t.networkId)}
                          </span>
                        </div>
                      ))}
                </div>
              </OutsideClickHandler>
            )}
          </div>

          <CustomInput
            className="rounded-[14px] w-full h-[62px] p-[10px] mt-[15px] flex flex-col justify-between bg-gradient-to-br from-white to-[#D1D1D1]"
            isInvalid={isInvalidAddr}
          >
            <span className="text-[12px] font-normal text-[#22326E]">Receiving Wallet Address:</span>
            <input
              placeholder="Receiving Wallet Address"
              type="text"
              value={receiveAddress}
              onChange={handleReceiveAddress}
              className="outline-none border-none flex flex-1 bg-transparent text-xs"
            />
          </CustomInput>
          {memoRequired && (
            <div className="rounded-[14px] w-full h-[62px] p-[10px] mt-[15px] flex flex-col justify-between bg-gradient-to-br from-white to-[#D1D1D1]">
              <span className="text-[12px] font-normal text-[#22326E]">Memo tag:(Optional)</span>
              <input
                placeholder="Memo tag"
                type="text"
                value={memoTag}
                onChange={(e) => setMemoTag(e.target.value)}
                className="outline-none border-none flex flex-1 bg-transparent text-xs"
              />
            </div>
          )}
          <div className="text-[12px] my-[15px] font-normal leading-normal text-[#F0DC62] text-center">
            Only Send the <u>exact</u> amount To/From Wallets. Funds sent To/From Smart Contracts or insufficient
            amounts sent will not be accepted.
          </div>

          <div className="flex justify-center">
            {/* <p style={{ color: 'white' }}>loadingDots={`${loadingDots}`}</p> */}
            <SwapButton
              onClick={handleExchange}
              loading={loadingDots.toString()}
              isMaintenance={maintenanceMode}
              minWidth="192px"
              disabled={parseFloat(sendAmount) <= minAmount || isLoading || maintenanceMode}
            >
              <span>
                {loadingDots === -1
                  ? 'Swap'
                  : `${swapClicked ? 'Creating Order' : 'Getting Price'}${'.'.repeat(loadingDots)}`}
              </span>
            </SwapButton>
          </div>
          <div className="flex flex-row sm:flex-col items-center justify-center mt-[15px]">
            <span className="text-[12px] text-white mx-2 sm:mb-3">First time swapping on EGSpectre?</span>
            <a
              href={EGSPECTRE_HOW_IT_WORKS_LINK}
              target="_blank"
              className="text-[12px] font-bold text-white cursor-pointer pb-1 border-solid border-b hover:scale-105"
            >
              👀 Check the Tutorial
            </a>
          </div>
        </div>
        <img
          src="/images/anon/ghost.png"
          alt="ghost"
          className="md:hidden block w-full max-w-[483px] absolute -bottom-16 left-[78%]"
        />
        <div
          className="sm:flex hidden flex-row items-center justify-between w-full h-10 max-w-md bg-white rounded-full px-3 my-5"
          style={{
            boxShadow: '2px 2px 3px 0px rgba(0, 0, 0, 0.15) inset',
            border: '1px solid #D0D0D0',
          }}
        >
          <input
            type="text"
            id="egspectre-mobile-search"
            className="border-none outline-none text-xs w-full"
            placeholder="Search by EGSpectre ID"
          />
          {isSearching ? (
            <img src={RefreshImg.src} alt="" className={`w-[24px] h-[24px] animate-spin`} />
          ) : (
            <img
              src="/images/anon/search.png"
              alt="search"
              className="cursor-pointer hover:scale-110 active:scale-100"
              width={24}
              onClick={searchMobileOrderId}
            />
          )}
        </div>
        <p className="sm:block hidden text-[13px] mb-8 font-medium leading-normal text-[#195B89] bg-[#95C3E3] rounded-xl p-[10px]">
          As a testament to our unwavering commitment to your security, EGSpectre automatically purges order details
          within a 48-hour window. Should you require any assistance, our dedicated support team is at your service
          round the clock, 24/7.
        </p>
      </div>
    </Page>
  )
}

Egspectre.displayName = 'egspectre'

export default Egspectre
