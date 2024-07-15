var express = require('express');
var router = express.Router();
var applicationModel = require('../model/application')
var multer = require('multer');
const fs = require('fs');

// Set up multer to store files in memory
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });


router.get('/', function (req, res, next) {
  applicationModel.readall(function(err, results) {
    if (err) {
      return next(err); // Forward error to Express error handler
    }
    res.render('applications', { title: 'Liste des candidatures', applications: results });
  });
});

router.get('/explore/:id', function (req, res, next) {
  const id = req.params.id;
  
  applicationModel.read(id, function(err, result) {
    if (err) {
      return next(err); // Forward error to Express error handler
    }
    if (result.length === 0) {
      res.status(404).send("Application not found");
    } else {
      console.log("exp")
      console.log(result)
      res.render('see_candidature', { applications: result, user: req.session.userid });
    }
  });
});
router.get('/cv/:id', function (req, res) {
  const applicationId = req.params.id;
  console.log("dddd")
  applicationModel.getCV(applicationId, function (cv) {
      if (cv) {
          const buffer = Buffer.from(cv, 'binary');
          res.setHeader('Content-Disposition', 'attachment; filename="cv.pdf"');
          res.setHeader('Content-Type', 'application/pdf');
          res.send(buffer);
      } else {
          res.status(404).send('CV not found');
      }
  });
});

router.get('/cover_letter/:id', function (req, res) {
  const applicationId = req.params.id;
  console.log("dddd")
  applicationModel.getCoverLetter(applicationId, function (coverLetter) {
      if (coverLetter) {
          const buffer = Buffer.from(coverLetter, 'binary');
          res.setHeader('Content-Disposition', 'attachment; filename="cover_letter.pdf"');
          res.setHeader('Content-Type', 'application/pdf');
          res.send(buffer);
      } else {
          res.status(404).send('Cover letter not found');
      }
  });
});

router.post('/validate/:id', function (req, res) {
  const applicationId = req.params.id;
  console.log("accept")
  applicationModel.validate(applicationId, function (result) {
      if (result.affectedRows > 0) {
          res.json({ success: true });
      } else {
          res.json({ success: false });
      }
  });
});

router.post('/decline/:id', function (req, res) {
  const applicationId = req.params.id;
  console.log("decline")
  applicationModel.decline(applicationId, function (result) {
      if (result.affectedRows > 0) {
          res.json({ success: true });
      } else {
          res.json({ success: false });
      }
  });
});


router.get('/new', function (req, res) {
  res.render('new_application', { title: 'Créer une nouvelle candidature' });
});
router.post('/new', function (req, res, next) {
  const newApplication = {
    job_offer_id: req.body.job_offer_id,
    candidate: req.body.candidate,
    status: req.body.status,
    // Add other fields as required
  };

  applicationModel.create(newApplication, function(err, result) {
    if (err) {
      return next(err); // Forward error to Express error handler
    }
    res.redirect('/applications'); // Redirect to the list of applications
  });
});
// Get application edit form
router.get('/edit/:id', function (req, res, next) {
  const id = req.params.id;

  applicationModel.read(id, function(err, result) {
    if (err) {
      return next(err); // Forward error to Express error handler
    }
    if (result.length === 0) {
      res.status(404).send("Application not found");
    } else {
      res.render('edit_application', { application: result[0] });
    }
  });
});

// Handle application update with in-memory file uploads
router.post('/update/:id', upload.fields([{ name: 'cv' }, { name: 'cover_letter' }]), function (req, res, next) {
  const id = req.params.id;
  const updatedApplication = {};

  if (req.files['cv']) {
    updatedApplication.cv = req.files['cv'][0].buffer; // Directly use buffer
  }
  if (req.files['cover_letter']) {
    updatedApplication.cover_letter = req.files['cover_letter'][0].buffer; // Directly use buffer
  }

  applicationModel.update(id, updatedApplication, function(err, result) {
    if (err) {
      return next(err); // Forward error to Express error handler
    }
    res.redirect('/homes');
  });
});


router.post('/delete/:id', function (req, res, next) {
  const id = req.params.id;

  applicationModel.delete(id, function(err, result) {
    if (err) {
      return next(err); // Forward error to Express error handler
    }
    res.redirect('/homes'); // Redirect to the list of applications
  });
});



module.exports = router;