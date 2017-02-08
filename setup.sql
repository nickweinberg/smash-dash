create table users (user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name VARCHAR(400) UNIQUE);
insert into users (name) values ('nick');
insert into users (name) values ('duane');

create table matches (
  match_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tournament_id INT NOT NULL,
  status VARCHAR(80) NOT NULL,
  player_one_id INT NOT NULL,
  player_two_id INT NOT NULL,
  player_one_score INT,
  player_two_score INT
);

create table tournaments (tournament_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, name TEXT);

create table bets (
  bet_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  tournament_id INT NOT NULL,
  bettor_id INT NOT NULL,
  player_id INT NOT NULL,
  amount INT NOT NULL
);

create table ratings (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  last_match_played_id INT NOT NULL
  rating INT NOT NULL
);

