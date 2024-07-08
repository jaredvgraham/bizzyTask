"use client";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import router from "next/router";
import { useEffect, useState } from "react";
import {
  FiGrid,
  FiLogOut,
  FiBook,
  FiUsers,
  FiTarget,
  FiMenu,
  FiX,
} from "react-icons/fi";

const Sidebar = () => {
  const pathname = usePathname();
  const { id } = useParams() ?? {};
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 950) {
        setIsMobile(true);
        setIsOpen(false);
      } else {
        setIsMobile(false);
        setIsOpen(true); // Keep sidebar open on larger screens
      }
    };

    handleResize(); // Set the initial state
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      router.push("/signin");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const getDynamicLinks = () => {
    if (pathname?.startsWith(`/business/${id}`)) {
      return [
        {
          href: `/business/${id}/overview`,
          label: "Overview",
          icon: <FiBook />,
        },
        {
          href: `/business/${id}/task-board`,
          label: "Task Board",
          icon: <FiGrid />,
        },
        {
          href: `/business/${id}/team-management`,
          label: "Team Management",
          icon: <FiUsers />,
        },
        {
          href: `/business/${id}/milestones`,
          label: "Milestones",
          icon: <FiTarget />,
        },
      ];
    }
    return [
      { href: "/dashboard" || "/", label: "Dashboard", icon: <FiGrid /> },
    ];
  };

  const dynamicLinks = getDynamicLinks();

  const isInBusiness = pathname?.startsWith(`/business/${id}`) || false;
  const sidebarColorClass = isInBusiness
    ? "bg-gradient-to-b from-slate-50 to-slate-100 fade-in"
    : "bg-slate-50";

  const headingText = isInBusiness ? "Business Plan Assistant" : "BizzyTask";

  const headingColor = "text-teal-600";

  const headingStyle = "text-2xl font-bold text-center";

  return (
    <div className="relative">
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 text-3xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>
      )}
      {(isOpen || !isMobile) && (
        <div
          className={`w-64 ${sidebarColorClass} text-black flex flex-col border-r border-slate-300 h-screen transition-all duration-500 ${
            !isMobile && "sticky top-0"
          }   shadow-lg ${
            isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"
          } ${sidebarColorClass} text-black flex flex-col border-r border-slate-300 h-screen shadow-lg z-50`}
        >
          {isMobile && (
            <button
              className="fixed top-4 left-4 z-50 text-3xl"
              onClick={() => setIsOpen(!isOpen)}
            >
              <FiX />
            </button>
          )}
          <div className="p-6">
            <h2 className={`${headingColor} ${headingStyle}`}>{headingText}</h2>
          </div>
          <nav className="flex-1 p-6 flex flex-col justify-between">
            <ul className="space-y-2">
              {dynamicLinks.map((link) => (
                <li key={link.href} className="mb-1">
                  <Link
                    href={link.href}
                    className={`flex items-center p-3 rounded-lg text-gray-800 hover:bg-teal-500 hover:text-white transition duration-300 ${
                      pathname === link.href ? "bg-black text-white" : ""
                    }`}
                  >
                    {link.icon}
                    <span className="ml-3">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="space-y-2">
              <li>
                <div
                  className="flex items-center p-3 rounded-lg text-gray-800 hover:text-red-500 transition duration-300 cursor-pointer"
                  onClick={handleLogOut}
                >
                  <FiLogOut />
                  <span className="ml-3">Logout</span>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
