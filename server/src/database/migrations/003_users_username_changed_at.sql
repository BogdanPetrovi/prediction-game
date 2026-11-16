DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM schema_migrations WHERE version = '003_users_username_changed_at'
  ) THEN

    ALTER TABLE users ADD COLUMN username_changed_at TIMESTAMPTZ;

    INSERT INTO schema_migrations (version) VALUES ('003_users_username_changed_at');

  END IF;
END;
$$;
