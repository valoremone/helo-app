/*
  # Initial schema setup 

  1. New Tables
    - `roles` - Stores user roles (admin, member)
    - `user_profiles` - Stores user profile information
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create roles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- Create user_profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role_id uuid NOT NULL REFERENCES roles(id),
  full_name text NOT NULL,
  membership_tier text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security if not already enabled
DO $$
BEGIN
  -- Enable RLS on roles table if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'roles' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
  END IF;

  -- Enable RLS on user_profiles table if not already enabled
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'user_profiles' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create default roles if they don't exist
INSERT INTO public.roles (name, description)
VALUES 
  ('admin', 'Administrator with full access'),
  ('member', 'Regular member with limited access')
ON CONFLICT (name) DO NOTHING;

-- Create policies for roles table if they don't exist
DO $$
BEGIN
  -- Allow public read access to roles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'roles' 
    AND policyname = 'Allow public read access to roles'
  ) THEN
    CREATE POLICY "Allow public read access to roles" 
      ON public.roles FOR SELECT 
      USING (true);
  END IF;

  -- Allow admins to manage roles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'roles' 
    AND policyname = 'Allow admins to manage roles'
  ) THEN
    CREATE POLICY "Allow admins to manage roles" 
      ON public.roles FOR ALL 
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid() 
          AND user_profiles.role_id IN (SELECT id FROM roles WHERE name = 'admin')
        )
      );
  END IF;

  -- Allow users to view their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Allow users to view their own profile'
  ) THEN
    CREATE POLICY "Allow users to view their own profile" 
      ON public.user_profiles FOR SELECT 
      USING (id = auth.uid());
  END IF;

  -- Allow users to read and update their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Allow users to read and update their own profile'
  ) THEN
    CREATE POLICY "Allow users to read and update their own profile"
      ON public.user_profiles FOR UPDATE
      USING (id = auth.uid())
      WITH CHECK (id = auth.uid());
  END IF;

  -- Allow admins to manage all profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Allow admins to manage all profiles'
  ) THEN
    CREATE POLICY "Allow admins to manage all profiles" 
      ON public.user_profiles FOR ALL 
      USING (
        EXISTS (
          SELECT 1 FROM user_profiles
          WHERE user_profiles.id = auth.uid() 
          AND user_profiles.role_id IN (SELECT id FROM roles WHERE name = 'admin')
        )
      );
  END IF;
END $$;