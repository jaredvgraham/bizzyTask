"use client";

import React, { useState, useEffect } from "react";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

interface TeamManagementProps {
  businessId: string;
}

const TeamManagement: React.FC<TeamManagementProps> = ({ businessId }) => {
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [newMemberEmail, setNewMemberEmail] = useState("");

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const businessRef = doc(db, "businesses", businessId);
        const businessDoc = await getDoc(businessRef);
        if (businessDoc.exists()) {
          setTeamMembers(businessDoc.data().teamMembers || []);
        }
      } catch (error) {
        console.error("Error fetching team members: ", error);
      }
    };
    fetchTeamMembers();
  }, [businessId]);

  const addTeamMember = async () => {
    if (newMemberEmail.trim() === "") return;
    try {
      const userRef = doc(db, "users", newMemberEmail);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const businessRef = doc(db, "businesses", businessId);
        await updateDoc(businessRef, {
          teamMembers: arrayUnion(newMemberEmail),
        });

        await updateDoc(userRef, {
          businesses: arrayUnion(businessId),
        });

        setTeamMembers((prev) => [...prev, newMemberEmail]);
        setNewMemberEmail("");
      } else {
        console.error("User does not exist.");
      }
    } catch (error) {
      console.error("Error adding team member: ", error);
    }
  };

  const removeTeamMember = async (email: string) => {
    try {
      const businessRef = doc(db, "businesses", businessId);
      await updateDoc(businessRef, {
        teamMembers: arrayRemove(email),
      });

      const userRef = doc(db, "users", email);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          businesses: arrayRemove(businessId),
        });
      } else {
        console.error("User does not exist.");
      }

      setTeamMembers((prev) => prev.filter((member) => member !== email));
    } catch (error) {
      console.error("Error removing team member: ", error);
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
        {teamMembers.map((member) => (
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
