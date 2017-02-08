const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const HTTP_PORT = 3000;
// const db = require('./db');
const users = require('./users');

app.use(bodyParser.json());
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
  users.getAllUsers((err, users) => {
    res.json(users);
  });
});

app.get('/api/user/:userId', (req, res) => {
  users.getUser(req.params.userId, (err, user) => {
    res.json(user);
  });
});

app.post('/api/user', (req, res) => {
  if (typeof(req.body.name) === "string") {
    users.createUser(req.body.name, (err, result) => {
      if (err) {
        return res.send({
          success: false,
          message: err,
        });
      }
      return res.send({
        success: true,
        message: result,
      });
    });
  } else {
    res.send({
      success: false,
      message: 'no new user dude',
    });
  }
});


app.listen(HTTP_PORT);
console.log('Listening on port: ' + HTTP_PORT + ' -- Open http://localhost:' + HTTP_PORT);
