-- ==============================================================================
-- SoloCRM: Supabase PostgreSQL Dual-Mode Database Schema & Security Architecture
-- ==============================================================================

-- 1. ENUMS
create type public.workspace_mode as enum ('freelancer', 'business');

-- 2. PROFILES TABLE
-- Storing verified solo operator identity, active workspace mode, and billing profile
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null,
  current_mode public.workspace_mode not null default 'freelancer',
  role text default 'Sr Designer & Dev',
  business_entity text default 'SoloStudio Creative LLC',
  avatar_url text,
  timezone text default 'PST',
  bio text,
  base_currency text default 'USD',
  hourly_rate numeric default 175.00,
  target_velocity numeric default 114,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. FREELANCER MODE: LEADS TABLE
-- Pipeline Kanban deals, pitch stages, valuations, and contract milestones
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  project_details text not null,
  contact_name text,
  status text not null check (status in ('Contacted', 'Pitched', 'Won', 'Lost')),
  value numeric not null default 0.00,
  tags text[] default array[]::text[],
  initials text,
  progress integer default 0,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 4. FREELANCER MODE: CONNECTIONS TABLE
-- Networking rolodex, platform tags, last contact date, and outreach notes
create table if not exists public.connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  contact_name text not null,
  network_platform text,
  last_contacted timestamptz,
  notes text,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 5. BUSINESS MODE: CLIENTS TABLE
-- B2B client accounts, lifetime value (LTV), retention status, and onboarding date
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  company_name text not null,
  ltv numeric default 0.00,
  status text not null check (status in ('Active', 'Churned')),
  joined_at timestamptz default timezone('utc'::text, now()) not null,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 6. BUSINESS MODE: SALES TABLE
-- Closed deals, revenue events, invoice payment statuses, and date tracking
create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  client_id uuid references public.clients(id) on delete cascade,
  amount numeric not null default 0.00,
  date timestamptz default timezone('utc'::text, now()) not null,
  invoice_status text not null check (invoice_status in ('Paid', 'Pending', 'Overdue')),
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- 7. TRANSACTIONS TABLE
-- Invoices, multi-currency retainers, deposits, and billable maturity
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  invoice_number text not null,
  client text not null,
  description text,
  amount numeric not null default 0.00,
  date date default current_date not null,
  due_date date,
  status text not null check (status in ('paid', 'pending', 'overdue')),
  type text default 'milestone',
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Strict Isolation: Authenticated users can ONLY query and mutate their own rows
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.connections enable row level security;
alter table public.clients enable row level security;
alter table public.sales enable row level security;
alter table public.transactions enable row level security;

-- ------------------------------------------------------------------------------
-- Profiles Policies (auth.uid() = id)
-- ------------------------------------------------------------------------------
create policy "Users can view own profile"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "Users can delete own profile"
  on public.profiles for delete
  to authenticated
  using (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- Leads Policies (auth.uid() = user_id)
-- ------------------------------------------------------------------------------
create policy "Users can view own leads"
  on public.leads for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own leads"
  on public.leads for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own leads"
  on public.leads for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own leads"
  on public.leads for delete
  to authenticated
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Connections Policies (auth.uid() = user_id)
-- ------------------------------------------------------------------------------
create policy "Users can view own connections"
  on public.connections for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own connections"
  on public.connections for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own connections"
  on public.connections for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own connections"
  on public.connections for delete
  to authenticated
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Clients Policies (auth.uid() = user_id)
-- ------------------------------------------------------------------------------
create policy "Users can view own clients"
  on public.clients for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own clients"
  on public.clients for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own clients"
  on public.clients for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own clients"
  on public.clients for delete
  to authenticated
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Sales Policies (auth.uid() = user_id)
-- ------------------------------------------------------------------------------
create policy "Users can view own sales"
  on public.sales for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own sales"
  on public.sales for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own sales"
  on public.sales for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own sales"
  on public.sales for delete
  to authenticated
  using (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- Transactions Policies (auth.uid() = user_id)
-- ------------------------------------------------------------------------------
create policy "Users can view own transactions"
  on public.transactions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own transactions"
  on public.transactions for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own transactions"
  on public.transactions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own transactions"
  on public.transactions for delete
  to authenticated
  using (auth.uid() = user_id);

-- ==============================================================================
-- REALTIME SUBSCRIPTIONS
-- ==============================================================================
alter publication supabase_realtime add table public.leads;
alter publication supabase_realtime add table public.connections;
alter publication supabase_realtime add table public.clients;
alter publication supabase_realtime add table public.sales;
alter publication supabase_realtime add table public.transactions;
