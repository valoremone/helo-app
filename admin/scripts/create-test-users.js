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

async function setupDatabase() {
  try {
    console.log('Starting test users setup...');
    
    // Create roles if they don't exist 
    await ensureRolesExist();
    
    // Get roles from the database
    let roles;
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('id, name');
        
      if (error) throw error;
      roles = data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      process.exit(1);
    }
    
    if (!roles || roles.length === 0) {
      console.error('No roles found. Please apply the database migration first.');
      process.exit(1);
    }
    
    console.log('Found roles:', roles.map(r => r.name).join(', '));
    
    // Find role IDs
    const adminRoleId = roles.find(r => r.name === 'admin')?.id;
    const memberRoleId = roles.find(r => r.name === 'member')?.id;
    
    if (!adminRoleId || !memberRoleId) {
      console.error('Required roles not found. Make sure "admin" and "member" roles exist.');
      process.exit(1);
    }
    
    // Create admin user if it doesn't exist
    const adminUser = await createUserIfNotExists(
      'admin@helo.com', 
      'admin123', 
      'Admin User', 
      adminRoleId, 
      'Platinum'
    );
    
    // Create member user if it doesn't exist
    const memberUser = await createUserIfNotExists(
      'member@helo.com', 
      'member123', 
      'Test Member', 
      memberRoleId, 
      'Platinum'
    );
    
    if (adminUser || memberUser) {
      console.log('✅ Test users setup completed');
    } else {
      console.log('⚠️ No new users were created. If you need to test the login, try using the test credentials already set up.');
    }
    
  } catch (error) {
    console.error('Error setting up test users:', error);
    process.exit(1);
  }
}

async function ensureRolesExist() {
  try {
    // Check if roles exist first
    const { data: existingRoles, error: checkError } = await supabase
      .from('roles')
      .select('name')
      .in('name', ['admin', 'member']);
      
    if (checkError) throw checkError;
    
    // If we have both roles, no need to insert
    if (existingRoles && existingRoles.length === 2) {
      console.log('Roles already exist');
      return;
    }
    
    // Insert missing roles
    const adminExists = existingRoles?.some(r => r.name === 'admin');
    const memberExists = existingRoles?.some(r => r.name === 'member');
    
    const rolesToInsert = [];
    if (!adminExists) rolesToInsert.push({ name: 'admin', description: 'Administrator with full access' });
    if (!memberExists) rolesToInsert.push({ name: 'member', description: 'Regular member with limited access' });
    
    if (rolesToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('roles')
        .insert(rolesToInsert);
        
      if (insertError) throw insertError;
      console.log(`Inserted missing roles: ${rolesToInsert.map(r => r.name).join(', ')}`);
    }
  } catch (error) {
    console.error('Error ensuring roles exist:', error);
    throw error;
  }
}

async function createUserIfNotExists(email, password, fullName, roleId, membershipTier) {
  try {
    console.log(`Attempting to set up user: ${email}...`);
    
    // Use signUp instead of admin APIs
    // This won't tell us if the user already exists, but will create the user if they don't
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      }
    });
    
    if (authError) {
      // If error contains "User already registered", that's actually okay
      if (authError.message && authError.message.includes("User already registered")) {
        console.log(`User ${email} already exists`);
        
        // Try to sign in to get the user ID
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInError) {
          console.log(`Could not sign in as ${email}. If this user exists, their profile will not be updated.`);
          return null;
        }
        
        // Check and update profile for existing user
        if (signInData?.user) {
          await ensureUserProfileExists(signInData.user.id, roleId, fullName, membershipTier);
          
          // Sign out after we're done
          await supabase.auth.signOut();
          
          return signInData.user;
        }
        
        return null;
      } else {
        console.error(`Error creating user ${email}:`, authError);
        return null;
      }
    }
    
    if (!authData?.user) {
      console.error(`No user data returned when creating ${email}`);
      return null;
    }
    
    console.log(`Created user ${email} with ID: ${authData.user.id}`);
    
    // Create user profile
    await ensureUserProfileExists(authData.user.id, roleId, fullName, membershipTier);
    
    // Sign out after we're done
    await supabase.auth.signOut();
    
    return authData.user;
  } catch (error) {
    console.error(`Error in user creation process for ${email}:`, error);
    return null;
  }
}

async function ensureUserProfileExists(userId, roleId, fullName, membershipTier) {
  try {
    // Check if profile exists
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    
    if (profileError && !profileError.message?.includes('No rows found')) {
      console.error(`Error checking profile for user ${userId}:`, profileError);
    }
    
    if (!profile) {
      // Create profile if it doesn't exist
      const { error: insertProfileError } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          role_id: roleId,
          full_name: fullName,
          membership_tier: membershipTier,
          status: 'active'
        });
      
      if (insertProfileError) {
        console.error(`Error creating profile for user ${userId}:`, insertProfileError);
      } else {
        console.log(`Created profile for user ${userId}`);
      }
    } else {
      console.log(`Profile for user ${userId} already exists`);
    }
  } catch (error) {
    console.error(`Error ensuring profile exists for user ${userId}:`, error);
  }
}

setupDatabase();