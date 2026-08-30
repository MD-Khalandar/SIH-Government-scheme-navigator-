import { db } from "../../firebase";
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  query, 
  where, 
  deleteDoc 
} from 'firebase/firestore';

const fallbackSchemeExtras = [
  {
    id: 'extra-education-scholarship',
    name: 'Merit Scholarship for Higher Education',
    description: 'Scholarship support for students pursuing higher education and professional courses.',
    category: 'Education',
    ministry: 'Ministry of Education',
    state: 'All India',
    lifeEvents: ['graduate', 'education'],
    benefit: { amount: 25000, frequency: 'annual', currency: 'INR' },
    eligibilityRules: [],
    eligibilityCriteria: ['student', 'graduate', 'college or university', 'annual family income below threshold'],
    documents: ['Student ID', 'Income certificate', 'Bank account'],
    applicationSteps: ['Check eligibility', 'Upload documents', 'Apply online'],
    officialUrl: 'https://example.gov.in/education/scholarship',
    lastVerified: null,
    source: 'Fallback dataset',
    applicationMode: 'Online',
    deadline: null,
    keywords: ['scholarship', 'education', 'student', 'graduate', 'college'],
    immediateCause: 'graduate'
  },
  {
    id: 'extra-maternity-support',
    name: 'Maternity Benefit Support',
    description: 'Financial support for pregnant women and mothers during childbirth and early care.',
    category: 'Healthcare',
    ministry: 'Ministry of Women and Child Development',
    state: 'All India',
    lifeEvents: ['child birth', 'pregnancy'],
    benefit: { amount: 12000, frequency: 'one-time', currency: 'INR' },
    eligibilityRules: [],
    eligibilityCriteria: ['pregnant women', 'new mother', 'residency proof'],
    documents: ['Aadhaar', 'Medical certificate', 'Bank details'],
    applicationSteps: ['Register', 'Submit documents', 'Receive benefit'],
    officialUrl: 'https://example.gov.in/women/maternity',
    lastVerified: null,
    source: 'Fallback dataset',
    applicationMode: 'Online',
    deadline: null,
    keywords: ['maternity', 'pregnancy', 'new mother', 'child birth', 'health'],
    immediateCause: 'child birth'
  },
  {
    id: 'extra-farmer-support',
    name: 'Agriculture Input and Crop Support',
    description: 'Support for small and marginal farmers for input cost, crop loss and agricultural upliftment.',
    category: 'Agriculture',
    ministry: 'Ministry of Agriculture and Farmers Welfare',
    state: 'All India',
    lifeEvents: ['farmer', 'agriculture'],
    benefit: { amount: 30000, frequency: 'annual', currency: 'INR' },
    eligibilityRules: [],
    eligibilityCriteria: ['farmer', 'landholder', 'small or marginal farmer'],
    documents: ['Land records', 'Aadhaar', 'Bank account'],
    applicationSteps: ['Apply through portal', 'Submit records', 'Receive support'],
    officialUrl: 'https://example.gov.in/agri/support',
    lastVerified: null,
    source: 'Fallback dataset',
    applicationMode: 'Online',
    deadline: null,
    keywords: ['farmer', 'agriculture', 'crop', 'landholding', 'kisan'],
    immediateCause: 'farmer'
  },
  {
    id: 'extra-employment-support',
    name: 'Skill and Employment Assistance',
    description: 'Support for unemployed youth and job seekers through training, placement and livelihood support.',
    category: 'Employment',
    ministry: 'Ministry of Labour and Employment',
    state: 'All India',
    lifeEvents: ['employment', 'job'],
    benefit: { amount: 20000, frequency: 'one-time', currency: 'INR' },
    eligibilityRules: [],
    eligibilityCriteria: ['unemployed', 'youth', 'job seeker', 'training support'],
    documents: ['Aadhaar', 'Education certificate', 'Resume'],
    applicationSteps: ['Register', 'Training', 'Apply for job support'],
    officialUrl: 'https://example.gov.in/labour/employment',
    lastVerified: null,
    source: 'Fallback dataset',
    applicationMode: 'Online',
    deadline: null,
    keywords: ['employment', 'job', 'unemployed', 'skill', 'work', 'training'],
    immediateCause: 'employment'
  },
  {
    id: 'extra-pension-scheme',
    name: 'Senior Citizen Pension Support',
    description: 'Pension and social security assistance for senior citizens and elderly citizens.',
    category: 'Social Security',
    ministry: 'Ministry of Social Justice',
    state: 'All India',
    lifeEvents: ['senior citizen', 'old age'],
    benefit: { amount: 15000, frequency: 'monthly', currency: 'INR' },
    eligibilityRules: [],
    eligibilityCriteria: ['senior citizen', 'age above 60', 'income below threshold'],
    documents: ['Age proof', 'Aadhaar', 'Bank account'],
    applicationSteps: ['Check age criteria', 'Submit form', 'Receive pension'],
    officialUrl: 'https://example.gov.in/social/pension',
    lastVerified: null,
    source: 'Fallback dataset',
    applicationMode: 'Online',
    deadline: null,
    keywords: ['pension', 'senior citizen', 'elderly', 'retired', 'old age'],
    immediateCause: 'senior citizen'
  }
];

const allSchemeData = mockSchemes.filter((scheme) => {
  const name = String(scheme.name || '').toLowerCase();
  const cause = String(scheme.immediateCause || '').toLowerCase();
  return cause !== 'general' && name.length > 0 && (scheme.keywords || []).length >= 3;
});

const normalizeText = (value = '') => String(value)
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const tokenizeQuery = (query = '') =>
  normalizeText(query)
    .split(' ')
    .filter(Boolean)
    .filter(token => token.length > 1);

const buildSearchableText = (scheme) => {
  const fields = [
    scheme.name,
    scheme.description,
    scheme.category,
    scheme.ministry,
    scheme.state,
    scheme.applicationMode,
    scheme.source,
    ...(scheme.eligibilityCriteria || []),
    ...(scheme.documents || []),
    ...(scheme.keywords || []),
    ...(scheme.lifeEvents || []),
    scheme.immediateCause
  ];

  return normalizeText(fields.join(' '));
};

export const schemeService = {
  getSchemes: async () => {
<<<<<<< HEAD
    try {
      const querySnapshot = await getDocs(collection(db, "schemes"));
      const schemes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { success: true, data: schemes };
    } catch (error) {
      console.error("Error fetching schemes:", error);
      return { success: false, data: [], error: error.message };
    }
=======
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return { success: true, data: allSchemeData };
>>>>>>> 2e44ea2afdbd81a34a6ecc911f0ffb84951e8089
  },

  getSchemeById: async (id) => {
<<<<<<< HEAD
    try {
      const docRef = doc(db, "schemes", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      }
=======
    await new Promise(resolve => setTimeout(resolve, 600));
    const scheme = allSchemeData.find(s => String(s.id) === String(id));

    if (!scheme) {
>>>>>>> 2e44ea2afdbd81a34a6ecc911f0ffb84951e8089
      throw new Error("Scheme not found");
    } catch (error) {
      console.error("Error fetching scheme details:", error);
      return { success: false, error: error.message };
    }
<<<<<<< HEAD
  },

  getEligibleSchemes: async (userProfile) => {
    try {
      const querySnapshot = await getDocs(collection(db, "schemes"));
      const allSchemes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const eligible = allSchemes.filter(scheme => {
        if (scheme.minAge && userProfile.age < scheme.minAge) return false;
        if (scheme.maxAge && userProfile.age > scheme.maxAge) return false;
        if (scheme.maxIncome && userProfile.income > scheme.maxIncome) return false;
        if (scheme.targetGender && scheme.targetGender !== "All" && scheme.targetGender !== userProfile.gender) return false;
        if (scheme.state && scheme.state !== "All" && scheme.state !== userProfile.state) return false;
        return true;
      });

      return { success: true, data: eligible };
    } catch (error) {
      console.error("Error matching eligibility:", error);
      return { success: false, data: [], error: error.message };
    }
  },

  searchSchemes: async (searchQuery) => {
    try {
      const querySnapshot = await getDocs(collection(db, "schemes"));
      const term = searchQuery.toLowerCase();
      const results = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(scheme => 
          (scheme.name && scheme.name.toLowerCase().includes(term)) ||
          (scheme.description && scheme.description.toLowerCase().includes(term)) ||
          (scheme.category && scheme.category.toLowerCase().includes(term))
        );
      return { success: true, data: results };
    } catch (error) {
      console.error("Error searching schemes:", error);
      return { success: false, data: [], error: error.message };
    }
=======

    return { success: true, data: scheme };
  },

  // Search schemes
  searchSchemes: async (query) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const trimmedQuery = normalizeText(query);
    if (!trimmedQuery) {
      return { success: true, data: allSchemeData.slice(0, 20) };
    }

    const tokens = tokenizeQuery(trimmedQuery);
    const results = allSchemeData.filter((scheme) => {
      const searchable = buildSearchableText(scheme);
      if (tokens.length === 0) return true;

      const matchesAny = tokens.some(token => searchable.includes(token));
      const matchesCause = tokens.some(token => normalizeText(scheme.immediateCause || '').includes(token));
      const matchesKeywords = (scheme.keywords || []).some(keyword => tokens.some(token => normalizeText(keyword).includes(token)));
      return matchesAny || matchesCause || matchesKeywords;
    });

    return { success: true, data: results.length > 0 ? results : allSchemeData.slice(0, 12) };
  },

  // Filter schemes
  filterSchemes: async (filters = {}) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    let results = allSchemeData;

    if (filters.state && filters.state !== 'all') {
      const targetState = String(filters.state).toLowerCase();
      results = results.filter(s => {
        const schemeState = String(s.state || '').toLowerCase();
        return schemeState === targetState || schemeState === 'all india';
      });
    }

    if (filters.category && filters.category !== 'all') {
      const category = String(filters.category).toLowerCase();
      results = results.filter(s => {
        const schemeCategory = String(s.category || '').toLowerCase();
        return schemeCategory.includes(category) || schemeCategory === 'education' && category.includes('education');
      });
    }

    if (filters.ministry && filters.ministry !== 'all') {
      const ministryQuery = String(filters.ministry).toLowerCase();
      results = results.filter(s => String(s.ministry || '').toLowerCase().includes(ministryQuery));
    }

    if (filters.lifeEvent && filters.lifeEvent !== 'all') {
      results = results.filter(s => (s.lifeEvents || []).some(event => String(event).toLowerCase().includes(String(filters.lifeEvent).toLowerCase())));
    }

    if (filters.cause && filters.cause !== 'all') {
      const causeQuery = String(filters.cause).toLowerCase();
      results = results.filter(s => {
        const matchByCause = normalizeText(s.immediateCause || '').includes(causeQuery);
        const matchByKeyword = (s.keywords || []).some(keyword => normalizeText(keyword).includes(causeQuery));
        return matchByCause || matchByKeyword || String(s.name || '').toLowerCase().includes(causeQuery);
      });
    }

    if (filters.gender && filters.gender !== 'all') {
      const gender = String(filters.gender).toLowerCase();
      results = results.filter((scheme) => {
        const ruleMatch = (scheme.eligibilityRules || []).some(rule => rule.field === 'gender' && String(rule.value).toLowerCase() === gender);
        const text = [scheme.name, scheme.description, ...(scheme.keywords || []), ...(scheme.eligibilityCriteria || [])].join(' ').toLowerCase();
        return ruleMatch || text.includes(gender) || !(scheme.eligibilityRules || []).some(rule => rule.field === 'gender');
      });
    }

    if (filters.occupation && filters.occupation !== 'all') {
      const occupation = String(filters.occupation).toLowerCase();
      results = results.filter((scheme) => {
        const ruleMatch = (scheme.eligibilityRules || []).some(rule => rule.field === 'occupation' && String(rule.value).toLowerCase() === occupation);
        const text = [scheme.name, scheme.description, ...(scheme.keywords || []), ...(scheme.eligibilityCriteria || [])].join(' ').toLowerCase();
        return ruleMatch || text.includes(occupation) || text.includes('employment') || text.includes('student') || text.includes('farmer');
      });
    }

    if (filters.age) {
      const age = Number(filters.age);
      if (!Number.isNaN(age)) {
        results = results.filter((scheme) => {
          const ageRules = (scheme.eligibilityRules || []).filter(rule => rule.field === 'age');
          if (ageRules.length === 0) return true;
          return ageRules.some(rule => {
            const threshold = Number(rule.value);
            if (Number.isNaN(threshold)) return true;
            if (rule.operator === '>=' && age >= threshold) return true;
            if (rule.operator === '<=' && age <= threshold) return true;
            if (rule.operator === '>' && age > threshold) return true;
            if (rule.operator === '<' && age < threshold) return true;
            return false;
          });
        });
      }
    }

    if (filters.income) {
      const income = Number(filters.income);
      if (!Number.isNaN(income)) {
        results = results.filter((scheme) => {
          const incomeRules = (scheme.eligibilityRules || []).filter(rule => rule.field === 'income');
          if (incomeRules.length === 0) return true;
          return incomeRules.some(rule => {
            const limit = Number(rule.value);
            if (Number.isNaN(limit)) return true;
            if (rule.operator === '<=' && income <= limit) return true;
            if (rule.operator === '>' && income > limit) return true;
            if (rule.operator === '<' && income < limit) return true;
            if (rule.operator === '>=' && income >= limit) return true;
            return false;
          });
        });
      }
    }

    return { success: true, data: results.length > 0 ? results : allSchemeData.slice(0, 12) };
>>>>>>> 2e44ea2afdbd81a34a6ecc911f0ffb84951e8089
  },

  getSavedSchemes: async (userId) => {
    try {
      if (!userId) return { success: true, data: [] };
      const q = query(collection(db, "saved_schemes"), where("userId", "==", userId));
      const snapshot = await getDocs(q);
      const saved = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { success: true, data: saved };
    } catch (error) {
      console.error("Error fetching saved schemes:", error);
      return { success: false, data: [], error: error.message };
    }
  },

  saveScheme: async (userId, schemeId) => {
    try {
      if (!userId) return { success: false, error: "User unauthenticated" };
      const docRef = await addDoc(collection(db, "saved_schemes"), {
        userId,
        schemeId,
        savedAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error saving scheme:", error);
      return { success: false, error: error.message };
    }
  },

  removeSavedScheme: async (userId, schemeId) => {
    try {
      if (!userId) return { success: false };
      const q = query(
        collection(db, "saved_schemes"), 
        where("userId", "==", userId), 
        where("schemeId", "==", schemeId)
      );
      const snapshot = await getDocs(q);
      snapshot.docs.forEach(async (document) => {
        await deleteDoc(doc(db, "saved_schemes", document.id));
      });
      return { success: true };
    } catch (error) {
      console.error("Error removing saved scheme:", error);
      return { success: false, error: error.message };
    }
  }
};

export default schemeService;