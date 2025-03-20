import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  margin-top: 70px;
  width: 72%;
  padding: 0px 21%;
  position: relative;

  @media (max-width: 1550px) {
    width: 100%;
    padding: 0px 10%;
  }

  .title {
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 700;
    font-size: 36px;
    line-height: 48px;

    color: #ffffff;
  }

  .trade-info {
    display: flex;
    flex-wrap: nowrap;
    justify-content: start;
    margin-top: 40px;
    align-items: center;

    @media (max-width: 1550px) {
      flex-wrap: wrap;
      gap: 20px;
    }

    a {
      background-color: #f0dc62;
      border-radius: 10px;
      padding: 12px 24px;
      font-family: 'Poppins';
      font-weight: 700;
      font-size: 26px;
      line-height: 39px;
      text-align: center;
      color: #1e85cf;
      margin: 0px 10px 0px 0px;
    }

    div {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      margin: 0px 0px 0px 10px;
      color: #f0dc62;
    }

    img {
      position: absolute;
      width: 28%;
      left: -40px;
      top: -150px;

      @media (max-width: 1550px) {
        display: none;
      }

      @media (max-width: 2500px) {
        width: 417px;
        opacity: 1;
      }
    }
  }

  .sub-info {
    display: flex;
    font-family: 'Poppins';
    margin-top: 40px;
    margin-left: 10px;
    width: 100%;
    justify-content: space-between;

    @media (max-width: 1550px) {
      flex-wrap: wrap;
      gap: 20px;
    }
    .section {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 21px;
      text-align: center;
      color: #ffffff;
      text-align: center;

      &:nth-child(1) {
        margin-right: 10px;
      }

      p {
        font-weight: 600;
        font-size: 36px;
        line-height: 54px;
        color: #f0dc62;
      }
    }
  }
`

const BlurLine = styled.div`
  width: 158px;
  height: 6px;
  background: rgb(0 0 0 / 30%);
  -webkit-filter: blur(5px);
  filter: blur(5px);
  margin: 15px auto;
  border-radius: 44%;
`

const HeroContent: React.FC = () => {
  return (
    <Container>
      <div className="title">
        Trade, Earn & Do Good on a <br />
        DEX that makes a difference
      </div>
      <div className="trade-info">
        <img src="/images/home/new/rocket.png" alt="rocket" />
        <a href="/swap" type="button">
          TRADE NOW
        </a>
        <div>
          Swap any token on Binance <br />
          Smart Chain Instantly.
        </div>
      </div>
      <div className="sub-info">
        <div className="section">
          <div>Among the Lowest Trade Fees in the DeFi Space</div>
          <div>
            {/* <img src="/images/home/new/percent1.png" alt="percent" /> */}
            <p>0.25%</p>
          </div>
          <BlurLine />
        </div>
        <div className="section">
          <div>Exchange Fee Reimbursement for whitelisted projects</div>
          <div>
            {/* <img src="/images/home/new/percent2.png" alt="percent" /> */}
            <p>12%</p>
          </div>
          <BlurLine />
        </div>
      </div>
    </Container>
  )
}

export default HeroContent
