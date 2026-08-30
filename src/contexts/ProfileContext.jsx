import React, { createContext, useContext, useState, useEffect } from 'react';
import profileService from '../services/profileService';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const result = await profileService.getUserProfile();
      setProfile(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await profileService.updateUserProfile(profileData);
      setProfile(result.data);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeOnboardingStep = async (step) => {
    try {
      await profileService.completeOnboardingStep(step);
      setProfile(prev => ({
        ...prev,
        onboardingStep: step
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateLifeEvents = async (events) => {
    try {
      await profileService.updateLifeEvents(events);
      setProfile(prev => ({
        ...prev,
        selectedLifeEvents: events
      }));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    profile,
    loading,
    error,
    updateProfile,
    completeOnboardingStep,
    updateLifeEvents,
    refreshProfile: loadProfile
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return context;
};

export default ProfileContext;
