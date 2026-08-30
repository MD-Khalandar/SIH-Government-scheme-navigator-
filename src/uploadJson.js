import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { mockSchemes as schemesData } from "./data/mockSchemes"; // Path to your json file

export const uploadJsonToFirebase = async () => {
  try {
    const schemesRef = collection(db, "schemes");
    
    console.log("Starting upload of", schemesData.length, "schemes...");

    for (const scheme of schemesData) {
      await addDoc(schemesRef, scheme);
    }

    alert(`Success! Uploaded ${schemesData.length} schemes into Firebase!`);
  } catch (error) {
    console.error("Error uploading JSON to Firebase:", error);
    alert("Upload failed. Check console for error.");
  }
};