drop policy if exists reviews_public_insert on public.reviews;
create policy reviews_public_insert on public.reviews
  for insert to anon, authenticated
  with check (is_approved = false);




-- my inital code for the review that is correctly in my supabase
-- drop policy if exists reviews_public_insert on public.reviews;
-- create policy reviews_public_insert on public.reviews
--   for insert to anon, authenticated
--   with check (
--     is_approved = false
--     and rating between 1 and 5
--     and char_length(btrim(customer_name)) between 2 and 80
--     and char_length(btrim(comment)) between 10 and 1000
--   );
