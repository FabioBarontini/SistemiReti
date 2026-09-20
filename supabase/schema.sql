-- SYNORA / DATABASE SCHEMA
-- Run in Supabase SQL Editor after creating the project.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Operatore',
  role text not null default 'student' check (role in ('student','teacher')),
  created_at timestamptz not null default now()
);

create table if not exists public.game_progress (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  current_room integer not null default 1 check (current_room between 1 and 8),
  completed_rooms integer not null default 0 check (completed_rooms between 0 and 8),
  hints_used integer not null default 0,
  errors integer not null default 0,
  updated_at timestamptz not null default now(),
  score integer not null default 0 check (score >= 0)
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  room_id integer not null check (room_id between 1 and 8),
  answer text,
  correct boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.room_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  room_id integer not null check (room_id between 1 and 8),
  status text not null default 'locked' check (status in ('locked','active','completed')),
  key_code text,
  score integer not null default 0 check (score >= 0),
  hints_used integer not null default 0,
  started_at timestamptz,
  completed_at timestamptz,
  primary key(user_id,room_id)
);

-- Safe migration for existing SYNORA installations
alter table public.game_progress add column if not exists score integer not null default 0;
alter table public.room_progress add column if not exists score integer not null default 0;
alter table public.room_progress add column if not exists started_at timestamptz;
alter table public.room_progress add column if not exists hints_used integer not null default 0;

alter table public.profiles enable row level security;
alter table public.game_progress enable row level security;
alter table public.attempts enable row level security;
alter table public.room_progress enable row level security;

create policy "profiles own row" on public.profiles for select using (auth.uid() = id);
create policy "progress own row" on public.game_progress for select using (auth.uid() = user_id);
create policy "attempts own rows" on public.attempts for select using (auth.uid() = user_id);
create policy "attempts own insert" on public.attempts for insert with check (auth.uid() = user_id);
create policy "rooms own rows" on public.room_progress for select using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id,display_name) values (new.id, coalesce(new.raw_user_meta_data->>'display_name','Operatore'));
  insert into public.game_progress(user_id) values (new.id);
  insert into public.room_progress(user_id,room_id,status) values (new.id,1,'active');
  insert into public.room_progress(user_id,room_id,status) select new.id,n,'locked' from generate_series(2,8) n;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.register_error(p_user_id uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() <> p_user_id then raise exception 'not allowed'; end if;
  update public.game_progress set errors=errors+1,updated_at=now() where user_id=p_user_id;
end; $$;

create or replace function public.complete_room(p_user_id uuid,p_room_id integer,p_key text)
returns integer language plpgsql security definer set search_path=public as $$
declare
  room_errors integer;
  room_hints integer;
  elapsed_seconds integer;
  room_score integer;
begin
  if auth.uid() <> p_user_id then raise exception 'not allowed'; end if;
  select count(*)::integer into room_errors from public.attempts where user_id=p_user_id and room_id=p_room_id and correct=false;
  select hints_used into room_hints from public.room_progress where user_id=p_user_id and room_id=p_room_id;
  select greatest(0,extract(epoch from (now()-started_at))::integer) into elapsed_seconds from public.room_progress where user_id=p_user_id and room_id=p_room_id;
  room_score := greatest(100,1000 - least(room_errors,10)*75 - least(coalesce(room_hints,0),5)*60 + greatest(0,250 - floor(elapsed_seconds/30)::integer*5));
  update public.room_progress set status='completed',key_code=p_key,score=room_score,completed_at=now() where user_id=p_user_id and room_id=p_room_id and status<>'completed';
  update public.game_progress set completed_rooms=least(completed_rooms+1,8),current_room=least(greatest(current_room,p_room_id+1),8),score=score+room_score,updated_at=now() where user_id=p_user_id;
  update public.room_progress set status='active',started_at=now() where user_id=p_user_id and room_id=p_room_id+1 and status='locked';
  return room_score;
end; $$;

create or replace function public.register_hint(p_user_id uuid,p_room_id integer)
returns void language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() <> p_user_id then raise exception 'not allowed'; end if;
  update public.game_progress set hints_used=hints_used+1,updated_at=now() where user_id=p_user_id;
  update public.room_progress set hints_used=hints_used+1 where user_id=p_user_id and room_id=p_room_id and status='active';
end; $$;

-- Live monitoring for the teacher Control Room.
-- Teachers can read the operational state of all students, while students
-- keep the existing own-row permissions.
create or replace function public.is_teacher()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'teacher'
  );
$$;

drop policy if exists "teachers can read profiles" on public.profiles;
create policy "teachers can read profiles" on public.profiles
for select using (auth.uid() = id or public.is_teacher());

drop policy if exists "teachers can read progress" on public.game_progress;
create policy "teachers can read progress" on public.game_progress
for select using (auth.uid() = user_id or public.is_teacher());

drop policy if exists "teachers can read room progress" on public.room_progress;
create policy "teachers can read room progress" on public.room_progress
for select using (auth.uid() = user_id or public.is_teacher());

-- Mark a district as active and start its server-side clock.
create or replace function public.start_room(p_user_id uuid, p_room_id integer)
returns void language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() <> p_user_id then raise exception 'not allowed'; end if;
  if p_room_id < 1 or p_room_id > 8 then raise exception 'invalid room'; end if;

  update public.room_progress
  set status='active', started_at=coalesce(started_at, now())
  where user_id=p_user_id and room_id=p_room_id
    and p_room_id <= (select current_room from public.game_progress where user_id=p_user_id)
    and status <> 'completed';

  update public.game_progress
  set updated_at=now()
  where user_id=p_user_id;
end; $$;

-- Lightweight heartbeat used while a student is working in a district.
create or replace function public.heartbeat(p_user_id uuid, p_room_id integer default null)
returns void language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() <> p_user_id then raise exception 'not allowed'; end if;

  update public.game_progress
  set updated_at=now()
  where user_id=p_user_id;

  if p_room_id is not null and p_room_id between 1 and 8 then
    update public.room_progress
    set started_at=coalesce(started_at, now())
    where user_id=p_user_id and room_id=p_room_id and status='active';
  end if;
end; $$;

