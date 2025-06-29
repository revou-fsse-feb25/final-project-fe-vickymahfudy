import { ModuleLevel, Module, Enrollment, EnrollmentStatus, Week, Lecture } from '@/types';
// import { api } from '@/lib/api'; // Not used in this mock implementation
import { ModulesClient } from './modules-client';

export const metadata = {
  title: 'Modules - RevoU LMS',
  description: 'Browse available modules on RevoU Learning Management System',
};

// Mock data for modules
const mockModules: Module[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript',
    level: ModuleLevel.BEGINNER,
    thumbnail: '/images/module-web-dev.jpg',
    instructorId: '1',
    instructorName: 'John Doe',
    duration: 8, // Changed from string to number
    weeks: [
      {
        id: '1',
        title: 'Week 1: HTML Fundamentals',
        description: 'Learn the fundamentals of HTML markup language.',
        order: 1,
        moduleId: '1',
        lectures: [
          {
            id: '1',
            title: 'Introduction to HTML',
            weekId: '1',
            content: 'HTML basics content...',
            duration: 30, // minutes
            order: 1,
            resources: [],
            deckLink: 'https://docs.google.com/presentation/d/1abc123/edit?usp=sharing',
            recordedClassLink: 'https://www.youtube.com/watch?v=html101',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2023-06-20'),
          },
        ],
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-01-15')
      },
    ],
    enrollmentCount: 120,
    rating: 4.5,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-06-20'),
  },
  // More mock modules...
];

// Mock enrollments
const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    userId: '1',
    moduleId: '1',
    progress: 45, // percentage
    status: EnrollmentStatus.IN_PROGRESS,
    enrollmentDate: new Date('2023-07-01'),
    completionDate: undefined,
    createdAt: new Date('2023-07-01'),
    updatedAt: new Date('2023-07-15'),
  },
  // More mock enrollments...
];

export default function ModulesPage() {
  // In a real app, these would come from an API
  const modules = mockModules;
  const enrollments = mockEnrollments;
  
  // Create a map of enrolled modules for quick lookup
  const enrolledModuleMap = new Map();
  enrollments.forEach(enrollment => {
    enrolledModuleMap.set(enrollment.moduleId, enrollment);
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ModulesClient 
        allModules={modules} 
        enrolledModuleMap={enrolledModuleMap} 
      />
    </div>
  );
}