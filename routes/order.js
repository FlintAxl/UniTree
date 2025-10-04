const express = require('express');
const router = express.Router();
const order = require('../Controllers/order');
router.post('/order', order.createOrder);
router.get('/my-orders/:user_id', order.getCustomerOrders);
router.patch('/cancel-order', order.cancelOrder);

// New routes for admin

module.exports = router;