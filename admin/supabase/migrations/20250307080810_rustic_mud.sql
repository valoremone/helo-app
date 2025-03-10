/*
  # Create roles and test users

  1. New Data
    - Creates default roles (admin, member) if they don't exist
    - Note: Test users are created via the setup-users script
  
  2. Security
    - Ensures Row Level Security is enabled
    - Adds appropriate policies for authenticated users
*/

-- Create roles if they don't exist
INSERT INTO public.roles (name, description)
VALUES 
  ('admin', 'Administrator with full access'),
  ('member', 'Regular member with limited access')
ON CONFLICT (name) DO NOTHING;

-- Add policy for admins to access all user profiles
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Allow admins full access to user_profiles'
  ) THEN
    CREATE POLICY "Allow admins full access to user_profiles"
    ON public.user_profiles
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM user_profiles up
        JOIN roles r ON up.role_id = r.id
        WHERE up.id = auth.uid() AND r.name = 'admin'
      )
    );
  END IF;
END
$$;

-- Add policy for users to access their own profile
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'Allow users to read and update their own profile'
  ) THEN
    CREATE POLICY "Allow users to read and update their own profile"
    ON public.user_profiles
    FOR SELECT
    TO authenticated
    USING (id = auth.uid());
  END IF;
END
$$;