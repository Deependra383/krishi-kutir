import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../supabase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Strict Admin Credentials - Only this specific email and password have Admin access
export const ADMIN_MASTER_KEY = 'krishi123';
export const ADMIN_EMAIL = 'krishi345@gmail.com';
export const ADMIN_PHONE = '9009911030';

// Helper to check if string strictly matches the single authorized admin email
export const isMatchAdminEmail = (emailStr) => {
  if (!emailStr) return false;
  return emailStr.trim().toLowerCase() === 'krishi345@gmail.com';
};

// Helper to check if string strictly matches the single authorized admin password
export const isMatchAdminPassword = (pwStr) => {
  if (!pwStr) return false;
  return pwStr.trim() === 'krishi123';
};

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
      localStorage.removeItem('krishi_admin_session');
      return null;
    }

    const uid = supabaseUser.id;
    const email = (supabaseUser.email || '').trim().toLowerCase();
    const isStrictAdmin = isMatchAdminEmail(email);

    if (!isStrictAdmin) {
      // Strictly non-admin user
      setIsAdmin(false);
      localStorage.removeItem('krishi_admin_session');
    } else {
      setIsAdmin(true);
      localStorage.setItem('krishi_admin_session', 'true');
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', uid)
        .maybeSingle();

      if (data && !error) {
        setUserProfile(data);
        setIsAdmin(isStrictAdmin);
        return data;
      } else {
        // Automatically create user profile entry in Supabase 'users' table
        const newProfile = {
          id: uid,
          email: email,
          display_name: supabaseUser.user_metadata?.display_name || email.split('@')[0] || 'Krishi Customer',
          phone: supabaseUser.user_metadata?.phone || '',
          role: isStrictAdmin ? 'admin' : 'user'
        };
        await supabase.from('users').upsert(newProfile);
        setUserProfile(newProfile);
        setIsAdmin(isStrictAdmin);
        return newProfile;
      }
    } catch (err) {
      console.warn('Supabase profile sync notice:', err);
      const fallback = {
        id: uid,
        email: email,
        display_name: supabaseUser.user_metadata?.display_name || email.split('@')[0] || 'Customer',
        role: isStrictAdmin ? 'admin' : 'user'
      };
      setUserProfile(fallback);
      setIsAdmin(isStrictAdmin);
      return fallback;
    }
  };

  useEffect(() => {
    // 1. Initial Session Check with Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const email = (session.user.email || '').trim().toLowerCase();
        const isStrictAdmin = isMatchAdminEmail(email);
        const u = {
          uid: session.user.id,
          id: session.user.id,
          email: session.user.email,
          displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
          isAdmin: isStrictAdmin,
          role: isStrictAdmin ? 'admin' : 'user'
        };
        setCurrentUser(u);
        setIsAdmin(isStrictAdmin);
        if (isStrictAdmin) {
          localStorage.setItem('krishi_admin_session', 'true');
        } else {
          localStorage.removeItem('krishi_admin_session');
        }
        fetchUserProfile(session.user);
      } else {
        // If not logged in with Supabase, check if admin user is simulated in localStorage
        const storedAdminSession = localStorage.getItem('krishi_admin_session') === 'true';
        const storedAdminEmail = localStorage.getItem('krishi_admin_email');
        if (storedAdminSession && storedAdminEmail === 'krishi345@gmail.com') {
          setIsAdmin(true);
          const adminUser = {
            uid: 'admin-krishi-super',
            id: 'admin-krishi-super',
            email: 'krishi345@gmail.com',
            displayName: 'Krishi Kutir Administrator',
            role: 'admin',
            isAdmin: true
          };
          setCurrentUser(adminUser);
          setUserProfile(adminUser);
        } else {
          setCurrentUser(null);
          setUserProfile(null);
          setIsAdmin(false);
          localStorage.removeItem('krishi_admin_session');
          localStorage.removeItem('krishi_admin_email');
        }
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

  // Email / Admin ID Login
  const login = async (identifier, password) => {
    const cleanId = (identifier || '').trim().toLowerCase();
    const cleanPw = (password || '').trim();

    // 1. Strict Admin Authentication Check: ONLY krishi345@gmail.com with krishi123
    if (cleanId === 'krishi345@gmail.com' && cleanPw === 'krishi123') {
      setIsAdmin(true);
      localStorage.setItem('krishi_admin_session', 'true');
      localStorage.setItem('krishi_admin_email', 'krishi345@gmail.com');
      const adminUser = {
        uid: 'admin-krishi-super',
        id: 'admin-krishi-super',
        email: 'krishi345@gmail.com',
        displayName: 'Krishi Kutir Administrator',
        role: 'admin',
        isAdmin: true
      };
      setCurrentUser(adminUser);
      setUserProfile(adminUser);
      return adminUser;
    }

    // Strictly ensure non-admin users cannot inherit any leftover admin privileges
    setIsAdmin(false);
    localStorage.removeItem('krishi_admin_session');
    localStorage.removeItem('krishi_admin_email');

    // 2. Standard Supabase Email/Password Login for customers
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanId,
      password: cleanPw
    });

    if (error) {
      console.error('Supabase Auth signIn error:', error);
      throw error;
    }

    if (data?.user) {
      const isUserAdmin = isMatchAdminEmail(data.user.email);
      const u = {
        uid: data.user.id,
        id: data.user.id,
        email: cleanId,
        displayName: data.user.user_metadata?.display_name || cleanId.split('@')[0],
        role: isUserAdmin ? 'admin' : 'user',
        isAdmin: isUserAdmin
      };
      if (isUserAdmin) {
        setIsAdmin(true);
        localStorage.setItem('krishi_admin_session', 'true');
        localStorage.setItem('krishi_admin_email', 'krishi345@gmail.com');
      } else {
        setIsAdmin(false);
        localStorage.removeItem('krishi_admin_session');
        localStorage.removeItem('krishi_admin_email');
      }
      setCurrentUser(u);
      await fetchUserProfile(data.user);
      return u;
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

  // Admin Login with Master Password or ID
  const loginAsAdmin = async (secretKeyOrPassword) => {
    if (secretKeyOrPassword === 'krishi123') {
      setIsAdmin(true);
      localStorage.setItem('krishi_admin_session', 'true');
      localStorage.setItem('krishi_admin_email', 'krishi345@gmail.com');
      const adminUser = {
        uid: 'admin-krishi-super',
        id: 'admin-krishi-super',
        email: ADMIN_EMAIL,
        displayName: 'Krishi Kutir Administrator',
        role: 'admin',
        isAdmin: true
      };
      setCurrentUser(adminUser);
      setUserProfile(adminUser);
      return true;
    }
    throw new Error('Invalid Admin Secret Key or Password.');
  };

  // Logout from Supabase
  const logout = async () => {
    localStorage.removeItem('krishi_admin_session');
    localStorage.removeItem('krishi_admin_email');
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
