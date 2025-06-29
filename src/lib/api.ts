import { User, Module, Week, Lecture, Assignment, Submission, Announcement, Discussion, UserRole, ModuleLevel, EnrollmentStatus, SubmissionStatus, ResourceType } from '../types';

// Mock data for users
const mockUsers: User[] = [
  {
    id: '1',
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
    profilePicture: 'https://i.pravatar.cc/150?img=1',
    bio: 'Platform administrator with experience in educational technology.',
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-01')
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'mentor@example.com',
    role: UserRole.MENTOR,
    profilePicture: 'https://i.pravatar.cc/150?img=2',
    bio: 'Experienced software developer with 10+ years in the industry.',
    createdAt: new Date('2023-01-02'),
    updatedAt: new Date('2023-01-02')
  },
  {
    id: '3',
    firstName: 'John',
    lastName: 'Doe',
    email: 'student@example.com',
    role: UserRole.STUDENT,
    profilePicture: 'https://i.pravatar.cc/150?img=3',
    bio: 'Aspiring developer looking to improve my skills.',
    createdAt: new Date('2023-01-03'),
    updatedAt: new Date('2023-01-03')
  }
];

// Mock data for modules
const mockModules: Module[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript to build your first website.',
    thumbnail: 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    level: ModuleLevel.BEGINNER,
    duration: 20,
    price: 0,
    instructor: mockUsers[1], // Jane Smith
    modules: [],
    enrollments: [
      {
        id: '1',
        userId: '3', // John Doe
        moduleId: '1',
        enrollmentDate: new Date('2023-02-01'),
        progress: 75,
        status: EnrollmentStatus.IN_PROGRESS,
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date('2023-02-01')
      }
    ],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '2',
    title: 'Advanced JavaScript Concepts',
    description: 'Dive deep into JavaScript with topics like closures, prototypes, and async programming.',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    level: ModuleLevel.INTERMEDIATE,
    duration: 30,
    price: 49.99,
    instructor: mockUsers[1], // Jane Smith
    modules: [],
    enrollments: [],
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-01-20')
  },
  {
    id: '3',
    title: 'React Framework Fundamentals',
    description: 'Learn how to build modern web applications using React.',
    thumbnail: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    level: ModuleLevel.INTERMEDIATE,
    duration: 25,
    price: 39.99,
    instructor: mockUsers[1], // Jane Smith
    modules: [],
    enrollments: [
      {
        id: '2',
        userId: '3', // John Doe
        moduleId: '3',
        enrollmentDate: new Date('2023-03-01'),
        progress: 30,
        status: EnrollmentStatus.IN_PROGRESS,
        createdAt: new Date('2023-03-01'),
        updatedAt: new Date('2023-03-01')
      }
    ],
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01')
  },
  {
    id: '4',
    title: 'Full Stack Development with MERN',
    description: 'Build complete web applications using MongoDB, Express, React, and Node.js.',
    thumbnail: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    level: ModuleLevel.ADVANCED,
    duration: 40,
    price: 79.99,
    instructor: mockUsers[1], // Jane Smith
    modules: [],
    enrollments: [],
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15')
  }
];

// Mock data for weeks
const mockWeeks: Week[] = [
  {
    id: '1',
    title: 'Week 1: HTML Basics',
    description: 'Learn the fundamentals of HTML markup language.',
    order: 1,
    moduleId: '1',
    lectures: [],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '2',
    title: 'Week 2: CSS Styling',
    description: 'Learn how to style your HTML with CSS.',
    order: 2,
    moduleId: '1',
    lectures: [],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '3',
    title: 'Week 3: JavaScript Fundamentals',
    description: 'Introduction to JavaScript programming.',
    order: 3,
    moduleId: '1',
    lectures: [],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  }
];

// Mock data for lectures
const mockLectures: Lecture[] = [
  {
    id: '1',
    title: 'HTML Document Structure',
    content: 'Learn about the basic structure of an HTML document including DOCTYPE, html, head, and body tags.',
    order: 1,
    weekId: '1',
    duration: 30,
    deckLink: 'https://docs.google.com/presentation/d/1abc123/edit?usp=sharing',
    recordedClassLink: 'https://www.youtube.com/watch?v=html101',
    resources: [
      {
        id: '1',
        title: 'HTML Cheat Sheet',
        type: ResourceType.PDF,
        url: '/resources/html-cheatsheet.pdf',
        lectureId: '1',
        createdAt: new Date('2023-01-15'),
        updatedAt: new Date('2023-01-15')
      }
    ],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  },
  {
    id: '2',
    title: 'HTML Elements and Attributes',
    content: 'Explore common HTML elements and their attributes.',
    order: 2,
    weekId: '1',
    duration: 45,
    deckLink: 'https://docs.google.com/presentation/d/2def456/edit?usp=sharing',
    recordedClassLink: 'https://www.youtube.com/watch?v=html202',
    resources: [],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-15')
  }
];

// Mock data for announcements
const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Welcome to Web Development!',
    content: 'Welcome to the Introduction to Web Development module! We\'re excited to have you join us on this learning journey.',
    moduleId: '1',
    createdBy: '2', // Jane Smith
    createdAt: new Date('2023-02-01'),
    updatedAt: new Date('2023-02-01')
  },
  {
    id: '2',
    title: 'New Sub-Module Released',
    content: 'The JavaScript Fundamentals sub-module is now available. Start learning the basics of programming with JavaScript!',
    moduleId: '1',
    createdBy: '2', // Jane Smith
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15')
  },
  {
    id: '3',
    title: 'Upcoming Live Session',
    content: 'Join us for a live Q&A session this Friday at 3 PM EST. We\'ll be discussing HTML and CSS concepts.',
    moduleId: '1',
    createdBy: '2', // Jane Smith
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-03-01')
  }
];

// Mock data for assignments
const mockAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Build a Simple Webpage',
    description: 'Create a webpage about yourself using HTML and CSS. Include a header, navigation, main content, and footer.',
    dueDate: new Date('2023-03-15'),
    totalPoints: 100,
    moduleId: '1',
    submissions: [],
    createdAt: new Date('2023-02-15'),
    updatedAt: new Date('2023-02-15')
  },
  {
    id: '2',
    title: 'JavaScript Calculator',
    description: 'Build a simple calculator using JavaScript that can perform basic arithmetic operations.',
    dueDate: new Date('2023-04-01'),
    totalPoints: 150,
    moduleId: '1',
    submissions: [],
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-03-01')
  }
];

// Mock data for submissions
const mockSubmissions: Submission[] = [
  {
    id: '1',
    content: 'https://github.com/johndoe/my-webpage',
    submissionDate: new Date('2023-03-10'),
    score: 85,
    feedback: 'Good work! Your HTML structure is solid, but you could improve your CSS organization.',
    userId: '3', // John Doe
    assignmentId: '1',
    status: SubmissionStatus.GRADED,
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2023-03-12')
  }
];

// Mock data for discussions
const mockDiscussions: Discussion[] = [
  {
    id: '1',
    title: 'Best practices for responsive design',
    content: 'What are some best practices you follow for making websites responsive across different devices?',
    moduleId: '1',
    userId: '3', // John Doe
    comments: [],
    createdAt: new Date('2023-03-05'),
    updatedAt: new Date('2023-03-05')
  }
];

// Connect weeks to modules
mockModules[0].weeks = mockWeeks;

// Connect lectures to weeks
mockWeeks[0].lectures = mockLectures;

// Connect submissions to assignments
mockAssignments[0].submissions = mockSubmissions;

// API service class
// Add the getUserSchedule method to the ApiService class
class ApiService {
  // Auth methods
  async login(email: string, password: string): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    if (user && password === 'Password123') { // In a real app, we'd verify hashed passwords
      return { ...user };
    }
    
    throw new Error('Invalid email or password');
  }
  
  async register(userData: Partial<User>): Promise<User> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!userData.email || !userData.password || !userData.firstName || !userData.lastName) {
      throw new Error('All fields are required');
    }
    
    // Check if email already exists
    if (mockUsers.some(u => u.email === userData.email)) {
      throw new Error('Email already in use');
    }
    
    const newUser: User = {
      id: (mockUsers.length + 1).toString(),
      firstName: userData.firstName!,
      lastName: userData.lastName!,
      email: userData.email!,
      role: userData.role || UserRole.STUDENT,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockUsers.push(newUser);
    return { ...newUser };
  }
  
  // User methods
  async getCurrentUser(): Promise<User | null> {
    // In a real app, we'd verify the token and get the current user
    // For now, just return a mock user
    await new Promise(resolve => setTimeout(resolve, 500));
    return { ...mockUsers[2] }; // Return John Doe as the current user
  }
  
  async updateUserProfile(userId: string, data: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }
    
    const updatedUser = {
      ...mockUsers[userIndex],
      ...data,
      updatedAt: new Date()
    };
    
    mockUsers[userIndex] = updatedUser;
    return { ...updatedUser };
  }
  
  // Module methods
  async getModules(): Promise<Module[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [...mockModules];
  }
  
  async getModule(moduleId: string): Promise<Module> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const module = mockModules.find(m => m.id === moduleId);
    if (!module) {
      throw new Error('Module not found');
    }
    
    return { ...module };
  }
  
  async getEnrolledModules(userId: string): Promise<Module[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const enrolledModules = mockModules.filter(module => 
      module.enrollments.some(enrollment => enrollment.userId === userId)
    );
    
    return [...enrolledModules];
  }
  
  async enrollInModule(userId: string, moduleId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const moduleIndex = mockModules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) {
      throw new Error('Module not found');
    }
    
    // Check if already enrolled
    if (mockModules[moduleIndex].enrollments.some(e => e.userId === userId)) {
      throw new Error('Already enrolled in this module');
    }
    
    const newEnrollment = {
      id: Math.random().toString(36).substring(2, 15),
      userId,
      moduleId,
      enrollmentDate: new Date(),
      progress: 0,
      status: EnrollmentStatus.ENROLLED,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockModules[moduleIndex].enrollments.push(newEnrollment);
  }
  
  // Week and Lecture methods
  async getWeeks(moduleId: string): Promise<Week[]> {
    await this.delay(500);
    
    const weeks = mockWeeks.filter(w => w.moduleId === moduleId);
    return [...weeks];
  }
  
  async getLectures(weekId: string): Promise<Lecture[]> {
    await this.delay(500);
    
    const lectures = mockLectures.filter(l => l.weekId === weekId);
    return [...lectures];
  }
  
  // Announcement methods
  async getAnnouncements(moduleId: string): Promise<Announcement[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const announcements = mockAnnouncements.filter(a => a.moduleId === moduleId);
    return [...announcements];
  }
  
  // Assignment methods
  async getAssignments(moduleId: string): Promise<Assignment[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const assignments = mockAssignments.filter(a => a.moduleId === moduleId);
    return [...assignments];
  }
  
  async submitAssignment(assignmentId: string, userId: string, content: string): Promise<Submission> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const assignmentIndex = mockAssignments.findIndex(a => a.id === assignmentId);
    if (assignmentIndex === -1) {
      throw new Error('Assignment not found');
    }
    
    const newSubmission: Submission = {
      id: Math.random().toString(36).substring(2, 15),
      content,
      submissionDate: new Date(),
      userId,
      assignmentId,
      status: SubmissionStatus.SUBMITTED,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    mockAssignments[assignmentIndex].submissions.push(newSubmission);
    mockSubmissions.push(newSubmission);
    
    return { ...newSubmission };
  }
  
  // Discussion methods
  async getDiscussions(moduleId: string): Promise<Discussion[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const discussions = mockDiscussions.filter(d => d.moduleId === moduleId);
    return [...discussions];
  }
  
  // Schedule methods
  async getUserSchedule(userId: string): Promise<Schedule[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, we would fetch the user's schedule from the API
    // For now, return an empty array as a placeholder
    return [];
  }
  
  // Helper method for simulating API delays
  private async delay(ms: number = 500): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export a singleton instance
export const api = new ApiService();