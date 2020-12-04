const express = require('express');
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const logger = require('morgan');


const app = express();
const sessionStore = new session.MemoryStore;

const indexRouter = require('./routes/index');

app.use('/', indexRouter);

app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(...loginRouter.initialize());
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

//　セッション情報設定 追加部分ここから                                                                                               
app.use(cookieParser('secret'));
app.use(session({
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  store: sessionStore,
  saveUninitialized: true,
  resave: 'true',
  secret: 'secret'
}));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
