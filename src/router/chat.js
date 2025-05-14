const { getUserChat, getUsers, getChat } = require('../controller/chat');
const express = require('express');
const chatRoute = express.Router();

chatRoute.get('/', getChat);
chatRoute.get('/list', getUserChat)
chatRoute.get('/users', getUsers)

module.exports = chatRoute;