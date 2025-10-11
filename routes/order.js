const express = require('express');
const router = express.Router();
const order = require('../Controllers/order');

// Existing routes
router.post('/order', order.createOrder);
router.get('/my-orders/:user_id', order.getCustomerOrders);
router.patch('/cancel-order', order.cancelOrder);

// New routes for seller order management
router.get('/seller/:sellerId/orders', order.getSellerOrders);
router.put('/orders/:orderId/status', order.updateOrderStatusSeller);

router.get('/my-rewards/:user_id', order.getUserRewards);



module.exports = router;