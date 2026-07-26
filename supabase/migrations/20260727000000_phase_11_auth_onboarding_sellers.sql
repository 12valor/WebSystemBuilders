begin;

-- Extend profiles table
alter table public.profiles
  add column if not exists email text,
  add column if not exists full_name text,
  add column if not exists username text unique,
  add column if not exists avatar_url text,
  add column if not exists country text,
  add column if not exists bio text,
  add column if not exists buyer_enabled boolean not null default true,
  add column if not exists seller_enabled boolean not null default false,
  add column if not exists seller_status text not null default 'none',
  add column if not exists interests text[] not null default '{}',
  add column if not exists onboarding_completed boolean not null default false;

-- Create seller_profiles table
create table if not exists public.seller_profiles (
  profile_id uuid primary key references public.profiles(user_id) on delete cascade,
  display_name text not null,
  bio text,
  country text,
  portfolio_url text,
  github_url text,
  linkedin_url text,
  banner_image_url text,
  gcash_qr_url text,
  qrph_image_url text,
  bank_details jsonb,
  status text not null default 'pending_review',
  admin_notes text,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  constraint seller_profiles_status_check check (status in ('pending_review', 'approved', 'rejected'))
);

-- Enable RLS on seller_profiles
alter table public.seller_profiles enable row level security;

-- Policies for seller_profiles
drop policy if exists "seller_profiles_select_own_or_admin" on public.seller_profiles;
create policy "seller_profiles_select_own_or_admin" on public.seller_profiles for select to authenticated
using (profile_id = (select auth.uid()) or private.has_admin_role('admin'));

drop policy if exists "seller_profiles_insert_own" on public.seller_profiles;
create policy "seller_profiles_insert_own" on public.seller_profiles for insert to authenticated
with check (profile_id = (select auth.uid()));

drop policy if exists "seller_profiles_update_own_or_admin" on public.seller_profiles;
create policy "seller_profiles_update_own_or_admin" on public.seller_profiles for update to authenticated
using (profile_id = (select auth.uid()) or private.has_admin_role('admin'))
with check (profile_id = (select auth.uid()) or private.has_admin_role('admin'));

-- Helper function to complete onboarding
create or replace function public.complete_user_onboarding(
  p_username text,
  p_country text,
  p_avatar_url text,
  p_interests text[]
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := (select auth.uid());
begin
  if v_user_id is null then raise exception 'Authentication required.' using errcode = '42501'; end if;

  update public.profiles
  set
    username = p_username,
    country = p_country,
    avatar_url = p_avatar_url,
    interests = p_interests,
    onboarding_completed = true,
    updated_at = now()
  where user_id = v_user_id;

  return true;
end;
$$;

-- Helper function to submit seller application
create or replace function public.submit_seller_application(
  p_display_name text,
  p_bio text,
  p_country text,
  p_portfolio_url text,
  p_github_url text,
  p_linkedin_url text,
  p_banner_image_url text,
  p_gcash_qr_url text,
  p_qrph_image_url text,
  p_bank_details jsonb
)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  v_user_id uuid := (select auth.uid());
begin
  if v_user_id is null then raise exception 'Authentication required.' using errcode = '42501'; end if;

  insert into public.seller_profiles (
    profile_id, display_name, bio, country, portfolio_url, github_url, linkedin_url,
    banner_image_url, gcash_qr_url, qrph_image_url, bank_details, status, submitted_at
  )
  values (
    v_user_id, p_display_name, p_bio, p_country, p_portfolio_url, p_github_url, p_linkedin_url,
    p_banner_image_url, p_gcash_qr_url, p_qrph_image_url, p_bank_details, 'pending_review', now()
  )
  on conflict (profile_id) do update
  set
    display_name = EXCLUDED.display_name,
    bio = EXCLUDED.bio,
    country = EXCLUDED.country,
    portfolio_url = EXCLUDED.portfolio_url,
    github_url = EXCLUDED.github_url,
    linkedin_url = EXCLUDED.linkedin_url,
    banner_image_url = EXCLUDED.banner_image_url,
    gcash_qr_url = EXCLUDED.gcash_qr_url,
    qrph_image_url = EXCLUDED.qrph_image_url,
    bank_details = EXCLUDED.bank_details,
    status = 'pending_review',
    submitted_at = now();

  update public.profiles
  set seller_status = 'pending_review', updated_at = now()
  where user_id = v_user_id;

  return true;
end;
$$;

-- Helper function for admin to review seller application
create or replace function public.review_seller_application(
  p_profile_id uuid,
  p_new_status text,
  p_admin_notes text default null
)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if not private.has_admin_role('admin') then
    raise exception 'Administrator permission required.' using errcode = '42501';
  end if;

  if p_new_status not in ('approved', 'rejected', 'pending_review') then
    raise exception 'Invalid status value.' using errcode = '22023';
  end if;

  update public.seller_profiles
  set status = p_new_status, admin_notes = p_admin_notes, reviewed_at = now()
  where profile_id = p_profile_id;

  update public.profiles
  set
    seller_status = p_new_status,
    seller_enabled = (p_new_status = 'approved'),
    updated_at = now()
  where user_id = p_profile_id;

  return true;
end;
$$;

revoke all on function public.complete_user_onboarding(text, text, text, text[]) from public;
revoke all on function public.submit_seller_application(text, text, text, text, text, text, text, text, text, jsonb) from public;
revoke all on function public.review_seller_application(uuid, text, text) from public;

grant execute on function public.complete_user_onboarding(text, text, text, text[]) to authenticated;
grant execute on function public.submit_seller_application(text, text, text, text, text, text, text, text, text, jsonb) to authenticated;
grant execute on function public.review_seller_application(uuid, text, text) to authenticated;

commit;
