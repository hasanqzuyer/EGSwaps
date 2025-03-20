import { cnLink, ssLink, seLink, exLink, chLink, spLink } from "config/constants/endpoints"

export default function getOrderPageLink(flow: string, id: string): string {
  let returnLink = ''
  if (flow === 'cn') returnLink = cnLink
  if (flow === 'ss') returnLink = ssLink
  if (flow === 'se') returnLink = seLink
  if (flow === 'ex') returnLink = exLink
  if (flow === 'ch') returnLink = chLink
  if (flow === 'sp') returnLink = spLink
  return `${returnLink}${id}`
}
