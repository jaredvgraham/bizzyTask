import React, { useState, useRef, useEffect } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiTrash,
  FiEdit,
  FiSave,
} from "react-icons/fi";
import { useCategories } from "@/context/CategoriesContext";
import { useTasks } from "@/context/TasksContext";
import { Category } from "@/types";

interface TaskHeaderProps {
  category: Category;
  isExpanded: boolean;
}

const TaskCategoryHeader: React.FC<TaskHeaderProps> = ({
  category,
  isExpanded,
}) => {
  const { toggleCategoryCompleted, handleDeleteCategory, editCategoryName } =
    useCategories();
  const { toggleCategoryExpansion } = useTasks();
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
      editCategoryName(category.id, newCategoryName, category);
      setIsEditing(false);
    }
  };

  return (
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
              isExpanded && "text-4xl  underline-thin"
            }`}
          >
            {category.name}
          </h3>
        )}
      </div>
      <div className="flex self-start items-center space-x-8 mt-2">
        <button
          onClick={() => toggleCategoryCompleted(category.id, category)}
          className={` hover:text-green-500 ${
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
          {isExpanded ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
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
  );
};

export default TaskCategoryHeader;
