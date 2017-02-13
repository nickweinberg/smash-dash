const { getConnection } = require('./db');
const { addRating } = require('./ratings');

const DEFAULT_DUBLOON_AMOUNT = 100;

module.exports = {
  getAllUsers,
  getUsers,
  getUser,
  createUser,
  updateUserRating,
  completeMatch,
}

function getAllUsers (cb) {
  getConnection().query(`
      SELECT *
      FROM users
    `, (err = null, results) => {
      return cb(err, JSON.parse(JSON.stringify(results)));
    }
  )
}
/*
* getUsers(['1','2'], (err, res) => {
*   console.log(res);
* });
*/
function getUsers (userIds, cb) {
  getConnection().query(`
      SELECT *
      FROM users
      WHERE
        user_id IN (?)
    `,
    [userIds],
    (err = null, results) => {
      return cb(err, JSON.parse(JSON.stringify(results)));
    }
  )
}
function getUser (userId, cb) {
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
}

function createUser (name, cb) {
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
function updateUserRating (userId, newRating, cb) {
  getConnection().query(`
    UPDATE users
    SET rating = ?
    WHERE user_id = ?
  `,
  [ newRating, userId ],
  (err = null, results) => {
    return cb(err, JSON.parse(JSON.stringify(results)));
  });
}
/*
* match should create a match
* check the winner/loser
* get updated elo.
* update each user with their updated elo.
* insert a row in rating for each user.
* ie.
* completeMatch({player_one_id: 1, player_two_id: 2, player_one_score: 2, player_two_score: 1}, 1, null)
*/
function completeMatch ({ player_one_id, player_two_id, player_one_score, player_two_score, k_factor }, matchId, cb) {
  /* only create ratings if createMatch was successful */
  if (!k_factor) {
    k_factor = 32;
  }
  console.log('complete match')
  const [winnerId, loserId] = getWinnerLoser([player_one_id, player_one_score], [player_two_id, player_two_score]);
  getUsers([winnerId, loserId], (err, [winnerObj, loserObj]) => {
    if(err)
      return err;

    console.log('got users');
    const [newWinnerElo, newLoserElo] = elo(winnerObj.rating, loserObj.rating);
    updateUserRating(winnerId, newWinnerElo, (err, result) => {
      if(err)
        return err;

      console.log('updated winner');
    });

    updateUserRating(loserId, newLoserElo, (err, result) => {
      if(err)
        return err;

      console.log('updated loser');
    });

    /* add winner and loser ratings rows */
    addRating([winnerId, matchId, newWinnerElo], (err, results) => {
      if(err)
        return err;

      console.log('winner rating row added');
    });

    addRating([loserId, matchId, newLoserElo], (err, results) => {
      if(err)
        return err;

      console.log('loser rating row added');
    });
  });
  return true;
}
