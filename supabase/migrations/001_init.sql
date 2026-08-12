-- Burton's Reliable HVAC platform schema
-- Run in the Supabase SQL editor (or via supabase db push).

create extension if not exists "uuid-ossp";

-- ============ roles / users ============
create type admin_role as enum ('SUPER_ADMIN', 'ADMIN', 'STAFF');

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role admin_role not null default 'STAFF',
  created_at timestamptz not null default now()
);

-- ============ core tables ============
create type booking_status as enum ('NEW','CONFIRMED','SCHEDULED','IN_PROGRESS','COMPLETED','CANCELLED');
create type lead_status as enum ('NEW','CONTACTED','QUALIFIED','BOOKED','COMPLETED','LOST');
create type convo_status as enum ('OPEN','IN_PROGRESS','RESOLVED');
create type urgency_level as enum ('ROUTINE','SOON','URGENT','EMERGENCY');
create type property_kind as enum ('RESIDENTIAL','COMMERCIAL');

create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text,
  address text,
  created_at timestamptz not null default now()
);

create table public.technicians (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  short text,
  headline text,
  description text,
  bullets jsonb default '[]',
  icon text,
  sort int default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default uuid_generate_v4(),
  booking_ref text unique not null,
  customer_name text not null,
  phone text not null,
  email text not null,
  address text not null,
  service text not null,
  description text default '',
  preferred_date date,
  preferred_time text default '',
  urgency urgency_level not null default 'ROUTINE',
  property_type property_kind not null default 'RESIDENTIAL',
  notes text default '',
  photo_name text,
  status booking_status not null default 'NEW',
  technician text,
  internal_notes jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text not null,
  email text,
  address text,
  service text,
  source text not null default 'Website',
  status lead_status not null default 'NEW',
  notes jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null default 'Website visitor',
  customer_contact text default '',
  status convo_status not null default 'OPEN',
  assigned_to text,
  needs_human boolean not null default false,
  unread_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender text not null check (sender in ('customer','bot','admin')),
  text text not null,
  created_at timestamptz not null default now()
);

create table public.knowledge_base (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null default 'FAQ',
  content text not null,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default uuid_generate_v4(),
  question text not null,
  answer text not null,
  sort int default 0,
  active boolean not null default true
);

create table public.business_hours (
  id uuid primary key default uuid_generate_v4(),
  days text not null,
  hours text not null,
  sort int default 0
);

create table public.service_areas (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  active boolean not null default true
);

create table public.notifications (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  body text not null,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.site_content (
  id text primary key,
  content jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table public.settings (
  key text primary key,
  value jsonb not null default '{}'
);

-- indexes
create index bookings_status_idx on public.bookings(status);
create index bookings_date_idx on public.bookings(preferred_date);
create index leads_status_idx on public.leads(status);
create index messages_convo_idx on public.messages(conversation_id, created_at);

-- ============ helper ============
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.users where id = auth.uid());
$$;

-- ============ row level security ============
alter table public.users enable row level security;
alter table public.customers enable row level security;
alter table public.technicians enable row level security;
alter table public.services enable row level security;
alter table public.bookings enable row level security;
alter table public.leads enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.knowledge_base enable row level security;
alter table public.faqs enable row level security;
alter table public.business_hours enable row level security;
alter table public.service_areas enable row level security;
alter table public.notifications enable row level security;
alter table public.site_content enable row level security;
alter table public.settings enable row level security;

-- Admins: full access to operational tables
create policy admin_all_users on public.users for all using (public.is_admin());
create policy admin_all_customers on public.customers for all using (public.is_admin());
create policy admin_all_technicians on public.technicians for all using (public.is_admin());
create policy admin_all_bookings on public.bookings for all using (public.is_admin());
create policy admin_all_leads on public.leads for all using (public.is_admin());
create policy admin_all_convos on public.conversations for all using (public.is_admin());
create policy admin_all_messages on public.messages for all using (public.is_admin());
create policy admin_all_kb on public.knowledge_base for all using (public.is_admin());
create policy admin_all_faqs on public.faqs for all using (public.is_admin());
create policy admin_all_hours on public.business_hours for all using (public.is_admin());
create policy admin_all_areas on public.service_areas for all using (public.is_admin());
create policy admin_all_notifications on public.notifications for all using (public.is_admin());
create policy admin_all_content on public.site_content for all using (public.is_admin());
create policy admin_all_services on public.services for all using (public.is_admin());
create policy admin_super_settings on public.settings for all using (
  exists (select 1 from public.users where id = auth.uid() and role = 'SUPER_ADMIN')
);

-- Anonymous visitors: may create bookings/leads/conversations/messages/notifications (write-only)
create policy anon_insert_bookings on public.bookings for insert to anon with check (true);
create policy anon_insert_leads on public.leads for insert to anon with check (true);
create policy anon_insert_convos on public.conversations for insert to anon with check (true);
create policy anon_update_convos on public.conversations for update to anon using (true);
create policy anon_insert_messages on public.messages for insert to anon with check (true);
create policy anon_select_messages on public.messages for select to anon using (true);
create policy anon_insert_notifications on public.notifications for insert to anon with check (true);

-- Anonymous visitors: may read public content
create policy anon_read_services on public.services for select to anon using (active);
create policy anon_read_kb on public.knowledge_base for select to anon using (published);
create policy anon_read_faqs on public.faqs for select to anon using (active);
create policy anon_read_hours on public.business_hours for select to anon using (true);
create policy anon_read_areas on public.service_areas for select to anon using (active);
create policy anon_read_content on public.site_content for select to anon using (true);

-- NOTE: for stricter production hardening, move anonymous chat reads behind
-- a per-conversation token (edge function) so visitors can only read their own
-- conversation. Rate-limit anon inserts with Supabase Edge Functions or a WAF.

-- realtime
alter publication supabase_realtime add table public.bookings;
alter publication supabase_realtime add table public.leads;
alter publication supabase_realtime add table public.conversations;
alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;
alter publication supabase_realtime add table public.knowledge_base;

-- seed hours
insert into public.business_hours (days, hours, sort) values
  ('Monday – Friday', '8:00 AM – 6:00 PM', 1),
  ('Saturday', '7:00 AM – 12:00 PM', 2),
  ('Sunday', 'Closed', 3);

insert into public.service_areas (name) values ('Baton Rouge'), ('Surrounding areas');
