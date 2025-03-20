import differenceInMinutes from 'date-fns/differenceInMinutes'
import addMinutes from 'date-fns/addMinutes'

const cachedHandler = () => {
  const EXPIRATION_MINUTES = 5

  let cache: {
    expiration: Date
    data: any
  }

  return async (req, res) => {
    try {
      if (req.method === 'GET') {
        if (
          !cache ||
          differenceInMinutes(cache.expiration, new Date(), { roundingMethod: 'ceil' }) > EXPIRATION_MINUTES
        ) {
          // Fetch data for top coins
          const topCoinsResponse = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true&price_change_percentage=7d',
            { headers: { 'accept': 'application/json' } },
          )
          const topCoinsData = await topCoinsResponse.json()

          // Fetch data for TKING coin
          const tkingResponse = await fetch(
            'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=eg-token&sparkline=true&price_change_percentage=7d',
            { headers: { 'accept': 'application/json' } },
          )
          const tkingData = await tkingResponse.json()

          cache = {
            data: [...topCoinsData, ...tkingData],
            expiration: addMinutes(new Date(), EXPIRATION_MINUTES),
          }

          // console.log('refreshing cached data', cache)
        } else {
          console.log('using cached data')
        }

        res.send(cache.data)
      } else {
        // Handle any other HTTP method
      }
    } catch (err) {
      console.log('err:', err)
    }
  }
}

export default cachedHandler()
