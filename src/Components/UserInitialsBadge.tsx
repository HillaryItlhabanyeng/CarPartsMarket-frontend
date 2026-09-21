import { useNavigate } from "react-router-dom";

import { getCurrentUser } from "./notificationStore";

import "./DashboardShell.css";

function getInitials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

// Top-corner profile button: the logged-in user's initials instead of a photo. Opens /profile.
export default function UserInitialsBadge() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const name = user?.name?.trim() || user?.email?.split("@")[0] || "User";

  return (
    <button
      type="button"
      className="dash-initials"
      aria-label="Open profile"
      onClick={() => navigate("/profile")}
    >
      {getInitials(name)}
    </button>
  );
}
