const express = require("express");
const http = require("http");
const cors = require("cors");
const { initSocket, sendMessageToUser } = require("./src/tool/socket");
const app = express();
const server = http.createServer(app);

const chatRoute = require('./src/router/chat');

app.use(cors());

initSocket(server);

app.post("/send-message", (req, res) => {
    const { to, message } = req.body;
    sendMessageToUser(to, { message });
    res.send({ success: true, message: "Message sent!" });
});

app.use('/chat', chatRoute);

server.listen(3333, () => {
    console.log("🚀 Server running on port 3333");
});
