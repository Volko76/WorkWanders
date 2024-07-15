var express = require('express');
var multer = require('multer');
var router = express.Router();
var jobOfferModel = require('../model/job_offer');
var userModel = require("../model/user");
var recruiterModel = require("../model/recruiter");
var applicationModel = require("../model/application");

// Set up multer for file uploads
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

router.get('/jobOffersList', function (req, res, next) {
  const { professionType = '', location = '', salaryRange = '', sortBy = '', page = 1 } = req.query;
  const limit = 6; // Number of results per page
  const offset = (parseInt(page) - 1) * limit;

  jobOfferModel.readAllWithOrganizationDetails(limit, offset, function (result) {
      let filteredJobOffers = result;
      const filterParams = `professionType=${professionType}&location=${location}&salaryRange=${salaryRange}&sortBy=${sortBy}`;

      // Filter by profession type
      if (professionType) {
        filteredJobOffers = filteredJobOffers.filter(offer =>
          offer.profession_type.toLowerCase().includes(professionType.toLowerCase())
        );
      }

      // Filter by location
      if (location) {
        filteredJobOffers = filteredJobOffers.filter(offer =>
          offer.mission_location.toLowerCase().includes(location.toLowerCase())
        );
      }

      // Filter by salary range
      if (salaryRange) {
        filteredJobOffers = filteredJobOffers.filter(offer =>
          offer.salary_range.toLowerCase().includes(salaryRange.toLowerCase())
        );
      }

      // Sort the results
      if (sortBy) {
        if (sortBy === 'date_desc') {
          filteredJobOffers.sort((a, b) => new Date(b.validity_date) - new Date(a.validity_date));
        } else if (sortBy === 'date_asc') {
          filteredJobOffers.sort((a, b) => new Date(a.validity_date) - new Date(b.validity_date));
        } else if (sortBy === 'salary_desc') {
          filteredJobOffers.sort((a, b) => b.salary_range - a.salary_range);
        } else if (sortBy === 'salary_asc') {
          filteredJobOffers.sort((a, b) => a.salary_range - b.salary_range);
        }
      }

      // Get total number of job offers for pagination
      jobOfferModel.countAllWithFilters({ professionType, location, salaryRange }, function (totalResults) {
          const totalPages = Math.ceil(totalResults / limit);

          res.render('jobOffersList', {
              title: 'Liste des offres d\'emploi',
              filterParams: filterParams,
              jobOffers: filteredJobOffers,
              currentPage: parseInt(page),
              totalPages: totalPages,
              professionType,
              location,
              salaryRange,
              sortBy,
              user: req.session.userid
          });
      });
  });
});

router.get('/jobOffersSearch', function (req, res) {
  const { search_what, search_where, page = 1 } = req.query;
  const limit = 6; // Default limit for pagination
  const offset = (parseInt(page) - 1) * limit;

  console.log(`Search What: ${search_what}, Search Where: ${search_where}, Page: ${page}`);

  jobOfferModel.searchWithPagination(search_what, search_where, limit, offset, function (result, totalResults) {
    const totalPages = Math.ceil(totalResults / limit); // Calculate total pages based on the total number of results
    const filterParams = `search_what=${search_what}&search_where=${search_where}`;

    console.log(`Total Results: ${totalResults}, Total Pages: ${totalPages}, Current Page: ${page}`);

    res.render('jobOffersList', { 
      title: 'Liste des offres d\'emploi', 
      jobOffers: result,
      user: req.session.userid || null,
      professionType: '',
      location: '',
      salaryRange: '',
      sortBy: '',
      filterParams: filterParams,
      currentPage: parseInt(page),
      totalPages: totalPages
    });
  });
});

router.get('/explore', function (req, res) {
  const id = req.query.id;
  if (req.session.user_mail) {
    userModel.read(req.session.user_mail, (resultUser) => {
      jobOfferModel.read(id, function (result) {
        console.log(result);
        res.render('recruiter_offers', { jobOffers: result, user: resultUser[0] });
      });
    });
  } else {
    jobOfferModel.read(id, function (result) {
      console.log(result);
      res.render('recruiter_offers', { jobOffers: result, user: null });
    });
  }
});

router.get('/browse_candidatures/:id', function (req, res){
  const jobId = req.params.id;
  applicationModel.getApplicationsByJob(jobId, (pendingApplications, acceptedApplications) => {
      res.render('browseCandidatures', {
          pendingApplications,
          acceptedApplications,
          jobId
      });
  });
});


router.get('/create', function (req, res) {
  userModel.read(req.session.user_mail, (resultUser) => {
    recruiterModel.getOrganization(req.session.user_id, (organization) => {
      res.render('create_job_offer', { user: resultUser[0], organization: organization });
    });
  })
}); 

router.post('/create', function (req, res) {
  console.log("created!");
  const newJobOffer = req.body;
  jobOfferModel.create(newJobOffer, function (result) {
    console.log(result);
    res.redirect("/homes");
  });
});

router.get('/remove/:id', function (req, res) {
  const id = req.params.id;
  jobOfferModel.delete(id, function (result) {
    console.log(result)
    res.redirect("/homes");
  });
});

router.get('/edit/:id', function (req, res) {
  const id = req.params.id;
  jobOfferModel.read(id, function (result) {
    userModel.read(req.session.user_mail, (resultUser) => {
      res.render('editJobOffer', { jobOffer: result[0], user: resultUser[0] });
    })
  });
});


router.post('/update/:id', function (req, res) {
  const id = req.params.id;
  const updatedJobOffer = req.body;
  jobOfferModel.update(id, updatedJobOffer, function (result) {
    console.log(result);
    res.redirect("/homes");
  });
});
// Route to handle application submission
router.post('/apply/:id', upload.fields([{ name: 'cv' }, { name: 'cover_letter' }]), function (req, res) {
  const jobId = req.params.id;
  userModel.read(req.session.user_mail, (resultUser) => {
    const user = resultUser[0];

    if (user.role !== 'candidate') {
      return res.status(403).send('Vous n\'avez pas la permission de postuler à cette offre.');
    }

    const application = {
      cv: req.files['cv'][0].buffer,
      cover_letter: req.files['cover_letter'][0].buffer,
      application_date: new Date(),
      candidate: user.id,
      job_offer: jobId
    };

    applicationModel.create(application, function (result) {
      console.log(result);
      res.redirect("/homes");
    });
  })
});

// Route to display the application form
router.get('/applyForm/:id', function (req, res) {
  const id = req.params.id;
  jobOfferModel.read(id, function (result) {
    if (result.length === 0) {
      return res.status(404).send('Job offer not found');
    }
    res.render('applicationForm', { jobOffer: result[0] });
  });
});

module.exports = router;
