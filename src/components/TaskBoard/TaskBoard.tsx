import { useState, useEffect } from "react";
import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import TaskCategory from "./TaskCategory";
import AddCategoryForm from "./AddCategoryForm";

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

interface TaskBoardProps {
  businessId: string;
  expanded: boolean;
}

const TaskBoard = ({ businessId, expanded }: TaskBoardProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTask, setNewTask] = useState({
    name: "",
    categoryId: "",
  });
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [newDescriptions, setNewDescriptions] = useState<{
    [taskId: string]: string;
  }>({});
  const [hiddenTasks, setHiddenTasks] = useState<Set<string>>(new Set());

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

  const handleAddCategory = async () => {
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
      });
      setCategories([
        ...categories,
        {
          id: newCategoryRef.id,
          name: newCategoryName,
          tasks: [],
          completed: false,
        },
      ]);
      setNewCategoryName("");
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  const handleAddTask = async (task: { name: string; categoryId: string }) => {
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

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
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

  const toggleTaskCompleted = async (categoryId: string, taskId: string) => {
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
      const taskDoc = await getDoc(taskRef);
      if (taskDoc.exists()) {
        const taskData = taskDoc.data();
        await updateDoc(taskRef, {
          completed: !taskData.completed,
        });
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
      }
    } catch (error) {
      console.error("Error toggling task completion: ", error);
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
        setCategories(
          categories.map((category) => {
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

  return (
    <div
      className={`border p-4 shadow ${
        expanded ? "col-span-3" : "col-span-1"
      } transition-all duration-300`}
    >
      <h2 className="text-xl font-bold mb-2">Task Board</h2>
      <AddCategoryForm
        newCategoryName={newCategoryName}
        onCategoryNameChange={setNewCategoryName}
        onAddCategory={handleAddCategory}
      />
      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <TaskCategory
            key={category.id}
            category={category}
            expandedCategory={expandedCategory}
            newDescriptions={newDescriptions}
            hiddenTasks={hiddenTasks}
            onToggleCategory={toggleCategoryExpansion}
            onDeleteTask={handleDeleteTask}
            onToggleTaskVisibility={toggleTaskVisibility}
            onAddDescription={handleAddDescription}
            onDescriptionChange={handleDescriptionChange}
            onAddTask={handleAddTask}
            newTask={newTask}
            onTaskInputChange={handleTaskInputChange}
            onToggleTaskCompleted={toggleTaskCompleted}
            onToggleCategoryCompleted={toggleCategoryCompleted}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
