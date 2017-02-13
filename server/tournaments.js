const { getConnection } = require('./db');

module.exports = {
  createTournament,
  getTournament,
  getAllTournaments,
}

function createTournament (name, cb) {
  getConnection().query(`
      INSERT INTO tournaments
        (name)
      VALUES (?)
    `,
    [name],
    (err = null, results) => {
      return cb(err, (results) ? name : null)
    }
  )
}

function getTournament (tournamentId, cb) {
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

function getAllTournaments (cb) {
  getConnection().query(`
      SELECT *
      FROM tournaments
    `, (err = null, results) => {
      return cb(err, JSON.parse(JSON.stringify(results)));
    }
  )
}
