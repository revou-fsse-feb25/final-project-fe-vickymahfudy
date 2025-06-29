import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Module, Schedule, Announcement, Enrollment } from '@/types';

export const metadata = {
  title: 'Dashboard - RevoU LMS',
  description: 'Your RevoU Learning Management System dashboard',
};

// This would be replaced with a server component data fetching in production
async function getEnrolledModules(): Promise<Module[]> {
  try {
    const user = await api.getCurrentUser();
    if (user) {
      return await api.getEnrolledModules(user.id);
    }
    return [];
  } catch (error) {
    console.error('Error fetching enrolled modules:', error);
    return [];
  }
}

async function getUpcomingLectures(): Promise<Schedule[]> {
  try {
    const user = await api.getCurrentUser();
    if (user) {
      // Now we can use the implemented getUserSchedule method
      return await api.getUserSchedule(user.id);
    }
    return [];
  } catch (error) {
    console.error('Error fetching upcoming lectures:', error);
    return [];
  }
}

async function getAnnouncements(): Promise<Announcement[]> {
  try {
    // The getAnnouncements method requires a moduleId parameter
    // For the dashboard, we'll get announcements from all enrolled modules
    const enrolledModules = await getEnrolledModules();
    
    // If there are no enrolled modules, return an empty array
    if (enrolledModules.length === 0) {
      return [];
    }
    
    // Get announcements for the first enrolled module as a placeholder
    // In a real app, we would aggregate announcements from all modules
    return await api.getAnnouncements(enrolledModules[0].id);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
}

export default async function DashboardPage() {
  const [enrolledModules, upcomingLectures, announcements] = await Promise.all([
    getEnrolledModules(),
    getUpcomingLectures(),
    getAnnouncements()
  ]);
  
  // Process enrolled modules to get progress from enrollments
  const modulesWithProgress = enrolledModules.map((module: Module) => {
    const enrollment = module.enrollments?.find((e: Enrollment) => e.userId === "3"); // Assuming user ID 3 is the current user
    return {
      id: module.id,
      title: module.title,
      progress: enrollment ? enrollment.progress : 0
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here&apos;s an overview of your learning progress.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enrolled Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">{enrolledModules.length}</p>
            <p className="text-gray-600 dark:text-gray-400">Active modules</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Average Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">
              {Math.round(modulesWithProgress.reduce((acc, module) => acc + module.progress, 0) / (modulesWithProgress.length || 1))}%
            </p>
            <p className="text-gray-600 dark:text-gray-400">Across all modules</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Lectures</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-yellow-500 dark:text-yellow-400">{upcomingLectures.length}</p>
            <p className="text-gray-600 dark:text-gray-400">Scheduled sessions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Modules</h2>
          <div className="space-y-4">
            {modulesWithProgress.map((module) => (
              <Card key={module.id} className="hover:border-yellow-500 transition-colors">
                <CardContent className="p-4">
                  <Link href={`/modules/${module.id}`} className="block">
                    <h3 className="font-medium text-gray-900 dark:text-white">{module.title}</h3>
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-yellow-500 h-2.5 rounded-full dark:bg-yellow-500" 
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{module.progress}% complete</p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
            <Link 
              href="/modules" 
              className="block text-center text-yellow-500 hover:text-yellow-400 dark:text-yellow-400 dark:hover:text-yellow-300 font-medium"
            >
              View all modules
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Upcoming Lectures</h2>
          <div className="space-y-4">
            {upcomingLectures.map((schedule: Schedule & { lesson?: { title: string }, module?: { title: string } }) => {
              const lectureDate = new Date(schedule.startTime);
              return (
                <Card key={schedule.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{schedule.lesson?.title || schedule.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{schedule.module?.title || 'Unknown Module'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {lectureDate.toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {lectureDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            <Link 
              href="/schedule" 
              className="block text-center text-yellow-500 hover:text-yellow-400 dark:text-yellow-400 dark:hover:text-yellow-300 font-medium"
            >
              View full schedule
            </Link>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-8">Announcements</h2>
          <div className="space-y-4">
            {announcements.slice(0, 3).map((announcement: Announcement) => {
              const announcementDate = new Date(announcement.createdAt);
              return (
                <Card key={announcement.id}>
                  <CardContent className="p-4">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-900 dark:text-white">{announcement.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {announcementDate.toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{announcement.content}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}