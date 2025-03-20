export default function getExchangeName(flowShortName: string) {
  if (flowShortName === 'cn') return 'ChangeNow (cn)'
  if (flowShortName === 'ff') return 'FixedFloat (ff)'
  if (flowShortName === 'ss') return 'SimpleSwap (ss)'
  if (flowShortName === 'se') return 'Stealthex (se)'
  if (flowShortName === 'ex') return 'Exolix (ex)'
  if (flowShortName === 'ch') return 'ChangeHero (ch)'
  if (flowShortName === 'sp') return 'SwapSpace (sp)'
}
