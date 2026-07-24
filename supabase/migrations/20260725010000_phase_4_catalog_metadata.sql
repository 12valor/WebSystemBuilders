begin;

alter table public.systems
  add column if not exists technology_stack text[] not null default '{}',
  add column if not exists delivery_summary text,
  add column if not exists demo_instructions text,
  add column if not exists seo_title text,
  add column if not exists seo_description text;

alter table public.systems
  drop constraint if exists systems_technology_stack_count,
  drop constraint if exists systems_technology_stack_values,
  drop constraint if exists systems_delivery_summary_length,
  drop constraint if exists systems_demo_instructions_length,
  drop constraint if exists systems_seo_title_length,
  drop constraint if exists systems_seo_description_length;

alter table public.systems
  add constraint systems_technology_stack_count
    check (cardinality(technology_stack) <= 30),
  add constraint systems_technology_stack_values
    check (array_position(technology_stack, '') is null),
  add constraint systems_delivery_summary_length
    check (delivery_summary is null or char_length(delivery_summary) between 2 and 3000),
  add constraint systems_demo_instructions_length
    check (demo_instructions is null or char_length(demo_instructions) between 2 and 3000),
  add constraint systems_seo_title_length
    check (seo_title is null or char_length(seo_title) between 2 and 70),
  add constraint systems_seo_description_length
    check (seo_description is null or char_length(seo_description) between 10 and 180);

commit;