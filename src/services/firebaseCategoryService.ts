// import {
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   addDoc,
//   deleteDoc,
//   doc,
//   updateDoc,
//   getDoc,
// } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { Category, Task } from "@/types";

// export const getCategoriesWithTasks = async (
//   businessId: string
// ): Promise<Category[]> => {
//   const categoriesRef = collection(db, "businesses", businessId, "categories");
//   const categoriesQuery = query(categoriesRef, orderBy("createdAt", "asc"));
//   const categoriesSnapshot = await getDocs(categoriesQuery);
//   const fetchedCategories = await Promise.all(
//     categoriesSnapshot.docs.map(async (categoryDoc) => {
//       const categoryData = categoryDoc.data();
//       const tasks = await getTasks(businessId, categoryDoc.id);
//       return {
//         id: categoryDoc.id,
//         ...categoryData,
//         tasks,
//         completed: categoryData.completed || false,
//         createdAt: categoryData.createdAt.toDate(),
//       } as Category;
//     })
//   );
//   return fetchedCategories;
// };

// export const getTasks = async (
//   businessId: string,
//   categoryId: string
// ): Promise<Task[]> => {
//   const tasksRef = collection(
//     db,
//     "businesses",
//     businessId,
//     "categories",
//     categoryId,
//     "tasks"
//   );
//   const tasksQuery = query(tasksRef, orderBy("createdAt", "asc"));
//   const tasksSnapshot = await getDocs(tasksQuery);
//   return tasksSnapshot.docs.map((taskDoc) => {
//     const taskData = taskDoc.data();
//     return {
//       id: taskDoc.id,
//       ...taskData,
//       descriptions: taskData.descriptions || [],
//       completed: taskData.completed || false,
//       createdAt: taskData.createdAt.toDate(),
//     } as Task;
//   });
// };

// export const createCategory = async (
//   businessId: string,
//   name: string
// ): Promise<Category> => {
//   const categoriesRef = collection(db, "businesses", businessId, "categories");
//   const newCategoryRef = await addDoc(categoriesRef, {
//     name,
//     completed: false,
//     createdAt: new Date(),
//   });
//   return {
//     id: newCategoryRef.id,
//     name,
//     tasks: [],
//     completed: false,
//     createdAt: new Date(),
//   };
// };

// export const deleteCategory = async (
//   businessId: string,
//   categoryId: string
// ): Promise<void> => {
//   const categoryRef = doc(
//     db,
//     "businesses",
//     businessId,
//     "categories",
//     categoryId
//   );
//   await deleteDoc(categoryRef);
// };

// export const updateCategoryCompletion = async (
//   businessId: string,
//   categoryId: string
// ): Promise<Category> => {
//   const categoryRef = doc(
//     db,
//     "businesses",
//     businessId,
//     "categories",
//     categoryId
//   );
//   const categoryDoc = await getDoc(categoryRef);
//   if (categoryDoc.exists()) {
//     const categoryData = categoryDoc.data();
//     const updatedCategory = {
//       ...categoryData,
//       completed: !categoryData.completed,
//     };
//     await updateDoc(categoryRef, { completed: updatedCategory.completed });
//     return updatedCategory as Category;
//   }
//   throw new Error("Category not found");
// };

// export const updateCategoryName = async (
//   businessId: string,
//   categoryId: string,
//   newName: string
// ): Promise<void> => {
//   const categoryRef = doc(
//     db,
//     "businesses",
//     businessId,
//     "categories",
//     categoryId
//   );
//   await updateDoc(categoryRef, { name: newName });
// };

import { Category, Task } from "@/types";
import { db } from "@/lib/firebaseAdmin";
import admin from "firebase-admin";

export const getCategoriesWithTasks = async (
  businessId: string
): Promise<Category[]> => {
  try {
    const categoriesRef = db
      .collection("businesses")
      .doc(businessId)
      .collection("categories");
    const categoriesQuerySnapshot = await categoriesRef
      .orderBy("createdAt", "asc")
      .get();
    const fetchedCategories = await Promise.all(
      categoriesQuerySnapshot.docs.map(async (categoryDoc) => {
        const categoryData = categoryDoc.data();
        const tasks = await getTasks(businessId, categoryDoc.id);
        return {
          id: categoryDoc.id,
          ...categoryData,
          tasks,
          completed: categoryData.completed || false,
          createdAt: categoryData.createdAt.toDate(),
        } as Category;
      })
    );
    return fetchedCategories;
  } catch (error) {
    console.error("Error fetching categories and tasks: ", error);
    throw error;
  }
};

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

export const createCategory = async (
  businessId: string,
  name: string
): Promise<Category> => {
  try {
    const categoriesRef = db
      .collection("businesses")
      .doc(businessId)
      .collection("categories");
    const newCategoryRef = await categoriesRef.add({
      name,
      completed: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return {
      id: newCategoryRef.id,
      name,
      tasks: [],
      completed: false,
      createdAt: new Date(),
    };
  } catch (error) {
    console.error("Error creating category: ", error);
    throw error;
  }
};

export const deleteCategory = async (
  businessId: string,
  categoryId: string
): Promise<void> => {
  try {
    const categoryRef = db
      .collection("businesses")
      .doc(businessId)
      .collection("categories")
      .doc(categoryId);
    await categoryRef.delete();
  } catch (error) {
    console.error("Error deleting category: ", error);
    throw error;
  }
};

export const updateCategoryCompletion = async (
  businessId: string,
  categoryId: string
): Promise<Category> => {
  try {
    const categoryRef = db
      .collection("businesses")
      .doc(businessId)
      .collection("categories")
      .doc(categoryId);
    const categoryDoc = await categoryRef.get();
    if (categoryDoc.exists) {
      const categoryData = categoryDoc.data();
      const updatedCategory = {
        ...categoryData,
        completed: !categoryData?.completed,
      };
      await categoryRef.update({ completed: updatedCategory.completed });
      return updatedCategory as Category;
    }
    throw new Error("Category not found");
  } catch (error) {
    console.error("Error updating category completion: ", error);
    throw error;
  }
};

export const updateCategoryName = async (
  businessId: string,
  categoryId: string,
  newName: string
): Promise<void> => {
  try {
    const categoryRef = db
      .collection("businesses")
      .doc(businessId)
      .collection("categories")
      .doc(categoryId);
    await categoryRef.update({ name: newName });
  } catch (error) {
    console.error("Error updating category name: ", error);
    throw error;
  }
};
