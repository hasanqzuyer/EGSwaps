const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  tgUserId: {
    type: String,
    required: true,
  },
  tgUsername: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    required: false,
  },
  referralCode: {
    type: String,
    required: false,
  },
  swappedTokens: {
    type: Number,
    required: false,
    default: 0,
  },
  pendingComissions: {
    type: Number,
    required: false,
    default: 0,
  },
  paidComissions: {
    type: Number,
    required: false,
    default: 0,
  },
  referredBy: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre('save', (next) => {
  next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
