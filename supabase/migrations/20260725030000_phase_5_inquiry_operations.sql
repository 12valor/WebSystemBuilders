begin;

create table if not exists public.inquiry_events (
  id bigint generated always as identity primary key,
  inquiry_id uuid not null references public.inquiries(id) on delete cascade,
  actor_user_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  from_status public.inquiry_status,
  to_status public.inquiry_status,
  assigned_to uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint inquiry_events_type check (
    event_type in ('created', 'assigned', 'unassigned', 'status_changed')
  ),
  constraint inquiry_events_status_change check (
    (event_type = 'status_changed' and from_status is not null and to_status is not null)
    or (event_type <> 'status_changed' and from_status is null and to_status is null)
  )
);

create index if not exists inquiry_events_inquiry_created_idx
on public.inquiry_events(inquiry_id, created_at desc);

alter table public.inquiry_events enable row level security;

create policy "inquiry_events_select_admin"
on public.inquiry_events for select to authenticated
using (private.has_admin_role('admin'));

create or replace function private.record_inquiry_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.inquiry_events (inquiry_id, actor_user_id, event_type)
    values (new.id, (select auth.uid()), 'created');
    return new;
  end if;

  if old.assigned_to is distinct from new.assigned_to then
    insert into public.inquiry_events (
      inquiry_id,
      actor_user_id,
      event_type,
      assigned_to
    )
    values (
      new.id,
      (select auth.uid()),
      case when new.assigned_to is null then 'unassigned' else 'assigned' end,
      new.assigned_to
    );
  end if;

  if old.status is distinct from new.status then
    insert into public.inquiry_events (
      inquiry_id,
      actor_user_id,
      event_type,
      from_status,
      to_status
    )
    values (
      new.id,
      (select auth.uid()),
      'status_changed',
      old.status,
      new.status
    );
  end if;

  if old.assigned_to is distinct from new.assigned_to
    or old.status is distinct from new.status then
    insert into public.audit_logs (
      actor_user_id,
      action,
      target_table,
      target_id,
      metadata
    )
    values (
      (select auth.uid()),
      'inquiry.updated',
      'inquiries',
      new.id::text,
      jsonb_build_object(
        'status', new.status,
        'assigned', new.assigned_to is not null,
        'inquiry_type', new.inquiry_type
      )
    );
  end if;

  return new;
end;
$$;

revoke all on function private.record_inquiry_change() from public;

drop trigger if exists inquiries_record_change on public.inquiries;
create trigger inquiries_record_change
after insert or update on public.inquiries
for each row execute function private.record_inquiry_change();

comment on table public.inquiry_events is
  'Append-only operational history for administrator inquiry assignment and status changes.';

commit;
