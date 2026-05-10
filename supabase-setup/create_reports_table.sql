-- Suspicious activity reports
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_user_id uuid references auth.users(id) on delete set null,
  reporter_name text,
  reporter_phone text,
  shop_or_seller_name text not null,
  seller_phone text,
  item_name text,
  category text,
  description text not null,
  status text not null default 'open',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.reports enable row level security;

-- Anyone (anon + authenticated) can submit a report
drop policy if exists "Anyone can submit a report" on public.reports;
create policy "Anyone can submit a report"
  on public.reports for insert
  to anon, authenticated
  with check (true);

-- Reporters can view their own submissions
drop policy if exists "Users can view their own reports" on public.reports;
create policy "Users can view their own reports"
  on public.reports for select
  to authenticated
  using (auth.uid() = reporter_user_id);

-- Admins can view & manage all reports
drop policy if exists "Admins can view all reports" on public.reports;
create policy "Admins can view all reports"
  on public.reports for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can update reports" on public.reports;
create policy "Admins can update reports"
  on public.reports for update
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

drop policy if exists "Admins can delete reports" on public.reports;
create policy "Admins can delete reports"
  on public.reports for delete
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create index if not exists reports_created_at_idx on public.reports (created_at desc);
create index if not exists reports_status_idx on public.reports (status);
