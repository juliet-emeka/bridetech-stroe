create or replace function public.create_order(
  p_customer_name text,
  p_customer_phone text,
  p_delivery_address text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_order_id uuid;
  v_item jsonb;
  v_product public.products%rowtype;
  v_quantity integer;
  v_subtotal numeric(12, 2) := 0;
begin
  if nullif(btrim(p_customer_name), '') is null then
    raise exception 'Customer name is required';
  end if;
  if p_customer_phone !~ '^0[0-9]{10}$' then
    raise exception 'Invalid phone number';
  end if;
  if nullif(btrim(p_delivery_address), '') is null then
    raise exception 'Delivery information is required';
  end if;
  if jsonb_typeof(p_items) is distinct from 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Cart is empty';
  end if;
  if jsonb_array_length(p_items) > 50 then
    raise exception 'Too many order items';
  end if;

  insert into public.orders (customer_name, customer_phone, delivery_address, subtotal, order_total)
  values (btrim(p_customer_name), btrim(p_customer_phone), btrim(p_delivery_address), 0, 0)
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item ->> 'quantity')::integer;
    if v_quantity is null or v_quantity < 1 or v_quantity > 100 then
      raise exception 'Invalid item quantity';
    end if;

    select * into v_product
    from public.products
    where id = (v_item ->> 'product_id')::uuid;

    if not found or v_product.availability_status <> 'available' then
      raise exception 'Product is not available';
    end if;
    if v_product.stock_quantity < v_quantity then
      raise exception 'Insufficient stock for %', v_product.name;
    end if;

    insert into public.order_items (
      order_id, product_id, product_name, quantity, unit_price, subtotal
    )
    values (
      v_order_id,
      v_product.id,
      v_product.name,
      v_quantity,
      v_product.price,
      v_product.price * v_quantity
    );

    update public.products
    set
      stock_quantity = stock_quantity - v_quantity,
      availability_status = case
        when stock_quantity - v_quantity <= 0 then 'out_of_stock'
        else availability_status
      end
    where id = v_product.id;

    v_subtotal := v_subtotal + (v_product.price * v_quantity);
  end loop;

  update public.orders
  set subtotal = v_subtotal, order_total = v_subtotal
  where id = v_order_id;

  return v_order_id;
end;
$$;

revoke all on function public.create_order(text, text, text, jsonb) from public;
grant execute on function public.create_order(text, text, text, jsonb) to anon, authenticated;

create or replace function public.restore_order_stock()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if old.order_status <> 'cancelled' and new.order_status = 'cancelled' then
    update public.products p
    set
      stock_quantity = p.stock_quantity + oi.quantity,
      availability_status = case
        when p.stock_quantity + oi.quantity > 0 then 'available'
        else p.availability_status
      end
    from public.order_items oi
    where oi.order_id = new.id and p.id = oi.product_id;
  end if;
  return new;
end;
$$;

drop trigger if exists restore_stock_on_cancel on public.orders;
create trigger restore_stock_on_cancel
after update of order_status on public.orders
for each row
execute function public.restore_order_stock();
