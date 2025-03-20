import { CHAIN_IDS } from 'utils/wagmi'
import Swap from '../views/Swap'
import { SwapFeaturesProvider } from '../views/Swap/SwapFeaturesContext'
import { useTheme } from "@pancakeswap/hooks";  

const SwapPage = () => {
  const { isDark } = useTheme();
  return (
    <>
      <SwapFeaturesProvider>
        <Swap />
      </SwapFeaturesProvider>
      <style jsx global>{`
        body {
          background: ${isDark ? "#181818" : "#f4f4f4"};
        }
      `}</style>
    </>
  )
}

SwapPage.chains = CHAIN_IDS

export default SwapPage
