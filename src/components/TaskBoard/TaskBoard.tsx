import React, { useState } from "react";
import TaskCategory from "./TaskCategory";
import AddCategoryForm from "./AddCategoryForm";
import { useCategories } from "@/context/CategoriesContext";
import { Category } from "@/types";

interface TaskBoardProps {
  expanded: boolean;
  businessId: string;
}

const TaskBoard = ({ expanded, businessId }: TaskBoardProps) => {
  const { categories, addCategory } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") {
      console.log("Category name is empty");
      return;
    }
    console.log("Adding category:", newCategoryName);
    addCategory(newCategoryName);
    setNewCategoryName("");
  };

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
        {categories?.map((category: Category) => (
          <TaskCategory
            key={category.id}
            category={category}
            businessId={businessId}
          />
        ))}
      </div>
    </div>
  );
};

export default TaskBoard;
