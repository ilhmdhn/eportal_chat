const { Server } = require("socket.io");

let io;
const users = {};

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    io.on("connection", (socket) => {
        const nip = socket.handshake.query.nip;
        console.log('ADA YANG KONEKKK ' + nip);
        if (nip) {
            users[nip] = socket.id;
            console.log(`✅ User ${nip} connected with socket ID: ${socket.id}`);
        }

        socket.on("sendMessage", (data) => {
            console.log("📩 Message received:", data);
            sendMessageToUser(data.to, data);
        });

        socket.on("disconnect", () => {
            console.log(`❌ User ${nip} disconnected`);
            delete users[nip];
        });
    });
};

const sendMessageToUser = (userId, message) => {
    const targetSocketId = users[userId];
    if (targetSocketId) {
        io.to(targetSocketId).emit("receiveMessage", message);
        console.log(`📤 Message sent to ${userId} (socket ID: ${targetSocketId})`);
    } else {
        console.log(`⚠️ User ${userId} is not online`);
    }
};

module.exports = { initSocket, sendMessageToUser };