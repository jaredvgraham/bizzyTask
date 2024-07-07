"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

const Navbar = () => {
  const pathname = usePathname();
  const isDashboard = pathname && pathname === "/dashboard";
  const [businessName, setBusinessName] = useState("");

  useEffect(() => {
    const fetchBusinessName = async () => {
      if (pathname) {
        const pathParts = pathname.split("/");
        if (pathParts.length >= 3 && pathParts[1] === "business") {
          const businessId = pathParts[2];
          const businessDoc = await getDoc(doc(db, "businesses", businessId));
          if (businessDoc.exists()) {
            const businessData = businessDoc.data();
            setBusinessName(businessData.name);
          }
        }
      }
    };

    fetchBusinessName();
  }, [pathname]);

  return (
    <nav className="bg-gray-50 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        <div className="flex items-center">
          <Image
            src="/logo3.png"
            alt="Business Plan Assistant"
            width={40}
            height={40}
            onClick={() => window.location.replace("/dashboard")}
          />
        </div>
        <span className="text-xl font-normal ml-10  text-gray-800">
          {isDashboard
            ? "BizzyTask"
            : businessName || "Business Plan Assistant"}
        </span>
        <ul className="flex space-x-4 text-gray-800">
          <li>
            <Link href="/dashboard">Dashboard</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
