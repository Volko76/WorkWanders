var db = require('./db.js');

module.exports = {
    UserType: {
        Recruiter: "recruiter",
        Candidate: "candidate",
        Admin: "admin",
    },
    read: function (email, callback) {
        db.query("select * from user where email= ?", email, function
            (err, results) {
            if (err) throw err;
            callback(results);

        });
    },
    readall: function (callback) {
        db.query("select * from user", function (err, results) {
            if (err) throw err;
            callback(results);

        });

    },
    areValid: function (email, password, callback) {
        db.query("SELECT role, password, id FROM user WHERE email = ?", email, function (err, rows) {
            if (err) {
                callback(null, null); // or throw err, depending on your error handling
            } else if (rows.length === 1 && rows[0].password === password) {
                callback(true, rows[0]); // return the user object
            } else {
                callback(false, null);
            }
        });
    },
    create: function (email, name, firstName, pwd, phone, callback) {
        var user = {
            name: name,
            first_name: firstName,
            phone: phone,
            password: pwd,
            isActive: true,
            creation_date: new Date(),
            email: email,
            role: "candidate"
        };
        db.query("INSERT INTO user SET ?", user, function (err, result) {
            if (err) throw err;
            callback(result);
        });
    },
    delete: function (userId, callback) {
        db.query("DELETE FROM user WHERE id = ?", userId, function (err, result) {
            if (err) throw err;
            callback(result);
        });
    },

    readById: function (userId, callback) {
        db.query("SELECT * FROM user WHERE id = ?", userId, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    getAppliedJobOffers: function (userId, callback) {
        const queryStr = `
            SELECT 
                application.*, 
                job_offer.title AS job_offer_title, 
                job_offer.id AS job_offer_id, 
                application.status AS application_status 
            FROM 
                application 
            JOIN 
                job_offer 
            ON 
                application.job_offer = job_offer.id 
            WHERE 
                application.candidate = ?`;
        db.query(queryStr, userId, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    
    update: function (userId, userData, callback) {
        db.query("UPDATE user SET ? WHERE id = ?", [userData, userId], function (err, result) {
            if (err) throw err;
            callback(result);
        });
    },
    findByEmail: function (email, callback) {
        const query = 'SELECT * FROM user WHERE email = ?';
        db.query(query, [email], function (err, result) {
            if (err) {
                return callback(err);
            }
            if (result.length > 0) {
                callback(null, result[0]);
            } else {
                callback(null, null);
            }
        });
    },
    findById: function (id, callback) {
        const query = 'SELECT * FROM user WHERE id = ?';
        db.query(query, [id], function (err, result) {
            if (err) {
                return callback(err);
            }
            if (result.length > 0) {
                callback(null, result[0]);
            } else {
                callback(null, null);
            }
        });
    },

    updatePassword: function (id, newPassword, callback) {
        const query = 'UPDATE user SET password = ? WHERE id = ?';
        db.query(query, [newPassword, id], function (err, result) {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    },
    updateRole: function (userId, newRole, callback) {
        const query = 'UPDATE user SET role = ? WHERE id = ?';
        db.query(query, [newRole, userId], function (err, result) {
            if (err) {
                return callback(err);
            }
            callback(null, result);
        });
    },

    // derived users (recruiter, candidate, admin)
    readDerived: function (userType, userId, callback) {
        db.query("select * from ? where userId= ?", userType, userId,
            function (err, results) {
                if (err) throw err;
                callback(results);
            });
    },
    readallDerived: function (userType, callback) {
        db.query("select * from ? where user_id= ?", userType, function (err, results) {
            if (err) throw err;
            callback(results);

        });
    },

    createDerived: function (userType, user, callback) {
        db.query("INSERT INTO ? SET ?", userType, user, function (err, result) {
            if (err) throw err;
            callback(result);
        });
    }
}

if (require.main === module) {
    module.exports.create('test@example.com', 'Doe', 'John', 'password123', '123456789', function (result) {
        console.log('Résultat de la création :', result);
    });
}