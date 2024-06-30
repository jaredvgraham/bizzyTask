import {
  collection,
  doc,
  addDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Category, Task } from "@/components/TaskBoard";

export const fetchCategoriesAndTasks = async (
  businessId: string,
  setCategories: (categories: Category[]) => void
) => {
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
          } as Task;
        });
        return { id: categoryDoc.id, ...categoryData, tasks };
      })
    );
    setCategories(fetchedCategories);
  } catch (error) {
    console.error("Error fetching categories and tasks: ", error);
  }
};

export const handleAddCategory = async (
  businessId: string,
  newCategoryName: string,
  setCategories: (categories: Category[]) => void,
  setNewCategoryName: (name: string) => void
) => {
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
    });
    setCategories((prevCategories) => [
      ...prevCategories,
      { id: newCategoryRef.id, name: newCategoryName, tasks: [] },
    ]);
    setNewCategoryName("");
  } catch (error) {
    console.error("Error adding category: ", error);
  }
};

export const handleAddTask = async (
  businessId: string,
  newTask: { name: string; categoryId: string },
  setCategories: (categories: Category[]) => void,
  categories: Category[]
) => {
  if (newTask.name.trim() === "" || newTask.categoryId.trim() === "") return;
  try {
    const tasksRef = collection(
      db,
      "businesses",
      businessId,
      "categories",
      newTask.categoryId,
      "tasks"
    );
    const newTaskRef = await addDoc(tasksRef, {
      name: newTask.name,
      descriptions: [],
    });
    setCategories(
      categories.map((category) => {
        if (category.id === newTask.categoryId) {
          return {
            ...category,
            tasks: [
              ...category.tasks,
              {
                id: newTaskRef.id,
                name: newTask.name,
                descriptions: [],
              },
            ],
          };
        }
        return category;
      })
    );
  } catch (error) {
    console.error("Error adding task: ", error);
  }
};

export const handleAddDescription = async (
  businessId: string,
  categoryId: string,
  taskId: string,
  description: string,
  setCategories: (categories: Category[]) => void,
  categories: Category[]
) => {
  if (description.trim() === "") return;
  try {
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
      descriptions: arrayUnion(description),
    });
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            tasks: category.tasks.map((task) => {
              if (task.id === taskId) {
                return {
                  ...task,
                  descriptions: [...task.descriptions, description],
                };
              }
              return task;
            }),
          };
        }
        return category;
      })
    );
  } catch (error) {
    console.error("Error adding description: ", error);
  }
};

export const handleDeleteTask = async (
  businessId: string,
  categoryId: string,
  taskId: string,
  setCategories: (categories: Category[]) => void,
  categories: Category[]
) => {
  try {
    await deleteDoc(
      doc(
        db,
        "businesses",
        businessId,
        "categories",
        categoryId,
        "tasks",
        taskId
      )
    );
    setCategories(
      categories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            tasks: category.tasks.filter((task) => task.id !== taskId),
          };
        }
        return category;
      })
    );
  } catch (error) {
    console.error("Error deleting task: ", error);
  }
};

export const toggleTaskVisibility = (
  taskId: string,
  hiddenTasks: Set<string>,
  setHiddenTasks: (tasks: Set<string>) => void
) => {
  setHiddenTasks((prev) => {
    const newHiddenTasks = new Set(prev);
    if (newHiddenTasks.has(taskId)) {
      newHiddenTasks.delete(taskId);
    } else {
      newHiddenTasks.add(taskId);
    }
    return newHiddenTasks;
  });
};
