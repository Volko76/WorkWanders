var express = require('express');
var router = express.Router();
var organizationModel = require('../model/organization')
var userModel = require('../model/user');
var recruiterRequestModel = require('../model/recruiter_request');
const organization = require('../model/organization');

router.get('/joboffers', function (req, res, next) {
  result = userModel.readall(function (result) {
    res.render('joboffers', { users: result });
  });
});

router.get('/become_recruiter', function (req, res, next) {
  organizationModel.readall(function (organizations) {
    userModel.read(req.session.user_mail, function (result) {
      res.render('become_recruiter', { organizations: organizations, user: result[0] });
    });
  });
});

router.post('/join-organization', function (req, res, next) {
  const userId = req.session.user_id; // Assuming user_id is stored in session
  const siren = req.body.organization;

  recruiterRequestModel.join(userId, siren, function (result) {
    res.redirect('/homes');
  });
});

router.post('/create-organization', function (req, res, next) {
  const userId = req.session.user_id; // Assuming user_id is stored in session
  const { siren, headOffice, name, type } = req.body;

  recruiterRequestModel.create(userId, siren, headOffice, name, type, function (result) {
    res.redirect('/homes');
  });
});

module.exports = router;