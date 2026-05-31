-- malcale-market schema
-- Run this in the Supabase SQL Editor (Project → SQL Editor → New query).
-- Re-running is safe — uses IF NOT EXISTS / DROP IF EXISTS.

-- Extensions ----------------------------------------------------------------
create extension if not exists "pgcrypto";

-- Enums ---------------------------------------------------------------------
do $$ begin
  create type category as enum ('women','men','kids','shoes','bags','accessories','home');
exception when duplicate_object then null; end $$;

do $$ begin
  create type condition as enum ('new','like_new','good','used');
exception when duplicate_object then null; end $$;

do $$ begin
  create type delivery as enum ('ship','pickup','both');
exception when duplicate_object then null; end $$;

do $$ begin
  create type listing_status as enum ('active','sold');
exception when duplicate_object then null; end $$;

do $$ begin
  create type payout_method as enum ('bank','paypal');
exception when duplicate_object then null; end $$;

-- profiles ------------------------------------------------------------------
-- Mirrors auth.users 1-to-1. Public-readable profile data lives here.
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  username      text unique not null,
  display_name  text not null,
  avatar_url    text,
  bio           text default '',
  rating        numeric(3,2) default 0 not null,
  review_count  integer default 0 not null,
  location      text default '',
  payout_method payout_method,
  payout_last4  text,
  payout_status text default 'none' not null check (payout_status in ('none','verified')),
  created_at    timestamptz default now() not null
);

create index if not exists profiles_username_idx on public.profiles (username);

-- listings ------------------------------------------------------------------
create table if not exists public.listings (
  id                uuid primary key default gen_random_uuid(),
  seller_id         uuid not null references public.profiles(id) on delete cascade,
  title             text not null check (char_length(title) between 3 and 80),
  description       text not null check (char_length(description) >= 10),
  price_cents       integer not null check (price_cents > 0),
  category          category not null,
  condition         condition not null,
  brand             text default '',
  size              text default '',
  status            listing_status default 'active' not null,
  delivery          delivery not null,
  pickup_location   text,
  likes             integer default 0 not null,
  created_at        timestamptz default now() not null
);

create index if not exists listings_seller_idx on public.listings (seller_id);
create index if not exists listings_category_idx on public.listings (category);
create index if not exists listings_created_at_idx on public.listings (created_at desc);

-- listing_images ------------------------------------------------------------
create table if not exists public.listing_images (
  id          uuid primary key default gen_random_uuid(),
  listing_id  uuid not null references public.listings(id) on delete cascade,
  url         text not null,
  sort_order  integer default 0 not null
);

create index if not exists listing_images_listing_idx on public.listing_images (listing_id, sort_order);

-- conversations + messages --------------------------------------------------
create table if not exists public.conversations (
  id               uuid primary key default gen_random_uuid(),
  listing_id       uuid not null references public.listings(id) on delete cascade,
  buyer_id         uuid not null references public.profiles(id) on delete cascade,
  seller_id        uuid not null references public.profiles(id) on delete cascade,
  created_at       timestamptz default now() not null,
  unique (listing_id, buyer_id, seller_id)
);

create index if not exists conversations_buyer_idx on public.conversations (buyer_id, created_at desc);
create index if not exists conversations_seller_idx on public.conversations (seller_id, created_at desc);

create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id       uuid not null references public.profiles(id) on delete cascade,
  body            text not null check (char_length(body) > 0),
  read_at         timestamptz,
  created_at      timestamptz default now() not null
);

create index if not exists messages_conv_idx on public.messages (conversation_id, created_at);

-- Trigger: auto-create a profile row when a user signs up ------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS -----------------------------------------------------------------------
alter table public.profiles        enable row level security;
alter table public.listings        enable row level security;
alter table public.listing_images  enable row level security;
alter table public.conversations   enable row level security;
alter table public.messages        enable row level security;

-- profiles: everyone can read; owner can update.
drop policy if exists "profiles_read_all"   on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_read_all"   on public.profiles for select using (true);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- listings: everyone can read active or own; owner can write/delete.
drop policy if exists "listings_read"    on public.listings;
drop policy if exists "listings_insert"  on public.listings;
drop policy if exists "listings_update"  on public.listings;
drop policy if exists "listings_delete"  on public.listings;
create policy "listings_read"   on public.listings for select using (
  status = 'active' or seller_id = auth.uid()
);
create policy "listings_insert" on public.listings for insert with check (seller_id = auth.uid());
create policy "listings_update" on public.listings for update using (seller_id = auth.uid());
create policy "listings_delete" on public.listings for delete using (seller_id = auth.uid());

-- listing_images: read with the listing; owner of listing can write.
drop policy if exists "images_read"   on public.listing_images;
drop policy if exists "images_write"  on public.listing_images;
create policy "images_read"  on public.listing_images for select using (
  exists (select 1 from public.listings l where l.id = listing_id and (l.status = 'active' or l.seller_id = auth.uid()))
);
create policy "images_write" on public.listing_images for all using (
  exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid())
) with check (
  exists (select 1 from public.listings l where l.id = listing_id and l.seller_id = auth.uid())
);

-- conversations + messages: only participants
drop policy if exists "conv_read"     on public.conversations;
drop policy if exists "conv_insert"   on public.conversations;
drop policy if exists "msg_read"      on public.messages;
drop policy if exists "msg_insert"    on public.messages;
create policy "conv_read"   on public.conversations for select using (auth.uid() in (buyer_id, seller_id));
create policy "conv_insert" on public.conversations for insert with check (auth.uid() = buyer_id);
create policy "msg_read"   on public.messages for select using (
  exists (select 1 from public.conversations c
          where c.id = conversation_id and auth.uid() in (c.buyer_id, c.seller_id))
);
create policy "msg_insert" on public.messages for insert with check (
  auth.uid() = sender_id and exists (
    select 1 from public.conversations c
    where c.id = conversation_id and auth.uid() in (c.buyer_id, c.seller_id)
  )
);

-- Storage bucket for listing photos ----------------------------------------
insert into storage.buckets (id, name, public)
values ('listing-images', 'listing-images', true)
on conflict (id) do nothing;

-- Anyone can read images; only authenticated users can upload to their own
-- folder (path prefix = user id).
drop policy if exists "listing_images_public_read"    on storage.objects;
drop policy if exists "listing_images_owner_write"    on storage.objects;
create policy "listing_images_public_read" on storage.objects for select
  using (bucket_id = 'listing-images');
create policy "listing_images_owner_write" on storage.objects for insert
  with check (
    bucket_id = 'listing-images'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
