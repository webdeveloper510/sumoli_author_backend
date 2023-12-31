var express = require('express');
var router = express.Router();
const login_controller = require('../controllers/user/login_controller')
const book_controller = require('../controllers/user/book_controller')
const store_controller = require('../controllers/user/store_controller')
const jwtAuthantication = require('../middlewares');
const { verifyToken } = require('../middlewares/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//------------------- USER API'S--------------------------
router.post('/user_signup',login_controller.user_signup)
router.post('/user_signin',login_controller.user_signin)
router.put('/resend_otp',login_controller.resend_otp)
router.post('/verify_otp',login_controller.verify_otp)
router.post('/forgot_password',login_controller.forgot_password)
router.post('/reset_password',[verifyToken], login_controller.reset_password)
router.get('/get_user_detail',[verifyToken], login_controller.get_user_detail)
router.put('/update_user_detail',[verifyToken], login_controller.update_user_detail)

//------------------- BOOK API'S--------------------------
router.post('/add_book',[verifyToken],book_controller.add_book)
router.get('/get_users_book',[verifyToken],book_controller.get_users_book)
router.get('/get_all_book',[verifyToken],book_controller.get_all_book)
router.post('/get_book_by_id',[verifyToken],book_controller.get_book_by_id)
router.put('/edit_book',[verifyToken],book_controller.edit_book)
router.delete('/delete_book/:bookId',[verifyToken],book_controller.delete_book)


//------------------- STORE API'S--------------------------
router.post('/add_store',[verifyToken],store_controller.add_store)
router.get('/get_user_stores',[verifyToken],store_controller.get_user_stores)
router.get('/get_all_stores',[verifyToken],store_controller.get_all_stores)
router.post('/get_store_by_id',[verifyToken],store_controller.get_store_by_id)
router.put('/edit_store',[verifyToken],store_controller.edit_store)
router.delete('/delete_store/:storeId',[verifyToken],store_controller.delete_store)




module.exports = router;
