export default function getStatus(val: number) {
  if (val === 0) return 'Waiting'
  if (val === 1) return 'received'
  if (val === 2) return 'anonymizing'
  if (val === 3) return 'sendingToWallet'
  if (val === 4) return 'Done'
  if (val === 5) return 'Expired'
  if (val === 6) return 'Failed'
}
