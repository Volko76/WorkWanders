var db = require('./db.js'); 

module.exports = { 
    read: function (userId, callback) { 
        db.query("select * from candidate where user_id= ?", userId, 
        function (err, results) { 
            if (err) throw err; 
            callback(results); 
 
        }); 
 
    }, 
    readall: function (callback) { 
        db.query("select * from candidate", function (err, results) { 
            if (err) throw err; 
            callback(results); 
 
        }); 
 
    }, 
 
    create: function (candidate, callback) {
        db.query("INSERT INTO candidate SET ?", candidate, function (err, result) {
            if (err) throw err;
            callback(result);
        });
    }
}