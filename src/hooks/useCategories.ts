import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Task {
  id: string;
  name: string;
  descriptions: string[];
  completed: boolean;
  createdAt: Date;
}

interface Category {
  id: string;
  name: string;
  tasks: Task[];
  completed: boolean;
  createdAt: Date; // Add createdAt field
}

const useCategories = (businessId: string) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategoriesAndTasks = async () => {
      try {
        const categoriesRef = collection(
          db,
          "businesses",
          businessId,
          "categories"
        );
        const categoriesQuery = query(
          categoriesRef,
          orderBy("createdAt", "asc")
        );
        const categoriesSnapshot = await getDocs(categoriesQuery);
        const fetchedCategories = await Promise.all(
          categoriesSnapshot.docs.map(async (categoryDoc) => {
            const categoryData = categoryDoc.data();
            const tasksRef = collection(
              db,
              "businesses",
              businessId,
              "categories",
              categoryDoc.id,
              "tasks"
            );
            const tasksQuery = query(tasksRef, orderBy("createdAt", "asc"));
            const tasksSnapshot = await getDocs(tasksQuery);
            const tasks = tasksSnapshot.docs.map((taskDoc) => {
              const taskData = taskDoc.data();
              return {
                id: taskDoc.id,
                ...taskData,
                descriptions: taskData.descriptions || [],
                completed: taskData.completed || false,
                createdAt: taskData.createdAt.toDate(),
              } as Task;
            });
            return {
              id: categoryDoc.id,
              ...categoryData,
              tasks,
              completed: categoryData.completed || false,
              createdAt: categoryData.createdAt.toDate(),
            } as Category;
          })
        );
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories and tasks: ", error);
      }
    };
    fetchCategoriesAndTasks();
  }, [businessId]);

  const addCategory = async (newCategoryName: string) => {
    if (newCategoryName.trim() === "") return;
    try {
      const categoriesRef = collection(
        db,
        "businesses",
        businessId,
        "categories"
      );
      const newCategoryRef = await addDoc(categoriesRef, {
        name: newCategoryName,
        completed: false,
        createdAt: new Date(),
      });
      setCategories((prevCategories) => [
        ...prevCategories,
        {
          id: newCategoryRef.id,
          name: newCategoryName,
          tasks: [],
          completed: false,
          createdAt: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const categoryRef = doc(
        db,
        "businesses",
        businessId,
        "categories",
        categoryId
      );
      await deleteDoc(categoryRef);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting category: ", error);
    }
  };

  const toggleCategoryCompleted = async (categoryId: string) => {
    try {
      const categoryRef = doc(
        db,
        "businesses",
        businessId,
        "categories",
        categoryId
      );
      const categoryDoc = await getDoc(categoryRef);
      if (categoryDoc.exists()) {
        const categoryData = categoryDoc.data();
        await updateDoc(categoryRef, {
          completed: !categoryData.completed,
        });
        setCategories((prevCategories) =>
          prevCategories.map((category) => {
            if (category.id === categoryId) {
              return { ...category, completed: !category.completed };
            }
            return category;
          })
        );
      }
    } catch (error) {
      console.error("Error toggling category completion: ", error);
    }
  };

  const editCategoryName = async (categoryId: string, newName: string) => {
    try {
      const categoryRef = doc(
        db,
        "businesses",
        businessId,
        "categories",
        categoryId
      );
      await updateDoc(categoryRef, { name: newName });
      setCategories((prevCategories) =>
        prevCategories.map((category) => {
          if (category.id === categoryId) {
            return { ...category, name: newName };
          }
          return category;
        })
      );
    } catch (error) {
      console.error("Error editing category name: ", error);
    }
  };

  return {
    categories,
    setCategories,
    addCategory,
    handleDeleteCategory,
    toggleCategoryCompleted,
    editCategoryName,
  };
};
export default useCategories;
