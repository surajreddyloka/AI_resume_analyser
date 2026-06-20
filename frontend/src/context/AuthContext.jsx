import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, signInWithPopup } from '../core/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync user to backend and fetch profile
  const syncUserToBackend = async (firebaseUser) => {
    if (!firebaseUser) {
      setUserProfile(null);
      return;
    }
    try {
      const idToken = await firebaseUser.getIdToken();
      const res = await fetch('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${idToken}` },
      });
      if (res.ok) {
        const profile = await res.json();
        setUserProfile(profile);
      }
    } catch (err) {
      console.warn('Could not sync user profile:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await syncUserToBackend(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();

    // Sync to backend — creates/updates user with Google profile data
    await fetch('/api/v1/auth/google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id_token: idToken }),
    });

    // Fetch the updated profile
    const profileRes = await fetch('/api/v1/auth/me', {
      headers: { Authorization: `Bearer ${idToken}` },
    });
    if (profileRes.ok) {
      setUserProfile(await profileRes.json());
    }

    return result;
  };

  const logout = async () => {
    setUserProfile(null);
    return signOut(auth);
  };

  const value = {
    currentUser,
    userProfile,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
