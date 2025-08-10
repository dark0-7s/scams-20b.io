import PlaceholderPage from "./PlaceholderPage";
import { Calendar } from "lucide-react";

export default function Attendance() {
  return (
    <PlaceholderPage
      title="Attendance Module"
      description="View and manage your attendance records, mark attendance with fingerprint verification, and track attendance by subject and date range."
      icon={Calendar}
    />
  );
}
