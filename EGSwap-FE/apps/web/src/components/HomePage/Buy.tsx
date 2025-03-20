import React from 'react'
import styled from 'styled-components'
import { getFormattedNumber } from 'utils/helper'
import useGetEGPrice from 'views/Pools/hooks/useGetEGPrice'

const Container = styled.div`
  width: 100%;
  margin-top: 40px;
  display: flex;
  flex-wrap: nowrap:
  justify-content: center;
  align-items: start;
  background: linear-gradient(179.63deg, rgba(0, 0, 0, 0.6) 0.32%, rgba(0, 0, 0, 0) 66.87%), #288DC6;
  gap: 80px;
  padding: 62px 376px 0px;

  @media (max-width: 1550px) {
    padding: 32px 60px;
  }

  @media (max-width: 1200px) {
    flex-wrap: wrap;
    padding: 0px 30px;
    text-align: center;
    gap: 20px;
  }
  
  .links {
    width: 30%;
    
    @media (max-width: 1550px) {
      margin-top: 20px;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }

    .button-container {
      display: flex;
      flex-wrap: nowrap;
      gap: 40px;
      
      button {
        cursor: pointer;
      }

      @media (max-width: 1200px) {
        flex-wrap: wrap;
        width: 100%;
      }
    }

    p {
      font-family: 'Poppins';
      font-style: normal;
      font-weight: 700;
      font-size: 24px;
      line-height: 40px;
      text-transform: uppercase;
      color: #FFFFFF; 
      margin-bottom: 85px;
    }

    button {
      width: 84px;
      height: 46px;
      background: transparent;
      color: white;
      border: 2px solid #FFFFFF;
      border-radius: 12px;
      cursor: pointer;
      
      @media (max-width: 1200px) {
        width: 100%;
      }
    }

    
  }
  .bg {
    width: 40%;
    position: relative;

    img {
      position: absolute;
      top: -100px;
      right: 0px;
      left: 0px;
      width: 400px;
      height: auto;

      @media (max-width: 1550px) {
        display:none;
      }
    }
  }
  .info {
    width: 30%;

    @media (max-width: 1550px) {
      width: 100%;
    }

    .section {
      font-family: 'Poppins';
      color: #FFFFFF;
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 25px;

      p:first-child {
        width: 100%;
        font-weight: 700;
        font-size: 24px;
        line-height: 40px;
      }
      p:last-child {
        width: 100%;
        font-weight: 400;
        font-size: px;
        line-height: 27px;
      }
    }
  }
`
const Buy: React.FC = () => {
  const { egPrice, marketCap, circulatingSupply, tokenSupply } = useGetEGPrice()

  const goTo = (page: string) => {
    const url = page === 'buy' ? '/swap' : 'https://docs.egswap.exchange/'
    window.open(url)
  }

  const noop = () => true

  return (
    <Container>
      <div className="links">
        <p>THE Biggest Social Impact DEFI Project that evolved into the EG Ecosystem</p>
        <div className="button-container">
          <button onClick={() => goTo('buy')} onKeyDown={noop} type="button">
            Buy
          </button>
          <button onClick={() => goTo('learn')} onKeyDown={noop} type="button">
            Learn
          </button>
        </div>
      </div>
      <div className="bg">
        <img src="/images/home/new/hand.png" alt="hand" />
      </div>
      <div className="info">
        <div className="section">
          <p>EG TOKEN</p>
          <p>${egPrice.toFixed(8)}</p>
        </div>
        <div className="section">
          <p>TOTAL SUPPLY</p>
          <p>{getFormattedNumber(tokenSupply, 1).join('')}</p>
        </div>
        <div className="section">
          <p>CIRCULATING SUPPLY</p>
          <p>{getFormattedNumber(circulatingSupply, 1).join('')}</p>
        </div>
        <div className="section">
          <p>MARKET CAP</p>
          <p>{getFormattedNumber(marketCap, 1).join('')}</p>
        </div>
      </div>
    </Container>
  )
}

export default Buy
