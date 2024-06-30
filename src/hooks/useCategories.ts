import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Task {
  id: string;
  name: string;
  descriptions: string[];
  completed: boolean;
}

interface Category {
  id: string;
  name: string;
  tasks: Task[];
  completed: boolean;
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
        const categoriesSnapshot = await getDocs(categoriesRef);
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
            const tasksSnapshot = await getDocs(tasksRef);
            const tasks = tasksSnapshot.docs.map((taskDoc) => {
              const taskData = taskDoc.data();
              return {
                id: taskDoc.id,
                ...taskData,
                descriptions: taskData.descriptions || [],
                completed: taskData.completed || false,
              } as Task;
            });
            return {
              id: categoryDoc.id,
              ...categoryData,
              tasks,
              completed: categoryData.completed || false,
            };
          })
        );
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories and tasks: ", error);
      }
    };
    fetchCategoriesAndTasks();
  }, [businessId]);

  return { categories, setCategories };
};

export default useCategories;
