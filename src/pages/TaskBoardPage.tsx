"use client";

import { useParams } from "next/navigation";
import TaskBoard from "@/components/TaskBoard/TaskBoard";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { TasksProvider } from "@/context/TasksContext";
import { useWebSocket } from "@/context/WebSocketContext";
import { useEffect } from "react";

const TaskBoardPage = () => {
  const { id } = useParams() || {};
  const { socket } = useWebSocket();

  useEffect(() => {
    if (socket) {
      socket.on("ADD_TASK", (data) => {
        console.log("ADD_TASK", data);
      });
      socket.on("UPDATE_TASK", (data) => {
        console.log("UPDATE_TASK", data);
      });
      socket.on("DELETE_TASK", (data) => {
        console.log("DELETE_TASK", data);
      });

      return () => {
        socket.off("ADD_TASK");
        socket.off("UPDATE_TASK");
        socket.off("DELETE_TASK");
      };
    }
  }, [socket]);

  return (
    <div className="flex min-h-screen ">
      <div className="flex-1  bg-slate-50 border-t-2 border-slate-300">
        <CategoriesProvider businessId={id as string}>
          <TasksProvider businessId={id as string}>
            <TaskBoard businessId={id as string} expanded={true} />
          </TasksProvider>
        </CategoriesProvider>
      </div>
    </div>
  );
};

export default TaskBoardPage;
