import {
  Assignment,
  CreateAssignmentDto,
  UpdateAssignmentDto,
} from "../types/assignment";

import { API_ENDPOINTS } from "@/lib/config";

export class AssignmentService {
  private static getHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  static async getAll(token: string, batchId?: string): Promise<Assignment[]> {
    try {
      let url = API_ENDPOINTS.ASSIGNMENTS.BASE;
      if (batchId) {
        url += `?batchId=${batchId}`;
      }

      const response = await fetch(url, {
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching assignments:", error);
      throw error;
    }
  }

  static async getPublished(
    token: string,
    batchId?: string
  ): Promise<Assignment[]> {
    try {
      let url = `${API_ENDPOINTS.ASSIGNMENTS.BASE}/published`;
      if (batchId) {
        url += `?batchId=${batchId}`;
      }

      const response = await fetch(url, {
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch published assignments");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching published assignments:", error);
      throw error;
    }
  }

  static async getByBatch(
    token: string,
    batchId: string
  ): Promise<Assignment[]> {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.ASSIGNMENTS.BASE}/batch/${batchId}`,
        {
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assignments by batch");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching assignments by batch:", error);
      throw error;
    }
  }

  static async getById(token: string, id: string): Promise<Assignment> {
    try {
      const response = await fetch(API_ENDPOINTS.ASSIGNMENTS.BY_ID(id), {
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch assignment");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching assignment:", error);
      throw error;
    }
  }

  static async create(
    token: string,
    data: CreateAssignmentDto
  ): Promise<Assignment> {
    try {
      const response = await fetch(API_ENDPOINTS.ASSIGNMENTS.BASE, {
        method: "POST",
        headers: this.getHeaders(token),
        body: JSON.stringify({
          ...data,
          dueDate: new Date(data.dueDate).toISOString(),
          publishedAt: data.publishedAt
            ? new Date(data.publishedAt).toISOString()
            : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create assignment");
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating assignment:", error);
      throw error;
    }
  }

  static async update(
    token: string,
    id: string,
    data: UpdateAssignmentDto
  ): Promise<Assignment> {
    try {
      const response = await fetch(API_ENDPOINTS.ASSIGNMENTS.BY_ID(id), {
        method: "PATCH",
        headers: this.getHeaders(token),
        body: JSON.stringify({
          ...data,
          dueDate: data.dueDate
            ? new Date(data.dueDate).toISOString()
            : undefined,
          publishedAt: data.publishedAt
            ? new Date(data.publishedAt).toISOString()
            : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update assignment");
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating assignment:", error);
      throw error;
    }
  }

  static async delete(token: string, id: string): Promise<void> {
    try {
      const response = await fetch(API_ENDPOINTS.ASSIGNMENTS.BY_ID(id), {
        method: "DELETE",
        headers: this.getHeaders(token),
      });

      if (!response.ok) {
        throw new Error("Failed to delete assignment");
      }
    } catch (error) {
      console.error("Error deleting assignment:", error);
      throw error;
    }
  }

  static async publish(token: string, id: string): Promise<Assignment> {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.ASSIGNMENTS.BASE}/${id}/publish`,
        {
          method: "PATCH",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to publish assignment");
      }

      return await response.json();
    } catch (error) {
      console.error("Error publishing assignment:", error);
      throw error;
    }
  }

  static async unpublish(token: string, id: string): Promise<Assignment> {
    try {
      const response = await fetch(
        `${API_ENDPOINTS.ASSIGNMENTS.BASE}/${id}/unpublish`,
        {
          method: "PATCH",
          headers: this.getHeaders(token),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to unpublish assignment");
      }

      return await response.json();
    } catch (error) {
      console.error("Error unpublishing assignment:", error);
      throw error;
    }
  }
}
