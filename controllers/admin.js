const bcrypt = require('bcrypt');
const dateTime = require('node-datetime');
const AdminModel = require('../models/admin');
const jwt = require('jsonwebtoken');
const {config} = require('../config');
const Product = require('../models/product');

exports.register = (req, res, next) => {
    const {name, email, password} = req.body;
    let dt = dateTime.create();
    let formated = dt.format('Y-m-d H:M:S');

    bcrypt.hash(password.toString(), 10, function(err, hash) {
        let data = hash;
        AdminModel.create({
            name : name, 
            email : email, 
            password : hash, 
            myDate : formated
        }).then(users => {
            if (users) {
                res.status(201).json({
                    'success':true,
                    'message':'User created successfully!',
                    'data':users
                });
            } else {
                res.status(400).json({
                    'success':false,
                    'message':'Something went wrong!'
                });
            }
        }).catch(err => {
            res.status(200).json({
                'success':false,
                'message':'Something went wrong!'
            });
        });
    });
}

exports.login = (req, res, next) => {
    var errors =  checkValidation(req, 'login');
    if (errors) {
        res.status(400).send({ "message": "Missing parameter" });
        return;
    }
    const { email, password } = req.body;

    AdminModel.findAll({
        where:{email:email}
    }).then(user =>{
        if (user.length > 0) {
            return user;
        } else {
            res.status(401).json({
                'success':false,
                'message':'Invalid Credentials'
            });
        }
    }).then(storeUser => {
        if(bcrypt.compareSync(password.toString(), storeUser[0]['password'])) {
            jwt.sign({user:storeUser}, config.secretkey, (err, token) => {
                res.json({
                    token,
                    'data':storeUser
                });
            });
        } else {
            res.status(400).json({
                'success':false,
                'message':'Password do not match!'
            });
        }
    }).catch(err =>{
        console.log(err);
    });
}

checkValidation = (req, method) => {
    switch (method) {
        case 'login':
            req.checkBody("email", "Invalid company").notEmpty();        
            break;
    
        default:
            break;
    }
    return req.validationErrors();
}

exports.getAdmin = (req, res, next) => {
    const admin = new AdminModel(req.params.name);
    console.log(req.authData);
    res.status(200).json({
        name:req.params.name,
        date: new Date().toLocaleDateString().split('/').reverse().join('-')
    });
    //res.send(`<h1>Admin is ${name}</h1>`);
}

exports.postAddProduct = (req, res, next) => {
    req.user.createProduct({
        title:'new one',
        price: 4200,
        imageUrl: 'https://www.google.com/search?q=product+images&source=lnms&tbm=isch&sa=X&ved=2ahUKEwid5rWs0MHtAhUJzjgGHQdXCWYQ_AUoAXoECBwQAw&biw=1853&bih=981',
        description:'first new product'
    }).then(result => {
        res.status(200).json({
            'success':true,
            'message':'Product added successfully!'
        });
    }).catch(err => {
        res.status(400).json({
            'success':false,
            'message':'Something went wrong'
        });
    });
    return;
    Product.create({
        title:'new one',
        price: 4200,
        imageUrl: 'https://www.google.com/search?q=product+images&source=lnms&tbm=isch&sa=X&ved=2ahUKEwid5rWs0MHtAhUJzjgGHQdXCWYQ_AUoAXoECBwQAw&biw=1853&bih=981',
        description:'first new product'
    }).then(result => {
        res.status(200).json({
            'success':true,
            'message':'Product added successfully!'
        });
    }).catch(err => {
        res.status(400).json({
            'success':false,
            'message':'Something went wrong'
        });
    });
};

exports.getProducts = (req, res, next) => {
    Product.findAll().then(products => {
        res.status(200).json({
            'success':true,
            'data':products
        });
    }).catch(err => {
        res.status(400).json({
            'success':false,
            'message':'Something went wrong'
        });
    });
}

exports.getEditProduct = (req, res, next) => {
    const prodId = req.params.productId;
    req.user.getProducts({
        where:{
            id:prodId
        }}).then(product => {
        res.status(200).json({
            'success':true,
            'data':product
        });
    }).catch(err => {
        res.status(400).json({
            'success':false,
            'message':'Something went wrong'
        });
    });
    return;
    Product.findByPk(prodId).then(product => {
        console.log(product);
    }).catch(err => {
        console.log(err);
    });
}

exports.putUpdateProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId).then(product => {
        product.title = 'Another new one';
        product.price = 4300;
        product.imageUrl = 'https://www.google.com/search?q=product+images&source=lnms&tbm=isch&sa=X&ved=2ahUKEwid5rWs0MHtAhUJzjgGHQdXCWYQ_AUoAXoECBwQAw&biw=1853&bih=981';
        product.description = 'first new product';
        return product.save();
        // product.save().then(result => {
        //     console.log(result);
        // }).catch(err => {
        //     console.log(err);
        // });
    }).then(result => {
        res.json({
            'success':true,
            'message':'Product updated successfully!'
        });
    }).catch(err => {
        res.status(400).json({
            'success':false,
            'message':'Something went wrong'
        });
    });
}

exports.deleteProducts = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId).then(product => {
        product.destroy();
    }).then(result => {
        res.json({
            'success':true,
            'message':'Product deleted successfully!'
        });
    }).catch(err => {
        res.status(400).json({
            'success':false,
            'message':'Something went wrong'
        });
    });
}
