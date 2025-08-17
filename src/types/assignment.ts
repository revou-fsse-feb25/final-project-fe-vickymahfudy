export enum AssignmentType {
  PROJECT = "PROJECT",
  INDIVIDUAL = "INDIVIDUAL",
}

export enum AssignmentStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export interface Vertical {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Batch {
  id: string;
  name: string;
  description: string;
  verticalId: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
  vertical?: Vertical;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  type: AssignmentType;
  status: AssignmentStatus;
  maxScore: number;
  dueDate: string;
  publishedAt: string | null;
  batchId: string;
  createdAt: string;
  updatedAt: string;
  batch?: Batch;
}

export interface CreateAssignmentDto {
  title: string;
  description: string;
  type: AssignmentType;
  status: AssignmentStatus;
  maxScore: number;
  dueDate: string;
  publishedAt?: string;
  batchId: string;
}

export interface UpdateAssignmentDto {
  title?: string;
  description?: string;
  type?: AssignmentType;
  status?: AssignmentStatus;
  maxScore?: number;
  dueDate?: string;
  publishedAt?: string;
  batchId?: string;
}

export interface AssignmentFormData {
  title: string;
  description: string;
  type: AssignmentType;
  status: AssignmentStatus;
  maxScore: number;
  dueDate: string;
  publishedAt: string;
  batchId: string;
}
