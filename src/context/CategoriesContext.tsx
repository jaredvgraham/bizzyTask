import React, { createContext, useContext, useState, useEffect } from "react";
import { axiosPrivate } from "@/axios/axios";
import { Category } from "@/types";
import { useWebSocket } from "./WebSocketContext";
import { set } from "nprogress";
import { useAuth } from "./AuthContext";

interface CategoriesContextType {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  addCategory: (newCategoryName: string) => void;
  toggleCategoryCompleted: (categoryId: string, category: Category) => void;
  handleDeleteCategory: (categoryId: string) => void;
  editCategoryName: (
    categoryId: string,
    newName: string,
    category: Category
  ) => void;
  loading: boolean;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined
);

export const CategoriesProvider: React.FC<{
  businessId: string;
  children: React.ReactNode;
}> = ({ businessId, children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { socket } = useWebSocket();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategoriesAndTasks = async () => {
      console.log("fetching categories");
      setLoading(true);

      try {
        const response = await axiosPrivate.get(
          `/business/${businessId}/categories`
        );
        setCategories(response.data);
        console.log("categories: ", response);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching categories: ", error);
      }
    };
    fetchCategoriesAndTasks();
  }, [businessId, user]);

  useEffect(() => {
    if (socket) {
      socket.on("CATEGORY_ADDED", (data: Category) => {
        setCategories((prevCategories) => [...prevCategories, data]);
      });
      socket.on("CATEGORY_DELETED", (data: { id: string }) => {
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== data.id)
        );
      });
      socket.on("CATEGORY_UPDATED", (data: Category) => {
        console.log("data from websocket: ", data);
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === data.id ? data : category
          )
        );
      });

      return () => {
        socket.off("CATEGORY_ADDED");
        socket.off("CATEGORY_DELETED");
        socket.off("CATEGORY_UPDATED");
      };
    }
  }, [socket, setCategories]);

  const addCategory = async (newCategoryName: string) => {
    if (newCategoryName.trim() === "") return;
    try {
      const response = await axiosPrivate.post(
        `/business/${businessId}/categories`,
        { name: newCategoryName }
      );
      const newCategory = response.data;
      setCategories((prevCategories) => [...prevCategories, response.data]);
      socket?.emit("ADD_CATEGORY", newCategory);
    } catch (error) {
      console.error("Error adding category: ", error);
    }
  };

  const toggleCategoryCompleted = async (
    categoryId: string,
    category: Category
  ) => {
    try {
      const response = await axiosPrivate.patch(
        `/business/${businessId}/categories/${categoryId}`,
        {
          action: "toggle-completed",
        }
      );
      const updatedCategory = response.data;
      console.log("updatedCategory: ", updatedCategory);

      const categoryToEmit = {
        ...category,
        completed: updatedCategory.completed,
      };
      console.log("categoryToEmit: ", categoryToEmit);

      socket?.emit("UPDATE_CATEGORY", categoryToEmit);
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
      socket?.emit("DELETE_CATEGORY", { id: categoryId });
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
    } catch (error) {
      console.error("Error deleting category: ", error);
    }
  };

  const editCategoryName = async (
    categoryId: string,
    newName: string,
    category: Category
  ) => {
    try {
      await axiosPrivate.patch(
        `/business/${businessId}/categories/${categoryId}`,
        {
          action: "update-name",
          newName,
        }
      );
      const updatedCategory = { ...category, name: newName };
      console.log("updatedCategory: ", updatedCategory);

      socket?.emit("UPDATE_CATEGORY", updatedCategory);
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
        loading,
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
