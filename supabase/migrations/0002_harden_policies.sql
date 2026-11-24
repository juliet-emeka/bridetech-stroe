do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname, tablename
    from pg_policies
    where schemaname = 'public'
      and tablename in (
        'profiles', 'categories', 'products', 'orders',
        'order_items', 'promotions', 'reviews'
      )
  loop
    execute format(
      'drop policy %I on public.%I',
      policy_record.policyname,
      policy_record.tablename
    );
  end loop;
end $$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.promotions enable row level security;
alter table public.reviews enable row level security;

create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

create policy profiles_admin_all on public.profiles
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy categories_public_read on public.categories
  for select to anon, authenticated using (true);

create policy categories_admin_all on public.categories
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy products_public_read on public.products
  for select to anon, authenticated
  using (availability_status = 'available');

create policy products_admin_all on public.products
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy orders_admin_all on public.orders
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy order_items_admin_read on public.order_items
  for select to authenticated using (public.is_admin());

create policy promotions_public_read on public.promotions
  for select to anon, authenticated
  using (
    is_active
    and (start_date is null or start_date <= now())
    and (end_date is null or end_date >= now())
  );

create policy promotions_admin_all on public.promotions
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy reviews_public_read on public.reviews
  for select to anon, authenticated using (is_approved);

create policy reviews_admin_all on public.reviews
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
