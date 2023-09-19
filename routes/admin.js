var express = require('express');
var router = express.Router();
const adminController = require('../controllers/admin/admin_controller')
const bookController = require('../controllers/admin/book_controller');
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

module.exports = router;
