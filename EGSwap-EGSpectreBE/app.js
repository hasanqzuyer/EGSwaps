// Load environment variables
require('dotenv').config();

// Import dependencies
const express = require('express');
const fileUpload = require('express-fileupload');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { start: startJob } = require('./jobs/sync-order');
// Import routers.
const routers = require('./routes');

// Import Swagger dependencies
const swaggerUi = require('swagger-ui-express');
const swaggerDefinition = require('./docs');
const swaggerJSDoc = require('swagger-jsdoc');

// Configure Swagger options
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJSDoc(options);

// Set CORS options
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

// Connect to MongoDB
mongoose.set('debug', process.env.APP_ENV === 'development');
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Successfully connected to the database!');
    startJob();
  })
  .catch((error) => {
    console.error(`An error occurred while connecting to the database: ${error}`);
    process.exit(1);
  });

// Create Express app
const app = express();

// Apply rate limiting to all requests
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later',
});

// Apply middleware
app.use(morgan('tiny'));
app.use(helmet({ hidePoweredBy: true }));
app.use(fileUpload());
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// proxy
app.set('trust proxy', true);

// Initialize routers
app.use('/egspectre-api/v1', routers);

// Serve Swagger documentation
app.use('/egspectre-api/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((error, req, res, next) => {
  console.log(error.message);
  res.status(500).send('An internal server error occurred.');
});

// Start the server
const startServer = async () => {
  try {
    const port = process.env.APP_PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}!`);
    });
  } catch (error) {
    console.error(`An error occurred while starting the server: ${error}`);
    process.exit(1);
  }
};

startServer();
