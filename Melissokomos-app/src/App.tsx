import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import HiveMonitoring from "./pages/HiveMonitoring";
import Education from "./pages/Education";
import NotFound from "./pages/NotFound";
import AIAssistant from "./pages/AIAssistant";
import Inventory from "./pages/Inventory";
import Tasks from "./pages/Tasks";
import Inspections from "./pages/Inspections";
import Hives from "./pages/Hives";

// Layout Components
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/hive-monitoring" element={<HiveMonitoring />} />
              <Route path="/education" element={<Education />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/inspections" element={<Inspections />} />
              <Route path="/hives" element={<Hives />} />
              <Route path="/tasks" element={<Tasks />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
