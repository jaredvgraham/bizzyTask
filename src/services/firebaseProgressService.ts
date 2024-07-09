import { db } from "@/lib/firebaseAdmin";

interface Description {
  text: string;
  createdAt: Date;
  completed: boolean;
}

interface Task {
  id: string;
  name: string;
  descriptions: Description[];
  completed: boolean;
  createdAt: FirebaseFirestore.Timestamp;
}

interface Category {
  id: string;
  name: string;
  completed: boolean;
  createdAt: FirebaseFirestore.Timestamp;
}

export const calculateProgress = async (
  businessId: string
): Promise<number> => {
  try {
    const categoriesRef = db
      .collection("businesses")
      .doc(businessId)
      .collection("categories");
    const categoriesSnapshot = await categoriesRef.get();
    const fetchedCategories: Category[] = categoriesSnapshot.docs.map(
      (doc) => ({
        id: doc.id,
        name: doc.data().name,
        completed: doc.data().completed,
        createdAt: doc.data().createdAt,
      })
    );

    let totalItems = 0;
    let completedItems = 0;

    totalItems += fetchedCategories.length;
    completedItems += fetchedCategories.filter(
      (category) => category.completed
    ).length;

    for (const category of fetchedCategories) {
      const tasksRef = db
        .collection("businesses")
        .doc(businessId)
        .collection("categories")
        .doc(category.id)
        .collection("tasks");
      const tasksSnapshot = await tasksRef.get();
      const tasks: Task[] = tasksSnapshot.docs.map((taskDoc) => ({
        id: taskDoc.id,
        name: taskDoc.data().name,
        descriptions: taskDoc.data().descriptions,
        completed: taskDoc.data().completed,
        createdAt: taskDoc.data().createdAt,
      }));

      for (const task of tasks) {
        totalItems += 1;
        if (task.completed) {
          completedItems += 1;
        }

        if (task.descriptions && Array.isArray(task.descriptions)) {
          for (const description of task.descriptions) {
            totalItems += 1;
            if (description.completed) {
              completedItems += 1;
            }
          }
        }
      }
    }

    if (totalItems > 0) {
      return Math.round((completedItems / totalItems) * 100);
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error calculating progress: ", error);
    throw error;
  }
};
