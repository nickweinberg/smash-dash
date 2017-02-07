const mysql = require('mysql');

/* dev - should grab from env */
const connection = mysql.createConnection({
  host: 'localhost',
  password: '123',
  database: 'smash',
  user: 'nick',
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log("connected?!");
});

module.exports = {
  getUsers: function (cb) {
    connection.query('select * from `users`', (error, results, fields) => {
      if (error) {
        console.error('error: ' + error.stack);
        return;
      }
      return cb(results);
    })
  },
  createUser: function(name, cb) {
    connection.query('insert into users (name) VALUES (?)', [name], (err, result) => {
      try {
        if (err) throw err
      }
      catch (error) {
        return cb(error);
      }
      return cb(result);
    })
  },
}