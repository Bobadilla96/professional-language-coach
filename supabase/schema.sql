create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  name text not null,
  role text not null default 'learner' check (role in ('learner', 'mentor', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.learning_preferences (
  user_id uuid primary key references auth.users (id) on delete cascade,
  native_language text not null,
  target_language text not null,
  professional_track text not null default 'developer' check (professional_track in ('developer', 'writing', 'conversation')),
  learning_goal text not null default 'collaborate-at-work' check (learning_goal in ('collaborate-at-work', 'write-professionally', 'speak-confidently', 'understand-technical-docs', 'prepare-interviews')),
  target_course_id text not null default '',
  target_lesson_id text not null,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users (id) on delete cascade,
  progress jsonb not null,
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.course_enrollments (
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id text not null,
  enrolled_at timestamptz not null default timezone('utc', now()),
  status text not null default 'active' check (status in ('active', 'completed')),
  current_lesson_id text,
  progress_percent integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (user_id, course_id)
);

alter table public.learning_preferences
  add column if not exists professional_track text not null default 'developer';
alter table public.learning_preferences
  add column if not exists learning_goal text not null default 'collaborate-at-work';
alter table public.learning_preferences
  add column if not exists target_course_id text not null default '';

alter table public.profiles enable row level security;
alter table public.learning_preferences enable row level security;
alter table public.user_progress enable row level security;
alter table public.course_enrollments enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

drop policy if exists "preferences_select_own" on public.learning_preferences;
create policy "preferences_select_own" on public.learning_preferences for select using (auth.uid() = user_id);
drop policy if exists "preferences_insert_own" on public.learning_preferences;
create policy "preferences_insert_own" on public.learning_preferences for insert with check (auth.uid() = user_id);
drop policy if exists "preferences_update_own" on public.learning_preferences;
create policy "preferences_update_own" on public.learning_preferences for update using (auth.uid() = user_id);

drop policy if exists "progress_select_own" on public.user_progress;
create policy "progress_select_own" on public.user_progress for select using (auth.uid() = user_id);
drop policy if exists "progress_insert_own" on public.user_progress;
create policy "progress_insert_own" on public.user_progress for insert with check (auth.uid() = user_id);
drop policy if exists "progress_update_own" on public.user_progress;
create policy "progress_update_own" on public.user_progress for update using (auth.uid() = user_id);

drop policy if exists "course_enrollments_select_own" on public.course_enrollments;
create policy "course_enrollments_select_own" on public.course_enrollments for select using (auth.uid() = user_id);
drop policy if exists "course_enrollments_insert_own" on public.course_enrollments;
create policy "course_enrollments_insert_own" on public.course_enrollments for insert with check (auth.uid() = user_id);
drop policy if exists "course_enrollments_update_own" on public.course_enrollments;
create policy "course_enrollments_update_own" on public.course_enrollments for update using (auth.uid() = user_id);
drop policy if exists "course_enrollments_delete_own" on public.course_enrollments;
create policy "course_enrollments_delete_own" on public.course_enrollments for delete using (auth.uid() = user_id);

create or replace function public.set_timestamp()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role, created_at)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'learner'),
    coalesce(new.created_at, timezone('utc', now()))
  )
  on conflict (id) do update
    set email = excluded.email,
        name = excluded.name,
        role = excluded.role,
        updated_at = timezone('utc', now());

  return new;
end;
$$;

drop trigger if exists set_profiles_timestamp on public.profiles;
create trigger set_profiles_timestamp
before update on public.profiles
for each row execute procedure public.set_timestamp();

drop trigger if exists set_learning_preferences_timestamp on public.learning_preferences;
create trigger set_learning_preferences_timestamp
before update on public.learning_preferences
for each row execute procedure public.set_timestamp();

drop trigger if exists set_user_progress_timestamp on public.user_progress;
create trigger set_user_progress_timestamp
before update on public.user_progress
for each row execute procedure public.set_timestamp();

drop trigger if exists set_course_enrollments_timestamp on public.course_enrollments;
create trigger set_course_enrollments_timestamp
before update on public.course_enrollments
for each row execute procedure public.set_timestamp();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
