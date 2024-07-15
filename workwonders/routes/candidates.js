var express = require('express');
var router = express.Router();
var organizationModel = require('../model/candidate')

router.get('/candidatesList', function (req, res, next) {
  result=organizationModel.readall(function(result){
    res.render('candidatesList', { title: 'Liste des candidats', candidates: result });  
  });
});

module.exports = router;