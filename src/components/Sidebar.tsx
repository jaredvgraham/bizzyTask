"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import {
  FiGrid,
  FiSettings,
  FiUser,
  FiLogOut,
  FiBook,
  FiUsers,
  FiTarget,
} from "react-icons/fi";

const Sidebar = () => {
  const pathname = usePathname();
  const { id } = useParams() ?? {};

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

  const headingText = isInBusiness ? "Business Plan Assistant" : "BizFast";

  const headingColor = "text-teal-600";

  const headingStyle = "text-2xl font-bold text-center";

  return (
    <div className="relative">
      <div
        className={`w-64 ${sidebarColorClass} text-black flex flex-col border-r border-slate-300 h-screen transition-all duration-500 sticky top-0 shadow-lg`}
      >
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
                    pathname === link.href ? "bg-teal-500 text-white" : ""
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
              <Link
                href="/settings"
                className="flex items-center p-3 rounded-lg text-gray-800 hover:bg-teal-500 hover:text-white transition duration-300"
              >
                <FiSettings />
                <span className="ml-3">Settings</span>
              </Link>
            </li>
            <li>
              <Link
                href="/profile"
                className="flex items-center p-3 rounded-lg text-gray-800 hover:bg-teal-500 hover:text-white transition duration-300"
              >
                <FiUser />
                <span className="ml-3">Profile</span>
              </Link>
            </li>
            <li>
              <Link
                href="/logout"
                className="flex items-center p-3 rounded-lg text-gray-800 hover:bg-teal-500 hover:text-white transition duration-300"
              >
                <FiLogOut />
                <span className="ml-3">Logout</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
