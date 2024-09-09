var mysql = require("mysql");

var pool = mysql.createPool({ 
    host: "XXXXXX", //ou localhost 
    user: "XXXXX", 
    password: "XXXXXXXX", 
    database: "XXXXXXXX" 
}); 

module.exports = pool;
