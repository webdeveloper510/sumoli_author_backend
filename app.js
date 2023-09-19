require('dotenv').config()

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const http = require('http')
const db = require('./db')

var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');

var app = express();
const httpServer = http.createServer(app)
app.use(cors())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
res.connection.setTimeout(0);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || process.env.Port
httpServer.listen(process.env.Port, () => console.log(`app listening at http://localhost:${PORT}`))


module.exports = app;