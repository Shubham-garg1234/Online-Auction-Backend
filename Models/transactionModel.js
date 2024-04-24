const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'user',
    },
    bidderId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'user',
        default: null,
    },
    amount: {
        type: String,
        default: '',
    },
    date: {
        type: Date,
        default: Date.now
    },
    itemName: {
        type: String
    }
});


module.exports = mongoose.model('transaction' , transactionSchema);


