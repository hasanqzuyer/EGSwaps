import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import Slider from 'react-slick'
import useIsMobile from 'hooks/useIsMobile'
import { ADS_EG_API } from 'config/constants/endpoints'

const Content = styled.div`
  width: 100%;
  position: relative;
`

const Container = styled.div`
  width: 60%;
  z-index: 1;
  position: relative;
  margin: 0 auto;
  top: 0px;

  margin-top: 57px;

  /* @media (max-width: 1900px) {
    top: -89px !important;
  } */

  @media (max-width: 1200px) {
    width: 90%;
  }

  /* @media (max-width: 1100px) {
    top: -130px;
  }

  @media (max-width: 930px) {
    top: -69px;
  }

  @media (max-width: 600px) {
    top: -94px;
  } */

  img {
    border-radius: 16px;
    cursor: pointer;
  }
  .slick-dots {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
  }

  .slick-track {
    height: 100px !important;
  }

  .slick-next:before,
  .slick-prev:before {
    opacity: 1;
    color: #000;
    font-size: 25px;
  }

  .slick-next,
  .slick-prev {
    display: block;
    background: #22ce77;
    padding: 2px;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    top: 50% !important;
  }

  .slick-next {
    right: -12px;
  }
  .slick-prev {
    left: -11px;
    z-index: 1;
  }

  .slick-slide {
    height: auto;
    padding: 0px 10px;
  }
`

const Ads: React.FC = () => {
  const [promotions, setPromotions] = useState([])
  const { isMobile, isResponsive } = useIsMobile()

  useEffect(() => {
    axios
      .get(`${ADS_EG_API}/api/v1/images/promotions`)
      .then((response) => {
        const notExpiredPromotions = response.data.filter((e) => new Date(e.expirationDate) > new Date())
        setPromotions(notExpiredPromotions)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        return
      })
  }, [])

  const CustomArrow = (
    props: JSX.IntrinsicAttributes & React.ClassAttributes<HTMLDivElement> & React.HTMLAttributes<HTMLDivElement>,
  ) => (
    <div
      {...props}
      className={`w-10 h-10 bg-[#2CF0D6] cursor-pointer rounded-full flex items-center justify-center absolute ${
        props.dir === 'left' ? '-left-3' : '-right-3'
      } z-10 top-1/3`}
      style={{ display: 'flex !important' }}
    >
      <img src="/images/home2/leftArrow.png" className={`w-[10px] ${props.dir === 'left' ? '' : 'rotate-180'}`} />
    </div>
  )

  // const CustomDot = (props) => <div {...props} className="w-3 h-3 bg-[#2CF0D6] rounded-full"></div>

  const settings = {
    dots: true,
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : isResponsive ? 2 : 3,
    slidesToScroll: isMobile ? 1 : isResponsive ? 2 : 3,
    autoplay: true,
    adaptiveHeight: true,
    prevArrow: <CustomArrow dir="left" />,
    nextArrow: <CustomArrow dir="right" />,
    // customPaging: (i) => <CustomDot key={i} />,
    // centerMode: true,
  }

  const goTo = (link: string, promotionId: number) => {
    axios.post(`${ADS_EG_API}/api/v1/images/analytics`, { type: 'promotions', advertId: promotionId })
    window.open(link, '_blank')
  }
  return promotions?.length ? (
    <Content>
      <Container>
        <Slider {...settings}>
          {promotions.map((promotion) => (
            <img
              onClick={() => goTo(promotion.link, promotion.id)}
              key={promotion.id}
              className="ad"
              src={promotion.base64Img}
              alt="ads"
            />
          ))}
        </Slider>
      </Container>
    </Content>
  ) : (
    <></>
  )
}
export default Ads
