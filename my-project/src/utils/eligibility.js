// Eligibility matching and evaluation logic

const normalizeValue = (value) => String(value ?? '').trim().toLowerCase();

const parseAmount = (text) => {
  const match = String(text).match(/(\d+(?:,\d+)?(?:\.\d+)?)(?:\s*(?:lakh|lac|k))?/i);
  if (!match) return null;

  let numericValue = Number(match[1].replace(/,/g, ''));
  const suffix = String(text).match(/(?:lakh|lac|k)/i)?.[0]?.toLowerCase();
  if (suffix && ['lakh', 'lac', 'k'].includes(suffix)) {
    numericValue *= suffix === 'k' ? 1000 : 100000;
  }
  return numericValue;
};

const getSchemeRules = (scheme) => {
  if (Array.isArray(scheme.eligibilityRules) && scheme.eligibilityRules.length > 0) {
    return scheme.eligibilityRules;
  }

  if (!Array.isArray(scheme.eligibilityCriteria) || scheme.eligibilityCriteria.length === 0) {
    return [];
  }

  const combinedText = scheme.eligibilityCriteria.join(' ').toLowerCase();
  const rules = [];

  const addRule = (field, operator, value) => {
    if (value === undefined || value === null || value === '') return;
    rules.push({ field, operator, value });
  };

  const ageMatch = String(combinedText).match(/(?:age|aged?|years?)\s*(?:above|over|more than|minimum|min|from)?\s*(\d+)/i);
  if (ageMatch) addRule('age', '>=', Number(ageMatch[1]));

  const incomeMatch = String(combinedText).match(/(?:annual|family)?\s*(?:income|earning)\s*(?:up to|below|less than|not exceeding|within)?\s*₹?\s*(\d+(?:,\d+)?(?:\.\d+)?(?:\s*(?:lakh|lac|k))?)/i);
  if (incomeMatch) {
    const parsed = parseAmount(incomeMatch[0]);
    if (parsed) addRule('income', '<=', parsed);
  }

  if (/women|woman|female|girl/.test(combinedText)) addRule('gender', '==', 'Female');
  if (/men|male|boy/.test(combinedText)) addRule('gender', '==', 'Male');
  if (/farmer|agricultur/.test(combinedText)) addRule('occupation', '==', 'Farmer');
  if (/student|scholarship|education/.test(combinedText)) addRule('studying', '==', 'Yes');
  if (/unemployed|job seeker|looking for work/.test(combinedText)) addRule('lookingForWork', '==', 'Yes');
  if (/bpl|below poverty/.test(combinedText)) addRule('bpl', '==', 'Yes');
  if (/own land|landholder|landholding/.test(combinedText)) addRule('ownLand', '==', 'Yes');
  if (/disability/.test(combinedText)) addRule('disability', '==', 'Yes');
  if (/senior citizen|above 60|60 years/.test(combinedText)) addRule('age', '>=', 60);

  return rules;
};

const inferTextualMatch = (userProfile, scheme) => {
  const text = [
    ...(Array.isArray(scheme.eligibilityCriteria) ? scheme.eligibilityCriteria : []),
    scheme.name,
    scheme.description,
    scheme.category,
    scheme.ministry
  ].join(' ').toLowerCase();

  let score = 0;
  const profileValues = {
    age: Number(userProfile?.age) || null,
    income: Number(userProfile?.income) || null,
    gender: normalizeValue(userProfile?.gender),
    occupation: normalizeValue(userProfile?.occupation),
    studying: normalizeValue(userProfile?.studying),
    lookingForWork: normalizeValue(userProfile?.lookingForWork),
    bpl: normalizeValue(userProfile?.bpl),
    ownLand: normalizeValue(userProfile?.ownLand),
    disability: normalizeValue(userProfile?.disability)
  };

  if (profileValues.age !== null && /\b(?:age|aged?|years?)\b/.test(text)) score += 20;
  if (profileValues.income !== null && /\b(?:income|earning|annual)\b/.test(text)) score += 20;
  if (profileValues.gender && /female|women|woman|male|men/.test(text) && /female|women|woman|male|men/.test(profileValues.gender)) score += 20;
  if (profileValues.occupation && /farmer|student|salaried|unemployed|self-employed/.test(text) && /farmer|student|salaried|unemployed|self-employed/.test(profileValues.occupation)) score += 20;
  if (profileValues.studying && /student|education/.test(text) && profileValues.studying === 'yes') score += 15;
  if (profileValues.lookingForWork && /unemployed|job seeker|job/.test(text) && profileValues.lookingForWork === 'yes') score += 15;
  if (profileValues.bpl && /bpl|poverty/.test(text) && profileValues.bpl === 'yes') score += 15;
  if (profileValues.ownLand && /land|farmer|agriculture/.test(text) && profileValues.ownLand === 'yes') score += 15;
  if (profileValues.disability && /disability/.test(text) && profileValues.disability === 'yes') score += 15;

  return Math.min(100, Math.max(15, score));
};

const hasMeaningfulProfileInfo = (userProfile = {}) => {
  const values = [
    userProfile?.age,
    userProfile?.income,
    userProfile?.gender,
    userProfile?.occupation,
    userProfile?.studying,
    userProfile?.lookingForWork,
    userProfile?.bpl,
    userProfile?.ownLand,
    userProfile?.disability,
    userProfile?.state
  ];

  return values.some((value) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'number') return value > 0;
    const normalized = String(value).trim().toLowerCase();
    return normalized !== '' && normalized !== 'any' && normalized !== 'select' && normalized !== 'not applicable';
  });
};

export const evaluateEligibility = (userProfile, scheme) => {
  const derivedRules = getSchemeRules(scheme);

  if (!hasMeaningfulProfileInfo(userProfile) || !derivedRules.length) {
    const fallbackPercentage = hasMeaningfulProfileInfo(userProfile)
      ? inferTextualMatch(userProfile, scheme)
      : 0;

    return {
      isEligible: fallbackPercentage >= 50,
      matchPercentage: Math.round(fallbackPercentage),
      matchedRules: [],
      failedRules: [],
      matchCount: 0,
      totalRules: 0
    };
  }

  const matchedRules = [];
  const failedRules = [];

  derivedRules.forEach(rule => {
    const userValue = userProfile?.[rule.field];
    const isMatched = evaluateRule(userValue, rule);

    if (isMatched) {
      matchedRules.push(rule);
    } else {
      failedRules.push(rule);
    }
  });

  const totalRules = derivedRules.length;
  let matchPercentage = totalRules > 0 ? (matchedRules.length / totalRules) * 100 : 0;

  if (matchedRules.length <= 2) {
    matchPercentage = Math.min(matchPercentage, 70);
  }

  if (matchedRules.length === 1) {
    matchPercentage = Math.min(matchPercentage, 60);
  }

  if (matchedRules.length === 2 && totalRules === 2) {
    matchPercentage = Math.min(matchPercentage, 75);
  }

  return {
    isEligible: failedRules.length === 0 && matchPercentage >= 65,
    matchPercentage: Math.round(matchPercentage),
    matchedRules,
    failedRules,
    matchCount: matchedRules.length,
    totalRules
  };
};

const evaluateRule = (userValue, rule) => {
  const { operator, value } = rule;

  if (userValue === undefined || userValue === null || userValue === '') {
    return false;
  }

  switch (operator) {
    case '==':
      return normalizeValue(userValue) === normalizeValue(value);
    case '!=':
      return normalizeValue(userValue) !== normalizeValue(value);
    case '>':
      return Number(userValue) > Number(value);
    case '>=':
      return Number(userValue) >= Number(value);
    case '<':
      return Number(userValue) < Number(value);
    case '<=':
      return Number(userValue) <= Number(value);
    case 'in':
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
