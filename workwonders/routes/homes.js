var express = require('express');
var router = express.Router();
var userModel = require('../model/user');
const session = require('../session');
var jobOfferModel = require('../model/job_offer')
var applicationModel = require('../model/application')
var recruiterModel = require('../model/recruiter')
var organizationModel = require('../model/organization')


router.get('/userslist', function (req, res, next) {
  result = userModel.readall(function (result) {
    res.render('usersList', { title: 'Liste des utilisateurs', users: result });
    //res.send(result);
  });
});

router.get("/", (req, res) => {
  userModel.read(req.session.user_mail, (result) => {
    user = result[0];
    if (session.isConnected(req.session, "recruiter")) {
      let organization;

      recruiterModel.getOrganization(req.session.user_id, (organization) => {
        recruiterModel.getOffers(req.session.user_id, (result) => {
          console.log("thenen");
          console.log(result);
          console.log(organization);
          res.render('recruiter_home', { user: user, jobOffers: result, organization: organization });
        });
      });
    } else if (session.isConnected(req.session, "admin")) {
      res.redirect('/admin/');
    } else if (session.isConnected(req.session, "candidate")) {
      userModel.getAppliedJobOffers(req.session.user_id, (result) => {
        res.render('candidate_home', { user: user, applications: result });
      });
    } else {
      res.redirect('/users/login');
    }
  });
});

module.exports = router;