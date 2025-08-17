"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Calendar,
  Clock,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  XCircle,
  ExternalLink,
  Award,
  Target,
  Timer,
  Send,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import StudentNavbar from "../../../../../components/StudentNavbar";
import { useAuth } from "../../../../../contexts/AuthContext";
import { API_ENDPOINTS } from "@/lib/config";
import { submissionService } from "@/lib/submissionService";

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "PUBLISHED";
  maxScore: number;
  batch: {
    id: string;
    name: string;
    vertical: {
      id: string;
      name: string;
    };
  };
  submission?: {
    id: string;
    submittedAt: string;
    score?: number;
    feedback?: string;
    linkUrl?: string;
    linkTitle?: string;
    content?: string;
  };
  progressStatus: "pending" | "submitted" | "graded" | "overdue";
  isOverdue: boolean;
  daysUntilDue?: number;
}

interface SubmissionForm {
  type: "LINK";
  assignmentId: string;
  linkUrl: string;
  linkTitle: string;
  content: string;
}

interface Batch {
  id: string;
  name: string;
  description: string;
  vertical: {
    name: string;
  };
}

export default function BatchAssignmentsPage() {
  const params = useParams();
  const router = useRouter();
  const { logout } = useAuth();
  const batchId = params.batchId as string;
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "submitted" | "graded"
  >("all");
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);
  const [submissionForm, setSubmissionForm] = useState<SubmissionForm>({
    type: "LINK",
    assignmentId: "",
    linkUrl: "",
    linkTitle: "",
    content: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [withdrawingAssignment, setWithdrawingAssignment] =
    useState<Assignment | null>(null);

  useEffect(() => {
    fetchBatchData();
    fetchAssignments();
  }, [batchId]);

  const fetchBatchData = async () => {
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
        const data = await response.json();
        setBatch(data.batch);
      }
    } catch (error) {
      console.error("Error fetching batch data:", error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        API_ENDPOINTS.ENROLLMENTS.MY_ASSIGNMENTS(batchId),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        logout();
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setAssignments(data);
      } else {
        toast.error("Failed to fetch assignments");
      }
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Error fetching assignments");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !submissionForm.content.trim() ||
      !submissionForm.linkUrl.trim() ||
      !submissionForm.linkTitle.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!selectedAssignment) {
      toast.error("No assignment selected");
      return;
    }

    setSubmitting(true);

    try {
      if (isEditing && selectedAssignment.submission) {
        // Update existing submission
        const updateData = {
          linkUrl: submissionForm.linkUrl,
          linkTitle: submissionForm.linkTitle,
          content: submissionForm.content,
        };

        await submissionService.updateSubmission(
          selectedAssignment.submission.id,
          updateData
        );

        toast.success("Assignment updated successfully!");

        // Refresh assignments to get updated data
        await fetchAssignments();
      } else {
        // Create new submission
        const submissionData = {
          type: submissionForm.type,
          assignmentId: selectedAssignment.id,
          linkUrl: submissionForm.linkUrl,
          linkTitle: submissionForm.linkTitle,
          content: submissionForm.content,
        };

        await submissionService.createSubmission(submissionData);

        toast.success("Assignment submitted successfully!");

        // Refresh assignments to get updated data
        await fetchAssignments();
      }

      closeSubmissionForm();
    } catch (error: unknown) {
      console.error("Error submitting assignment:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error submitting assignment";
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdrawSubmission = async () => {
    if (!withdrawingAssignment?.submission) {
      toast.error("No submission to withdraw");
      return;
    }

    try {
      await submissionService.deleteSubmission(
        withdrawingAssignment.submission.id
      );

      toast.success("Submission withdrawn successfully!");

      // Refresh assignments to get updated data
      await fetchAssignments();

      closeWithdrawDialog();
    } catch (error: unknown) {
      console.error("Error withdrawing submission:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error withdrawing submission";
      toast.error(errorMessage);
    }
  };

  const openSubmissionForm = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsEditing(false);
    setSubmissionForm({
      type: "LINK",
      assignmentId: assignment.id,
      linkUrl: "",
      linkTitle: "",
      content: "",
    });
  };

  const openEditForm = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsEditing(true);

    // Pre-fill form with existing submission data
    if (assignment.submission) {
      setSubmissionForm({
        type: "LINK",
        assignmentId: assignment.id,
        linkUrl: assignment.submission.linkUrl || "",
        linkTitle: assignment.submission.linkTitle || "",
        content: assignment.submission.content || "",
      });
    }
  };

  const openWithdrawDialog = (assignment: Assignment) => {
    setWithdrawingAssignment(assignment);
    setShowWithdrawDialog(true);
  };

  const closeSubmissionForm = () => {
    setSelectedAssignment(null);
    setIsEditing(false);
    setSubmissionForm({
      type: "LINK",
      assignmentId: "",
      linkUrl: "",
      linkTitle: "",
      content: "",
    });
  };

  const closeWithdrawDialog = () => {
    setWithdrawingAssignment(null);
    setShowWithdrawDialog(false);
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

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusBadge = (progressStatus: string) => {
    switch (progressStatus) {
      case "pending":
        return "bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg";
      case "submitted":
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-white shadow-lg";
      case "graded":
        return "bg-gradient-to-r from-green-400 to-emerald-600 text-white shadow-lg";
      case "overdue":
        return "bg-gradient-to-r from-red-400 to-red-600 text-white shadow-lg";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getStatusIcon = (progressStatus: string) => {
    switch (progressStatus) {
      case "pending":
        return <Timer className="w-4 h-4" />;
      case "submitted":
        return <CheckCircle className="w-4 h-4" />;
      case "graded":
        return <Award className="w-4 h-4" />;
      case "overdue":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    if (filter === "all") return true;
    return assignment.progressStatus === filter;
  });

  const getAssignmentStats = () => {
    const total = assignments.length;
    const pending = assignments.filter(
      (a) => a.progressStatus === "pending"
    ).length;
    const submitted = assignments.filter(
      (a) => a.progressStatus === "submitted"
    ).length;
    const graded = assignments.filter(
      (a) => a.progressStatus === "graded"
    ).length;

    return { total, pending, submitted, graded };
  };

  const stats = getAssignmentStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <StudentNavbar
          title="Assignments"
          subtitle="Loading..."
          icon="Assignment"
          backLink={`/student/batch/${batchId}`}
          backText="← Back to Batch"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full mx-auto mb-6 animate-spin border-4 border-gray-200 dark:border-gray-700 border-t-primary shadow-lg"></div>
                <div className="absolute inset-0 w-16 h-16 rounded-full mx-auto animate-pulse bg-gradient-to-r from-primary to-secondary opacity-20"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Loading Assignments
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Please wait while we fetch your assignments...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <StudentNavbar
        title="Assignments"
        subtitle={batch?.name}
        icon="Assignment"
        backLink={`/student/batch/${batchId}`}
        backText="← Back to Batch"
      />

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
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 tracking-tight">
                      Assignments
                    </h1>
                    {batch && (
                      <p className="text-white/90 text-xl leading-relaxed font-medium">
                        {batch.name} • {batch.vertical.name}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-white/80 text-lg leading-relaxed max-w-2xl">
                  Track your progress, submit your work, and achieve excellence
                  in your learning journey.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="mt-8 lg:mt-0 lg:ml-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                    <div className="text-2xl font-bold text-white">
                      {stats.total}
                    </div>
                    <div className="text-white/80 text-sm font-medium">
                      Total
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                    <div className="text-2xl font-bold text-white">
                      {stats.pending}
                    </div>
                    <div className="text-white/80 text-sm font-medium">
                      Pending
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                    <div className="text-2xl font-bold text-white">
                      {stats.submitted}
                    </div>
                    <div className="text-white/80 text-sm font-medium">
                      Submitted
                    </div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
                    <div className="text-2xl font-bold text-white">
                      {stats.graded}
                    </div>
                    <div className="text-white/80 text-sm font-medium">
                      Graded
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Filter Tabs */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              {[
                {
                  key: "all",
                  label: "All Assignments",
                  icon: FileText,
                  count: stats.total,
                },
                {
                  key: "pending",
                  label: "Pending",
                  icon: Timer,
                  count: stats.pending,
                },
                {
                  key: "submitted",
                  label: "Submitted",
                  icon: CheckCircle,
                  count: stats.submitted,
                },
                {
                  key: "graded",
                  label: "Graded",
                  icon: Award,
                  count: stats.graded,
                },
              ].map((tab) => {
                const IconComponent = tab.icon;
                const isActive = filter === tab.key;
                return (
                  <Button
                    key={tab.key}
                    onClick={() =>
                      setFilter(
                        tab.key as "all" | "pending" | "submitted" | "graded"
                      )
                    }
                    variant={isActive ? "default" : "outline"}
                    className={`flex items-center gap-2 transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105 border-0"
                        : "hover:scale-105 hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                    <Badge
                      variant="secondary"
                      className={`ml-1 text-xs ${
                        isActive
                          ? "bg-white/20 text-white border-0"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {tab.count}
                    </Badge>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Assignments Grid */}
        {filteredAssignments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssignments.map((assignment) => {
              const daysUntilDue = getDaysUntilDue(assignment.dueDate);
              const isOverdue = daysUntilDue < 0;
              const isDueSoon = daysUntilDue <= 2 && daysUntilDue >= 0;

              return (
                <Card
                  key={assignment.id}
                  className={`group hover:shadow-lg transition-all duration-300 border-l-4 border-primary bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${
                    assignment.progressStatus === "pending"
                      ? "hover:border-primary/70"
                      : ""
                  } ${
                    isOverdue
                      ? "ring-2 ring-red-200 dark:ring-red-800"
                      : isDueSoon
                      ? "ring-2 ring-amber-200 dark:ring-amber-800"
                      : ""
                  }`}
                  onClick={() => {
                    if (assignment.progressStatus === "pending") {
                      openSubmissionForm(assignment);
                    }
                  }}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors duration-200">
                            {assignment.title}
                          </CardTitle>
                          <Badge
                            className={`${getStatusBadge(
                              assignment.progressStatus
                            )} border-0 font-semibold px-3 py-1 ml-3`}
                          >
                            <span className="flex items-center gap-1">
                              {getStatusIcon(assignment.progressStatus)}
                              {assignment.progressStatus.toUpperCase()}
                            </span>
                          </Badge>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                          {assignment.description}
                        </p>
                      </div>
                      <div className="ml-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          {assignment.progressStatus === "pending" ? (
                            <Timer className="h-6 w-6 text-primary" />
                          ) : assignment.progressStatus === "submitted" ? (
                            <Send className="h-6 w-6 text-primary" />
                          ) : assignment.progressStatus === "graded" ? (
                            <Award className="h-6 w-6 text-primary" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    {/* Assignment Details */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">Due Date</span>
                        </div>
                        <span
                          className={`font-semibold ${
                            isOverdue
                              ? "text-red-600 dark:text-red-400"
                              : isDueSoon
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {formatDate(assignment.dueDate)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span className="font-medium">Time Left</span>
                        </div>
                        <span
                          className={`font-semibold ${
                            isOverdue
                              ? "text-red-600 dark:text-red-400"
                              : isDueSoon
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-green-600 dark:text-green-400"
                          }`}
                        >
                          {isOverdue
                            ? `Overdue by ${Math.abs(daysUntilDue)} days`
                            : daysUntilDue === 0
                            ? "Due today"
                            : daysUntilDue === 1
                            ? "Due tomorrow"
                            : `${daysUntilDue} days left`}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <Target className="h-4 w-4" />
                          <span className="font-medium">Max Score</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {assignment.maxScore} pts
                        </span>
                      </div>

                      {assignment.submission?.score !== undefined && (
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <Award className="h-4 w-4" />
                            <span className="font-medium">Your Score</span>
                          </div>
                          <span className="font-bold text-green-600 dark:text-green-400">
                            {assignment.submission.score}/{assignment.maxScore}{" "}
                            pts
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                      {assignment.progressStatus === "pending" ? (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openSubmissionForm(assignment);
                          }}
                          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Submit Assignment
                        </Button>
                      ) : assignment.progressStatus === "submitted" &&
                        new Date() < new Date(assignment.dueDate) ? (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditForm(assignment);
                            }}
                            className="flex items-center gap-1 flex-1"
                          >
                            <Edit className="h-4 w-4" />
                            Re-submit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              openWithdrawDialog(assignment);
                            }}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                            Withdraw
                          </Button>
                        </div>
                      ) : (
                        <Link
                          href={`/student/assignments/${assignment.id}`}
                          className="flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors font-medium"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>View Details</span>
                        </Link>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mx-auto mb-6">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                No {filter !== "all" ? filter : ""} assignments found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
                {filter === "all"
                  ? "This batch doesn't have any assignments yet. Check back later for updates."
                  : `No ${filter} assignments available at the moment.`}
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Enhanced Submission Modal */}
      {selectedAssignment && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3
                  id="modal-title"
                  className="text-lg font-medium text-gray-900 dark:text-white"
                >
                  {isEditing ? "Edit Submission" : "Submit Assignment"}
                </h3>
                <button
                  onClick={closeSubmissionForm}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  aria-label="Close modal"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  {selectedAssignment.title}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300">
                      Due: {formatDate(selectedAssignment.dueDate)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300">
                      Max Score: {selectedAssignment.maxScore} pts
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span className="text-blue-700 dark:text-blue-300">
                      Time Left:{" "}
                      {(() => {
                        const days = getDaysUntilDue(
                          selectedAssignment.dueDate
                        );
                        return days >= 0 ? `${days} days` : "Overdue";
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmitAssignment}>
                {/* Form Fields */}
                <div className="space-y-4">
                  <div className="mb-4">
                    <label
                      htmlFor="submission-link-url"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Link URL *
                    </label>
                    <input
                      id="submission-link-url"
                      type="url"
                      value={submissionForm.linkUrl}
                      onChange={(e) =>
                        setSubmissionForm((prev) => ({
                          ...prev,
                          linkUrl: e.target.value,
                        }))
                      }
                      placeholder="https://github.com/username/repository"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      required
                      aria-required="true"
                      aria-describedby="submission-link-url-help"
                    />
                    <span id="submission-link-url-help" className="sr-only">
                      Enter the URL for your submission
                    </span>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="submission-link-title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Link Title *
                    </label>
                    <input
                      id="submission-link-title"
                      type="text"
                      value={submissionForm.linkTitle}
                      onChange={(e) =>
                        setSubmissionForm((prev) => ({
                          ...prev,
                          linkTitle: e.target.value,
                        }))
                      }
                      placeholder="My Project Repository"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                      required
                      aria-required="true"
                      aria-describedby="submission-link-title-help"
                    />
                    <span id="submission-link-title-help" className="sr-only">
                      Enter a descriptive title for your submission link
                    </span>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="submission-content"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Submission Description *
                    </label>
                    <textarea
                      id="submission-content"
                      value={submissionForm.content}
                      onChange={(e) =>
                        setSubmissionForm((prev) => ({
                          ...prev,
                          content: e.target.value,
                        }))
                      }
                      placeholder="Describe your submission, explain your approach, mention any challenges you faced, and highlight key features of your work..."
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none"
                      required
                      aria-required="true"
                      aria-describedby="submission-content-help"
                    />
                    <span id="submission-content-help" className="sr-only">
                      Enter a detailed description of your submission
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    type="button"
                    onClick={closeSubmissionForm}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      !submissionForm.content.trim() ||
                      !submissionForm.linkUrl.trim() ||
                      !submissionForm.linkTitle.trim()
                    }
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 shadow-sm"
                  >
                    {submitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {isEditing ? "Updating..." : "Submitting..."}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2 inline-block" />
                        {isEditing ? "Update Submission" : "Submit Assignment"}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Confirmation Dialog */}
      {showWithdrawDialog && withdrawingAssignment && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <Card className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                    Withdraw Submission
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {withdrawingAssignment.title}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to withdraw your submission? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={closeWithdrawDialog}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdrawSubmission}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
