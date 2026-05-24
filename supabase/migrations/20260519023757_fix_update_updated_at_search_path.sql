/*
  # Fix search_path mutability on update_updated_at function

  1. Security Fix
    - The `public.update_updated_at` trigger function had a mutable `search_path`,
      which is a security vulnerability. An attacker could manipulate the search path
      to resolve malicious objects before legitimate ones.
    - This migration sets `search_path = ''` on the function, making the search path
      immutable and preventing search path injection attacks.

  2. Modified Functions
    - `public.update_updated_at()` — added `SET search_path = ''`

  3. Important Notes
    - The function body only references `NEW.updated_at` and `now()`, both of which
      are built-in and do not depend on the search path, so an empty search_path is safe.
*/

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;
