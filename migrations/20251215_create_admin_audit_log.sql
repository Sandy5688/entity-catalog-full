-- Migration: Create admin_audit_log table
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id text NOT NULL,
    action_type text NOT NULL,
    entity_ids jsonb NOT NULL,
    details jsonb,
    created_at timestamptz DEFAULT now()
);

-- Optional index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin_id
ON admin_audit_log (admin_id);
