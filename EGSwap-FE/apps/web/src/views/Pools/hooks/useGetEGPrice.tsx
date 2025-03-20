import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useGetEGPrice = () => {
  const [info, setInfo] = useState<{
    marketCap: string
    price: string
    circulatingSupply: string
    tokenSupply: string
    burned: string
  }>({ marketCap: '0', price: '0', circulatingSupply: '0', tokenSupply: '0', burned: '0' })

  useEffect(() => {
    axios.get('https://egtoken.io/api/token/all-info').then((resp) => {
      setInfo(resp.data)
    })
  }, [])
  const { marketCap, circulatingSupply, tokenSupply, burned } = info
  return { egPrice: parseFloat(info.price), marketCap, circulatingSupply, tokenSupply, burned }
}

export default useGetEGPrice
