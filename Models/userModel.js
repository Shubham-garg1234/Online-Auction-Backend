const mongoose = require("mongoose");
const { Schema } = mongoose;


const userSchema = new Schema({
    name:{
        type: String,
        default: '',
    },
    email:{
        type: String,
        unique: true,
    },
    password:{
        type: String,
    },
    profile_image: {
        type: String,
        default: ''
    },
    coins: {
        type: Number,
        default: 20
    },
    googleId: {
        type: String
    }
});


module.exports = mongoose.model('user' , userSchema);


