"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "../../components/ui/icons";
import Link from "next/link";
import { useAuth } from "../../contexts/AuthContext";
import { ThemeToggle } from "../../contexts/ThemeContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await login(email, password);

      if (result.success) {
        // Role-based redirect
        if (result.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/student");
        }
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-100 dark:border-gray-700">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg">
            <span className="text-2xl font-bold text-white">R</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account
          </p>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Or{" "}
            <Link
              href="/signup"
              className="text-primary hover:text-orange-500 font-medium transition-colors"
            >
              create a new account
            </Link>
          </p>
        </div>
        {/* Test Credentials */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-3">
            Test Credentials (For Testing Only)
          </h3>
          <div className="text-xs text-blue-600 dark:text-blue-300 space-y-3">
            <div>
              <p className="font-semibold text-blue-700 dark:text-blue-200 mb-1 flex items-center gap-2">
                <Icons.Student className="w-4 h-4" /> Student Role:
              </p>
              <p>
                <strong>Email:</strong> student1@revou.co
              </p>
              <p>
                <strong>Password:</strong> password123
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-700 dark:text-blue-200 mb-1 flex items-center gap-2">
                <Icons.TeamLead className="w-4 h-4" /> Team Lead Role:
              </p>
              <p>
                <strong>Email:</strong> teamlead1@revou.co
              </p>
              <p>
                <strong>Password:</strong> password123
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-700 dark:text-blue-200 mb-1 flex items-center gap-2">
                <Icons.Admin className="w-4 h-4" /> Admin Role:
              </p>
              <p>
                <strong>Email:</strong> admin1@revou.co
              </p>
              <p>
                <strong>Password:</strong> password123
              </p>
            </div>
            <p className="text-blue-500 dark:text-blue-400 italic mt-2">
              ⚠️ These are demo credentials for testing different user roles
            </p>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-1">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:z-10 sm:text-sm transition-all duration-200"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <span className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                  {showPassword ? "🙈" : "👁️"}
                </span>
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
              <div className="text-sm text-red-700 dark:text-red-300">
                {error}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900 dark:text-white"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium hover:text-yellow-600 cursor-pointer"
                style={{ color: "#ffdd3b" }}
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-yellow-600 cursor-pointer"
            >
              ← Back to home
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
