// Profile service - Mock implementation
// Replace with actual API calls later

export const profileService = {
  // Get user profile
  getUserProfile: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const profileJson = localStorage.getItem("sahayak_profile");
    if (profileJson) {
      return { success: true, data: JSON.parse(profileJson) };
    }
    
    // Default empty profile
    const defaultProfile = {
      age: null,
      gender: null,
      state: null,
      district: null,
      urban: null,
      socialCategory: null,
      disability: null,
      income: null,
      bpl: null,
      occupation: null,
      studying: null,
      lookingForWork: null,
      ownLand: null,
      landholding: null,
      dependents: 0,
      children: 0,
      seniorCitizens: 0,
      ownHouse: null,
      housingCondition: null,
      businessPlanning: null,
      existingBusiness: null,
      businessCategory: null,
      selectedLifeEvents: [],
      onboardingStep: 1
    };
    
    return { success: true, data: defaultProfile };
  },

  // Update user profile
  updateUserProfile: async (profileData) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const current = await profileService.getUserProfile();
    const mergedProfile = { ...current.data, ...profileData };
    localStorage.setItem("sahayak_profile", JSON.stringify(mergedProfile));
    return { success: true, data: mergedProfile };
  },

  // Get onboarding progress
  getOnboardingProgress: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const profile = localStorage.getItem("sahayak_profile");
    if (!profile) {
      return { success: true, progress: 0, step: 1 };
    }
    
    const data = JSON.parse(profile);
    return { success: true, progress: data.onboardingStep || 1, step: data.onboardingStep || 1 };
  },

  // Complete onboarding step
  completeOnboardingStep: async (step) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const profileJson = localStorage.getItem("sahayak_profile");
    let profile = profileJson ? JSON.parse(profileJson) : {};
    
    profile.onboardingStep = step;
    localStorage.setItem("sahayak_profile", JSON.stringify(profile));
    
    return { success: true };
  },

  // Get selected life events
  getSelectedLifeEvents: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const profile = localStorage.getItem("sahayak_profile");
    if (!profile) {
      return { success: true, data: [] };
    }
    
    const data = JSON.parse(profile);
    return { success: true, data: data.selectedLifeEvents || [] };
  },

  // Update selected life events
  updateLifeEvents: async (events) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const profileJson = localStorage.getItem("sahayak_profile");
    let profile = profileJson ? JSON.parse(profileJson) : {};
    
    profile.selectedLifeEvents = events;
    localStorage.setItem("sahayak_profile", JSON.stringify(profile));
    
    return { success: true };
  }
};

export default profileService;
