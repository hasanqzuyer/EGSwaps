import { formatDistanceToNowStrict } from 'date-fns'
import moment from 'moment'

export const secondsToDay = (s: number) => Math.floor(s / (24 * 60 * 60))

export const convertTimeToSeconds = (time: string): number => {
  return parseInt(time) * 1000
}

// https://date-fns.org/v2.28.0/docs/formatDistanceToNowStrict
export const distanceToNowStrict = (timeInMilliSeconds: number) => {
  const endTime = new Date(timeInMilliSeconds)
  return new Date() > endTime || !Number.isFinite(timeInMilliSeconds)
    ? `0 seconds`
    : formatDistanceToNowStrict(endTime, { unit: 'day' })
}

export const distanceToNowStrictWithUnit = (
  timeInMilliSeconds: number,
  unit: 'month' | 'day' | 'second' | 'minute' | 'hour' | 'year',
) => {
  const endTime = new Date(timeInMilliSeconds)
  return new Date() > endTime || !Number.isFinite(timeInMilliSeconds)
    ? `0 seconds`
    : formatDistanceToNowStrict(endTime, { unit })
}

export const unixToDate = (timeInSeconds: number): string => {
  // Multiply the Unix timestamp by 1000 to convert it to milliseconds
  const timeInMilliseconds = timeInSeconds * 1000;

  // Use moment to format the date and time
  const formattedDate = moment(timeInMilliseconds).format('DD/MM/YYYY, HH:mm:ss');

  return formattedDate;
}
