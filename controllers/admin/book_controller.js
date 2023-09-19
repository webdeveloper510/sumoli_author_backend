const mongoose = require('mongoose')
const BOOK = require('../../models/user/book_model')
const constant = require('../../config/constanct')

exports.get_books = async(req,res)=>{
    try{
        let data = req.body
        let get_book = await BOOK.find()
        if(!get_book){
            res.send({
                code:constant.error_code,
                message:"Unable to fetch the data"
            })
        }else{
            res.send({
                code:constant.success_code,
                message:"Success",
                result:get_book
            })
        }
    }catch(err){
        res.send({
            code:constant.error_code,
            message:err.message
        })
    }
}

exports.get_book_detail = async(req,res)=>{
    try{
        let data = req.body
        console.log('jjjjjjjjj')
        // let mid =  mongoose.Types.ObjectId(data.bookId);
        // console.log('id--------',mid)
        let getBook = await BOOK.aggregate([
            {
              $match: {
                _id: new mongoose.Types.ObjectId(req.body.bookId),
              },
            },
            {
                $lookup:{
                    from:'users',
                    localField:'userId',
                    foreignField:'_id',
                    as:'userDetails'
                }
            },
            // {
            //     $project:{
            //         userDetailsname: { $arrayElemAt: ["$userDetails.email", 0] },
            //         userId:1
            //     }
            // }
          ])
        if(!getBook){
            res.send({
                code:constant.error_code,
                message:"Unable to get the data"
            })
        }else{
            res.send({
                code:constant.success_code,
                message:"Success",
                result:getBook
            })
        }
    }catch(err){
        res.send({
            code:constant.error_code,
            message:err.message
        })
    }
}