const AdminService = require('../services/admin.service');
const { formatResponse } = require('../utils/formatResponse');

async function getMessageByWallet(req, res) {
  try {
    const { wallet_address } = req.body;
    if (!wallet_address) {
      throw new Error('wallet_address is required');
    }
    const sign_message = await AdminService.getMessage({ wallet_address });
    if (sign_message === '') return formatResponse(res, { message: 'Invalid admin wallet address' }, 401);
    else return formatResponse(res, { sign_message });
  } catch (error) {
    return formatResponse(res, { message: 'Internal server error' }, 500);
  }
}

async function signInWithSignature(req, res) {
  try {
    const { wallet_address, signature } = req.body;
    if (!wallet_address || !signature) {
      throw new Error('wallet_address is required');
    }
    const [user, isValidAddress] = await AdminService.validateAddressWithSignature(signature, wallet_address);
    if (!isValidAddress) {
      throw new Error('Not valid message/signature for wallet address');
    }
    console.log({ user, isValidAddress })
    const jwt_token = AdminService.signUser(user);

    formatResponse(res, { jwt_token });
  } catch (error) {
    formatResponse(res, { message: 'Internal server error' }, 500);
  }
}

async function checkIsAdmin(req, res) {
  try {
    const { wallet_address } = req.body;
    if (!wallet_address) {
      throw new Error('wallet_address is required');
    }
    const isAdmin = await AdminService.isAdminAddress(wallet_address);
    formatResponse(res, { isAdmin });
  } catch (error) {
    formatResponse(res, { message: 'Internal server error' }, 500);
  }
}

async function getWarningStatus(req, res) {
  try {
    const responseObj = await AdminService.getWarningObject();
    formatResponse(res, responseObj);
  } catch (error) {
    formatResponse(res, { message: 'Internal server error' }, 500);
  }
}

async function updateWarningStatus(req, res) {
  try {
    const updateRes = await AdminService.updateWarningObject(req.body);
    if (!updateRes) formatResponse(res, { message: 'Internal server error' }, 500);
    else formatResponse(res, { message: 'Success' });
  } catch (error) {
    formatResponse(res, { message: 'Internal server error' }, 500);
  }
}

async function getMaintenanceMode(req, res) {
  try {
    const responseObj = await AdminService.getMaintenanceObject();
    formatResponse(res, responseObj);
  } catch (error) {
    formatResponse(res, { message: 'Internal server error' }, 500);
  }
}

async function updateMaintenanceMode(req, res) {
  try {
    const updateRes = await AdminService.updateMaintenanceObject(req.body);
    if (!updateRes) formatResponse(res, { message: 'Internal server error' }, 500);
    else formatResponse(res, { message: 'Success' });
  } catch (error) {
    formatResponse(res, { message: 'Internal server error' }, 500);
  }
}

async function getOpenApiKey(req, res) {
  try {
    const apiKey = await AdminService.generateOpenApiKey(req.body);
    formatResponse(res, { apiKey });
  } catch (error) {
    console.log(error);
    formatResponse(res, { message: 'Internal server error' }, 500);
  }
}

async function getApiKeys(req, res) {
  try {
    const apiKeys = await AdminService.getAllKeys();
    formatResponse(res, apiKeys);
  } catch (error) {
    console.log(error);
    formatResponse(res, { message: 'Internal server error' }, 500);
  }
}

async function getApiKeyLogsCtrl(req, res) {
  try {
    const logs = await AdminService.getApiKeyLogs(req.params.key, req.query.offset, req.query.limit);
    formatResponse(res, logs);
  } catch (e) {
    console.log(e);
    formatResponse(res, { message: 'Internal server error' }, 500);
  }
}

async function getApiKeyStatsCtrl(req, res) {
  try {
    const stats = await AdminService.getApiKeyStats(req.params.key);
    formatResponse(res, stats);
  } catch (e) {
    console.log(e);
    formatResponse(res, { message: 'Internal server error' }, 500);
  }
}

async function removeApiKey(req, res) {
  try {
    if (req.query.soft_delete === 'true') {
      await AdminService.setInactiveApiKey(req.params.key, req.query.active === 'true');
    } else {
      await AdminService.deleteKey(req.params.key);
    }
    formatResponse(res, true);
  } catch (error) {
    console.log(error);
    formatResponse(res, { message: 'Internal server error' }, 500);
  }
}

async function getWidgetUsers(req, res) {
  try {
    const widgetUsers = await AdminService.getWidgetUsers();
    formatResponse(res, widgetUsers);
  } catch (error) {
    console.log(error);
    formatResponse(res, { message: 'Internal server error' }, 500);
  }
}

module.exports = {
  getMessageByWallet,
  signInWithSignature,
  checkIsAdmin,
  getWarningStatus,
  updateWarningStatus,
  getMaintenanceMode,
  updateMaintenanceMode,
  getOpenApiKey,
  getApiKeys,
  removeApiKey,
  getApiKeyLogsCtrl,
  getApiKeyStatsCtrl,
  getWidgetUsers,
};
