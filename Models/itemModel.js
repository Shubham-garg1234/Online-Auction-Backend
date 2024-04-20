const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'user',
    },
    sellerName: {
        type: String
    },
    bidderName: {
        type: String
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
    bidderId: {
        type: Number,
    },
    status: {
        type: String
    },
    description: {
        type: String
    },
    auctionId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'auction',
    }
});


module.exports = mongoose.model('item' , itemSchema);


