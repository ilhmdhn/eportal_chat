const { DataTypes, Sequelize } = require('sequelize');
const db = require('../tool/db');

module.exports = db.define('chat', {
    nip: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    target: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    time: {
        type: DataTypes.DATE,
        primaryKey: true,
        defaultValue: Sequelize.NOW
    },
    content: {
        type: DataTypes.TEXT,
    },
    readed: {
        type: DataTypes.ENUM(['0', '1']),
    },
    reply_from: {
        type: DataTypes.STRING,
    },
    id: {
        type: DataTypes.STRING,
        unique: true
    },
    media: {
        type: DataTypes.STRING,
    },
}, {
    freezeTableName: true
});