const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);

let users = [];
let messages = {
    general: [],
    random: [],
    jokes: [],
    javascript: []
};

app.get("/", function(req, res) {
    res.sendFile(__dirname + '/index.html');
})

server.listen(2000, function(){
    console.log("server running on port 3000");
});

io.on('connection', socket => {
    socket.on("join server", (username) => {
        const user = {
            username,
            id: socket.id,
        };
        users.push(user);
        io.emit("new user", users);
    });

    socket.on("join room", (roomName, callBack) => {
        socket.join(roomName);
        callBack(messages[roomName]);
    });

    socket.on("send message", ({content, to, sender, chatName, isChannel}) => {
        if (isChannel) {
            const payload = {
                content,
                chatName,
                sender,
            };
            socket.to(to).emit("new message", payload);
        } else {
            const payload = {
                content,
                chatName: sender,
                sender,
            };
            socket.to(to).emit("new message", payload);
        }
        if (message[chatName]) {
            messages[chatName].push({
                sender,
                content
            });
        }
    });

    socket.on("disconnect", () => {
        users = users.filter(u => u.id !== socket.id);
        io.emit("new user", users);
    });
});