import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, appId } from '../utils/firebase';
import { DEFAULT_BRANDING } from '../utils/constants';

const BrandingContext = createContext();

export const useBranding = () => useContext(BrandingContext);

export const BrandingProvider = ({ children, user }) => {
  const [branding, setBranding] = useState(DEFAULT_BRANDING);
  const [brandingForm, setBrandingForm] = useState(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, 'artifacts', appId, 'public', 'data', 'config', 'app_branding'),
      (docSnap) => {
        if (docSnap.exists()) {
          setBranding(docSnap.data());
          setBrandingForm(docSnap.data());
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error loading branding:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  const saveBranding = async (newBranding) => {
    try {
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'config', 'app_branding');
      await setDoc(docRef, newBranding);
      return true;
    } catch (error) {
      console.error("Error saving branding:", error);
      throw error;
    }
  };

  const value = {
    branding,
    brandingForm,
    setBrandingForm,
    saveBranding,
    loading
  };

  return (
    <BrandingContext.Provider value={value}>
      {children}
    </BrandingContext.Provider>
  );
};