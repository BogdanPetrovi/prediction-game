\ir setup.sql
\c predictions
\ir migrations/001_initial_schema.sql
\ir migrations/002_predictions_updated_at.sql
\ir migrations/003_users_username_changed_at.sql