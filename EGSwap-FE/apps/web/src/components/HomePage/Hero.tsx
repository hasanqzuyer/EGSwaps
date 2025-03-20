import React from 'react'
import styled from 'styled-components'
import Ads from './Ads'
import Carousel from './Carousel'
import HeroContent from './HeroContent'

const Container = styled.div`
  background: linear-gradient(
      345.03deg,
      rgba(0, 20, 8, 0.5) 21.18%,
      rgba(115, 115, 115, 0.065) 58.48%,
      rgba(255, 255, 255, 0.41) 85.03%
    ),
    #1687d8;
  padding: 40px 0px 80px 0px;
  position: relative;
  z-index: 1;

  .bg {
    position: absolute;
    bottom: 200px;
    z-index: -1;
    opacity: 1;
    width: 38%;
    right: 100px;
    
    @media (max-width: 1550px) {
      opacity: 0.3 !important;
      right: 41px;
    }

    @media (max-width: 2500px) {
      width: auto;
      opacity: 1;
    }
  }

  .powered {
    width: 70%;
    margin: 40px auto;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    align-items: center;
    justify-content: right;
    cursor: default;

    @media (max-width: 1200px) {
      justify-content: center;
    }

    div {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 212px;
      height: 43px;
      border: 2px solid #ffffff;
      border-radius: 12px;
      color: white;
      font-weight: bold;
      margin: 80px 0px;
    }
  }
`
const Hero: React.FC = () => {
  return (
    <>
      <Container>
        <Carousel />
        <HeroContent />
        <div className="powered">
          <div>POWERED BY EG</div>
        </div>
        <img className="bg" src="/images/home/new/home_background.png" alt="home-background" />
      </Container>
      <Ads />
    </>
  )
}

export default Hero
