import { useState, useEffect, useReducer } from 'react'
import { useRouter } from 'next/router'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import Page from 'views/Page'
import { CopyButton, Flex, useMatchBreakpoints, useToast } from '@pancakeswap/uikit'
import styled, { keyframes } from 'styled-components'
import QRCode from 'qrcode'
import { apiPost, feenixApiPost, supernovaApiPost } from 'hooks/api'
import { unixToDate } from 'utils/timeHelper'
import { displayAddress, fixedFloat } from 'utils/helper'
import QRModal from 'components/QRModal/QRModal'
import { Anonymizing, Done, Received, Swapping, Progress } from 'assets/anon'

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
`

const brandOrderIdMapper = {
  supernova: {
    name: 'Supernova ID',
    redirectWidget: '/egspectre/supernova-widget',
    fetcher: supernovaApiPost,
    swapAverageTime: 5,
  },
  egspectre: {
    name: 'EGSpectre ID',
    redirectWidget: '/egspectre/swap-widget',
    fetcher: apiPost,
    swapAverageTime: 30,
  },
  feenix: {
    name: 'Feenix ID',
    redirectWidget: '/egspectre/feenix-widget',
    fetcher: feenixApiPost,
    swapAverageTime: 5,
  },
}

const AnimatedSVG = styled.div<{ anim: boolean }>`
  animation-name: ${({ anim }) => (anim ? pulse : 'none')};
  animation-duration: 2s;
  animation-iteration-count: infinite;
  display: inline-block;
`

const Orders: React.FC<React.PropsWithChildren> = () => {
  const router = useRouter()
  const { toastError } = useToast()
  const { egSpectreId } = router.query
  const { isDesktop, isTablet } = useMatchBreakpoints()
  const searchParams = new URLSearchParams(window.location.search)
  const widgetParam = searchParams.get('widget') || 'egspectre'
  console.log({ widgetParam, searchParams })

  const [isLoading, setIsLoading] = useState(true)
  const [orderData, setOrderData] = useState(null)
  const [status, setStatus] = useState(0)
  const [tokenList, setTokenList] = useState([])
  const [qrsrc, setQrsrc] = useState('')
  const [openQr, setOpenQr] = useState(false)

  const getExchangeStatus = async () => {
    const { fetcher } = brandOrderIdMapper[widgetParam]
    const orderRes = await fetcher(`orders/${egSpectreId}`)

    if (orderRes.message === 'Success') {
      setStatus(orderRes.data.status)
      if (orderRes.data.status > 3) {
        if (exchangeStatusInterval) clearInterval(exchangeStatusInterval)
      }
    }
  }

  const getTokenDisplayName = (symbol: string) => {
    if (tokenList) {
      return tokenList.find((token) => token.name === symbol)?.displayName.split(' ')[0] || ''
    }
  }

  const getTokenLogo = (symbol: string) => {
    if (tokenList) {
      return tokenList.find((token) => token.name === symbol)?.logo || ''
    }
  }

  const goTo404 = () => {
    toastError(
      'Your order history has been deleted',
      `This ${brandOrderIdMapper[widgetParam].name} has been deleted after 48 hours for security purposes. For  any further inquiries, contact Support.`,
    )
    router.replace(`/404`)
  }

  let exchangeStatusInterval

  useEffect(() => {
    const { fetcher } = brandOrderIdMapper[widgetParam]
    const getOrderStatus = async () => {
      if (egSpectreId) {
        const orderRes = await fetcher(`orders/${egSpectreId}`)
        console.log('orderRes=>', orderRes)

        setIsLoading(false)
        if (orderRes.code == 404) {
          toastError('Your order was not found')
          router.replace(`/404`)
          return
        }

        if (orderRes.code === 200) {
          const currentTimestamp = Math.floor(Date.now() / 1000)
          const creationTimestamp = orderRes.data.creation_time
          const timeDifference = currentTimestamp - creationTimestamp
          const threshold = 48 * 60 * 60
          if (timeDifference > threshold) goTo404()
          else {
            QRCode.toDataURL(orderRes.data.paying_address, (err, url) => {
              if (err) throw err
              setQrsrc(url)
            })
            setOrderData(orderRes.data)
            setStatus(orderRes.data.status)
            // Store the interval ID in the ref's current property
            exchangeStatusInterval = setInterval(() => getExchangeStatus(), 10000)
          }
        }
        if (orderRes.code === 404) goTo404()
      }
    }
    const getTokenList = async () => {
      const tokenRes = await fetcher('quotes/tokens')
      setTokenList(tokenRes.data)
    }
    getOrderStatus()
    getTokenList()

    // Clear the interval using the interval ID stored in the ref
    return () => {
      clearInterval(exchangeStatusInterval)
    }
  }, [router.query])

  function CountDown() {
    const secondLeft = Math.ceil(orderData.creation_time + 30 * 60 - Date.now() / 1000)
    const { minutes, seconds } = getTimePeriods(secondLeft)
    const [, forceUpdate] = useReducer((s) => s + 1, 0)

    useEffect(() => {
      setInterval(() => forceUpdate(), 1000)
    }, [])

    if (status >= 1 && status < 4) {
      return <span className="text-green-400 ml-1">Received</span>
    }
    if (status === 4) {
      return <span className="text-green-400 ml-1">Completed</span>
    }
    if (status === 5) {
      return <span className="text-red-400 ml-1">Expired</span>
    }
    if (status === 6) {
      return <span className="text-red-400 ml-1">Failed</span>
    }
    if (secondLeft < 0) {
      return <span className="text-red-400 ml-1">Expired</span>
    }

    return (
      <span className="text-[#F0DC62] ml-1">
        {minutes.toString().padStart(2, '0')} : {seconds.toString().padStart(2, '0')}
      </span>
    )
  }

  const getProtocol = (side: string) => {
    if (side === 'from') return orderData.from_network.protocol || orderData.from_network.name
    else return orderData.to_network.protocol || orderData.to_network.name
  }

  const pageInIframe = window.location !== window.parent.location

  const content = (
    <>
      <img src={'/images/anon/order_detail_bg.png'} className="absolute md:hidden" alt="support" />
      <QRModal open={openQr} closeModal={() => setOpenQr(false)} src={qrsrc} />
      <Flex
        width={['789px', '100%']}
        minHeight={'100vh'}
        flexDirection="column"
        position="relative"
        alignItems="center"
      >
        {!pageInIframe && (
          <div className="flex flex-col my-10 w-full text-center">
            <span className="text-[40px] sm:text-[28px] text-[#101F49] font-bold">
              {orderData !== null ? (orderData?.is_anon ? 'Private' : 'Discreet') : ''} Swap Created
            </span>
            <span className="text-[14px] max-w-md text-center mx-auto my-3 font-normal text-[#6491B0] leading-normal">
              In order to initiate your swap, please send the required funds to the wallet address displayed in the
              order.
            </span>
            <div className="text-[12px] mx-auto w-full max-w-[493px] rounded-xl font-normal text-[#8D6009] leading-normal text-center px-[10px] py-2 bg-[#FFC85E]">
              Only Send funds To/From Wallets. <br />
              Funds sent To/From Smart Contracts will not be accepted.
            </div>
          </div>
        )}
        {!isLoading && orderData ? (
          <div
            className={`${
              pageInIframe ? '' : 'mt-2 sm:mt-6 mb-20 sm:mb-6 max-w-[789px]'
            }  rounded-xl  w-full overflow-hidden `}
          >
            <div
              className="flex flex-col p-[30px] sm:px-5 sm:py-7"
              style={{
                background: 'linear-gradient(180deg, #0E1D47 0%, #213366 48.96%, #0E1D47 100%)',
              }}
            >
              <div className="text-[1rem] text-white font-bold flex md:flex-wrap items-center gap-2">
                <p>{brandOrderIdMapper[widgetParam].name}: </p>
                <div className="sm:text-sm font-normal text-[#F0DC62] flex items-center gap-2">
                  {egSpectreId}{' '}
                  <CopyButton
                    color="#F0DC62"
                    width="20px"
                    text={egSpectreId.toString()}
                    tooltipMessage={egSpectreId.toString()}
                  />
                </div>
              </div>
              <span className="text-[1rem] my-[9px] text-white">
                <b>Creation time: </b>{' '}
                <span className="sm:text-[14px] ml-1 text-[#F0DC62]">{unixToDate(orderData.creation_time)}</span>
              </span>
              <span className="text-[1rem] my-[9px] text-white">
                <b>Send your funds in by: </b>{' '}
                <span className="sm:text-[14px] ml-1 text-[#F0DC62]">
                  <CountDown />
                </span>
              </span>
              <div className="flex gap-2 md:flex-col my-[9px] border border-solid border-[#F0DC62] pl-2">
                <div className="flex items-center gap-2 text-[1rem] sm:text-[14px] md:mb-0 mr-4 text-white">
                  Send <span className="text-[#F0DC62]">{orderData.from_amount}</span>
                  <CopyButton
                    color="#F0DC62"
                    width="20px"
                    text={orderData.from_amount}
                    tooltipMessage={orderData.from_amount}
                  />
                  {getTokenDisplayName(orderData.from_symbol)} ({getProtocol('from')})
                </div>

                <div className="flex items-center gap-2 text-[1rem] sm:text-[14px] md:mt-0 text-[#F0DC62] mr-4">
                  <span className="text-white">to:</span> {displayAddress(orderData.paying_address)}
                  <CopyButton
                    color="#F0DC62"
                    width="20px"
                    text={orderData.paying_address}
                    tooltipMessage={displayAddress(orderData.paying_address)}
                  />
                  <img
                    src="/images/anon/qrcode.png"
                    alt="qr"
                    width={23}
                    className="cursor-pointer hover:scale-110"
                    onClick={() => setOpenQr(true)}
                  />
                </div>
                {orderData.memo && (
                  <div className="flex items-center text-white text-[1rem] sm:text-[14px] gap-2">
                    memo: <span className="text-[#F0DC62]">{orderData.memo}</span>
                    <CopyButton color="#F0DC62" width="20px" text={orderData.memo} tooltipMessage={orderData.memo} />
                  </div>
                )}
              </div>
              {isDesktop || isTablet ? (
                <div
                  className="flex flex-row text-base items-center justify-between rounded-lg w-full py-[10px] px-5"
                  style={{
                    background: 'linear-gradient(190deg, #FFF 23.04%, #D1D1D1 92.49%), #BFC8CA',
                  }}
                >
                  <Flex alignItems="center">
                    {fixedFloat(orderData.from_amount)}
                    <img className="mx-2" src={getTokenLogo(orderData.from_symbol)} alt="" width={16} />
                    {getTokenDisplayName(orderData.from_symbol)} ({getProtocol('from')})
                  </Flex>
                  <img
                    className="-mx-4"
                    src={`/images/anon/${orderData?.is_anon ? 'private' : 'discreet'}.svg`}
                    alt="support"
                  />
                  <Flex alignItems="center">
                    {fixedFloat(orderData.to_amount)}
                    <img className="mx-2" src={getTokenLogo(orderData.to_symbol)} alt="" width={16} />
                    {orderData.to_symbol} ({getProtocol('to')})
                  </Flex>
                  <Flex alignItems="center" className="gap-[10px]">
                    <CopyButton
                      color="black"
                      width="20px"
                      text={orderData.to_address}
                      tooltipMessage={displayAddress(orderData.to_address)}
                    />
                    {displayAddress(orderData.to_address)}
                  </Flex>
                </div>
              ) : (
                <div
                  className="flex flex-row items-center justify-between rounded-2xl w-full relative"
                  style={{
                    background: 'linear-gradient(190deg, #FFF 23.04%, #D1D1D1 92.49%), #BFC8CA',
                  }}
                >
                  <div className="w-full flex flex-col py-[25px] pl-[18px] text-[#203264] font-medium items-start border-[#203264] border-solid border-r-2">
                    <div className="flex items-center mb-2 text-base">
                      {fixedFloat(orderData.from_amount)}
                      <img className="ml-2" src={getTokenLogo(orderData.from_symbol)} alt="" width={16} />
                    </div>
                    <div className="text-[12px]">
                      {getTokenDisplayName(orderData.from_symbol)} ({getProtocol('from')})
                    </div>
                    <div className="flex items-center gap-2 text-[12px]">
                      {displayAddress(orderData.paying_address, 4)}
                      <CopyButton
                        color="#203264"
                        width="20px"
                        text={orderData.paying_address}
                        tooltipMessage={displayAddress(orderData.paying_address)}
                      />
                    </div>
                  </div>
                  <div className="w-[42px] h-[42px] bg-[#203264] rounded-full text-[10px] text-white flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                    <img
                      className="-mx-4"
                      src={`/images/anon/${orderData?.is_anon ? 'private1' : 'discreet1'}.svg`}
                      alt="support"
                    />
                  </div>
                  <div className="w-full flex flex-col py-[25px] pr-[18px] items-end font-medium text-[#203264]">
                    <div className="flex items-center mb-2 text-base">
                      {fixedFloat(orderData.to_amount)}
                      <img className="ml-2" src={getTokenLogo(orderData.to_symbol)} alt="" width={16} />
                    </div>
                    <div className="text-[12px]">
                      {getTokenDisplayName(orderData.to_symbol)} ({getProtocol('to')})
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-[#203264]">
                      {displayAddress(orderData.to_address, 4)}
                      <CopyButton
                        color="#203264"
                        width="20px"
                        text={orderData.to_address}
                        tooltipMessage={displayAddress(orderData.to_address)}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="flex flex-row w-full justify-between items-center sm:items-end px-4 sm:px-0 my-10 sm:my-4">
                <div className="flex flex-col items-center sm:w-14 gap-3 sm:gap-0 text-center text-sm sm:text-[10px] text-white font-bold">
                  <div className="flex items-center justify-center w-20 h-20 sm:w-12 sm:h-12 rounded-full">
                    <AnimatedSVG anim={status === 0}>
                      <Received
                        color={status === 0 || status === 5 || status === 6 ? 'white' : '#79D82E'}
                        size={isDesktop || isTablet ? 60 : 20}
                      />
                    </AnimatedSVG>
                  </div>
                  Received
                </div>

                <Progress color="white" />

                {orderData?.is_anon && (
                  <>
                    <div className="flex flex-col items-center sm:w-14 gap-3 sm:gap-0 text-center text-sm sm:text-[10px] text-white font-bold">
                      <div className="flex items-center justify-center w-20 h-20 sm:w-12 sm:h-12 rounded-full">
                        <AnimatedSVG anim={status === 1}>
                          <Anonymizing
                            color={status === 2 || status === 3 || status === 4 ? '#79D82E' : 'white'}
                            size={isDesktop || isTablet ? 60 : 20}
                          />
                        </AnimatedSVG>
                      </div>
                      Anonymizing
                    </div>

                    <Progress color="white" />
                  </>
                )}

                <div className="flex flex-col items-center sm:w-14 gap-3 sm:gap-0 text-center text-sm sm:text-[10px] text-white font-bold">
                  <div className="flex items-center justify-center w-20 h-20 sm:w-12 sm:h-12 rounded-full">
                    <AnimatedSVG anim={status === 2}>
                      <Swapping
                        color={status === 3 || status === 4 ? '#79D82E' : 'white'}
                        size={isDesktop || isTablet ? 60 : 20}
                      />
                    </AnimatedSVG>
                  </div>
                  Swapping
                </div>

                <Progress color="white" />

                <div className="flex flex-col items-center sm:w-14 gap-3 sm:gap-0 text-center text-sm sm:text-[10px] text-white font-bold">
                  <div className="flex items-center justify-center w-20 h-20 sm:w-12 sm:h-12 rounded-full">
                    <AnimatedSVG anim={status === 3}>
                      <Done color={status === 4 ? '#79D82E' : 'white'} size={isDesktop || isTablet ? 60 : 20} />
                    </AnimatedSVG>
                  </div>
                  Done
                </div>
              </div>
              <span className="text-base sm:text-[12px] text-center text-[#F0DC62]">
                Avg.Swap Time: {brandOrderIdMapper[widgetParam].swapAverageTime} minutes
              </span>
              {pageInIframe && (
                <span
                  className="text-base sm:text-[12px] text-center text-[#F0DC62] mt-[15px] cursor-pointer"
                  onClick={() => router.push(brandOrderIdMapper[widgetParam].redirectWidget)}
                >
                  Back to Swap
                </span>
              )}
            </div>
            <div className="w-full pt-7 sm:pt-2 px-2.5 pb-5 sm:pb-3.5 bg-white leading-normal text-[14px] sm:text-[12px] text-center text-[#6491B0]">
              Once <b>‘Received’</b> lights up, in the section displayed above, your transaction is in progress. On
              average, it takes <u>{brandOrderIdMapper[widgetParam].swapAverageTime} minutes</u> for funds to arrive in your Receiving
              wallet.
            </div>
          </div>
        ) : (
          <span>Loading...</span>
        )}

        {!pageInIframe && (
          <div className="flex flex-col bg-white items-center justify-between mb-20 sm:mb-8 pt-5 pb-4 sm:py-[18px] px-16 leading-tight rounded-full max-w-[693px] w-full">
            <span className="text-[30px] text-center font-bold sm:text-[20px] text-[#101F49]">
              Need help with your transaction?
            </span>
            <span className="my-4 sm:my-3 text-sm text-center sm:text-xs text-[#B4B4B4]">
              Raise a ticket in our Discord <b>egswap-support</b> channel
            </span>
            <a target="_blank" href="https://discord.com/channels/825193154999222282/1168559965494059120">
              <img
                src={'/images/anon/discord.png'}
                className="w-[38px] sm:w-[30px] cursor-pointer hover:scale-105 active:scale-100"
                alt="support"
              />
            </a>
          </div>
        )}
      </Flex>
    </>
  )

  if (pageInIframe) return content

  return <Page>{content}</Page>
}
Orders.displayName = 'egspectreOrders'
export default Orders
