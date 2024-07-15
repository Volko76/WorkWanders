var express = require('express');
var router = express.Router();
var organizationModel = require('../model/organization')
var recruiterModel = require("../model/recruiter")

router.get('/organizationslist', function (req, res, next) {
  result = organizationModel.readall(function (result) {
    res.render('organizationslist', { title: 'Liste des organisations', organizations: result });
  });
});

router.get('/create_organization', function (req, res, next) {
  res.render('create_organization')
});
router.post('/create_organization', function (req, res, next) {
  var { siren, headOffice, name, type } = req.body
  organizationModel.create(siren, headOffice, name, type, function (result) {
    res.redirect('/organizations/organizationslist');
  });
});

router.get('/editOrganization', function (req, res) {
  recruiterModel.getOrganization(req.session.user_id, function (organization) {
    res.render('editOrganization', { organization });
  });
});

router.post('/updateOrganization', function (req, res) {
  const organizationId = req.body.siren;
  const updatedOrganizationData = req.body;
  organizationModel.update(organizationId, updatedOrganizationData, function (result) {
    res.redirect('/homes');
  });
});
module.exports = router;