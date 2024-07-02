import { db } from "@/lib/firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

// Function to add a user to a team
export const addUserToTeam = async (businessId: string, userId: string) => {
  const businessRef = doc(db, "businesses", businessId);
  await updateDoc(businessRef, {
    team: arrayUnion(userId),
  });
};

// Function to remove a user from a team
export const removeUserFromTeam = async (
  businessId: string,
  userId: string
) => {
  const businessRef = doc(db, "businesses", businessId);
  await updateDoc(businessRef, {
    team: arrayRemove(userId),
  });
};
