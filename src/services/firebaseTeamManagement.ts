import { db, admin } from "@/lib/firebaseAdmin";

export const getTeamMembers = async (businessId: string): Promise<string[]> => {
  try {
    const businessRef = db.collection("businesses").doc(businessId);
    const businessDoc = await businessRef.get();
    if (businessDoc.exists) {
      return businessDoc.data()?.teamMembers || [];
    } else {
      throw new Error("Business does not exist");
    }
  } catch (error) {
    console.log("Error fetching team members: ", error);
    throw error;
  }
};

export const addTeamMember = async (businessId: string, email: string) => {
  try {
    const userRef = db.collection("users").doc(email);
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      const businessRef = db.collection("businesses").doc(businessId);
      await businessRef.update({
        teamMembers: admin.firestore.FieldValue.arrayUnion(email),
      });

      await userRef.update({
        businesses: admin.firestore.FieldValue.arrayUnion(businessId),
      });
    } else {
      throw new Error("User does not exist");
    }
  } catch (error) {
    console.log("Error adding team member: ", error);
    throw error;
  }
};

export const removeTeamMember = async (businessId: string, email: string) => {
  try {
    const businessRef = db.collection("businesses").doc(businessId);
    await businessRef.update({
      teamMembers: admin.firestore.FieldValue.arrayRemove(email),
    });

    const userRef = db.collection("users").doc(email);
    await userRef.update({
      businesses: admin.firestore.FieldValue.arrayRemove(businessId),
    });
  } catch (error) {
    console.log("Error removing team member: ", error);
    throw error;
  }
};
