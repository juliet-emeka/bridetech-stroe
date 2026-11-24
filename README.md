# BRIDETECH STORE

React + Vite storefront for BRIDETECH STORE. Phase 3 (customer website) and Phase 4 (Supabase foundation) are implemented.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:3000`.

If the Supabase variables in `.env` are empty, the site uses a clearly labelled demo catalogue. This lets you explore the interface before connecting a database.

## Connect Supabase

1. Create a free project in the Supabase dashboard.
2. Open **SQL Editor** and run `supabase/migrations/0001_initial_schema.sql`. This creates the tables, indexes, triggers, Row Level Security policies, the trusted `create_order` function and the `product-images` storage bucket.
3. Run `supabase/migrations/0002_harden_policies.sql`. It removes any policies left by a previous project template and reapplies only the intended access rules.
4. Run `supabase/migrations/0003_stock_management.sql`. It makes orders reduce stock and restores stock when an order is cancelled.
5. Run `supabase/migrations/0004_fix_order_grants.sql`. It restores admin UPDATE access on orders while keeping public writes blocked.
6. Run `supabase/seed.sql` in the same SQL Editor to add the seven product categories. No fake products are seeded.
7. Create the admin account in **Authentication → Users → Add user → Invite user**. The database trigger creates a matching profile automatically.
8. Promote that user to admin in **SQL Editor**:

```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'owner@example.com');
```

Replace `owner@example.com` with the real admin email. Only run this for a trusted account.

9. Copy the **Project URL** and **publishable/anon key** from **Project Settings → API** into `.env`:

```text
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

10. Restart `npm run dev`, then sign in at `/admin/login`.

## How the data layer works

- `src/lib/supabase.js` creates the browser client. It only uses the publishable key.
- `src/services/catalogue.js` reads from Supabase when configured, otherwise from demo data. Components use the same hooks in both modes.
- Public visitors can read available products, categories and active promotions through RLS policies.
- Orders are created through the `public.create_order` database function. It re-reads prices from the `products` table and calculates totals in PostgreSQL, so browser-submitted prices cannot be trusted or manipulated. It also reduces stock, and cancelling an order restores stock.
- The `product-images` bucket allows public reads and admin-only uploads. File type and size limits are set on the bucket by the migration.
- Checkout saves the order through `create_order`, then opens WhatsApp with a prefilled message. The WhatsApp number is read from `VITE_WHATSAPP_NUMBER` in `.env`; add the number that actually receives WhatsApp orders before publishing.

## Security notes

- Never put a secret/service key in `.env` or any frontend file. It bypasses RLS. The browser key must start with `sb_publishable_` (or be the legacy anon JWT), never `sb_secret_`.
- The publishable key is safe for browser use only because RLS is enabled on every table.
- Admin permissions are checked in database policies, not only in React routes.
- Supabase's free tier has usage limits and may pause inactive projects. Check the dashboard for current limits before relying on it for live traffic.

## Deployment

- Build command: `npm run build`. Output directory: `out`.
- `public/_redirects` keeps React Router routes working on Cloudflare Pages and Netlify. `vercel.json` is only used for Vercel deployments.
- Add these environment variables in the hosting dashboard: `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_WHATSAPP_NUMBER`.
- In Supabase **Authentication → URL Configuration**, set the production **Site URL** to your deployed domain and add `https://your-domain/**` to **Redirect URLs**. Keep `http://localhost:3000/**` for local development.
- Redeploy after changing environment variables.

## Checks

```bash
npm run lint
npm run build
```
