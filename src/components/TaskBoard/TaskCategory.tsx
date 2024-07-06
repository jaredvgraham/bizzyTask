import React, { useState, useEffect, useRef } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiTrash,
  FiEdit,
  FiSave,
} from "react-icons/fi";
import TaskItem from "./TaskItem";
import handleEnterSubmit from "@/utils/handleEnterSubmit";
import { useTasks } from "@/context/TasksContext";
import { useCategories } from "@/context/CategoriesContext";
import { Category } from "@/types";

interface TaskCategoryProps {
  category: Category;
  businessId: string;
}

const TaskCategory: React.FC<TaskCategoryProps> = ({
  category,
  businessId,
}) => {
  const {
    newTask,
    newDescriptions,
    hiddenTasks,
    handleAddTask,
    handleTaskInputChange,
    toggleCategoryExpansion,
    expandedCategory,
  } = useTasks();
  const { toggleCategoryCompleted, handleDeleteCategory, editCategoryName } =
    useCategories();

  const isExpanded = expandedCategory === category.id;
  const [isEditing, setIsEditing] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState(category.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditCategoryName = () => {
    if (newCategoryName.trim() !== "") {
      editCategoryName(category.id, newCategoryName);
      setIsEditing(false);
    }
  };

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
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onBlur={handleEditCategoryName}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleEditCategoryName();
                }
              }}
              className="border rounded p-2"
              ref={inputRef}
            />
          ) : (
            <h3
              className={`text-3xl font-light mb-2 ${
                isExpanded && "text-4xl text-gray-600 underline-thin"
              }`}
            >
              {category.name}
            </h3>
          )}
        </div>
        <div className="flex items-center space-x-10">
          <button
            onClick={() => toggleCategoryCompleted(category.id)}
            className={`ml-2 ${
              category.completed ? "text-green-500" : "text-gray-500"
            }`}
          >
            <FiCheckCircle />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing((prev) => !prev);
            }}
            className="text-blue-500 hover:text-blue-700"
          >
            {isEditing ? <FiSave /> : <FiEdit />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCategoryExpansion(category.id);
            }}
            className="text-blue-500"
          >
            {isExpanded ? (
              <FiChevronUp size={24} />
            ) : (
              <FiChevronDown size={24} />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteCategory(category.id);
            }}
            className="text-gray-500 hover:text-red-500"
          >
            <FiTrash />
          </button>
        </div>
      </div>
      {isExpanded && (
        <>
          {category.tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              categoryId={category.id}
              newDescription={newDescriptions[task.id] || ""}
              hidden={hiddenTasks.has(task.id)}
              businessId={businessId}
            />
          ))}
          <div className="mt-4" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={newTask.name}
              onChange={(e) =>
                handleTaskInputChange(e.target.value, category.id)
              }
              placeholder="Task Name"
              className="mr-2 p-2 border rounded"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) =>
                handleEnterSubmit(e, () =>
                  handleAddTask({ name: newTask.name, categoryId: category.id })
                )
              }
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddTask({ name: newTask.name, categoryId: category.id });
              }}
              className="btn-yellow text-white p-2 rounded"
            >
              Add Task
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCategory;
