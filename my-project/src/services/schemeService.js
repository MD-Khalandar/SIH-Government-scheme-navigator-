// Scheme service - Mock implementation
// Replace with actual API calls later

import { mockSchemes } from '../data/mockSchemes.js';

export const schemeService = {
  // Get all schemes
  getSchemes: async () => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: mockSchemes };
  },

  // Get scheme by ID
  getSchemeById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const scheme = mockSchemes.find(s => s.id === parseInt(id));
    
    if (!scheme) {
      throw new Error("Scheme not found");
    }
    
    return { success: true, data: scheme };
  },

  // Search schemes
  searchSchemes: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const searchQuery = query.toLowerCase();
    const results = mockSchemes.filter(scheme => 
      scheme.name.toLowerCase().includes(searchQuery) ||
      scheme.description.toLowerCase().includes(searchQuery) ||
      scheme.category.toLowerCase().includes(searchQuery) ||
      scheme.ministry.toLowerCase().includes(searchQuery)
    );
    
    return { success: true, data: results };
  },

  // Filter schemes
  filterSchemes: async (filters) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    let results = mockSchemes;
    
    if (filters.state && filters.state !== "all") {
      results = results.filter(s => s.state === filters.state || s.state === "All India");
    }
    
    if (filters.category && filters.category !== "all") {
      results = results.filter(s => s.category === filters.category);
    }
    
    if (filters.ministry && filters.ministry !== "all") {
      results = results.filter(s => s.ministry === filters.ministry);
    }
    
    if (filters.lifeEvent && filters.lifeEvent !== "all") {
      results = results.filter(s => s.lifeEvents.includes(filters.lifeEvent));
    }
    
    return { success: true, data: results };
  },

  // Get schemes by life event
  getSchemesByLifeEvent: async (lifeEvent) => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const results = mockSchemes.filter(scheme => 
      scheme.lifeEvents.includes(lifeEvent)
    );
    
    return { success: true, data: results };
  },

  // Get saved schemes for user
  getSavedSchemes: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const saved = localStorage.getItem("sahayak_saved_schemes");
    if (!saved) {
      return { success: true, data: [] };
    }
    
    const savedIds = JSON.parse(saved);
    const savedSchemes = mockSchemes.filter(s => savedIds.includes(s.id));
    
    return { success: true, data: savedSchemes };
  },

  // Save a scheme
  saveScheme: async (schemeId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const saved = localStorage.getItem("sahayak_saved_schemes");
    let savedIds = saved ? JSON.parse(saved) : [];
    
    if (!savedIds.includes(schemeId)) {
      savedIds.push(schemeId);
      localStorage.setItem("sahayak_saved_schemes", JSON.stringify(savedIds));
    }
    
    return { success: true };
  },

  // Remove saved scheme
  removeSavedScheme: async (schemeId) => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const saved = localStorage.getItem("sahayak_saved_schemes");
    if (saved) {
      const savedIds = JSON.parse(saved).filter(id => id !== schemeId);
      localStorage.setItem("sahayak_saved_schemes", JSON.stringify(savedIds));
    }
    
    return { success: true };
  },

  // Check if scheme is saved
  isSchemeSaved: async (schemeId) => {
    const saved = localStorage.getItem("sahayak_saved_schemes");
    if (!saved) return false;
    return JSON.parse(saved).includes(schemeId);
  }
};

export default schemeService;
