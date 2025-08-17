"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import { ThemeToggle } from "../contexts/ThemeContext";
import { Icons } from "./ui/icons";

interface StudentNavbarProps {
  title: string;
  subtitle?: string;
  icon?: keyof typeof Icons;
  backLink?: string;
  backText?: string;
}

const StudentNavbar: React.FC<StudentNavbarProps> = ({
  title,
  subtitle,
  icon = "Student",
  backLink,
  backText = "← Back",
}) => {
  const { user, logout } = useAuth();
  const IconComponent = Icons[icon];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
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
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r from-primary to-secondary shadow-lg">
              {IconComponent ? (
                <IconComponent className="w-5 h-5 text-white" />
              ) : (
                <span className="text-lg font-bold text-white">S</span>
              )}
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Student
                  </p>
                </div>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentNavbar;
