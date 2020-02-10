 const mysql = require('mysql');
 const connection = mysql.createConnection({
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_DATABASE,
 });

 function query (sql, parametros) {
    return new Promise((resolve, reject) => {
      connection.query(sql, parametros, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
  
  module.exports = query
  