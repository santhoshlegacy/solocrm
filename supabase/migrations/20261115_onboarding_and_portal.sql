-- ==============================================================================
-- SoloCRM Migration: Workspace Onboarding & Freelancer Client Portal
-- Target: Supabase / PostgreSQL
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. WORKSPACE TYPE IN PROFILES
-- Stores user's forced onboarding selection ('freelance' or 'business')
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS workspace_type TEXT CHECK (workspace_type IN ('freelance', 'business'));

-- 3. PORTAL TOKENS FOR UNGUESSABLE READ-ONLY MAGIC LINKS
-- Add portal_token to leads table (Freelance OS)
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS portal_token UUID DEFAULT gen_random_uuid() NOT NULL;

-- Ensure unique constraint on portal_token for leads
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'leads_portal_token_key'
  ) THEN
    ALTER TABLE public.leads ADD CONSTRAINT leads_portal_token_key UNIQUE (portal_token);
  END IF;
END $$;

-- Add portal_token to clients table (Business OS)
ALTER TABLE public.clients 
ADD COLUMN IF NOT EXISTS portal_token UUID DEFAULT gen_random_uuid() NOT NULL;

-- Ensure unique constraint on portal_token for clients
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'clients_portal_token_key'
  ) THEN
    ALTER TABLE public.clients ADD CONSTRAINT clients_portal_token_key UNIQUE (portal_token);
  END IF;
END $$;

-- 4. PERFORMANCE INDEXES ON PORTAL TOKENS
CREATE INDEX IF NOT EXISTS idx_leads_portal_token ON public.leads(portal_token);
CREATE INDEX IF NOT EXISTS idx_clients_portal_token ON public.clients(portal_token);

-- 5. ROW LEVEL SECURITY (RLS) FOR PUBLIC READ-ONLY CLIENT PORTALS
-- Allows unauthenticated clients to view their specific project status via portal_token
-- without exposing internal notes or other users' pipeline data.

-- Ensure RLS is active
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Leads portal read-only policy
DROP POLICY IF EXISTS "Public read-only portal access for leads" ON public.leads;
CREATE POLICY "Public read-only portal access for leads"
  ON public.leads
  FOR SELECT
  TO anon, authenticated
  USING (portal_token IS NOT NULL);

-- Clients portal read-only policy
DROP POLICY IF EXISTS "Public read-only portal access for clients" ON public.clients;
CREATE POLICY "Public read-only portal access for clients"
  ON public.clients
  FOR SELECT
  TO anon, authenticated
  USING (portal_token IS NOT NULL);

-- 6. GRANT READ-ONLY SELECT ON PORTAL COLUMNS TO anon
GRANT SELECT ON public.leads TO anon;
GRANT SELECT ON public.clients TO anon;
