import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ModuleLevel, Module, Week, Lecture } from '@/types';

// Utility function to format duration in minutes to a more readable format
function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  }
  
  return `${mins}m`;
}

// Utility function to format date
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

// Mock modules data
const mockModules: Module[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'A comprehensive introduction to modern web development, covering HTML, CSS, and JavaScript fundamentals. This module is designed for beginners with no prior coding experience and will provide you with a solid foundation in web technologies.',
    level: ModuleLevel.BEGINNER,
    thumbnail: '/images/module-web-dev.jpg',
    duration: 8, // hours
    instructor: {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      title: 'Senior Web Developer',
      bio: 'John has over 10 years of experience in web development and has taught over 50,000 students online.',
      avatar: '/images/instructors/john-doe.jpg'
    },
    weeks: [
      {
        id: '1-1',
        title: 'Week 1: HTML Fundamentals',
        description: 'Learn the building blocks of web pages',
        order: 1,
        moduleId: '1',
        lectures: [
          { 
            id: '1-1-1', 
            title: 'Introduction to HTML', 
            content: 'Introduction to HTML basics',
            order: 1,
            weekId: '1-1',
            duration: 30, 
            resources: [],
            deckLink: 'https://docs.google.com/presentation/d/1abc123', 
            recordedClassLink: 'https://www.youtube.com/watch?v=html-intro',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2023-01-15')
          },
          { 
            id: '1-1-2', 
            title: 'HTML Document Structure', 
            content: 'Learn about HTML document structure',
            order: 2,
            weekId: '1-1',
            duration: 45, 
            resources: [],
            deckLink: 'https://docs.google.com/presentation/d/2def456', 
            recordedClassLink: 'https://www.youtube.com/watch?v=html-structure',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2023-01-15')
          },
          { 
            id: '1-1-3', 
            title: 'Working with Text and Links', 
            content: 'Learn about text formatting and hyperlinks',
            order: 3,
            weekId: '1-1',
            duration: 45, 
            resources: [],
            deckLink: 'https://docs.google.com/presentation/d/3ghi789', 
            recordedClassLink: 'https://www.youtube.com/watch?v=html-text-links',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2023-01-15')
          }
        ],
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-01-15')
      },
      {
        id: '1-2',
        title: 'Week 2: CSS Styling',
        description: 'Style your web pages with CSS',
        order: 2,
        moduleId: '1',
        lectures: [
          { 
            id: '1-2-1', 
            title: 'CSS Basics', 
            content: 'Introduction to CSS styling',
            order: 1,
            weekId: '1-2',
            duration: 45, 
            resources: [],
            deckLink: 'https://docs.google.com/presentation/d/4jkl101', 
            recordedClassLink: 'https://www.youtube.com/watch?v=css-basics',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2023-01-15')
          },
          { 
            id: '1-2-2', 
            title: 'Layout and Positioning', 
            content: 'Learn about CSS layout techniques',
            order: 2,
            weekId: '1-2',
            duration: 60, 
            resources: [],
            deckLink: 'https://docs.google.com/presentation/d/5mno202', 
            recordedClassLink: 'https://www.youtube.com/watch?v=css-layout',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2023-01-15')
          },
          { 
            id: '1-2-3', 
            title: 'Responsive Design', 
            content: 'Create websites that work on all devices',
            order: 3,
            weekId: '1-2',
            duration: 75, 
            resources: [],
            deckLink: 'https://docs.google.com/presentation/d/6pqr303', 
            recordedClassLink: 'https://www.youtube.com/watch?v=css-responsive',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2023-01-15')
          }
        ],
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-01-15')
      },
      {
        id: '1-3',
        title: 'Week 3: JavaScript Essentials',
        description: 'Add interactivity to your websites',
        order: 3,
        moduleId: '1',
        lectures: [
          { 
            id: '1-3-1', 
            title: 'JavaScript Syntax', 
            content: 'Learn JavaScript syntax and basics',
            order: 1,
            weekId: '1-3',
            duration: 45, 
            resources: [],
            deckLink: 'https://docs.google.com/presentation/d/7stu404', 
            recordedClassLink: 'https://www.youtube.com/watch?v=js-syntax',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2023-01-15')
          },
          { 
            id: '1-3-2', 
            title: 'DOM Manipulation', 
            content: 'Learn to manipulate the Document Object Model',
            order: 2,
            weekId: '1-3',
            duration: 60, 
            resources: [],
            deckLink: 'https://docs.google.com/presentation/d/8vwx505', 
            recordedClassLink: 'https://www.youtube.com/watch?v=js-dom',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2023-01-15')
          },
          { 
            id: '1-3-3', 
            title: 'Event Handling', 
            content: 'Handle user interactions with events',
            order: 3,
            weekId: '1-3',
            duration: 75, 
            resources: [],
            deckLink: 'https://docs.google.com/presentation/d/9yz606', 
            recordedClassLink: 'https://www.youtube.com/watch?v=js-events',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2023-01-15')
          }
        ],
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-01-15')
      }
    ],
    price: 0, // Free module
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-06-20')
  }
];

// Function to get a module by ID
function getModule(id: string): Module | undefined {
  return mockModules.find(module => module.id === id);
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const module = getModule(params.id);
  
  if (!module) {
    return {
      title: 'Module Not Found',
    };
  }
  
  return {
    title: `${module.title} | RevoU LMS`,
    description: module.description,
  };
}

export default function ModulePage({ params }: { params: { id: string } }) {
  const module = getModule(params.id);
  
  if (!module) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Module Not Found</h1>
          <p className="mb-6">The module you are looking for does not exist or has been removed.</p>
          <Link 
            href="/modules" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Modules
          </Link>
        </div>
      </div>
    );
  }
  
  // Map module level to a more user-friendly display
  const levelDisplay: Record<ModuleLevel, { text: string; color: string }> = {
    [ModuleLevel.BEGINNER]: { text: 'Beginner', color: 'bg-green-100 text-green-800' },
    [ModuleLevel.INTERMEDIATE]: { text: 'Intermediate', color: 'bg-blue-100 text-blue-800' },
    [ModuleLevel.ADVANCED]: { text: 'Advanced', color: 'bg-purple-100 text-purple-800' },
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          href="/modules" 
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Modules
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-gray-800">
        {/* Module Header */}
        <div className="relative h-64 w-full">
          {module.thumbnail ? (
            <Image 
              src={module.thumbnail} 
              alt={module.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
            <div className="p-6 w-full">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">{module.title}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelDisplay[module.level].color}`}>
                  {levelDisplay[module.level].text}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex flex-wrap gap-4 mb-6 text-sm">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">{formatDuration(module.duration * 60)} total</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Instructor: {module.instructor.firstName} {module.instructor.lastName}</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-700 dark:text-gray-300">Created on {formatDate(module.createdAt)}</span>
            </div>
            {module.price !== undefined && (
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">
                  {module.price === 0 ? 'Free' : `$${module.price.toFixed(2)}`}
                </span>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">About this module</h2>
            <p className="text-gray-700 dark:text-gray-300">{module.description}</p>
          </div>

          {/* Module Content Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Module Content</h2>
            
            {module.weeks.length > 0 ? (
              <div className="space-y-4">
                {module.weeks.map((week) => (
                  <div key={week.id} className="border border-gray-200 rounded-md p-4 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white">{week.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{week.description}</p>
                    
                    {week.lectures && week.lectures.length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-2">
                        {week.lectures.map((lecture) => (
                          <div key={lecture.id} className="py-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-700 dark:text-gray-300">{lecture.title}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{formatDuration(lecture.duration)}</span>
                            </div>
                            {(lecture.deckLink || lecture.recordedClassLink) && (
                              <div className="mt-1 flex flex-wrap gap-2">
                                {lecture.deckLink && (
                                  <a 
                                    href={lecture.deckLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                  >
                                    <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Presentation Deck
                                  </a>
                                )}
                                {lecture.recordedClassLink && (
                                  <a 
                                    href={lecture.recordedClassLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center text-xs text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
                                  >
                                    <svg className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    Recorded Class
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">No content available yet.</p>
            )}
          </div>

          {/* Enrollment/Progress Section */}
           <div className="mt-8 p-6 bg-gray-50 rounded-lg dark:bg-gray-700">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Your Progress</h2>
              
              {/* Mock progress bar - in a real app, this would be dynamic */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-600">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
              </div>
              
              <div className="flex justify-between text-sm text-gray-500 mb-6 dark:text-gray-400">
                <span>45% complete</span>
                <span>5/11 lessons</span>
              </div>
              
              <button className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm transition duration-150 ease-in-out">
                Continue Learning
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}