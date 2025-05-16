const { getUserChat, postChat, getDashboardChat } = require('../controller/chat-controller');
const express = require('express');
const chatRoute = express.Router();

chatRoute.get('/list', getUserChat);
chatRoute.get('/dashboard', getDashboardChat);
chatRoute.post('/send', postChat);

module.exports = chatRoute;