const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'user',
    },
    name:{
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    starting_price: {
        type: Number,
    },
    current_bid: {
        type: Number,
    },
    status: {
        type: String
    },
    description: {
        type: String
    }
});


module.exports = mongoose.model('item' , itemSchema);


