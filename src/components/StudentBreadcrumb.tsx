"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface StudentBreadcrumbProps {
  items: BreadcrumbItem[];
}

export default function StudentBreadcrumb({ items }: StudentBreadcrumbProps) {
  const router = useRouter();

  const handleClick = (item: BreadcrumbItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.href) {
      router.push(item.href);
    }
  };

  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li
            key={index}
            className={item.isActive ? "" : "inline-flex items-center"}
          >
            {index > 0 && (
              <div className="flex items-center">
                <svg
                  className="w-3 h-3 text-gray-400 mx-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </div>
            )}

            {item.isActive ? (
              <span className="ml-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:ml-2">
                {item.label}
              </span>
            ) : (
              <button
                onClick={() => handleClick(item)}
                className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
              >
                {item.label}
              </button>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Helper function to create common breadcrumb patterns
export const createStudentBreadcrumbs = {
  dashboard: (): BreadcrumbItem[] => [
    { label: "Dashboard", href: "/student", isActive: true },
  ],

  enrollment: (): BreadcrumbItem[] => [
    { label: "Dashboard", href: "/student" },
    { label: "Enrollment", isActive: true },
  ],

  assignments: (): BreadcrumbItem[] => [
    { label: "Dashboard", href: "/student" },
    { label: "Assignments", isActive: true },
  ],

  batch: (batchName: string, batchId: string): BreadcrumbItem[] => [
    { label: "Dashboard", href: "/student" },
    { label: batchName, isActive: true },
  ],

  batchModules: (batchName: string, batchId: string): BreadcrumbItem[] => [
    { label: "Dashboard", href: "/student" },
    { label: batchName, href: `/student/batch/${batchId}` },
    { label: "Learning Modules", isActive: true },
  ],

  batchAssignments: (batchName: string, batchId: string): BreadcrumbItem[] => [
    { label: "Dashboard", href: "/student" },
    { label: batchName, href: `/student/batch/${batchId}` },
    { label: "Assignments", isActive: true },
  ],
};
