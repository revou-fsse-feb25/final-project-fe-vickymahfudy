"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import { Icons } from "../../components/ui/icons";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 animate-spin border-4 border-gray-300 border-t-yellow-400"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null; // Will redirect to login
  }

  const hierarchicalStructure = [
    {
      level: 1,
      title: "Verticals",
      description: "Learning tracks and specializations",
      href: "/admin/verticals",
      icon: "target",
      color: "bg-blue-500",
      children: "Batches",
    },
    {
      level: 2,
      title: "Batches",
      description: "Student cohorts within verticals",
      href: "/admin/batches",
      icon: "users",
      color: "bg-green-500",
      parent: "Verticals",
      children: "Modules",
    },
    {
      level: 3,
      title: "Modules",
      description: "Course modules within batches",
      href: "/admin/modules",
      icon: "book",
      color: "bg-purple-500",
      parent: "Batches",
      children: "Weeks",
    },
    {
      level: 4,
      title: "Weeks",
      description: "Weekly schedules within modules",
      href: "/admin/weeks",
      icon: "calendar",
      color: "bg-orange-500",
      parent: "Modules",
      children: "Lectures",
    },
    {
      level: 5,
      title: "Lectures",
      description: "Individual lectures within weeks",
      href: "/admin/lectures",
      icon: "graduation",
      color: "bg-red-500",
      parent: "Weeks",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <AdminNavbar
        title="Revou LMS - Admin"
        subtitle="Administrative Dashboard"
        icon="Admin"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl shadow-2xl p-8 mb-8 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Icons.Admin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">
                    Welcome back, {user?.name}!
                  </h2>
                  <p className="text-blue-100">Administrative Dashboard</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hierarchical Structure */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Content Management Hub
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Navigate through the hierarchical structure to manage your
                learning content
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {hierarchicalStructure.map((item, index) => (
              <div key={index} className="relative">
                <Link
                  href={item.href}
                  className="relative flex items-center p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 border border-gray-200 dark:border-gray-600 rounded-2xl hover:shadow-xl transition-all duration-300 group hover:border-transparent hover:shadow-2xl transform hover:scale-[1.02] hover:-translate-y-1"
                  style={{ marginLeft: `${(item.level - 1) * 24}px` }}
                  aria-label={`Navigate to ${item.title} - Level ${item.level} - ${item.description}`}
                >
                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Level Indicator */}
                  <div className="relative flex items-center mr-6">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-sm font-bold text-gray-700 dark:text-gray-300 mr-4 shadow-md">
                      {item.level}
                    </div>
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.color} text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}
                    >
                      {item.icon === "target" && (
                        <Icons.Target className="w-6 h-6" />
                      )}
                      {item.icon === "users" && (
                        <Icons.Users className="w-6 h-6" />
                      )}
                      {item.icon === "book" && (
                        <Icons.Book className="w-6 h-6" />
                      )}
                      {item.icon === "calendar" && (
                        <Icons.Calendar className="w-6 h-6" />
                      )}
                      {item.icon === "graduation" && (
                        <Icons.Graduation className="w-6 h-6" />
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {item.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                          {item.description}
                        </p>

                        {/* Hierarchy Info */}
                        <div className="flex items-center mt-3 space-x-4 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                              Level {item.level}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="relative ml-6">
                        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:bg-blue-100 dark:group-hover:bg-blue-900 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                          <svg
                            className="w-5 h-5 text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-300 group-hover:translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {hierarchicalStructure.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow group border-l-4"
              style={{
                borderLeftColor:
                  item.color.replace("bg-", "").replace("-500", "") === "blue"
                    ? "#3b82f6"
                    : item.color.replace("bg-", "").replace("-500", "") ===
                      "green"
                    ? "#10b981"
                    : item.color.replace("bg-", "").replace("-500", "") ===
                      "purple"
                    ? "#8b5cf6"
                    : item.color.replace("bg-", "").replace("-500", "") ===
                      "orange"
                    ? "#f59e0b"
                    : "#ef4444",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-2xl">
                  {item.icon === 'target' && <Icons.Target className="w-6 h-6" />}
                  {item.icon === 'users' && <Icons.Users className="w-6 h-6" />}
                  {item.icon === 'book' && <Icons.Book className="w-6 h-6" />}
                  {item.icon === 'calendar' && <Icons.Calendar className="w-6 h-6" />}
                  {item.icon === 'graduation' && <Icons.Graduation className="w-6 h-6" />}
                </div>
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                  Level {item.level}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                {item.title}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Quick access
              </p>
            </Link>
          ))}
        </div> */}

        {/* Assignment Management Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Assignment Management
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <Link
              href="/admin/assignments"
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group hover:border-yellow-400 dark:hover:border-yellow-500"
            >
              <div className="flex items-center mb-2">
                <Icons.Assignment className="w-6 h-6 mr-3 text-blue-600" />
                <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                  Manage Assignments
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Create, edit, and manage student assignments
              </div>
            </Link>
            <Link
              href="/admin/assignments?filter=published"
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group hover:border-green-400 dark:hover:border-green-500"
            >
              <div className="flex items-center mb-2">
                <Icons.Completed className="w-6 h-6 mr-3 text-green-600" />
                <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Published Assignments
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                View all published assignments
              </div>
            </Link>
            <Link
              href="/admin/assignments?filter=draft"
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group hover:border-orange-400 dark:hover:border-orange-500"
            >
              <div className="flex items-center mb-2">
                <Icons.Document className="w-6 h-6 mr-3 text-gray-600" />
                <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Draft Assignments
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                View and edit draft assignments
              </div>
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Quick Actions
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Perform common administrative tasks with one click
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <button className="relative group p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-700 rounded-2xl hover:shadow-xl transition-all duration-300 text-left hover:scale-105 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Trophy className="w-6 h-6 text-white" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  System Stats
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                  Monitor performance & analytics
                </div>
              </div>
            </button>
            <button className="relative group p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border border-green-200 dark:border-green-700 rounded-2xl hover:shadow-xl transition-all duration-300 text-left hover:scale-105 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300">
                  User Management
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                  Manage accounts & permissions
                </div>
              </div>
            </button>
            <button className="relative group p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border border-purple-200 dark:border-purple-700 rounded-2xl hover:shadow-xl transition-all duration-300 text-left hover:scale-105 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Admin className="w-6 h-6 text-white" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  System Settings
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                  Configure preferences
                </div>
              </div>
            </button>
            <button className="relative group p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border border-orange-200 dark:border-orange-700 rounded-2xl hover:shadow-xl transition-all duration-300 text-left hover:scale-105 hover:-translate-y-1">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icons.Document className="w-6 h-6 text-white" />
                </div>
                <div className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors duration-300">
                  Export Data
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
                  Download reports & analytics
                </div>
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
