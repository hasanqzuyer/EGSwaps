let express = require('express');
var router = express.Router();

const { authKeyMiddleware } = require('../middleware/auth');
const quoteController = require('../controllers/quote.controller');

/**
 * @swagger
 * /egspectre-api/v1/quotes:
 *   post:
 *     summary: Get the quote for exchange token price
 *     tags:
 *       - Quotes
 *     produces:
 *       - application/json
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Quote'
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/QuoteResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: Bad Request
 *       500:
 *         description: An unexpected error occurred. Please try again later.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred. Please try again later.
 */
router.post('/', authKeyMiddleware, quoteController.getQuote);

/**
 * @swagger
 * /egspectre-api/v1/quotes/categories:
 *   get:
 *     summary: Get the category list
 *     tags:
 *       - Quotes
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: An unexpected error occurred. Please try again later.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred. Please try again later.
 */
router.get('/categories', quoteController.listCategories);

/**
 * @swagger
 * /egspectre-api/v1/quotes/networks:
 *   get:
 *     summary: Get the network list
 *     tags:
 *       - Quotes
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Network'
 *       500:
 *         description: An unexpected error occurred. Please try again later.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred. Please try again later.
 */
router.get('/networks', quoteController.listNetworks);

/**
 * @swagger
 * /egspectre-api/v1/quotes/tokens:
 *   get:
 *     summary: Get the token list
 *     tags:
 *       - Quotes
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Token'
 *       500:
 *         description: An unexpected error occurred. Please try again later.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: An unexpected error occurred. Please try again later.
 */
router.get('/tokens', quoteController.listTokens);

module.exports = router;
