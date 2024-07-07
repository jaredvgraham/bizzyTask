import { db } from "@/lib/firebaseAdmin";

export const calculateProgress = async (
  businessId: string
): Promise<number> => {
  try {
    const categoriesRef = db
      .collection("businesses")
      .doc(businessId)
      .collection("categories");
    const categoriesSnapshot = await categoriesRef.get();
    const fetchedCategories = categoriesSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    let totalTasks = 0;
    let completedTasks = 0;

    for (const category of fetchedCategories) {
      const tasksRef = db
        .collection("businesses")
        .doc(businessId)
        .collection("categories")
        .doc(category.id)
        .collection("tasks");
      const tasksSnapshot = await tasksRef.get();
      const tasks = tasksSnapshot.docs.map((taskDoc) => ({
        id: taskDoc.id,
        ...taskDoc.data(),
        completed: taskDoc.data().completed, // Ensure 'completed' property is included
      }));

      totalTasks += tasks.length;
      completedTasks += tasks.filter((task) => task.completed).length;
    }

    if (totalTasks > 0) {
      return Math.round((completedTasks / totalTasks) * 100);
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error calculating progress: ", error);
    throw error;
  }
};
