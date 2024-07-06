import React, { createContext, useContext, useState, useEffect } from "react";
import { axiosPrivate } from "@/axios/axios";
import { Category } from "@/types";

interface CategoriesContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  addCategory: (newCategoryName: string) => void;
  toggleCategoryCompleted: (categoryId: string) => void;
  handleDeleteCategory: (categoryId: string) => void;
  editCategoryName: (categoryId: string, newName: string) => void;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined
);

export const CategoriesProvider: React.FC<{
  businessId: string;
  children: React.ReactNode;
}> = ({ businessId, children }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategoriesAndTasks = async () => {
      try {
        const response = await axiosPrivate.get(
          `/business/${businessId}/categories`
        );
        setCategories(response.data);
      } catch (error) {
        console.log("Error fetching categories: ", error);
      }
    };
    fetchCategoriesAndTasks();
  }, [businessId]);

  const addCategory = async (newCategoryName: string) => {
    if (newCategoryName.trim() === "") return;
    try {
      const response = await axiosPrivate.post(
        `/business/${businessId}/categories`,
        { name: newCategoryName }
      );
      setCategories((prevCategories) => [...prevCategories, response.data]);
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  const toggleCategoryCompleted = async (categoryId: string) => {
    try {
      const response = await axiosPrivate.patch(
        `/business/${businessId}/categories/${categoryId}`,
        {
          action: "toggle-completed",
        }
      );
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId
            ? { ...category, completed: response.data.completed }
            : category
        )
      );
    } catch (error) {
      console.error("Error toggling category completion: ", error);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await axiosPrivate.delete(
        `/business/${businessId}/categories/${categoryId}`
      );
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting category: ", error);
    }
  };

  const editCategoryName = async (categoryId: string, newName: string) => {
    try {
      await axiosPrivate.patch(
        `/business/${businessId}/categories/${categoryId}`,
        {
          action: "update-name",
          newName,
        }
      );
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId ? { ...category, name: newName } : category
        )
      );
    } catch (error) {
      console.error("Error editing category name: ", error);
    }
  };

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        setCategories,
        addCategory,
        toggleCategoryCompleted,
        handleDeleteCategory,
        editCategoryName,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
};
