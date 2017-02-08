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
  getConnection: () => connection
}
