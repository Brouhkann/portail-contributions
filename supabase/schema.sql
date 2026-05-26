-- ============================================================
-- À coller dans : https://supabase.com/dashboard/project/skfvbefotsgtccxjjavb/sql/new
-- Puis cliquer sur "Run"
-- ============================================================

-- Table principale des contributions
CREATE TABLE IF NOT EXISTS contributions (
  id                UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  contributor_name  TEXT,
  contributor_phone TEXT,
  type_label        TEXT        NOT NULL,
  amount            INTEGER     NOT NULL CHECK (amount >= 1),
  payment_method    TEXT        NOT NULL CHECK (payment_method IN ('wave', 'mtn', 'orange')),
  proof_image_url   TEXT,
  status            TEXT        NOT NULL DEFAULT 'confirmed',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index pour les requêtes admin
CREATE INDEX IF NOT EXISTS idx_contributions_created_at     ON contributions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contributions_payment_method ON contributions(payment_method);
CREATE INDEX IF NOT EXISTS idx_contributions_type_label     ON contributions(type_label);
CREATE INDEX IF NOT EXISTS idx_contributions_phone          ON contributions(contributor_phone);

-- Sécurité : les contributeurs peuvent INSÉRER, pas lire les autres
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_insert" ON contributions
  FOR INSERT WITH CHECK (true);

-- L'admin lit via la clé service_role (bypass RLS automatique)
-- Aucune policy SELECT nécessaire pour les utilisateurs normaux
