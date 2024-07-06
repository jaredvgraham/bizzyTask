// services/firebaseBusinessService.ts
import { db, admin } from "@/lib/firebaseAdmin";
import { Business } from "@/types";
import webAppTemplate from "@/templates/webApp.json";
// import admin from "firebase-admin";

export const getBusinesses = async (userEmail: string): Promise<Business[]> => {
  try {
    const businessesRef = db.collection("businesses");
    const q = businessesRef.where("teamMembers", "array-contains", userEmail);
    const querySnapshot = await q.get();
    const businesses = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Business[];
    return businesses;
  } catch (error) {
    console.error("Error fetching businesses: ", error);
    throw error;
  }
};

export const createBusiness = async (
  name: string,
  description: string,
  type: string,
  userId: string,
  userEmail: string,
  template: any
): Promise<string> => {
  try {
    const businessRef = await db.collection("businesses").add({
      name,
      description,
      type,
      userId,
      teamMembers: [userEmail],
      progress: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    if (template) {
      for (const category of template.categories) {
        const categoryRef = await db
          .collection("businesses")
          .doc(businessRef.id)
          .collection("categories")
          .add({
            name: category.name,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            completed: false,
          });

        if (category.tasks) {
          for (const task of category.tasks) {
            await db
              .collection("businesses")
              .doc(businessRef.id)
              .collection("categories")
              .doc(categoryRef.id)
              .collection("tasks")
              .add({
                name: task.name,
                descriptions: [
                  {
                    text: task.description,
                    createdAt: new Date(),
                    completed: false,
                  },
                ],
                completed: false,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
              });
          }
        }
      }
    }

    return businessRef.id;
  } catch (error) {
    console.error("Error creating business: ", error);
    throw error;
  }
};

export const deleteBusiness = async (businessId: string): Promise<void> => {
  try {
    const businessRef = db.collection("businesses").doc(businessId);
    await businessRef.delete();
  } catch (error) {
    console.error("Error deleting business: ", error);
    throw error;
  }
};

export const getBusiness = async (businessId: string): Promise<Business> => {
  try {
    const businessRef = db.collection("businesses").doc(businessId);
    const businessDoc = await businessRef.get();
    if (businessDoc.exists) {
      return { id: businessDoc.id, ...businessDoc.data() } as Business;
    }
    throw new Error("Business not found");
  } catch (error) {
    console.error("Error fetching business: ", error);
    throw error;
  }
};
