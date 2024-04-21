//Making connection to mongo
const connectToMongo = require('./db');
const http = require('http');


//Calling function to check if the database is connected
connectToMongo();

//cors are used to hit the Apis from the frontend
var cors = require("cors")
const express = require('express')
const port = 3003
//const { app , server } = require('./Middlewares/Socket')

const app = express()

let timerValue = 10000000000;
let currentbid=0;
let nextbid=0;

//Using a express middleware to enable req.body
app.use(express.json());
app.use(cors())
const socketIO = require('socket.io');

timerInterval = setInterval(() => {
    timerValue-=1;
    // console.log(timerValue)
  if (timerValue <= 0) {
    clearInterval(timerInterval); 
    console.log('Timer reached zero');
  }
}, 1000);


const server = http.createServer(express());
const io = socketIO(server, {
  cors: {
    origin: '*',
  }
});



io.on('connection', (socket) => {

  socket.on("join", (token) => {
    const details={timer:timerValue, bidamount:currentbid, nextbid:nextbid};
    socket.emit('detail_to_all', details);
  });

  socket.on('detail_to_server', (message) => {
    console.log(message);
    timerValue=message.timer;
    currentbid=message.bidamount
    nextbid=message.nextbid
    io.emit('detail_to_all', message);
  });
  
  socket.on('disconnect', () => {
    // Handle disconnect event if needed
  });
});

// Rest of your backend code...

server.listen(3000, () => {
  console.log(`Server listening on http://localhost:3003`);
});


//Available routes whose api can be hit
app.use('/api/auth' , require('./Routes/authRoutes'));
app.use('/api/auth' , require('./Routes/otpRoutes'));
app.use('/api/auth' , require('./Routes/resetRoutes'));
app.use('/api/auth',require('./Routes/homeRoutes'))


//Starting a server at port 3001
app.listen(port, () => {
  console.log(`Server listening on http://localhost:3003`)
})


