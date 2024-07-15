var db = require('./db.js'); 

module.exports = { 
    read: function (siren, callback) { 
        db.query("select * from organization where siren= ?", siren, 
        function (err, results) { 
            if (err) throw err; 
            callback(results); 
        }); 
    }, 
    readall: function (callback) { 
        db.query("select * from organization", function (err, results) { 
            if (err) throw err; 
            callback(results);
        }); 
    }, 
 
    create: function (siren, headOffice, name, type, callback) {
        var organization = {
            siren: siren,
            head_office: headOffice,
            name: name,
            type: type
        };
    
        db.query("INSERT INTO organization SET ?", organization, 
            function (err, result) {
                if (err) throw err;
                callback(result);
            });
    },
    update: function (organizationId, organizationData, callback) {
        db.query("UPDATE organization SET ? WHERE siren = ?", [organizationData, organizationId], function (err, result) {
            if (err) throw err;
            callback(result);
        });
    }
}

if (require.main === module) {
    module.exports.create('12345678901234', 'Brooklyn, NYC', 'Zipisoft corporation', 'eurl', 
    function(result) {
      console.log('Résultat de la création :', result);
    });
  }