
const http = require('http');
const socketIO = require('socket.io');
const express = require('express')
const Auction = require('../Models/auctionModel')

const server = http.createServer(express());
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});

let timerValue = 10000000000;
let currentbid=0;
let nextbid=0;

timerInterval = setInterval(() => {
  timerValue-=1;
  // console.log(timerValue)
if (timerValue <= 0) {
  io.emit('fetchNext')
  timerValue = 20
}
console.log(timerValue)
}, 1000);


io.on('connection', (socket) => {

  socket.on("join", (token) => {
    console.log('a user connected')
    const details={timer:timerValue, bidamount:currentbid, nextbid:nextbid};
    console.log(details)
    io.to(socket.id).emit('detail_to_all', details);
  });

  socket.on('detail_to_server', (message) => {
    console.log(message);
    timerValue=message.timer;
    currentbid=message.bidamount
    nextbid=message.nextbid
    io.emit('detail_to_all', message);
  });

  socket.on('stopClock' , async () => {
    const auction = await Auction.find({ starting_time: { $gt: Date.now() } }).sort({ date: 1 }).limit(1);
    if(auction.length === 0)  timerValue = 10000000000
    else  timerValue = Math.floor((new Date(auction[0].starting_time) - new Date()) / 1000);
    currentbid = 0;
    nextbid = 0;
  })
  

  socket.on('disconnect', () => {
    //
  });
});


server.listen(3001, () => {
  console.log(`Server listening on http://localhost:3003`);
});


module.exports = { timerValue }

