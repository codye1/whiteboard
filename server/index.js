require('dotenv').config()
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const dotenv = require('dotenv');

// Загрузить переменные среды из файла .env
dotenv.config();
// Use the CORS middleware with the Express app
app.use(cors({
  origin: process.env.CLIENT,
  credentials: true,
}));
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT,
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinRoom', ({roomId,userName,initMessage}) => {
    socket.join(roomId);
    console.log("send",socket.id);
    socket.emit("socketId", socket.id);

    const firstSocketInRoom = io.sockets.adapter.rooms.get(roomId).values().next().value

    socket.to(firstSocketInRoom).emit("message",{...initMessage,id:socket.id})
    console.log(`Client ${userName} joined room: ${roomId}`);
  });

  socket.on('leaveRoom', ({roomId,userName}) => {
    socket.leave(roomId);
    console.log(`Client ${userName} left room: ${roomId}`);
  });

  socket.on('message', (data) => {
    const { message } = data;
    socket.broadcast.to(message.roomId).emit('message', {...message,id:socket.id});
  });


  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => {
  console.log('Listening on port 5000');
});
