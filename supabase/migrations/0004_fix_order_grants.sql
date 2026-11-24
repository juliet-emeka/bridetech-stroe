revoke insert, update, delete on public.orders, public.order_items from anon;
grant select, insert, update, delete on public.orders, public.order_items to authenticated;
