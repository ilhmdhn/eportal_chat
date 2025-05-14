const { Server } = require("socket.io");
const { getDetailEmployee } = require("./axios");
const userTable = require('../models/user');
const { where } = require("sequelize");

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
            insertEmployee(nip, socket.id);
        }

        socket.on("sendMessage", (data) => {
            console.log("📩 Message received:", data);
            // sendMessageToUser(data.to, data);
        });

        socket.on("disconnect", () => {
            console.log(`❌ User ${nip} disconnected`);
            delete users[nip];
            employeeOff(nip);
        });
    });
};

const insertEmployee = async (nip, socketId) => {
    try {
        const employeeDetail = await getDetailEmployee(nip)
        await userTable.upsert({
            nip: employeeDetail.nip,
            name: employeeDetail.name,
            photo: employeeDetail.picture,
            division: employeeDetail.jabatan,
            last_online: new Date(),
            socket_id: socketId,
            is_online: '1',
            outlet: employeeDetail.outlet
        });
        io.emit('ON', {
            nip: nip
        });
    } catch (error) {
        console.log(`Error insert employee detail
            Err: ${error}    
            message: ${error.message}    
            Stack: ${error.stack}    
        `);
    }
}

const employeeOff = async (nip) => {
    try {
        await userTable.update({
            is_online: '0',
            last_online: new Date()
        }, {
            where: {
                nip: nip
            }
        });
        io.emit('OFF', {
            nip: nip,
            last_online: new Date().toISOString()
        },);
    } catch (error) {
        console.error(`
            Error employeeOff
            Error: ${error}
            message: ${error.message}
            stack: ${error.stack}
        `);
    }
}

const sendMessageToUser = async (nip, message) => {
    const targetSocketIdTemp = await userTable.findOne({
        where: {
            nip: nip
        },
        raw: true
    });
    const targetSocketId = targetSocketIdTemp.socket_id;
    if (targetSocketId) {
        io.to(targetSocketId).emit("chat", {
            sender: 'Agus',
            message: 'ngarit'
        });
        // io.emit('chat', {
        //     sender: 'NGARIT',
        //     message: new Date().toISOString()
        // },);
        console.log(`📤 Message sent to ${nip} (socket ID: ${targetSocketId})`);
    } else {
        console.log(`⚠️ User ${userId} is not online`);
    }
};

module.exports = { initSocket, sendMessageToUser };