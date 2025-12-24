CREATE DATABASE predictions;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  discord TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id BIGINT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  logo VARCHAR(255) NOT NULL,
  start_date BIGINT,
  end_date BIGINT
  is_active BOOLEAN
);

CREATE TYPE team_info AS (
  name VARCHAR(100),
  logo VARCHAR(255)
);

CREATE TABLE matches (
  id BIGINT PRIMARY KEY,
  team1 team_info NOT NULL,
  team2 team_info NOT NULL,
  event_id INT REFERENCES events(id),
  date BIGINT,
  format TEXT,
  winner_team TEXT,
  result VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE predictions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  match_id INT REFERENCES matches(id),
  predicted_winner VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, match_id)
);

CREATE TABLE leaderboards (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  event_id INT REFERENCES events(id),
  points INT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, event_id)
);