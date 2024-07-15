var db = require('./db.js');

module.exports = {
    read: function (id, callback) {

        db.query("select * from job_offer where id= ?", id, function
            (err, results) {
            if (err) throw err;
            callback(results);

        });

    },
    readall: function (callback) {
        db.query("select * from job_offer", function (err, results) {
            if (err) throw err;
            callback(results);

        });
    },
    readAllWithOrganizationDetails: function (limit, offset, callback) {
        const query = `
            SELECT job_offer.*, organization.name as organization_name
            FROM job_offer
            JOIN organization ON organization.siren = organization_siren
            LIMIT ? OFFSET ?`;
        db.query(query, [limit, offset], function (err, results) {
            if (err) throw err;
            callback(results);
        });
      },
      
      countAllWithFilters: function (filters, callback) {
        let query = "SELECT COUNT(*) AS count FROM job_offer JOIN organization ON organization.siren = organization_siren WHERE 1=1";
        let params = [];
      
        if (filters.professionType) {
            query += " AND LOWER(profession_type) LIKE ?";
            params.push(`%${filters.professionType.toLowerCase()}%`);
        }
        if (filters.location) {
            query += " AND LOWER(mission_location) LIKE ?";
            params.push(`%${filters.location.toLowerCase()}%`);
        }
        if (filters.salaryRange) {
            query += " AND LOWER(salary_range) LIKE ?";
            params.push(`%${filters.salaryRange.toLowerCase()}%`);
        }
      
        db.query(query, params, function (err, results) {
            if (err) throw err;
            callback(results[0].count);
        });
      },
          
    create: function (jobOffer, callback) {
        db.query("INSERT INTO job_offer SET ?", jobOffer, function (err, result) {
            if (err) throw err;
            callback(result);
        });
    },
    delete: function (id, callback) {
        db.query("DELETE FROM job_offer WHERE id = ?", id, function (err, result) {
            if (err) {
                throw err;
            } else {
                callback(result);
            }
        });
    },
    update: function (id, jobOffer, callback) {
        db.query("UPDATE job_offer SET ? WHERE id = ?", [jobOffer, id], function (err, result) {
            if (err) {
                throw err;
            } else {
                callback(result);
            }
        });
    },
    search: function (what, where, callback) {
        let query = "SELECT * FROM job_offer WHERE 1=1";
        let params = [];

        if (what) {
            query += " AND (profession_type LIKE ? OR description LIKE ?)";
            params.push(`%${what}%`, `%${what}%`);
        }
        if (where) {
            query += " AND mission_location LIKE ?";
            params.push(`%${where}%`);
        }

        db.query(query, params, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    },
    searchWithPagination: function (what, where, limit, offset, callback) {
        let query = "SELECT * FROM job_offer WHERE 1=1";
        let params = [];
      
        if (what) {
          query += " AND (profession_type LIKE ? OR description LIKE ?)";
          params.push(`%${what}%`, `%${what}%`);
        }
        if (where) {
          query += " AND mission_location LIKE ?";
          params.push(`%${where}%`);
        }
      
        const queryWithLimitOffset = `${query} LIMIT ? OFFSET ?`;
        params.push(limit, offset);
      
        db.query(queryWithLimitOffset, params, function (err, results) {
          if (err) throw err;
      
          const countQuery = `SELECT COUNT(*) as total FROM job_offer WHERE 1=1`;
      
          db.query(countQuery, function (err, totalResults) {
            if (err) throw err;
            const total = totalResults[0].total;
            console.log(`Query: ${queryWithLimitOffset}, Params: ${params}, Total Results: ${total}`);
            callback(results, total);
          });
        });
      }
      
,            
    getOrganization: function (id, callback) {
        db.query("SELECT * FROM organization WHERE siren = (SELECT organization_siren FROM job_offer WHERE id = ?)", id, function (err, results) {
            if (err) throw err;
            callback(results);
        });
    }
}

if (require.main === module) {
    module.exports.create({
        state: 'published',
        validity_date: new Date(2024, 7, 21),
        required_documents_list: "CV, lettre motivation",
        nb_required_documents: 2,
        position_status: 'executive',
        line_manager: 'jean-paul boufflet',
        profession_type: 'enseignant-chercheur de nf92',
        mission_location: 'compiègne',
        pace: '6h par semaine',
        salary_range: '200000000€',
        description: "enseigner nf92",
        organization_siren: "12345678901234",
    },
        function (result) {
            console.log('Résultat de la création :', result);
        });
}