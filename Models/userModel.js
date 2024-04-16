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
});


module.exports = mongoose.model('user' , userSchema);


