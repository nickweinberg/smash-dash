const { getConnection } = require('./db');
const { addRating } = require('./ratings');
const elo = require('./elo');

const DEFAULT_DUBLOON_AMOUNT = 100;

module.exports = {
  getAllUsers,
  getUsers,
  getUser,
  createUser,
  updateUserRating,
  completeMatch,
};

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
function updateUserRating (userId, updateFields, cb) {
  getConnection().query(`
    UPDATE users
    SET ?
    WHERE user_id = ?
  `,
  [ updateFields, userId ],
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


  getUsers([player_one_id, player_two_id], (err, [playerOne, playerTwo]) => {
    if(err) {
      return err;
    }


    const {one = {}, two = {}} = _determineResult(playerOne, player_one_score, playerTwo, player_two_score);

    console.log('got users');
    updateUserRating(player_one_id, one, (err, result) => {
      if(err)
        return err;

      console.log('updated One');
    });

    updateUserRating(player_two_id, two, (err, result) => {
      if(err)
        return err;

      console.log('updated Two');
    });

    /* add winner and loser ratings rows */
    addRating({
      player_id: player_one_id,
      match_id: matchId,
      rating: one.rating
    }, (err, results) => {
      if (err)
        return err;

      console.log('Player One rating row added');
    });

    addRating({
      player_id: player_two_id,
      match_id: matchId,
      rating: two.rating
    }, (err, results) => {
      if (err)
        return err;

      console.log('Player Two rating row added');
    });
  });
  return true;
}

function _getWinnerLoser(p1, p2) {
  if (parseInt(p1[1]) > parseInt(p2[1])) {
    return [p1[0], p2[0]];
  } else {
    return [p2[0], p1[0]];
  }
}

function _determineResult(one, scoreOne, two, scoreTwo) {
  let oneElo, twoElo;
  scoreOne = parseInt(scoreOne);
  scoreTwo = parseInt(scoreTwo);

  if (scoreOne > scoreTwo) {
    [oneElo, twoElo] = elo(one.rating, two.rating);
  } else {
    [twoElo, oneElo] = elo(two.rating, one.rating);
  }


  return {
    one: {
      wins: parseInt(one.wins || 0) + scoreOne,
      losses: parseInt(one.losses || 0) + scoreTwo,
      rating: oneElo,
    },
    two: {
      wins: parseInt(two.wins || 0) + scoreTwo,
      losses: parseInt(two.losses || 0) + scoreOne,
      rating: twoElo,
    }
  }
}
