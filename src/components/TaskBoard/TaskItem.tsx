import React from "react";
import { FiTrash } from "react-icons/fi";

interface TaskItemProps {
  task: {
    id: string;
    name: string;
    descriptions: string[];
  };
  categoryId: string;
  newDescription: string;
  hidden: boolean;
  onDeleteTask: (categoryId: string, taskId: string) => void;
  onDeleteDescription: (taskId: string, description: string) => void;
  onToggleVisibility: (taskId: string) => void;
  onAddDescription: (taskId: string, description: string) => void;
  onDescriptionChange: (taskId: string, description: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  categoryId,
  newDescription,
  hidden,
  onDeleteTask,
  onDeleteDescription,
  onToggleVisibility,
  onAddDescription,
  onDescriptionChange,
}) => {
  return (
    <div className="mb-4 border-b" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-start p-2">
        <div className="flex flex-col">
          <h4 className="font-bold mb-4">{task.name}</h4>
          {!hidden && (
            <ul className=" pl-2 text-black">
              {task.descriptions &&
                task.descriptions.map((description, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b pb-2 mb-2"
                  >
                    <span>{description}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDescription(task.id, description);
                      }}
                      className="text-red-300 hover:text-red-500 ml-2"
                    >
                      <FiTrash />
                    </button>
                  </li>
                ))}
            </ul>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask(categoryId, task.id);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <FiTrash />
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
      </div>
      {!hidden && (
        <>
          <div className="flex items-end space-x-2">
            <textarea
              value={newDescription}
              onChange={(e) => onDescriptionChange(task.id, e.target.value)}
              placeholder="Add Description"
              className="mr-2 p-2 border rounded resize-none overflow-hidden flex-grow"
              rows={1}
              onClick={(e) => e.stopPropagation()}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = target.scrollHeight + "px";
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddDescription(task.id, newDescription);
                // Reset the textarea height and value
                const target = e.target as HTMLElement;
                const textarea =
                  target.previousElementSibling as HTMLTextAreaElement;
                textarea.style.height = "auto";
                onDescriptionChange(task.id, "");
              }}
              className="bg-indigo-400 text-white p-2 rounded"
            >
              Add Description
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
