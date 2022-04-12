const mongoose = require('mongoose');
var Schema = mongoose.Schema

var notiSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    deliveryId: {
        type: Schema.Types.ObjectId,
        default: null
    },
    content: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["Room", "Block", "All"],
        default: "All"
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

module.exports = mongoose.model('Notification', notiSchema, 'notification');