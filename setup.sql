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
  rating INT,
  dubloons INT,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0
);



create table tournaments (
  tournament_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name TEXT
);

create table matches (
  match_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tournament_id INT NOT NULL,
  status VARCHAR(80),
  k_factor INT DEFAULT 32,
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
  match_id INT NOT NULL,
  rating INT NOT NULL,
  FOREIGN KEY (match_id) REFERENCES matches(match_id),
  FOREIGN KEY (player_id) REFERENCES users(user_id)
);


INSERT INTO users (name, dubloons, rating, wins, losses)
VALUES ('nick', '1000', '1200', 0, 0), ('duane', '500', '1200', 0, 0);
insert into tournaments (name) values ('1');
insert into matches (tournament_id, player_one_id, player_two_id, player_one_score, player_two_score)
values (1, 1, 2, 2, 1);

