
const mongoose = require("mongoose");

//creating an asynchronous function to make a connection to the mongodb
async function connectToMongo() {
    //connecting to the database with the help of mongoose.connect('connection string')
    await mongoose.connect('mongodb+srv://s99705107:Xxpv0BuYtrHBWyWr@cluster0.5obtdok.mongodb.net/')

    //logging for validating
    console.log("Connection to database is successful")
}  

//exporting the modules
module.exports = connectToMongo;

