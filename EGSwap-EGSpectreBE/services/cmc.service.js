const axios = require('axios');
const BigNumber = require('bignumber.js');
const fetch = require('node-fetch');
const NodeCache = require('node-cache');
const scrapy = require('node-scrapy');

const cache = new NodeCache();

class CmcService {
  getScrapyPrice = async (tokenAddress) => {
    const model = '.priceSection-core > span';
    const htmlBody = await this.getHTMLBody(tokenAddress);

    const priceWithSymbol = scrapy.extract(htmlBody, model);

    console.log(priceWithSymbol);

    if (priceWithSymbol && priceWithSymbol.length > 2) {
      const price = priceWithSymbol.split('$');
      return price[1];
    }

    return '1';
  };

  getHTMLBody = async (tokenAddress) => {
    try {
      const res = await fetch(`https://coinmarketcap.com/dexscan/bsc/${tokenAddress}/`);
      return res.text();
    } catch (error) {
      return '';
    }
  };

  getLatestQuote = async (tokenSymbol) => {
    const params = new URLSearchParams();
    params.append('symbol', tokenSymbol);

    const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?${params.toString()}`;

    console.log('CMC SERVICE:: ', url);
    const {
      data: { data },
    } = await axios.get(url, {
      headers: {
        'X-CMC_PRO_API_KEY': process.env.CMC_PRIVATE_KEY,
      },
    });

    if (Object.keys(data).length === 0) {
      return null;
    }

    const key = Object.keys(data)[0];

    if (!data[key]) {
      console.warn(`Somethign went wrong for ${key}`, data);

      return null;
    }

    const {
      circulating_supply: supply,
      self_reported_circulating_supply: selfReportedSupply,
      self_reported_market_cap: selfReportedMarketCap,
      quote: {
        USD: { price, last_updated: time, market_cap: marketCap },
      },
    } = data[key][0];

    return {
      supply: supply || selfReportedSupply || 0,
      marketCap: marketCap || selfReportedMarketCap || 0,
      price: new BigNumber(price).toFormat(),
      time,
    };
  };

  getCachedLatestQuote = async (tokenSymbol) => {
    if (tokenSymbol.startsWith('USDC') || tokenSymbol.startsWith('USDT') || tokenSymbol.startsWith('DAI') || tokenSymbol.startsWith('BUSD')) {
      return {
        price: '1',
      };
    }
    const cacheId = `crypto:quote:latest:${JSON.stringify({ tokenSymbol })}`;
    if (!cache.has(cacheId)) {
      const latestQuote = await this.getLatestQuote(tokenSymbol);
      if (latestQuote) {
        cache.set(cacheId, latestQuote, 600);
      }
    }

    return cache.get(cacheId);
  };
}

module.exports = CmcService;
