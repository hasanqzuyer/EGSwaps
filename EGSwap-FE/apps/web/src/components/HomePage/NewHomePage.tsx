import { useRouter } from 'next/router'
import Ads from './Ads'
import Carousel from './Carousel'
import useIsMobile from 'hooks/useIsMobile'
import EGTokenScroll from './EgTokenScroll'
import { getFormattedNumber } from 'utils/helper'
import useGetEGPrice from 'views/Pools/hooks/useGetEGPrice'
import { EGTOKEN_IO, LIST_YOUR_PROJECT, SOCIAL_IMPACT } from 'config/constants/endpoints'

const Home = () => {
  const { isMobile } = useIsMobile()
  const router = useRouter()
  const { egPrice, marketCap, circulatingSupply, tokenSupply } = useGetEGPrice()

  const openLink = (link: string) => window.open(link, '_blank')

  const EcoSystem = () => {
    const ecoSystemData = [
      {
        title: 'SWAP',
        text: 'Trade any token on BSC and ETH instantly',
        btn: 'TRADE NOW',
        link: '/swap',
        img: 'liquid 1.png',
      },
      {
        title: 'LIQUIDITY',
        text: 'Add liquidity to earn trading fees from every swap',
        btn: 'FUND NOW',
        link: '/liquidity',
        img: 'LIQUIDITY.png',
      },
      {
        title: 'EGSPECTRE',
        text: 'Cross Chain bridge & Private transactions',
        btn: 'BRIDGE NOW',
        link: '/egspectre',
        img: 'EGSPECTRE.png',
      },
      {
        title: 'PERPETUAL',
        text: 'Trade futures with leverage',
        btn: 'TRADE NOW',
        link: '/perp',
        img: 'PERPETUAL.png',
      },
      {
        title: 'BUY CRYPTO',
        text: 'Use EGRamp to buy crypto with credit & debit cards',
        btn: 'BUY NOW',
        link: '/ramp',
        img: 'BUY CRYPTO.png',
      },
    ]
    return (
      <div className="flex mt-[100px] mb-[100px] gap-6 md:grid grid-cols-2 md:gap-2 md:gap-y-9">
        {ecoSystemData.map((item) => (
          <div
            key={item.title}
            className="flex flex-col w-[234px] h-[400px] p-[1.5px] rounded-[24px] md:w-full"
            style={{
              background:
                'linear-gradient(-45deg, rgba(33,197,115,1) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 80%,  rgba(33,197,115,1) 100%)',
            }}
          >
            <div className="flex flex-1 flex-col items-center bg-[#101010] rounded-[24px] p-4">
              <img src={`/images/home2/${item.img}`} className="" />
              <span
                className="text-[24px] font-semibold mt-5 text-center md:text-[18px]"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                }}
              >
                {item.title}
              </span>
              <span className="text-lg font-medium mt-2 text-center md:text-base">{item.text}</span>

              <div
                onClick={() => router.push(item.link)}
                className="py-2 px-4 w-fit text-base font-bold rounded-[50px] mt-auto mb-[-36px] mx-auto text-black bg-gradient-to-r from-cyan-300 to-green-500 border-2 border-solid border-transparent hover:border-[#22CE77] hover:from-transparent hover:to-transparent hover:text-[#22CE77] cursor-pointer"
              >
                {item.btn}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const DefiProducts = () => {
    const defiProducts = [
      {
        title: 'POOLS',
        text: 'Stake tokens and earn rewards with high APR',
        btn: 'STAKE NOW',
        link: '/pools',
        img: 'liquid 1 (1).png',
        colors: ['2CF0D6', '22CE77'],
      },
      {
        title: 'SMARTROUTER',
        text: 'Get the best prices from top liquidity providers',
        btn: 'LEARN MORE',
        link: 'https://docs.egswap.exchange/features/eg-smartrouter',
        img: 'SMARTROUTER.png',
        colors: ['FFF95E', 'D41F45'],
      },
      {
        title: 'BETFI',
        text: 'Predict real world events, win prizes on HeadsTails',
        btn: 'PLAY NOW',
        link: 'https://headstails.xyz/',
        img: 'BETFI.png',
        colors: ['75E1B4', '64ACFF'],
      },
      {
        title: 'BURN PARTY',
        text: 'Create a token burn event & burn tokens transparently',
        btn: 'BURN NOW',
        link: 'https://burn.party/',
        img: 'BURN PARTY.png',
        colors: ['B762FE', '68D6DD'],
      },
      {
        title: 'NFT',
        text: 'Buy and stake Gators to earn EG Token rewards',
        btn: 'STAKE NOW',
        link: 'https://gatorgang.cc/',
        img: 'NFT.png',
        colors: ['9A4CC3', '0162C6'],
      },
    ]

    const navigateTo = (url: string) => {
      if (url.startsWith('https')) window.open(url, '_blank')
      else router.push(url)
    }
    return (
      <div className="flex mt-[100px] mb-[100px] gap-6 md:grid grid-cols-2 md:gap-2 md:gap-y-[75px]">
        {defiProducts.map((item) => (
          <div
            className="flex flex-col w-[234px] h-[400px] p-[1.5px] rounded-[24px] md:w-full"
            style={{
              background: `linear-gradient(-45deg, #${item.colors[0]} 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 80%, #${item.colors[1]} 100%)`,
            }}
          >
            <div className="flex flex-1 flex-col items-center bg-[#101010] rounded-[24px] p-4">
              <img src={`/images/home2/${item.img}`} />
              <span
                className="text-[24px] font-semibold mt-5 text-center md:text-lg"
                style={{
                  backgroundImage: `linear-gradient(90deg, #${item.colors[0]} 0%, #${item.colors[1]} 100%)`,
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                }}
              >
                {item.title}
              </span>
              <span className="text-lg font-medium mt-2 text-center md:text-base">{item.text}</span>

              <div
                onClick={() => navigateTo(item.link)}
                className="py-2 px-4 w-fit text-base font-bold rounded-[50px] mt-auto mb-[-36px] mx-auto text-black hover:scale-105 cursor-pointer"
                style={{
                  backgroundImage: `linear-gradient(90deg, #${item.colors[0]} 0%, #${item.colors[1]} 100%)`,
                }}
              >
                {item.btn}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col w-full bg-black items-center text-white">
      <Carousel />

      <div className="flex max-w-[1280px] md:w-full md:flex-col mt-8 gap-6">
        <div className="flex flex-col max-w-[487px] md:w-full  md:px-4">
          <span className="text-base font-semibold md:text-center">WE DO THINGS DIFFERENTLY</span>
          <span className="text-[54px] font-semibold mt-4 md:text-[40px] md:text-center">
            Trade, Earn & Do Good on a DEX that makes a{' '}
            <span
              style={{
                backgroundImage: 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)',
                backgroundClip: 'text',
                color: 'transparent',
                WebkitBackgroundClip: 'text',
              }}
            >
              Difference
            </span>
          </span>
          <span className="text-base mt-4 md:text-center">
            We are the only DEX in DeFi that rewards project creators by sharing a portion of trading fees. Earn revenue
            & Burn tokens from the activity of your community on our platform.
          </span>

          <div className="flex mt-6 gap-6 md:justify-center">
            <div
              className="rounded-[40px] bg-white flex items-center justify-center  text-black font-bold text-[15px] w-[109px] h-[50px] hover:bg-black hover:text-white  transition-all cursor-pointer"
              style={{ border: '2px solid #FFF' }}
              onClick={() => router.push('/swap')}
            >
              Trade Now
            </div>
            <div
              className="rounded-[40px] bg-black flex items-center h-[50px] px-5 text-white font-bold text-[15px] hover:bg-white hover:text-black transition-all cursor-pointer"
              style={{ border: '2px solid #FFF' }}
              onClick={() => openLink(LIST_YOUR_PROJECT)}
            >
              List Your Project
            </div>
          </div>

          <div className="flex mt-[68px] gap-4 md:flex-col md:items-center">
            <div className="flex flex-col w-[200px]">
              <span className="text-sm text-center">Amongst the Lowest Trading Fees in DeFi </span>
              <div className="flex mt-1 items-center gap-[14px] justify-center">
                <img src="/images/home2/Chart.svg" />
                <span
                  className="text-[36px] font-semibold"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)',
                    backgroundClip: 'text',
                    color: 'transparent',
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  0.25%
                </span>
              </div>
            </div>
            <div className="flex flex-col w-[200px]">
              <span className="text-sm text-center">Trading Fee Reimbursement for whitelisted projects </span>
              <div className="flex mt-1 items-center gap-[14px] justify-center">
                <img src="/images/home2/Cashback.svg" />
                <span
                  className="text-[36px] font-semibold"
                  style={{
                    backgroundImage: 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)',
                    backgroundClip: 'text',
                    color: 'transparent',
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  12%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 w-[793px] relative md:w-full mt-[-130px] md:mt-[-30px]">
          <img src={isMobile ? '/images/home2/Group 47212.png' : '/images/home2/Group 47213.png'} className="w-full" />
        </div>
      </div>

      <img src="/images/home2/mouse.png" className="md:hidden" />
      <span
        className="text-base  mt-2 md:hidden"
        style={{
          backgroundImage: 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)',
          backgroundClip: 'text',
          color: 'transparent',
          WebkitBackgroundClip: 'text',
          zIndex: 1
        }}
      >
        Scroll down
      </span>
      <img src="/images/home2/arrow.svg" className="mt-2 md:hidden" />

      <Ads />

      <div
        className="w-full flex flex-col items-center"
        style={{
          background: 'url(/images/home2/background-2.jpg)',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <span className="text-[#727272] font-semibold text-[40px] mt-[116px]">Discover</span>
        <span className="text-[52px] font-semibold mt-8 md:text-center">EGSwap Ecosystem</span>

        <EcoSystem />
      </div>

      <div
        className="w-full h-[793px] flex justify-center items-center md:h-[495px]"
        style={{ backgroundSize: 'cover' }}
      >
        <img src={isMobile ? '/images/home2/Crack 1.png' : '/images/home2/bg2.png'} className=" w-full" />
        <span
          className="text-[42px] font-bold absolute left-auto right-auto text-center md:text-[32px]"
          style={{
            lineHeight: '129%',
            textShadow:
              '0px 4px 4px rgba(0, 0, 0, 0.25), -8px -8px 29.3px #000, 0px 4px 31.1px #000, -8px -17px 20.2px #000',
          }}
        >
          THE <span className="text-[#27dfa8]">MOST IMPACTFUL DEX</span> <br />
          ON THE PLANET
        </span>
      </div>

      <div
        className="w-full flex flex-col items-center px-2"
        style={{ background: 'url(/images/home2/Group 47209.png)', backgroundSize: 'cover' }}
      >
        <span className="text-[#727272] font-semibold text-[40px] mt-[50px] md:text-center md:text-[32px]">
          Ecosystem Continued
        </span>
        <span className="text-[52px] font-semibold mt-8 md:text-center md:text-[36px]">DeFi Products</span>

        <DefiProducts />
      </div>

      <img src="/images/home2/Frame-bg.jpg" className="w-full md:object-center" />

      <div
        className="flex flex-col w-full max-w-[1280px] p-[1.5px] rounded-[24px] mt-[-125px]"
        style={{
          background:
            'linear-gradient(-45deg, rgba(33,197,115,1) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 80%,  rgba(33,197,115,1) 100%)',
        }}
      >
        <div className="flex flex-1 items-center bg-[#101010] rounded-[24px] py-[100px] px-[75px] md:px-4 md:px-[60px] gap-[45px] md:flex-col">
          <div className="flex flex-[1.5] flex-col">
            <span className="text-[#727272] text-[40px] font-semibold md:text-center md:text-[24px]">
              Switch Your Trading To
            </span>
            <span className="text-[52px] font-semibold text-white mt-2 md:text-center md:text-[36px]">
              EGSwap SmartRouter
            </span>
            <div className="flex mt-6 gap-6 md:flex-col  md:items-center">
              <div
                className="rounded-[40px] bg-black py-3 px-5 text-[#727272] font-semibold text-base md:w-fit"
                style={{ border: '1px solid #727272' }}
              >
                Contract Renounced?
              </div>
              <div
                className="rounded-[40px] bg-black  py-3 px-5 text-[#727272] font-semibold text-base md:w-fit"
                style={{ border: '1px solid #727272' }}
              >
                Liquidity Locked?
              </div>
            </div>

            <span className="mt-[52px] md:text-center" style={{ lineHeight: '133%' }}>
              If you cannot add liquidity to EGSwap, contact us to switch your token’s trading to EGSwap SmartRouter
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-3 md:text-center">
            <span className="text-white text-[18px] font-bold">SmartRouter Benefits :</span>
            <span className="text-[18px] text-white">✓ Use your existing DEX liquidity</span>
            <span className="text-[18px] text-white">✓ Optimise Gas Fees</span>
            <span className="text-[18px] text-white">✓ Searches Top Liquidity Providers</span>
            <span className="text-[18px] text-white">✓ Automatically routes you to cheapest price</span>
            <span className="text-[18px] text-white">✓ Revenue Share from each trade</span>
            <span className="text-[18px] text-white">✓ Token burn from each trade</span>
            <span className="text-[18px] text-white">✓ MEV Bot Protection on every trade</span>
            <div
              onClick={() => openLink(LIST_YOUR_PROJECT)}
              className="h-[65px] px-6 flex items-center justify-center w-[431px] md:w-[318px] text-[22px] font-semibold rounded-[50px] mt-10 mx-auto text-black bg-gradient-to-r from-cyan-300 to-green-500 border border-solid hover:border-[#22ce77] hover:text-[#22ce77] hover:bg-transparent hover:from-transparent hover:to-transparent transition-all cursor-pointer"
            >
              {isMobile ? 'Use Smartrouter today!' : 'Use EGSwap SmartRouter today!'}
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex flex-col w-full items-center mt-[124px] h-[1507px] bg-cover md:bg-center"
        style={{
          backgroundImage: 'url(/images/home2/Globe.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="max-w-[1280px] flex flex-col items-center md:px-4">
          <span className="text-[52px] font-semibold md:text-center md:text-[36px]" style={{ lineHeight: '120%' }}>
            Every Trade contributes to
          </span>
          <span className="text-[52px] font-semibold text-[#27dfa8]  md:text-center md:text-[36px]">
            Global Social Impact
          </span>

          <span className="text-[22px] font-medium my-9 text-center" style={{ lineHeight: 'normal' }}>
            Each Trade results in a buy-back and burn of the EG Token. Buying EG Token results in positive social impact
            around the world. We make direct impact with world-class partners, in accordance with the UN Sustainable
            Development Goals and the guidance of our community. To date, we have donated $3.7 million+ to various good
            causes around the world.
          </span>
          <span className="text-[52px] font-semibold text-[#27dfa8] md:text-center">
            <span className="text-white">Total Impact</span> $3,705,830
          </span>

          <div
            className="rounded-[48px] bg-black  py-3 px-5 text-[#27dfa8] cursor-pointer font-semibold text-[22px] mt-9 hover:text-white hover:bg-gradient-to-r hover:from-cyan-300 hover:to-green-500"
            style={{ border: '1px solid #27dfa8' }}
            onClick={() => openLink(SOCIAL_IMPACT)}
          >
            See our Impact
          </div>

          <img src="/images/home2/arrow 1.svg" className="mt-6" />
        </div>
      </div>

      <div className="max-w-[1280px] flex  gap-[100px] mt-[100px] md:flex-col md:px-4">
        <div className="flex flex-col flex-1">
          <span className="text-[52px] font-bold md:text-[36px]" style={{ lineHeight: '120%' }}>
            Why list your project <span className="text-[#27dfa8]">on EGSwap</span>{' '}
          </span>
          <span className="mt-9 md:text-base" style={{ lineHeight: 'normal' }}>
            We take pride in our unwavering commitment to providing a superior user experience and unparalleled support
            within the decentralized exchange (DEX) landscape.
            <br />
            <br />
            EGSwap has successfully established itself as a trusted DeFi ecosystem, catering to a diverse clientele that
            includes both business-to-business (B2B) and business-to-consumer (B2C) segments.
            <br />
            <br />
            <ul>
              <li>
                <span className="text-[#27dfa8]">Revenue sharing</span> from the volume your community generates, more
                money in your pocket!
              </li>
              <li>
                Every Trade <span className="text-[#27dfa8]">burns</span> a portion of your token supply. Create Staking
                Pools to <span className="text-[#27dfa8]">grow your holders</span>.
              </li>
              <li>
                <span className="text-[#27dfa8]">Advertise</span> on EGSwap and all EG social channels.
              </li>
              <li>
                All the help and tech support you need to <span className="text-[#27dfa8]">grow</span>.
              </li>
              <li>
                Keep your business operations <span className="text-[#27dfa8]">private</span> via EGSpectre.
              </li>
            </ul>
            <br />
            <br />
            Our core ethos centres on the cultivation of enduring partnerships. We firmly believe that our growth is
            intricately linked to the growth of our <span className="text-[#27dfa8]">valued partners</span>, and our
            collective success is a reflection of individual successes.
          </span>
          <div
            className="rounded-[48px] bg-black  h-[65px] w-[325px] flex items-center justify-center text-[#27dfa8] font-bold text-[22px] mt-9 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-300 hover:to-green-500 hover:text-white"
            style={{ border: '1px solid #27dfa8' }}
            onClick={() => openLink(LIST_YOUR_PROJECT)}
          >
            List your project today!
          </div>
        </div>
        <div className="flex flex-[1.2] flex-wrap gap-[22px] md:grid grid-cols-2 md:gap-2 md:gap-y-8">
          <div
            className="flex flex-col w-[304px] h-[400px] p-[1.5px] rounded-[24px] md:w-full"
            style={{
              background:
                'linear-gradient(-45deg, rgba(33,197,115,1) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 80%,  rgba(33,197,115,1) 100%)',
            }}
          >
            <div className="flex flex-1 flex-col items-center bg-[#101010] rounded-[24px] p-4">
              <img src="/images/home2/liquid 1 (2).png" className="" />
              <span
                className="text-[24px] font-semibold mt-5 text-center"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                  lineHeight: '117%',
                }}
              >
                REVENUE SHARING
              </span>
              <span className="text-lg font-medium mt-2 text-center md:text-base">
                Whitelisted projects receive 12% of trading fees back in the form of EG Tokens
              </span>
            </div>
          </div>

          <div
            className="flex flex-col w-[304px] h-[400px] p-[1.5px] rounded-[24px] md:w-full"
            style={{
              background:
                'linear-gradient(-45deg, rgba(33,197,115,1) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 80%,  rgba(33,197,115,1) 100%)',
            }}
          >
            <div className="flex flex-1 flex-col items-center bg-[#101010] rounded-[24px] p-4">
              <img src="/images/home2/m503t0014_sunglasses_12_june22_01 1 (6).png" className="" />
              <span
                className="text-[24px] font-semibold mt-5 text-center"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                  lineHeight: '117%',
                }}
              >
                LOW FEES
              </span>
              <span className="text-lg font-medium mt-2 text-center md:text-base">
                Swap any token pair with the lowest trading fees in the Defi space.
              </span>
            </div>
          </div>

          <div
            className="flex flex-col w-[304px] h-[400px] p-[1.5px] rounded-[24px] md:w-full"
            style={{
              background:
                'linear-gradient(-45deg, rgba(33,197,115,1) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 80%,  rgba(33,197,115,1) 100%)',
            }}
          >
            <div className="flex flex-1 flex-col items-center bg-[#101010] rounded-[24px] p-4">
              <img src="/images/home2/m503t0014_sunglasses_12_june22_01 1 (7).png" className="" />
              <span
                className="text-[24px] font-semibold mt-5 text-center"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                  lineHeight: '117%',
                }}
              >
                COMMUNITY REWARDS
              </span>
              <span className="text-lg font-medium mt-2 text-center md:text-base">
                Reward your community by creating pools to stake your token and earn rewards.
              </span>
            </div>
          </div>

          <div
            className="flex flex-col w-[304px] h-[400px] p-[1.5px] rounded-[24px] md:w-full"
            style={{
              background:
                'linear-gradient(-45deg, rgba(33,197,115,1) 0%, rgba(0,0,0,1) 20%, rgba(0,0,0,1) 50%, rgba(0,0,0,1) 80%,  rgba(33,197,115,1) 100%)',
            }}
          >
            <div className="flex flex-1 flex-col items-center bg-[#101010] rounded-[24px] p-4">
              <img
                src="/images/home2/3d-flying-stack-money-purple-background-money-spendineg-cashless-society-concept 1 (2).png"
                className=""
              />
              <span
                className="text-[24px] font-semibold mt-5 text-center"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #2CF0D6 0%, #22CE77 100%)',
                  backgroundClip: 'text',
                  color: 'transparent',
                  WebkitBackgroundClip: 'text',
                  lineHeight: '117%',
                }}
              >
                DIRECT ACCESS
              </span>
              <span className="text-lg font-medium mt-2 text-center md:text-base">
                Free adverts on EGSwap and access to all EG products & services
              </span>
            </div>
          </div>
        </div>
      </div>

      <EGTokenScroll />

      <img src="/images/home2/arrow 1.svg" className="mt-[100px]" />

      <img src="/images/home2/Vector (1).png" className="mt-[60px]" />
    </div>
  )
}

export default Home
