"use client";

import React, { useState, useEffect } from "react";

import { axiosPrivate } from "@/axios/axios";
import handleEnterSubmit from "@/utils/handleEnterSubmit";

interface TeamManagementProps {
  businessId: string;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ businessId }) => {
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState<string>("");
  const [teamMembersCount, setTeamMembersCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [successful, setSuccessful] = useState<boolean>(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await axiosPrivate.get(`/business/${businessId}/team`);
        const mems = res.data.length;
        setTeamMembersCount(mems);

        setTeamMembers(res.data);
      } catch (error) {
        console.log("Error fetching team members: ", error);
      }
    };
    fetchTeamMembers();
  }, [businessId]);

  const addTeamMember = async () => {
    if (newMemberEmail.trim() === "") return;

    try {
      const res = await axiosPrivate.post(`/business/${businessId}/team`, {
        email: newMemberEmail,
      });
      setTeamMembers((prev) => [...prev, newMemberEmail]);
      setNewMemberEmail("");
      setError(null);
      setSuccessful(true);
    } catch (error) {
      console.error("Error adding team member: ", error);
      setError("Error adding team member");
    }
  };

  const removeTeamMember = async (email: string) => {
    try {
      await axiosPrivate.delete(`/business/${businessId}/team`, {
        data: { email },
      });
      setTeamMembers((prev) => prev.filter((member) => member !== email));
    } catch (error) {
      console.error("Error removing team member:", error);
    }
  };

  return (
    <div className="w-full mx-auto p-8 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Team Management
      </h2>
      {error && <p className="text-red-500 mb-6">{error}</p>}
      {successful && (
        <p className="text-green-500 mb-6">Team member added successfully</p>
      )}
      <div className="flex mb-6">
        <input
          type="email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          onKeyDown={(e) => handleEnterSubmit(e, addTeamMember)}
          placeholder="Enter team member email"
          className="flex-grow p-4 border border-gray-300 rounded-l-lg   focus:outline-none"
        />
        <button
          onClick={addTeamMember}
          className="bg-black text-white p-4 rounded-r-lg hover:bg-indigo-700 transition duration-300"
        >
          Add Member
        </button>
      </div>
      <p className="text-gray-700 mb-6 text-lg">
        Team Members: <strong>{teamMembersCount}</strong>
      </p>
      <ul className="divide-y divide-gray-200">
        {teamMembers?.map((member) => (
          <li key={member} className="flex justify-between items-center py-3">
            <span className="text-gray-900 text-lg">{member}</span>
            <button
              onClick={() => removeTeamMember(member)}
              className="text-red-500 hover:text-red-700 transition duration-300"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamManagement;
