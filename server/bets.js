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

  createBet: function(args, cb) {
    getConnection().query(`
        INSERT INTO bets
        SET ?
      `,
      [ args ],
      (err = null, results) => {
        return cb(err, JSON.parse(JSON.stringify(results)));
      })
  }


}
