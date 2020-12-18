const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'first_node',
    'root',
    'testing',
    {
       logging: false,
       dialect:'mysql', 
       host:'localhost'
    }
);

module.exports = sequelize;

