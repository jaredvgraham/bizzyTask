// import { useState, useEffect } from "react";
// import {
//   getCategoriesWithTasks,
//   createCategory,
//   deleteCategory,
//   updateCategoryCompletion,
//   updateCategoryName,
// } from "@/services/firebaseCategoryService";
// import { Category } from "@/types";
// import { axiosPrivate } from "@/axios/axios";

// const useCategories = (businessId: string) => {
//   const [categories, setCategories] = useState<Category[]>([]);

//   useEffect(() => {
//     const fetchCategoriesAndTasks = async () => {
//       try {
//         const response = await axiosPrivate.get(
//           `/business/${businessId}/categories`
//         );
//         setCategories(response.data);
//       } catch (error) {
//         console.log("Error fetching categories: ", error);
//       }
//     };
//     fetchCategoriesAndTasks();
//   }, [businessId]);

//   const addCategory = async (newCategoryName: string) => {
//     if (newCategoryName.trim() === "") return;
//     try {
//       const newCategory = await createCategory(businessId, newCategoryName);
//       setCategories((prevCategories) => [...prevCategories, newCategory]);
//       console.log("Category added successfully:", newCategoryName);
//     } catch (error) {
//       console.error("Error adding category: ", error);
//     }
//   };

//   const handleDeleteCategory = async (categoryId: string) => {
//     try {
//       await deleteCategory(businessId, categoryId);
//       setCategories((prevCategories) =>
//         prevCategories.filter((category) => category.id !== categoryId)
//       );
//     } catch (error) {
//       console.error("Error deleting category: ", error);
//     }
//   };

//   const toggleCategoryCompleted = async (categoryId: string) => {
//     try {
//       const updatedCategory = await updateCategoryCompletion(
//         businessId,
//         categoryId
//       );
//       setCategories((prevCategories) =>
//         prevCategories.map((category) =>
//           category.id === categoryId
//             ? { ...category, completed: updatedCategory.completed }
//             : category
//         )
//       );
//     } catch (error) {
//       console.error("Error toggling category completion: ", error);
//     }
//   };

//   const editCategoryName = async (categoryId: string, newName: string) => {
//     try {
//       await updateCategoryName(businessId, categoryId, newName);
//       setCategories((prevCategories) =>
//         prevCategories.map((category) =>
//           category.id === categoryId ? { ...category, name: newName } : category
//         )
//       );
//     } catch (error) {
//       console.error("Error editing category name: ", error);
//     }
//   };

//   return {
//     categories,
//     setCategories,
//     addCategory,
//     handleDeleteCategory,
//     toggleCategoryCompleted,
//     editCategoryName,
//   };
// };

// export default useCategories;

// import { axiosPrivate } from "@/axios/axios";
// import { Category } from "@/types";
// import { useEffect, useState } from "react";

// const useCategories = (businessId: string) => {
//   const [categories, setCategories] = useState<Category[]>([]);

//   useEffect(() => {
//     const fetchCategoriesAndTasks = async () => {
//       try {
//         const response = await axiosPrivate.get(
//           `/business/${businessId}/categories`
//         );
//         setCategories(response.data);
//       } catch (error) {
//         console.log("Error fetching categories: ", error);
//       }
//     };
//     fetchCategoriesAndTasks();
//   }, [businessId]);
//   return { categories };
// };

// export default useCategories;

import { useState, useEffect } from "react";
import { Category } from "@/types";
import { axiosPrivate } from "@/axios/axios";

const useCategories = (businessId: string) => {
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
      console.log("Category added successfully:", newCategoryName);
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
          newName: newName,
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
