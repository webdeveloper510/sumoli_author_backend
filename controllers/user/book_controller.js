const mongoose = require('mongoose')
const USER = require('../../models/user/login_model')
const BOOK = require('../../models/user/book_model')
const constant = require('../../config/constanct')
const multer = require('multer')
const path = require('path')

var bookStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../../uploads/book'))
    },
    filename: function (req, file, cb) {
        console.log("file+++++++++++++++++++++++=",file)
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

var bookUpload = multer({
    storage: bookStorage
}).single("cover_image")



exports.add_book = async (req, res) => {
    try {
        bookUpload(req, res, async (err) => {
            let data = req.body
            let file = req.file
            data.cover_image = file ? file.filename : "images.jpeg"
            data.userId = req.userId
            let check_user = await USER.findOne({ _id: req.userId })
            if (!check_user) {
                res.send({
                    code: constant.error_code,
                    message: "Invalid User Token"
                })
                return;
            }
            let save_book = await BOOK(data).save()
            if (!save_book) {
                res.send({
                    code: constant.error_code,
                    message: "Unable to store the book"
                })
            } else {
                res.send({
                    code: constant.success_code,
                    message: "Success",
                    result: {
                        book_name: save_book.book_name,
                        cover_image: save_book.cover_image,
                        book_store_info: save_book.book_store_info,
                        listening_url: save_book.listening_url,
                        status: save_book.status,
                    }
                })
            }

        })
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}

exports.get_users_book = async (req, res) => {
    try {
        let getBooks = await BOOK.find({
            $and: [
                { userId: req.userId },
                // { status: true },
                { isDeleted: false }
            ]
        })
        if (!getBooks) {
            res.send({
                code: constant.error_code,
                message: "Unable to fetch the data"
            })
        } else {
            res.send({
                code: constant.success_code,
                message: "Success",
                result: getBooks

            })
        }
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}

exports.get_book_by_id = async (req, res) => {
    try {
        let data = req.body
        let getBook = await BOOK.findOne({
            $and: [
                { _id: data.bookId },
                { status: true },
                { isDeleted: false }
            ]
        })
        if (!getBook) {
            res.send({
                code: constant.error_code,
                message: "Unable to get the book details"
            })
        } else {
            res.send({
                code: constant.success_code,
                message: "Success",
                result: {
                    book_name: getBook.book_name,
                    cover_image: getBook.cover_image,
                    book_store_info: getBook.book_store_info,
                    listening_url: getBook.listening_url,
                    status: getBook.status,
                    usesId: getBook.userId
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

exports.get_all_book = async (req, res) => {
    try {
        let getBooks = await BOOK.find({
            $and: [
                { isDeleted: false },
                { status: true }
            ]
        })
        if (!getBooks) {
            res.send({
                code: constant.error_code,
                message: "Unable to fetch the data"
            })
        } else {
            res.send({
                code: constant.success_code,
                message: "Success",
                result: getBooks

            })
        }
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}

exports.edit_book = async (req, res) => {
    try {
        bookUpload(req, res, async (err) => {
            try {
                let data = req.body
                let file = req.file
                let checkBook = await BOOK.findOne({ _id: data.bookId })
                if (!checkBook) {
                    res.send({
                        code: constant.error_code,
                        message: "Invalid Book ID"
                    })
                    return;
                }
                data.cover_image = file ? file.filename : checkBook.filename
                let updateData = await BOOK.findOneAndUpdate({ _id: data.bookId }, data, { new: true })
                if (!updateData) {
                    res.send({
                        code: constant.error_code,
                        message: "Unable to update the data"
                    })
                } else {
                    res.send({
                        code: constant.success_code,
                        message: "Success",
                        result: updateData
                    })
                }
            } catch (err) {
                res.send({
                    code: constant.error_code,
                    message: err.message
                })
            }
        })
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}

exports.delete_book = async (req, res) => {
    try {
        let data = req.body
        let deleteBook = await BOOK.findOneAndUpdate({ _id: req.params.bookId }, { isDeleted: true }, { new: true })
        if (!deleteBook) {
            res.send({
                code: constant.error_code,
                message: "Unable to delete the book"
            })
        } else {
            res.send({
                code: constant.success_code,
                message: "Deleted"
            })
        }
    } catch (err) {
        res.send({
            code: constant.error_code,
            message: err.message
        })
    }
}

