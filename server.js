const express = require('express');  // import express module to create express app 
const app = express();  // create express app 
const http = require('http');  // import http module to create server 
const path = require('path');     // import path module to handle file paths
const { Server } = require('socket.io'); //socket.io server module to create socket.io server
const ACTIONS = require('./src/Actions');   // import ACTIONS object from Actions.js file

const server = http.createServer(app);  // create server using http module and pass express app as a parameter to it 
const io = new Server(server);  // create socket.io server using http server

app.use(express.static('build'));     // serve static files from build folder
app.use((req, res, next) => {      // middleware to handle cors error
    res.sendFile(path.join(__dirname, 'build', 'index.html'));  // send index.html file when a request is made to the server
});

const userSocketMap = {};   // userSocketMap is a object which stores socketId as key and username as value 
function getAllConnectedClients(roomId) {   // getAllConnectedClients is a function which returns an array of all the clients connected to a room
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(  // io.sockets.adapter.rooms.get(roomId) returns a Set of all the socket ids in the room
        (socketId) => {   // convert Set to Array and map over it to get socketId and username of each client
            return {
                socketId,      // socketId is a unique id of each socket
                username: userSocketMap[socketId],   // userSocketMap is a object which stores socketId as key and username as value
            };
        }
    );
}

io.on('connection', (socket) => {     // listen for connection event
    console.log('socket connected', socket.id);     // log socket id when a socket is connected

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {     // listen for join event
        userSocketMap[socket.id] = username;         // store socketId as key and username as value in userSocketMap object
        socket.join(roomId);        
        const clients = getAllConnectedClients(roomId);     // get all the clients connected to a room
        clients.forEach(({ socketId }) => {            // emit joined event to all the clients connected to a room
            io.to(socketId).emit(ACTIONS.JOINED, {       // io.to(socketId) emits event to a particular socket
                clients,
                username,
                socketId: socket.id,         // socket.id is the id of the socket which emits the event
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
