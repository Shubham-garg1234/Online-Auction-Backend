
const express = require('express')
const app = express()

const { Server } = require("socket.io");
const { createServer } = require('http')
const server = createServer(app);
const io = new Server(server , {
  cors: {
    origin: "http://localhost:3001",
    method: ["GET" , "POST"],
    credentials: true,
  },
});


io.on("connection", (socket) => {

  console.log("a user  connected")

});

module.exports = { app , server }

