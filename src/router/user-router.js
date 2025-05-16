const { getUserChat, getUsers, getChat, getUser, postChat } = require('../controller/chat-controller');
const express = require('express');
const chatRoute = express.Router();

chatRoute.get('/users', getUsers);
chatRoute.get('/user/:nip', getUser);

module.exports = chatRoute;