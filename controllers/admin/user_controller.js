const mongoose = require('mongoose')
const USER = require('../../models/user/store_model')
const constant = require('../../config/constanct')

exports.get_all_users = async(req,res)=>{
    try{
        let data = req.body
        let getUsers = await USER.find().sort({'createdAt':-1})
        if(!getUsers){
            res.send({
                code:constant.error_code,
                message:"Unable to fetch the users"
            })
        }else{
            res.send({
                code:constant.success_code,
                message:"Success",
                result:getUsers
            })
        }
    }catch(err){
        res.send({
            code:constant.error_code,
            message:err.message
        })
    }
}

exports.get_user_by_id = async(req,res)=>{
    try{
        let check_user = await USER.findOne({_id:req.body.userId})
        if(!check_user){
            res.send({
                code:constant.error_code,
                message:"Unable to fetch the data"
            })
        }else{
            res.send({
                code:constant.success_code,
                message:"Success",
                result:check_user
            })
        }
    }catch(err){
        res.send({
            code:constant.error_code,
            message:err.message
        })
    }
}

exports.edit_user = async(req,res)=>{
    try{
        let data = req.body
        let criteria = {_id:req.body.userId}
        let option = {new:true}
        let checkUser = await USER.findOne(criteria)
        if(!checkUser){
            res.send({
                code:constant.error_code,
                message:"Invalid User ID"
            })
            return;
        }
        let updateUser = await USER.findOneAndUpdate(criteria,data,option)
        if(!updateUser){
            res.send({
                code:constant.error_code,
                message:"Unable to update the user"
            })
        }else{
            res.send({
                code:constant.success_code,
                message:"Updated Successfully",
                result:updateUser
            })
        }
    }catch(err){
        res.send({
            code:constant.error_code,
            message:err.message
        })
    }
}

exports.delete_user = async(req,res)=>{
    try{
        let criteria = {_id:req.params.userId}
        let option = {new:true}
        let checkUser = await USER.findOne(criteria)
        if(!checkUser){
            res.send({
                code:constant.error_code,
                message:"Invalid User ID"
            })
            return;
        }
        let updateUser = await USER.findOneAndUpdate(criteria,{isDeleted:true},option)
        if(!updateUser){
            res.send({
                code:constant.error_code,
                message:"Unable to update the user"
            })
        }else{
            res.send({
                code:constant.success_code,
                message:"Updated Successfully",
                result:updateUser
            })
        }
    }catch(err){
        res.send({
            code:constant.error_code,
            message:err.message
        })
    }
}










