/*
  # Fix user authentication issues
  
  1. Changes:
    - Drop potentially conflicting policies
    - Add cleaner, more explicit policies for user authentication
    - Fix role-based access control
    
  2. Security:
    - Simplify policy structure to prevent recursion
    - Ensure users can read roles without auth
    - Allow admin users to perform all operations
*/

-- First remove potentially problematic policies to start fresh
DO $$ 
BEGIN
  -- Drop all policies on roles table
  DROP POLICY IF EXISTS roles_admin_all ON public.roles;
  DROP POLICY IF EXISTS roles_public_read ON public.roles;
  DROP POLICY IF EXISTS roles_allow_admin_all ON public.roles;
  DROP POLICY IF EXISTS roles_allow_public_read ON public.roles;
  
  -- Drop all policies on user_profiles table
  DROP POLICY IF EXISTS user_profiles_admin_all ON public.user_profiles;
  DROP POLICY IF EXISTS user_profiles_update_own ON public.user_profiles;
  DROP POLICY IF EXISTS user_profiles_view_own ON public.user_profiles;
  DROP POLICY IF EXISTS "Allow users to read and update their own profile" ON public.user_profiles;
  DROP POLICY IF EXISTS "Allow users to view their own profile" ON public.user_profiles;
END $$;

-- Make sure Row Level Security is enabled on both tables
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Simple public read policy for roles (no recursion)
CREATE POLICY "roles_simple_read"
  ON public.roles
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Simple admin policy for roles - avoids join that could cause recursion
CREATE POLICY "roles_admin_all"
  ON public.roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- User profiles policies that avoid recursion
CREATE POLICY "user_profiles_read_own"
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "user_profiles_update_own"
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Simple admin policy for user_profiles - avoids join that could cause recursion  
CREATE POLICY "user_profiles_admin_all"
  ON public.user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Add helper function to check if user has admin role
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS boolean AS $$
DECLARE
  is_admin boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    JOIN public.roles r ON up.role_id = r.id
    WHERE up.id = uid AND r.name = 'admin'
  ) INTO is_admin;
  
  RETURN is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;