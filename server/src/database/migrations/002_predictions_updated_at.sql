DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM schema_migrations WHERE version = '002_predictions_updated_at'
  ) THEN

    ALTER TABLE predictions RENAME COLUMN created_at TO updated_at;

    CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;

    CREATE TRIGGER predictions_set_updated_at
    BEFORE UPDATE ON predictions
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

    INSERT INTO schema_migrations (version) VALUES ('002_predictions_updated_at');

  END IF;
END;
$$;