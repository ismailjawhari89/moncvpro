-- Create a table for Public Profiles (optional, but good practice)
create table public.profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  full_name text,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a table for CVs
create table public.cvs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text default 'Mon CV',
  data jsonb not null, -- Stores the entire CV JSON object
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for CVs
alter table public.cvs enable row level security;

create policy "Users can view their own CVs."
  on cvs for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own CVs."
  on cvs for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own CVs."
  on cvs for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own CVs."
  on cvs for delete
  using ( auth.uid() = user_id );

-- Function to handle new user signup (automatically create profile)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
