
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Calendar, 
  Briefcase, 
  UserCheck,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Award,
  Clock,
  Bell,
  CalendarDays,
  UserPlus
} from "lucide-react";
import { Button } from "./ui/button";

const Sidebar = () => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    employees: false,
    hr: false,
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const closeMobileSidebar = () => {
    setIsMobileOpen(false);
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      path: "/",
      exact: true,
    },
    {
      title: "Employees",
      icon: Users,
      section: "employees",
      subItems: [
        { title: "All Employees", path: "/employees" },
        { title: "Add Employee", path: "/employees/create" },
      ],
    },
    {
      title: "Departments",
      icon: Building2,
      path: "/departments",
    },
    {
      title: "Projects",
      icon: Briefcase,
      path: "/projects",
    },
    {
      title: "Tasks",
      icon: UserCheck,
      path: "/tasks",
    },
    {
      title: "HR Management",
      icon: Calendar,
      section: "hr",
      subItems: [
        { title: "Attendance", path: "/attendance", icon: Clock },
        { title: "Leaves", path: "/leaves", icon: Calendar },
        { title: "Holidays", path: "/holidays", icon: CalendarDays },
        { title: "Payroll", path: "/payroll", icon: Award },
      ],
    },
    {
      title: "Recruitment",
      icon: UserPlus,
      section: "recruitment",
      subItems: [
        { title: "Job Openings", path: "/jobs", icon: Briefcase },
        { title: "Candidates", path: "/candidates", icon: Users },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      path: "/notifications",
    },
    {
      title: "Settings",
      icon: Settings,
      path: "/settings",
    },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h1 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
            HRMS
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeMobileSidebar}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 lg:p-4">
        <ul className="space-y-1 lg:space-y-2">
          {menuItems.map((item) => {
            if (item.section) {
              const isExpanded = expandedSections[item.section];
              const hasActiveSubItem = item.subItems?.some(subItem => isActive(subItem.path));
              
              return (
                <li key={item.title}>
                  <button
                    onClick={() => toggleSection(item.section!)}
                    className={`w-full flex items-center justify-between px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base font-medium rounded-lg transition-colors ${
                      hasActiveSubItem
                        ? "bg-primary text-primary-foreground"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-3 h-4 w-4 lg:h-5 lg:w-5" />
                      <span>{item.title}</span>
                    </div>
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </button>
                  
                  {isExpanded && item.subItems && (
                    <ul className="mt-1 lg:mt-2 ml-4 lg:ml-6 space-y-1">
                      {item.subItems.map((subItem) => (
                        <li key={subItem.path}>
                          <Link
                            to={subItem.path}
                            onClick={closeMobileSidebar}
                            className={`flex items-center px-3 lg:px-4 py-2 text-sm rounded-lg transition-colors ${
                              isActive(subItem.path)
                                ? "bg-primary text-primary-foreground"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                          >
                            {subItem.icon && <subItem.icon className="mr-2 h-3 w-3 lg:h-4 lg:w-4" />}
                            <span>{subItem.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={item.title}>
                <Link
                  to={item.path!}
                  onClick={closeMobileSidebar}
                  className={`flex items-center px-3 lg:px-4 py-2 lg:py-3 text-sm lg:text-base font-medium rounded-lg transition-colors ${
                    isActive(item.path!, item.exact)
                      ? "bg-primary text-primary-foreground"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <item.icon className="mr-3 h-4 w-4 lg:h-5 lg:w-5" />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 lg:p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 text-center">
          HRMS v2.0
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileOpen(true)}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
};

export default Sidebar;
