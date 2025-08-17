"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { ThemeToggle } from "../../contexts/ThemeContext";

export default function HomePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = () => {
    logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 animate-spin border-4 border-gray-300 border-t-yellow-400"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#ffdd3b" }}
              >
                <span className="text-lg font-bold text-gray-800">R</span>
              </div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                Revou LMS
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <span className="text-gray-600 dark:text-gray-300">
                Welcome, {user.name}!
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to Revou LMS!
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            You&apos;re now logged in as <strong>{user.email}</strong>. Start
            exploring our learning platform.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* My Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                style={{ backgroundColor: "#ffdd3b" }}
              >
                <svg
                  className="w-6 h-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                My Courses
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Access your enrolled courses and track your progress.
            </p>
            <button className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              View Courses
            </button>
          </div>

          {/* Assignments */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                style={{ backgroundColor: "#ffdd3b" }}
              >
                <svg
                  className="w-6 h-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Assignments
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Check your pending assignments and submissions.
            </p>
            <button className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              View Assignments
            </button>
          </div>

          {/* Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                style={{ backgroundColor: "#ffdd3b" }}
              >
                <svg
                  className="w-6 h-6 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Progress
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Track your learning progress and achievements.
            </p>
            <button className="w-full py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              View Progress
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              aria-label="Browse available courses"
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Browse Courses
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Explore available courses
              </div>
            </button>
            <button
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              aria-label="Join discussion forums"
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Join Discussion
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Participate in forums
              </div>
            </button>
            <button
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              aria-label="Download course resources and materials"
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Download Resources
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Access course materials
              </div>
            </button>
            <button
              className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              aria-label="Contact support for help"
            >
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Contact Support
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Get help when needed
              </div>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
