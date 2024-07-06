"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { axiosPrivate } from "@/axios/axios";
import axios from "axios";

const CreateBusiness = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("web-app");
  const router = useRouter();

  const handleCreateBusiness = async () => {
    try {
      // Generate a custom template using ChatGPT API
      const templateResponse = await axiosPrivate.post("/template", {
        type,
        description,
      });
      const template = templateResponse.data.template;

      // Create the business in Firestore with the template
      const res = await axiosPrivate.post("/business", {
        name,
        description,
        type,
        userId: user?.uid,
        userEmail: user?.email,
        template: template, // Pass the parsed template
      });
      console.log(res);
      const id = res.data.bsuinessId;

      router.push(`/business/${id}`);
    } catch (error) {
      console.log(error);
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
