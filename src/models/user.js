const { DataTypes, Sequelize } = require('sequelize');
const db = require('../tool/db');

module.exports = db.define('user', {
    nip: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    },
    photo: {
        type: DataTypes.STRING
    },
    division: {
        type: DataTypes.STRING
    },
    last_online: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    socket_id: {
        type: DataTypes.STRING
    },
    is_online: {
        type: DataTypes.ENUM('0', '1'),
        defaultValue: '0'
    },
    outlet: {
        type: DataTypes.STRING
    }
}, {
    freezeTableName: true
});