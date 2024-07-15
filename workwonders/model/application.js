var db = require('./db.js');

module.exports = {
  read: function (id, callback) {
    db.query(
      "SELECT a.*, u.name AS candidate_name FROM application a JOIN user u ON a.candidate = u.id WHERE a.id = ?",
      [id],
      function (err, results) {
        if (err) throw err;
        callback(null, results);
      }
    );
  },
  readall: function (callback) {
    db.query("SELECT a.*, u.name AS candidate_name, u.first_name AS candidate_first_name FROM application a JOIN user u ON u.id = a.candidate",
      function (err, results) {
        if (err) throw err;
        callback(null, results);
      }
    );
  },
  getCV: function (applicationId, callback) {
    const query = "SELECT cv FROM application WHERE id = ?";
    db.query(query, [applicationId], function (err, results) {
      if (err) throw err;
      if (results.length > 0) {
        callback(results[0].cv);
      } else {
        callback(null);
      }
    });
  },

  getCoverLetter: function (applicationId, callback) {
    const query = "SELECT cover_letter FROM application WHERE id = ?";
    db.query(query, [applicationId], function (err, results) {
      if (err) throw err;
      if (results.length > 0) {
        callback(results[0].cover_letter);
      } else {
        callback(null);
      }
    });
  }
  ,
  readallByJobOfferId: function (jobOfferId, callback) {
    const query = `
        SELECT 
            application.id, 
            application.cv, 
            application.cover_letter, 
            application.application_date, 
            user.name, 
            user.first_name, 
            user.email, 
            user.phone 
        FROM application 
        JOIN user ON application.candidate = user.id 
        WHERE job_offer = ?`;
    db.query(query, [jobOfferId], function (err, results) {
      if (err) throw err;
      callback(results);
    });
  },
  validate: function (applicationId, callback) {
    const query = "UPDATE application SET status = 'validated' WHERE id = ?";
    db.query(query, [applicationId], function (err, result) {
      if (err) throw err;
      callback(result);
    });
  },
  decline: function (applicationId, callback) {
    const query = "UPDATE application SET status = 'declined' WHERE id = ?";
    db.query(query, [applicationId], function (err, result) {
      if (err) throw err;
      callback(result);
    });
  },
  getApplicationsByJob: function (jobId, callback) {
    const pendingQuery = `
        SELECT application.*, user.name, user.first_name, user.email, user.phone 
        FROM application 
        JOIN user ON application.candidate = user.id 
        WHERE application.job_offer = ? AND application.status = 'waiting'`;

    const acceptedQuery = `
        SELECT application.*, user.name, user.first_name, user.email, user.phone 
        FROM application 
        JOIN user ON application.candidate = user.id 
        WHERE application.job_offer = ? AND application.status = 'validated'`;

    db.query(pendingQuery, [jobId], function (err, pendingResults) {
      if (err) throw err;
      db.query(acceptedQuery, [jobId], function (err, acceptedResults) {
        if (err) throw err;
        callback(pendingResults, acceptedResults);
      });
    });
  },
  create: function (application, callback) {
    db.query("INSERT INTO application SET ?", application, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },
  update: function (id, application, callback) {
    // Create SQL and data arrays to update dynamically based on provided fields
    let fields = [];
    let values = [];
    for (const key in application) {
      if (application.hasOwnProperty(key)) {
        fields.push(`${key} = ?`);
        values.push(application[key]);
      }
    }
    values.push(id);

    const sql = `UPDATE application SET ${fields.join(', ')} WHERE id = ?`;

    db.query(sql, values, function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  },
  delete: function (id, callback) {
    db.query("DELETE FROM application WHERE id = ?", [id], function (err, result) {
      if (err) throw err;
      callback(null, result);
    });
  }
};
