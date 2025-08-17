"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../contexts/AuthContext";
import Link from "next/link";
import StudentNavbar from "../../components/StudentNavbar";
import { API_ENDPOINTS } from "@/lib/config";
import { Search, Filter } from "lucide-react";

interface Batch {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  vertical: {
    id: string;
    name: string;
    description: string;
  };
}

interface Enrollment {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  enrolledAt: string;
  batch: Batch;
}

export default function StudentDashboard() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout } = useAuth();
  const [myEnrollments, setMyEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVertical, setSelectedVertical] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "STUDENT")) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user && user.role === "STUDENT") {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch my enrollments
      const enrollmentsResponse = await fetch(
        API_ENDPOINTS.ENROLLMENTS.MY_ENROLLMENTS,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (enrollmentsResponse.ok) {
        const enrollments = await enrollmentsResponse.json();
        setMyEnrollments(enrollments);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  // Get unique verticals from enrolled batches
  const getUniqueVerticals = () => {
    const approvedEnrollments = myEnrollments.filter(
      (enrollment) => enrollment.status === "APPROVED"
    );
    const verticals = approvedEnrollments.map(
      (enrollment) => enrollment.batch.vertical
    );
    const uniqueVerticals = verticals.filter(
      (vertical, index, self) =>
        index === self.findIndex((v) => v.id === vertical.id)
    );
    return uniqueVerticals;
  };

  // Filter enrolled batches based on vertical and search query independently
  const getFilteredEnrollments = () => {
    let filtered = myEnrollments.filter(
      (enrollment) => enrollment.status === "APPROVED"
    );

    // Apply vertical filter
    if (selectedVertical !== "all") {
      filtered = filtered.filter(
        (enrollment) => enrollment.batch.vertical.id === selectedVertical
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((enrollment) => {
        const batch = enrollment.batch;
        return (
          batch.name.toLowerCase().includes(query) ||
          batch.description.toLowerCase().includes(query) ||
          batch.vertical.name.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  };

  const filteredEnrollments = getFilteredEnrollments();
  const uniqueVerticals = getUniqueVerticals();

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full mx-auto mb-6 animate-spin border-4 border-gray-200 dark:border-gray-700 border-t-primary shadow-lg"></div>
            <div className="absolute inset-0 w-16 h-16 rounded-full mx-auto animate-pulse bg-gradient-to-r from-primary to-secondary opacity-20"></div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Loading Dashboard
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we prepare your learning environment...
          </p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "STUDENT") {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-all duration-300">
      <StudentNavbar
        title="Revou LMS - Student"
        subtitle="Student Dashboard"
        icon="Student"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3 sm:mb-4">
                Welcome to Your Learning Journey
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                Explore your enrolled courses, track your progress, and continue
                your path to success. Your dedication today shapes your future
                tomorrow.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Section */}
        {myEnrollments.filter((enrollment) => enrollment.status === "APPROVED")
          .length > 0 && (
          <div className="bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 rounded-xl shadow-sm p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filter Enrolled Batches
                </h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 lg:flex-1 lg:max-w-2xl">
                {/* Vertical Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter by Vertical
                  </label>
                  <select
                    value={selectedVertical}
                    onChange={(e) => setSelectedVertical(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                  >
                    <option value="all">All Verticals</option>
                    {uniqueVerticals.map((vertical) => (
                      <option key={vertical.id} value={vertical.id}>
                        {vertical.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Batch Search */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search Batches
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search by batch name, description, or vertical..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Results Info */}
            {(selectedVertical !== "all" || searchQuery.trim()) && (
              <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Showing {filteredEnrollments.length} of{" "}
                {
                  myEnrollments.filter(
                    (enrollment) => enrollment.status === "APPROVED"
                  ).length
                }{" "}
                enrolled batch{filteredEnrollments.length !== 1 ? "es" : ""}
                {selectedVertical !== "all" && (
                  <span className="ml-2 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                    Vertical:{" "}
                    {
                      uniqueVerticals.find((v) => v.id === selectedVertical)
                        ?.name
                    }
                  </span>
                )}
                {searchQuery.trim() && (
                  <span className="ml-2 px-2 py-1 bg-secondary/10 text-secondary rounded-full text-xs">
                    Search: &quot;{searchQuery}&quot;
                  </span>
                )}
              </div>
            )}
          </div>
        )}

        {/* My Enrolled Batches */}
        <div className="bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 rounded-xl sm:rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8 mb-8 sm:mb-10">
          {myEnrollments.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                My Enrolled Batches
              </h3>
              <Link
                href="/student/enrollment"
                className="inline-flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white text-sm font-medium rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 w-full sm:w-auto cursor-pointer"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Enroll in Courses</span>
              </Link>
            </div>
          )}
          {myEnrollments.length > 0 && (
            <div className="grid gap-4 sm:gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEnrollments.map((enrollment) => (
                <Link
                  key={enrollment.id}
                  href={`/student/batch/${enrollment.batch.id}`}
                  className="group bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer overflow-hidden relative block"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="mb-4 sm:mb-6">
                      <h4 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 group-hover:text-primary dark:group-hover:text-primary transition-colors line-clamp-2">
                        {enrollment.batch.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-primary dark:text-primary mb-2 sm:mb-3 font-medium truncate">
                        {enrollment.batch.vertical.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                        {enrollment.batch.description}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                        <p className="truncate">
                          Start:{" "}
                          {new Date(
                            enrollment.batch.startDate
                          ).toLocaleDateString()}
                        </p>
                        <p className="truncate">
                          End:{" "}
                          {new Date(
                            enrollment.batch.endDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-4">
                      <div className="flex items-center justify-between gap-2">
                        <span className="inline-flex items-center px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/50 dark:to-emerald-900/50 dark:text-green-200 border border-green-200 dark:border-green-700 flex-shrink-0">
                          ✓ Enrolled
                        </span>
                        <span className="text-primary dark:text-primary text-xs sm:text-sm font-semibold group-hover:translate-x-1 transition-transform duration-200 truncate">
                          <span className="hidden sm:inline">
                            View Details →
                          </span>
                          <span className="sm:hidden">View →</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No Results Found */}
          {myEnrollments.length > 0 && filteredEnrollments.length === 0 &&
            myEnrollments.filter(
              (enrollment) => enrollment.status === "APPROVED"
            ).length > 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                  <Search className="w-8 h-8 sm:w-10 sm:h-10 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  No Results Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
                  No enrolled batches match your current filter criteria. Try
                  adjusting your search or vertical filter.
                </p>
                <button
                  onClick={() => {
                    setSelectedVertical("all");
                    setSearchQuery("");
                  }}
                  className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}

          {/* No Enrolled Batches */}
          {myEnrollments.filter(
            (enrollment) => enrollment.status === "APPROVED"
          ).length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-primary dark:text-primary"
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
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                No Enrolled Batches
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
                You haven&apos;t enrolled in any batches yet. Browse available
                courses to get started with your learning journey.
              </p>
              <Link
                href="/student/enrollment"
                className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white text-sm sm:text-base font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 w-full sm:w-auto cursor-pointer"
              >
                Browse Available Batches
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
