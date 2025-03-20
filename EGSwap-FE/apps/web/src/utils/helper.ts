import BigNumber from 'bignumber.js'
import { NUMBER_SYMBOLS } from 'config/constants'

export function displayAddress(addr: string, digit = 6) {
  if (!addr) return ''
  const stringToBeCut = addr.slice(digit, addr.length - digit)
  return addr.replace(stringToBeCut, '...')
}

export const fixedFloat = (val: string, digits = 4) => {
  const input = Number(val)
  const multiplier = parseInt((input * 10 ** digits).toString())
  return multiplier / 10 ** digits
}

export const TimestampToDateString = (timestamp: number) => {
  if (!timestamp) return ''
  // Convert the timestamp to milliseconds
  const timestampInMilliseconds = timestamp * 1000

  // Create a new Date object using the timestamp
  const date = new Date(timestampInMilliseconds)

  // Format the date to 'YYYY-MM-DD'
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  return formattedDate
}

const BIG_THOUSAND = new BigNumber(1000)

export function getFormattedNumber(num: string, decimalPlaces): [BigNumber, string] {
  const bigNum = new BigNumber(num)
  let div = new BigNumber(BIG_THOUSAND)
  let abbrSymbol = 0

  while (bigNum.gte(div)) {
    div = div.multipliedBy(BIG_THOUSAND)
    abbrSymbol++
  }

  const result = bigNum.dividedBy(div.dividedBy(BIG_THOUSAND)).decimalPlaces(decimalPlaces)

  return [result, NUMBER_SYMBOLS[abbrSymbol]]
}

export const numberWithCommas = (value: number) => {
  if (value === null || value === undefined) return ''
  // Add commas for every three digits
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const formatNumber = (number: number) => {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(0) + ' Billion';
  } else if (number >= 1000000) {
    return (number / 1000000).toFixed(0) + ' Million';
  } else {
    return number.toString();
  }
}
