const express = require('express');

const router = express.Router();

const cartController = require('../controllers/shop');

router.post('/add-cart', cartController.addCart);

router.get('/get-cart', cartController.getCart);

router.get('/get-products', cartController.getProducts);

router.delete('/delete-product', cartController.deleteProducts);

router.get('/async-get-cart', cartController.getCartAsync);

router.post('/test', cartController.test);

module.exports = router;