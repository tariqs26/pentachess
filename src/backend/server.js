const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Basic code for now, will be changed in next commit

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });

    // Add your custom event listeners here
    socket.on('move', (data) => {
        console.log('Move received:', data);
        // Broadcast the move to all other clients
        socket.broadcast.emit('move', data);
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));