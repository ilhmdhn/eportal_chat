const express = require("express");
const http = require("http");
const cors = require("cors");
const { initSocket, sendMessageToUser } = require("./src/tool/socket");
const app = express();
const server = http.createServer(app);
const fs = require('fs');
const privateKey = fs.readFileSync('private.key');
const jwt = require('jsonwebtoken');

const chatRoute = require('./src/router/chat-router');
const userRoute = require('./src/router/user-router');


const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({
            state: false,
            message: 'token not found'
        });
    }
    jwt.verify(
        token,
        privateKey,
        { ignoreExpiration: true },
        (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    state: false,
                    message: 'invalid token'
                });
            } else {
                req.user = decoded;
                next();
            }
        });
};


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initSocket(server);

app.use(verifyToken);

app.use('/chat', chatRoute);
app.use('/user', userRoute);

server.listen(3333, () => {
    console.log("🚀 Server running on port 3333");
});
