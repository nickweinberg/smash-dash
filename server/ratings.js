const { getConnection } = require('./db');

module.exports = {
  /* args
   * keys [player_id, last_match_played_id, rating]
   */
  addRating: function(args, cb) {
    getConnection().query(`
      INSERT INTO ratings
      SET ?
    `,
    args,
    (err = null, results) => {
      return cb(err, JSON.parse(JSON.stringify(results)));
    });
  },
}
