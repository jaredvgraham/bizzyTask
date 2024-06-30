import React from "react";

interface TaskItemProps {
  task: {
    id: string;
    name: string;
    descriptions: string[];
  };
  categoryId: string;
  newDescription: string;
  hidden: boolean;
  onDelete: (categoryId: string, taskId: string) => void;
  onToggleVisibility: (taskId: string) => void;
  onAddDescription: (taskId: string, description: string) => void;
  onDescriptionChange: (taskId: string, description: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  categoryId,
  newDescription,
  hidden,
  onDelete,
  onToggleVisibility,
  onAddDescription,
  onDescriptionChange,
}) => {
  return (
    <div className="mb-4 border-b" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center p-2">
        <div>
          <h4 className="font-bold">{task.name}</h4>
          {!hidden && (
            <ul className="list-disc pl-5">
              {task.descriptions &&
                task.descriptions.map((description, index) => (
                  <li key={index}>{description}</li>
                ))}
            </ul>
          )}
        </div>
        <div className="mt-4" onClick={(e) => e.stopPropagation()}></div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(categoryId, task.id);
          }}
          className="text-red-500"
        >
          Delete
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleVisibility(task.id);
          }}
          className="text-blue-500 ml-2"
        >
          {hidden ? "Show" : "Hide"}
        </button>
      </div>
      {!hidden && (
        <>
          <input
            type="text"
            value={newDescription}
            onChange={(e) => onDescriptionChange(task.id, e.target.value)}
            placeholder="Add Description"
            className="mr-2 p-2 border rounded"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddDescription(task.id, newDescription);
            }}
            className="bg-indigo-400 text-white p-2 rounded mb-2"
          >
            Add Description
          </button>
        </>
      )}
    </div>
  );
};

export default TaskItem;
