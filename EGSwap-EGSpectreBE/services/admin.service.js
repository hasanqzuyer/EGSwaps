//** Admin Model */
const Admin = require('../models/admin.model');
const WarningStatus = require('../models/warningStatus.model');
const MaintenanceMode = require('../models/maintenanceMode.model');
const { bufferToHex } = require('ethereumjs-util');
const uuid4 = require('uuid4');
const jwt = require('jsonwebtoken');
const { recoverPersonalSignature } = require('@metamask/eth-sig-util');
const ApiKey = require('../models/apiKey.model');
const ApiKeyLog = require('../models/apiKeyLog.model');
const Order = require('../models/order.model');
const { getAdminOrderOne, getFinalStatus, updateOrderOne } = require('./order.service');
const { getComissions } = require('./user.service');

const EGSWAP_API_KEY = 'xxx-xxx-xxx';
/**
 * Generate a signature based on the admin wallet address
 *
 * @async
 * @function getMessage
 * @param {object} query - The query object used to search admin wallet.
 * @returns {object} Returns the signature
 * @throws {Error} If there is an error return empty string as signature.
 */
async function getMessage(query) {
  try {
    const adminWallet = await Admin.findOne(query);
    if (!adminWallet) return '';
    else {
      const uuid4Msg = uuid4();
      const currentMessage = 'Sign message';
      const sign_message = currentMessage + ' ' + uuid4Msg;
      const doc = await Admin.findOneAndUpdate(query, { sign_message }, { new: true });
      return doc.sign_message;
    }
  } catch (error) {
    console.error(`Error getting signature:  ${error}`);
    return '';
  }
}

async function validateAddressWithSignature(signature, wallet_address) {
  const existingAdminWallet = await Admin.findOne({ wallet_address });

  if (!existingAdminWallet) {
    return [null, false];
  }

  const address = getAddressFromSignature(existingAdminWallet.sign_message, signature);
  if (address && address === wallet_address.toLowerCase()) {
    return [existingAdminWallet, true];
  }

  return [null, false];
}

function getAddressFromSignature(sign_message, signature) {
  try {
    const messageHex = bufferToHex(Buffer.from(sign_message, 'utf8'));
    const address = recoverPersonalSignature({
      data: messageHex,
      signature,
    });

    return address.toLowerCase();
  } catch (error) {
    return '';
  }
}

function signUser(user) {
  const payload = {
    wallet_address: user.wallet_address,
    role: 'admin',
    sign_message: user.sign_message,
  };
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION_TIME,
  });
}

async function isAdminAddress(wallet_address) {
  const existingAdminWallet = await Admin.findOne({ wallet_address });
  if (!existingAdminWallet) return false;
  else return true;
}

async function getWarningObject() {
  const warningObj = await WarningStatus.findOne();
  return warningObj;
}

async function updateWarningObject(obj) {
  try {
    const warningArr = await WarningStatus.find();
    const id = warningArr[0]._id;
    const updateRes = await WarningStatus.findByIdAndUpdate(id, obj);
    if (!updateRes) return false;
    return true;
  } catch (error) {
    return false;
  }
}

async function getMaintenanceObject() {
  const maintenanceObj = await MaintenanceMode.findOne();
  return maintenanceObj;
}

async function updateMaintenanceObject(obj) {
  try {
    const maintenanceObjArr = await MaintenanceMode.find();
    const id = maintenanceObjArr[0]._id;
    const updateRes = await MaintenanceMode.findByIdAndUpdate(id, obj);
    if (!updateRes) return false;
    return true;
  } catch (error) {
    return false;
  }
}

async function generateOpenApiKey(payload) {
  const data = {
    key: uuid4(),
    active: true,
    company: payload.company || '',
    expiredAt: payload.expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * Number(process.env.API_KEY_EXPIRED_DAYS)),
  };
  const openApiKey = new ApiKey(data);
  const savedKey = await openApiKey.save();
  return savedKey;
}

async function getAllKeys() {
  const savedKeys = await ApiKey.find();
  const allKeys = [];

  allKeys.push({
    key: EGSWAP_API_KEY,
    company: 'EgSwap',
    active: true,
    name: 'Egswap',
    expiredAt: '2030-01-01',
    createdAt: '2022-01-01',
  });

  return [...savedKeys, ...allKeys];
}

async function getApiKeyLogs(apiKey, offset = 0, limit = 10) {
  let count,
    logs = [];
  if (apiKey === EGSWAP_API_KEY) {
    count = await Order.count({ source: 'egswap' });
    const websiteOrders = await Order.find({ source: 'egswap' }).sort({ creation_time: 'desc' }).skip(offset).limit(limit);
    logs = websiteOrders.map((e) => ({
      order: e.toObject(),
      createdAt: new Date(Number(e.creation_time) * 1000),
      method: 'POST',
      action: 'POST',
      url: `/api/v1/orders`,
    }));
  } else {
    const key = await ApiKey.findOne({ key: apiKey });
    const forceCustom = key.company === 'FeenixBot';
    count = await ApiKeyLog.count({
      apiKey: key._id,
      url: { $regex: '/api/v1/orders', $options: 'i' },
    });

    const apiKeLogs = await ApiKeyLog.find({
      apiKey: key._id,
      url: { $regex: '/api/v1/orders', $options: 'i' },
    })
      .sort({ createdAt: 'desc' })
      .skip(offset)
      .limit(limit);

    for (const log of apiKeLogs) {
      if (!log?.response?._id) {
        logs.push({ ...log.toObject() });
        continue;
      }

      const order = await getAdminOrderOne(log.response._id, forceCustom);
      order && logs.push({ ...log.toObject(), order });
    }
  }

  for (const log of logs) {
    if (!log.order) continue;

    const finalStatus = await getFinalStatus(log.order);
    const currentStatus = log.order_status;

    if (finalStatus !== 4 || currentStatus === finalStatus) continue;

    await updateOrderOne({ ...log.order, order_status: finalStatus });

    await getComissions(log.order._id, false, true);

    log.order.order_status = finalStatus;
  }

  return {
    count,
    logs,
  };
}

async function getApiKeyStats(apiKey) {
  let orderIds = [];
  if (apiKey === EGSWAP_API_KEY) {
    const websiteOrders = await Order.find({ source: 'egswap' });
    orderIds = websiteOrders.map((e) => e._id);
  } else {
    const key = await ApiKey.findOne({ key: apiKey });
    const logs = await ApiKeyLog.find({
      apiKey: key._id,
      url: { $regex: '/api/v1/orders', $options: 'i' },
    });
    orderIds = logs.filter((e) => e?.response?._id).map((e) => e.response._id);
  }

  const stats = await getStatsFromOrders(orderIds);

  return stats;
}

async function getStatsFromOrders(orderIds) {
  return Order.aggregate([
    {
      // Match orders by the array of _id values
      $match: {
        _id: { $in: orderIds },
      },
    },
    {
      // Add a field to compute the time difference between current time and order creation time
      $addFields: {
        currentTimestamp: { $floor: { $divide: [{ $toLong: '$$NOW' }, 1000] } }, // Current time in seconds
        creationTimestamp: { $floor: { $divide: [{ $toLong: '$date.createAt' }, 1000] } }, // Order creation time in seconds
        timeDifference: {
          $subtract: [
            { $floor: { $divide: [{ $toLong: '$$NOW' }, 1000] } }, // Current time
            { $floor: { $divide: [{ $toLong: '$date.createAt' }, 1000] } }, // Order creation time
          ],
        },
      },
    },
    {
      // Classify the order into categories based on the time difference and status
      $addFields: {
        orderStatusCategory: {
          $cond: [
            {
              // Check if the order is expired (status '0' and time difference > threshold of 48 hours)
              $and: [{ $eq: [{ $toString: '$order_status' }, '0'] }, { $gt: ['$timeDifference', 48 * 60 * 60] }],
            },
            'Expired', // If true, mark as expired
            {
              // Otherwise, map based on the order status
              $switch: {
                branches: [
                  { case: { $eq: [{ $toString: '$order_status' }, '1'] }, then: 'Received' },
                  { case: { $eq: [{ $toString: '$order_status' }, '4'] }, then: 'Finished' },
                  { case: { $eq: [{ $toString: '$order_status' }, '2'] }, then: 'Exchanging' },
                  { case: { $eq: [{ $toString: '$order_status' }, '3'] }, then: 'Sending' },
                  { case: { $eq: [{ $toString: '$order_status' }, '6'] }, then: 'Failed' },
                  { case: { $eq: [{ $toString: '$order_status' }, '0'] }, then: 'Waiting' },
                ],
                default: 'Other', // Default case for undefined or unknown statuses
              },
            },
          ],
        },
      },
    },
    {
      // Group the orders based on their categories and count them
      $group: {
        _id: null, // Group all documents into a single result
        ordersExpired: {
          $sum: { $cond: [{ $eq: ['$orderStatusCategory', 'Expired'] }, 1, 0] },
        },
        ordersCompletedOrFinished: {
          $sum: { $cond: [{ $in: ['$orderStatusCategory', ['Completed', 'Finished']] }, 1, 0] },
        },
        ordersExchangingOrSending: {
          $sum: { $cond: [{ $in: ['$orderStatusCategory', ['Exchanging', 'Sending']] }, 1, 0] },
        },
        ordersWaiting: {
          $sum: { $cond: [{ $eq: ['$orderStatusCategory', 'Waiting'] }, 1, 0] },
        },
        ordersFailed: {
          $sum: { $cond: [{ $eq: ['$orderStatusCategory', 'Failed'] }, 1, 0] },
        },
        ordersOther: {
          $sum: { $cond: [{ $eq: ['$orderStatusCategory', 'Other'] }, 1, 0] },
        },
        // Calculate totalOrders by summing all categories
        totalOrders: {
          $sum: {
            $add: [
              { $cond: [{ $eq: ['$orderStatusCategory', 'Expired'] }, 1, 0] },
              { $cond: [{ $in: ['$orderStatusCategory', ['Completed', 'Finished']] }, 1, 0] },
              { $cond: [{ $in: ['$orderStatusCategory', ['Exchanging', 'Sending']] }, 1, 0] },
              { $cond: [{ $eq: ['$orderStatusCategory', 'Waiting'] }, 1, 0] },
              { $cond: [{ $eq: ['$orderStatusCategory', 'Failed'] }, 1, 0] },
              { $cond: [{ $eq: ['$orderStatusCategory', 'Other'] }, 1, 0] },
            ],
          },
        },
      },
    },
  ]);
}

async function setInactiveApiKey(key, active) {
  const existingKey = await ApiKey.findOne({ key });

  if (!existingKey) {
    throw new Error('Key does not exist');
  }

  existingKey.active = active;
  await existingKey.save();
  return true;
}

async function deleteKey(key) {
  const existingKey = await ApiKey.findOne({ key });

  if (!existingKey) {
    throw new Error('Key does not exist');
  }

  await existingKey.deleteOne();
  return true;
}

async function registerCall(apiKey, payload, response, url, action) {
  try {
    if (!apiKey) {
      console.log('There is not api key, in registerCall');
      return;
    }

    const existingKey = await ApiKey.findOne({ key: apiKey });
    if (!existingKey) {
      console.log('There is not api key in Mongo, in registerCall');
      return;
    }

    const log = new ApiKeyLog({ apiKey: existingKey._id, payload, response, url, action, createdAt: new Date() });
    await log.save();

    return;
  } catch (error) {
    console.log('Error while registering call', error);
  }
}

async function getWidgetUsers() {
  try {
    const orders = await Order.find({ source: 'widget' });

    const widgetUsersMapper = {};

    for (const order of orders) {
      if (!widgetUsersMapper[order.widget]) {
        widgetUsersMapper[order.widget] = [];
      }
      widgetUsersMapper[order.widget].push(order);
    }

    const widgetUsers = [];
    Object.keys(widgetUsersMapper).forEach((key) => {
      const widgetOrders = widgetUsersMapper[key];
      const widgetOrdersSorted = widgetOrders.sort((a, b) => b.creation_time - a.creation_time);
      const widgetUsername = key;
      widgetUsers.push({
        name: widgetUsername,
        orders: widgetOrdersSorted,
      });
    });

    return widgetUsers;
  } catch (error) {
    console.log('Error while loading widget users', error);
    return [];
  }
}

module.exports = {
  getMessage,
  validateAddressWithSignature,
  signUser,
  isAdminAddress,
  getWarningObject,
  updateWarningObject,
  getMaintenanceObject,
  updateMaintenanceObject,
  generateOpenApiKey,
  getAllKeys,
  setInactiveApiKey,
  registerCall,
  deleteKey,
  getApiKeyLogs,
  getApiKeyStats,
  getWidgetUsers,
};
