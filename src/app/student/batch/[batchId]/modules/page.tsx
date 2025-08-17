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
  Video,
  FileText,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../../../../../contexts/AuthContext";
import { API_ENDPOINTS } from "@/lib/config";
import StudentNavbar from "../../../../../components/StudentNavbar";

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

interface BatchModules {
  batch: {
    id: string;
    title: string;
    description: string;
  };
  modules: Module[];
}

// Backend response interfaces
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

export default function BatchModulesPage() {
  const params = useParams();
  const router = useRouter();
  const { user, logout } = useAuth();
  const batchId = params.batchId as string;
  const [content, setContent] = useState<BatchModules | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set()
  );
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    fetchBatchModules();
  }, [batchId]);

  const fetchBatchModules = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        API_ENDPOINTS.ENROLLMENTS.BATCH_CONTENT(batchId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data: BackendBatchResponse = await response.json();

        // Transform backend data to frontend format
        const transformedContent: BatchModules = {
          batch: {
            id: data.id,
            title: data.name,
            description: data.description,
          },
          modules: data.modules.map((module) => ({
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
                isCompleted: new Date(lecture.scheduledAt) < new Date(),
                zoomLink: lecture.zoomLink,
                deckLink: lecture.deckLink,
              })),
            })),
          })),
        };

        setContent(transformedContent);
      } else {
        toast.error("Failed to load batch modules");
      }
    } catch (error) {
      console.error("Error fetching batch modules:", error);
      toast.error("Error loading batch modules");
    } finally {
      setLoading(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const toggleWeek = (weekId: string) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekId)) {
      newExpanded.delete(weekId);
    } else {
      newExpanded.add(weekId);
    }
    setExpandedWeeks(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getModuleStats = () => {
    if (!content)
      return {
        totalModules: 0,
        totalWeeks: 0,
        totalLectures: 0,
        completedLectures: 0,
      };

    const totalModules = content.modules.length;
    const totalWeeks = content.modules.reduce(
      (acc, module) => acc + module.weeks.length,
      0
    );
    const totalLectures = content.modules.reduce(
      (acc, module) =>
        acc +
        module.weeks.reduce(
          (weekAcc, week) => weekAcc + week.lectures.length,
          0
        ),
      0
    );
    const completedLectures = content.modules.reduce(
      (acc, module) =>
        acc +
        module.weeks.reduce(
          (weekAcc, week) =>
            weekAcc +
            week.lectures.filter((lecture) => lecture.isCompleted).length,
          0
        ),
      0
    );

    return { totalModules, totalWeeks, totalLectures, completedLectures };
  };

  // Filter modules based on search query
  const getFilteredModules = () => {
    if (!content || !searchQuery.trim()) {
      return content?.modules || [];
    }

    const query = searchQuery.toLowerCase().trim();
    return content.modules.filter((module) => {
      // Search in module title and description
      const moduleMatch =
        module.title.toLowerCase().includes(query) ||
        module.description.toLowerCase().includes(query);

      // Search in weeks
      const weekMatch = module.weeks.some(
        (week) =>
          week.title.toLowerCase().includes(query) ||
          week.description.toLowerCase().includes(query)
      );

      // Search in lectures
      const lectureMatch = module.weeks.some((week) =>
        week.lectures.some(
          (lecture) =>
            lecture.title.toLowerCase().includes(query) ||
            lecture.description.toLowerCase().includes(query)
        )
      );

      return moduleMatch || weekMatch || lectureMatch;
    });
  };

  const filteredModules = getFilteredModules();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <StudentNavbar
          title="Loading..."
          subtitle="Batch Modules"
          icon="Book"
          backLink={`/student/batch/${batchId}`}
          backText="← Back to Batch"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">
                Loading modules...
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
          subtitle="Batch Modules"
          icon="Warning"
          backLink={`/student/batch/${batchId}`}
          backText="← Back to Batch"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Error Loading Modules
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {error || "Failed to load batch modules"}
              </p>
              <Button
                onClick={fetchBatchModules}
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
        title="Modules"
        icon="Book"
        backLink={`/student/batch/${batchId}`}
        backText="← Back to Batch"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Batch Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-primary rounded-3xl shadow-2xl mb-8">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Floating Elements */}
          <div
            className="absolute top-4 right-4 w-20 h-20 bg-white/10 rounded-full animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          ></div>
          <div
            className="absolute bottom-4 left-4 w-16 h-16 bg-white/10 rounded-full animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          ></div>
          <div
            className="absolute top-1/2 right-1/4 w-12 h-12 bg-white/10 rounded-full animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "5s" }}
          ></div>

          <div className="relative p-8 sm:p-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mr-6 shadow-lg">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
                      Learning Modules
                    </h1>
                    <p className="text-white/90 text-xl leading-relaxed font-medium">
                      {content.batch.title}
                    </p>
                  </div>
                </div>
                <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                  Access all learning materials, lectures, and course content
                  organized by modules and weeks.
                </p>
              </div>
              {/* Stats Cards */}
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                    <div className="text-2xl font-bold text-white">
                      {getModuleStats().totalModules}
                    </div>
                    <div className="text-white/80 text-sm font-medium">
                      Modules
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                    <div className="text-2xl font-bold text-white">
                      {getModuleStats().totalWeeks}
                    </div>
                    <div className="text-white/80 text-sm font-medium">
                      Weeks
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                    <div className="text-2xl font-bold text-white">
                      {getModuleStats().totalLectures}
                    </div>
                    <div className="text-white/80 text-sm font-medium">
                      Lectures
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                    <div className="text-2xl font-bold text-white">
                      {getModuleStats().completedLectures}
                    </div>
                    <div className="text-white/80 text-sm font-medium">
                      Completed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Filter */}
        <div className="bg-white/70 backdrop-blur-sm dark:bg-gray-800/70 rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Search Modules
            </h3>
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search modules, weeks, or lectures..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          {searchQuery && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Found {filteredModules.length} module
              {filteredModules.length !== 1 ? "s" : ""} matching &quot;
              {searchQuery}&quot;
            </div>
          )}
        </div>

        {/* Modules */}
        <div className="grid gap-4 sm:gap-6">
          {filteredModules.length === 0 && searchQuery ? (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  No Results Found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
                  No modules, weeks, or lectures match your search for &quot;
                  {searchQuery}&quot;. Try different keywords.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredModules.map((module) => (
              <Card
                key={module.id}
                className="group hover:shadow-lg transition-all duration-300 border-l-4 border-primary bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
              >
                <CardHeader 
                  className="pb-4 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors duration-200"
                  onClick={() => toggleModule(module.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-2">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <Badge className="bg-primary/10 dark:bg-primary/20 text-primary border-primary/30 px-3 py-1 rounded-full font-semibold text-xs">
                          {module.weeks.length} Week
                          {module.weeks.length !== 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200">
                            {module.title}
                          </CardTitle>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {module.description}
                        </p>
                      </div>
                    </div>
                    <div className="p-1 rounded-lg transition-colors">
                      {expandedModules.has(module.id) ? (
                        <ChevronDown className="w-5 h-5 text-primary" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-primary" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {expandedModules.has(module.id) && (
                  <CardContent>
                    <div className="space-y-4">
                      {module.weeks.map((week) => (
                        <div
                          key={week.id}
                          className="bg-gray-50/50 dark:bg-gray-700/50 p-3 sm:p-4 rounded-xl border border-gray-200/50 dark:border-gray-600/50"
                        >
                          <div 
                            className="flex items-center mb-3 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-600/30 transition-colors duration-200 p-2 rounded-lg"
                            onClick={() => toggleWeek(week.id)}
                          >
                            <div className="mr-3 p-1 rounded-lg transition-colors">
                              {expandedWeeks.has(week.id) ? (
                                <ChevronDown className="w-4 h-4 text-primary" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-primary" />
                              )}
                            </div>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center mr-3">
                              <Calendar className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                Week {week.weekNumber}: {week.title}
                              </h4>
                              <p className="text-gray-600 dark:text-gray-300 text-sm">
                                {week.description}
                              </p>
                            </div>
                            <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-700 px-3 py-1 rounded-full font-semibold text-xs">
                              {week.lectures.length} Lecture
                              {week.lectures.length !== 1 ? "s" : ""}
                            </Badge>
                          </div>

                          {expandedWeeks.has(week.id) && (
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
                                    <Badge
                                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                        lecture.isCompleted
                                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 border-green-200 dark:border-green-700"
                                          : "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-700"
                                      }`}
                                    >
                                      {lecture.isCompleted
                                        ? "Completed"
                                        : "In Progress"}
                                    </Badge>
                                    {lecture.zoomLink && (
                                      <Button
                                        size="sm"
                                        className="border-blue/50 text-white hover:bg-primary hover:text-white px-3 py-1 rounded-lg text-xs"
                                        onClick={() =>
                                          window.open(
                                            lecture.zoomLink,
                                            "_blank"
                                          )
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
                                          window.open(
                                            lecture.deckLink,
                                            "_blank"
                                          )
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
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))
          )}
        </div>

        {content.modules.length === 0 && !searchQuery && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                No Modules Available
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
                This batch doesn&apos;t have any learning modules yet. Check
                back later for updates.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
