const mongoose = require('mongoose')
const Schema = mongoose.Schema

const user = new Schema({
    f_name: {
        type: String,
        default: null
    },
    l_name: {
        type: String,
        default: null
    },
    password: {
        type: String
    },
    jwtToken: {
        type: String
    },
    otp: {
        type: Number
    },
    email: {
        type: String,
        default: null
    },
    phone_no: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        enum: [0, 1],
        default: 0 // 0 = inactive, 1=active
    },
    user_type: {
        type: Number,
        enum: [1,2,3,4],
        default: 3 //customer
    }
}, { timestamps: true })

module.exports = mongoose.model('user', user)