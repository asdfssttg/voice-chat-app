const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {cors: {origin: '*'}});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', ({room}) => {
    socket.join(room);
    socket.to(room).emit('user_joined', {user: socket.id});
  });

  socket.on('voice', (data) => {
    // data: {room, buffer}
    socket.to(data.room).emit('voice', {user: socket.id, buffer: data.buffer});
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

server.listen(4000, () => console.log('Server on 4000'));