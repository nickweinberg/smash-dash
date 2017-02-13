const bodyParser = require('body-parser');
const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
const HTTP_PORT = 3000;
// const db = require('./db');
const {
  createUser,
  completeMatch,
  getAllUsers,
  getUser,
  getUsers,
  updateUserRating
} = require('./users');
const { createTournament, getTournament, getAllTournaments } = require('./tournaments');
const { createMatch, getMatch, updateMatch } = require('./matches');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

app.engine('.hbs', exphbs({defaultLayout: 'main'}));
app.set('view engine', '.hbs');

app.get('/admin',
  (req, res, next) => {
    //Step 1: Get the Data
    getAllUsers((err, users) => {
      if (users) {
        // Attach the Data to the req object
        req.users = users;
        return next();
      }
    });
  },
  (req, res, next) => {
    //Step 1a: Get MOAR Data
    getAllTournaments((err, tournaments) => {
      if (tournaments) {
        // Attach the Data to the req object
        req.tournaments = tournaments;
        return next();
      }
    });
  },
  (req, res, next) => {
    // Step 2: Render the data and add the data to the
    res.render('admin', {
      data: {
        users: req.users,
        tournaments: req.tournaments,
      }
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
