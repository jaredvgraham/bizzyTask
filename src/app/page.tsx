import Dashboard from "@/pages/Dashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import withAuthCheck from "@/components/withAuthCheck";

const HomePage = () => {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
};

export default HomePage;
