var db = require('./db.js'); 

// TODO Eventually: all this code is redoundant between models, find way to group them all in some way
// 1. maybe put everything in user instead.
// another better way: use js class derivation (so that derived users derive directly from user)
module.exports = { 
    read: function (userId, callback) { 
        db.query("select * from recruiter where user_id= ?", userId, 
        function (err, results) { 
            if (err) throw err; 
            callback(results); 
 
        }); 
    }, 
    readall: function (callback) { 
        db.query("select * from recruiter where user_id= ?", function (err, results) { 
            if (err) throw err; 
            callback(results); 
        }); 
    }, 
    create: function (recruiter, callback) {
        db.query("INSERT INTO recruiter SET ?", recruiter, function (err, result) {
            if (err) throw err;
            callback(result);
        });
    },
    getOffers: function(email, callback) {
        const queryStr = "SELECT job_offer.* FROM recruiter JOIN organization ON recruiter.organization = organization.siren JOIN job_offer ON organization.siren = job_offer.organization_siren WHERE recruiter.user_id = ?";
        db.query(queryStr, email, function
            (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    getOrganization: function(userId, callback) {
        const queryStr = "SELECT organization.* FROM recruiter JOIN organization ON recruiter.organization = organization.siren WHERE recruiter.user_id = ?";
        db.query(queryStr, userId, function
            (err, results) {
            if (err) throw err;
            callback(results[0]);
        });
    },
}