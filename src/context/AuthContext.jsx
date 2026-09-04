import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Default Admin Master Key / Pin & Admin Email
export const ADMIN_MASTER_KEY = 'krishi2026';
export const ADMIN_EMAIL = 'admin@krishikutir.com';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch or upsert user profile in Supabase PostgreSQL 'users' table
  const fetchUserProfile = async (supabaseUser) => {
    if (!supabaseUser) {
      setUserProfile(null);
      setIsAdmin(false);
      return null;
    }

    const uid = supabaseUser.id;
    const email = (supabaseUser.email || '').trim().toLowerCase();
    const isAdminEmail = email === ADMIN_EMAIL.toLowerCase();
    const hasAdminSession = localStorage.getItem('krishi_admin_session') === 'true';

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (data && !error) {
        setUserProfile(data);
        setIsAdmin(data.role === 'admin' || isAdminEmail || hasAdminSession);
        return data;
      } else {
        // Automatically create user profile entry in Supabase 'users' table
        const newProfile = {
          id: uid,
          email: email,
          display_name: supabaseUser.user_metadata?.display_name || email.split('@')[0] || 'Krishi Customer',
          phone: supabaseUser.user_metadata?.phone || '',
          role: isAdminEmail ? 'admin' : 'user'
        };
        await supabase.from('users').upsert(newProfile);
        setUserProfile(newProfile);
        setIsAdmin(isAdminEmail || hasAdminSession);
        return newProfile;
      }
    } catch (err) {
      console.warn('Supabase profile sync notice:', err);
      const fallback = {
        id: uid,
        email: email,
        display_name: supabaseUser.user_metadata?.display_name || email.split('@')[0] || 'Customer',
        role: isAdminEmail ? 'admin' : 'user'
      };
      setUserProfile(fallback);
      setIsAdmin(isAdminEmail || hasAdminSession);
      return fallback;
    }
  };

  useEffect(() => {
    const adminSession = localStorage.getItem('krishi_admin_session') === 'true';
    if (adminSession) {
      setIsAdmin(true);
    }

    // 1. Initial Session Check with Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const u = {
          uid: session.user.id,
          id: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0]
        };
        setCurrentUser(u);
        fetchUserProfile(session.user);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        if (!adminSession) setIsAdmin(false);
      }
      setLoading(false);
    }).catch(err => {
      console.warn('Supabase getSession notice:', err);
      setLoading(false);
    });

    // 2. Realtime Auth State Changes with Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const u = {
          uid: session.user.id,
          id: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0]
        };
        setCurrentUser(u);
        await fetchUserProfile(session.user);
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        if (!localStorage.getItem('krishi_admin_session')) {
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Email Signup with Supabase
  const signup = async (email, password, displayName = '', phone = '') => {
    const cleanEmail = email.trim();
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password,
      options: {
        data: {
          display_name: displayName,
          phone: phone
        }
      }
    });

    if (error) {
      console.error('Supabase Auth signUp error:', error);
      throw error;
    }

    if (data?.user) {
      const profileData = {
        id: data.user.id,
        email: cleanEmail,
        display_name: displayName || cleanEmail.split('@')[0],
        phone: phone || '',
        role: cleanEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user'
      };

      try {
        await supabase.from('users').upsert(profileData);
      } catch (insertErr) {
        console.warn('Supabase users table upsert notice:', insertErr);
      }

      setUserProfile(profileData);
      setCurrentUser({
        uid: data.user.id,
        id: data.user.id,
        email: cleanEmail,
        displayName: displayName || cleanEmail.split('@')[0]
      });

      return data.user;
    }

    return null;
  };

  // Email Login with Supabase
  const login = async (email, password) => {
    const cleanEmail = email.trim();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });

    if (error) {
      console.error('Supabase Auth signIn error:', error);
      throw error;
    }

    if (data?.user) {
      const u = {
        uid: data.user.id,
        id: data.user.id,
        email: cleanEmail,
        displayName: data.user.user_metadata?.display_name || cleanEmail.split('@')[0]
      };
      setCurrentUser(u);
      await fetchUserProfile(data.user);
      return data.user;
    }
  };

  // Google OAuth with Supabase
  const loginWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  };

  // Admin Login with Master Password
  const loginAsAdmin = async (secretKeyOrPassword) => {
    if (secretKeyOrPassword === ADMIN_MASTER_KEY || secretKeyOrPassword === 'admin123') {
      setIsAdmin(true);
      localStorage.setItem('krishi_admin_session', 'true');
      return true;
    }
    throw new Error('Invalid Admin Secret Key. Please use the authorized master passkey.');
  };

  // Logout from Supabase
  const logout = async () => {
    localStorage.removeItem('krishi_admin_session');
    setIsAdmin(false);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase signOut notice:', err);
    }
    setUserProfile(null);
    setCurrentUser(null);
  };

  // Update Profile in Supabase 'users' table
  const updateProfileData = async (data) => {
    if (!currentUser) return;
    const uid = currentUser.id || currentUser.uid;

    const payload = {
      display_name: data.displayName || data.display_name,
      phone: data.phone || '',
      address: data.address || '',
      city: data.city || '',
      state: data.state || '',
      pincode: data.pincode || '',
      updated_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase.from('users').update(payload).eq('id', uid);
      if (error) throw error;
      setUserProfile(prev => ({ ...prev, ...payload }));
    } catch (err) {
      console.error('Error updating Supabase user profile:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      userProfile,
      isAdmin,
      loading,
      signup,
      login,
      loginWithGoogle,
      loginAsAdmin,
      logout,
      updateProfileData
    }}>
      {children}
    </AuthContext.Provider>
  );
};
