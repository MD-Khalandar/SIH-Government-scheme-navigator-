// Eligibility matching and evaluation logic

export const evaluateEligibility = (userProfile, scheme) => {
  const matchedRules = [];
  const failedRules = [];
  const rules = Array.isArray(scheme?.eligibilityRules) ? scheme.eligibilityRules : [];

  if (rules.length === 0) {
    return {
      isEligible: false,
      matchPercentage: 0,
      matchedRules: [],
      failedRules: [],
      matchCount: 0,
      totalRules: 0
    };
  }

  rules.forEach(rule => {
    const userValue = userProfile?.[rule.field];

    if (userValue === undefined || userValue === null || userValue === '') {
      return;
    }

    const isMatched = evaluateRule(userValue, rule);

    if (isMatched) {
      matchedRules.push(rule);
    } else {
      failedRules.push(rule);
    }
  });

  const totalRules = rules.length;
  const matchPercentage = totalRules > 0 ? Math.round((matchedRules.length / totalRules) * 100) : 0;

  return {
    isEligible: matchPercentage >= 50,
    matchPercentage: Math.max(0, Math.min(100, matchPercentage)),
    matchedRules,
    failedRules,
    matchCount: matchedRules.length,
    totalRules
  };
};

const evaluateRule = (userValue, rule) => {
  const { operator, value } = rule;

  switch (operator) {
    case "==":
      return userValue === value;
    case "!=":
      return userValue !== value;
    case ">":
      return userValue > value;
    case ">=":
      return userValue >= value;
    case "<":
      return userValue < value;
    case "<=":
      return userValue <= value;
    case "in":
      return Array.isArray(value) ? value.includes(userValue) : false;
    default:
      return false;
  }
};

export const getMatchingSchemes = (userProfile, schemes) => {
  return schemes
    .map(scheme => ({
      ...scheme,
      eligibility: evaluateEligibility(userProfile, scheme)
    }))
    .sort((a, b) => b.eligibility.matchPercentage - a.eligibility.matchPercentage);
};

export const getSchemeStatus = (matchPercentage) => {
  if (matchPercentage === 100) return "fully-matched";
  if (matchPercentage >= 75) return "high-match";
  if (matchPercentage >= 50) return "partial-match";
  return "low-match";
};

export const getStatusColor = (status) => {
  const colors = {
    "fully-matched": "bg-green-100 text-green-800",
    "high-match": "bg-blue-100 text-blue-800",
    "partial-match": "bg-yellow-100 text-yellow-800",
    "low-match": "bg-red-100 text-red-800"
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

export const getStatusLabel = (status) => {
  const labels = {
    "fully-matched": "Fully Matched",
    "high-match": "High Match",
    "partial-match": "Needs More Info",
    "low-match": "Low Match"
  };
  return labels[status] || "Unknown";
};
