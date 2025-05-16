const { getUserChat, getChat, postChat, getDashboardChat } = require('../controller/chat-controller');
const express = require('express');
const chatRoute = express.Router();

chatRoute.get('/', getChat);
chatRoute.get('/list', getUserChat);
chatRoute.post('/send', postChat);
chatRoute.get('/dashboard', getDashboardChat);

module.exports = chatRoute;