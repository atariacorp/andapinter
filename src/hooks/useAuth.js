import { useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../utils/firebase';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [authInitialized, setAuthInitialized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthInitialized(true);
    });
    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setLoading(false);
      return result;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  return {
    user,
    authInitialized,
    loading,
    error,
    login,
    register,
    logout
  };
};