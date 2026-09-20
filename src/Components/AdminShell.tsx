import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { FaCog } from "react-icons/fa";

import NotificationBell from "./NotificationBell";
import SideNavigation from "./SideNavigation";
import { getCurrentUser } from "./notificationStore";

import "./DashboardShell.css";
import "./AdminShell.css";

type AdminShellProps = {
  title: string;
  subtitle?: string;
  // Extra controls shown on the right of the header, before the bell
  actions?: ReactNode;
  children: ReactNode;
};

function getInitials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.substring(0, 2).toUpperCase();
}

// Same layout as Dashboard / Addresses / Product Listing: shared sidebar + white header + content.
// Every admin page renders inside this so the admin area looks and navigates like the rest of the app.
export default function AdminShell({ title, subtitle, actions, children }: AdminShellProps) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const displayName = currentUser?.name?.trim() || currentUser?.email?.split("@")[0] || "Admin";

  return (
    <div className="dash-app-container">
      <SideNavigation role="admin" />

      <main className="dash-main-content">
        <header className="dash-top-header">
          <div className="dash-header-left">
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>

          <div className="dash-header-right">
            {actions}

            <NotificationBell />

            <button
              type="button"
              className="adm-icon-btn"
              aria-label="Settings"
              onClick={() => navigate("/settings")}
            >
              <FaCog />
            </button>

            <button
              type="button"
              className="adm-initials"
              aria-label="Open profile"
              onClick={() => navigate("/profile")}
            >
              {getInitials(displayName)}
            </button>
          </div>
        </header>

        <div className="dash-scrollable-area">{children}</div>
      </main>
    </div>
  );
}
