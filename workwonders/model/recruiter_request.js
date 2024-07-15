var db = require('./db.js');

module.exports = { 
    join: function (userId, siren, callback) { 
        const query = 'INSERT INTO recruiter_join_request (user_id, siren) VALUES (?, ?)';
        db.query(query, [userId, siren], function (err, results) {
            if (err) throw err; 
            callback(results); 
        });
    }, 
    create: function (userId, siren, headOffice, name, type, callback) { 
        const query = `
            INSERT INTO recruiter_create_request (user_id, siren, head_office, name, type)
            VALUES (?, ?, ?, ?, ?)
            `;
        db.query(query, [userId, siren, headOffice, name, type], function (err, results) {
            if (err) throw err; 
            callback(results); 
        });
    },
    getJoinRequests: function (callback) {
        const query = 'SELECT * FROM recruiter_join_request';
        db.query(query, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    getCreateRequests: function (callback) {
        const query = 'SELECT * FROM recruiter_create_request';
        db.query(query, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    deleteJoinRequest: function (userId, siren, callback) {
        const query = 'DELETE FROM recruiter_join_request WHERE user_id = ? AND siren = ?';
        db.query(query, [userId, siren], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    deleteCreateRequest: function (userId, siren, callback) {
        const query = 'DELETE FROM recruiter_create_request WHERE user_id = ? AND siren = ?';
        db.query(query, [userId, siren], function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }
}