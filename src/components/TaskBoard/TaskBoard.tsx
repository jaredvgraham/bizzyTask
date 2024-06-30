import { useState } from "react";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TaskCategory from "./TaskCategory";
import AddCategoryForm from "./AddCategoryForm";
import useCategories from "@/hooks/useCategories";
import useTasks from "@/hooks/useTasks";

interface TaskBoardProps {
  businessId: string;
  expanded: boolean;
}

const TaskBoard = ({ businessId, expanded }: TaskBoardProps) => {
  const { categories, setCategories } = useCategories(businessId);
  const {
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
  } = useTasks(categories, setCategories, businessId);
  const [newCategoryName, setNewCategoryName] = useState("");

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
      setCategories(
        categories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting category: ", error);
    }
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
            onDeleteDescription={handleDeleteDescription}
            onToggleTaskVisibility={toggleTaskVisibility}
            onAddDescription={handleAddDescription}
            onDescriptionChange={handleDescriptionChange}
            onAddTask={handleAddTask}
            newTask={newTask}
            onTaskInputChange={handleTaskInputChange}
            onToggleTaskCompleted={toggleTaskCompleted}
            onToggleCategoryCompleted={toggleCategoryCompleted}
            onDeleteCategory={handleDeleteCategory} // Add this line
          />
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
