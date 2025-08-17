"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import StudentNavbar from "../../../components/StudentNavbar";
import { API_ENDPOINTS } from "@/lib/config";
import { Icons } from "../../../components/ui/icons";
import Link from "next/link";

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

export default function StudentEnrollment() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const [availableBatches, setAvailableBatches] = useState<Batch[]>([]);
  const [myEnrollments, setMyEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [selectedVertical, setSelectedVertical] = useState<string>("all");

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

      // Fetch available batches
      const batchesResponse = await fetch(
        API_ENDPOINTS.ENROLLMENTS.AVAILABLE_BATCHES,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (batchesResponse.ok) {
        const batches = await batchesResponse.json();
        setAvailableBatches(batches);
      }

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

  const handleEnroll = async (batchId: string) => {
    try {
      setEnrolling(batchId);
      const token = localStorage.getItem("token");

      const response = await fetch(API_ENDPOINTS.ENROLLMENTS.BASE, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ batchId }),
      });

      if (response.ok) {
        // Refresh data after successful enrollment
        await fetchData();
        alert("Successfully enrolled in batch! You are now enrolled.");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to enroll in batch");
      }
    } catch (error) {
      console.error("Error enrolling:", error);
      alert("Failed to enroll in batch");
    } finally {
      setEnrolling(null);
    }
  };

  const isEnrolledInBatch = (batchId: string) => {
    return myEnrollments.some((enrollment) => enrollment.batch.id === batchId);
  };

  const getEnrollmentStatus = (batchId: string) => {
    const enrollment = myEnrollments.find(
      (enrollment) => enrollment.batch.id === batchId
    );
    return enrollment?.status;
  };

  // Get unique verticals from available batches
  const getUniqueVerticals = () => {
    const verticals = availableBatches.map((batch) => batch.vertical);
    const uniqueVerticals = verticals.filter(
      (vertical, index, self) =>
        index === self.findIndex((v) => v.id === vertical.id)
    );
    return uniqueVerticals;
  };

  // Filter batches based on selected vertical
  const getFilteredBatches = () => {
    if (selectedVertical === "all") {
      return availableBatches;
    }
    return availableBatches.filter(
      (batch) => batch.vertical.id === selectedVertical
    );
  };

  const filteredBatches = getFilteredBatches();
  const uniqueVerticals = getUniqueVerticals();

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-4 sm:mb-6 animate-spin border-4 border-gray-200 dark:border-gray-700 border-t-primary shadow-lg"></div>
            <div className="absolute inset-0 w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto animate-pulse bg-gradient-to-r from-primary to-secondary opacity-20"></div>
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2">
            Loading Enrollments
          </h3>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Please wait while we fetch available courses...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "STUDENT") {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <StudentNavbar
        title="Revou LMS - Student"
        subtitle="Course Enrollment"
        icon="Student"
        backLink="/student"
        backText="← Back to Dashboard"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Welcome Section */}
        <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-3 sm:mb-4">
                Course Enrollment
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg leading-relaxed">
                Browse available batches and manage your enrollments
              </p>
            </div>
          </div>
        </div>

        {/* My Enrollments */}
        {myEnrollments.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6">
              My Enrollments
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {myEnrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-5 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base pr-2">
                      {enrollment.batch.name}
                    </h4>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        enrollment.status === "APPROVED"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : enrollment.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {enrollment.status}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {enrollment.batch.vertical.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                    Enrolled:{" "}
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </p>
                  {enrollment.status === "APPROVED" && (
                    <Link
                      href={`/student/batch/${enrollment.batch.id}`}
                      className="inline-block w-full px-3 py-2.5 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white text-xs sm:text-sm font-medium rounded-xl text-center transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer"
                    >
                      View Content
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Batches */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-3 sm:mb-0">
              Available Batches
            </h3>

            {/* Vertical Filter Dropdown */}
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Filter by Vertical:
              </label>
              <select
                value={selectedVertical}
                onChange={(e) => setSelectedVertical(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              >
                <option value="all">All Verticals</option>
                {uniqueVerticals.map((vertical) => (
                  <option key={vertical.id} value={vertical.id}>
                    {vertical.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredBatches.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Icons.Book className="w-8 h-8 sm:w-12 sm:h-12" />
              </div>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
                {selectedVertical === "all"
                  ? "No available batches at the moment."
                  : "No batches found for the selected vertical."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBatches.map((batch) => {
                const isEnrolled = isEnrolledInBatch(batch.id);
                const enrollmentStatus = getEnrollmentStatus(batch.id);

                return (
                  <div
                    key={batch.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                  >
                    <div className="mb-4 sm:mb-5">
                      <h4 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {batch.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-primary dark:text-primary mb-2">
                        {batch.vertical.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">
                        {batch.description}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                        <p>
                          Start:{" "}
                          {new Date(batch.startDate).toLocaleDateString()}
                        </p>
                        <p>
                          End: {new Date(batch.endDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 sm:mt-5">
                      {isEnrolled ? (
                        <div className="space-y-3">
                          <div className="text-center">
                            <span
                              className={`inline-flex items-center px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-full ${
                                enrollmentStatus === "APPROVED"
                                  ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 dark:from-green-900/50 dark:to-emerald-900/50 dark:text-green-200 border border-green-200 dark:border-green-700"
                                  : enrollmentStatus === "PENDING"
                                  ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 dark:from-yellow-900/50 dark:to-amber-900/50 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-700"
                                  : "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 dark:from-red-900/50 dark:to-rose-900/50 dark:text-red-200 border border-red-200 dark:border-red-700"
                              }`}
                            >
                              {enrollmentStatus === "APPROVED"
                                ? "✓ Enrolled"
                                : enrollmentStatus === "PENDING"
                                ? "⏳ Pending"
                                : "✗ Rejected"}
                            </span>
                          </div>
                          {enrollmentStatus === "APPROVED" && (
                            <Link
                              href={`/student/batch/${batch.id}`}
                              className="block w-full px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-xl text-center transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                              View Content
                            </Link>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEnroll(batch.id)}
                          disabled={enrolling === batch.id}
                          className="w-full px-4 py-2.5 bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-md cursor-pointer"
                        >
                          {enrolling === batch.id
                            ? "⏳ Enrolling..."
                            : "Enroll Now"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
