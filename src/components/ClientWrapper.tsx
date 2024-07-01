"use client";

import { ReactNode } from "react";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";

const ClientWrapper = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const hideSidebarAndNavbar = pathname === "/signin" || pathname === "/signup";

  return (
    <div className="flex">
      {!hideSidebarAndNavbar && <Sidebar />}
      <div className="flex-1 flex flex-col">
        {!hideSidebarAndNavbar && <Navbar />}
        <main>{children}</main>
      </div>
    </div>
  );
};

export default ClientWrapper;