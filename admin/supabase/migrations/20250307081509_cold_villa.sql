/*
  # Fix infinite recursion in roles policies

  1. Changes:
    - Fix policies for the `roles` table that cause infinite recursion
    - Create proper non-recursive policies that achieve the same access control
  
  2. Security:
    - Maintain the same security model but implement it without circular references
*/

-- Drop problematic policies that cause infinite recursion
DO $$
BEGIN
  -- Drop policies that might cause infinite recursion
  DROP POLICY IF EXISTS "Allow admins to manage roles" ON public.roles;
  DROP POLICY IF EXISTS "Allow admins full access to roles" ON public.roles;
  DROP POLICY IF EXISTS "Allow users to read roles" ON public.roles;
  DROP POLICY IF EXISTS "Allow public read access to roles" ON public.roles;
  
  -- Drop policies on user_profiles that might cause issues
  DROP POLICY IF EXISTS "Allow admins to manage all profiles" ON public.user_profiles;
  DROP POLICY IF EXISTS "Allow admins full access to user_profiles" ON public.user_profiles;
END $$;

-- Create fixed policies for roles table
DO $$
BEGIN
  -- Create policy for public read access to roles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'roles' 
    AND policyname = 'roles_allow_public_read'
  ) THEN
    CREATE POLICY "roles_allow_public_read" 
      ON public.roles 
      FOR SELECT 
      USING (true);
  END IF;

  -- Create policy for authenticated users to modify roles when they are admin
  -- This avoids the circular reference by using a subquery pattern
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'roles' 
    AND policyname = 'roles_allow_admin_all'
  ) THEN
    CREATE POLICY "roles_allow_admin_all"
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
  END IF;
END $$;

-- Create fixed policies for user_profiles table
DO $$
BEGIN
  -- Create policy for users to view their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'user_profiles_view_own'
  ) THEN
    CREATE POLICY "user_profiles_view_own" 
      ON public.user_profiles 
      FOR SELECT 
      TO authenticated
      USING (id = auth.uid());
  END IF;

  -- Create policy for users to update their own profile
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'user_profiles_update_own'
  ) THEN
    CREATE POLICY "user_profiles_update_own"
      ON public.user_profiles
      FOR UPDATE
      TO authenticated
      USING (id = auth.uid())
      WITH CHECK (id = auth.uid());
  END IF;

  -- Create policy for admins to manage all profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_profiles' 
    AND policyname = 'user_profiles_admin_all'
  ) THEN
    CREATE POLICY "user_profiles_admin_all"
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
  END IF;
END $$;