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
} from 'firebase/firestore';

export const schemeService = {
  // Get all schemes from Firestore
  getSchemes: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "schemes"));
      const schemes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: schemes };
    } catch (error) {
      console.error("Error fetching schemes:", error);
      return { success: false, error: error.message };
    }
  },

  // Get scheme by Firestore document ID
  getSchemeById: async (id) => {
    try {
      const docRef = doc(db, "schemes", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        throw new Error("Scheme not found");
      }
    } catch (error) {
      console.error("Error fetching scheme details:", error);
      return { success: false, error: error.message };
    }
  },

  // Get eligible schemes based on demographic user criteria
  getEligibleSchemes: async (userProfile) => {
    try {
      const querySnapshot = await getDocs(collection(db, "schemes"));
      const allSchemes = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      const eligible = allSchemes.filter(scheme => {
        // Age filter check
        if (scheme.minAge && userProfile.age < scheme.minAge) return false;
        if (scheme.maxAge && userProfile.age > scheme.maxAge) return false;

        // Income threshold check
        if (scheme.maxIncome && userProfile.income > scheme.maxIncome) return false;

        // Gender check
        if (scheme.targetGender && scheme.targetGender !== "All" && scheme.targetGender !== userProfile.gender) {
          return false;
        }

        // State / Region check
        if (scheme.state && scheme.state !== "All" && scheme.state !== userProfile.state) {
          return false;
        }

        return true;
      });

      return { success: true, data: eligible };
    } catch (error) {
      console.error("Error matching eligibility:", error);
      return { success: false, error: error.message };
    }
  },

  // Search schemes in Firestore
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
      return { success: false, error: error.message };
    }
  },

  // Get saved schemes for a user from Firestore
  getSavedSchemes: async (userId) => {
    try {
      const q = query(
        collection(db, "saved_schemes"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);
      const saved = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { success: true, data: saved };
    } catch (error) {
      console.error("Error fetching saved schemes:", error);
      return { success: false, error: error.message };
    }
  },

  // Save a scheme to Firestore
  saveScheme: async (userId, scheme) => {
    try {
      const savedRef = collection(db, "saved_schemes");
      const docRef = await addDoc(savedRef, {
        userId,
        schemeId: scheme.id || scheme,
        schemeName: scheme.name || "Scheme",
        category: scheme.category || "General",
        savedAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error saving scheme:", error);
      return { success: false, error: error.message };
    }
  },

  // Submit an application to Firestore
  applyForScheme: async (userId, scheme) => {
    try {
      const appsRef = collection(db, "applications");
      const docRef = await addDoc(appsRef, {
        userId,
        schemeId: scheme.id,
        schemeName: scheme.name,
        category: scheme.category || "General",
        status: "Submitted",
        appliedAt: new Date().toISOString()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error applying for scheme:", error);
      return { success: false, error: error.message };
    }
  },

  // Get user's submitted applications
  getUserApplications: async (userId) => {
    try {
      const q = query(
        collection(db, "applications"),
        where("userId", "==", userId)
      );
      const snapshot = await getDocs(q);
      const apps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return { success: true, data: apps };
    } catch (error) {
      console.error("Error fetching applications:", error);
      return { success: false, error: error.message };
    }
  }
};

export default schemeService;