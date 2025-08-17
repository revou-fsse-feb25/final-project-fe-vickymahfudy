[![✨ Experience the Live Apps ✨](https://img.shields.io/badge/✨_Click_Here-To_The_Live_Apps!-4c51bf?style=for-the-badge&logo=vercel)](https://final-project-fe-vickymahfudy-production.up.railway.app/)

# Revou LMS - Frontend Application

RevoU's Learning Management System (LMS) is a cutting-edge educational platform. This application serves as the central hub for RevoU's intensive tech bootcamp programs, facilitating seamless interaction between students and administrators. With a focus on practical skill development in Full Stack Program, the platform provides comprehensive features for assignment management, progress tracking, and collaborative learning. The system implements role-based access control, allowing administrators to manage educational content and students to engage with course materials effectively, all while maintaining RevoU's high standards for tech education.

## 🚀 Features

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

## 🎨 Styling & Design System

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

## 🖥️ Apps Sneak Peek

### Landing Page
<img width="1685" height="1055" alt="Screenshot 2025-08-17 at 22 08 21" src="https://github.com/user-attachments/assets/e102b720-ac32-413b-8992-7c66c48f0053" />

### Login and Sign Up Page
<img width="1698" height="1058" alt="Screenshot 2025-08-17 at 22 09 12" src="https://github.com/user-attachments/assets/1f6ac9fc-116b-4145-92cd-9f9d381538da" />
<img width="1698" height="1053" alt="Screenshot 2025-08-17 at 22 09 53" src="https://github.com/user-attachments/assets/8607f3ca-40dd-4294-8830-db3f658184ab" />

### Admin Dashboard
<img width="1691" height="1063" alt="Screenshot 2025-08-17 at 22 10 36" src="https://github.com/user-attachments/assets/ab23e9e3-ce1e-4a7a-ab3d-38140ce15b11" />

### Admin Course Management
<img width="1692" height="1068" alt="Screenshot 2025-08-17 at 22 11 20" src="https://github.com/user-attachments/assets/5bc1a9f1-68fb-47df-b608-ae32bf5943db" />

### Content Management Form
<img width="1697" height="1062" alt="Screenshot 2025-08-17 at 22 11 52" src="https://github.com/user-attachments/assets/1306cca5-7d8c-49bb-8c4d-c545310d09b5" />

### Student Welcome Page
<img width="1706" height="1066" alt="Screenshot 2025-08-17 at 22 13 43" src="https://github.com/user-attachments/assets/107fd129-7a05-49a7-970b-7be41ccca969" />

### Student Enrollment Page
<img width="1696" height="1066" alt="Screenshot 2025-08-17 at 22 13 18" src="https://github.com/user-attachments/assets/7dad3c22-3098-4e02-a130-3e8666d86e2f" />

### Student Batch Content Page
<img width="1693" height="1068" alt="Screenshot 2025-08-17 at 22 14 14" src="https://github.com/user-attachments/assets/bc174abb-2f83-4d93-bfe9-7975727d11f2" />

### Student Module Content Page
<img width="1699" height="1064" alt="Screenshot 2025-08-17 at 22 15 02" src="https://github.com/user-attachments/assets/81090eff-5e9f-4054-aa77-be36a7719653" />

### Student Assignment Management Page
<img width="1710" height="1069" alt="Screenshot 2025-08-17 at 22 17 38" src="https://github.com/user-attachments/assets/c7077a49-a7ec-4e7d-b924-056468c544ab" />

### Assignment Submission Form
<img width="1709" height="1067" alt="Screenshot 2025-08-17 at 22 16 48" src="https://github.com/user-attachments/assets/6e076b2e-68dc-4298-9760-b20424959351" />

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

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Commit changes**: `git commit -m 'Add new feature'`
4. **Push to branch**: `git push origin feature/new-feature`
5. **Submit a Pull Request**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
