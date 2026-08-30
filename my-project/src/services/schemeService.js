<<<<<<< HEAD
import { db, hasFirebaseConfig } from '../../firebase';
import { mockSchemes, demoSchemes } from '../data/mockSchemes';
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  query,
  where,
  deleteDoc
=======
import { db } from '../../firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  query, 
  where, 
  deleteDoc 
>>>>>>> b56d7e6ad83957ac5c6c46c6aa7fac28726adae3
} from 'firebase/firestore';

const fallbackSchemes = Array.isArray(mockSchemes) && mockSchemes.length > 0
  ? mockSchemes
  : Array.isArray(demoSchemes) && demoSchemes.length > 0
    ? demoSchemes
    : [];

const getSchemeCollection = async () => {
  if (!db || !hasFirebaseConfig) {
    return { success: true, data: fallbackSchemes, source: 'fallback' };
  }

  try {
    const querySnapshot = await getDocs(collection(db, 'schemes'));
    const schemes = querySnapshot.docs.map((item) => ({ id: item.id, ...item.data() }));

    if (!schemes.length) {
      return { success: true, data: fallbackSchemes, source: 'fallback-empty' };
    }

    return { success: true, data: schemes, source: 'firestore' };
  } catch (error) {
    console.error('Error fetching schemes:', error);
    return { success: true, data: fallbackSchemes, source: 'fallback-error', error: error.message };
  }
};

export const schemeService = {
  getSchemes: async () => {
    return getSchemeCollection();
  },

  getSchemeById: async (id) => {
    try {
      const schemeList = (await getSchemeCollection()).data;
      const fallbackMatch = schemeList.find((scheme) => String(scheme.id) === String(id));

      if (fallbackMatch) {
        return { success: true, data: fallbackMatch };
      }

      if (!db || !hasFirebaseConfig) {
        throw new Error('Scheme not found');
      }

      const docRef = doc(db, 'schemes', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      }
      throw new Error('Scheme not found');
    } catch (error) {
      console.error('Error fetching scheme details:', error);
      return { success: false, error: error.message };
    }
  },

  getEligibleSchemes: async (userProfile) => {
    try {
      const { data: allSchemes } = await getSchemeCollection();

      const eligible = allSchemes.filter((scheme) => {
        if (scheme.minAge && userProfile.age < scheme.minAge) return false;
        if (scheme.maxAge && userProfile.age > scheme.maxAge) return false;
        if (scheme.maxIncome && userProfile.income > scheme.maxIncome) return false;
        if (scheme.targetGender && scheme.targetGender !== 'All' && scheme.targetGender !== userProfile.gender) return false;
        if (scheme.state && scheme.state !== 'All' && scheme.state !== userProfile.state) return false;
        return true;
      });

      return { success: true, data: eligible };
    } catch (error) {
      console.error('Error matching eligibility:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  searchSchemes: async (searchQuery) => {
    try {
      const { data: allSchemes } = await getSchemeCollection();
      const term = String(searchQuery || '').trim().toLowerCase();

      if (!term) {
        return { success: true, data: allSchemes };
      }

      const results = allSchemes.filter((scheme) => {
        const text = [
          scheme.name,
          scheme.description,
          scheme.category,
          scheme.ministry,
          scheme.state,
          ...(scheme.keywords || []),
          ...(scheme.eligibilityCriteria || []),
          ...(scheme.documents || [])
        ].join(' ').toLowerCase();

        return text.includes(term);
      });

      return { success: true, data: results };
    } catch (error) {
      console.error('Error searching schemes:', error);
      return { success: false, data: [], error: error.message };
    }
  },

  // Added Missing Bookmark / Saved Schemes Handlers
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
