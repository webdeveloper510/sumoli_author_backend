const constant = require('../../config/constanct')
const ADMIN = require('../../models/admin/admin_model')
const USER = require('../../models/user/login_model')
const BOOK = require('../../models/user/book_model')
const STORE = require('../../models/user/store_model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

exports.add_admin = async(req,res)=>{
    try{
        let data = req.body
        data.password = bcrypt.hashSync(data.password,10)
        let save_data = await ADMIN(data).save()
        if(save_data){
            res.send({
                code:constant.success_code,
                message:"Success",
                result:save_data
            })
        }
    }catch(err){
        res.send({
            code:constant.error_code,
            message:err.message
        })
    }
}

exports.admin_login = async(req,res)=>{
    try{
        let data = req.body
        let checkEmail = await ADMIN.findOne({email:data.email})
        if(!checkEmail){
            res.send({
                code:constant.error_code,
                message:"Invalid Credentials"
            })
        return;
        }
        let checkPassword = await bcrypt.compare(data.password,checkEmail.password)
        if(!checkPassword){
            res.send({
                code:constant.error_code,
                message:"Invalid Credentials"
            })
            return;
        }
        let jwtToken = await jwt.sign({userId:checkEmail._id},constant.secret,{expiresIn:'365d'})
        checkEmail.jwtToken = jwtToken
        res.send({
            code:constant.success_code,
            message:"Success",
            result:{
                "_id":checkEmail._id,
                "name": checkEmail.name,
                "email": checkEmail.email,
                "jwtToken":jwtToken
            }
        })
    }catch(err){
        res.send({
            code:constant.error_code,
            message:err.message
        })
    }
}

