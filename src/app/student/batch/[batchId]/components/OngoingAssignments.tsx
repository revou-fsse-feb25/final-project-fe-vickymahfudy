"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_ENDPOINTS } from "@/lib/config";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Assignment {
  id: string;
  title: string;
  description: string;
  type: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  maxScore: number;
  submittedAt?: string;
  score?: number;
}

interface OngoingAssignmentsProps {
  batchId: string;
}

export default function OngoingAssignments({
  batchId,
}: OngoingAssignmentsProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOngoingAssignments();
  }, [batchId]);

  const fetchOngoingAssignments = async () => {
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
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }

      const data = await response.json();
      // Filter for assignments that haven't passed due date yet
      const now = new Date();
      const upcomingAssignments = data.filter((assignment: Assignment) => {
        const dueDate = new Date(assignment.dueDate);
        return dueDate > now;
      });

      setAssignments(upcomingAssignments);
    } catch (error) {
      console.error("Error fetching assignments:", error);
      toast.error("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
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

  const getStatusColor = (daysUntilDue: number) => {
    if (daysUntilDue <= 1) return "text-red-600 border-red-600";
    if (daysUntilDue <= 3) return "text-orange-600 border-orange-600";
    return "text-green-600 border-green-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {assignments.map((assignment) => {
        const daysUntilDue = getDaysUntilDue(assignment.dueDate);
        const statusColor = getStatusColor(daysUntilDue);

        return (
          <div
            key={assignment.id}
            className="bg-gradient-to-r from-primary/5 to-secondary/5 p-3 sm:p-4 rounded-xl border border-primary/10"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200/50 dark:border-gray-700/50 hover:shadow-md transition-shadow duration-200 space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">
                    {assignment.title}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>Due: {formatDate(assignment.dueDate)}</span>
                    <span>•</span>
                    <span>{assignment.type}</span>
                    <span>•</span>
                    <span>Max Score: {assignment.maxScore}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <Badge
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    daysUntilDue <= 1
                      ? "bg-gradient-to-r from-red-100 to-red-100 text-red-600 border-red-200"
                      : daysUntilDue <= 3
                      ? "bg-gradient-to-r from-orange-100 to-orange-100 text-orange-600 border-orange-200"
                      : "bg-gradient-to-r from-green-100 to-green-100 text-green-600 border-green-200"
                  }`}
                >
                  {daysUntilDue === 0
                    ? "Due Today"
                    : daysUntilDue === 1
                    ? "Due Tomorrow"
                    : `${daysUntilDue} days left`}
                </Badge>
              </div>
            </div>
          </div>
        );
      })}

      {assignments.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">
              No upcoming assignments at the moment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
