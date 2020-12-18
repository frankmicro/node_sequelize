const express = require('express');
const Cart = require('../models/cart');
const Product = require('../models/product');
const multer = require('multer');
const path = require('path');
const upload = multer({dest:'uploads/'}).single("demo_image");


const app = express();

exports.addCart = (req, res, next) => {
    req.user.createCart();
    res.status(200).json({
        'success':true,
        'message':'add cart function',
        'user':req.user
    });
}

exports.getCart = (req, res, next) => {
    let fetchCart;
    req.user.getCart().then(cart => {
        fetchCart = cart;
    }).catch(err => {
        res.status(400).json({
            'success':false,
            'message':'No records found'
        });
    });
    Product.findByPk(1).then(product => {
        fetchCart.addProduct(product, {through: {
            quantity: 1
        }});
        res.status(200).json({
            'success':true,
            'data':product
        });
    }).catch();
    
}

exports.getProducts = (req, res, next) => {
    req.user.getCart().then(cart => {
        return cart.getProducts({
            where:{id:1}
        });
    }).then(products => {
        res.status(200).json({
            'success':true,
            'get-products':true,
            'data':products
        });
    }).catch(err => {
        res.status(400).json({
            'success':false,
            'message':'No Products found!'
        });
    });
}

exports.deleteProducts = (req, res, next) => {
    req.user.getCart().then(cart => {
        return cart.getProducts({
            where:{id:1}
        });
    }).then(products => {
        const product = products[0];
        product.cartItem.destroy();

        res.status(200).json({
            'success':true,
            'delete-products':true,
            'message':'Product deleted successfully!'
        });
    })
}

exports.getCartAsync = async (req, res, next) => {
    const cart = await req.user.getCart();
    if (cart) {
        const product = await Product.findByPk(1);
        if (product) {
            cart.addProduct(product, {through:{
                quantity: 2
            }});
        }
        res.status(200).json({
            'success':true,
            'data':product
        });
    } else {
        res.status(400).json({
            'success':false,
            'message':'No records found'
        });
    }
}

exports.test = (req, res, next) => {
    upload(req, res, (err) => {
        if(err) {
          res.status(400).send("Something went wrong!");
        }
        res.send(req.file);
      });
}