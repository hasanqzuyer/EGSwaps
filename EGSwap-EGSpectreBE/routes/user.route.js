let express = require('express');
var router = express.Router();

const { authKeyMiddleware } = require('../middleware/auth');
const userController = require('../controllers/user.controller');

router.get('/', authKeyMiddleware, userController.getUsers);
router.get('/:tgUserId', authKeyMiddleware, userController.getUser);
router.get('/referral/:tgUserId', userController.getReferrals);

router.post('/referral/generate-code', authKeyMiddleware, userController.generateReferralCode);
router.post('/referral/assign', authKeyMiddleware, userController.assignReferral);
router.put('/referral/pay', authKeyMiddleware, userController.payReferrer);

module.exports = router;
