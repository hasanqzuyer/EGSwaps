const express = require('express');
const router = express.Router();

const orderRouter = require('./order.route');
const quoteRouter = require('./quote.route');
const adminRouter = require('./admin.route');
const userRouter = require('./user.route');
const { authKeyMiddleware } = require('../middleware/auth');

router.use('/orders', orderRouter);
router.use('/quotes', quoteRouter);
router.use('/admin', adminRouter);
router.use('/user', userRouter);

/**
 * @swagger
 * /egspectre-api/v1:
 *   get:
 *     summary: Welcome to egSpectre API Doc
 *     description: Returns a welcome string for the egSpectre API documentation.
 *     responses:
 *       200:
 *         description: A successful response with a welcome string.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                   description: The title of the egSpectre API Doc page.
 *               example:
 *                 title: egSpectre API Doc
 */
router.get('/', function (req, res) {
  res.render('index', { title: 'egSpectre API Doc' });
});
module.exports = router;
