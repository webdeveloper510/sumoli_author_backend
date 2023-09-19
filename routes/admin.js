var express = require('express');
var router = express.Router();
const adminController = require('../controllers/admin/admin_controller')
const bookController = require('../controllers/admin/book_controller');
const store_controller = require('../controllers/admin/store_controller');
const userController = require('../controllers/admin/user_controller');
const { verifyToken } = require('../middlewares/auth');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/add_admin',adminController.add_admin)
router.post('/admin_login',adminController.admin_login)


//-----------------------BOOK API'S-------------------
router.get('/get_books',[verifyToken],bookController.get_books)
router.post('/get_book_detail',[verifyToken],bookController.get_book_detail)
router.put('/edit_book',[verifyToken],bookController.edit_book)
router.delete('/delete_book/:bookId',[verifyToken],bookController.delete_book)


//-----------------------STORE API'S-------------------
router.get('/get_all_stores',[verifyToken],store_controller.get_all_stores)
router.post('/get_store_by_id',[verifyToken],store_controller.get_store_by_id)
router.put('/edit_store',[verifyToken],store_controller.edit_store)
router.delete('/delete_store/:storeId',[verifyToken],store_controller.delete_store)


//-----------------------USER API'S-------------------
router.get('/get_all_users',[verifyToken],userController.get_all_users)
router.post('/get_user_by_id',[verifyToken],userController.get_user_by_id)
router.put('/edit_user',[verifyToken],userController.edit_user)
router.delete('/delete_user/:userId',[verifyToken],userController.delete_user)





module.exports = router;
