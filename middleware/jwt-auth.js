const jwt = require('jsonwebtoken');
const {config} =  require('../config');

module.exports = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearerToken = bearerHeader.split(' ')[1];
        jwt.verify(bearerToken, config.secretkey, (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.authData = authData
                next();
            }
        });
    } else {
        res.status(403).json({
            'success':false,
            'message':'Unauthorized'
        });
    }
}