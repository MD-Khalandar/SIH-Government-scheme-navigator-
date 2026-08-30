// Eligibility service - Mock implementation
// Replace with actual API calls later

import { evaluateEligibility, getMatchingSchemes } from '../utils/eligibility.js';

export const eligibilityService = {
  // Evaluate eligibility for a scheme
  evaluateEligibility: async (userProfile, scheme) => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const result = evaluateEligibility(userProfile, scheme);
    return { success: true, data: result };
  },

  // Get matching schemes for user
  getMatchingSchemes: async (userProfile, schemes) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const results = getMatchingSchemes(userProfile, schemes);
    return { success: true, data: results };
  },

  // Get eligibility summary
  getEligibilitySummary: async (userProfile, schemes) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const matched = getMatchingSchemes(userProfile, schemes);
    
    const fullyMatched = matched.filter(s => s.eligibility.matchPercentage === 100);
    const highMatch = matched.filter(s => s.eligibility.matchPercentage >= 50);
    const needsMore = matched.filter(s => s.eligibility.matchPercentage >= 50 && s.eligibility.matchPercentage < 75);
    const lowMatch = matched.filter(s => s.eligibility.matchPercentage < 50);

    const totalBenefit = matched.reduce((sum, scheme) => {
      if (scheme.eligibility.matchPercentage >= 50) {
        return sum + (scheme.benefit?.amount || 0);
      }
      return sum;
    }, 0);

    return {
      success: true,
      data: {
        totalSchemes: schemes.length,
        fullyMatched: fullyMatched.length,
        highMatch: highMatch.length,
        needsMore: needsMore.length,
        lowMatch: lowMatch.length,
        potentialBenefit: totalBenefit,
        schemes: matched
      }
    };
  },

  // Get eligibility gaps
  getEligibilityGaps: async (userProfile, scheme) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const evaluation = evaluateEligibility(userProfile, scheme);
    
    const gaps = evaluation.failedRules.map(rule => {
      const userValue = userProfile[rule.field];
      return {
        field: rule.field,
        required: rule.value,
        current: userValue,
        operator: rule.operator
      };
    });
    
    return { success: true, data: gaps };
  }
};

export default eligibilityService;
