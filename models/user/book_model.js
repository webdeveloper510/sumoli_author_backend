const mongoose = require('mongoose')
const Schema = mongoose.Schema

const book = new Schema({
    book_name:{
        type:String,
        default:null
    },
    cover_image:{
        type:String,
        default:"images.jpeg"
    },
    book_store_info:{
        type:String,
        default:null
    },
    listening_url:{
        type:String,
        default:null
    },
    status:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    userId:{
        type:mongoose.Types.ObjectId,ref:"users"
    }
},{timestamps:true})

module.exports=mongoose.model('book',book)