import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useToast } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import OutsideClickHandler from 'react-outside-click-handler'
import styled from 'styled-components'
import { Flex, Toggle, QuestionHelper } from '@pancakeswap/uikit'
import RefreshImg from '../../assets/refresh.png'
import { supernovaApiPost } from 'hooks/api'
import { EGSPECTRE_HOW_IT_WORKS_LINK } from 'config/constants'
import { SupernovaButton, SwapButton } from './swap'

const CustomInput = styled.div<{ isInvalid: boolean }>`
  box-shadow: ${(props) => (props.isInvalid ? 'inset 0 0 10px rgba(255, 0, 0, 0.6)' : 'none')};
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
  const [searchOrderId, setSearchOrderId] = useState('')
  const [minAmount, setMinAmount] = useState(0)
  const [maxAmount, setMaxAmount] = useState(0)
  const [regexList, setRegexList] = useState({})
  const [isInvalidAddr, setIsInvalidAddr] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [swapClicked, setSwapClicked] = useState(false)
  // const [warningObj, setWarningObj] = useState({
  //   warning_status: false,
  //   message: '',
  // })
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
    const { query } = router
    if (tokenList && tokenList.length > 0 && query) {
      if (query.send_token) {
        const initialFromToken = tokenList.find((token) => token.name === query.send_token)

        if (initialFromToken) {
          setFromToken(initialFromToken)
        }
      }
      if (query.receive_token) {
        const initialToToken = tokenList.find((token) => token.name === query.receive_token)

        if (initialToToken) {
          setToToken(initialToToken)
        }
      }
      if (query.receiver_address) {
        setReceiveAddress(query.receiver_address as string)
      }
      if (query.is_anon) {
        setIsAnonymous(query.is_anon === 'true')
      }
    }
  }, [router.query, tokenList])

  useEffect(() => {
    const getTokenList = async () => {
      const networkRes = await supernovaApiPost('quotes/networks')
      const tokenRes = await supernovaApiPost('quotes/tokens?widget=supernova')
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

        const res = await supernovaApiPost('quotes', params, 'POST', signal) // Pass the signal to the API call

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
    const timeOutId = setTimeout(() => {
      callPriceAPI()
    }, 1000)
    checkWalletValidation(receiveAddress)

    return () => {
      clearTimeout(timeOutId)
    }
  }, [fromToken, toToken, sendAmount, isAnonymous])

  const checkMaintenanceStatus = async () => {
    const res = await supernovaApiPost('admin/getMaintenanceMode')
    setMaintenanceMode(res.data.maintenance_status)
  }

  useEffect(() => {
    checkMaintenanceStatus()
    // checkWarningStatus()
  }, [])

  const isBlacklistedWallet = async (walletAddress: string): Promise<boolean> => {
    const resp = await fetch(`/api/chainanalysis/${walletAddress}`)
    const validResponse = await resp.json()

    return !!validResponse?.isSanctioned
  }

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
        source: 'widget',
        widget: 'supernova',
        domain: document.referrer || window.parent.location || 'unknown',
      }
      const exchangeRes = await supernovaApiPost('orders', params, 'POST')
      setIsLoading(false)
      clearInterval(intervalId)
      setLoadingDots(-1)
      if (exchangeRes.message === 'Success') {
        router.push(`/egspectre/${exchangeRes.data.egSpectreId}?widget=supernova`)
      }
    } catch (error) {
      console.log('exchange error=>', error)
    }
  }

  const handleKeyPress = async (e: any) => {
    const orderResp = await supernovaApiPost(`orders/${searchOrderId}`)

    if (e.key === 'Enter') {
      router.push(`/egspectre/${searchOrderId}?widget=supernova`)
    }
  }

  return (
    <div
      className="flex flex-row md:flex-col md:items-center items-start justify-between w-full relative"
      style={{ background: 'transparent !important' }}
    >
      <div
        className="flex flex-col p-[30px] rounded-3xl max-w-[529px] w-full h-min z-10 relative"
        style={{
          background: 'linear-gradient(180deg, #161622 0%, #2a1b56 50%, #161622 100%)',
          // boxShadow: '0px 4px 34px 0px rgba(0, 0, 0, 0.60)',
        }}
      >
        <div className="flex justify-between">
          <div className="flex flex-col">
            <div className="flex flex-row gap-4 items-center mb-3">
              <img src="/images/supernova-logo-transparent.png" className="w-[30px] h-auto"/>
              <span
                className="text-[28px] font-bold sm:text-3xl leading-[1.3]"
                style={{
                  backgroundImage:
                    'linear-gradient(180deg, rgb(248.0719381570816, 246.94409787654877, 255) 0%, rgb(156.60408228635788, 140.58617860078812, 255) 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                }}
              >
                Supernova Bridge
              </span>
            </div>
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
                  'Private mode is completely anonymous. Discreet mode is cheaper, faster and provides a higher level of privacy than public transactions. While these are hard to trace, they are not anonymous.',
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
            background: 'white',
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
            background: 'white',
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
          className={`rounded-[14px] w-full h-[62px] p-[10px] mt-[15px] flex flex-col justify-between`}
          isInvalid={isInvalidAddr}
          style={{
            background: 'white',
          }}
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
        <div
          style={{
            backgroundImage:
              'linear-gradient(180deg, rgb(248.0719381570816, 246.94409787654877, 255) 0%, rgb(156.60408228635788, 140.58617860078812, 255) 100%)',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
          }}
          className="text-[12px] my-[15px] font-normal leading-normal text-[#F0DC62] text-center"
        >
          Only Send the <u>exact</u> amount To/From Wallets. Funds sent To/From Smart Contracts or insufficient amounts
          sent will not be accepted.
        </div>

        <div className="flex justify-center">
          <SupernovaButton
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
          </SupernovaButton>
        </div>
        <div className="flex flex-row items-center justify-center w-full mt-[15px]">
          <div
            className="flex flex-row items-center justify-center relative w-[334px] h-10 max-w-md bg-white rounded-full px-3 z-8"
            style={{
              boxShadow: '2px 2px 3px 0px rgba(0, 0, 0, 0.15) inset',
              border: '1px solid #D0D0D0',
            }}
          >
            <input
              type="text"
              className="border-none outline-none text-xs w-full z-8"
              placeholder="Search by Supernova ID"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <img
              src="/images/anon/search.png"
              alt="search"
              className="cursor-pointer hover:scale-110 active:scale-100 z-8"
              width={20}
              onClick={() => handleKeyPress({ key: 'Enter' })}
            />
          </div>
        </div>
        <div className="flex items-center justify-center my-5">
          <img src="/images/logo-egswap-light.png" style={{ height: '32px', marginRight: '4px' }} />
          <span className="text-white" style={{ marginRight: '4px' }}>
            Powered by EGSwap
          </span>
        </div>
      </div>
    </div>
  )
}

Egspectre.displayName = 'egspectre'

export default Egspectre
