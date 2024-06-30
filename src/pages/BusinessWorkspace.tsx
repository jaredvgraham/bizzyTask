"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Sidebar from "@/components/Sidebar";
import ProjectSummary from "@/components/ProjectSummary";

const BusinessWorkspace = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const { user } = useAuth();
  const [business, setBusiness] = useState<any>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      if (id && user) {
        const docRef = doc(db, "businesses", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBusiness({ id: docSnap.id, ...docSnap.data() }); // Ensure id is included
        }
      }
    };

    fetchBusiness();
  }, [id, user]);

  if (!business) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8 bg-slate-50 border-t-2 border-slate-300">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Business Plan for {business.name}
        </h2>
        <ProjectSummary business={business} />
        {/* Add an overview or other default content here */}
      </div>
    </div>
  );
};

export default BusinessWorkspace;
