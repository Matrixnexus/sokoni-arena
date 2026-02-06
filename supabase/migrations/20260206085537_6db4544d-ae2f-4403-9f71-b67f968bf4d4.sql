-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Create a policy that only allows users to view their own full profile
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create a public view for non-sensitive profile data (excludes email and phone)
CREATE VIEW public.profiles_public
WITH (security_invoker = on) AS
SELECT 
  id,
  user_id,
  username,
  avatar_url,
  bio,
  location,
  is_verified,
  created_at,
  updated_at
FROM public.profiles;

-- Grant select on the view to authenticated and anon users
GRANT SELECT ON public.profiles_public TO authenticated, anon;