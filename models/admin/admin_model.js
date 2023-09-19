const mongoose = require('mongoose')
const Schema = mongoose.Schema

const admin = new Schema({
    name:{
        type:String,
        default:null
    },
    email:{
        type:String,
        default:null
    },
    password:{
        type:String,
        default:null
    },
    status:{
        type:String,
        default:null
    }
},{timestamps:true})

module.exports = mongoose.model('admin',admin)