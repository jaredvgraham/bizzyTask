"use client";

import { useParams } from "next/navigation";
import TaskBoard from "@/components/TaskBoard/TaskBoard";
import Sidebar from "@/components/Sidebar";

const TaskBoardPage = () => {
  const { id } = useParams();

  return (
    <div className="flex min-h-screen ">
      <div className="flex-1  bg-slate-50 border-t-2 border-slate-300">
        <TaskBoard businessId={id as string} expanded={true} />
      </div>
    </div>
  );
};

export default TaskBoardPage;
