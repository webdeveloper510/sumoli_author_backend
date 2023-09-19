const mongoose = require('mongoose')
const Schema = mongoose.Schema

const store = new Schema({
    store_name: {
        type: String,
        default: null
    },
    store_location: {
        type: String,
        default: null
    },
    contacts: {
        type: {
            phone_no: {
                type: Number,
                default: null
            },
            email: {
                type: String,
                default: null
            }
        }
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,ref:'users'
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    status:{
        type:Boolean,
        default:true
    }

    
}, { timestamps: true })

module.exports = mongoose.model('store', store)