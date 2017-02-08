use smash;

# Turn off FK Checks so we can drop cleanly
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS tournaments;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS bets;
DROP TABLE IF EXISTS ratings;

# But Turn them back on
SET FOREIGN_KEY_CHECKS = 1;

create table users (
  user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(80) UNIQUE,
  points INT
);


INSERT INTO users (name, points)
VALUES
  ('nick', '1000'), ('duane', '500');

create table tournaments (
  tournament_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name TEXT
);

create table matches (
  match_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tournament_id INT NOT NULL,
  status VARCHAR(80) NOT NULL,
  k_factor INT DEFAULT 1,
  player_one_id INT NOT NULL,
  player_two_id INT NOT NULL,
  player_one_score INT,
  player_two_score INT,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
  FOREIGN KEY (player_one_id) REFERENCES users(user_id),
  FOREIGN KEY (player_two_id) REFERENCES users(user_id)
);

create table bets (
  bet_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tournament_id INT NOT NULL,
  bettor_id INT NOT NULL,
  player_id INT NOT NULL,
  amount INT NOT NULL,
  FOREIGN KEY (tournament_id) REFERENCES tournaments(tournament_id),
  FOREIGN KEY (bettor_id) REFERENCES users(user_id),
  FOREIGN KEY (player_id) REFERENCES users(user_id)
);

create table ratings (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  last_match_played_id INT NOT NULL,
  rating INT NOT NULL,
  FOREIGN KEY (last_match_played_id) REFERENCES matches(match_id),
  FOREIGN KEY (player_id) REFERENCES users(user_id)
);
