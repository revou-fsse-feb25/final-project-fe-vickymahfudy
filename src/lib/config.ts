/**
 * Centralized configuration for backend API URLs
 * This file contains all backend endpoint configurations
 * to make it easier to update or change backend URLs in the future
 */

// Base API URL - change this to update all backend endpoints
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // Authentication endpoints
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },

  // Vertical endpoints
  VERTICALS: {
    BASE: `${API_BASE_URL}/verticals`,
    BY_ID: (id: string) => `${API_BASE_URL}/verticals/${id}`,
  },

  // Batch endpoints
  BATCHES: {
    BASE: `${API_BASE_URL}/batches`,
    BY_ID: (id: string) => `${API_BASE_URL}/batches/${id}`,
  },

  // Module endpoints
  MODULES: {
    BASE: `${API_BASE_URL}/modules`,
    BY_ID: (id: string) => `${API_BASE_URL}/modules/${id}`,
    BY_BATCH: (batchId: string) => `${API_BASE_URL}/modules/batch/${batchId}`,
  },

  // Week endpoints
  WEEKS: {
    BASE: `${API_BASE_URL}/weeks`,
    BY_ID: (id: string) => `${API_BASE_URL}/weeks/${id}`,
    BY_MODULE: (moduleId: string) => `${API_BASE_URL}/weeks/module/${moduleId}`,
  },

  // Lecture endpoints
  LECTURES: {
    BASE: `${API_BASE_URL}/lectures`,
    BY_ID: (id: string) => `${API_BASE_URL}/lectures/${id}`,
    BY_WEEK: (weekId: string) => `${API_BASE_URL}/lectures/week/${weekId}`,
  },

  // Assignment endpoints
  ASSIGNMENTS: {
    BASE: `${API_BASE_URL}/assignments`,
    BY_ID: (id: string) => `${API_BASE_URL}/assignments/${id}`,
  },

  // Submission endpoints
  SUBMISSIONS: {
    BASE: `${API_BASE_URL}/submissions`,
    BY_ID: (id: string) => `${API_BASE_URL}/submissions/${id}`,
  },

  // Enrollment endpoints
  ENROLLMENTS: {
    BASE: `${API_BASE_URL}/enrollments`,
    MY_ENROLLMENTS: `${API_BASE_URL}/enrollments/my-enrollments`,
    AVAILABLE_BATCHES: `${API_BASE_URL}/enrollments/available-batches`,
    MY_ASSIGNMENTS: (batchId?: string) =>
      batchId
        ? `${API_BASE_URL}/enrollments/my-assignments?batchId=${batchId}`
        : `${API_BASE_URL}/enrollments/my-assignments`,
    BATCH_CONTENT: (batchId: string) =>
      `${API_BASE_URL}/enrollments/batch/${batchId}/content`,
  },
};

// Export the base URL for cases where dynamic endpoints are needed
export { API_BASE_URL };

// Helper function to build custom endpoints if needed
export const buildEndpoint = (path: string): string => {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};
