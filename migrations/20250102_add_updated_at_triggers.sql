-- Trigger function to auto-update "updated_at" timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers to entity_catalog
DROP TRIGGER IF EXISTS set_entity_updated_at ON entity_catalog;
CREATE TRIGGER set_entity_updated_at
BEFORE UPDATE ON entity_catalog
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Add triggers to metadata_catalog
DROP TRIGGER IF EXISTS set_metadata_updated_at ON metadata_catalog;
CREATE TRIGGER set_metadata_updated_at
BEFORE UPDATE ON metadata_catalog
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
