import {
  Bell,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Home,
  LogOut,
  Menu,
  User,
  X,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

import HeaderDateTimeWidget from "../HeaderDateTimeWidget";

import ThemeToggle from "@/components/ui/ThemeToggle";
import { getRoleConfig } from "@/config/navigationItem";
import { useAuth } from "@/contexts/AuthContext";
import { useUser } from "@/hooks/useUser";

export default function AppNavbar({
  role = "admin",
  sidebarOpen,
  setSidebarOpen,
  userInfo = null,
  isCollapsed = false,
  setIsCollapsed,
}) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const router = useRouter();
  const { logout } = useAuth();
  const { user: authUser } = useUser();
  const config = getRoleConfig(role);
  const LogoIcon = config.logoIcon;

  // Use real user data, fallback to provided userInfo, then config default
  const currentUser = authUser || userInfo || config.userInfo;

  const isActiveRoute = (href) => {
    return router.pathname === href;
  };

  const isParentActive = (item) => {
    if (isActiveRoute(item.href)) return true;
    if (item.children) {
      return item.children.some((child) => isActiveRoute(child.href));
    }

    return false;
  };

  const toggleSubmenu = (href) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  // Tooltip component for collapsed sidebar
  const Tooltip = ({ children, content, show }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState({ top: 0 });
    const triggerRef = useRef(null);
    const timeoutRef = useRef(null);

    if (!show || !isCollapsed) return children;

    const handleMouseEnter = () => {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();

        setTooltipPosition({
          top: rect.top + rect.height / 2,
        });
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      // Add small delay to prevent flickering
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
      }, 150);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    return (
      <>
        <div
          ref={triggerRef}
          className="w-full"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {children}
        </div>

        {isVisible && (
          <div
            className="fixed left-20 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-md whitespace-nowrap pointer-events-none shadow-lg transition-all duration-200 opacity-100"
            style={{
              top: tooltipPosition.top,
              transform: "translateY(-50%)",
              zIndex: 10000,
            }}
          >
            {content}
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-100" />
          </div>
        )}
      </>
    );
  };

  const renderMenuItem = (item) => {
    const hasChildren = item.children && item.children.length > 0;
    const IconComponent = item.icon;
    const isActive = isActiveRoute(item.href);
    const isParentActiveState = isParentActive(item);
    const isExpanded = expandedMenus[item.href];

    if (hasChildren) {
      return (
        <li key={item.href}>
          {/* Parent Menu Item */}
          <Tooltip content={item.label} show={isCollapsed}>
            <div
              className={`
                flex items-center ${isCollapsed ? "justify-center" : "justify-between"} p-3 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer group
                ${
                  isParentActiveState
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                }
              `}
              onClick={() => !isCollapsed && toggleSubmenu(item.href)}
            >
              <div
                className={`flex items-center ${isCollapsed ? "justify-center w-full" : ""}`}
              >
                <IconComponent
                  className={`
                    w-5 h-5 ${isCollapsed ? "" : "mr-3"} transition-colors duration-200
                    ${
                      isParentActiveState
                        ? "text-blue-700 dark:text-blue-300"
                        : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                    }
                  `}
                />
                {!isCollapsed && item.label}
              </div>
              {!isCollapsed &&
                (isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                ))}
            </div>
          </Tooltip>

          {/* Submenu Items */}
          {isExpanded && !isCollapsed && (
            <ul className="ml-6 mt-2 space-y-1">
              {item.children.map((child) => {
                const ChildIconComponent = child.icon;
                const isChildActive = isActiveRoute(child.href);

                return (
                  <li key={child.href}>
                    <Link
                      className={`
                        flex items-center p-2 text-sm rounded-lg transition-all duration-200 group
                        ${
                          isChildActive
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-4 border-blue-700 dark:border-blue-400"
                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
                        }
                      `}
                      href={child.href}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <ChildIconComponent
                        className={`
                          w-4 h-4 mr-3 transition-colors duration-200
                          ${
                            isChildActive
                              ? "text-blue-700 dark:text-blue-300"
                              : "text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                          }
                        `}
                      />
                      {child.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </li>
      );
    }

    // Regular menu item without children
    return (
      <li key={item.href}>
        <Tooltip content={item.label} show={isCollapsed}>
          <Link
            className={`
              flex items-center ${isCollapsed ? "justify-center" : ""} p-3 text-sm font-medium rounded-lg transition-all duration-200 group
              ${
                isActive
                  ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-r-4 border-blue-700 dark:border-blue-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400"
              }
            `}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
          >
            <IconComponent
              className={`
                w-5 h-5 ${isCollapsed ? "" : "mr-3"} transition-colors duration-200
                ${
                  isActive
                    ? "text-blue-700 dark:text-blue-300"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                }
              `}
            />
            {!isCollapsed && item.label}
          </Link>
        </Tooltip>
      </li>
    );
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed w-full z-30 top-0 transition-colors duration-200">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start">
              {/* Mobile/Desktop sidebar toggle */}
              <button
                className="inline-flex items-center p-2 text-sm text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors duration-200"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Logo - Hidden on larger screens when sidebar is visible */}
              <Link
                className="flex ml-2 lg:hidden"
                href={config.dashboardRoute}
              >
                <span className="self-center text-xl font-semibold whitespace-nowrap text-blue-600 dark:text-blue-400">
                  {config.fullTitle}
                </span>
              </Link>

              {/* DateTime Widget - Adjust margin based on sidebar state */}
              <div
                className={`hidden md:block ml-4 transition-all duration-300 ${isCollapsed ? "lg:ml-20" : "lg:ml-60"}`}
              >
                <HeaderDateTimeWidget />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* View Public Website Button */}
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors duration-200"
                title="Lihat Website Public"
              >
                <Globe className="w-5 h-5" />
              </Link>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <button className="p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-600 transition-colors duration-200">
                <Bell className="w-5 h-5" />
              </button>

              {/* Profile dropdown */}
              <div className="relative ml-3">
                <button
                  className="flex items-center text-sm bg-gray-800 dark:bg-gray-600 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-500 transition-colors duration-200"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 z-50 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 dark:ring-gray-600 transition-colors duration-200">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600">
                      <div className="font-medium">{currentUser.name}</div>
                      <div className="text-gray-500 dark:text-gray-400">
                        {currentUser.email}
                      </div>
                    </div>
                    {/* <Link
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      href={config.dashboardRoute}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Kembali ke Dashboard
                    </Link> */}
                    <Link
                      className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      href={`${config.baseRoute}/profile`}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profil
                    </Link>
                    {/* <Link
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      href={`${config.baseRoute}/settings`}
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Pengaturan
                    </Link> */}
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                      }}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden bg-black/25 backdrop-blur-sm transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        fixed top-0 left-0 z-40 ${isCollapsed ? "w-16" : "w-64"} h-screen pt-2 transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800 custom-scrollbar transition-colors duration-300">
          {/* Sidebar Header */}
          <div
            className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} p-4 border-b border-gray-200 dark:border-gray-700 lg:border-none transition-colors duration-300`}
          >
            <Link
              className={`flex items-center ${isCollapsed ? "justify-center" : ""}`}
              href={config.dashboardRoute}
            >
              <Tooltip content={config.fullTitle} show={isCollapsed}>
                <div
                  className={`w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center ${isCollapsed ? "" : "mr-3"}`}
                >
                  <LogoIcon className="w-5 h-5 text-white" />
                </div>
              </Tooltip>
              {!isCollapsed && (
                <span className="text-xl font-semibold text-blue-600 dark:text-blue-400 transition-colors duration-300">
                  {config.fullTitle}
                </span>
              )}
            </Link>

            {!isCollapsed && (
              <>
                {/* Collapse button for desktop */}
                <button
                  className="hidden lg:block p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setIsCollapsed(true)}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Close button for mobile */}
                <button
                  className="lg:hidden p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Expand button when collapsed */}
            {isCollapsed && (
              <button
                className="hidden lg:block absolute top-4 left-12 p-2 text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                onClick={() => setIsCollapsed(false)}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="mt-1">
            <ul className="space-y-2">
              {config.navigation.map((item) => renderMenuItem(item))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors duration-300">
            {isCollapsed ? (
              <Tooltip
                content={`${currentUser.name} - ${currentUser.organization}`}
                show={isCollapsed}
              >
                <div className="flex justify-center">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center transition-colors duration-300">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                </div>
              </Tooltip>
            ) : (
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 transition-colors duration-300">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3 transition-colors duration-300">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <div className="font-medium">{currentUser.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {currentUser.organization}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
