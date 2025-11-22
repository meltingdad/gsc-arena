-- Add daily_metrics table for time-series data
-- Stores daily Google Search Console metrics for the last 12 months
-- Enables historical trend analysis and charts

create table if not exists public.daily_metrics (
  id uuid primary key default gen_random_uuid(),
  website_id uuid references public.websites(id) on delete cascade not null,
  date date not null,
  clicks integer default 0 not null,
  impressions integer default 0 not null,
  ctr decimal(5,2) default 0 not null,
  position decimal(5,2) default 0 not null,
  created_at timestamp with time zone default now() not null,

  -- Ensure one record per website per date
  unique(website_id, date)
);

-- Create indexes for better query performance
create index if not exists idx_daily_metrics_website_id on public.daily_metrics(website_id);
create index if not exists idx_daily_metrics_date on public.daily_metrics(date desc);
create index if not exists idx_daily_metrics_website_date on public.daily_metrics(website_id, date desc);

-- Enable Row Level Security
alter table public.daily_metrics enable row level security;

-- RLS Policies for daily_metrics
create policy "Users can view daily metrics for all websites"
  on public.daily_metrics for select
  using (true);

create policy "Users can insert daily metrics for their own websites"
  on public.daily_metrics for insert
  with check (
    exists (
      select 1 from public.websites
      where websites.id = daily_metrics.website_id
      and websites.user_id = auth.uid()
    )
  );

create policy "Users can update daily metrics for their own websites"
  on public.daily_metrics for update
  using (
    exists (
      select 1 from public.websites
      where websites.id = daily_metrics.website_id
      and websites.user_id = auth.uid()
    )
  );

create policy "Users can delete daily metrics for their own websites"
  on public.daily_metrics for delete
  using (
    exists (
      select 1 from public.websites
      where websites.id = daily_metrics.website_id
      and websites.user_id = auth.uid()
    )
  );

-- Add comment
comment on table public.daily_metrics is 'Daily time-series metrics from Google Search Console for the last 12 months';
