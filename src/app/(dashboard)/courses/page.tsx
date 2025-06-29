import { ModuleLevel, Module, Enrollment, UserRole } from '@/types';
// import { api } from '@/lib/api'; // Not used in this mock implementation
// Create a local client component to avoid import error
// Simple placeholder component to avoid serialization issues
const ModulesClient = () => {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Modules will be displayed here</h3>
      <p className="text-sm text-gray-600 mt-1">This is a placeholder during build</p>
    </div>
  );
};

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
    thumbnail: '/images/course-web-dev.jpg',
    instructorId: '1',
    instructorName: 'John Doe',
    duration: '8 weeks',
    modules: [
      {
        id: '1',
        title: 'HTML Fundamentals',
        moduleId: '1',
        lessons: [
          {
            id: '1',
            title: 'Introduction to HTML',
            subModuleId: '1',
            content: 'HTML basics content...',
            duration: 30, // minutes
            deckLink: 'https://docs.google.com/presentation/d/1abc123/edit?usp=sharing',
            recordedClassLink: 'https://www.youtube.com/watch?v=html101',
          },
        ],
      },
    ],
    enrollmentCount: 120,
    rating: 4.5,
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-06-20'),
  },
];

// Get the current user's enrolled modules
function getEnrolledModules(userId: string): Enrollment[] {
  return [
    {
      id: 'enrollment-1',
      userId: userId,
      moduleId: '1',
      status: 'active',
      progress: 0.3,
      enrolledAt: '2023-05-15T00:00:00Z' as unknown as Date,
      completedAt: null,
      updatedAt: '2023-05-15T00:00:00Z' as unknown as Date
    }
  ];
}

export default function ModulesPage() {
  // Simplified version for build
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Available Modules</h1>
      <ModulesClient />
    </div>
  );
}