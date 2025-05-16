const userTable = require('../models/user');
const chatTable = require('../models/chat');
const response = require('../tool/response');
const { Op } = require('sequelize');
const db = require('../tool/db');
const { sendMessageToUser, updateDashboardUser } = require('../tool/socket');


const getDashboardChat = async (req, res) => {
    try {
        const userNip = req.user.nip;
        const page = parseInt(req.query.page) || 1;
        const pageSize = 10;
        const offset = (page - 1) * pageSize;

        const chats = await db.query(
            `SELECT
                c.nip,
                u1.name AS nip_name,
                u1.photo AS nip_photo,
                u1.outlet AS nip_outlet,
                u1.last_online AS nip_last_online,
                u1.is_online AS nip_is_online,

                c.target,
                u2.name AS target_name,
                u2.photo AS target_photo,
                u2.outlet AS target_outlet,
                u2.last_online AS target_last_online,
                u2.is_online AS target_is_online,

                c.content,
                c.time,
                c.id,
                c.readed,
                IFNULL(unread.unread_count, 0) AS unread_count

            FROM 
                chat c

            INNER JOIN (
                SELECT
                    LEAST(nip, target) AS user1,
                    GREATEST(nip, target) AS user2,
                    MAX(time) AS max_time
                FROM 
                    chat
                WHERE 
                    nip = :userNip OR target = :userNip
                GROUP BY 
                    user1, user2
            ) last_msg ON 
                LEAST(c.nip, c.target) = last_msg.user1 AND
                GREATEST(c.nip, c.target) = last_msg.user2 AND
                c.time = last_msg.max_time

            LEFT JOIN (
              SELECT
                LEAST(nip, target) AS user1,
                GREATEST(nip, target) AS user2,
                SUM(CASE WHEN readed = '0' AND target = :userNip THEN 1 ELSE 0 END) AS unread_count
              FROM 
                chat
              WHERE 
                nip = :userNip OR target = :userNip
              GROUP BY 
                user1, user2
            ) unread ON
                LEAST(c.nip, c.target) = unread.user1 AND
                GREATEST(c.nip, c.target) = unread.user2

            LEFT JOIN user u1 ON c.nip = u1.nip
            LEFT JOIN user u2 ON c.target = u2.nip

            ORDER BY c.time DESC
            LIMIT :limit OFFSET :offset;`,
            {
                replacements: {
                    userNip,
                    limit: pageSize,
                    offset
                },
                type: db.QueryTypes.SELECT
            }
        );

        res.send(response(true, chats));
    } catch (error) {
        res.status(500).send(response(false, null, error.message));
    }
};

const getUserChat = async (req, res) => {
    try {
        const user = req.user.nip;
        const target = req.query.target;
        const page = req.query.page || 1;
        const limit = 20;
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

const getUser = async (req, res) => {
    try {
        const nip = req.params.nip;

        const user = await userTable.findOne({
            where: {
                nip: nip
            },
            raw: true
        });
        res.send(response(true, user));
    } catch (error) {
        console.error(error.message)
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
        const nip = req.user.nip;
        const target = req.body.target;
        const content = req.body.content;
        const id = req.body.id;
        await chatTable.create({
            nip: nip,
            target: target,
            content: content,
            id: id,
            readed: '0'
        });

        const chat = await chatTable.findOne({
            where: {
                id: id
            },
            raw: true
        });

        res.send(response(true, null, 'SUCCESS'));
        const updateDashboard = await db.query(
            `SELECT
    c.nip,
    u1.name AS nip_name,
    u1.photo AS nip_photo,
    u1.outlet AS nip_outlet,
    u1.last_online AS nip_last_online,
    u1.is_online AS nip_is_online,

    c.target,
    u2.name AS target_name,
    u2.photo AS target_photo,
    u2.outlet AS target_outlet,
    u2.last_online AS target_last_online,
    u2.is_online AS target_is_online,

    c.content,
    c.time,
    c.id,
    c.readed,
    IFNULL(unread.unread_count, 0) AS unread_count

FROM
    chat c

LEFT JOIN user u1 ON c.nip = u1.nip
LEFT JOIN user u2 ON c.target = u2.nip

LEFT JOIN (
    SELECT
        LEAST(nip, target) AS user1,
        GREATEST(nip, target) AS user2,
        SUM(CASE WHEN readed = '0' AND target = :nip THEN 1 ELSE 0 END) AS unread_count
    FROM chat
    GROUP BY user1, user2
) unread ON
    LEAST(c.nip, c.target) = unread.user1 AND
    GREATEST(c.nip, c.target) = unread.user2

WHERE c.id = :id
LIMIT 1;`,
            {
                replacements: { id, nip },
                type: db.QueryTypes.SELECT
            }
        );
        sendMessageToUser(target, chat);
        updateDashboardUser(target, updateDashboard[0]);
    } catch (err) {
        console.error(`
            Error
            err: ${err}
            message: ${err.message}
            stack: ${err.stack}
        `)
        res.status(500).send(response(false, null, err.message));
    }
}

module.exports = {
    getUserChat,
    getUsers,
    getUser,
    postChat,
    getDashboardChat
}