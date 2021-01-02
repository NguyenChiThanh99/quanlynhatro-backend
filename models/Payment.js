const mongoose = require('mongoose');
var Schema = mongoose.Schema

var requestSchema = new Schema({
    month: {
        type: Number
    },
    year: {
        type: Number
    },
    blockId: {
        type: Schema.Types.ObjectId,
        ref: 'Block'
    },
    date: {
        type: Date,
    },
    paymentroom: [{
        type: Schema.Types.ObjectId,
        ref: 'PaymentRoom'
    }],
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updateAt'
    }
});

module.exports = mongoose.model('Payment', requestSchema, 'payment');