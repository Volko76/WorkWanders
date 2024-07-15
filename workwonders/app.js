require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('./session');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var recruiterRouter = require('./routes/recruiter');
var adminRouter = require('./routes/admin');

var homesRouter = require('./routes/homes');
var organizationsRouter = require('./routes/organizations');
var jobOffersRouter = require('./routes/jobOffers');
var applicationsRouter = require('./routes/applications');
var candidatesRouter = require('./routes/candidates');

var app = express();

app.use(session.init())
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// check user before app.use (path, router)
app.all("*", function (req, res, next) {
  const nonSecurePaths = ["/users/login", "/users/create_account", "/", "/jobOffers/jobOffersList", "/jobOffers/jobOffersSearch", "/jobOffers/explore"];
  const adminPaths = ["admin"]; //list des urls admin
  if (nonSecurePaths.includes(req.path)) return next();
  //authenticate user
  if (adminPaths.includes(req.path)) {
    if (session.isConnected(req.session, "admin")) return next();
    else
      res.status(403).render("error", { message: " Unauthorized access", error: {} });
  } else {
    if (session.isConnected(req.session)) return next();
    // not authenticated
    else res.redirect("/users/login");
  }
});


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/recruiter', recruiterRouter);
app.use('/homes', homesRouter);
app.use('/organizations', organizationsRouter);
app.use('/jobOffers', jobOffersRouter);
app.use('/application', applicationsRouter);
app.use('/candidates', candidatesRouter)

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
