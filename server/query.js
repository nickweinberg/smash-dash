const { getConnection } = require('./db');

module.exports = function(query) {
  return function(args, cb) {
    if (args) {
      getConnection().query(
        query,
        [args],
        (err = null, results) => {
          return cb(err, JSON.parse(JSON.stringify(results)));
      });
    } else {
      getConnection().query(
        query,
        (err = null, results) => {
          return cb(err, JSON.parse(JSON.stringify(results)));
      });
    }
  }
}
