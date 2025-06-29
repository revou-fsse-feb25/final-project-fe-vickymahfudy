// User Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Optional as we don't always want to include this in responses
  role: UserRole;
  profilePicture?: string;
  bio?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  STUDENT = 'STUDENT',
  MENTOR = 'MENTOR',
  ADMIN = 'ADMIN'
}

// Module Types
export interface Module {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  level: ModuleLevel;
  duration: number; // in hours
  price?: number;
  instructor: User;
  weeks: Week[];
  enrollments: Enrollment[];
  createdAt: Date;
  updatedAt: Date;
}

export enum ModuleLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

// Week Types (replacing SubModule)
export interface Week {
  id: string;
  title: string;
  description: string;
  order: number;
  moduleId: string;
  lectures: Lecture[];
  createdAt: Date;
  updatedAt: Date;
}

// Lecture Types (replacing Lesson)
export interface Lecture {
  id: string;
  title: string;
  content: string;
  order: number;
  weekId: string;
  duration: number; // in minutes
  resources: Resource[];
  deckLink?: string; // Optional link to presentation deck
  recordedClassLink?: string; // Optional link to recorded class video
  createdAt: Date;
  updatedAt: Date;
}

// Resource Types
export interface Resource {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
  lectureId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ResourceType {
  PDF = 'PDF',
  VIDEO = 'VIDEO',
  LINK = 'LINK',
  IMAGE = 'IMAGE'
}

// Enrollment Types
export interface Enrollment {
  id: string;
  userId: string;
  moduleId: string;
  enrollmentDate: Date;
  completionDate?: Date;
  progress: number; // percentage
  status: EnrollmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum EnrollmentStatus {
  ENROLLED = 'ENROLLED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  DROPPED = 'DROPPED'
}

// Progress Types
export interface Progress {
  id: string;
  userId: string;
  lectureId: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Assignment Types
export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  totalPoints: number;
  moduleId: string;
  submissions: Submission[];
  createdAt: Date;
  updatedAt: Date;
}

// Submission Types
export interface Submission {
  id: string;
  content: string;
  submissionDate: Date;
  score?: number;
  feedback?: string;
  userId: string;
  assignmentId: string;
  status: SubmissionStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum SubmissionStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  GRADED = 'GRADED',
  LATE = 'LATE'
}

// Announcement Types
export interface Announcement {
  id: string;
  title: string;
  content: string;
  moduleId: string;
  createdBy: string; // userId
  createdAt: Date;
  updatedAt: Date;
}

// Discussion Types
export interface Discussion {
  id: string;
  title: string;
  content: string;
  moduleId: string;
  userId: string;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  discussionId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Notification Types
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  userId: string;
  relatedId?: string; // ID of related entity (module, assignment, etc.)
  createdAt: Date;
  updatedAt: Date;
}

export enum NotificationType {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  ASSIGNMENT = 'ASSIGNMENT',
  GRADE = 'GRADE',
  DISCUSSION = 'DISCUSSION',
  SYSTEM = 'SYSTEM'
}

// Schedule Types
export interface Schedule {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  moduleId: string;
  createdBy: string; // userId
  attendances: Attendance[];
  createdAt: Date;
  updatedAt: Date;
}

// Attendance Types
export interface Attendance {
  id: string;
  scheduleId: string;
  userId: string;
  status: AttendanceStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED'
}

// Issue Ticket Types
export interface IssueTicket {
  id: string;
  title: string;
  description: string;
  type: IssueType;
  priority: IssuePriority;
  status: IssueStatus;
  userId: string;
  assignedTo?: string; // userId
  moduleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum IssueType {
  TECHNICAL = 'TECHNICAL',
  CONTENT = 'CONTENT',
  BILLING = 'BILLING',
  OTHER = 'OTHER'
}

export enum IssuePriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum IssueStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}