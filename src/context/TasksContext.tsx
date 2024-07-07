import React, {
  createContext,
  useContext,
  useState,
  SetStateAction,
  useEffect,
} from "react";
import { axiosPrivate } from "@/axios/axios";
import { useCategories } from "@/context/CategoriesContext";
import { useWebSocket } from "./WebSocketContext";
import { Task } from "@/types";

interface TasksContextType {
  newTask: { name: string; categoryId: string };
  setNewTask: React.Dispatch<
    SetStateAction<{ name: string; categoryId: string }>
  >;
  newDescriptions: { [taskId: string]: string };
  hiddenTasks: Set<string>;
  expandedCategory: string | null;
  handleAddTask: (task: { name: string; categoryId: string }) => Promise<void>;
  handleAddDescription: (
    taskId: string,
    description: string,
    task: Task
  ) => Promise<void>;
  handleEditDescription: (
    taskId: string,
    oldDescription: { text: string; createdAt: Date; completed: boolean },
    newDescription: string,
    task: Task
  ) => Promise<void>;
  handleDeleteTask: (categoryId: string, taskId: string) => Promise<void>;
  handleDeleteDescription: (
    taskId: string,
    description: { text: string; createdAt: Date; completed: boolean },
    task: Task
  ) => Promise<void>;
  toggleTaskVisibility: (taskId: string) => void;
  handleTaskInputChange: (name: string, categoryId: string) => void;
  handleDescriptionChange: (taskId: string, description: string) => void;
  toggleCategoryExpansion: (categoryId: string) => void;
  handleToggleDescriptionCompleted: (
    taskId: string,
    description: { text: string; createdAt: Date; completed: boolean },
    task: Task
  ) => Promise<void>;
  toggleTaskCompleted: (
    categoryId: string,
    taskId: string,
    task: Task
  ) => Promise<void>;
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{
  businessId: string;
  children: React.ReactNode;
}> = ({ businessId, children }) => {
  const { categories, setCategories } = useCategories();
  const [newTask, setNewTask] = useState({ name: "", categoryId: "" });
  const [newDescriptions, setNewDescriptions] = useState<{
    [taskId: string]: string;
  }>({});
  const [hiddenTasks, setHiddenTasks] = useState<Set<string>>(new Set());
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const { socket } = useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.on(
        "TASK_ADDED",
        (data: {
          id: string;
          name: string;
          categoryId: string;
          createdAt: Date;
          completed: boolean;
          descriptions: [];
        }) => {
          setCategories((prevCategories) =>
            prevCategories.map((category) => {
              if (category.id === data.categoryId) {
                return {
                  ...category,
                  tasks: [...category?.tasks, data],
                };
              }
              return category;
            })
          );
        }
      );

      socket.on(
        "TASK_UPDATED",
        (data: {
          id: string;
          name: string;
          categoryId: string;
          createdAt: Date;
          completed: boolean;
          descriptions: [];
        }) => {
          setCategories((prevCategories) =>
            prevCategories.map((category) => {
              if (category.id === data.categoryId) {
                return {
                  ...category,
                  tasks: category?.tasks.map((task) =>
                    task.id === data.id ? data : task
                  ),
                };
              }
              return category;
            })
          );
        }
      );

      socket.on("TASK_DELETED", (data: { id: string; categoryId: string }) => {
        setCategories((prevCategories) =>
          prevCategories.map((category) => {
            if (category.id === data.categoryId) {
              return {
                ...category,
                tasks: category?.tasks.filter((task) => task.id !== data.id),
              };
            }
            return category;
          })
        );
      });

      return () => {
        socket.off("TASK_ADDED");
        socket.off("TASK_UPDATED");
        socket.off("TASK_DELETED");
      };
    }
  }, [socket, setCategories]);

  const handleAddTask = async (task: { name: string; categoryId: string }) => {
    if (task.name.trim() === "" || task.categoryId.trim() === "") return;
    try {
      const response = await axiosPrivate.post(
        `/business/${businessId}/categories/${task.categoryId}/tasks`,
        {
          taskName: task.name,
        }
      );
      const newTask = response.data;
      console.log("frontend response from nextjs  ", newTask);
      const taskToEmit = {
        ...newTask,
        categoryId: task.categoryId,
      };
      console.log("task to emit: that works ", taskToEmit);

      socket?.emit("ADD_TASK", taskToEmit);
      setCategories((prevCategories) =>
        prevCategories.map((category) => {
          if (category.id === task.categoryId) {
            return {
              ...category,
              tasks: [...category?.tasks, newTask],
            };
          }
          return category;
        })
      );
      setNewTask({ name: "", categoryId: "" });
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const handleAddDescription = async (
    taskId: string,
    description: string,
    task: Task
  ) => {
    if (description.trim() === "") return;
    try {
      const res = await axiosPrivate.patch(
        `/business/${businessId}/categories/${expandedCategory}/tasks/${taskId}`,
        {
          action: "add-description",
          description,
        }
      );
      const { newDescription } = res.data;
      console.log(
        "frontend response from nextjs for adding description: ",
        newDescription
      );

      const taskToEmit = {
        ...task,

        categoryId: expandedCategory,

        descriptions: [...task?.descriptions, newDescription], // Include the new description
        // Set this based on your logic
      };

      console.log("task to emit: ", taskToEmit);

      socket?.emit("UPDATE_TASK", taskToEmit);
      setCategories((prevCategories) =>
        prevCategories?.map((category) => {
          if (category.id === expandedCategory) {
            return {
              ...category,
              tasks: category?.tasks?.map((task) => {
                if (task.id === taskId) {
                  return {
                    ...task,
                    descriptions: [
                      ...task.descriptions,
                      {
                        text: description,
                        createdAt: new Date(),
                        completed: false,
                      },
                    ],
                  };
                }
                return task;
              }),
            };
          }
          return category;
        })
      );
      setNewDescriptions((prev) => ({ ...prev, [taskId]: "" }));
    } catch (error) {
      console.error("Error adding description: ", error);
    }
  };

  const handleEditDescription = async (
    taskId: string,
    oldDescription: { text: string; createdAt: Date; completed: boolean },
    newDescription: string,
    task: Task
  ) => {
    try {
      const res = await axiosPrivate.patch(
        `/business/${businessId}/categories/${expandedCategory}/tasks/${taskId}`,
        {
          action: "edit-description",
          oldDescription,
          newDescription,
        }
      );
      const taskToEmit = {
        ...task,
        categoryId: expandedCategory,
        taskId: taskId,
        descriptions: task?.descriptions?.map((desc) =>
          desc.text === oldDescription.text
            ? { ...desc, text: newDescription }
            : desc
        ),
      };

      socket?.emit("UPDATE_TASK", taskToEmit);
      setCategories((prevCategories) =>
        prevCategories?.map((category) => {
          if (category.id === expandedCategory) {
            return {
              ...category,
              tasks: category?.tasks?.map((task) => {
                if (task.id === taskId) {
                  return {
                    ...task,
                    descriptions: task?.descriptions?.map((desc) => {
                      if (desc.text === oldDescription.text) {
                        return { ...desc, text: newDescription };
                      }
                      return desc;
                    }),
                  };
                }
                return task;
              }),
            };
          }
          return category;
        })
      );
    } catch (error) {
      console.error("Error editing description: ", error);
    }
  };

  const handleToggleDescriptionCompleted = async (
    taskId: string,
    description: { text: string; createdAt: Date; completed: boolean },
    task: Task
  ) => {
    try {
      const res = await axiosPrivate.patch(
        `/business/${businessId}/categories/${expandedCategory}/tasks/${taskId}`,
        {
          action: "toggle-description-completed",
          description,
        }
      );

      const taskToEmit = {
        ...task,
        categoryId: expandedCategory,
        taskId: taskId,
        descriptions: task?.descriptions?.map((desc) =>
          desc.text === description.text
            ? { ...desc, completed: !desc.completed }
            : desc
        ),
      };

      socket?.emit("UPDATE_TASK", taskToEmit);
      setCategories((prevCategories) =>
        prevCategories?.map((category) => {
          if (category.id === expandedCategory) {
            return {
              ...category,
              tasks: category?.tasks?.map((task) => {
                if (task.id === taskId) {
                  return {
                    ...task,
                    descriptions: task?.descriptions?.map((desc) => {
                      if (desc.text === description.text) {
                        return { ...desc, completed: !desc.completed };
                      }
                      return desc;
                    }),
                  };
                }
                return task;
              }),
            };
          }
          return category;
        })
      );
    } catch (error) {
      console.error("Error toggling description completion: ", error);
    }
  };

  const handleDeleteTask = async (categoryId: string, taskId: string) => {
    try {
      await axiosPrivate.delete(
        `/business/${businessId}/categories/${categoryId}/tasks/${taskId}`
      );
      socket?.emit("DELETE_TASK", { id: taskId, categoryId });
      setCategories((prevCategories) =>
        prevCategories?.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              tasks: category?.tasks?.filter((task) => task.id !== taskId),
            };
          }
          return category;
        })
      );
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const handleDeleteDescription = async (
    taskId: string,
    description: { text: string; createdAt: Date; completed: boolean },
    task: Task
  ) => {
    try {
      const res = await axiosPrivate.patch(
        `/business/${businessId}/categories/${expandedCategory}/tasks/${taskId}`,
        { action: "delete-description", description }
      );
      const updatedTask = res.data;
      const taskToEmit = {
        ...task,
        categoryId: expandedCategory,
        taskId: taskId,
        descriptions: task?.descriptions.filter(
          (desc) => desc.text !== description.text
        ),
      };
      socket?.emit("UPDATE_TASK", taskToEmit);
      setCategories((prevCategories) =>
        prevCategories?.map((category) => {
          if (category.id === expandedCategory) {
            return {
              ...category,
              tasks: category?.tasks?.map((task) => {
                if (task.id === taskId) {
                  return {
                    ...task,
                    descriptions: task.descriptions.filter(
                      (desc) => desc.text !== description.text
                    ),
                  };
                }
                return task;
              }),
            };
          }
          return category;
        })
      );
    } catch (error) {
      console.error("Error deleting description: ", error);
    }
  };

  const toggleTaskVisibility = (taskId: string) => {
    setHiddenTasks((prev) => {
      const newHiddenTasks = new Set(prev);
      if (newHiddenTasks.has(taskId)) {
        newHiddenTasks.delete(taskId);
      } else {
        newHiddenTasks.add(taskId);
      }
      return newHiddenTasks;
    });
  };

  const handleTaskInputChange = (name: string, categoryId: string) => {
    setNewTask({ name, categoryId });
  };

  const handleDescriptionChange = (taskId: string, description: string) => {
    setNewDescriptions((prev) => ({
      ...prev,
      [taskId]: description,
    }));
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const toggleTaskCompleted = async (
    categoryId: string,
    taskId: string,
    task: Task
  ) => {
    try {
      const response = await axiosPrivate.patch(
        `/business/${businessId}/categories/${categoryId}/tasks/${taskId}`,
        {
          action: "toggle-completed",
        }
      );
      const updatedTask = response.data;

      const taskToEmit = {
        ...task,
        categoryId: categoryId,
        completed: updatedTask.completed,
      };
      console.log(
        "task to emit from toggleTaskCompleted in tasksContext:",
        taskToEmit
      );
      socket?.emit("UPDATE_TASK", taskToEmit);
      setCategories((prevCategories) =>
        prevCategories?.map((category) => {
          if (category.id === categoryId) {
            return {
              ...category,
              tasks: category?.tasks?.map((task) => {
                if (task.id === taskId) {
                  return { ...task, completed: response.data.completed };
                }
                return task;
              }),
            };
          }
          return category;
        })
      );
    } catch (error) {
      console.error("Error toggling task completion: ", error);
    }
  };

  return (
    <TasksContext.Provider
      value={{
        newTask,
        setNewTask,
        newDescriptions,
        hiddenTasks,
        expandedCategory,
        handleAddTask,
        handleAddDescription,
        handleEditDescription,
        handleDeleteTask,
        handleDeleteDescription,
        toggleTaskVisibility,
        handleTaskInputChange,
        handleDescriptionChange,
        toggleCategoryExpansion,
        handleToggleDescriptionCompleted,
        toggleTaskCompleted,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};
