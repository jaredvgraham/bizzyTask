"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import webAppTemplate from "@/templates/webApp.json"; // Importing the web app template
import { useAuth } from "@/context/AuthContext";

const CreateBusiness = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("web-app");
  const router = useRouter();

  const handleCreateBusiness = async () => {
    if (!user) {
      console.error("No user is logged in");
      return;
    }

    try {
      const businessRef = await addDoc(collection(db, "businesses"), {
        name,
        description,
        type,
        userId: user.uid, // Include the userId here
        progress: 0, // Initialize progress to 0
      });

      // Load template categories and tasks
      let template = null;
      if (type === "web-app") {
        template = webAppTemplate;
      }

      if (template) {
        for (const category of template.categories) {
          await addDoc(
            collection(db, "businesses", businessRef.id, "categories"),
            { name: category.name }
          );
        }
      }

      router.push(`/business/${businessRef.id}/overview`);
    } catch (error) {
      console.error("Error creating business: ", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-4xl w-full bg-white p-8 border border-gray-300 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Business</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="web-app">Web App</option>
            <option value="mobile-app">Mobile App</option>
            {/* Add more options as needed */}
          </select>
        </div>
        <button
          onClick={handleCreateBusiness}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Business
        </button>
      </div>
    </div>
  );
};

export default CreateBusiness;
