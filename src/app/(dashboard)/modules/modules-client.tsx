'use client';

import Card, { CardContent, CardFooter } from '@/components/ui/Card';
import Link from 'next/link';
import Image from 'next/image';
import { Module, Enrollment } from '@/types';

interface ModulesClientProps {
  allModules: Module[];
  enrolledModuleMap: Map<string, Enrollment>;
}

export function ModulesClient({ allModules, enrolledModuleMap }: ModulesClientProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Modules</h1>
      <p className="text-gray-600 mb-8 dark:text-gray-400">
        Browse available modules or continue your enrolled modules
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allModules.map((module) => {
          const enrollment = enrolledModuleMap.get(module.id);
          const isEnrolled = !!enrollment;
          
          return (
            <Card key={module.id} className="overflow-hidden flex flex-col h-full transition-all hover:shadow-lg">
              <div className="relative h-48 w-full">
                {module.thumbnail ? (
                  <Image 
                    src={module.thumbnail} 
                    alt={module.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center">
                    <span className="text-white text-lg font-medium">No Thumbnail</span>
                  </div>
                )}
                {/* Module Thumbnail */}
              </div>
              
              <CardContent className="flex-grow p-6">
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{module.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 dark:text-gray-400">{module.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{module.instructor ? `${module.instructor.firstName} ${module.instructor.lastName}` : 'Unknown Instructor'}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{module.duration}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>{module.level}</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="p-6 pt-0 border-t">
                {isEnrolled ? (
                  <div className="w-full">
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div 
                          className="bg-indigo-600 h-2.5 rounded-full" 
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1 dark:text-gray-400">
                        <span>{enrollment.progress}% complete</span>
                      </div>
                    </div>
                    <Link 
                      href={`/modules/${module.id}`} 
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Continue
                    </Link>
                  </div>
                ) : (
                  <Link 
                    href={`/modules/${module.id}`} 
                    className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Enroll Now
                  </Link>
                )}
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
}