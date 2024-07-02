import { SetStateAction, useState } from "react";
import {
  addTask,
  addDescription,
  editDescription,
  toggleDescriptionCompleted,
  deleteTask,
  deleteDescription,
  toggleTaskCompletedFire,
} from "@/services/firebaseTaskService";
import { Category } from "@/types";

const useTasks = (
  categories: Category[],
  setCategories: {
    (value: SetStateAction<Category[]>): void;
    (arg0: any): void;
  },
  businessId: string
) => {
  const [newTask, setNewTask] = useState({ name: "", categoryId: "" });
  const [newDescriptions, setNewDescriptions] = useState<{
    [taskId: string]: string;
  }>({});
  const [hiddenTasks, setHiddenTasks] = useState<Set<string>>(new Set());
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleAddTask = async (task: { name: string; categoryId: string }) => {
    if (task.name.trim() === "" || task.categoryId.trim() === "") return;
    try {
      const newTask = await addTask(businessId, task.categoryId, task.name);
      setCategories(
        categories.map((category) => {
          if (category.id === task.categoryId) {
            return {
              ...category,
              tasks: [...category.tasks, newTask],
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
      await addDescription(businessId, expandedCategory!, taskId, description);
      setCategories(
        categories.map((category) => {
          if (category.id === expandedCategory) {
            return {
              ...category,
              tasks: category.tasks.map((task) => {
                if (task.id === taskId) {
                  return {
                    ...task,
                    descriptions: [
                      ...task.descriptions,
                      {
                        text: description,
                        createdAt: new Date(),
                        completed: false,
                      },
                    ],
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

  const handleEditDescription = async (
    taskId: string,
    oldDescription: { text: string; createdAt: Date; completed: boolean },
    newDescription: string
  ) => {
    try {
      await editDescription(
        businessId,
        expandedCategory!,
        taskId,
        oldDescription,
        newDescription
      );
      setCategories(
        categories.map((category) => {
          if (category.id === expandedCategory) {
            return {
              ...category,
              tasks: category.tasks.map((task) => {
                if (task.id === taskId) {
                  return {
                    ...task,
                    descriptions: task.descriptions.map((desc) => {
                      if (desc.text === oldDescription.text) {
                        return { ...desc, text: newDescription };
                      }
                      return desc;
                    }),
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
      console.error("Error editing description: ", error);
    }
  };

  const handleToggleDescriptionCompleted = async (
    taskId: string,
    description: { text: string; createdAt: Date; completed: boolean }
  ) => {
    try {
      await toggleDescriptionCompleted(
        businessId,
        expandedCategory!,
        taskId,
        description
      );
      setCategories(
        categories.map((category) => {
          if (category.id === expandedCategory) {
            return {
              ...category,
              tasks: category.tasks.map((task) => {
                if (task.id === taskId) {
                  return {
                    ...task,
                    descriptions: task.descriptions.map((desc) => {
                      if (desc.text === description.text) {
                        return { ...desc, completed: !desc.completed };
                      }
                      return desc;
                    }),
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
      console.error("Error toggling description completion: ", error);
    }
  };

  const handleDeleteTask = async (categoryId: string, taskId: string) => {
    try {
      await deleteTask(businessId, categoryId, taskId);
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
    description: { text: string; createdAt: Date; completed: boolean }
  ) => {
    try {
      await deleteDescription(
        businessId,
        expandedCategory!,
        taskId,
        description
      );
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
                      (desc) => desc.text !== description.text
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

  const toggleTaskCompleted = async (categoryId: string, taskId: string) => {
    try {
      await toggleTaskCompletedFire(businessId, categoryId, taskId);
      setCategories(
        categories.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              tasks: category.tasks.map((task) => {
                if (task.id === taskId) {
                  return { ...task, completed: !task.completed };
                }
                return task;
              }),
            };
          }
          return category;
        })
      );
    } catch (error) {
      console.error("Error toggling task completion: ", error);
    }
  };

  return {
    newTask,
    setNewTask,
    newDescriptions,
    hiddenTasks,
    expandedCategory,
    handleAddTask,
    handleAddDescription,
    handleEditDescription,
    handleDeleteTask,
    handleDeleteDescription,
    toggleTaskVisibility,
    handleTaskInputChange,
    handleDescriptionChange,
    toggleCategoryExpansion,
    handleToggleDescriptionCompleted,
    toggleTaskCompleted,
  };
};

export default useTasks;
