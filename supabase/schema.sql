-- NEBEIA / DATABASE SCHEMA
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
  updated_at timestamptz not null default now()
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
  completed_at timestamptz,
  primary key(user_id,room_id)
);

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

create or replace function public.complete_room(p_user_id uuid,p_room_id integer)
returns void language plpgsql security definer set search_path=public as $$
begin
  if auth.uid() <> p_user_id then raise exception 'not allowed'; end if;
  update public.room_progress set status='completed', key_code=case when p_room_id=1 then 'ENCAPSULATION' else key_code end, completed_at=now() where user_id=p_user_id and room_id=p_room_id;
  update public.game_progress set completed_rooms=least(completed_rooms+1,8),current_room=least(greatest(current_room,p_room_id+1),8),updated_at=now() where user_id=p_user_id;
  update public.room_progress set status='active' where user_id=p_user_id and room_id=p_room_id+1 and status='locked';
end; $$;

-- Fix typo-safe replacement: the previous statement intentionally has a leading 'a' only in this comment.


-- Teacher read access. Assign role='teacher' manually to the teacher account.
create policy "teachers read all progress" on public.game_progress for select using (exists (select 1 from public.profiles p where p.id=auth.uid() and p.role='teacher'));
