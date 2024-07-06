import React from "react";
import TaskCategoryHeader from "./TaskCategoryHeader";
import TaskList from "./TaskList";
import { Category } from "@/types";
import { useTasks } from "@/context/TasksContext";

interface TaskCategoryProps {
  category: Category;
  businessId: string;
}

const TaskCategory: React.FC<TaskCategoryProps> = ({
  category,
  businessId,
}) => {
  const { expandedCategory, toggleCategoryExpansion } = useTasks();
  const isExpanded = expandedCategory === category.id;

  return (
    <div
      className={`border p-4 rounded-lg shadow cursor-pointer ${
        isExpanded
          ? "col-span-1 lg:col-span-2 xl:col-span-3"
          : "col-span-1 sm:col-span-2 lg:col-span-1"
      }`}
      onClick={
        !isExpanded ? () => toggleCategoryExpansion(category.id) : undefined
      }
    >
      <TaskCategoryHeader category={category} isExpanded={isExpanded} />
      {isExpanded && <TaskList category={category} businessId={businessId} />}
    </div>
  );
};

export default TaskCategory;
