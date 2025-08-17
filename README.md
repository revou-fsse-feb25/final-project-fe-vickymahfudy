[![✨ Experience the Live Apps ✨](https://img.shields.io/badge/✨_Click_Here-To_The_Live_Apps!-4c51bf?style=for-the-badge&logo=vercel)](https://final-project-fe-vickymahfudy-production.up.railway.app/)

# Revou LMS - Frontend Application

RevoU's Learning Management System (LMS) is a cutting-edge educational platform. This application serves as the central hub for RevoU's intensive tech bootcamp programs, facilitating seamless interaction between students and administrators. With a focus on practical skill development in Full Stack Program, the platform provides comprehensive features for assignment management, progress tracking, and collaborative learning. The system implements role-based access control, allowing administrators to manage educational content and students to engage with course materials effectively, all while maintaining RevoU's high standards for tech education.

## 🚀 Features

### Core Features

- **Role-Based Authentication**: Separate interfaces for administrators and students
- **Responsive Design**: Mobile-first approach with dark/light theme support
- **Real-time Notifications**: Toast notifications using Sonner
- **Modern UI/UX**: Clean, intuitive interface with smooth animations
- **Type Safety**: Full TypeScript implementation
- **Performance Optimized**: Built with Next.js 15 and Turbopack

### 👨‍💼 Admin Features

#### Educational Structure Management

- **Vertical Management**: Create and manage educational verticals (e.g., Full Stack Development, Data Science)
- **Batch Management**: Organize students into cohorts with specific start/end dates
- **Module Management**: Structure curriculum into logical learning modules
- **Week Management**: Plan weekly learning schedules and content delivery
- **Lecture Management**: Schedule and organize lecture sessions with detailed information

#### Assignment

- **Assignment Management**: Edit, update, and organize assignments across modules

### 🎓 Student Features

#### Learning Dashboard

- **Personal Dashboard**: Centralized view of current courses, assignments, and progress
- **Batch Overview**: Access to batch-specific information and fellow students
- **Upcoming Deadlines**: Clear visibility of assignment due dates and important events

#### Assignment & Submission System

- **Assignment Access**: View detailed assignment instructions and requirements
- **Submission History**: Track all submitted assignments with timestamps
- **Status Tracking**: Monitor submission status (pending, submitted, graded)
- **Resubmission**: Ability to resubmit assignments when permitted

#### Course Navigation

- **Module Exploration**: Navigate through course modules in structured sequence
- **Week-by-Week Content**: Access weekly learning materials and objectives
- **Lecture Access**: View lecture schedules and access recorded sessions

#### Enrollment Management

- **Course Enrollment**: Self-enroll in available courses and batches
- **Enrollment Status**: Track enrollment status and course access
- **Batch Information**: View batch details, schedules, and peer information

### 🚀 Future Feature: Team Lead (Assignment Grading)

#### Overview

The Team Lead feature is planned for future implementation to enhance the learning experience by introducing peer-to-peer learning and distributed grading capabilities. This feature will create a hierarchical learning structure where advanced students can assist in the educational process.

#### Scope & Functionality

##### Team Lead Role & Responsibilities

- **Assignment Grading**: Review and grade assignments from junior students
- **Feedback Provision**: Provide detailed, constructive feedback on submissions
- **Mentorship**: Guide and support assigned students in their learning journey
- **Progress Monitoring**: Track and report on mentee progress to administrators
- **Quality Assurance**: Ensure grading consistency and educational standards

##### Advanced Grading System

- **Rubric-Based Grading**: Structured evaluation criteria for consistent assessment
- **Peer Review Process**: Multi-level review system with admin oversight
- **Grade Calibration**: Training and calibration sessions for Team Leads
- **Appeal Process**: Structured system for grade disputes and reviews
- **Analytics Dashboard**: Comprehensive grading analytics and performance metrics

##### Team Lead Management

- **Selection Criteria**: Automated and manual selection based on performance metrics
- **Training Program**: Comprehensive onboarding for new Team Leads
- **Performance Tracking**: Monitor Team Lead effectiveness and student satisfaction
- **Rotation System**: Regular rotation to provide opportunities for multiple students
- **Recognition System**: Badges, certificates, and recognition for outstanding Team Leads

## 🛠️ Tech Stack

### Core Technologies

- **Framework**: Next.js 15.4.6 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom design system
- **State Management**: React Context API
- **HTTP Client**: Native Fetch API with custom service classes
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Fonts**: Geist Sans & Geist Mono

### Development Tools

- **Build Tool**: Turbopack (Next.js)
- **Linting**: ESLint with Next.js configuration
- **Package Manager**: npm
- **Environment**: Node.js

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   │   ├── assignments/   # Assignment management
│   │   ├── batches/       # Batch management
│   │   ├── lectures/      # Lecture management
│   │   ├── modules/       # Module management
│   │   ├── verticals/     # Vertical management
│   │   └── weeks/         # Week management
│   ├── student/           # Student dashboard pages
│   │   ├── batch/         # Student batch views
│   │   └── enrollment/    # Enrollment management
│   ├── login/             # Authentication pages
│   ├── signup/
│   ├── home/
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/                # Base UI components
│   ├── AdminNavbar.tsx    # Admin navigation
│   ├── StudentNavbar.tsx  # Student navigation
│   ├── Breadcrumb.tsx     # Navigation breadcrumbs
│   └── SearchFilter.tsx   # Search and filter components
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── ThemeContext.tsx   # Theme management
├── lib/                   # Utility libraries
│   ├── config.ts          # API endpoints configuration
│   ├── utils.ts           # Utility functions
│   ├── assignmentService.ts # Assignment API service
│   └── submissionService.ts # Submission API service
└── types/                 # TypeScript type definitions
    └── assignment.ts      # Assignment-related types
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend API server running (see backend repository)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd final-project-fe-vickymahfudy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

   For production, update the API URL to your backend server URL.

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3002`

## 📜 Available Scripts

| Script          | Description                                          |
| --------------- | ---------------------------------------------------- |
| `npm run dev`   | Start development server with Turbopack on port 3002 |
| `npm run build` | Build the application for production                 |
| `npm start`     | Start the production server on port 3002             |
| `npm run lint`  | Run ESLint for code quality checks                   |

## 🎨 Styling & Design System

### Tailwind CSS Configuration

The project uses Tailwind CSS 4 with a custom design system:

- **Dark Mode**: Class-based dark mode support
- **Custom Colors**: Brand-specific color palette
- **Typography**: Geist font family integration
- **Responsive Design**: Mobile-first breakpoints

### Color Palette

```css
/* Brand Colors */
--primary: #fed765        /* Yellow primary */
--primary-dark: #fdd035
--secondary: #8044e2      /* Purple secondary */
--secondary-dark: #6b21a8

/* Semantic Colors */
--success: #10b981
--warning: #f59e0b
--error: #ef4444
--info: #3b82f6
```

### Component Patterns

- **Consistent Spacing**: Using Tailwind's spacing scale
- **Hover Effects**: Smooth transitions and interactive states
- **Glass Morphism**: Backdrop blur effects for modern UI
- **Gradient Accents**: Brand gradient applications

## 🔐 Authentication & State Management

### Authentication Flow

The application uses JWT-based authentication with React Context:

1. **AuthContext**: Manages user state, token storage, and authentication methods
2. **Protected Routes**: Automatic redirection based on authentication status
3. **Role-Based Access**: Different interfaces for admin and student roles
4. **Token Management**: Automatic token refresh and logout handling

### State Management Architecture

- **AuthContext**: User authentication and session management
- **ThemeContext**: Dark/light theme preferences
- **Local State**: Component-level state with React hooks
- **Service Classes**: Centralized API communication

## 🌐 API Integration

### Service Layer Architecture

The application uses a service layer pattern for API communication:

```typescript
// Example: AssignmentService
export class AssignmentService {
  private static getHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  static async getAll(token: string): Promise<Assignment[]> {
    // API call implementation
  }
}
```

### API Endpoints Configuration

Centralized endpoint management in `src/lib/config.ts`:

- **Environment-based URLs**: Automatic switching between development and production
- **Typed Endpoints**: TypeScript interfaces for all API responses
- **Error Handling**: Consistent error handling across all services

### Key API Services

- **AuthService**: Authentication and user management
- **AssignmentService**: Assignment CRUD operations
- **SubmissionService**: Student submission handling
- **EnrollmentService**: Course enrollment management

## 🧩 Key Components

### Navigation Components

- **AdminNavbar**: Admin dashboard navigation with role-specific actions
- **StudentNavbar**: Student interface navigation
- **Breadcrumb**: Hierarchical navigation for complex page structures

### Layout Components

- **RootLayout**: Global layout with context providers
- **ThemeProvider**: Dark/light theme management
- **AuthProvider**: Authentication state management

### UI Components

- **SearchFilter**: Reusable search and filtering functionality
- **Icons**: Centralized icon management with Lucide React
- **Toast Notifications**: Global notification system

## 📱 Responsive Design

### Breakpoint Strategy

- **Mobile First**: Base styles for mobile devices
- **Tablet**: `sm:` prefix for tablet-specific styles
- **Desktop**: `lg:` and `xl:` for larger screens
- **Adaptive Components**: Components that adapt to screen size

### Mobile Optimizations

- **Touch-friendly**: Appropriate touch targets
- **Performance**: Optimized images and lazy loading
- **Navigation**: Mobile-specific navigation patterns

## 🚀 Deployment

### Live Application

The application is deployed on **Railway**, a modern deployment platform that provides seamless CI/CD integration with GitHub.

### Production Build

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

### Environment Variables

For production deployment, ensure the following environment variables are set:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### Railway Deployment (Current Platform)

1. **Connect Repository**: Link your GitHub repository to Railway
2. **Environment Variables**: Set `NEXT_PUBLIC_API_URL` in Railway dashboard
3. **Automatic Deployment**: Railway automatically builds and deploys on every push to main branch
4. **Custom Domain**: Railway provides automatic HTTPS and custom domain support
5. **Build Configuration**:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Node Version**: 18+

### Alternative Deployment Platforms

The application is also optimized for deployment on:

- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Docker** (with provided configuration)

## 🔧 Development Guidelines

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Next.js recommended configuration
- **Prettier**: Code formatting (if configured)
- **Component Naming**: PascalCase for components, camelCase for functions

### Best Practices

1. **Component Structure**: Keep components focused and reusable
2. **Type Safety**: Define interfaces for all data structures
3. **Error Handling**: Implement proper error boundaries and user feedback
4. **Performance**: Use React.memo and useMemo for optimization
5. **Accessibility**: Follow WCAG guidelines for inclusive design

### Adding New Features

1. **Create Types**: Define TypeScript interfaces in `src/types/`
2. **Build Services**: Add API service classes in `src/lib/`
3. **Implement Components**: Create reusable components in `src/components/`
4. **Add Pages**: Use Next.js App Router in `src/app/`
5. **Update Configuration**: Add new endpoints to `src/lib/config.ts`

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Commit changes**: `git commit -m 'Add new feature'`
4. **Push to branch**: `git push origin feature/new-feature`
5. **Submit a Pull Request**

### Commit Convention

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation updates
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test additions or updates

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:

1. **Check Documentation**: Review this README and inline code comments
2. **Search Issues**: Look for existing GitHub issues
3. **Create Issue**: Submit a new issue with detailed description
4. **Contact Team**: Reach out to the development team

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
