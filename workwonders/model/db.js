var mysql = require("mysql");

var pool = mysql.createPool({ 
    host: "tuxa.sme.utc", //ou localhost 
    user: "sr10p051", 
    password: "ds1YdcmD2D4C", 
    database: "sr10p051" 
}); 

module.exports = pool;