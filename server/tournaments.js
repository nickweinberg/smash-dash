const { getConnection } = require('./db');

module.exports = {
  createTournament: function(name, cb) {
    getConnection().query(`
        INSERT INTO tournaments
          (name)
        VALUES (?, ${ name })
      `,
      [name],
      (err = null, results) => {
        return cb(err, (results) ? name : null)
      }
    )
  }
}
