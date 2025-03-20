const mongoose = require('mongoose');
const ApiKeyLog = require('./apiKeyLog.model');
const { Schema } = mongoose;

const CustomIdSchema = new Schema({
  apiKeyId: String,
  orderId: String,
  customId: String,
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

CustomIdSchema.pre('save', (next) => {
  const currentDate = new Date();

  this.updatedAt = currentDate;

  if (!this.createdAt) {
    this.createdAt = currentDate;
  }
  next();
});

const CustomId = mongoose.model('CustomId', CustomIdSchema);
module.exports = CustomId;
