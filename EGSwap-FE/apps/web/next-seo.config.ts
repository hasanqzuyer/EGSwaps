import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  description:
    'Trade, Earn & contribute to worldwide social impact on a DEX that makes a difference. Get cashback for listing your project on EGSwap, the leading DEX on BSC and Ethereum',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@egswap',
    site: '@egswap',
  },
  openGraph: {
    title: 'EG | EGSwap',
    type: 'website',
    description:
      'Trade, Earn & contribute to worldwide social impact on a DEX that makes a difference. Get cashback for listing your project on EGSwap, the leading DEX on BSC and Ethereum',
    images: [{ url: 'https://egswap.exchange/egswap-logo.jpg', width: 800, height: 600, alt: 'EGSwap' }],
  },
}
