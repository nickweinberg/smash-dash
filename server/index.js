const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const HTTP_PORT = 3000;
// const db = require('./db');
const { createUser, getAllUsers, getUser, getUsers, updateUserRating } = require('./users');
const { createTournament, getTournament } = require('./tournaments');
const { createMatch, getMatch, updateMatch } = require('./matches');
const { addRating } = require('./ratings');
const { getAllBets, createBet } = require('./bets')
const elo = require('./elo');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));


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


app.get('/api/bets', (req, res) => {
  getAllBets((err, bets) => {
    res.json(bets);
  })
})


app.post('/api/bet', (req, res) => {
  createBet(req.body.tournament_id, req.body.bettor_id, req.body.player_id,
            req.body.amount, (err, result)=> {
    res.send({
      success: !err,
      message: err || result,
    })
  })
})



function getWinnerLoser(p1, p2) {
  if (parseInt(p1[1]) > parseInt(p2[1])) {
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
 * ie.
 * completeMatch({player_one_id: 1, player_two_id: 2, player_one_score: 2, player_two_score: 1}, 1, null)
 */
function completeMatch({ player_one_id, player_two_id, player_one_score, player_two_score, k_factor }, matchId, cb) {
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


app.post('/api/match', (req, res) => {
  console.log(req.body);

  if (Object.keys(req.body).length > 0) {
    createMatch(req.body, (err, result) => {
      if(err) {
        console.err(err);
        return res.send({ success: false, message: 'all borked bro' });
      } else {
        completeMatch(req.body, result.insertId, (err, result) => {
          return res.send({
            success: !err,
            message: err || result,
          });
        });
      }
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

/* um does this even work? */
app.put('/api/match/:matchId' , (req, res) => {
  if (req.params.matchId && Object.keys(req.body).length > 0) {
    updateMatch(req.params.matchId, req.body, (err, match) => {
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
