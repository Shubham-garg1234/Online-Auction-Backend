const mongoose = require("mongoose");
const { Schema } = mongoose;

const auctionSchema = new Schema({
    name:{
        type: String,
        default: '',
    },
    starting_time: {
        type: Date,
    },
    status: {
        type: String,
        default: ''
    },
    items: [{
        id: {
            type: mongoose.Schema.Types.ObjectId, ref: 'item',
        },
    }],
    currentBiddingItem: {
        type: Number,
        default: 0
    },
    timer: {
        type:Number,
        default: 20
    },
    number: {
        type: Number
    }
});


module.exports = mongoose.model('auction' , auctionSchema);


