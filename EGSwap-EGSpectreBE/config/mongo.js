// Load environment variables
require('dotenv').config();
const mongoose = require('mongoose');

const connectMongo = async() => {
  return new Promise((resolve, reject) => {
    mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('Successfully connected to the database!');
      Promise.resolve();
    })
    .catch((error) => {
      console.error(`An error occurred while connecting to the database: ${error}`);
      Promise.reject();
    });
  })
}

module.exports = {
  connectMongo,
}