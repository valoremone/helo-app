/*
  # Create test users and roles

  1. New Data
    - Create admin and member roles if they don't exist
    - Create test users with appropriate profiles
      - Admin user: admin@helo.com / admin123
      - Member user: member@helo.com / member123
  
  2. Security
    - Uses existing RLS policies
*/

-- Check if admin role exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'admin') THEN
    INSERT INTO public.roles (id, name, description, created_at)
    VALUES 
      (gen_random_uuid(), 'admin', 'Administrator with full access', now());
  END IF;
END $$;

-- Check if member role exists before creating it
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'member') THEN
    INSERT INTO public.roles (id, name, description, created_at)
    VALUES 
      (gen_random_uuid(), 'member', 'Regular member with limited access', now());
  END IF;
END $$;

-- Create admin test user if it doesn't exist
DO $$
DECLARE
  v_admin_role_id uuid;
  v_admin_user_id uuid;
BEGIN
  -- Get admin role ID
  SELECT id INTO v_admin_role_id FROM public.roles WHERE name = 'admin';
  
  -- Create admin user if doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@helo.com') THEN
    -- Insert into auth.users
    v_admin_user_id := gen_random_uuid();
    
    -- Create user in auth schema with hashed password
    INSERT INTO auth.users (
      id, 
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    ) 
    VALUES (
      v_admin_user_id, 
      'admin@helo.com',
      -- Password: admin123
      crypt('admin123', gen_salt('bf')),
      now(),
      now(),
      now()
    );
    
    -- Create user profile
    INSERT INTO public.user_profiles (
      id, 
      role_id, 
      full_name, 
      membership_tier, 
      status, 
      created_at, 
      updated_at
    )
    VALUES (
      v_admin_user_id,
      v_admin_role_id,
      'Admin User',
      'Platinum',
      'active',
      now(),
      now()
    );
  END IF;
END $$;

-- Create member test user if it doesn't exist
DO $$
DECLARE
  v_member_role_id uuid;
  v_member_user_id uuid;
BEGIN
  -- Get member role ID
  SELECT id INTO v_member_role_id FROM public.roles WHERE name = 'member';
  
  -- Create member user if doesn't exist
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'member@helo.com') THEN
    -- Insert into auth.users
    v_member_user_id := gen_random_uuid();
    
    -- Create user in auth schema with hashed password
    INSERT INTO auth.users (
      id, 
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    ) 
    VALUES (
      v_member_user_id, 
      'member@helo.com',
      -- Password: member123
      crypt('member123', gen_salt('bf')),
      now(),
      now(),
      now()
    );
    
    -- Create user profile
    INSERT INTO public.user_profiles (
      id, 
      role_id, 
      full_name, 
      membership_tier, 
      status, 
      created_at, 
      updated_at
    )
    VALUES (
      v_member_user_id,
      v_member_role_id,
      'Test Member',
      'Platinum',
      'active',
      now(),
      now()
    );
  END IF;
END $$;