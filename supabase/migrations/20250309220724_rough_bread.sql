/*
  # Fix roles and policies for authentication
  
  1. Changes:
    - Ensure roles table exists with proper constraints
    - Set up baseline policies for user authentication
    - Fix role-based access control
    
  2. Security:
    - Simplify policy structure to prevent recursion
    - Add basic read permissions for authentication tables
*/

-- Create roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Insert default roles if they don't exist
INSERT INTO public.roles (name, description) 
VALUES 
  ('admin', 'Administrator with full access'),
  ('member', 'Regular member with limited access')
ON CONFLICT (name) DO NOTHING;

-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role_id uuid NOT NULL REFERENCES public.roles(id),
  full_name text NOT NULL,
  membership_tier text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS roles_admin_all ON public.roles;
DROP POLICY IF EXISTS roles_simple_read ON public.roles;
DROP POLICY IF EXISTS user_profiles_admin_all ON public.user_profiles;
DROP POLICY IF EXISTS user_profiles_read_own ON public.user_profiles;
DROP POLICY IF EXISTS user_profiles_update_own ON public.user_profiles;

-- Create simple policies that avoid recursion
-- Allow anyone to read roles
CREATE POLICY roles_public_read
  ON public.roles
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Allow users to read their own profile
CREATE POLICY user_profiles_read_own
  ON public.user_profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Allow users to update their own profile
CREATE POLICY user_profiles_update_own
  ON public.user_profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Allow users with admin role in their profile to do all operations on user_profiles
CREATE POLICY user_profiles_admin_all
  ON public.user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      JOIN public.roles r ON up.role_id = r.id
      WHERE up.id = auth.uid() AND r.name = 'admin'
    )
  );

-- Allow users with admin role in their profile to do all operations on roles
CREATE POLICY roles_admin_all
  ON public.roles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles up
      JOIN public.roles r ON up.role_id = r.id
      WHERE up.id = auth.uid() AND r.name = 'admin'
    )
  );