CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(28) UNIQUE NOT NULL,
  discord_id BIGINT UNIQUE NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE events (
  id BIGINT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  logo VARCHAR(255) NOT NULL,
  start_date BIGINT,
  end_date BIGINT,
  is_active BOOLEAN,
  parent_event_id BIGINT REFERENCES events(id)
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

CREATE TABLE matches_points (
  match_id BIGINT UNIQUE NOT NULL REFERENCES matches(id),
  team1_points INT NOT NULL,
  team2_points INT NOT NULL
);

CREATE TABLE prizes (
  id SERIAL PRIMARY KEY,
  skin_name TEXT NOT NULL,
  skin_image TEXT NOT NULL,
  event_id BIGINT NOT NULL REFERENCES events(id),
  place SMALLINT CHECK (place IN (1, 2 ,3)) NOT NULL,
  UNIQUE(event_id, place)
);

INSERT INTO schema_migrations (version) VALUES ('001_initial_schema');