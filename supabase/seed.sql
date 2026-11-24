insert into public.categories (name, slug, description) values
  ('Smartphones', 'smartphones', 'Mobile phones and related devices.'),
  ('Laptops & Computers', 'laptops-computers', 'Laptops, desktops and computing equipment.'),
  ('Gaming Consoles', 'gaming-consoles', 'Consoles, controllers and gaming accessories.'),
  ('Phone Accessories', 'phone-accessories', 'Chargers, cases and other phone essentials.'),
  ('Laptop Accessories', 'laptop-accessories', 'Keyboards, mice, bags and laptop add-ons.'),
  ('Smart Devices', 'smart-devices', 'Wearables and connected home devices.'),
  ('Other Electronics', 'other-electronics', 'Other gadgets and electronic equipment.')
on conflict (slug) do nothing;
