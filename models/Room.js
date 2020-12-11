const mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    blockId: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    area: {
        type: String,
        required: true
    },
    device: {
        type: String,
        required: true
    },
    rooftop: {
        type: Boolean,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    service: {
        type: Schema.Types.Array,
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

module.exports = mongoose.model('Product', userSchema, 'product');