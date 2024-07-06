import { db, admin } from "@/lib/firebaseAdmin";
import { Task } from "@/types";

export const getTasks = async (
  businessId: string,
  categoryId: string
): Promise<Task[]> => {
  try {
    const tasksRef = db
      .collection("businesses")
      .doc(businessId)
      .collection("categories")
      .doc(categoryId)
      .collection("tasks");
    const tasksQuerySnapshot = await tasksRef.orderBy("createdAt", "asc").get();
    return tasksQuerySnapshot.docs.map((taskDoc) => {
      const taskData = taskDoc.data();
      return {
        id: taskDoc.id,
        ...taskData,
        descriptions: taskData.descriptions || [],
        completed: taskData.completed || false,
        createdAt: taskData.createdAt.toDate(),
      } as Task;
    });
  } catch (error) {
    console.error("Error fetching tasks: ", error);
    throw error;
  }
};

export const addTask = async (
  businessId: string,
  categoryId: string,
  taskName: string
): Promise<Task> => {
  try {
    const taskRef = db
      .collection("businesses")
      .doc(businessId)
      .collection("categories")
      .doc(categoryId)
      .collection("tasks");
    const newTaskRef = await taskRef.add({
      name: taskName,
      descriptions: [],
      completed: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return {
      id: newTaskRef.id,
      name: taskName,
      descriptions: [],
      completed: false,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error adding task: ", error);
    throw error;
  }
};

export const deleteTask = async (
  businessId: string,
  categoryId: string,
  taskId: string
) => {
  try {
    const taskRef = db
      .collection("businesses")
      .doc(businessId)
      .collection("categories")
      .doc(categoryId)
      .collection("tasks")
      .doc(taskId);
    await taskRef.delete();
  } catch (error) {
    console.error("Error deleting task: ", error);
    throw error;
  }
};

export const toggleTaskCompletedFire = async (
  businessId: string,
  categoryId: string,
  taskId: string
) => {
  try {
    const taskRef = db
      .collection("businesses")
      .doc(businessId)
      .collection("categories")
      .doc(categoryId)
      .collection("tasks")
      .doc(taskId);
    const taskDoc = await taskRef.get();
    if (taskDoc.exists) {
      const taskData = taskDoc.data();
      const updatedTask = { ...taskData, completed: !taskData?.completed };
      await taskRef.update({ completed: updatedTask.completed });
      return updatedTask as Task;
    } else {
      throw new Error("Task not found");
    }
  } catch (error) {
    console.log("Error toggling task completion: ", error);
    throw error;
  }
};

export const addDescription = async (
  businessId: string,
  categoryId: string,
  taskId: string,
  description: string
) => {
  try {
    const taskRef = db
      .collection("businesses")
      .doc(businessId)
      .collection("categories")
      .doc(categoryId)
      .collection("tasks")
      .doc(taskId);
    await taskRef.update({
      descriptions: admin.firestore.FieldValue.arrayUnion({
        text: description,
        createdAt: new Date(),
        completed: false,
      }),
    });

    return { text: description, createdAt: new Date(), completed: false };
  } catch (error) {
    console.error("Error adding description: ", error);
    throw error;
  }
};

export const editDescription = async (
  businessId: string,
  categoryId: string,
  taskId: string,
  oldDescription: { text: string; createdAt: Date; completed: boolean },
  newDescription: string
) => {
  try {
    const taskRef = db
      .collection("businesses")
      .doc(businessId)
      .collection("categories")
      .doc(categoryId)
      .collection("tasks")
      .doc(taskId);
    const taskDoc = await taskRef.get();
    if (taskDoc.exists) {
      const taskData = taskDoc.data();
      const updatedDescriptions = taskData?.descriptions.map(
        (desc: { text: string; createdAt: Date; completed: boolean }) => {
          if (desc.text === oldDescription.text) {
            return { ...desc, text: newDescription };
          }
          return desc;
        }
      );
      await taskRef.update({ descriptions: updatedDescriptions });
    }
  } catch (error) {
    console.error("Error editing description: ", error);
    throw error;
  }
};

export const toggleDescriptionCompleted = async (
  businessId: string,
  categoryId: string,
  taskId: string,
  description: { text: string; createdAt: Date; completed: boolean }
) => {
  try {
    const taskRef = db
      .collection("businesses")
      .doc(businessId)
      .collection("categories")
      .doc(categoryId)
      .collection("tasks")
      .doc(taskId);
    const taskDoc = await taskRef.get();
    if (taskDoc.exists) {
      const taskData = taskDoc.data();
      const updatedDescriptions = taskData?.descriptions.map(
        (desc: { text: string; createdAt: Date; completed: boolean }) => {
          if (desc.text === description.text) {
            return { ...desc, completed: !desc.completed };
          }
          return desc;
        }
      );
      await taskRef.update({ descriptions: updatedDescriptions });
      return { ...taskData, descriptions: updatedDescriptions } as Task;
    }
  } catch (error) {
    console.error("Error toggling description completion: ", error);
    throw error;
  }
};
export const deleteDescription = async (
  businessId: string,
  categoryId: string,
  taskId: string,
  description: { text: string; createdAt: string; completed: boolean }
) => {
  try {
    const taskRef = db
      .collection("businesses")
      .doc(businessId)
      .collection("categories")
      .doc(categoryId)
      .collection("tasks")
      .doc(taskId);

    const taskDoc = await taskRef.get();
    if (taskDoc.exists) {
      const taskData = taskDoc.data();
      const updatedDescriptions = taskData?.descriptions.filter(
        (desc: { text: string; createdAt: string; completed: boolean }) =>
          !(desc.text === description.text)
      );

      await taskRef.update({ descriptions: updatedDescriptions });
    } else {
      throw new Error("Task not found");
    }
  } catch (error) {
    console.error("Error deleting description: ", error);
    throw error;
  }
};
