// src/seedFirebase.js
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

const governmentSchemesData = [
  {
    name: "PM-KISAN Samman Nidhi",
    category: "Agriculture",
    targetGender: "All",
    minAge: 18,
    maxAge: 100,
    maxIncome: 200000,
    caste: ["All"],
    state: "All",
    benefits: "₹6,000 per year paid in three installments.",
    documentsRequired: ["Aadhaar Card", "Land holding papers", "Bank Account Details"],
    applicationLink: "https://pmkisan.gov.in/"
  },
  {
    name: "Pradhan Mantri Awas Yojana (PMAY)",
    category: "Housing",
    targetGender: "All",
    minAge: 18,
    maxAge: 70,
    maxIncome: 300000,
    caste: ["All"],
    state: "All",
    benefits: "Interest subsidy of up to 6.5% on housing loans.",
    documentsRequired: ["Aadhaar Card", "Income Certificate", "NREGA Job Card"],
    applicationLink: "https://pmaymis.gov.in/"
  },
  {
    name: "Post-Matric Scholarship for OBC/SC Students",
    category: "Education",
    targetGender: "All",
    minAge: 15,
    maxAge: 30,
    maxIncome: 250000,
    caste: ["SC", "ST", "OBC"],
    state: "Karnataka",
    benefits: "Full maintenance allowance and non-refundable fees coverage.",
    documentsRequired: ["Caste Certificate", "Income Certificate", "SSLC Marksheet"],
    applicationLink: "https://scholarships.gov.in/"
  }
];

export const seedDatabaseNow = async () => {
  try {
    const ref = collection(db, "schemes");
    for (const scheme of governmentSchemesData) {
      await addDoc(ref, scheme);
    }
    alert("Success! Firestore database has been populated with real schemes.");
  } catch (err) {
    console.error("Failed to seed database: ", err);
  }
};