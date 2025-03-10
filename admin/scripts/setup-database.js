import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupTestUsers() {
  try {
    console.log('Setting up test users...');

    // First check if roles exist
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('id, name');

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      console.error('Please make sure the migration has been applied first.');
      process.exit(1);
    }

    if (roles.length === 0) {
      console.error('No roles found in the database. Please run the migration first.');
      process.exit(1);
    }

    console.log('Roles found:', roles.map(r => r.name).join(', '));

    // Find role IDs
    const adminRoleId = roles.find(r => r.name === 'admin')?.id;
    const memberRoleId = roles.find(r => r.name === 'member')?.id;

    if (!adminRoleId || !memberRoleId) {
      console.error('Required roles not found. Please make sure "admin" and "member" roles exist.');
      process.exit(1);
    }

    // Create admin user if it doesn't exist
    await createUserIfNotExists(
      'admin@helo.com', 
      'admin123', 
      'Admin User', 
      adminRoleId, 
      'Platinum'
    );

    // Create member user if it doesn't exist
    await createUserIfNotExists(
      'member@helo.com', 
      'member123', 
      'Test Member', 
      memberRoleId, 
      'Platinum'
    );

    console.log('Test users setup completed successfully');
  } catch (error) {
    console.error('Error setting up test users:', error);
    process.exit(1);
  }
}

async function createUserIfNotExists(email, password, fullName, roleId, membershipTier) {
  try {
    console.log(`Setting up user: ${email}...`);

    // Check if user already exists
    const { data: { user: existingUser }, error: getUserError } = await supabase.auth.admin
      .getUserByEmail(email)
      .catch(() => ({ data: { user: null }, error: null }));

    if (existingUser) {
      console.log(`User ${email} already exists with ID: ${existingUser.id}`);
      
      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', existingUser.id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') {
        // Create profile if it doesn't exist
        const { error: insertProfileError } = await supabase
          .from('user_profiles')
          .insert({
            id: existingUser.id,
            role_id: roleId,
            full_name: fullName,
            membership_tier: membershipTier,
            status: 'active'
          });
        
        if (insertProfileError) {
          console.error(`Error creating profile for existing user ${email}:`, insertProfileError);
        } else {
          console.log(`Created profile for existing user ${email}`);
        }
      } else {
        console.log(`Profile for ${email} already exists`);
      }
      
      return existingUser;
    }

    // Create new user
    const { data: { user }, error: createUserError } = await supabase.auth
      .signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

    if (createUserError || !user) {
      console.error(`Error creating user ${email}:`, createUserError);
      return null;
    }

    console.log(`Created user ${email} with ID: ${user.id}`);

    // Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: user.id,
        role_id: roleId,
        full_name: fullName,
        membership_tier: membershipTier,
        status: 'active'
      });

    if (profileError) {
      console.error(`Error creating profile for ${email}:`, profileError);
    } else {
      console.log(`Created profile for ${email}`);
    }

    return user;
  } catch (error) {
    console.error(`Error in create user flow for ${email}:`, error);
    return null;
  }
}

setupTestUsers();