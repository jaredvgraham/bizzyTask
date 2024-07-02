import React from "react";
import handleEnterSubmit from "@/utils/handleEnterSubmit";

interface AddCategoryFormProps {
  newCategoryName: string;
  onCategoryNameChange: (name: string) => void;
  onAddCategory: () => void;
}

const AddCategoryForm: React.FC<AddCategoryFormProps> = ({
  newCategoryName,
  onCategoryNameChange,
  onAddCategory,
}) => {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={newCategoryName}
        onChange={(e) => onCategoryNameChange(e.target.value)}
        onKeyDown={(e) => handleEnterSubmit(e, onAddCategory)}
        placeholder="New Category Name"
        className="mr-2 p-2 border rounded"
      />
      <button
        onClick={onAddCategory}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Add Category
      </button>
    </div>
  );
};

export default AddCategoryForm;
