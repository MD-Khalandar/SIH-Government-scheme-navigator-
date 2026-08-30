import { db } from '../firebase';
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

export const schemeService = {
  getSchemes: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "schemes"));
      const schemes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { success: true, data: schemes };
    } catch (error) {
      console.error("Error fetching schemes:", error);
      return { success: false, data: [], error: error.message };
    }
  },

  getSchemeById: async (id) => {
    try {
      const docRef = doc(db, "schemes", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      }
      throw new Error("Scheme not found");
    } catch (error) {
      console.error("Error fetching scheme details:", error);
      return { success: false, error: error.message };
    }
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