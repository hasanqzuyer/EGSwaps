import { ANON_API, FEENIX_API } from 'config/constants/endpoints'
import { useEffect, useState } from 'react'

/* eslint-disable camelcase */
export interface DeBankTvlResponse {
  id: string
  chain: string
  name: string
  site_url: string
  logo_url: string
  has_supported_portfolio: boolean
  tvl: number
}

export const useGetStats = () => {
  const [data, setData] = useState<DeBankTvlResponse | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://openapi.debank.com/v1/protocol?id=bsc_pancakeswap')
        const responseData: DeBankTvlResponse = await response.json()

        setData(responseData)
      } catch (error) {
        console.error('Unable to fetch data:', error)
      }
    }

    fetchData()
  }, [setData])

  return data
}

export const apiPost = async (
  endpoint: string,
  params = null,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  signal: any = null,
  user = 'user',
) => {
  const headers = new Headers()
  headers.append('Content-Type', 'application/x-www-form-urlencoded')
  if (user === 'admin') {
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('@egspectreToken'))
  }

  let body: URLSearchParams | undefined

  if (method === 'POST' && params !== null) {
    body = new URLSearchParams()
    Object.keys(params).forEach((key) => {
      body!.append(key, String(params[key]))
    })
  }

  const getOptions: RequestInit = {
    method,
    headers,
    redirect: 'follow',
  }

  const postOptions: RequestInit = {
    ...getOptions,
    body: body ? body : undefined, // Include the body if it exists, otherwise, omit it.
    signal,
  }

  const url = `${ANON_API}/${endpoint}`;
  try {
    const result = await fetch(url, method === 'GET' ? getOptions : postOptions)
    const data = await result.json()
    return data
  } catch (error) {
    console.log('api error', error)
    return { message: error }
  }
}

export const feenixApiPost = async (
  endpoint: string,
  params = null,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  signal: any = null,
  user = 'user',
) => {
  const headers = new Headers()
  headers.append('Content-Type', 'application/x-www-form-urlencoded')
  headers.append('x-api-key', '5fbde46d-4aff-494f-a036-9425b1979fcb')
  if (user === 'admin') {
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('@egspectreToken'))
  }

  let body: URLSearchParams | undefined

  if (method === 'POST' && params !== null) {
    body = new URLSearchParams()
    Object.keys(params).forEach((key) => {
      body!.append(key, String(params[key]))
    })
  }

  const getOptions: RequestInit = {
    method,
    headers,
    redirect: 'follow',
  }

  const postOptions: RequestInit = {
    ...getOptions,
    body: body ? body : undefined, // Include the body if it exists, otherwise, omit it.
    signal,
  }

  const url = `${FEENIX_API}/${endpoint}`;
  try {
    const result = await fetch(url, method === 'GET' ? getOptions : postOptions)
    const data = await result.json()
    return data
  } catch (error) {
    console.log('api error', error)
    return { message: error }
  }
}

export const supernovaApiPost = async (
  endpoint: string,
  params = null,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  signal: any = null,
  user = 'user',
) => {
  const headers = new Headers()
  headers.append('Content-Type', 'application/x-www-form-urlencoded')
  headers.append('x-api-key', 'e7290d4c-d571-4feb-8559-13af3c0ce7c0')
  if (user === 'admin') {
    headers.append('Authorization', 'Bearer ' + localStorage.getItem('@egspectreToken'))
  }

  let body: URLSearchParams | undefined

  if (method === 'POST' && params !== null) {
    body = new URLSearchParams()
    Object.keys(params).forEach((key) => {
      body!.append(key, String(params[key]))
    })
  }

  const getOptions: RequestInit = {
    method,
    headers,
    redirect: 'follow',
  }

  const postOptions: RequestInit = {
    ...getOptions,
    body: body ? body : undefined, // Include the body if it exists, otherwise, omit it.
    signal,
  }

  const url = `${ANON_API}/${endpoint}`;
  try {
    const result = await fetch(url, method === 'GET' ? getOptions : postOptions)
    const data = await result.json()
    return data
  } catch (error) {
    console.log('api error', error)
    return { message: error }
  }
}
