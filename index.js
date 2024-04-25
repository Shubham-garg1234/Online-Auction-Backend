//Making connection to mongo
const connectToMongo = require('./db');

//Calling function to check if the database is connected
connectToMongo();

//cors are used to hit the Apis from the frontend
var cors = require("cors")
const express = require('express')
const port = 3000
const {server , app}=require('./Middlewares/Socket')

//Using an express middleware to enable req.body


//Available routes whose api can be hit
app.use('/api/auth' , require('./Routes/authRoutes'));
app.use('/api/auth' , require('./Routes/otpRoutes'));
app.use('/api/auth' , require('./Routes/resetRoutes'));
app.use('/api/auth',require('./Routes/homeRoutes'))
app.use('/api/auth',require('./Routes/notificationRoutes'))
app.use('/auth',require('./Routes/googleRoutes'))
app.use('/',require('./Routes/PaymentGateway'))

app.get("/", function (req, res) {
  res.send("Server is running");
});

server.listen(port, () => {
  console.log(`Server listening on http://localhost:3000`)
})

