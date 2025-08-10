import PlaceholderPage from "./PlaceholderPage";
import { Settings as SettingsIcon } from "lucide-react";

export default function Settings() {
  return (
    <PlaceholderPage
      title="Settings & Profile"
      description="Manage your profile information, change password, configure notification preferences, and toggle dark mode."
      icon={SettingsIcon}
    />
  );
}
