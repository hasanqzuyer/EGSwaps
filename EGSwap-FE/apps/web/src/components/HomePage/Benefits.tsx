/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

import WaveIcon from '../../assets/WaveIcon'

const Container = styled.div`
  font-family: 'Poppins';
  position: relative;
  background-color: transparent;
  overflow: hidden;
  .title {
    font-style: normal;
    font-weight: 600;
    font-size: 42px;
    line-height: 63px;
    text-align: center;
    color: #0c4e70;
    margin: 53px 0;
    background-color: transparent;
    z-index: 1;
    position: relative;
  }

  .benefits-container {
    display: flex;
    flex-wrap: wrap;
    max-width: 1000px;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    gap: 20px;
    position: relative;

    @media (max-width: 1200px) {
      padding: 0px 4%;
    }
  }

  .benefits-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 20px 68px;
    padding: 0px 190px;
    position: relative;
    margin-top: 5em;

    @media (max-width: 1200px) {
      padding: 0px 2%;
    }

    .wallet-img,
    .medal-img {
      position: absolute;
    }

    .wallet-img {
      position: absolute;
      left: 0px;
      top: -600px;
      width: 28rem;

      @media (max-width: 1550px) {
        display: none;
      }
    }
    .title-list {
      font-family: 'Poppins';
      font-weight: 600;
      font-size: 42px;
      color: #4888b5;
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 40px 0px;

      @media (max-width: 1200px) {
        text-align: center;
      }
    }
    .button-container {
      width: 100%;
      margin-top: 100px;
      a {
        cursor: pointer;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 502px;
        height: 66px;
        border-radius: 12px;
        border: 2px solid #4888b5;
        color: #4888b5;
        background-color: transparent;
        font-family: 'Poppins';
        font-style: normal;
        font-weight: 700;
        font-size: 26px;
        line-height: 39px;
        text-align: center;
        color: #278cc4;

        @media (max-width: 1200px) {
          width: 100%;
          padding: 20px;
          height: auto;
        }
      }
    }
  }

  .wallet-img,
  .medal-img {
    position: absolute;
  }

  .medal-img {
    right: 0px;
    width: 300px;
    top: -59px;
    @media (max-width: 1200px) {
      opacity: 0.3;
    }
  }
`

const Benefit = styled.div<{ box: boolean }>`
  background: ${(props: any) => (props.box ? '#ffffff' : 'transparent')};
  box-shadow: ${(props: any) => (props.box ? '0px 4px 12px rgba(0, 0, 0, 0.25)' : 'inherit')};
  border-radius: 12px;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: ${(props: any) => (props.box ? '271px' : '214px')};
  height: ${(props: any) => (props.box ? '354px' : 'auto')};
  padding: ${(props: any) => (props.box ? '34px 17px' : '0px')};
  gap: ${(props: any) => (props.box ? '20px' : '20px 70px')};
  text-align: center;
  transition: all ease 0.2s;

  &:hover {
    cursor: pointer;
    scale: 1.01;
  }
  &:active {
    scale: 1;
  }

  div {
    color: ${(props: any) => (props.box ? '#000000' : '#4888B5')};
    font-family: 'Poppins';
    width: auto;
  }

  img {
    width: ${(props: any) => (props.box ? '136px' : '88px')};
    height: ${(props: any) => (props.box ? '136px' : '88px')};
  }

  div:nth-child(2) {
    font-family: 'Poppins';
    font-weight: 700;
    font-size: 20px;
  }

  div:nth-child(3) {
    font-weight: 400;
    font-size: 14px;
    text-align: center;
    color: #000000;
    line-height: 21px;
  }
  span {
    color: white;
    background-color: #c60000;
    border-radius: 4px;
    padding: 3px 7px;
    text-transform: uppercase;
  }
`

const WaveBackground = styled(WaveIcon)`
  z-index: 0;
  width: 100%;
`
const Benefits: React.FC = () => {
  const router = useRouter()
  const benefits = [
    {
      id: 1,
      title: 'Decentralized Control',
      subtitle: 'Not Controlled by any single entity or organization',
      imgSrc: 'benefits-decentralized.png',
    },
    {
      id: 2,
      title: 'Low Exchange Fees',
      subtitle:
        'Safely buy and sell your cryptocurrency with exchange fees that are among the lowest in the DeFi space.',
      imgSrc: 'benefits-exchanges.png',
    },
    {
      id: 3,
      title: 'Security',
      subtitle: 'You are in control of your cryptocurrency. Remember, Not your keys, Not your Crypto!',
      imgSrc: 'benefits-security.png',
    },
    {
      id: 4,
      title: 'Enhanced Accessibility',
      subtitle:
        'No dependency on a central server or infrastructure, access from anywhere in the world. Our DEX is also optimised for mobile devices.',
      imgSrc: 'benefits-enhanced.png',
    },
    {
      id: 5,
      title: 'Trade Perpetuals',
      subtitle: 'Trade perpetual futures on EGSwap with up to 200x leverage.',
      imgSrc: 'benefits-trade.png',
    },
    {
      id: 6,
      title: 'Social Impact',
      subtitle:
        'Each trade results in buy-back and burn of EG Token. Buying EG token results in positive social impact around the world.',
      imgSrc: 'benefits-social-impact.png',
    },
    {
      id: 7,
      title: 'EGRamp',
      subtitle: 'Buy/Sell crypto with credit & debit cards. EGRamp simplifies the onboarding process for all users.',
      imgSrc: 'benefits-limit.png',
    },
    {
      id: 8,
      title: 'Multichain support',
      subtitle: 'Begin trading across multiple blockchains for unmatched liquidity and diversity.',
      imgSrc: 'benefits-multichain.png',
    },
    {
      id: 9,
      title: 'EGSpectre',
      subtitle:
        'Trade or transfer crypto anonymously. A practical and compliant solution for legitimate users seeking financial privacy.',
      imgSrc: 'benefits-spectre.png',
      navigateTo: '/egspectre',
    },
  ]

  const benefitsList = [
    {
      id: 1,
      title: 'Revenue Sharing',
      subtitle: 'Whitelisted projects receive 12% of trading fees back in the form of EG Tokens',
      imgSrc: 'list1.png',
    },
    {
      id: 2,
      title: 'Low Fees',
      subtitle: 'Enjoy the lowest trading fees in the DeFi space.',
      imgSrc: 'list2.png',
    },
    {
      id: 3,
      title: 'Community Rewards',
      subtitle: 'Reward your community by creating pools to stake your token and earn rewards.',
      imgSrc: 'list3.png',
    },
    {
      id: 4,
      title: 'Direct Access',
      subtitle: 'Free listing on EGTrade, our Swap and Charting solution.',
      imgSrc: 'list4.png',
    },
  ]

  const handleNavigate = (benefit) => {
    if (benefit.navigateTo) router.push(benefit.navigateTo)
  }

  return (
    <Container>
      <div className="title">Our Benefits</div>
      <WaveBackground />
      <img className="medal-img" src="/images/home/new/medal.png" alt="medal" />
      <div className="benefits-container">
        {benefits.map((benefit, idx) => {
          return (
            <Benefit key={idx} box onClick={() => handleNavigate(benefit)}>
              <img src={`/images/home/new/${benefit.imgSrc}`} alt={benefit.title} />
              <div>{benefit.title}</div>
              <div>{benefit.subtitle}</div>
            </Benefit>
          )
        })}
      </div>
      <div className="benefits-list">
        <img className="wallet-img" src="/images/home/new/wallet.png" alt="wallet" />
        <div className="title-list"> Why list your project on EGSwap? </div>
        {benefitsList.map((benefit, idx) => {
          return (
            <Benefit key={idx} box={false}>
              <img src={`/images/home/new/${benefit.imgSrc}`} alt={benefit.title} />
              <div>{benefit.title}</div>
              <div>{benefit.subtitle}</div>
            </Benefit>
          )
        })}
        <div className="button-container">
          <a href="https://forms.gle/P69NHgHncL2yRVXC7" target="_blank" rel="noreferrer noopener">
            APPLY TO WHITELIST YOUR PROJECT
          </a>
        </div>
      </div>
    </Container>
  )
}

export default Benefits
