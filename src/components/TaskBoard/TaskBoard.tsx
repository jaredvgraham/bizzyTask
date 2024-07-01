import { useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
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
  const {
    categories,
    setCategories,
    toggleCategoryCompleted,
    handleDeleteCategory,
    handleAddCategory,
    editCategoryName,
  } = useCategories(businessId);
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
    handleToggleDescriptionCompleted,
    toggleTaskCompleted,
    handleEditDescription,
  } = useTasks(categories, setCategories, businessId);
  const [newCategoryName, setNewCategoryName] = useState("");

  return (
    <div
      className={`border p-4 shadow ${
        expanded ? "col-span-1 lg:col-span-2 xl:col-span-3" : "col-span-1"
      } transition-all duration-300`}
    >
      <h2 className="text-xl font-bold mb-2">Task Board</h2>
      <AddCategoryForm
        newCategoryName={newCategoryName}
        onCategoryNameChange={setNewCategoryName}
        onAddCategory={handleAddCategory}
      />
      <div className="grid grid-cols-1  lg:grid-cols-2 2xl:grid-cols-3 gap-4">
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
            onToggleDescriptionCompleted={handleToggleDescriptionCompleted}
            onEditCategoryName={editCategoryName}
            onEditDescription={handleEditDescription}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;