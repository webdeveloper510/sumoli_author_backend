const mongoose = require('mongoose')
const constant = require('../../config/constanct') 
const USER = require('../../models/user/login_model')
const STORE = require('../../models/user/store_model')

exports.add_store = async (req, res) => {
    try {
        let data = req.body
        data.userId = req.userId
        let check_user = await USER.findOne({ _id: req.userId })
        if (!check_user) {
            res.send({
                code: constant.error_code,
                message: "Invalid user token"
            })
            return
        };
        let save_data = await STORE(data).save()
        if (!save_data) {
            res.send({
                code: constant.error_code,
                message: "Unable to add the store, please try again"
            })
        } else {
            res.send({
                code: constant.success_code,
                message: "Success",
                result: save_data
            })
        }
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}

exports.get_user_stores = async(req,res)=>{
    try{
        let data = req.body
        let get_store = await STORE.find({
            $and:[
                {userId:req.userId},
                {isDeleted:false}
            ]
        },{status:0,isDeleted:0})
        if(!get_store){
            res.send({
                code:constant.error_code,
                message:"No data found"
            })
        }else{
            res.send({
                code:constant.success_code,
                message:"Success",
                result:get_store
            })
        }
    }catch(err){
        res.send({
            code:constant.error_code,
            message:err.message
        })
    }
}

exports.get_all_stores = async(req,res)=>{
    try{
        let data = req.body
        let getStore = await STORE.find({isDeleted:false},{status:0,isDeleted:0})
        if(!getStore){
            res.send({
                code:constant.error_code,
                message:"Unable to get the data"
            })
        }else{
            res.send({
                code:constant.success_code,
                message:"Success",
                result :  getStore
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
        let getStore = await STORE.findOne({
            $and:[
                {_id:data.storeId},
                {isDeleted:false}
            ]
        },{status:0,isDeleted:0})
        if(!getStore){
            res.send({
                code:constant.error_code,
                message:"Unable to ge the data",
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
      let criteria = {
        $and:[
            {_id:data.storeId},
            {isDeleted:false}
        ]
      }
      let option = {new:true}
      let checkStore = await STORE.findOne(criteria)
      if(!checkStore){
        res.send({
            code:constant.error_code,
            message:"Invalid Store ID"
        })
        return;
      }
      let updateStore = await STORE.findOneAndUpdate(criteria,data,option)
      if(!updateStore){
        res.send({
            code:constant.error_code,
            message:"Unable to update the store data"
        })
      }else{
        res.send({
            code:constant.success_code,
            message:"Success",
            result:{
                store_name:updateStore.store_name,
                store_location:updateStore.store_location,
                contacts:updateStore.contacts,
                createdAt:updateStore.createdAt
            }
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
      let data = req.body
      let criteria = {
        $and:[
            {_id:req.params.storeId},
            {isDeleted:false}
        ]
      }
      let option = {new:true}
      let checkStore = await STORE.findOne(criteria)
      if(!checkStore){
        res.send({
            code:constant.error_code,
            message:"Invalid Store ID"
        })
        return;
      }
      let newValue = {
        $set:{
            isDeleted:true
        }
      }
      let updateStore = await STORE.findOneAndUpdate(criteria,newValue,option)
      if(!updateStore){
        res.send({
            code:constant.error_code,
            message:"Unable to update the store data"
        })
      }else{
        res.send({
            code:constant.success_code,
            message:"Deleted",
        })
      }
    }catch(err){
        res.send({
            code:constant.error_code,
            message:err.message
        })
    }
}
