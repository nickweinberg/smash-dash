const { getConnection } = require('./db');

module.exports = {
  createMatch: function(args, cb) {
    getConnection().query(`
        INSERT INTO matches
        SET ?
      `,
      [ args ],
      (err = null, results) => {
        return cb(err, JSON.parse(JSON.stringify(results)));
      }
    )
  },
  getMatch: function(matchId, cb) {
    getConnection().query(`
        SELECT *
        FROM matches
        WHERE
          match_id = ?
      `,
      [ matchId ],
      (err = null, results) => {
        return cb(err, JSON.parse(JSON.stringify(...results)));
      }
    );
  },
  updateMatch: function(matchId, args, cb) {
    getConnection().query(`
      UPDATE matches
      SET ?
      WHERE match_id = ?
    `,
    [ args, matchId ],
    (err = null, results) => {
        return cb(err, JSON.parse(JSON.stringify(...results)));
      }
    );
  },
  getPlayerMatches: function(playerId, cb) {
    getConnection().query(`
        SELECT *
        FROM matches
        WHERE
          player_one_id = ? OR player_two_id = ?
      `,
      [ playerId ],
      (err = null, results) => {
        return cb(err, JSON.parse(JSON.stringify(...results)));
      }
    );
  },
}
