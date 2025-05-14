const { getUser, getUserChat } = require('../controller/chat');
const express = require('express');
const chatRoute = express.Router();

chatRoute.get('/', getUser);
chatRoute.get('/list', getUserChat)

module.exports = chatRoute;