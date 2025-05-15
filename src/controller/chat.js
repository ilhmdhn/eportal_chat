const userTable = require('../models/user');
const chatTable = require('../models/chat');
const response = require('../tool/response');
const { Op } = require('sequelize');
const chat = require('../models/chat');

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
            order: [['time', 'ASC']],
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
        const user = await userTable.findAll({
            raw: true
        });
        res.send(response(true, user));
    } catch (error) {
        console.error(error.message)
        res.status(500).send(response(false, null, error.message));
    }
}

const postChat = async (req, res) => {
    try {
        await chatTable.create({
            nip: '',
            target: '',
            time: '',
            content: '',
            readed: '',
            reply_from: '',
            id: '',
            media: '',
        });
        
    } catch (err) {
        console.error(err.message)
        res.status(500).send(response(false, null, error.message));
    }
}

module.exports = {
    getChat,
    getUserChat,
    getUsers
}