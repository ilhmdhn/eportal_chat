const userTable = require('../models/user');
const chatTable = require('../models/chat');
const response = require('../tool/response');
const { Op } = require('sequelize');

const getChat = (req, res) => {
    try {

    } catch (error) {

    }
}

const getUserChat = async (req, res) => {
    try {
        const user = req.query.user;
        const target = req.query.target;
        const page = req.query.page || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const data = await chatTable.findAll({
            where: {
                [Op.or]: [
                    { [Op.and]: [{ nip: user }, { target: target }] },
                    { [Op.and]: [{ nip: target }, { target: user }] }
                ]
            },
            order: [['time', 'DESC']],
            limit: limit,
            offset: offset,
            raw: true
        });

        res.send(response(true, data));
    } catch (error) {
        res.status(500).send(response(false, null, error.message));
    }
}

const getUsers = async (req, res) => {
    try {
        console.log(`LOLOLO`)
        const user = await userTable.findAll({
            raw: true
        });
        res.send(response(true, user));
    } catch (error) {
        console.error(error.message)
        res.status(500).send(response(false, null, error.message));
    }
}

module.exports = {
    getChat,
    getUserChat,
    getUsers
}