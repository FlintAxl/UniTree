const express = require('express');
const router = express.Router();
const reviewController = require('../Controllers/review');

// Get items from an order to review
router.get('/order-items/:order_id', reviewController.getProductsByOrder);

// Create reviews
router.post('/reviews', reviewController.createReviews);

// Admin
router.get('/reviews/all', reviewController.getAllReviews);
router.delete('/reviews/:review_id', reviewController.deleteReview);

module.exports = router;
