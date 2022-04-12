const mongoose = require('mongoose');
var Schema = mongoose.Schema

var requestSchema = new Schema({
    roomId: {
        type: Schema.Types.ObjectId,
        ref: 'Room'
    },
    service: [{
        type: String
    }],
    elec: {
        type: Array
    },
    water: {
        type: Array
    },
    price: {
        type: Number
    },
    total: {
        type: Number
    },
    status: {
        type: Boolean,
        default: false
    },
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

module.exports = mongoose.model('PaymentRoom', requestSchema, 'paymentroom');