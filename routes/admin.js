const { json } = require('body-parser');
const express = require('express');

const router = express.Router();

const { body, validationResult } = require('express-validator');

const adminController = require('../controllers/admin');

const authMiddleware = require('../middleware/jwt-auth');

router.get('/', (req, res, next) => {
    res.status(200).json({
        'success':true,
        'message':'running successfully!'
    });
});

router.post('/register', adminController.register);

router.post('/login', adminController.login);

router.get('/data/:name', authMiddleware, adminController.getAdmin);

// /admin/add-product => POST
router.post('/add-product', authMiddleware, adminController.postAddProduct);

router.get('/get-products', adminController.getProducts);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.put('/product-update/:productId', adminController.putUpdateProduct);

router.delete('/product-delete/:productId', adminController.deleteProducts);

//router.post('/edit-product', adminController.postEditProduct);

//router.post('/delete-product', adminController.postDeleteProduct);


module.exports = router;