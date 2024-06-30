import { useState } from "react";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const useTasks = (categories, setCategories, businessId) => {
  const [newTask, setNewTask] = useState({ name: "", categoryId: "" });
  const [newDescriptions, setNewDescriptions] = useState<{
    [taskId: string]: string;
  }>({});
  const [hiddenTasks, setHiddenTasks] = useState<Set<string>>(new Set());
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleAddTask = async (task) => {
    if (task.name.trim() === "" || task.categoryId.trim() === "") return;
    try {
      const tasksRef = collection(
        db,
        "businesses",
        businessId,
        "categories",
        task.categoryId,
        "tasks"
      );
      const newTaskRef = await addDoc(tasksRef, {
        name: task.name,
        descriptions: [],
        completed: false,
      });
      setCategories(
        categories.map((category) => {
          if (category.id === task.categoryId) {
            return {
              ...category,
              tasks: [
                ...category.tasks,
                {
                  id: newTaskRef.id,
                  name: task.name,
                  descriptions: [],
                  completed: false,
                },
              ],
            };
          }
          return category;
        })
      );
      setNewTask({ name: "", categoryId: "" });
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const handleAddDescription = async (taskId: string, description: string) => {
    if (description.trim() === "") return;
    try {
      const taskRef = doc(
        db,
        "businesses",
        businessId,
        "categories",
        expandedCategory!,
        "tasks",
        taskId
      );
      await updateDoc(taskRef, {
        descriptions: arrayUnion(description),
      });
      setCategories(
        categories.map((category) => {
          if (category.id === expandedCategory) {
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
      setNewDescriptions((prev) => ({ ...prev, [taskId]: "" }));
    } catch (error) {
      console.error("Error adding description: ", error);
    }
  };

  const handleDeleteTask = async (categoryId: string, taskId: string) => {
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

  const handleDeleteDescription = async (
    taskId: string,
    description: string
  ) => {
    try {
      const taskRef = doc(
        db,
        "businesses",
        businessId,
        "categories",
        expandedCategory!,
        "tasks",
        taskId
      );
      await updateDoc(taskRef, {
        descriptions: arrayRemove(description),
      });
      setCategories(
        categories.map((category) => {
          if (category.id === expandedCategory) {
            return {
              ...category,
              tasks: category.tasks.map((task) => {
                if (task.id === taskId) {
                  return {
                    ...task,
                    descriptions: task.descriptions.filter(
                      (desc) => desc !== description
                    ),
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
      console.error("Error deleting description: ", error);
    }
  };

  const toggleTaskVisibility = (taskId: string) => {
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

  const handleTaskInputChange = (name: string, categoryId: string) => {
    setNewTask({ name, categoryId });
  };

  const handleDescriptionChange = (taskId: string, description: string) => {
    setNewDescriptions((prev) => ({
      ...prev,
      [taskId]: description,
    }));
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  return {
    newTask,
    setNewTask,
    newDescriptions,
    hiddenTasks,
    expandedCategory,
    handleAddTask,
    handleAddDescription,
    handleDeleteTask,
    handleDeleteDescription,
    toggleTaskVisibility,
    handleTaskInputChange,
    handleDescriptionChange,
    toggleCategoryExpansion,
  };
};

export default useTasks;
