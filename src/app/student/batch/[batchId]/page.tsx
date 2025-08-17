"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Video,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../../contexts/AuthContext";
import { API_ENDPOINTS } from "@/lib/config";
import StudentNavbar from "../../../../components/StudentNavbar";

import OngoingAssignments from "./components/OngoingAssignments";

interface Lecture {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  isCompleted: boolean;
  zoomLink?: string;
  deckLink?: string;
}

interface Week {
  id: string;
  title: string;
  description: string;
  weekNumber: number;
  lectures: Lecture[];
}

interface Module {
  id: string;
  title: string;
  description: string;
  weeks: Week[];
}

interface BatchContent {
  batch: {
    id: string;
    title: string;
    description: string;
  };
  modules: Module[];
}

// Backend interfaces
interface BackendLecture {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration?: number;
  zoomLink?: string;
  deckLink?: string;
}

interface BackendWeek {
  id: string;
  name: string;
  description: string;
  weekNumber: number;
  lectures: BackendLecture[];
}

interface BackendModule {
  id: string;
  name: string;
  description: string;
  weeks: BackendWeek[];
}

interface BackendBatchResponse {
  id: string;
  name: string;
  description: string;
  modules: BackendModule[];
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  maxScore: number;
  dueDate: string;
  publishedAt?: string;
  batch: {
    id: string;
    name: string;
  };
}

export default function BatchContentPage() {
  const params = useParams();
  const router = useRouter();
  const { logout } = useAuth();
  const batchId = params.batchId as string;
  const [content, setContent] = useState<BatchContent | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout");
    }
  };

  useEffect(() => {
    fetchBatchContent();
    fetchAssignments();
  }, [batchId]);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return;
      }

      const response = await fetch(
        API_ENDPOINTS.ENROLLMENTS.MY_ASSIGNMENTS(batchId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const assignmentsData = await response.json();
        setAssignments(assignmentsData);
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  const fetchBatchContent = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        API_ENDPOINTS.ENROLLMENTS.BATCH_CONTENT(batchId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(
          `Failed to fetch batch content: ${response.statusText}`
        );
      }

      const backendData: BackendBatchResponse = await response.json();

      // Transform backend data to frontend format
      const transformedData: BatchContent = {
        batch: {
          id: backendData.id,
          title: backendData.name,
          description: backendData.description,
        },
        modules: backendData.modules.map((module) => ({
          id: module.id,
          title: module.name,
          description: module.description,
          weeks: module.weeks.map((week) => ({
            id: week.id,
            title: week.name,
            description: week.description,
            weekNumber: week.weekNumber,
            lectures: week.lectures.map((lecture) => ({
              id: lecture.id,
              title: lecture.title,
              description: lecture.description,
              scheduledAt: lecture.scheduledAt,
              duration: lecture.duration || 60,
              isCompleted: false, // This should come from backend
              zoomLink: lecture.zoomLink,
              deckLink: lecture.deckLink,
            })),
          })),
        })),
      };

      setContent(transformedData);
    } catch (error) {
      console.error("Error fetching batch content:", error);
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
      toast.error("Failed to load batch content");
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <StudentNavbar
          title="Loading..."
          subtitle="Batch Content"
          icon="Book"
          backLink="/student"
          backText="← Back to Dashboard"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                Loading batch content...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <StudentNavbar
          title="Error"
          subtitle="Batch Content"
          icon="Warning"
          backLink="/student"
          backText="← Back to Dashboard"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Error Loading Content
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {error || "Failed to load batch content"}
              </p>
              <Button
                onClick={fetchBatchContent}
                className="bg-primary hover:bg-primary/90"
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <StudentNavbar
        title={content.batch.title}
        subtitle="Batch Content"
        icon="Book"
        backLink="/student"
        backText="← Back to Dashboard"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Batch Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary rounded-2xl shadow-2xl mb-8">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          <div className="relative p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-4">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                      {content.batch.title}
                    </h1>
                    <p className="text-white/90 text-lg leading-relaxed max-w-2xl">
                      {content.batch.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-6 lg:mt-0 lg:ml-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Total Modules Card */}
                  <div
                    className="bg-yellow-400/70 backdrop-blur-sm rounded-xl p-4 text-center cursor-pointer hover:bg-yellow-200/30 transition-all duration-300"
                    onClick={() =>
                      router.push(`/student/batch/${batchId}/modules`)
                    }
                  >
                    <div className="text-2xl font-bold text-black">
                      {content.modules.length}
                    </div>
                    <div className="text-black/80 text-sm">Total Modules</div>
                  </div>
                  {/* Total Assignments Card */}
                  <div
                    className="bg-green-400/70 backdrop-blur-sm rounded-xl p-4 text-center cursor-pointer hover:bg-green-200/30 transition-all duration-300"
                    onClick={() =>
                      router.push(`/student/batch/${batchId}/assignments`)
                    }
                  >
                    <div className="text-2xl font-bold text-black">
                      {assignments.length}
                    </div>
                    <div className="text-black/80 text-sm">
                      Total Assignments
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ongoing Modules Section */}
        <div className="bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-4 shadow-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              Ongoing Modules
            </h2>
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="outline"
                className="border-primary text-black hover:bg-primary hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                onClick={() => router.push(`/student/batch/${batchId}/modules`)}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View All Modules
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:gap-6">
            {content?.modules.map((module) => (
              <Card
                key={`ongoing-${module.id}`}
                className="group hover:shadow-lg transition-all duration-300 border-l-4 border-primary bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors duration-200">
                        {module.title}
                      </CardTitle>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {module.description}
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {module.weeks.map((week) => (
                      <div
                        key={`ongoing-week-${week.id}`}
                        className="bg-gradient-to-r from-primary/5 to-secondary/5 p-3 sm:p-4 rounded-xl border border-primary/10"
                      >
                        <div className="flex items-center mb-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mr-3">
                            <Calendar className="w-4 h-4 text-primary" />
                          </div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            Week {week.weekNumber}: {week.title}
                          </h4>
                        </div>
                        <div className="grid gap-3">
                          {week.lectures.map((lecture) => (
                            <div
                              key={lecture.id}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-shadow duration-200 space-y-3 sm:space-y-0"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                                  <Video className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                                    {lecture.title}
                                  </p>
                                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>
                                      {formatDate(lecture.scheduledAt)}
                                    </span>
                                    {lecture.duration && (
                                      <>
                                        <span>•</span>
                                        <span>{lecture.duration} min</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                {lecture.zoomLink && (
                                  <Button
                                    size="sm"
                                    className="border-blue/50 text-white hover:bg-primary hover:text-white px-3 py-1 rounded-lg text-xs"
                                    onClick={() =>
                                      window.open(lecture.zoomLink, "_blank")
                                    }
                                  >
                                    <Video className="w-3 h-3 mr-1" />
                                    Join
                                  </Button>
                                )}
                                {lecture.deckLink && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-primary/50 text-black hover:bg-primary hover:text-white px-3 py-1 rounded-lg text-xs"
                                    onClick={() =>
                                      window.open(lecture.deckLink, "_blank")
                                    }
                                  >
                                    <FileText className="w-3 h-3 mr-1" />
                                    Slides
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {(content?.modules.length || 0) === 0 && (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                <CardContent className="text-center py-12">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No Modules Available
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    No modules have been added to this batch yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Ongoing Assignments Section */}
        <div className="bg-gradient-to-br from-white to-green-50/50 dark:from-gray-800 dark:to-green-900/20 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200/50 dark:border-green-700/50 p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center mb-4 sm:mb-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mr-3 sm:mr-4 shadow-lg">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              Ongoing Assignments
            </h2>
            <div className="flex items-center space-x-3">
              <Button
                size="sm"
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-500 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                onClick={() =>
                  router.push(`/student/batch/${batchId}/assignments`)
                }
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View All Assignments
              </Button>
            </div>
          </div>
          <OngoingAssignments batchId={batchId} />
        </div>
      </main>
    </div>
  );
}
