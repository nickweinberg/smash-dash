const { getConnection } = require('./db');

const DEFAULT_DUBLOON_AMOUNT = 100;

module.exports = {
  getAllUsers: function (cb) {
    getConnection().query(`
        SELECT *
        FROM users
      `, (err = null, results) => {
        return cb(err, JSON.parse(JSON.stringify(results)));
      }
    )
  },
  getUser: function (userId, cb) {
    getConnection().query(`
        SELECT *
        FROM users
        WHERE
          user_id = ?
      `,
      [userId],
      (err = null, results) => {
        return cb(err, JSON.parse(JSON.stringify(...results)));
      }
    )
  },
  createUser: function(name, cb) {
    getConnection().query(`
        INSERT INTO users
          (name, dubloons)
        VALUES (?, ${ DEFAULT_DUBLOON_AMOUNT })
      `,
      [name],
      (err = null, results) => {
        return cb(err, (results) ? name : null)
      }
    )
  }
}
