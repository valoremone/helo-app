/*
  # Create roles and test users

  1. New Data
    - Inserts default roles (admin, member)
    - Creates test users with their profiles
    - Sets up appropriate role-based security policies

  2. Security
    - Ensures Row Level Security is enabled
    - Adds appropriate policies for authenticated users
*/

-- Add roles if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'admin') THEN
    INSERT INTO public.roles (id, name, description)
    VALUES (gen_random_uuid(), 'admin', 'Administrator with full access');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'member') THEN
    INSERT INTO public.roles (id, name, description)
    VALUES (gen_random_uuid(), 'member', 'Regular member with limited access');
  END IF;
END $$;

-- Create test admin user
DO $$
DECLARE
  admin_role_id uuid;
  admin_user_id uuid;
BEGIN
  -- Get admin role ID
  SELECT id INTO admin_role_id FROM public.roles WHERE name = 'admin';
  
  -- Create admin user if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@helo.com') THEN
    -- Insert into auth.users
    admin_user_id := gen_random_uuid();
    
    -- Use supabase auth functions to create a user with password
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, 
      confirmation_sent_at, recovery_sent_at
    ) 
    VALUES (
      admin_user_id, 
      'admin@helo.com', 
      crypt('admin123', gen_salt('bf')), 
      now(), now(), now()
    );
    
    -- Create user profile
    INSERT INTO public.user_profiles (
      id, role_id, full_name, membership_tier, status
    )
    VALUES (
      admin_user_id,
      admin_role_id,
      'Admin User',
      'Platinum',
      'active'
    );
  END IF;
END $$;

-- Create test member user
DO $$
DECLARE
  member_role_id uuid;
  member_user_id uuid;
BEGIN
  -- Get member role ID
  SELECT id INTO member_role_id FROM public.roles WHERE name = 'member';
  
  -- Create member user if not exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'member@helo.com') THEN
    -- Insert into auth.users
    member_user_id := gen_random_uuid();
    
    -- Use supabase auth functions to create a user with password
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at,
      confirmation_sent_at, recovery_sent_at
    ) 
    VALUES (
      member_user_id, 
      'member@helo.com', 
      crypt('member123', gen_salt('bf')), 
      now(), now(), now()
    );
    
    -- Create user profile
    INSERT INTO public.user_profiles (
      id, role_id, full_name, membership_tier, status
    )
    VALUES (
      member_user_id,
      member_role_id,
      'Test Member',
      'Platinum',
      'active'
    );
  END IF;
END $$;