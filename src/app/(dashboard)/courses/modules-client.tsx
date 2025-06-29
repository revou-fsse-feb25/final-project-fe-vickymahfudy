"use client";

import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { formatDuration } from '@/lib/utils';
import { ModuleLevel, Module, Enrollment } from '@/types';

interface ModulesClientProps {
  allModules: Module[];
  enrolledModuleMap: Map<string, Enrollment | undefined>;
  levelDisplay: Record<ModuleLevel, string>;
}

export default function ModulesClient({ 
  allModules, 
  enrolledModuleMap, 
  levelDisplay 
}: ModulesClientProps) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Modules</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Browse available modules or continue your enrolled modules</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allModules.map((module) => {
          const enrollment = enrolledModuleMap.get(module.id);
          const isEnrolled = !!enrollment;
          
          return (
            <Card key={module.id} className="flex flex-col h-full overflow-hidden">
              {/* Module Thumbnail */}
              <div className="relative h-40 w-full">
                {module.thumbnail ? (
                  <Image 
                    src={module.thumbnail} 
                    alt={module.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                )}
              </div>
              
              <CardContent className="p-6 flex-grow">
                <div className="flex flex-col h-full">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{module.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{module.description}</p>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Instructor</p>
                        <p className="font-medium text-gray-900 dark:text-white">{module.instructor.firstName} {module.instructor.lastName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Duration</p>
                        <p className="font-medium text-gray-900 dark:text-white">{formatDuration(module.duration * 60)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400">Level</p>
                        <p className="font-medium text-gray-900 dark:text-white">{levelDisplay[module.level]}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto">
                    {isEnrolled && enrollment ? (
                      <div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-2">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full dark:bg-indigo-500" 
                            style={{ width: `${enrollment.progress}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600 dark:text-gray-400">{enrollment.progress}% complete</span>
                          <Link href={`/modules/${module.id}`}>
                            <Button variant="primary" size="sm">Continue</Button>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <Link href={`/modules/${module.id}`}>
                         <Button variant="primary" fullWidth>Enroll Now</Button>
                       </Link>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}