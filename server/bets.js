const { getConnection } = require('./db');

module.exports = {
  getAllBets: function(cb) {
    getConnection().query(`
        SELECT *
        FROM bets
      `, (err = null, results) => {
        return cb(err, JSON.parse(JSON.stringify(results)));
      }
    )
  },

  createBet: function(tournament_id, bettor_id, player_id, amount, cb) {
    getConnection().query(`
        INSERT INTO bets
          (tournament_id, bettor_id, player_id, amount)
        VALUES (?, ?, ?, ?)
      `,
      [tournament_id, bettor_id, player_id, amount],
      (err=null, results) => {
        return cb(err, (results) ? name : null)
      })
  }


}
