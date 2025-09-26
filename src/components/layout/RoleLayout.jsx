import { useState } from "react";
import AppNavbar from "@/components/partials/AppNavbar";
import AppFooter from "@/components/partials/AppFooter";

export default function RoleLayout({
  children,
  role = "admin",
  userInfo = null,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <AppNavbar
        role={role}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userInfo={userInfo}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main content - Responsive to sidebar collapse */}
      <div
        className={`transition-all duration-300 pt-16 ${
          isCollapsed ? "lg:pl-16" : "lg:pl-64"
        }`}
      >
        <main className="min-h-screen">{children}</main>
        <AppFooter role={role} />
      </div>
    </div>
  );
}
