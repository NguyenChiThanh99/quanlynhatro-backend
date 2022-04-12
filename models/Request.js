const mongoose = require('mongoose');
var Schema = mongoose.Schema

var requestSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    blockId: {
        type: Schema.Types.ObjectId,
        ref: 'Block',
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    note: {
        type: String,
        default: ''
    },
    isSolved: {
        type: Boolean,
        default: false,
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

module.exports = mongoose.model('Request', requestSchema, 'request');