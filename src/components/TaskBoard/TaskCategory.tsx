import React from "react";
import TaskCategoryHeader from "./TaskCategoryHeader";
import TaskList from "./TaskList";
import { Category } from "@/types";
import { useTasks } from "@/context/TasksContext";
import { useRef, useEffect } from "react";

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
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExpanded && categoryRef.current) {
      const offset = -55; // Adjust this value to leave space above the category
      const elementPosition =
        categoryRef.current.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition + offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }, [isExpanded]);

  return (
    <div
      ref={categoryRef}
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
      {isExpanded && (
        <TaskList
          category={category}
          businessId={businessId}
          isExpanded={isExpanded}
        />
      )}
    </div>
  );
};

export default TaskCategory;
