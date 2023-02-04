// Entery point 
const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMsg = require('./utils/format');
const { addUser, currentUser, leftUser, getRoomUsers } = require('./utils/user');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Run when client connects
io.on('connection', (socket) => {

    socket.on('joinRoom', ({ username, room }) => {

        const user = addUser(socket.id, username, room);
        socket.join(user.room);
        // For single client
        socket.emit('message', formatMsg('Bot', 'Welconme to langChat !'))

        // Broadcast when user connect
        socket.broadcast.to(user.room).emit('message', formatMsg('Bot', `${user.username} has joined the chat`))

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })


    socket.on('chatMessage', (msg) => {
        const user = currentUser(socket.id);

        // Sending Object
        io.to(user.room).emit('message', formatMsg(user.username, msg));
    })



    // Runs when client disconnetcs
    socket.on('disconnect', () => {
        const user = leftUser(socket.id)
        if (user) { io.to(user.room).emit('message', formatMsg('Bot', `${user.username} has left the chat...`)) }
        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        })
    }
    )



})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Server is listeing "));