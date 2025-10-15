import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/pages/dashboards/AdminDashboard";
import DepartmentModeratorDashboard from "@/pages/dashboards/DepartmentModeratorDashboard";
import LecturerDashboard from "@/pages/dashboards/LecturerDashboard";
import StudentDashboard from "@/pages/dashboards/StudentDashboard";

export default function RoleBasedDashboard() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'department_moderator':
      return <DepartmentModeratorDashboard />;
    case 'lecturer':
      return <LecturerDashboard />;
    case 'student':
      return <StudentDashboard />;
    default:
      return <StudentDashboard />;
  }
}
