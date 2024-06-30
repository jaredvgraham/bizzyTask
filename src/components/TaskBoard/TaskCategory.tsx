import React from "react";
import { FiChevronDown, FiChevronUp, FiCheckCircle } from "react-icons/fi";

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
  onToggleTaskVisibility: (taskId: string) => void;
  onAddDescription: (taskId: string, description: string) => void;
  onDescriptionChange: (taskId: string, description: string) => void;
  onAddTask: (task: { name: string; categoryId: string }) => void;
  onTaskInputChange: (name: string, categoryId: string) => void;
  onToggleTaskCompleted: (categoryId: string, taskId: string) => void;
  onToggleCategoryCompleted: (categoryId: string) => void;
  newTask: { name: string; categoryId: string };
}

const TaskCategory: React.FC<TaskCategoryProps> = ({
  category,
  expandedCategory,
  newDescriptions,
  hiddenTasks,
  onToggleCategory,
  onDeleteTask,
  onToggleTaskVisibility,
  onAddDescription,
  onDescriptionChange,
  onAddTask,
  onTaskInputChange,
  onToggleTaskCompleted,
  onToggleCategoryCompleted,
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
        <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
        <div className="flex items-center space-x-2">
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
            className="text-blue-500 ml-2"
          >
            {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
          </button>
        </div>
      </div>
      {isExpanded && (
        <>
          {category.tasks.map((task) => (
            <div
              key={task.id}
              className="mb-4 border-b"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-2">
                <div>
                  <h4 className="font-bold">{task.name}</h4>
                  {!hiddenTasks.has(task.id) && (
                    <ul className="list-disc pl-5">
                      {task.descriptions &&
                        task.descriptions.map((description, index) => (
                          <li key={index}>{description}</li>
                        ))}
                    </ul>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTaskCompleted(category.id, task.id);
                    }}
                    className={`${
                      task.completed ? "text-green-500" : "text-gray-500"
                    }`}
                  >
                    <FiCheckCircle />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTask(category.id, task.id);
                    }}
                    className="text-red-500"
                  >
                    Delete
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleTaskVisibility(task.id);
                    }}
                    className="text-blue-500 ml-2"
                  >
                    {hiddenTasks.has(task.id) ? "Show" : "Hide"}
                  </button>
                </div>
              </div>
              {!hiddenTasks.has(task.id) && (
                <>
                  <input
                    type="text"
                    value={newDescriptions[task.id] || ""}
                    onChange={(e) =>
                      onDescriptionChange(task.id, e.target.value)
                    }
                    placeholder="Add Description"
                    className="mr-2 p-2 border rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddDescription(task.id, newDescriptions[task.id] || "");
                    }}
                    className="bg-indigo-400 text-white p-2 rounded mb-2"
                  >
                    Add Description
                  </button>
                </>
              )}
            </div>
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
              className="bg-green-500 text-white p-2 rounded"
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
