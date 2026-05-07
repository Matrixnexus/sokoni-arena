-- Run this in Supabase SQL editor.
-- Fixes: stories show "Unknown" sender, listing detail missing call/whatsapp.

-- 1) Allow public read of non-sensitive profile columns
DROP POLICY IF EXISTS "Public can view non-sensitive profile fields" ON public.profiles;
CREATE POLICY "Public can view non-sensitive profile fields"
ON public.profiles
FOR SELECT
TO authenticated, anon
USING (true);

-- 2) Recreate profiles_public
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public
WITH (security_invoker = on) AS
SELECT id, user_id, username, avatar_url, bio, location, is_verified, created_at, updated_at
FROM public.profiles;
GRANT SELECT ON public.profiles_public TO authenticated, anon;

-- 3) Fix seller_contacts_public to use real columns (username, phone)
DROP VIEW IF EXISTS public.seller_contacts_public;
CREATE VIEW public.seller_contacts_public
WITH (security_invoker = on) AS
SELECT
  p.user_id,
  COALESCE(p.username, 'Seller') AS username,
  p.phone AS phone,
  p.phone AS whatsapp
FROM public.profiles p
WHERE p.phone IS NOT NULL AND length(trim(p.phone)) > 0;
GRANT SELECT ON public.seller_contacts_public TO authenticated, anon;
