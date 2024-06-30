import React from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiTrash,
} from "react-icons/fi";
import TaskItem from "./TaskItem";

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

interface TaskCategoryProps {
  category: Category;
  expandedCategory: string | null;
  newDescriptions: { [taskId: string]: string };
  hiddenTasks: Set<string>;
  onToggleCategory: (categoryId: string) => void;
  onDeleteTask: (categoryId: string, taskId: string) => void;
  onDeleteDescription: (taskId: string, description: string) => void;
  onToggleTaskVisibility: (taskId: string) => void;
  onAddDescription: (taskId: string, description: string) => void;
  onDescriptionChange: (taskId: string, description: string) => void;
  onAddTask: (task: { name: string; categoryId: string }) => void;
  onTaskInputChange: (name: string, categoryId: string) => void;
  onToggleTaskCompleted: (categoryId: string, taskId: string) => void;
  onToggleCategoryCompleted: (categoryId: string) => void;
  onDeleteCategory: (categoryId: string) => void; // Add this line
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
  newTask,
}) => {
  const isExpanded = expandedCategory === category.id;

  return (
    <div
      className={`border p-4 rounded-lg shadow cursor-pointer ${
        isExpanded ? "col-span-3" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-light mb-2">{category.name}</h3>
        <div className="flex items-center space-x-6">
          <button
            onClick={() => onToggleCategoryCompleted(category.id)}
            className={`ml-2 ${
              category.completed ? "text-green-500" : "text-gray-500"
            }`}
          >
            <FiCheckCircle />
          </button>
          <button
            onClick={() => onToggleCategory(category.id)}
            className="text-blue-500 ml-2 p-3"
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
            className="text-gray-500 hover:text-red-500 ml-6"
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
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddTask({ name: newTask.name, categoryId: category.id });
              }}
              className="bg-yellow-500 text-white p-2 rounded"
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
