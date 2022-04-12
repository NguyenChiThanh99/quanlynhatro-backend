const mongoose = require('mongoose')
var Schema = mongoose.Schema

var blockSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    contact: {
        type: String,
        required: true,
        trim: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true
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

module.exports = mongoose.model('Block', blockSchema, 'block');