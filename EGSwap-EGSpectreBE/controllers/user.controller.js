const {
  createReferralCode,
  getTGReferrals,
  assignTGReferral,
  getTgUser,
  findUser,
  updateUser,
  findAllUser,
  updatePaidComission,
} = require('./../services/user.service');

const generateReferralCode = async (req, res, next) => {
  const { tgUserId, walletAddress } = req.body;

  const user = await findUser(tgUserId);

  if (!user) {
    res.status(200).json({ error: 'User not found', user: null });
    return;
  }

  if (user.swappedTokens < Number(process.env.GROOT_MIN_SWAPPED_TOKEN)) {
    res.status(200).json({ error: `User has not swapped tokens worth $${Number(process.env.GROOT_MIN_SWAPPED_TOKEN)}` });
    return;
  }

  const code = await createReferralCode();

  const updatedUser = await updateUser(user, { referralCode: code, walletAddress });

  res.status(200).json({ user: updatedUser, error: null });
};

const assignReferral = async (req, res, next) => {
  const { tgUserId, referralCode } = req.body;
  const resp = await assignTGReferral(tgUserId, referralCode);

  res.status(200).json(resp);
};

const getReferrals = async (req, res, next) => {
  const { tgUserId } = req.params;

  const referrals = await getTGReferrals(tgUserId);

  res.status(200).json(referrals);
};

const getUsers = async (req, res, next) => {
  const users = await findAllUser();

  res.status(200).json(users);
};

const payReferrer = async (req, res, next) => {
  await updatePaidComission(req.body.tgUserId);

  res.status(200).json(true);
};

const getUser = async (req, res, next) => {
  const user = await getTgUser(req.params.tgUserId, req.query.search, req.query.username);

  res.status(200).json(user);
};

module.exports = {
  generateReferralCode,
  assignReferral,
  getReferrals,
  getUsers,
  payReferrer,
  getUser,
};
