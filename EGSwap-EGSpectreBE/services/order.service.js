//** Order Model */
const uuid4 = require('uuid4');
const ApiKey = require('../models/apiKey.model');
const CustomId = require('../models/customId.model');
const Order = require('../models/order.model');
const { encodeUUIDToBase64, decodeBase64ToUUID } = require('./../utils/helpers');
const { convert_status_symbol, convert_final_status } = require('../utils/symbol.util');
const {
  cn_get_exchange_info,
  ss_get_exchange_info,
  se_get_exchange_info,
  ex_get_exchange_info,
  ch_get_exchange_info,
  sp_get_exchange_info,
} = require('../utils/api.util');

const EXCHANGE_PROVIDER_MAPPER = {
  cn: cn_get_exchange_info,
  ss: ss_get_exchange_info,
  se: se_get_exchange_info,
  ex: ex_get_exchange_info,
  ch: ch_get_exchange_info,
  sp: sp_get_exchange_info,
};
/**
 * Retrieves a list of orders based on a given query and sort order.
 *
 * @async
 * @function getOrderList
 * @param {object} query - The query object used to filter the orders.
 * @param {string} sortBy - The sort order of the orders ('asc' for ascending or 'desc' for descending).
 * @returns {Promise<Array<object>|null>} An array of orders matching the query and sort order, or null if there was an error.
 * @throws {Error} If there is an error retrieving the orders.
 */
async function getOrderList(query, sortBy) {
  try {
    const sortOptions = {};
    if (sortBy === 'asc') {
      sortOptions._id = 1;
    } else if (sortBy === 'desc') {
      sortOptions._id = -1;
    }

    const orders = await Order.find(query).sort(sortOptions);
    return orders;
  } catch (error) {
    console.error(`Error getting orders: ${error}`);
    return null;
  }
}

/**
 * Finds a single order that matches the given query
 *
 * @async
 * @function getOrderOne
 * @param {Object} query - The query used to find the order
 * @returns {Object|null} - The found order object or null if not found
 */
async function getOrderOne(orderId, isEgswap) {
  try {
    if (isEgswap) {
      return getOrderByIdStrict(orderId);
    } else {
      const customOrderId = await getOrderIdFromCustomId(orderId);
      const order = await Order.findOne({ _id: customOrderId || orderId });
      return order;
    }
  } catch (error) {
    console.error(`Error getting order: ${error}`);
    return null;
  }
}

async function getOrderByIdStrict(orderId) {
  try {
    const customOrderId = await getOrderIdFromCustomId(orderId);

    if (customOrderId) {
      return null;
    }

    const order = await Order.findOne({ _id: orderId });

    return order;
  } catch (error) {
    console.error(`Error getting order: ${error}`);
    return null;
  }
}

async function getAdminOrderOne(orderId, forceCustom = true) {
  try {
    let customOrderId = null;
    if (forceCustom) {
      customOrderId = await getCustomIdFromOrderId(orderId);
    }
    const order = await Order.findOne({ _id: orderId });

    return order ? { ...order.toJSON(), customId: customOrderId } : null;
  } catch (error) {
    console.error(`Error getting order: ${error}`);
    return null;
  }
}

/**
 * Creates a new order and returns the saved order data.
 *
 * @async
 * @function createOrderOne
 * @param {Object} orderData - The data of the order to be created.
 * @returns {Promise<Object>} - The saved order data, or null if an error occurred.
 */
async function createOrderOne(orderData) {
  try {
    const order = new Order(orderData);
    const savedOrder = await order.save();
    return savedOrder;
  } catch (error) {
    console.error(`Error creating order: ${error}`);
    return null;
  }
}

/**
 * Update a single order in the database.
 *
 * @async
 * @function updateOrderOne
 * @param {string} id - The ID of the order to update.
 * @param {Object} orderData - The data to update the order with.
 * @returns {Promise<Object|null>} - Returns a Promise that resolves to the updated order data or null if an error occurs.
 */
async function updateOrderOne(orderData) {
  const updatedOrder = await Order.findByIdAndUpdate(orderData._id, orderData, {
    new: true,
  });
  return updatedOrder;
}

async function isGrootApiKey(apiKey) {
  if (!apiKey) {
    return false;
  }

  const apiKeyObj = await ApiKey.findOne({ key: apiKey });

  return apiKeyObj?.company === 'FeenixBot' || apiKeyObj?.company === 'FeenixBot_Test';
}

async function generateCustomId(apiKey, company, orderId) {
  if (!apiKey) {
    return orderId;
  }

  const apiKeyObj = await ApiKey.findOne({ key: apiKey });

  if (company !== apiKeyObj.company) {
    return null;
  }

  const customId = uuid4();
  const customIdBase64 = encodeUUIDToBase64(customId);

  await CustomId.create({ apiKeyId: apiKeyObj._id, customId, orderId });

  return customIdBase64;
}

async function getCustomIdFromOrderId(orderId) {
  const customObj = await CustomId.findOne({ orderId });

  if (!customObj) {
    return null;
  }

  return encodeUUIDToBase64(customObj.customId);
}

async function getOrderIdFromCustomId(customIdBase64) {
  const customId = decodeBase64ToUUID(customIdBase64);

  const customIdObj = await CustomId.findOne({ customId });

  if (!customIdObj) {
    return null;
  }

  return customIdObj.orderId;
}


async function getFinalStatus(orderInfo) {
  const [inExchange, outExchange] = orderInfo.exchange_flow.split('_');
  const inOrderInfo = await EXCHANGE_PROVIDER_MAPPER[inExchange](orderInfo.tokenA_xmr_orderID);
  const inStatus = convert_status_symbol(inOrderInfo?.status || inOrderInfo); // inOrderInfo might be a string or object with status key

  let outStatus = null;
  if (outExchange) {
    const outOrderInfo = outExchange ? await EXCHANGE_PROVIDER_MAPPER[outExchange](orderInfo.xmr_tokenB_orderID) : null;
    outStatus = outExchange ? convert_status_symbol(outOrderInfo?.status || outOrderInfo) : null;
  }
  const finalStatus = outStatus ? convert_final_status(inStatus, outStatus) : inStatus;

  return finalStatus;
}

module.exports = {
  getOrderList,
  getOrderOne,
  createOrderOne,
  updateOrderOne,
  generateCustomId,
  getCustomIdFromOrderId,
  getAdminOrderOne,
  getOrderByIdStrict,
  isGrootApiKey,
  getFinalStatus,
};
