//Making connection to mongo
const connectToMongo = require('./db');

//Calling function to check if the database is connected
connectToMongo();

//cors are used to hit the Apis from the frontend
var cors = require("cors")
const express = require('express')
const port = 3003
//const { app , server } = require('./Middlewares/Socket')

const app = express()

//Using a express middleware to enable req.body
app.use(express.json());
app.use(cors())


//Available routes whose api can be hit
app.use('/api/auth' , require('./Routes/authRoutes'));
app.use('/api/auth' , require('./Routes/otpRoutes'));
// app.use('/api/auth' , require('./Routes/resetRoutes'));


//Starting a server at port 3001
app.listen(port, () => {
  console.log(`Server listening on http://localhost:3003`)
})


