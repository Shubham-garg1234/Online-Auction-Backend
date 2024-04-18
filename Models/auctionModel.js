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
        type: mongoose.Schema.Types.ObjectId, ref: 'item',
    }]
});


module.exports = mongoose.model('auction' , auctionSchema);

