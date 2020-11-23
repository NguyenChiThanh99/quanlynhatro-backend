const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
var Schema = mongoose.Schema

var userSchema = new Schema({
    email: {
        type: String,
        trim: true,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    }, 
    phone: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 10
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    cmnd: {
        type: String,
        required: true,
        trim: true,
        minlength: 9,
        maxlength: 12
    },
    role: {
        type: String,
        required: true,
        enum: ["Admin", "User"],
        default: "User"
    },
    birthday: {
        type: Date
    },
    job: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"]
    },
    avatar: {
        type: String,
    },
    firstlogin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updateAt'
    }
});

module.exports = mongoose.model('User', userSchema, 'user');
module.exports.hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    } catch(error) {
        throw new Error('Hashing failed', error);
    }
}