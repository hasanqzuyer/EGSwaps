const cron = require('node-cron');
const Order = require('../models/order.model');
const { updateOrderOne, getFinalStatus } = require('../services/order.service');
const { getComissions } = require('../services/user.service');

const updateLastStatus = async (order) => {
  const finalStatus = await getFinalStatus(order);
  const currentStatus = await order.order_status;
  
  if (finalStatus !== 4 || currentStatus === finalStatus) {
    return false;
  }
  console.log('Updating order', order._id, 'With status', order.order_status, 'to status', finalStatus);  
  await updateOrderOne({ ...order, order_status: finalStatus });

  console.log('Charging comissions for order', order._id, 'With status', order.order_status, 'to status', finalStatus);
  await getComissions(order._id, false, true);

  return true;
}

const start = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('***** JOB ******');
      const pendingOrders = await Order.find({ order_status: 3, domain: 'feenix-tgbot' });
      console.log('***** JOB Total pending orders to check', pendingOrders.length)
    
      const ordersProcessed = await Promise.all(pendingOrders.map(updateLastStatus));
      const updatedOrders = ordersProcessed.filter(e => !!e);
      console.log('***** JOB  Total pending orders updated', updatedOrders.length);
    } catch (error) {
      console.log("Error in job", error);
    }
  
  }).start();
}

module.exports = {
  start,
}