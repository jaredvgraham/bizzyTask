import handleEnterSubmit from "@/utils/handleEnterSubmit";
import React, { useState, useRef, useEffect } from "react";
import { FiTrash, FiCheck, FiEdit, FiSave } from "react-icons/fi";

interface TaskItemProps {
  task: {
    id: string;
    name: string;
    descriptions: { text: string; createdAt: Date; completed: boolean }[];
    completed: boolean;
  };
  categoryId: string;
  newDescription: string;
  hidden: boolean;
  onDeleteTask: (categoryId: string, taskId: string) => void;
  onDeleteDescription: (taskId: string, description: { text: string }) => void;
  onToggleVisibility: (taskId: string) => void;
  onAddDescription: (taskId: string, description: string) => void;
  onDescriptionChange: (taskId: string, description: string) => void;
  onToggleTaskCompleted: (categoryId: string, taskId: string) => void; // Add this line
  onToggleDescriptionCompleted: (
    taskId: string,
    description: { text: string }
  ) => void; // Add this line
  onEditDescription: (
    taskId: string,
    oldDescription: { text: string },
    newDescription: string
  ) => void;
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
  onToggleTaskCompleted, // Add this line
  onToggleDescriptionCompleted,
  onEditDescription,
}) => {
  const [editingDescription, setEditingDescription] = useState<string | null>(
    null
  );
  const [editedDescription, setEditedDescription] = useState<string>("");

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingDescription) {
      editInputRef.current?.focus();
    }
  }, [editingDescription]);

  return (
    <div className="mb-4 border-b" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-start p-2">
        <div className="flex flex-col">
          <h3 className={`font-regular text-2xl mb-4 `}>{task.name}</h3>
          {!hidden && (
            <ul className="pl-2 text-black">
              {task.descriptions &&
                task.descriptions.map((description, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center border-b pb-2 mb-2"
                  >
                    {editingDescription === description.text ? (
                      <input
                        type="text"
                        ref={editInputRef}
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                        onBlur={() => {
                          onEditDescription(
                            task.id,
                            description,
                            editedDescription
                          );
                          setEditingDescription(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            onEditDescription(
                              task.id,
                              description,
                              editedDescription
                            );
                            setEditingDescription(null);
                          }
                        }}
                        className="border rounded p-2 flex-grow"
                      />
                    ) : (
                      <span
                        className={`text-lg ${
                          description.completed ? "thin-line-through" : ""
                        }`}
                      >
                        {description.text}
                      </span>
                    )}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleDescriptionCompleted(task.id, description);
                        }}
                        className={`ml-2 hover:text-green-400 ${
                          description.completed
                            ? "text-green-500"
                            : "text-gray-500"
                        }`}
                      >
                        <FiCheck />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingDescription(description.text);
                          setEditedDescription(description.text);
                        }}
                        className="text-blue-300 hover:text-blue-500 ml-2"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDescription(task.id, description);
                        }}
                        className="text-red-300 hover:text-red-500 ml-2"
                      >
                        <FiTrash />
                      </button>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
        <div className="flex items-center space-x-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleTaskCompleted(categoryId, task.id);
            }}
            className={`ml-2 hover:text-green-400 ${
              task.completed ? "text-green-500" : "text-gray-500"
            }`}
          >
            <FiCheck />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(task.id);
            }}
            className={`text-blue-500 ml-2 ${hidden && "font-bold"}`}
          >
            {hidden ? "Show" : "Hide"}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTask(categoryId, task.id);
            }}
            className="text-red-500 hover:text-red-700"
          >
            <FiTrash />
          </button>
        </div>
      </div>
      {!hidden && (
        <>
          <div className="flex items-end space-x-2 border-b-2">
            <textarea
              value={newDescription}
              onChange={(e) => onDescriptionChange(task.id, e.target.value)}
              placeholder="Add Description"
              className="mr-2 p-2 border rounded resize-none overflow-hidden flex-grow mb-3"
              rows={1}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) =>
                handleEnterSubmit(e, () => {
                  onAddDescription(task.id, newDescription);
                  // Reset the textarea height and value
                  const target = e.target as HTMLTextAreaElement;
                  target.style.height = "auto";
                  onDescriptionChange(task.id, "");
                })
              }
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
              className="bg-indigo-400 text-white p-2 rounded mb-3"
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
