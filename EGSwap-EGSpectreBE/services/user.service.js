const BigNumber = require('bignumber.js');

const Order = require('../models/order.model');
const User = require('../models/user.model');
const CMCService = require('./cmc.service');
const { isGrootApiKey } = require('./order.service');

const findUser = async (tgUserId) => {
  return User.findOne({ tgUserId });
};

const findAllUser = async () => {
  const users = await User.find().sort({ pendingComissions: -1 });
  const usersMapped = await Promise.all(
    users.map(async (e) => {
      const userJSON = e.toJSON();
      const referrals = await getTGReferrals(userJSON.tgUserId);
      return {
        ...userJSON,
        referrals,
      };
    }),
  );

  return usersMapped;
};

const createReferralCode = async () => {
  let code = '';
  while (true) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const exists = await User.exists({ where: { referralCode: code } });

    if (!exists) {
      break;
    }
  }

  return code;
};

const createUser = async (tgUserId, tgUsername) => {
  const user = await User.create({ tgUserId, tgUsername });

  return user;
};

const updateUser = async (user, values) => {
  for (const key of Object.keys(values)) {
    user[key] = values[key];
  }

  await user.save();

  const updatedUser = await User.findOne({ tgUserId: user.tgUserId });

  return updatedUser;
};

const assignTGReferral = async (tgUserId, referralCode) => {
  const user = await User.findOne({ tgUserId });
  const referralUser = await User.findOne({ referralCode });

  if (!user) {
    return { error: 'User not found' };
  }
  if (!referralUser) {
    return { error: 'Referral code not found' };
  }

  if (user.tgUserId === referralUser.tgUserId) {
    return { error: 'You can not use your own code' };
  }

  user.referredBy = referralUser.referralCode;

  await user.save();

  return { error: null };
};

const getTGReferrals = async (tgUserId) => {
  const user = await User.findOne({ tgUserId });

  const fifo = [{ user, level: 0 }];
  const levels = {
    level1: 0,
    level2: 0,
    level3: 0,
  };

  while (fifo.length) {
    const firstUser = fifo.shift();
    if (!firstUser.user.referralCode) {
      break;
    }

    const referrals = await User.find({ referredBy: firstUser.user.referralCode });

    for (const refUser of referrals) {
      fifo.push({ user: refUser, level: firstUser.level + 1 });
      const levelKey = `level${firstUser.level + 1}`;
      levels[levelKey] = (levels[levelKey] || 0) + 1;
    }
  }

  return {
    level1: levels['level1'],
    level2: levels['level2'],
    level3: levels['level3'],
  };
};

const getReferrers = async (tgUserId) => {
  const user = await User.findOne({ tgUserId });

  const fifo = [{ user, level: 0 }];
  const referrersUsers = [];

  while (fifo.length) {
    const currentUser = fifo.shift();
    if (!currentUser.user.referredBy) {
      break;
    }

    const referrer = await User.findOne({ referralCode: currentUser.user.referredBy });
    referrersUsers.push({ user: referrer, level: currentUser.level + 1 });
    fifo.push({ user: referrer, level: currentUser.level + 1 });
  }

  return referrersUsers.slice(0, 3);
};

const getComissions = async (orderId, apiKey, isAdmin) => {
  try {
    let isGroot = false;
    if (apiKey) {
      isGroot = await isGrootApiKey(apiKey);
    }

    if (!isGroot && !isAdmin) {
      return;
    }

    const order = await Order.findById(orderId);

    if (order.order_status !== 4 || order.comissionsCharged) {
      return;
    }

    if (!order.tgUserId) {
      return;
    }

    const principalUser = await findUser(order.tgUserId);
    const referrers = await getReferrers(order.tgUserId);
    const price = await getPrice(order.tokenA_symbol);
    const tokenAmount = order.tokenA_amount;
    const priceBN = new BigNumber(price.replace(',', ''));
    const tokenAmountBN = new BigNumber(tokenAmount);
    const amount = new BigNumber(priceBN).multipliedBy(tokenAmountBN).decimalPlaces(2).toNumber();

    principalUser.swappedTokens = (principalUser.swappedTokens || 0) + amount;

    await principalUser.save();

    order.comissionsCharged = true;
    await order.save();

    const levels = {
      [1]: 0.07,
      [2]: 0.05,
      [3]: 0.03,
    };

    for (const { user, level } of referrers) {
      user.pendingComissions = (user.pendingComissions || 0) + (amount * levels[level]) / 100;
      await user.save();
    }

    return;
  } catch (error) {
    console.log(error);
    console.log('------------------------------------ ERROR COMISSION PROCESS ------------------------------------------------');
  }
};

const getPendingComission = async () => {
  const users = await User.find({ where: { pendingComissions: { $gte: 25 } } });

  return users;
};

const updatePaidComission = async (tgUserId) => {
  const user = await User.findOne({ tgUserId });

  if (!user) {
    throw new Error('User not found');
  }

  user.paidComissions += user.pendingComissions;
  user.pendingComissions = 0;

  await user.save();

  return;
};

const getPrice = async (token) => {
  const service = new CMCService();
  const resp = await service.getCachedLatestQuote(token);

  return resp?.price;
};

const getTgUser = async (tgUserId, search, tgUsername) => {
  let exists = false;
  const user = await User.findOne({ tgUserId });

  if (search === 'strict') {
    return user;
  }

  if (!user) {
    const newUser = await createUser(tgUserId, tgUsername);
    return { exists, user: newUser };
  }

  return { exists: true, user };
};

module.exports = {
  createReferralCode,
  createUser,
  assignTGReferral,
  getTGReferrals,
  getReferrers,
  getComissions,
  getTgUser,
  findUser,
  getPendingComission,
  updatePaidComission,
  updateUser,
  findAllUser,
};
