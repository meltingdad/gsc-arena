-- Add anonymous column to websites table
-- This allows users to share their sites anonymously
-- For privacy, anonymous sites store a UUID in domain/site_url fields instead of real values
-- This ensures the real domain is never stored in the database for anonymous submissions

alter table public.websites
add column anonymous boolean default false not null;

-- Add original_site_url for matching/removal purposes
-- This is stored even for anonymous sites to enable the user to remove their own submissions
-- It's not exposed in public APIs, only used for ownership verification
alter table public.websites
add column original_site_url text;

-- Add index for potential filtering
create index idx_websites_anonymous on public.websites(anonymous);

-- Add index for original_site_url lookups (used for removal)
create index idx_websites_original_site_url on public.websites(original_site_url);

-- Add comments
comment on column public.websites.anonymous is 'Whether this website is shared anonymously (domain/site_url will contain UUID instead of real values)';
comment on column public.websites.original_site_url is 'Original GSC site URL - used for matching and removal, even for anonymous submissions';
