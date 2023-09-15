const USER = require('../../models/user/login_model')
const constant = require('../../config/constanct')
const email_constant = require('../../config/email_constant')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var randtoken = require("rand-token").generator();
const nodemailer = require("nodemailer");

exports.user_signup = async (req, res) => {
    try {
        let data = req.body
        let OTP = randtoken.generate(6,"123456789")
        let checkEmail = await USER.findOne({ email: data.email })
        if (checkEmail) {
            res.send({
                code: constant.error_code,
                message: "User already exist with this email id"
            })
        } else {
            let hash = bcrypt.hashSync(data.password, 10)
            data.password = hash
            let saveUser = await new USER(data).save()
            if (!saveUser) {
                res.send({
                    code: constant.error_code,
                    message: "Unable to signup the user"
                })
            } else {

                var transporter = nodemailer.createTransport(email_constant.credentials);
                var mailOptions = {
                    from: email_constant.from_email,
                    to: data.email,
                    subject: "Your Sumoli Author Security Code",
                    html: `Welcome to Sumoli Author, your OTP is ${OTP}`
                };
                transporter.sendMail(mailOptions);


                const jwtToken = jwt.sign({ userId: saveUser._id }, constant.secret, { expiresIn: "365d" });
                let criteria = { _id: saveUser._id }
                let newValue = {
                    $set: {
                        jwtToken: jwtToken,
                        otp:OTP
                    }
                }
                let option = { new: true }
                let updateUser = await USER.findOneAndUpdate(criteria, newValue, option)
                if (!updateUser) {
                    res.send({
                        code: constant.error_code,
                        message: "Unable to create the user token"
                    })
                } else {
                    res.send({
                        code: constant.success_code,
                        message: "Successfully registered",
                        result:{
                            f_name:updateUser.f_name,
                            l_name:updateUser.l_name,
                            email:updateUser.email,
                            status:updateUser.status,
                            user_type:updateUser.user_type,
                            phone_no:updateUser.phone_no,
                            jwtToken:updateUser.jwtToken
                        }
                    })
                }

            }
        }
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}

exports.user_signin = async (req, res) => {
    try {
        let data = req.body
        let checkEmail = await USER.findOne({ email: data.email })
        if (checkEmail.status == 0) {
            res.send({
                code: constant.success_code,
                message: "Please verify your email"
            })
            return;
        }
        if (!checkEmail) {
            res.send({
                code: constant.error_code,
                message: "Invalid Credentials"
            })
        } else {

            let checkPassword = await bcrypt.compare(data.password, checkEmail.password)
            console.log('matching', data.password, checkEmail.password)
            if (!checkPassword) {
                res.send({
                    code: constant.error_code,
                    message: "Invalid Credentials"
                })
            } else {
                const jwtToken = jwt.sign({ userId: checkEmail._id }, constant.secret, { expiresIn: "365d" });
                let criteria = { _id: checkEmail._id }
                let newValue = {
                    $set: {
                        jwtToken: jwtToken
                    }
                }
                let option = { new: true }
                let updateUser = await USER.findOneAndUpdate(criteria, newValue, option)
                if (!updateUser) {
                    res.send({
                        code: constant.error_code,
                        message: "Unable to create the user token"
                    })
                } else {
                    res.send({
                        code: constant.success_code,
                        message: "Login successfull",
                        result:{
                            f_name:updateUser.f_name,
                            l_name:updateUser.l_name,
                            email:updateUser.email,
                            status:updateUser.status,
                            user_type:updateUser.user_type,
                            phone_no:updateUser.phone_no,
                            jwtToken:updateUser.jwtToken
                        }
                    })
                }

            }
        }
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}

exports.resend_otp = async (req, res) => {
    try {
        let data = req.body
        let OTP = randtoken.generate(6,"123456789")
        let checkEmail = await USER.findOne({ email: data.email })
        if (!checkEmail) {
            res.send({
                code: constant.error_code,
                message: "No user found with this email id"
            })
        } else {
            // mail transport code will be go here//
            var transporter = nodemailer.createTransport(email_constant.credentials);
            var mailOptions = {
                from: email_constant.from_email,
                to: data.email,
                subject: "Your Sumoli Author Security Code",
                html: `Welcome to Sumoli Author, your OTP is ${OTP}`
            };
            transporter.sendMail(mailOptions);
            let criteria = { email: data.email }
            let newValue = {
                $set: {
                    otp: OTP,
                }
            }
            let option = { new: true }
            let updateOtp = await USER.findOneAndUpdate(criteria, newValue, option)
            if (!updateOtp) {
                res.send({
                    code: constant.error_code,
                    message: "Unable to send the otp"
                })
            } else {
                res.send({
                    code: constant.success_code,
                    message: "OTP sent to your email id",
                    result:{
                        f_name:updateOtp.f_name,
                        l_name:updateOtp.l_name,
                        email:updateOtp.email,
                        status:updateOtp.status,
                        user_type:updateOtp.user_type,
                        phone_no:updateOtp.phone_no,
                    }
                })
            }
        }
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}  

exports.verify_otp = async (req, res) => {
    try {
        let data = req.body
        let getData = await USER.findOne({ email: data.email })
        console.log(getData.status)
        // if(getData.status==1){
        //     res.send({
        //         code:constant.error_code,
        //         message:"Your account is already verified"
        //     })
        //     return;
        // }
        if (!getData) {
            res.send({
                code: constant.error_code,
                message: "Unable to find the user data"
            })
        } else {
            if (data.otp != getData.otp) {
                res.send({
                    code: constant.error_code,
                    message: "Invalid OTP"
                })
            } else {
                let criteria = { email: data.email }
                let newValue = {
                    $set: {
                        otp: null,
                        status:1
                    }
                }
                let option = { new: true }
                let updateValue = await USER.findOneAndUpdate(criteria, newValue, option)
                res.send({
                    code: constant.success_code,
                    message: "OTP verified",
                    email: getData.email
                })
            }
        }
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}

exports.forgot_password = async (req, res) => {
    try {
        let data = req.body
        let criteria = { email: data.email }
        let hash = bcrypt.hashSync(data.password, 10)
        let newValue = {
            $set: {
                password: hash
            }
        }
        let option = { new: true }
        let updatePassword = await USER.findOneAndUpdate(criteria, newValue, option)
        if (!updatePassword) {
            res.send({
                code: constant.error_code,
                message: "Unable to update the password"
            })
        } else {
            res.send({
                code: constant.success_code,
                message: "Successfully Updated",
                result:{
                    f_name:updatePassword.f_name,
                    l_name:updatePassword.l_name,
                    email:updatePassword.email,
                    status:updatePassword.status,
                    user_type:updatePassword.user_type,
                    phone_no:updatePassword.phone_no,
                }
            })
        }
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
} 

exports.reset_password = async (req, res) => {
    try {
        let data = req.body
        let checkUser = await USER.findOne({ _id: req.userId })
        if (!checkUser) {
            res.send({
                code: constant.error_code,
                message: "Invalid Request"
            })
        } else {
            let checkPassword = await bcrypt.compare(data.oldPassword, checkUser.password)
            if (!checkPassword) {
                res.send({
                    code: constant.error_code,
                    message: "Old password is incorrect"
                })
            } else {
                let hash = bcrypt.hashSync(data.password, 10)
                let criteria = { _id: req.userId }
                let newValue = {
                    $set: {
                        password: hash
                    }
                }
                let option = { new: true }
                let updatePassword = await USER.findOneAndUpdate(criteria, newValue, option)
                if (!updatePassword) {
                    res.send({
                        code: constant.error_code,
                        message: "Unable to update your password"
                    })
                } else {
                    res.send({
                        code: constant.success_code,
                        message: "Password updated successsfully",
                        result:{
                            f_name:updatePassword.f_name,
                            l_name:updatePassword.l_name,
                            email:updatePassword.email,
                            status:updatePassword.status,
                            user_type:updatePassword.user_type,
                            phone_no:updatePassword.phone_no,
                        }
                    })
                }

            }
        }
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}

exports.get_user_detail = async (req, res) => {
    try {
        let data = req.body
        let get_data = await USER.findOne({ _id: req.userId })
        if (!get_data) {
            res.send({
                code: constant.error_code,
                message: "Unable to get the details"
            })
        } else {
            res.send({
                code: constant.success_code,
                message: "Success",
                result:{
                    f_name:get_data.f_name,
                    l_name:get_data.l_name,
                    email:get_data.email,
                    status:get_data.status,
                    user_type:get_data.user_type,
                    phone_no:get_data.phone_no
                }
            })
        }
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}

exports.update_user_detail = async (req, res) => {
    try {
        let data = req.body
        let criteria = { _id: req.userId }
        let option = { new: true }

        let updateUser = await USER.findOneAndUpdate(criteria, data, option)
        if (!updateUser) {
            res.send({
                code: constant.error_code,
                message: "Unable to update the details"
            })
        } else {
            res.send({
                code: constant.success_code,
                message: "Successfully Updated",
                result:{
                    f_name:updateUser.f_name,
                    l_name:updateUser.l_name,
                    email:updateUser.email,
                    status:updateUser.status,
                    user_type:updateUser.user_type,
                    phone_no:updateUser.phone_no
                }
            })
        }
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}
