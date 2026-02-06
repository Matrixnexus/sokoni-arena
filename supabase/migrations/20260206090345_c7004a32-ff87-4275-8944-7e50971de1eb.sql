-- Create a public listings view that excludes precise coordinates
CREATE VIEW public.listings_public
WITH (security_invoker = on) AS
SELECT 
  id,
  title,
  description,
  listing_type,
  category,
  subcategory,
  price,
  original_price,
  location, -- Text location is fine (e.g., "Nairobi, Kenya")
  -- Exclude precise lat/long for privacy
  images,
  is_free,
  is_negotiable,
  delivery_available,
  event_date,
  event_end_date,
  is_sponsored,
  is_featured,
  views_count,
  favorites_count,
  status,
  expires_at,
  sponsored_until,
  created_at,
  updated_at,
  user_id
FROM public.listings;

-- Grant access to the view
GRANT SELECT ON public.listings_public TO authenticated, anon;