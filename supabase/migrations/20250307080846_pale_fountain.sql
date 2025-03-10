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

-- Enable Row Level Security
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create default roles
INSERT INTO public.roles (name, description)
VALUES 
  ('admin', 'Administrator with full access'),
  ('member', 'Regular member with limited access')
ON CONFLICT (name) DO NOTHING;

-- Create policies for roles table
CREATE POLICY "Allow public read access to roles" 
  ON public.roles FOR SELECT 
  USING (true);

CREATE POLICY "Allow admins to manage roles" 
  ON public.roles FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role_id IN (SELECT id FROM roles WHERE name = 'admin')
    )
  );

-- Create policies for user_profiles table
CREATE POLICY "Allow users to view their own profile" 
  ON public.user_profiles FOR SELECT 
  USING (id = auth.uid());

CREATE POLICY "Allow admins to manage all profiles" 
  ON public.user_profiles FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid() 
      AND user_profiles.role_id IN (SELECT id FROM roles WHERE name = 'admin')
    )
  );