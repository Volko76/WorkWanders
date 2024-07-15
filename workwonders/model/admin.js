var db = require('./db.js'); 

module.exports = { 
    read: function (userId, callback) { 
        db.query("select * from admin where user_id= ?", userId, 
        function (err, results) { 
            if (err) throw err; 
            callback(results); 
 
        }); 
 
    }, 
    readall: function (callback) { 
        db.query("select * from admin where user_id= ?", function (err, results) { 
            if (err) throw err; 
            callback(results); 
 
        }); 
 
    }, 
 
    create: function (admin, callback) {
        db.query("INSERT INTO admin SET ?", admin, function (err, result) {
            if (err) throw err;
            callback(result);
        });
    }
}