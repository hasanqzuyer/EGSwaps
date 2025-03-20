import { Analytics } from '@vercel/analytics/react'
import memoize from 'lodash/memoize'
import { ContextApi } from '@pancakeswap/localization'
import { PageMeta } from './types'
import { ASSET_CDN, EGSWAP_LOGO_LINK } from './endpoints'

export const DEFAULT_META: PageMeta = {
  title: 'Home | EGSwap',
  description:
    'Trade, Earn & contribute to worldwide social impact on a DEX that makes a difference. Get cashback for listing your project on EGSwap, the leading DEX on BSC and Ethereum',
  // image: `${ASSET_CDN}/web/og/hero.jpg`,
}

interface PathList {
  paths: { [path: string]: { title: string; basePath?: boolean; description?: string; image?: string } }
  defaultTitleSuffix: string
}

const swap_description =
  'Trade, Earn & contribute to worldwide social impact on a DEX that makes a difference. Get cashback for listing your project on EGSwap, the leading DEX on BSC and Ethereum'
const egspectre_description =
  'Swap Crypto and bridge tokens across multiple blockchains, all with the utmost privacy. EGSpectre empowers legitimate users with unrivalled financial confidentiality on the Blockchain'
const analytics_description =
  'Explore EG Token and EGSwap DeFi platforms with an overview of total value locked (TVL), analytics, volume data, token data & charts'

const getPathList = (t: ContextApi['t']): PathList => {
  return {
    paths: {
      '/': { title: t('Home | EGSwap'), description: swap_description },
      '/swap': {
        basePath: true,
        title: t('Swap | EGSwap'),
        description: swap_description,
        image: `${ASSET_CDN}`,
      },
      '/ramp': {
        basePath: true,
        title: t('EGRamp | Buy Crypto with FIAT currencies'),
        description: swap_description,
      },
      '/egspectre': {
        basePath: true,
        title: t('EGSpectre | Home'),
        description: egspectre_description,
        image: `${EGSWAP_LOGO_LINK}`,
      },
      '/egspectre/swap': {
        basePath: true,
        title: t('EGSpectre | Swap'),
        description: '',
      },
      '/crypto-news': {
        basePath: true,
        title: 'Crypto News | EG Swap',
        description: 'Catch up on the latest crypto news',
      },
      '/analytics': {
        basePath: true,
        title: t('EG Ecosystem Analytics'),
        description: analytics_description,
      },
      '/limit-orders': { basePath: true, title: t('Limit Orders'), image: `${ASSET_CDN}` },
      '/add': { basePath: true, title: t('Add Liquidity'), image: `${ASSET_CDN}` },
      '/remove': { basePath: true, title: t('Remove Liquidity'), image: `${ASSET_CDN}` },
      '/liquidity': { title: t('Liquidity'), image: `${ASSET_CDN}` },
      '/find': { title: t('Import Pool') },
      '/competition': { title: t('Trading Battle') },
      '/prediction': { title: t('Prediction'), image: `${ASSET_CDN}` },
      '/prediction/leaderboard': { title: t('Leaderboard'), image: `${ASSET_CDN}` },
      '/farms': { title: t('Farms'), image: `${ASSET_CDN}` },
      '/farms/auction': { title: t('Farm Auctions'), image: `${ASSET_CDN}` },
      '/pools': {
        title: t('Pools | EGSwap'),
        description: 'Stake your tokens, Earn Rewards. High APR, No Risk',
        image: `${ASSET_CDN}`,
      },
      '/lottery': { title: t('Lottery'), image: `${ASSET_CDN}` },
      '/ifo': { title: t('Initial Farm Offering'), image: `${ASSET_CDN}` },
      '/teams': { basePath: true, title: t('Leaderboard'), image: `${ASSET_CDN}` },
      '/voting': { basePath: true, title: t('Voting'), image: `${ASSET_CDN}` },
      '/voting/proposal': { title: t('Proposals'), image: `${ASSET_CDN}` },
      '/voting/proposal/create': { title: t('Make a Proposal'), image: `${ASSET_CDN}` },
      '/info': {
        title: `${t('Overview')} - ${t('Info')}`,
        description: 'View statistics for Pancakeswap exchanges.',
        image: `${ASSET_CDN}`,
      },
      '/info/pairs': {
        title: `${t('Pairs')} - ${t('Info')}`,
        description: 'View statistics for Pancakeswap exchanges.',
        image: `${ASSET_CDN}`,
      },
      '/info/tokens': {
        title: `${t('Tokens')} - ${t('Info')}`,
        description: 'View statistics for Pancakeswap exchanges.',
        image: `${ASSET_CDN}`,
      },
      '/nfts': { title: t('NFT Marketplace'), image: `${ASSET_CDN}` },
      '/nfts/collections': { basePath: true, title: t('Collections'), image: `${ASSET_CDN}` },
      '/nfts/activity': { title: t('Activity'), image: `${ASSET_CDN}` },
      '/profile': { basePath: true, title: t('Profile') },
      '/pancake-squad': { basePath: true, title: t('Pancake Squad') },
      '/pottery': { basePath: true, title: t('Pottery'), image: `${ASSET_CDN}` },
      '/perp': { title: t('EGSwap | Crypto Futures Trading | Crypto Derivatives | Perpetual Swap') },
    },
    defaultTitleSuffix: t('PancakeSwap'),
  }
}

export const getCustomMeta = memoize(
  (path: string, t: ContextApi['t'], _: string): PageMeta => {
    const pathList = getPathList(t)
    const pathMetadata =
      pathList.paths[path] ??
      pathList.paths[Object.entries(pathList.paths).find(([url, data]) => data.basePath && path.startsWith(url))?.[0]]

    if (pathMetadata) {
      return {
        title: `${pathMetadata.title}`,
        ...(pathMetadata.description && { description: pathMetadata.description }),
        image: pathMetadata.image,
      }
    }
    return null
  },
  (path, t, locale) => `${path}#${locale}`,
)
