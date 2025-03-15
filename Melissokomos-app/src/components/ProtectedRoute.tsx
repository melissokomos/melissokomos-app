import { useAuth } from "@/context/AuthContext"; // Corrected import
import { Navigate, Outlet } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout"; // Import DashboardLayout

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Render a loading indicator or placeholder
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    // Redirect to sign-in if not authenticated
    return <Navigate to="/sign-in" replace />;
  }

  // Render the DashboardLayout, and place Outlet *inside* it.
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedRoute;
