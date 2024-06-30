"use client";

import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";

const DashboardPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
};

export default DashboardPage;
