"use client";

import { useRouter, useParams } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Overview from "@/components/overview/Overview";

const OverviewPage = () => {
  const { id } = useParams();

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8 bg-slate-50 border-t-2 border-slate-300">
        <Overview businessId={id as string} expanded={true} />
      </div>
    </div>
  );
};

export default OverviewPage;
