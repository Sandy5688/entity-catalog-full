-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- ENTITY CATALOG
-- =========================
CREATE TABLE IF NOT EXISTS entity_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name text NOT NULL,
  slug text NOT NULL,
  entity_category text NOT NULL,
  primary_country text NOT NULL,
  primary_subregion text,
  website_url text,
  info_page_url text,
  contact_url text,
  contact_email text,
  source text NOT NULL DEFAULT 'manual',
  processing_notes jsonb,
  coverage_regions jsonb,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Unique constraint
CREATE UNIQUE INDEX IF NOT EXISTS idx_slug_country
ON entity_catalog (slug, primary_country);

-- =========================
-- METADATA CATALOG
-- =========================
CREATE TABLE IF NOT EXISTS metadata_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES entity_catalog(id) ON DELETE CASCADE,
  package_name text,
  package_key text,
  raw_data jsonb,
  features jsonb,
  source text,
  imported_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_metadata_entity
ON metadata_catalog (entity_id);

-- =========================
-- UPDATED_AT TRIGGER
-- =========================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_entity_updated_at
BEFORE UPDATE ON entity_catalog
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
