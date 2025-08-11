import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Attendance from "./pages/Attendance";
import Resources from "./pages/Resources";
import Announcements from "./pages/Announcements";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import RoleBasedDashboard from "./components/layout/RoleBasedDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Login page */}
          <Route path="/login" element={<Login />} />

          {/* Forgot password page */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Dashboard routes with layout */}
          <Route
            path="/dashboard"
            element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            }
          />
          <Route
            path="/attendance"
            element={
              <DashboardLayout>
                <Attendance />
              </DashboardLayout>
            }
          />
          <Route
            path="/resources"
            element={
              <DashboardLayout>
                <Resources />
              </DashboardLayout>
            }
          />
          <Route
            path="/announcements"
            element={
              <DashboardLayout>
                <Announcements />
              </DashboardLayout>
            }
          />
          <Route
            path="/settings"
            element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            }
          />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
