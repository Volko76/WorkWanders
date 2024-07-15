var express = require('express');
var router = express.Router();

var userModel = require("../model/user")

var db = require('../model/db');


/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.session)
  res.render('index', { title: 'Express' });
});

router.get('/creepy', function (req, res, next) {
  console.log(req.session)
  res.render('creepy');
});


router.get('/gift', function (req, res, next) {
  res.render('gift');
});

module.exports = router;
