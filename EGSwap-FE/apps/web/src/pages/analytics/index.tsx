import React from 'react'
import Head from 'next/head'
import useGetEGPrice from 'views/Pools/hooks/useGetEGPrice'
import { formatNumber, numberWithCommas } from 'utils/helper'

type Props = {}

const EGToken = () => {
  const { egPrice, marketCap, circulatingSupply, tokenSupply, burned } = useGetEGPrice()
  const egTokenData = [
    { title: 'Holders', value: '16,150' },
    { title: 'Buy Tax', value: '0%' },
    { title: 'Sell Tax', value: '5%' },
    { title: 'Transfer Tax', value: '0%' },
    { title: 'Total Supply', value: formatNumber(parseFloat(tokenSupply)) },
    { title: 'Circulating Supply', value: numberWithCommas(parseInt(circulatingSupply)) },
    { title: 'Total Burnt', value: numberWithCommas(parseInt(burned)) },
    { title: 'Price', value: egPrice.toFixed(4) },
    { title: 'Market Cap', value: `$${numberWithCommas(parseInt(marketCap))}` },
  ]
  return (
    <div className="flex flex-col">
      <SubTitle title="EG Token" img="EG Token.png" />
      <>
        <div className="flex flex-col gap-6 md:gap-1">
          <div className="w-full flex flex-row md:flex-wrap gap-6 md:gap-[4%]">
            {egTokenData.slice(0, 4).map((item, index) => (
              <Card key={index} info={item} mobileWidth />
            ))}
          </div>
          <div className="w-full flex flex-row md:flex-col gap-6 md:gap-1">
            {egTokenData.slice(4, 7).map((item, index) => (
              <Card key={index} info={item} />
            ))}
          </div>
          <div className="w-full flex flex-row md:flex-col gap-6 md:gap-[4%]">
            {egTokenData.slice(7, 9).map((item, index) => (
              <Card key={index} info={item} />
            ))}
          </div>
        </div>
      </>
    </div>
  )
}

const Volume = () => {
  const volumeData = [
    { title: 'EGSwap SmartRouter Volume (7 Days)', value: '$338,985' },
    { title: 'EGToken Volume (7 Days)', value: '$420,152' },
    { title: 'EGSpectre Volume (7 Days)', value: '$526,542' },
    { title: 'EGRamp Volume (7 Days)', value: '$50,985' },
    { title: 'EGSwap $EG Buybacks to Date', value: '31.25 BNB' },
    { title: 'Rewards Given on HeadsTails to Date', value: '$7,103' },
    { title: 'Burnt on Burn.Party to Date', value: '$137,612' },
    { title: 'Total EG Staked', value: '50,840' },
    { title: 'Total Gas Saved (EGSpectre)', value: '$20,510' },
  ]
  return (
    <div className="flex flex-col">
      <SubTitle title="Volume" img="Volume.png" />
      <>
        <div className="flex flex-col gap-6 md:gap-1">
          <div className="w-full flex flex-row md:flex-wrap gap-6 md:gap-[4%]">
            {volumeData.slice(0, 3).map((item, index) => (
              <Card key={index} info={item} mobileWidth={index !== 0} />
            ))}
          </div>
          <div className="w-full flex flex-row md:flex-wrap gap-6 md:gap-[4%]">
            {volumeData.slice(3, 6).map((item, index) => (
              <Card key={index} info={item} mobileWidth={index !== 2} />
            ))}
          </div>
          <div className="w-full flex flex-row md:flex-wrap gap-6 md:gap-[4%]">
            {volumeData.slice(6, 9).map((item, index) => (
              <Card key={index} info={item} />
            ))}
          </div>
        </div>
      </>
    </div>
  )
}

const RevenueDistribution = () => (
  <div className="flex flex-col">
    <SubTitle title="Revenue Distribution" img="Revenue.png" />
    <img src="/images/analytics/Distribution.png" className="w-full" alt="" />
  </div>
)

const GatorGangNFT = () => {
  const gatorData = [
    { title: 'Total Minted', value: '7,709' },
    { title: 'Total Burnt', value: '3,723' },
    { title: 'Left to Mint', value: '1,182' },
    { title: 'Legendary Found', value: '42/64' },
  ]
  return (
    <div className="flex flex-col">
      <SubTitle title="Gator Gang NFTs" img="Gator.png" />
      <>
        <div className="flex flex-col gap-6">
          <div className="w-full flex flex-row md:flex-wrap gap-6 md:gap-[4%]">
            {gatorData.map((item, index) => (
              <Card key={index} info={item} mobileWidth />
            ))}
          </div>
        </div>
      </>
    </div>
  )
}

const NFTStaking = () => {
  const nftStakingData = [
    { title: 'Total Gators Staked:', value: '1,667' },
    { title: 'Legendary Staked:', value: '24' },
    { title: 'Common NFT Staked:', value: '1,219' },
    { title: 'All Squad Holders:', value: '53' },
    { title: 'Total Rewards Given:', value: '11,734,870 EG' },
    { title: 'Last Rewards Distribution:', value: '31 December 2024' },
    { title: 'Legendary Reward:', value: '33,750 EG' },
    { title: 'All-Squad Reward:', value: '11,886 EG' },
    { title: 'Common Reward:', value: '295 EG' },
  ]
  return (
    <div className="flex flex-col">
      <SubTitle title="NFT Staking" img="Staking.png" />
      <>
        <div className="flex flex-col gap-6 md:gap-1">
          <div className="w-full flex flex-row md:flex-wrap gap-6 md:gap-[4%]">
            {nftStakingData.slice(0, 4).map((item, index) => (
              <Card key={index} info={item} mobileWidth />
            ))}
          </div>
          <div className="w-full flex flex-row md:flex-col gap-6 md:gap-1">
            {nftStakingData.slice(4, 6).map((item, index) => (
              <Card key={index} info={item} mobileWidth={false} />
            ))}
          </div>
          <div className="w-full flex flex-row md:flex-wrap gap-6 md:gap-[4%]">
            {nftStakingData.slice(6, 9).map((item, index) => (
              <Card key={index} info={item} mobileWidth={index !== 2} />
            ))}
          </div>
        </div>
      </>
    </div>
  )
}

const Visitors = () => {
  const gatorData = [
    { title: 'EGToken.io', value: '10,581' },
    { title: 'EGSwap.exchange', value: '38,615' },
  ]
  return (
    <div className="flex flex-col">
      <SubTitle title="Website Visitors (30 Days)" img="Visitors.png" />
      <>
        <div className="flex flex-col gap-6">
          <div className="w-full flex flex-row gap-6 md:gap-[4%]">
            {gatorData.map((item, index) => (
              <Card key={index} info={item} mobileWidth />
            ))}
          </div>
        </div>
      </>
    </div>
  )
}

const SocialImpact = () => {
  const socialData = [
    { title: 'Total Donated', value: '$3,705,839' },
    { title: 'Largest Single Donation', value: '$800,000' },
    { title: 'SDG Goals Met', value: '12/17' },
    { title: 'Trash Removed from Oceans:', value: '180K+ LBS' },
    { title: 'Medical Relief', value: '$1 Million+' },
    { title: 'Schools Built', value: '1' },
    { title: 'Meals Provided', value: '150K+ Meals' },
  ]
  return (
    <div className="flex flex-col">
      <SubTitle title="Social Impact" img="Social.png" />
      <>
        <div className="flex flex-col gap-6 md:gap-1">
          <div className="w-full flex flex-row gap-6 md:gap-[4%]">
            {socialData.slice(0, 2).map((item, index) => (
              <Card key={index} info={item} mobileWidth />
            ))}
          </div>
          <div className="w-full flex flex-row gap-6 md:gap-[4%]">
            {socialData.slice(2, 4).map((item, index) => (
              <Card key={index} info={item} mobileWidth />
            ))}
          </div>
          <div className="w-full flex flex-row md:flex-wrap gap-6 md:gap-[4%]">
            {socialData.slice(4, 7).map((item, index) => (
              <Card key={index} info={item} mobileWidth={index !== 2} />
            ))}
          </div>
        </div>
      </>
    </div>
  )
}

const Community = () => {
  const communityData = [
    { title: 'Telegram', value: '10.8K' },
    { title: 'Discord', value: '32K' },
    { title: 'X', value: '118K' },
    { title: 'Youtube', value: '5K' },
    { title: 'Reddit', value: '33.1K' },
    { title: 'Facebook', value: '19.3K' },
    { title: 'Instagram', value: '24.9K' },
  ]
  return (
    <div className="flex flex-col relative z-10">
      <SubTitle title="Community" img="Community.png" />
      <>
        <div className="flex flex-col gap-6 md:gap-1">
          <div className="w-full flex flex-row md:flex-wrap gap-6 md:gap-[4%]">
            {communityData.slice(0, 4).map((item, index) => (
              <Card key={index} info={item} mobileWidth />
            ))}
          </div>
          <div className="w-full flex flex-row md:flex-wrap gap-6 md:gap-[4%]">
            {communityData.slice(4, 7).map((item, index) => (
              <Card key={index} info={item} mobileWidth={index !== 2} />
            ))}
          </div>
        </div>
      </>
    </div>
  )
}

const Analytics = (props: Props) => {
  return (
    <div className="bg-[#04142C] min-h-screen pb-36">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;700&display=swap" rel="stylesheet" />
        <style>
          {`
            body {
              font-family: 'Ubuntu', sans-serif !important;
            }
          `}
        </style>
      </Head>
      <div className="max-w-[1120px] w-[90%] md:w-full mx-auto md:px-4 relative z-10 pt-24 md:pt-12">
        <div className="flex items-center justify-center rounded-xl md:h-[230px] h-[284px] bg-cover bg-[url(/images/analytics/hero.jpg)] bg-center">
          <h3
            style={{ textShadow: '0 0 20px grey', fontFamily: 'Ubuntu' }}
            className=" text-white text-5xl font-bold -tracking-wider text-center"
          >
            EG Ecosystem Analytics
          </h3>
        </div>
        <EGToken />
        <Volume />
        <RevenueDistribution />
        <GatorGangNFT />
        <NFTStaking />
        <Visitors />
        <SocialImpact />
        <Community />
      </div>
      <div className="block md:hidden bg-gradient-to-t from-[#023A9C] to-[#5085E2] max-w-[1192px] w-[90%] h-[254px] mx-auto -mt-28 rounded-xl z-0 relative"></div>
    </div>
  )
}

export default Analytics

const SubTitle = ({ title, img }) => (
  <div className="flex items-center my-1 md:justify-center">
    <img src={`/images/analytics/${img}`} className="w-[42px]" alt={title} />
    <span className="text-white font-bold text-[32px] md:text-2xl ml-3 my-[26px] text-center">{title}</span>
  </div>
)

const Card = ({ info, mobileWidth = false, className = '' }) => {
  const isSpecialCard = info.title === 'Rewards Given on HeadsTails to Date' || info.title === 'Legendary Staked:'
  return (
    <div
      className={`flex flex-col bg-[#F4F7FC] items-center justify-around w-full ${
        mobileWidth ? 'md:w-[48%]' : ''
      } h-[176px] md:h-[140px] md:mb-2 bg-cover bg-center rounded-xl relative overflow-hidden ${
        isSpecialCard ? '!bg-gradient-to-r !from-transparent !to-[#C6D7F4]' : ''
      } ${className}`}
      style={{ backgroundImage: 'url(/images/analytics/cardbg.png)', boxShadow: '0 0 15px #0000002B' }}
    >
      <img
        src="/images/analytics/cardbg.png"
        className={`absolute w-full ${isSpecialCard ? 'block' : 'hidden'}`}
        alt=""
      />
      <p className="text-[#aaa] font-medium text-sm md:text-xs text-center">{info.title}</p>
      <h3 className="text-[#5085E2] font-bold text-[52px] lg:text-[32px] -tracking-wider">{info?.value}</h3>
    </div>
  )
}
