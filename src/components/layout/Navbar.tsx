'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [localUser, setLocalUser] = useState(null);
  const { user, logout } = useAuth();
  
  console.log('Navbar rendering with user from useAuth:', user);
  
  // Add effect to log when user changes
  useEffect(() => {
    console.log('Navbar useEffect - user changed:', user);
  }, [user]);
  
  // Force re-render after component mounts to ensure we have the latest user state
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Add a small delay to ensure AuthProvider has initialized
    const timer = setTimeout(() => {
      setMounted(true);
      console.log('Navbar mounted, user state from useAuth:', user);
      
      // Check localStorage directly as a fallback
      if (!user && typeof window !== 'undefined') {
        try {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            console.log('Navbar found user in localStorage:', parsedUser);
            setLocalUser(parsedUser);
          }
        } catch (error) {
          console.error('Error parsing user from localStorage in Navbar:', error);
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user]);
  
  // Use either the user from context or from localStorage
  const effectiveUser = user || localUser;
  console.log('Navbar using effectiveUser:', effectiveUser);
  
  if (!mounted) {
    console.log('Navbar not mounted yet');
    // Return a placeholder during SSR/initial render
    return <div className="h-16 bg-white shadow-md dark:bg-gray-900"></div>;
  }

  return (
    <nav className="bg-white shadow-md dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-yellow-500 dark:text-yellow-400">
                RevoU LMS
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                href="/dashboard" 
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium dark:text-gray-300 dark:hover:text-white"
              >
                Dashboard
              </Link>
              <Link 
                href="/modules" 
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium dark:text-gray-300 dark:hover:text-white"
              >
                Modules
              </Link>
              <Link 
                href="/schedule" 
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium dark:text-gray-300 dark:hover:text-white"
              >
                Schedule
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {effectiveUser ? (
              <>
                <Link 
                  href="/profile" 
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium dark:text-gray-300 dark:hover:text-white"
                >
                  Profile
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium dark:text-gray-300 dark:hover:text-white"
                >
                  Sign out
                </button>
                <div className="ml-3 relative">
                  <div>
                    <button
                      type="button"
                      className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 dark:bg-gray-800"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="sr-only">Open user menu</span>
                      <div className="h-8 w-8 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
                        <span>{effectiveUser.firstName?.[0] || 'U'}</span>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link 
                  href="/login" 
                  className="text-gray-500 hover:text-gray-700 px-3 py-2 text-sm font-medium dark:text-gray-300 dark:hover:text-white"
                >
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-yellow-500 text-white hover:bg-yellow-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400 dark:hover:bg-gray-800 dark:hover:text-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/dashboard"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <Link
              href="/courses"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Courses
            </Link>
            <Link
              href="/schedule"
              className="border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              Schedule
            </Link>
          </div>
          {effectiveUser ? (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
                    <span>{effectiveUser.firstName?.[0] || 'U'}</span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800 dark:text-white">{effectiveUser.firstName} {effectiveUser.lastName}</div>
                  <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{effectiveUser.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Your Profile
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-1">
                <Link
                  href="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;