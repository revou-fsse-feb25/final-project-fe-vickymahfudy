import { API_ENDPOINTS } from "@/lib/config";

export interface Submission {
  id: string;
  type: "LINK" | "FILE";
  linkUrl: string;
  linkTitle?: string;
  content?: string;
  score?: number;
  feedback?: string;
  submittedAt: string;
  gradedAt?: string;
  userId: string;
  assignmentId: string;
}

export interface CreateSubmissionDto {
  type: "LINK";
  linkUrl: string;
  linkTitle?: string;
  content?: string;
  assignmentId: string;
}

export interface UpdateSubmissionDto {
  linkUrl?: string;
  linkTitle?: string;
  content?: string;
}

class SubmissionService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async createSubmission(data: CreateSubmissionDto): Promise<Submission> {
    const response = await fetch(API_ENDPOINTS.SUBMISSIONS.BASE, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create submission");
    }

    return response.json();
  }

  async getSubmissionByAssignment(
    assignmentId: string
  ): Promise<Submission | null> {
    const response = await fetch(
      `${API_ENDPOINTS.SUBMISSIONS.BASE}?assignmentId=${assignmentId}`,
      {
        method: "GET",
        headers: this.getAuthHeaders(),
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to fetch submission");
    }

    return response.json();
  }

  async updateSubmission(
    submissionId: string,
    data: UpdateSubmissionDto
  ): Promise<Submission> {
    const response = await fetch(
      `${API_ENDPOINTS.SUBMISSIONS.BASE}/${submissionId}`,
      {
        method: "PATCH",
        headers: this.getAuthHeaders(),
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to update submission");
    }

    return response.json();
  }

  async deleteSubmission(submissionId: string): Promise<void> {
    const response = await fetch(
      `${API_ENDPOINTS.SUBMISSIONS.BASE}/${submissionId}`,
      {
        method: "DELETE",
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete submission");
    }
  }
}

export const submissionService = new SubmissionService();
