import {
  collection,
  getDocs,
  getDoc,
  doc,
  query,
  where
} from "firebase/firestore";

import { db } from "../firebase";

export const schemeService = {

  // Get all schemes
  getSchemes: async () => {
    const snapshot = await getDocs(collection(db, "schemes"));

    const schemes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      data: schemes
    };
  },

  // Get one scheme
  getSchemeById: async (id) => {

    const snap = await getDoc(doc(db, "schemes", id));

    if (!snap.exists()) {
      throw new Error("Scheme not found");
    }

    return {
      success: true,
      data: {
        id: snap.id,
        ...snap.data()
      }
    };
  },

  // Search
  searchSchemes: async (text) => {

    const snapshot = await getDocs(collection(db, "schemes"));

    const schemes = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(s =>
        s.name.toLowerCase().includes(text.toLowerCase())
      );

    return {
      success: true,
      data: schemes
    };
  },

  // Filter by category
  filterSchemes: async (filters) => {

    let q = collection(db, "schemes");

    if (filters.category && filters.category !== "all") {
      q = query(
        q,
        where("category", "==", filters.category)
      );
    }

    const snapshot = await getDocs(q);

    const schemes = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      data: schemes
    };
  }

};

export default schemeService;

// Match Schemes by Citizen Profile (Eligibility Engine)
  getEligibleSchemes: async (userProfile) => {
    // userProfile = { age: 25, income: 150000, gender: "Female", caste: "OBC", state: "Karnataka" }
    
    // 1. Fetch all schemes from Firebase
    const snapshot = await getDocs(collection(db, "schemes"));
    
    const allSchemes = snapshot.docs.map(d => ({
      id: d.id,
      ...d.data()
    }));

    // 2. Filter schemes according to citizen criteria
    const eligible = allSchemes.filter(scheme => {
      const matchAge = (!scheme.minAge || userProfile.age >= scheme.minAge) &&
                       (!scheme.maxAge || userProfile.age <= scheme.maxAge);
                       
      const matchIncome = !scheme.maxIncome || userProfile.income <= scheme.maxIncome;

      const matchGender = !scheme.targetGender || 
                          scheme.targetGender === "All" || 
                          scheme.targetGender === userProfile.gender;

      const matchState = !scheme.state || 
                         scheme.state === "All" || 
                         scheme.state === userProfile.state;

      const matchCaste = !scheme.caste || 
                         scheme.caste.includes("All") || 
                         scheme.caste.includes(userProfile.caste);

      return matchAge && matchIncome && matchGender && matchState && matchCaste;
    });

    return {
      success: true,
      data: eligible
    };
  } I think I can do it.