/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'
import cn from 'classnames'
import { ADS_EG_API } from 'config/constants/endpoints'

const Container = styled.div`
  width: 100%;
  font-family: Poppins, sans-serif;
  height: auto;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  font-family: Poppins, sans-serif;
  justify-content: center;
  align-items: center;
  max-width: 931px;
  margin-top: 50px;
  z-index: 100;

  .container-images {
    width: 100%;
    font-family: Poppins, sans-serif;
    height: auto;
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    font-family: Poppins, sans-serif;
    justify-content: center;
    align-items: center;
  }

  .container-center {
    background: transparent;
    /* width: 50%; */
    margin: 0 auto;
    // padding: 21px 24px 29px 24px;
    border-radius: 12px;
    position: relative;
    display: none;
    transition: display 0.5s;

    &.active {
      display: block;
      opacity: 1;
    }

    /* @media (max-width: 1200px) {
      width: 90%;
    } */

    img {
      border-radius: 12px;
      width: 100%;
      height: auto;
      z-index: 0;
      cursor: pointer;
    }
  }

  .title {
    font-family: inherit;
    font-weight: bold;
    font-size: 30px;
    color: white;
    margin-bottom: 15px;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 800;
    font-size: 30px;
    line-height: 45px;
    color: #ffffff;
    text-shadow: 0px 4px 1px rgba(0, 0, 0, 0.1);
  }

  .controller {
    display: flex;
    width: auto;
    justify-content: center;
    flex-wrap: nowrap;
    margin: 20px 0px;

    div {
      border-radius: 100%;
      border: 1px solid #fff;
      background-color: #fff;
      width: 11px;
      height: 11px;
      margin: 0px 5px;
      cursor: pointer;

      &.active {
        background-color: transparent;
      }
    }
  }
`
const Button = styled.button`
  font-family: inherit;
  color: white;
  background: transparent;
  border-radius: 12px;
  padding: 8px 29px;
  border: 2px solid white;
  font-family: 'Poppins';
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  /* identical to box height */

  color: #ffffff;

  text-shadow: 0px 4px 1px rgba(0, 0, 0, 0.1);
`

const Carousel: React.FC = () => {
  const [option, setOption] = useState<number>(0)
  const [data, setData] = useState([])

  const goTo = (url: string, advertId: number) => {
    axios.post(`${FULL_API_URL}/analytics`, { type: 'adverts', advertId })
    window.open(url, '_blank')
  }

  const noop = () => {
    return true
  }

  const API_URL = `${ADS_EG_API}`
  const FULL_API_URL = `${ADS_EG_API}/api/v1/images`

  useEffect(() => {
    axios
      .get(`${FULL_API_URL}/adverts`)
      .then((response) => {
        const notExpiredAdverts = response.data.filter((e) => new Date(e.expirationDate) > new Date())
        setData(notExpiredAdverts)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
        return
      })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setOption((option + 1) % data.length)
    }, 5000)

    return () => {
      clearTimeout(timer)
    }
  }, [option, data.length])

  return (
    <Container>
      <div className="container-images">
        {data && data.length ? (
          data.map((e, idx) => (
            <div key={idx} className={cn('container-center', { active: option === idx })}>
              <img src={e.base64Img} alt="carousel" onClick={() => goTo(e.link, e.id)} />
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
      <div className="controller">
        {data && data.length ? (
          data.map((e, idx) => (
            <div
              key={idx}
              className={option === idx ? 'active' : ''}
              onClick={() => setOption(idx)}
              onKeyDown={noop}
              tabIndex={0}
              role="button"
            />
          ))
        ) : (
          <></>
        )}
      </div>
    </Container>
  )
}

export default Carousel
