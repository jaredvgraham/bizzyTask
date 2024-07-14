import React, { useState, useEffect } from "react";
import TaskCategory from "./TaskCategory";
import AddCategoryForm from "./AddCategoryForm";
import { useCategories } from "@/context/CategoriesContext";
import { Category } from "@/types";
import Loading from "../Loading";

interface TaskBoardProps {
  expanded: boolean;
  businessId: string;
}

const TaskBoard = ({ expanded, businessId }: TaskBoardProps) => {
  const { categories, addCategory, loading } = useCategories();
  const [newCategoryName, setNewCategoryName] = useState("");
  const [sortOrder, setSortOrder] = useState("oldestCreated");

  const handleAddCategory = () => {
    if (newCategoryName.trim() === "") {
      console.log("Category name is empty");
      return;
    }
    console.log("Adding category:", newCategoryName);
    addCategory(newCategoryName);
    setNewCategoryName("");
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value);
  };

  const sortedCategories = [...categories].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (sortOrder === "recentlyCreated") {
      return dateB.getTime() - dateA.getTime();
    }
    return dateA.getTime() - dateB.getTime();
  });

  if (loading) {
    return <Loading />;
  }

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
      <div className="mb-4">
        <label htmlFor="sortOrder" className="mr-2">
          Sort by:
        </label>
        <select
          id="sortOrder"
          value={sortOrder}
          onChange={handleSortChange}
          className="p-2 border rounded"
        >
          <option value="recentlyCreated">Recently Created</option>
          <option value="oldestCreated">Oldest Created</option>
        </select>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {sortedCategories.map((category: Category) => (
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
