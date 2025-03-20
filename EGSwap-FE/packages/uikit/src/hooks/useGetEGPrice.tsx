import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useGetEGPrice = () => {
  const [info, setInfo] = useState<{
    marketCap: string
    price: string
    circulatingSupply: string
    tokenSupply: string
  }>({ marketCap: '0', price: '0', circulatingSupply: '0', tokenSupply: '0' })

  useEffect(() => {
    axios.get('https://egtoken.io/api/token/all-info').then((resp) => {
      setInfo(resp.data)
    })
  }, [])
  return { egPrice: parseFloat(info.price) }
}

export default useGetEGPrice
