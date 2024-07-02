import { useState, useEffect } from "react";
import {
  getCategoriesWithTasks,
  createCategory,
  deleteCategory,
  updateCategoryCompletion,
  updateCategoryName,
} from "@/services/firebaseCategoryService";
import { Category } from "@/types";

const useCategories = (businessId: string) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategoriesAndTasks = async () => {
      try {
        const fetchedCategories = await getCategoriesWithTasks(businessId);
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories and tasks: ", error);
      }
    };
    fetchCategoriesAndTasks();
  }, [businessId]);

  const addCategory = async (newCategoryName: string) => {
    if (newCategoryName.trim() === "") return;
    try {
      const newCategory = await createCategory(businessId, newCategoryName);
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      console.log("Category added successfully:", newCategoryName);
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await deleteCategory(businessId, categoryId);
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting category: ", error);
    }
  };

  const toggleCategoryCompleted = async (categoryId: string) => {
    try {
      const updatedCategory = await updateCategoryCompletion(
        businessId,
        categoryId
      );
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId
            ? { ...category, completed: updatedCategory.completed }
            : category
        )
      );
    } catch (error) {
      console.error("Error toggling category completion: ", error);
    }
  };

  const editCategoryName = async (categoryId: string, newName: string) => {
    try {
      await updateCategoryName(businessId, categoryId, newName);
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId ? { ...category, name: newName } : category
        )
      );
    } catch (error) {
      console.error("Error editing category name: ", error);
    }
  };

  return {
    categories,
    setCategories,
    addCategory,
    handleDeleteCategory,
    toggleCategoryCompleted,
    editCategoryName,
  };
};

export default useCategories;
