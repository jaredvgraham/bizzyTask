"use client";

import { useRouter, useParams } from "next/navigation";
import Milestones from "@/components/Milestones";
import Sidebar from "@/components/Sidebar";

const MilestonesPage = () => {
  // const { id } = useParams() as { id: string };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8 bg-slate-50 border-t-2 border-slate-300">
        <Milestones />
      </div>
    </div>
  );
};

export default MilestonesPage;
