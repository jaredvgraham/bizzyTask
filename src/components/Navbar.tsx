"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { axiosPrivate } from "@/axios/axios";

const Navbar = () => {
  const pathname = usePathname();
  const isDashboard = pathname && pathname === "/dashboard";
  const [businessName, setBusinessName] = useState("");
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

  useEffect(() => {
    const fetchBusinessName = async () => {
      if (pathname) {
        const pathParts = pathname.split("/");
        if (pathParts.length >= 3 && pathParts[1] === "business") {
          const businessId = pathParts[2];
          const businessDoc = await axiosPrivate.get(`/business/${businessId}`);
          if (businessDoc) {
            setBusinessName(businessDoc.data.name);
          }
        }
      }
    };

    fetchBusinessName();
  }, [pathname]);

  return (
    <nav className="bg-gray-50 text-white shadow-md sticky top-0 ">
      <div
        className={`container mx-auto flex ${
          !isMobile ? "justify-between" : "justify-center"
        } items-center p-4`}
      >
        <div className="flex items-center">
          <Image
            src="/logo3.png"
            alt="Business Plan Assistant"
            width={40}
            height={40}
            onClick={() => window.location.replace("/dashboard")}
          />
        </div>
        {!isMobile ? (
          <span className="text-xl font-normal ml-10  text-gray-800">
            {isDashboard
              ? "BizzyTask"
              : businessName || "Business Plan Assistant"}
          </span>
        ) : null}

        <ul className="flex space-x-4 text-gray-800">
          {!isMobile && (
            <li>
              <Link href="/dashboard">Dashboard</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
