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
  },
  getTournament: function(tournamentId, cb) {
    getConnection().query(`
        SELECT *
        FROM tournaments
        WHERE
          tournament_id = ?
      `,
      [ tournamentId ],
      (err = null, results) => {
        return cb(err, JSON.parse(JSON.stringify(...results)));
      }
    );
  }
}
