const { Sequelize } = require('sequelize');
require('dotenv').config();

module.exports = new Sequelize(process.env.ERP_NAME, process.env.ERP_USER, process.env.ERP_PASSWORD, {
    host: process.env.ERP_SERVER,
    dialect: 'mysql',
    logging: false,
    dialectOptions: {
        connectTimeout: 3000,
    },
    timezone: '+00:00',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});