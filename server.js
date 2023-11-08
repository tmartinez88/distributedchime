'use strict';

const socketIO = require('socket.io');
const express = require('express');
const path = require('path');
const app = module.exports.app = express();
const port = process.env.PORT || 3000;

const users = [];
const files = ['video/chime.mov_1.mp4','video/chime.mov_2.mp4','video/chime.mov_3.mp4','video/chime.mov_4.mp4','video/chime.mov_5.mp4','video/chime.mov_6.mp4','video/chime.mov_7.mp4','video/chime.mov_8.mp4','video/chime.mov_9.mp4','video/chime.mov_10.mp4','video/chime.mov_11.mp4','video/chime.mov_12.mp4','video/chime2.mov_1.mp4','video/chime2.mov_2.mp4','video/chime2.mov_3.mp4','video/chime2.mov_4.mp4','video/chime2.mov_5.mp4','video/chime2.mov_6.mp4','video/chime2.mov_7.mp4','video/chime2.mov_8.mp4','video/chime2.mov_9.mp4','video/chime2.mov_10.mp4','video/chime2.mov_11.mp4'];
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.use(express.static(path.join(__dirname, 'public')));


const server = app.listen(port, () => {
  console.log("Listening on port: " + port);
});

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on("controller", (arg) => {
    //console.log(arg); //gust
    io.emit('response', arg);
  });
  socket.on("name", (arg) => {
    //console.log(arg); //gust
    users.push(arg);
    console.log(users);
    io.emit('response', arg);
  });
  socket.on('disconnect', () => console.log('Client disconnected'));
});

let time = 0;

function timeKeeper() {
  setTimeout(() => {
    time += 1;
    //io.emit('time', time);
    if (time % 2 == 0) {
      const random = Math.floor(Math.random() * users.length);
      const random2 = Math.floor(Math.random() * files.length);
      const trigger = [users[random], files[random2]];
      io.emit('trigger', trigger);
      time = 0;
    }
    timeKeeper();
  }, "1000"); 
}

timeKeeper();

