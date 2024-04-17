const mongoose = require("mongoose");
const { Schema } = mongoose;

const transactionSchema = new Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'user',
    },
    bidderId: {
        type: String,
        default: '',
    },
    amount: {
        type: String,
        default: '',
    },
    date: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('transaction' , transactionSchema);


