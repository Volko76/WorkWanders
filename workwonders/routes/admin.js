var express = require('express');
var router = express.Router();
var userModel = require('../model/user');
var organizationModel = require('../model/organization');
var recruiterModel = require('../model/recruiter');
var requestModel = require('../model/recruiter_request');
const session = require('../session');

// Middleware to ensure the user is an admin
router.use((req, res, next) => {
    if (session.isConnected(req.session, 'admin')) {
        next();
    } else {
        res.redirect('/users/login');
    }
});

// Get the admin panel
router.get('/', (req, res) => {
    userModel.readall((users) => {
        organizationModel.readall((organizations) => {
            userModel.read(req.session.user_mail, (result) => {
                requestModel.getJoinRequests((joinRequests) => {
                    requestModel.getCreateRequests((createRequests) => {
                        res.render('admin_panel', { 
                            title: 'Admin Panel', 
                            user: result[0], 
                            users: users, 
                            organizations: organizations,
                            joinRequests: joinRequests,
                            createRequests: createRequests 
                        });
                    });
                });
            });
        });
    });
});


// Create a new organization
router.post('/create-organization', (req, res) => {
    const { siren, headOffice, name, type } = req.body;
    organizationModel.create(siren, headOffice, name, type, (result) => {
        res.redirect('/admin');
    });
});

// Set user as recruiter
router.post('/set-recruiter', (req, res) => {
    const { userId, organizationSiren } = req.body;
    recruiterModel.create({ user_id: userId, organization: organizationSiren }, (result) => {
        res.redirect('/admin');
    });
});

// Delete a user
router.post('/delete-user', (req, res) => {
    const { userId } = req.body;
    userModel.delete(userId, (result) => {
        res.redirect('/admin');
    });
});

// Edit a user (get user data)
router.get('/edit-user/:id', (req, res) => {
    const userId = req.params.id;
    userModel.readById(userId, (user) => {
        res.render('edit_user', { title: 'Edit User', user: user[0] });
    });
});

// Edit a user (update user data)
router.post('/edit-user/:id', (req, res) => {
    const userId = req.params.id;
    const { name, firstName, phone, email, role } = req.body;
    userModel.update(userId, { name, first_name: firstName, phone, email, role }, (result) => {
        res.redirect('/admin');
    });
});

router.post('/approve-join-request', (req, res) => {
    const { userId, siren } = req.body;
    recruiterModel.create({ user_id: userId, organization: siren }, (result) => {
        userModel.updateRole(userId, 'recruiter', () => {
            requestModel.deleteJoinRequest(userId, siren, () => {
                res.redirect('/admin');
            });
        });
    });
});

router.post('/approve-create-request', (req, res) => {
    const { userId, siren, headOffice, name, type } = req.body;
    organizationModel.create(siren, headOffice, name, type, (result) => {
        recruiterModel.create({ user_id: userId, organization: siren }, (result) => {
            userModel.updateRole(userId, 'recruiter', () => {
                requestModel.deleteCreateRequest(userId, siren, () => {
                    res.redirect('/admin');
                });
            });
        });
    });
});

router.post('/reject-join-request', (req, res) => {
    const { userId, siren } = req.body;
    requestModel.deleteJoinRequest(userId, siren, () => {
        res.redirect('/admin');
    });
});

router.post('/reject-create-request', (req, res) => {
    const { userId, siren } = req.body;
    requestModel.deleteCreateRequest(userId, siren, () => {
        res.redirect('/admin');
    });
});

module.exports = router;
