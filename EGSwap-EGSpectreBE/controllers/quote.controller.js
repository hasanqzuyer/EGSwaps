const { getCategoryList, getNetworkList, getTokenList, parseTokenList } = require('../services/quote.service');
const { getPrice } = require('../utils/function.util');

async function getQuote(req, res) {
  try {
    const { from_amount, from_symbol, to_symbol, is_anon } = req.body;

    if (!from_amount) {
      return res.status(400).json({
        code: 400,
        message: 'The amount is required',
      });
    }

    if (!from_symbol || !to_symbol) {
      return res.status(400).json({
        code: 400,
        message: 'The exchange token pair is required',
      });
    }
    // Fetch the token price.
    const priceList = await getPrice(from_amount, from_symbol, to_symbol, is_anon);
    const quotes = {};

    if (priceList.length > 0) {
      quotes.fromAmount = parseFloat(from_amount);
      quotes.toAmount = priceList[0][0];
      quotes.minAmount = priceList[0][1];
      quotes.maxAmount = priceList[0][2] < 0 ? null : priceList[0][2];
    }

    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: quotes,
    });
  } catch (error) {
    console.error(`An error occurred while getting the quote: ${error}`);
    return res.status(500).json({
      code: 500,
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
}

async function listCategories(req, res) {
  try {
    const categoryListData = await getCategoryList({ isDeleted: false }, 'asc');

    const categorylist = [
      {
        id: '',
        name: 'All',
      },
    ];

    if (categoryListData.length > 0) {
      for (const categoryData of categoryListData) {
        categorylist.push({
          id: categoryData._id,
          name: categoryData.name,
        });
      }
    }

    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: categorylist,
    });
  } catch (error) {
    console.error(`An error occurred while listing categories: ${error}`);
    return res.status(500).json({
      code: 500,
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
}

async function listNetworks(req, res) {
  try {
    const networkListData = await getNetworkList({ isDeleted: false }, 'asc');

    const networklist = [];

    if (networkListData.length > 0) {
      for (const networkData of networkListData) {
        networklist.push({
          id: networkData._id,
          logo: networkData.logo,
          name: networkData.name,
          validation_address: networkData?.validation_address,
          validation_extra: networkData?.validation_extra,
          address_explorer: networkData?.address_explorer,
          tx_explorer: networkData?.tx_explorer,
          protocol: networkData?.protocol,
        });
      }
    }

    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: networklist,
    });
  } catch (error) {
    console.error(`An error occurred while listing networks: ${error}`);
    return res.status(500).json({
      code: 500,
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
}


async function listTokens(req, res) {
  try {
    const { widget } = req.query;
    const tokenListData = await getTokenList({ isDeleted: false });

    const parsedTokenList = parseTokenList(tokenListData, widget);

    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: parsedTokenList,
    });
  } catch (error) {
    console.error(`An error occurred while listing tokens: ${error}`);
    return res.status(500).json({
      code: 500,
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
}

module.exports = {
  getQuote,
  listCategories,
  listNetworks,
  listTokens,
};
