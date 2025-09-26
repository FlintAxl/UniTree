const express = require('express');
const router = express.Router();
const upload = require('../utils/multer'); // multer fixed export

const { 
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllCategories
} = require('../Controllers/product');

router.get('/products', getAllProducts);
router.get('/products/:id', getSingleProduct);
router.post('/products', upload.array('image', 10), createProduct);
router.put('/products/:id', upload.array('image', 10), updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/categories', getAllCategories);

module.exports = router;
