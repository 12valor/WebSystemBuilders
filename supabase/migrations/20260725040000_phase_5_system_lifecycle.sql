begin;

create or replace function private.audit_system_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
    values (
      (select auth.uid()),
      'system.created',
      'systems',
      new.id::text,
      jsonb_build_object('status', new.status, 'slug', new.slug)
    );
  else
    insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
    values (
      (select auth.uid()),
      case
        when old.status = 'published' and new.status = 'unlisted' then 'system.unpublished'
        when old.status <> 'archived' and new.status = 'archived' then 'system.archived'
        else 'system.updated'
      end,
      'systems',
      new.id::text,
      jsonb_build_object(
        'status', new.status,
        'previous_status', old.status,
        'slug', new.slug
      )
    );
  end if;

  return new;
end;
$$;

revoke all on function private.audit_system_change() from public;

create or replace function public.duplicate_system(p_system_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  source_system public.systems%rowtype;
  duplicated_system_id uuid;
  duplicated_slug text;
begin
  if not private.has_admin_role('admin') then
    raise exception 'Administrator access is required.' using errcode = '42501';
  end if;

  select * into source_system
  from public.systems
  where id = p_system_id;

  if not found then
    raise exception 'System record was not found.' using errcode = 'P0002';
  end if;

  duplicated_slug := left(source_system.slug, 80)
    || '-copy-'
    || left(gen_random_uuid()::text, 8);

  insert into public.systems (
    category_id,
    title,
    slug,
    summary,
    description,
    audience,
    product_type,
    pricing_type,
    price_minor,
    regular_price_minor,
    sale_price_minor,
    sale_active,
    currency,
    status,
    is_featured,
    requirements,
    inclusions,
    exclusions,
    technology_stack,
    delivery_summary,
    demo_instructions,
    license_summary,
    support_summary,
    seo_title,
    seo_description,
    published_at,
    created_by,
    updated_by
  )
  values (
    source_system.category_id,
    left(source_system.title, 153) || ' (Copy)',
    duplicated_slug,
    source_system.summary,
    source_system.description,
    source_system.audience,
    source_system.product_type,
    source_system.pricing_type,
    source_system.price_minor,
    source_system.regular_price_minor,
    source_system.sale_price_minor,
    false,
    source_system.currency,
    'draft',
    false,
    source_system.requirements,
    source_system.inclusions,
    source_system.exclusions,
    source_system.technology_stack,
    source_system.delivery_summary,
    source_system.demo_instructions,
    source_system.license_summary,
    source_system.support_summary,
    source_system.seo_title,
    source_system.seo_description,
    null,
    (select auth.uid()),
    (select auth.uid())
  )
  returning id into duplicated_system_id;

  insert into public.system_features (system_id, label, sort_order)
  select duplicated_system_id, label, sort_order
  from public.system_features
  where system_id = p_system_id;

  insert into public.system_media (
    system_id,
    media_type,
    external_url,
    alt_text,
    sort_order
  )
  select
    duplicated_system_id,
    media_type,
    external_url,
    alt_text,
    sort_order
  from public.system_media
  where system_id = p_system_id
    and storage_path is null
    and external_url is not null;

  insert into public.audit_logs (actor_user_id, action, target_table, target_id, metadata)
  values (
    (select auth.uid()),
    'system.duplicated',
    'systems',
    duplicated_system_id::text,
    jsonb_build_object(
      'status', 'draft',
      'slug', duplicated_slug,
      'source_system_id', p_system_id
    )
  );

  return duplicated_system_id;
end;
$$;

revoke all on function public.duplicate_system(uuid) from public;
grant execute on function public.duplicate_system(uuid) to authenticated;

comment on function public.duplicate_system(uuid) is
  'Creates a private draft from saved product content, features, and external media. Uploaded objects, versions, and deliverables are excluded.';

commit;
