const ApiKey = require('../models/apiKey.model');
const { getMaintenanceObject } = require('../services/admin.service');
const { getAuthorizationHeader, getApiKeyHeader } = require('../utils/auth');
const jwt = require('jsonwebtoken');

const allowedOrigins = ['https://egswap.exchange', 'https://egswap.exchange/', 'https://egswap.exchange', 'http://localhost:3001'];
async function authMiddleware(req, res, next) {
  try {
    const token = getAuthorizationHeader(req);

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { wallet_address } = payload;

    if (!payload || !wallet_address) {
      return res.status(401).send('User not authorized or not exist');
    }
    next();
  } catch (error) {
    return res.status(401).send('Token expired/invalid');
  }
}

async function authKeyMiddleware(req, res, next) {
  try {
    const token = req.headers['x-api-key'];

    if (token) {
      const apiKey = await ApiKey.findOne({ key: token });

      if (!apiKey) {
        return res.status(401).send('Not Authorized');
      }

      if (!apiKey.active) {
        return res.status(401).send('Token is not active');
      }

      if (apiKey.expiredAt < new Date()) {
        apiKey.active = false;
        await apiKey.save();
        return res.status(401).send('Token is expired');
      }

      req.apiKey = apiKey.key;
    } else {
      if (allowedOrigins.includes(req.headers.origin) || allowedOrigins.includes(req.headers.referer)) {
        req.isEgswap = true;
      } else {
        throw new Error('Missing x-api-key header');
      }

      const maintenanceMode = await getMaintenanceObject();
      if (maintenanceMode?.maintenance_status && req.method === 'POST') {
        return res.status(401).send('Maintenance mode is ON');
      }
    }

    next();
  } catch (error) {
    return res.status(401).send({ error: error.message });
  }
}

module.exports = { authMiddleware, authKeyMiddleware };
