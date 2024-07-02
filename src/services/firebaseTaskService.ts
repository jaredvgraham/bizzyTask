import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDoc,
  arrayUnion,
  arrayRemove,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Task } from "@/types";

export const getTasks = async (
  businessId: string,
  categoryId: string
): Promise<Task[]> => {
  const tasksRef = collection(
    db,
    "businesses",
    businessId,
    "categories",
    categoryId,
    "tasks"
  );
  const tasksQuery = query(tasksRef, orderBy("createdAt", "asc"));
  const tasksSnapshot = await getDocs(tasksQuery);
  return tasksSnapshot.docs.map((taskDoc) => {
    const taskData = taskDoc.data();
    return {
      id: taskDoc.id,
      ...taskData,
      descriptions: taskData.descriptions || [],
      completed: taskData.completed || false,
      createdAt: taskData.createdAt.toDate(),
    } as Task;
  });
};

export const addTask = async (
  businessId: string,
  categoryId: string,
  taskName: string
): Promise<Task> => {
  const tasksRef = collection(
    db,
    "businesses",
    businessId,
    "categories",
    categoryId,
    "tasks"
  );
  const newTaskRef = await addDoc(tasksRef, {
    name: taskName,
    descriptions: [],
    completed: false,
    createdAt: new Date(),
  });
  return {
    id: newTaskRef.id,
    name: taskName,
    descriptions: [],
    completed: false,
    createdAt: new Date(),
  };
};

export const addDescription = async (
  businessId: string,
  categoryId: string,
  taskId: string,
  description: string
) => {
  const taskRef = doc(
    db,
    "businesses",
    businessId,
    "categories",
    categoryId,
    "tasks",
    taskId
  );
  await updateDoc(taskRef, {
    descriptions: arrayUnion({
      text: description,
      createdAt: new Date(),
      completed: false,
    }),
  });
};

export const editDescription = async (
  businessId: string,
  categoryId: string,
  taskId: string,
  oldDescription: { text: string; createdAt: Date; completed: boolean },
  newDescription: string
) => {
  const taskRef = doc(
    db,
    "businesses",
    businessId,
    "categories",
    categoryId,
    "tasks",
    taskId
  );
  const taskDoc = await getDoc(taskRef);
  if (taskDoc.exists()) {
    const taskData = taskDoc.data();
    const updatedDescriptions = taskData.descriptions.map(
      (desc: { text: string; createdAt: Date; completed: boolean }) => {
        if (desc.text === oldDescription.text) {
          return { ...desc, text: newDescription };
        }
        return desc;
      }
    );
    await updateDoc(taskRef, { descriptions: updatedDescriptions });
  }
};

export const toggleDescriptionCompleted = async (
  businessId: string,
  categoryId: string,
  taskId: string,
  description: { text: string; createdAt: Date; completed: boolean }
) => {
  const taskRef = doc(
    db,
    "businesses",
    businessId,
    "categories",
    categoryId,
    "tasks",
    taskId
  );
  const taskDoc = await getDoc(taskRef);
  if (taskDoc.exists()) {
    const taskData = taskDoc.data();
    const updatedDescriptions = taskData.descriptions.map(
      (desc: { text: string; createdAt: Date; completed: boolean }) => {
        if (desc.text === description.text) {
          return { ...desc, completed: !desc.completed };
        }
        return desc;
      }
    );
    await updateDoc(taskRef, { descriptions: updatedDescriptions });
  }
};

export const deleteTask = async (
  businessId: string,
  categoryId: string,
  taskId: string
) => {
  const taskRef = doc(
    db,
    "businesses",
    businessId,
    "categories",
    categoryId,
    "tasks",
    taskId
  );
  await deleteDoc(taskRef);
};

export const deleteDescription = async (
  businessId: string,
  categoryId: string,
  taskId: string,
  description: { text: string; createdAt: Date; completed: boolean }
) => {
  const taskRef = doc(
    db,
    "businesses",
    businessId,
    "categories",
    categoryId,
    "tasks",
    taskId
  );
  await updateDoc(taskRef, {
    descriptions: arrayRemove(description),
  });
};

export const toggleTaskCompletedFire = async (
  businessId: string,
  categoryId: string,
  taskId: string
) => {
  const taskRef = doc(
    db,
    "businesses",
    businessId,
    "categories",
    categoryId,
    "tasks",
    taskId
  );
  const taskDoc = await getDoc(taskRef);
  if (taskDoc.exists()) {
    const taskData = taskDoc.data();
    await updateDoc(taskRef, {
      completed: !taskData.completed,
    });
  }
};
