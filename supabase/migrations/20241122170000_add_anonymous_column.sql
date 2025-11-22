-- Add anonymous column to websites table
-- This allows users to share their sites anonymously
-- Anonymous sites will have their domain blurred on the leaderboard

alter table public.websites
add column anonymous boolean default false not null;

-- Add index for potential filtering
create index idx_websites_anonymous on public.websites(anonymous);

-- Add comment
comment on column public.websites.anonymous is 'Whether this website is shared anonymously (domain will be blurred on leaderboard)';
