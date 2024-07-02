"use client";
import ProgressCalculator from "@/components/ProgressCalculator";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import { FiTrash2 } from "react-icons/fi";

interface Business {
  id: string;
  name: string;
  description: string;
  type: string;
  progress: number;
}

const Dashboard = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      if (user) {
        // Combined query to fetch businesses created by the user or where the user is a team member
        const q = query(
          collection(db, "businesses"),
          where("teamMembers", "array-contains", user.email)
        );
        const querySnapshot = await getDocs(q);
        const userBusinesses = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Business)
        );

        // Use a Set to ensure uniqueness
        const uniqueBusinesses = new Map();
        userBusinesses.forEach((business) => {
          uniqueBusinesses.set(business.id, business);
        });

        setBusinesses(Array.from(uniqueBusinesses.values()));
      }
    };

    fetchBusinesses();
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/signin");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleDelete = async (businessId: string) => {
    try {
      await deleteDoc(doc(db, "businesses", businessId));
      setBusinesses(
        businesses.filter((business) => business.id !== businessId)
      );
    } catch (error) {
      console.error("Error deleting business: ", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8 bg-slate-50 border-t-2 border-slate-300 ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button onClick={handleLogout} className="text-red-500">
            Logout
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {businesses.map((business) => (
            <div
              key={business.id}
              className="border p-4 rounded-lg shadow relative"
            >
              <button
                onClick={() => handleDelete(business.id)}
                className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              >
                <FiTrash2 size={20} />
              </button>
              <h2 className="text-xl font-bold">{business.name}</h2>
              <p>{business.description}</p>
              <div className="mt-2">
                <ProgressCalculator businessId={business.id} />
              </div>
              <button
                onClick={() => router.push(`/business/${business.id}/overview`)}
                className="mt-4 w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gradient-to-r hover:from-gray-900  hover:to-teal-700"
              >
                View Business
              </button>
            </div>
          ))}
          <button
            onClick={() => router.push("/create-business")}
            className="border-dashed border-4 border-gray-300 p-4 rounded-lg flex items-center justify-center text-gray-600 hover:border-gray-400"
          >
            Create New Business
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
