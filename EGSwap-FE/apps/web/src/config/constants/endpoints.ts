import { ChainId } from '@pancakeswap/sdk'

export const GRAPH_API_PROFILE = 'https://api.thegraph.com/subgraphs/name/pancakeswap/profile'
export const GRAPH_API_PREDICTION_BNB = 'https://api.thegraph.com/subgraphs/name/pancakeswap/prediction-v2'
export const GRAPH_API_PREDICTION_CAKE = 'https://api.thegraph.com/subgraphs/name/pancakeswap/prediction-cake'

export const GRAPH_API_LOTTERY = 'https://api.thegraph.com/subgraphs/name/pancakeswap/lottery'
export const SNAPSHOT_BASE_URL = process.env.NEXT_PUBLIC_SNAPSHOT_BASE_URL
export const API_PROFILE = 'https://profile.pancakeswap.com'
export const API_NFT = 'https://nft.pancakeswap.com/api/v1'
export const SNAPSHOT_API = `${SNAPSHOT_BASE_URL}/graphql`
export const SNAPSHOT_HUB_API = `${SNAPSHOT_BASE_URL}/api/message`
export const GRAPH_API_POTTERY = 'https://api.thegraph.com/subgraphs/name/pancakeswap/pottery'

/**
 * V1 will be deprecated but is still used to claim old rounds
 */
export const GRAPH_API_PREDICTION_V1 = 'https://api.thegraph.com/subgraphs/name/pancakeswap/prediction'

export const INFO_CLIENT = 'https://api.thegraph.com/subgraphs/name/elongategithub/egswap'

export const INFO_CLIENT_ETH = 'https://api.thegraph.com/subgraphs/name/elongategithub/egswap-eth'
export const BLOCKS_CLIENT = 'https://api.thegraph.com/subgraphs/name/pancakeswap/blocks'
export const BLOCKS_CLIENT_ETH = 'https://api.thegraph.com/subgraphs/name/blocklytics/ethereum-blocks'
export const STABLESWAP_SUBGRAPH_CLIENT = 'https://api.thegraph.com/subgraphs/name/pancakeswap/exchange-stableswap'
export const GRAPH_API_NFTMARKET = 'https://api.thegraph.com/subgraphs/name/pancakeswap/nft-market'
export const GRAPH_HEALTH = 'https://api.thegraph.com/index-node/graphql'

export const TC_MOBOX_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/pancakeswap/trading-competition-v3'
export const TC_MOD_SUBGRAPH = 'https://api.thegraph.com/subgraphs/name/pancakeswap/trading-competition-v4'

export const FARM_API = 'https://farms-api.pancakeswap.com'

export const BIT_QUERY = 'https://graphql.bitquery.io'

export const ACCESS_RISK_API = '/api/risk'

export const CELER_API = 'https://api.celerscan.com/scan'

export const ANON_API = 'https://egspectre.egswap.exchange/egspectre-api/v1'
// export const ANON_API = 'http://localhost:5005/egspectre-api/v1'
export const FEENIX_API = 'https://api.getfeenix.com/feenix-api/v1'
export const ADS_EG_API = 'https://sea-lion-app-ywrjm.ondigitalocean.app'
export const cnLink = 'https://changenow.io/exchange/txs/'
export const ssLink = 'https://simpleswap.io/exchange?id='
export const seLink = 'https://stealthex.io/exchange/?id='
export const exLink = 'https://exolix.com/transaction/'
export const chLink = 'https://changehero.io/transaction/'
export const spLink = 'https://swapspace.co/exchange/step3?id='

export const INFO_CLIENT_WITH_CHAIN = {
  [ChainId.BSC]: INFO_CLIENT,
  [ChainId.ETHEREUM]: INFO_CLIENT_ETH,
}

export const BLOCKS_CLIENT_WITH_CHAIN = {
  [ChainId.BSC]: BLOCKS_CLIENT,
  [ChainId.ETHEREUM]: BLOCKS_CLIENT_ETH,
}

export const ASSET_CDN = 'http://178.62.64.194:3000/images/EG_logo.png'
export const EGSWAP_LOGO_LINK = 'https://egswap.exchange/egswap-logo.jpg'
// export const ASSET_CDN = 'https://assets.pancakeswap.finance'

export const LIST_YOUR_PROJECT = 'https://docs.egswap.exchange/contact-us'
export const SOCIAL_IMPACT = 'https://egtoken.io/social-impact-portal'
export const EGTOKEN_IO = 'https://egtoken.io/'
export const MIN_PAYMENT_GROOT_AMOUNT = Number(process.env.MIN_PAYMENT_GROOT_AMOUNT || '10')
