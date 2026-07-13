-- AçıkPazar Supabase üretim şeması
-- Supabase Dashboard > SQL Editor > New query içine tamamını yapıştırıp RUN tuşuna basın.

create extension if not exists "pgcrypto";

do $$ begin
  create type public.auction_status as enum ('draft', 'active', 'ended', 'cancelled', 'sold');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.product_condition as enum ('Sıfır', 'Çok iyi', 'İyi', 'Orta');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('pending', 'authorized', 'held', 'released', 'refunded', 'failed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.shipment_status as enum ('waiting', 'prepared', 'shipped', 'delivered', 'approved', 'disputed');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  username text unique,
  city text,
  avatar_url text,
  identity_verified boolean not null default false,
  phone_verified boolean not null default false,
  seller_rating numeric(3,2) not null default 0,
  completed_sales integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.private_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  phone text,
  address_text text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.auctions (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 5 and 120),
  category text not null,
  description text not null,
  condition public.product_condition not null,
  starting_bid numeric(12,2) not null check (starting_bid > 0),
  current_bid numeric(12,2) not null check (current_bid > 0),
  reserve_price numeric(12,2) not null check (reserve_price > 0),
  min_increment numeric(12,2) not null check (min_increment > 0),
  ends_at timestamptz not null,
  status public.auction_status not null default 'draft',
  city text not null,
  shipping_method text not null default 'Param Güvende Kargo',
  payment_hold boolean not null default true,
  winner_id uuid references public.profiles(id) on delete set null,
  bid_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (reserve_price >= starting_bid)
);

create table if not exists public.auction_images (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  storage_path text not null,
  sort_order smallint not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.bids (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null references public.auctions(id) on delete cascade,
  bidder_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  user_id uuid not null references public.profiles(id) on delete cascade,
  auction_id uuid not null references public.auctions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, auction_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  auction_id uuid references public.auctions(id) on delete cascade,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null unique references public.auctions(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  seller_id uuid not null references public.profiles(id) on delete restrict,
  amount numeric(12,2) not null check (amount > 0),
  commission_amount numeric(12,2) not null default 0,
  status public.payment_status not null default 'pending',
  provider text,
  provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.shipments (
  id uuid primary key default gen_random_uuid(),
  auction_id uuid not null unique references public.auctions(id) on delete cascade,
  buyer_id uuid not null references public.profiles(id) on delete restrict,
  seller_id uuid not null references public.profiles(id) on delete restrict,
  carrier text,
  tracking_number text,
  status public.shipment_status not null default 'waiting',
  shipped_at timestamptz,
  delivered_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists auctions_status_ends_at_idx on public.auctions(status, ends_at);
create index if not exists auctions_category_idx on public.auctions(category);
create index if not exists auctions_seller_id_idx on public.auctions(seller_id);
create index if not exists bids_auction_amount_idx on public.bids(auction_id, amount desc);
create index if not exists bids_bidder_id_idx on public.bids(bidder_id);
create index if not exists notifications_user_created_idx on public.notifications(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists private_profiles_updated_at on public.private_profiles;
create trigger private_profiles_updated_at before update on public.private_profiles for each row execute function public.set_updated_at();
drop trigger if exists auctions_updated_at on public.auctions;
create trigger auctions_updated_at before update on public.auctions for each row execute function public.set_updated_at();
drop trigger if exists payments_updated_at on public.payments;
create trigger payments_updated_at before update on public.payments for each row execute function public.set_updated_at();
drop trigger if exists shipments_updated_at on public.shipments;
create trigger shipments_updated_at before update on public.shipments for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, username)
  values (
    new.id,
    coalesce(nullif(new.raw_user_meta_data ->> 'full_name', ''), split_part(coalesce(new.email, 'Kullanıcı'), '@', 1)),
    nullif(new.raw_user_meta_data ->> 'username', '')
  )
  on conflict (id) do nothing;

  insert into public.private_profiles (id, phone)
  values (new.id, nullif(new.phone, ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.place_bid(p_auction_id uuid, p_amount numeric)
returns public.auctions
language plpgsql
security definer
set search_path = public
as $$
declare
  v_auction public.auctions;
  v_old_leader uuid;
begin
  if auth.uid() is null then raise exception 'Oturum açmanız gerekiyor'; end if;

  select * into v_auction
  from public.auctions
  where id = p_auction_id
  for update;

  if v_auction.id is null then raise exception 'İlan bulunamadı'; end if;
  if v_auction.status <> 'active' then raise exception 'Açık artırma aktif değil'; end if;
  if v_auction.ends_at <= now() then raise exception 'Açık artırma sona erdi'; end if;
  if v_auction.seller_id = auth.uid() then raise exception 'Kendi ilanınıza teklif veremezsiniz'; end if;
  if p_amount < v_auction.current_bid + v_auction.min_increment then
    raise exception 'Teklif minimum artış tutarının altında';
  end if;

  select bidder_id into v_old_leader
  from public.bids
  where auction_id = p_auction_id
  order by amount desc, created_at asc
  limit 1;

  insert into public.bids (auction_id, bidder_id, amount)
  values (p_auction_id, auth.uid(), p_amount);

  update public.auctions
  set current_bid = p_amount,
      bid_count = bid_count + 1,
      ends_at = case when ends_at <= now() + interval '2 minutes' then now() + interval '2 minutes' else ends_at end
  where id = p_auction_id
  returning * into v_auction;

  insert into public.notifications (user_id, auction_id, title, body)
  values (auth.uid(), p_auction_id, 'Teklifiniz alındı', v_auction.title || ' için teklifiniz kaydedildi.');

  if v_old_leader is not null and v_old_leader <> auth.uid() then
    insert into public.notifications (user_id, auction_id, title, body)
    values (v_old_leader, p_auction_id, 'Teklifiniz geçildi', v_auction.title || ' ilanında daha yüksek teklif verildi.');
  end if;

  return v_auction;
end;
$$;

alter table public.profiles enable row level security;
alter table public.private_profiles enable row level security;
alter table public.auctions enable row level security;
alter table public.auction_images enable row level security;
alter table public.bids enable row level security;
alter table public.favorites enable row level security;
alter table public.notifications enable row level security;
alter table public.payments enable row level security;
alter table public.shipments enable row level security;

drop policy if exists "profiles public read" on public.profiles;
create policy "profiles public read" on public.profiles for select using (true);
drop policy if exists "profile owner update" on public.profiles;
create policy "profile owner update" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "private profile owner read" on public.private_profiles;
create policy "private profile owner read" on public.private_profiles for select using (auth.uid() = id);
drop policy if exists "private profile owner update" on public.private_profiles;
create policy "private profile owner update" on public.private_profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "active auctions public read" on public.auctions;
create policy "active auctions public read" on public.auctions for select using (status in ('active','ended','sold') or seller_id = auth.uid());
drop policy if exists "seller creates auction" on public.auctions;
create policy "seller creates auction" on public.auctions for insert with check (seller_id = auth.uid());
drop policy if exists "seller updates own draft" on public.auctions;
create policy "seller updates own draft" on public.auctions for update using (seller_id = auth.uid() and status = 'draft') with check (seller_id = auth.uid() and status = 'draft');

drop policy if exists "auction images public read" on public.auction_images;
create policy "auction images public read" on public.auction_images for select using (true);
drop policy if exists "seller uploads auction images" on public.auction_images;
create policy "seller uploads auction images" on public.auction_images for insert with check (exists(select 1 from public.auctions a where a.id = auction_id and a.seller_id = auth.uid()));
drop policy if exists "seller deletes auction images" on public.auction_images;
create policy "seller deletes auction images" on public.auction_images for delete using (exists(select 1 from public.auctions a where a.id = auction_id and a.seller_id = auth.uid()));

drop policy if exists "bids public read" on public.bids;
create policy "bids public read" on public.bids for select using (true);

drop policy if exists "favorites owner read" on public.favorites;
create policy "favorites owner read" on public.favorites for select using (user_id = auth.uid());
drop policy if exists "favorites owner insert" on public.favorites;
create policy "favorites owner insert" on public.favorites for insert with check (user_id = auth.uid());
drop policy if exists "favorites owner delete" on public.favorites;
create policy "favorites owner delete" on public.favorites for delete using (user_id = auth.uid());

drop policy if exists "notifications owner read" on public.notifications;
create policy "notifications owner read" on public.notifications for select using (user_id = auth.uid());
drop policy if exists "notifications owner update" on public.notifications;
create policy "notifications owner update" on public.notifications for update using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "payment parties read" on public.payments;
create policy "payment parties read" on public.payments for select using (buyer_id = auth.uid() or seller_id = auth.uid());
drop policy if exists "shipment parties read" on public.shipments;
create policy "shipment parties read" on public.shipments for select using (buyer_id = auth.uid() or seller_id = auth.uid());

grant usage on schema public to anon, authenticated;
grant select on public.profiles, public.auctions, public.auction_images, public.bids to anon, authenticated;
grant select, update on public.private_profiles to authenticated;
grant insert on public.auctions, public.auction_images, public.favorites to authenticated;
grant select, delete on public.favorites to authenticated;
grant select, update on public.notifications to authenticated;
grant select on public.payments, public.shipments to authenticated;
grant execute on function public.place_bid(uuid, numeric) to authenticated;

-- Ürün fotoğrafı deposu
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('auction-images', 'auction-images', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "auction image public read" on storage.objects;
create policy "auction image public read" on storage.objects for select using (bucket_id = 'auction-images');
drop policy if exists "user uploads own auction images" on storage.objects;
create policy "user uploads own auction images" on storage.objects for insert to authenticated with check (bucket_id = 'auction-images' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "user updates own auction images" on storage.objects;
create policy "user updates own auction images" on storage.objects for update to authenticated using (bucket_id = 'auction-images' and (storage.foldername(name))[1] = auth.uid()::text) with check (bucket_id = 'auction-images' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "user deletes own auction images" on storage.objects;
create policy "user deletes own auction images" on storage.objects for delete to authenticated using (bucket_id = 'auction-images' and (storage.foldername(name))[1] = auth.uid()::text);

-- Canlı teklif ve bildirim güncellemeleri
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'auctions') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.auctions';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'bids') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.bids';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'notifications') THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications';
  END IF;
END $$;
