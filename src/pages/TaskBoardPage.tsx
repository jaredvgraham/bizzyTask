"use client";

import { useParams } from "next/navigation";
import TaskBoard from "@/components/TaskBoard/TaskBoard";
import { CategoriesProvider } from "@/context/CategoriesContext";
import { TasksProvider } from "@/context/TasksContext";

const TaskBoardPage = () => {
  const { id } = useParams() || {};

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
