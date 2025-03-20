import '@eg-ecosystem-internal/ramp/dist/index.css'

import { CHAIN_IDS } from 'utils/wagmi'
import Ramp from '../views/Ramp'

const RampPage = () => {
  return <Ramp />
}

RampPage.chains = CHAIN_IDS
RampPage.displayName = 'egramp'

export default RampPage
