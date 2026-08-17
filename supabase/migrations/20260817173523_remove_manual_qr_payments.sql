begin;

-- Retire all active manual-payment creation and review entry points. Existing
-- orders, payments, references, and proof objects remain intact for audit use.
drop function if exists public.create_authenticated_manual_order(uuid, uuid, text, text, text, text, text, text);
drop function if exists public.update_order_manual_status(uuid, public.order_status, text);

create or replace function private.reject_new_manual_payment()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.provider = 'manual' then
    raise exception 'Manual payments are retired.' using errcode = '22023';
  end if;
  return new;
end;
$$;

revoke all on function private.reject_new_manual_payment() from public, anon, authenticated;

drop trigger if exists payments_reject_new_manual on public.payments;
create trigger payments_reject_new_manual
before insert on public.payments
for each row execute function private.reject_new_manual_payment();

-- Remove active catalog and seller QR configuration without deleting immutable
-- migrations or historical payment records.
update public.systems
set payment_qr_url = null,
    payment_instructions = null
where payment_qr_url is not null
   or payment_instructions is not null;

alter table public.systems
  drop constraint if exists systems_manual_payment_retired,
  add constraint systems_manual_payment_retired
    check (payment_qr_url is null and payment_instructions is null);

update public.seller_profiles
set gcash_qr_url = null,
    qrph_image_url = null
where gcash_qr_url is not null
   or qrph_image_url is not null;

alter table public.seller_profiles
  drop constraint if exists seller_qr_payment_retired,
  add constraint seller_qr_payment_retired
    check (gcash_qr_url is null and qrph_image_url is null);

-- Replace the seller application RPC with a signature that has no QR inputs.
drop function if exists public.submit_seller_application(text, text, text, text, text, text, text, text, text, jsonb);

create function public.submit_seller_application(
  p_display_name text,
  p_bio text,
  p_country text,
  p_portfolio_url text,
  p_github_url text,
  p_linkedin_url text,
  p_banner_image_url text,
  p_bank_details jsonb
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := (select auth.uid());
begin
  if v_user_id is null then
    raise exception 'Authentication required.' using errcode = '42501';
  end if;

  insert into public.seller_profiles (
    profile_id, display_name, bio, country, portfolio_url, github_url,
    linkedin_url, banner_image_url, bank_details, status, submitted_at
  ) values (
    v_user_id, p_display_name, p_bio, p_country, p_portfolio_url, p_github_url,
    p_linkedin_url, p_banner_image_url, p_bank_details, 'pending_review', now()
  )
  on conflict (profile_id) do update
  set
    display_name = excluded.display_name,
    bio = excluded.bio,
    country = excluded.country,
    portfolio_url = excluded.portfolio_url,
    github_url = excluded.github_url,
    linkedin_url = excluded.linkedin_url,
    banner_image_url = excluded.banner_image_url,
    bank_details = excluded.bank_details,
    status = 'pending_review',
    submitted_at = now();

  update public.profiles
  set seller_status = 'pending_review', updated_at = now()
  where user_id = v_user_id;

  return true;
end;
$$;

revoke all on function public.submit_seller_application(text, text, text, text, text, text, text, jsonb) from public, anon;
grant execute on function public.submit_seller_application(text, text, text, text, text, text, text, jsonb) to authenticated, service_role;

-- Keep historical objects private and remove every browser-facing QR/proof ACL.
update storage.buckets set public = false where id in ('payment-proofs', 'payment-qrs');

drop policy if exists "Public payment proofs upload" on storage.objects;
drop policy if exists "Public payment proofs read" on storage.objects;
drop policy if exists "Customer payment proofs upload" on storage.objects;
drop policy if exists "Customer payment proofs read" on storage.objects;
drop policy if exists "Admin payment proofs read" on storage.objects;
drop policy if exists "Public payment QRs read" on storage.objects;
drop policy if exists "Admin payment QRs manage" on storage.objects;

commit;
