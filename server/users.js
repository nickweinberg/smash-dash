const Q = require('./query');

const DEFAULT_DUBLOON_AMOUNT = 100;

/* == usage example ==
getAllUsers(null, (err, result) => {
  if (err)
    return err;

  console.log(result);
}
*/

module.exports = {
  getAllUsers:  Q(`SELECT * FROM users`),
  getUser: Q(`SELECT * FROM users WHERE user_id = ?`),
  createUser: Q(`
      INSERT INTO users (name, dubloons)
      VALUES (?, ${ DEFAULT_DUBLOON_AMOUNT })
    `),
}
