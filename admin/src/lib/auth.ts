import { supabase } from './supabase';
import { toast } from 'sonner';
import { AuthError } from '@supabase/supabase-js';

export async function getUserRole(userId: string): Promise<string> {
  try {
    // First get the user profile to get the role_id
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('role_id')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      return 'member'; // Default fallback role
    }
    
    if (!profileData || !profileData.role_id) {
      console.error('Profile data or role_id missing for user:', userId);
      return 'member';
    }
    
    // Then get the role name
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('name')
      .eq('id', profileData.role_id)
      .single();
    
    if (roleError) {
      console.error('Error fetching role data:', roleError);
      return 'member';
    }
    
    return roleData?.name || 'member';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'member';
  }
}

export async function checkAuth() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Session check error:', error);
      return false;
    }
    return !!data.session;
  } catch (error) {
    console.error('Auth check error:', error);
    return false;
  }
}

export async function login(email: string, password: string) {
  try {
    // Validate inputs
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      // Handle specific error types
      if (error instanceof AuthError) {
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
      }
      throw error;
    }
    
    if (!data?.user || !data?.session) {
      throw new Error('Authentication failed: No user or session returned');
    }
    
    return data;
  } catch (error: any) {
    console.error('Login error:', error);
    throw new Error(error.message || 'Invalid email or password');
  }
}

export async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      throw error;
    }
    
    toast.success('Logged out successfully');
    return true;
  } catch (error) {
    console.error('Logout error:', error);
    return false;
  }
}

export async function getProfile(userId: string) {
  try {
    if (!userId) {
      console.error('getProfile called with no userId');
      return null;
    }

    // First get the user profile
    const { data: profileData, error: profileError } = await supabase
      .from('user_profiles')
      .select('*, role_id')
      .eq('id', userId)
      .single();
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError);
      throw profileError;
    }
    
    if (!profileData) {
      console.error('No profile found for user:', userId);
      return null;
    }
    
    // Then get the role name in a separate query
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('name')
      .eq('id', profileData.role_id)
      .single();
    
    if (roleError) {
      console.error('Error fetching role data:', roleError);
      throw roleError;
    }
    
    return {
      ...profileData,
      role: roleData?.name || 'member'
    };
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
}

export async function registerUser(email: string, password: string, fullName: string) {
  try {
    // Validate inputs
    if (!email || !password || !fullName) {
      throw new Error('Email, password, and full name are required');
    }

    // 1. Create the user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
        emailRedirectTo: window.location.origin + '/login',
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('User creation failed: No user returned');

    // 2. Get the member role ID
    const { data: roleData, error: roleError } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'member')
      .single();

    if (roleError) {
      console.error('Error fetching member role:', roleError);
      throw roleError;
    }

    if (!roleData || !roleData.id) {
      throw new Error('Member role not found. Please set up roles first.');
    }

    // 3. Create user profile
    const { error: profileError } = await supabase
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        role_id: roleData.id,
        full_name: fullName.trim(),
        membership_tier: 'Platinum', // Default tier for new users
        status: 'active',
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      throw profileError;
    }

    return authData;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}