import React from "react";
import { useState, useEffect, useRef } from "react";
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

interface Task {
  id: string;
  name: string;
  descriptions: { text: string; createdAt: Date; completed: boolean }[];
  completed: boolean;
}

interface Category {
  id: string;
  name: string;
  tasks: Task[];
  completed: boolean;
}

interface TaskCategoryProps {
  category: Category;
  expandedCategory: string | null;
  newDescriptions: { [taskId: string]: string };
  hiddenTasks: Set<string>;
  onToggleCategory: (categoryId: string) => void;
  onDeleteTask: (categoryId: string, taskId: string) => void;
  onDeleteDescription: (
    taskId: string,
    description: { text: string; createdAt: Date; completed: boolean }
  ) => void;
  onToggleTaskVisibility: (taskId: string) => void;
  onAddDescription: (taskId: string, description: string) => void;
  onDescriptionChange: (taskId: string, description: string) => void;
  onAddTask: (task: { name: string; categoryId: string }) => void;
  onTaskInputChange: (name: string, categoryId: string) => void;
  onToggleTaskCompleted: (categoryId: string, taskId: string) => void;
  onToggleCategoryCompleted: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void; // Add this line
  onEditDescription: (
    taskId: string,
    oldDescription: { text: string; createdAt: Date; completed: boolean },
    newDescription: string
  ) => void;
  onToggleDescriptionCompleted: (
    taskId: string,
    description: { text: string; createdAt: Date; completed: boolean }
  ) => void; // Add this line
  onEditCategoryName: (categoryId: string, newName: string) => void;
  newTask: { name: string; categoryId: string };
}

const TaskCategory: React.FC<TaskCategoryProps> = ({
  category,
  expandedCategory,
  newDescriptions,
  hiddenTasks,
  onToggleCategory,
  onDeleteTask,
  onDeleteDescription,
  onToggleTaskVisibility,
  onAddDescription,
  onDescriptionChange,
  onAddTask,
  onTaskInputChange,
  onToggleTaskCompleted,
  onToggleCategoryCompleted,
  onDeleteCategory, // Add this line
  onToggleDescriptionCompleted,
  onEditCategoryName,
  onEditDescription,

  newTask,
}) => {
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
      onEditCategoryName(category.id, newCategoryName);
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
      onClick={!isExpanded ? () => onToggleCategory(category.id) : undefined}
    >
      <div className="flex justify-between items-center ">
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
              className={`${
                isExpanded && "text-4xl text-gray-600 underline-thin"
              } text-3xl font-light mb-2  `}
            >
              {category.name}
            </h3>
          )}
        </div>
        <div className="flex items-center space-x-10">
          <button
            onClick={() => onToggleCategoryCompleted(category.id)}
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
              onToggleCategory(category.id);
            }}
            className="text-blue-500  "
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
              onDeleteCategory(category.id);
            }}
            className="text-gray-500 hover:text-red-500 "
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
              onDeleteTask={onDeleteTask}
              onDeleteDescription={onDeleteDescription}
              onToggleVisibility={onToggleTaskVisibility}
              onAddDescription={onAddDescription}
              onDescriptionChange={onDescriptionChange}
              onToggleTaskCompleted={onToggleTaskCompleted}
              onToggleDescriptionCompleted={onToggleDescriptionCompleted}
              onEditDescription={onEditDescription}
            />
          ))}
          <div className="mt-4" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              value={newTask.name}
              onChange={(e) => onTaskInputChange(e.target.value, category.id)}
              placeholder="Task Name"
              className="mr-2 p-2 border rounded"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) =>
                handleEnterSubmit(e, () =>
                  onAddTask({ name: newTask.name, categoryId: category.id })
                )
              }
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddTask({ name: newTask.name, categoryId: category.id });
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
