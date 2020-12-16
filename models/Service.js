const mongoose = require('mongoose')
var Schema = mongoose.Schema

var serviceSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    price: {
        type: String,
        required: true,
        trim: true
    },
    calculate: {
        type: String
    }, 
    userId: {
        type: Schema.Types.ObjectId,
        required: true
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

module.exports = mongoose.model('Service', serviceSchema, 'service');