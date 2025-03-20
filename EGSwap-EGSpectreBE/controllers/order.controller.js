const {
  createOrderOne,
  getOrderOne,
  updateOrderOne,
  generateCustomId,
  getCustomIdFromOrderId,
  getOrderByIdStrict,
  getFinalStatus,
} = require('../services/order.service');
const { getNetworkOne, getTokenOne } = require('../services/quote.service');
const { getComissions } = require('../services/user.service');
const { standardize_all_symbols, convert_status_symbol, convert_final_status } = require('../utils/symbol.util');
const { getPrice } = require('../utils/function.util');
const {
  exchange_cn_to_ss,
  exchange_ss_to_cn,
  exchange_se_to_ss,
  exchange_ss_to_se,
  exchange_cn_to_se,
  exchange_se_to_cn,
  exchange_ex_to_cn,
  exchange_cn_to_ex,
  exchange_ex_to_ss,
  exchange_ss_to_ex,
  exchange_ex_to_se,
  exchange_se_to_ex,
  exchange_cn_to_ch,
  exchange_ch_to_cn,
  exchange_se_to_ch,
  exchange_ch_to_se,
  exchange_ss_to_ch,
  exchange_ch_to_ss,
  exchange_ex_to_ch,
  exchange_ch_to_ex,

  exchange_sp_to_cn,
  exchange_cn_to_sp,
  exchange_sp_to_ss,
  exchange_ss_to_sp,
  exchange_sp_to_se,
  exchange_se_to_sp,
  exchange_sp_to_ch,
  exchange_ch_to_sp,
  exchange_sp_to_ex,
  exchange_ex_to_sp,
  exchange_cn,
  exchange_ss,
  exchange_se,
  exchange_ex,
  exchange_ch,
  exchange_sp,
} = require('../utils/exchange.util');

const { registerCall } = require('../services/admin.service');
const {
  cn_get_exchange_info,
  ss_get_exchange_info,
  se_get_exchange_info,
  ex_get_exchange_info,
  ch_get_exchange_info,
  sp_get_exchange_info,
} = require('../utils/api.util');

async function create(req, res) {
  try {
    const { from_amount, to_address, from_symbol, to_symbol, is_anon, source = '', domain = '', chatId = '', memo_tag, tgUserId, widget } = req.body;

    if (!from_amount || !to_address || !from_symbol || !to_symbol) {
      return res.status(400).json({
        code: 400,
        message: 'Bad Request',
      });
    }

    let exchangeContent = {};

    // Get the exchange flow list.
    const exchangeFlowList = await Promise.race([getPrice(from_amount, from_symbol, to_symbol, is_anon)]);
    console.log('exchangeFlowList==>>>>', exchangeFlowList);

    for (let i = 0; i < exchangeFlowList.length; i++) {
      const exchangeFlow = exchangeFlowList[i][3];
      const TokenB_amount = exchangeFlowList[i][0];
      try {
        if (is_anon === 'true') {
          switch (exchangeFlow) {
            case 'cn_ss':
              exchangeContent = await exchange_cn_to_ss(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ss_cn':
              exchangeContent = await exchange_ss_to_cn(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'se_ss':
              exchangeContent = await exchange_se_to_ss(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ss_se':
              exchangeContent = await exchange_ss_to_se(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'cn_se':
              exchangeContent = await exchange_cn_to_se(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'se_cn':
              exchangeContent = await exchange_se_to_cn(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ex_cn':
              exchangeContent = await exchange_ex_to_cn(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'cn_ex':
              exchangeContent = await exchange_cn_to_ex(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ex_ss':
              exchangeContent = await exchange_ex_to_ss(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ss_ex':
              exchangeContent = await exchange_ss_to_ex(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ex_se':
              exchangeContent = await exchange_ex_to_se(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'se_ex':
              exchangeContent = await exchange_se_to_ex(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'cn_ch':
              exchangeContent = await exchange_cn_to_ch(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ch_cn':
              exchangeContent = await exchange_ch_to_cn(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'se_ch':
              exchangeContent = await exchange_se_to_ch(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ch_se':
              exchangeContent = await exchange_ch_to_se(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ss_ch':
              exchangeContent = await exchange_ss_to_ch(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ch_ss':
              exchangeContent = await exchange_ch_to_ss(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ex_ch':
              exchangeContent = await exchange_ex_to_ch(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ch_ex':
              exchangeContent = await exchange_ch_to_ex(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;

            case 'sp_cn':
              exchangeContent = await exchange_sp_to_cn(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'cn_sp':
              exchangeContent = await exchange_cn_to_sp(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'sp_ss':
              exchangeContent = await exchange_sp_to_ss(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ss_sp':
              exchangeContent = await exchange_ss_to_sp(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'sp_se':
              exchangeContent = await exchange_sp_to_se(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'se_sp':
              exchangeContent = await exchange_se_to_sp(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'sp_ch':
              exchangeContent = await exchange_sp_to_ch(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ch_sp':
              exchangeContent = await exchange_ch_to_sp(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'sp_ex':
              exchangeContent = await exchange_sp_to_ex(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ex_sp':
              exchangeContent = await exchange_ex_to_sp(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;

            default:
              throw new Error(`Unsupported exchange flow: ${exchangeFlow}`);
          }
        } else {
          switch (exchangeFlow) {
            case 'cn':
              exchangeContent = await exchange_cn(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ss':
              exchangeContent = await exchange_ss(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'se':
              exchangeContent = await exchange_se(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ex':
              exchangeContent = await exchange_ex(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'ch':
              exchangeContent = await exchange_ch(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            case 'sp':
              exchangeContent = await exchange_sp(from_symbol, from_amount, to_symbol, to_address, memo_tag);
              break;
            default:
              throw new Error(`Unsupported exchange flow: ${exchangeFlow}`);
          }
        }
        if (!exchangeContent) continue;
        const [fromTokenData, toTokenData] = await Promise.all([getTokenOne({ name: from_symbol }), getTokenOne({ name: to_symbol })]);

        const createdBy = source === '' && req.apiKey ? req.apiKey : source;
        const payload = {
          tokenA_symbol: standardize_all_symbols(exchangeContent?.TokenA_symbol),
          tokenA_amount: exchangeContent?.TokenA_amount,
          tokenA_network: fromTokenData?.networkId,
          tokenB_symbol: standardize_all_symbols(exchangeContent?.TokenB_symbol),
          tokenB_amount: TokenB_amount || exchangeContent.TokenB_amount,
          tokenB_address: exchangeContent?.TokenB_address,
          tokenB_network: toTokenData?.networkId,
          paying_address: exchangeContent?.paying_address,
          exchange_flow: exchangeContent?.exchange_flow,
          tokenA_xmr_orderID: exchangeContent?.tokenA_xmr_orderID,
          xmr_tokenB_orderID: exchangeContent?.xmr_tokenB_orderID,
          is_anon: is_anon,
          creation_time: exchangeContent?.creation_time,
          memo: exchangeContent?.memo,
          source: source === '' && req.apiKey ? 'External API' : source,
          domain: domain === '' && req.apiKey ? req.headers.origin : domain,
          widget,
          chatId,
          tgUserId,
          createdBy,
        };
        console.log('CREATE ORDER PAYLOAD', payload);
        const newOrderData = await createOrderOne(payload);
        await registerCall(req.apiKey, req.body, newOrderData, '/api/v1/orders', 'POST');

        const customId = await generateCustomId(req.apiKey, 'FeenixBot', newOrderData?._id);

        return res.status(200).json({
          code: 200,
          message: 'Success',
          data: {
            egSpectreId: customId || newOrderData?._id,
          },
        });
      } catch (error) {
        console.error(error);
        continue;
      }
    }

    return res.status(400).json({
      code: 400,
      message: 'No exchange flow succeeded',
    });
  } catch (error) {
    console.error(`An error occurred while creating the order: ${error}`);
    return res.status(500).json({
      code: 500,
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
}

async function getById(req, res) {
  try {
    const orderInfo = await getOrderOne(req.params.id, req.isEgswap);
    if (!orderInfo) {
      return res.status(404).json({
        code: 404,
        message: 'The order was not found',
      });
    }

    orderInfo.order_status = await getFinalStatus(orderInfo);
    orderInfo.first_tx_receivedTime = orderInfo.order_status === 1 ? Math.floor(Date.now() / 1000) : orderInfo.first_tx_receivedTime;
    const orderData = await updateOrderOne(orderInfo);

    console.log('------------------------------------ STARTING COMISSION PROCESS ------------------------------------------------');
    await getComissions(orderData._id, req.apiKey);
    console.log('------------------------------------ ENDED COMISSION PROCESS ------------------------------------------------');

    const customIdFromOrder = await getCustomIdFromOrderId(orderInfo._id);
    const [fromNetworkData, toNetworkData] = await Promise.all([
      getNetworkOne({ _id: orderInfo.tokenA_network }),
      getNetworkOne({ _id: orderInfo.tokenB_network }),
    ]);

    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: {
        orderId: customIdFromOrder ? customIdFromOrder : orderInfo._id,
        from_symbol: orderInfo.tokenA_symbol,
        from_amount: orderInfo.tokenA_amount,
        from_network: {
          logo: fromNetworkData?.logo,
          name: fromNetworkData?.name,
          protocol: fromNetworkData?.protocol,
        },
        to_symbol: orderInfo.tokenB_symbol,
        to_amount: orderInfo.tokenB_amount,
        to_address: orderInfo.tokenB_address,
        to_network: {
          logo: toNetworkData?.logo,
          name: toNetworkData?.name,
          protocol: toNetworkData?.protocol,
        },
        paying_address: orderInfo.paying_address,
        is_anon: orderInfo.is_anon,
        creation_time: orderInfo.creation_time,
        memo: orderInfo.memo,
        status: orderInfo.order_status,
        first_tx_receivedTime: orderData.first_tx_receivedTime,
      },
    });
  } catch (error) {
    console.log('error getById-----------', error);
    return res.status(500).json({
      code: 500,
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
}

async function getByIdAdmin(req, res) {
  try {
    const orderInfo = await getOrderByIdStrict(req.params.id);
    console.log('orderInfo*********************', orderInfo);
    if (!orderInfo) {
      return res.status(404).json({
        code: 404,
        message: 'The order was not found',
      });
    }

    const [fromNetworkData, toNetworkData] = await Promise.all([
      getNetworkOne({ _id: orderInfo.tokenA_network }),
      getNetworkOne({ _id: orderInfo.tokenB_network }),
    ]);

    const { exchange_flow, tokenA_xmr_orderID, xmr_tokenB_orderID } = orderInfo;

    const egswap_orderInfo = {
      orderId: orderInfo._id,
      from_symbol: orderInfo.tokenA_symbol,
      from_amount: orderInfo.tokenA_amount,
      from_network: {
        name: fromNetworkData?.name,
        protocol: fromNetworkData?.protocol,
      },
      to_symbol: orderInfo.tokenB_symbol,
      to_amount: orderInfo.tokenB_amount,
      to_address: orderInfo.tokenB_address,
      to_network: {
        name: toNetworkData?.name,
        protocol: toNetworkData?.protocol,
      },
      paying_address: orderInfo.paying_address,
      creation_time: orderInfo.creation_time,
      exchange_flow,
      tokenA_xmr_orderID,
      xmr_tokenB_orderID,
    };

    const tokenAOrderId = orderInfo.tokenA_xmr_orderID;
    const tokenBOrderId = orderInfo.xmr_tokenB_orderID;
    const exchangeInfoFnMapper = {
      cn: cn_get_exchange_info,
      ss: ss_get_exchange_info,
      se: se_get_exchange_info,
      ex: ex_get_exchange_info,
      ch: ch_get_exchange_info,
      sp: sp_get_exchange_info,
    };
    const [inExchange, outExchange] = exchange_flow.split('_');

    const inOrderInfo = await exchangeInfoFnMapper[inExchange](tokenAOrderId);
    const inStatus = convert_status_symbol(inOrderInfo?.status);
    const outOrderInfo = outExchange ? await exchangeInfoFnMapper[outExchange](tokenBOrderId) : null;
    const outStatus = outExchange ? convert_status_symbol(outOrderInfo?.status) : null;
    const finalStatus = outExchange ? convert_final_status(inStatus, outStatus) : inStatus;

    orderInfo.order_status = finalStatus;
    egswap_orderInfo.status = finalStatus;
    egswap_orderInfo.inStatus = inStatus;
    egswap_orderInfo.outStatus = outStatus;

    if (finalStatus === 1) {
      orderInfo.first_tx_receivedTime = Math.floor(Date.now() / 1000);
    }

    const orderData = await updateOrderOne(orderInfo);

    console.log('------------------------------------ STARTING COMISSION PROCESS ------------------------------------------------');
    await getComissions(orderData._id, req.apiKey, true);
    console.log('------------------------------------ ENDED COMISSION PROCESS ------------------------------------------------');

    if (!orderData) {
      return res.status(400).json({
        code: 400,
        message: 'Bad Request',
      });
    }

    egswap_orderInfo.first_tx_receivedTime = orderData.first_tx_receivedTime;
    egswap_orderInfo.is_anon = orderData.is_anon;

    const customIdFromOrder = await getCustomIdFromOrderId(egswap_orderInfo.orderId);
    egswap_orderInfo.orderId = customIdFromOrder ? customIdFromOrder : egswap_orderInfo.orderId;

    return res.status(200).json({
      code: 200,
      message: 'Success',
      data: egswap_orderInfo,
    });
  } catch (error) {
    console.log('Error getByIdAdmin', error);
    return res.status(500).json({
      code: 500,
      message: 'An unexpected error occurred. Please try again later.',
    });
  }
}

module.exports = {
  create,
  getById,
  getByIdAdmin,
};
