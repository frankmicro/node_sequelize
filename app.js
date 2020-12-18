const express = require('express');

const bodyParser = require('body-parser');

const expressValidator = require('express-validator');

const path = require('path');

const app = express();

const adminRoutes = require('./routes/admin');
const errorController = require('./controllers/error');
const shopRouter = require('./routes/shop');
const sequelize = require('./util/database');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(express.static(__dirname + '/public'));

// Import the sequelize object on which 
// we have defined model. 
// Import the user model we have defined 
const User = require('./models/admin'); 
const Product = require('./models/product'); 
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

Product.belongsTo(User,{constraints:true, onDelete:'CASCADE'});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {through:CartItem});
Product.belongsToMany(Cart, {through:CartItem});

app.use((req, res, next) => {
    User.findByPk(1).then(user => {
            req.user = user;
            next();
        }).catch(err => {
            console.log(err);
        }); 
});

app.use('/admin',adminRoutes);
app.use(shopRouter);

app.use(errorController.get404);
  
// Create all the table defined using  
// sequelize in Database 
  
// Sync all models that are not 
// already in the database 
//sequelize.sync();  
  
// Force sync all models 
// It will drop the table first  
// and re-create it afterwards 
sequelize.sync().then(result => {
    app.listen(3000);
})
.catch(err => {
    console.log(err);
}); 

