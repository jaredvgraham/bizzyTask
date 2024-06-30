"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

interface BusinessFeature {
  id: string;
  name: string;
  description: string;
  type: "frontend" | "backend";
}

const BusinessPlan = ({ businessId }: { businessId: string }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [features, setFeatures] = useState<BusinessFeature[]>([]);
  const [newFeature, setNewFeature] = useState<Partial<BusinessFeature>>({
    name: "",
    description: "",
    type: "frontend",
  });

  useEffect(() => {
    const fetchFeatures = async () => {
      if (user) {
        const q = query(
          collection(db, "features"),
          where("businessId", "==", businessId)
        );
        const querySnapshot = await getDocs(q);
        const businessFeatures = querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as BusinessFeature)
        );
        setFeatures(businessFeatures);
      }
    };

    fetchFeatures();
  }, [user, businessId]);

  const handleAddFeature = async () => {
    if (newFeature.name && newFeature.description && newFeature.type) {
      try {
        const feature = { ...newFeature, businessId, userId: user?.uid };
        const docRef = await addDoc(collection(db, "features"), feature);
        setFeatures([
          ...features,
          { ...feature, id: docRef.id } as BusinessFeature,
        ]);
        setNewFeature({ name: "", description: "", type: "frontend" });
      } catch (e) {
        console.error("Error adding feature: ", e);
      }
    }
  };

  const handleFeatureChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewFeature({ ...newFeature, [name]: value });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full bg-white p-8 border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Business Plan for {businessId}
        </h2>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Add New Feature</h3>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={newFeature.name}
              onChange={handleFeatureChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={newFeature.description}
              onChange={handleFeatureChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            ></textarea>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Type
            </label>
            <select
              name="type"
              value={newFeature.type}
              onChange={handleFeatureChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
            >
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
            </select>
          </div>
          <button
            onClick={handleAddFeature}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Feature
          </button>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Features</h3>
          {features.map((feature) => (
            <div
              key={feature.id}
              className="mb-4 p-4 border border-gray-300 rounded-md"
            >
              <h4 className="text-lg font-bold">{feature.name}</h4>
              <p className="text-sm text-gray-700">{feature.description}</p>
              <p className="text-sm text-gray-500">Type: {feature.type}</p>
            </div>
          ))}
        </div>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default BusinessPlan;
