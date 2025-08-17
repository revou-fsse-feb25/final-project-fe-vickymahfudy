"use client";

import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { ThemeToggle } from "../contexts/ThemeContext";
import { Icons } from "./ui/icons";

interface AdminNavbarProps {
  title: string;
  subtitle: string;
  icon?: keyof typeof Icons;
  backLink?: string;
  backText?: string;
}

export default function AdminNavbar({
  title,
  subtitle,
  icon,
  backLink,
  backText = "← Back to Admin",
}: AdminNavbarProps) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const IconComponent = icon ? Icons[icon] : null;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            {backLink && (
              <Link
                href={backLink}
                className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-all duration-200 cursor-pointer"
              >
                {backText}
              </Link>
            )}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              {IconComponent ? (
                <IconComponent className="w-5 h-5 text-white" />
              ) : (
                <span className="text-lg font-bold text-white">A</span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                {title}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {subtitle}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
            >
              Logout
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
