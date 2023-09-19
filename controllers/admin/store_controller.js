const mongoose = require('mongoose')
const STORE = require('../../models/user/book_model')
const constant = require('../../config/constanct')



exports.get_all_stores = async(req,res)=>{
    try{
        let getStores = await STORE.find().sort({'createdAt':-1})
        if(!getStores){
            res.send({
                code:constant.error_code,
                message:"Unable to fetch the data"
            })
        }else{
            res.send({
                code:constant.success_code,
                message:"Success",
                result:getStores
            })
        }
    }catch(err){
        res.send({
            code:constant.error_code,
            message:err.message
        })
    }
}

exports.get_store_by_id = async(req,res)=>{
    try{
        let data = req.body
        let getStore = await STORE.findOne({_id:req.params.storeId})
        if(!getStore){
            res.send({
                code:constant.error_code,
                message:"Unable to fetch the data"
            })
        }else{
            res.send({
                code:constant.success_code,
                message:"Success",
                result:getStore
            })
        }
    }catch(err){
        res.send({
            code:constant.error_code,
            message:err.message
        })
    }
}

exports.edit_store = async(req,res)=>{
    try{
        let data = req.body
        let criteria = {_id:data.storeId}
        let option = {new:true}
        let checkStore = await STORE.findOne(criteria)
        if(!checkStore){
            res.send({
                code:constant.error_code,
                message:"Invalid store ID"
            })
            return;
        }
        let updateData = await STORE.findOneAndUpdate(criteria,data,option)
        if(!updateData){
            res.send({
                code:constant.error_code,
                message:"Unable to update the store data"
            })
        }else{
            res.send({
                code:constant.success_code,
                message:"Success",
                result:updateData
            })
        }
    }catch(err){
        res.send({
            code:constant.error_code,
            message:err.message
        })
    }
}

exports.delete_store = async(req,res)=>{
    try{
        let criteria = {_id:req.params.storeId}
        let option = {new:true}
        let checkStore = await STORE.findOne(criteria)
        if(!checkStore){
            res.send({
                code:constant.error_code,
                message:"Invalid store ID"
            })
            return;
        }
        let updateData = await STORE.findOneAndUpdate(criteria,{isDeleted:true},option)
        if(!updateData){
            res.send({
                code:constant.error_code,
                message:"Unable to update the store data"
            })
        }else{
            res.send({
                code:constant.success_code,
                message:"Success",
                result:updateData
            })
        }
    }catch(err){
        res.send({
            code:constant.error_code,
            message:err.message
        })
    }
}