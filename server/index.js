const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const HTTP_PORT = 3000;
// const db = require('./db');
const { createUser, getAllUsers, getUser, updateUser } = require('./users');
const { createTournament, getTournament } = require('./tournaments');
const { createMatch, getMatch, updateMatch } = require('./matches');
const elo = require('./elo');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

app.get('/api/random', function (req, res) {
  // db.getUsers((results) => {
  //   console.log(results);
  // });

  res.send({
    success: true,
    message: (Math.random() * 10) + 1
  });
});

app.get('/api/users', (req, res) => {
  getAllUsers((err, users) => {
    res.json(users);
  });
});

app.get('/api/user/:userId', (req, res) => {
  getUser(req.params.userId, (err, user) => {
    res.json(user);
  });
});

app.post('/api/user', (req, res) => {
  if (typeof(req.body.name) === "string") {
    createUser(req.body.name, (err, result) =>
      res.send({
        success: !!err,
        message: err || result,
      })
    );
  } else {
    res.send({
      success: false,
      message: 'Name is Required -- Failed to Add User',
    });
  }
});


app.post('/api/tournament', (req, res) => {
  console.log('req.body = ', req.body);
  if (typeof(req.body.name) === "string") {
    createTournament(req.body.name, (err, result) =>
      res.send({
        success: !err,
        message: err || result,
      })
    );
  } else {
    res.send({
      success: false,
      message: 'Name is Required -- Failed to Add tournament',
    });
  }
});

app.get('/api/tournament/:tournamentId' , (req, res) => {
  getTournament(req.params.tournamentId, (err, match) => {
    res.json(match);
  });
});

function getWinnerLoser(p1, p2) {
  if (parseInt(p1[1]) > parseInt(2[1])) {
    return [p1[0], p2[0]];
  } else {
    return [p2[0], p1[0]];
  }
}

/*
 * match should create a match
 * check the winner/loser
 * get updated elo. 
 * update each user with their updated elo.
 * insert a row in rating for each user.
 */
function completeMatch({ player_one_id, player_two_id, player_one_score, player_two_score, k_factor }) {
  /* only create ratings if createMatch was successful */
  if (!k_factor) {
    k_factor = 32;
  }

}

app.post('/api/match', (req, res) => {
  console.log(req.body);

  if (Object.keys(req.body).length > 0) {
    createMatch(req.body, (err, result) => {
      console.log(err);
      return res.send({
        success: !err,
        message: err || result,
      })
    });
  } else {
    return res.send({
        success: false,
        message: 'Missing Required Params -- Failed to update match',
    });
  }
});

app.get('/api/match/:matchId' , (req, res) => {
  getMatch(req.params.matchId, (err, match) => {
    res.json(match);
  });
});

app.put('/api/match/:matchId' , (req, res) => {
  if (req.params.matchId && Object.keys(req.body).length > 0) {
    updateMatch(req.params.matchId, (err, match) => {
      return res.json(match);
    });
  } else {
    return res.send({
      success: false,
      message: 'Match Id and Params are Required -- Failed to update match',
    });
  }
});



app.listen(HTTP_PORT);
console.log('Listening on port: ' + HTTP_PORT + ' -- Open http://localhost:' + HTTP_PORT);
