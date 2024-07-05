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

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const res = await axiosPrivate.get(`/business/${businessId}/team`);

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
    } catch (error) {
      console.error("Error adding team member: ", error);
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
    <div className="max-w-3xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Team Management</h2>
      <div className="mb-4">
        <input
          type="email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          onKeyDown={(e) => handleEnterSubmit(e, addTeamMember)}
          placeholder="Enter team member email"
          className="p-2 border rounded mr-2"
        />
        <button
          onClick={addTeamMember}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add Member
        </button>
      </div>
      <ul>
        {teamMembers?.map((member) => (
          <li key={member} className="flex justify-between items-center mb-2">
            <span>{member}</span>
            <button
              onClick={() => removeTeamMember(member)}
              className="text-red-500 hover:text-red-700"
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
