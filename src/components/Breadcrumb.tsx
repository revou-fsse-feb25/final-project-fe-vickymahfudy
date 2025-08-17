"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface BreadcrumbItem {
  label: string;
  href: string;
  level: number;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  currentPage?: string;
}

export default function Breadcrumb({ items, currentPage }: BreadcrumbProps) {
  const pathname = usePathname();

  // Default breadcrumb structure based on hierarchy
  const defaultItems: BreadcrumbItem[] = [
    { label: "Admin Dashboard", href: "/admin", level: 0 },
    { label: "Verticals", href: "/admin/verticals", level: 1 },
    { label: "Batches", href: "/admin/batches", level: 2 },
    { label: "Modules", href: "/admin/modules", level: 3 },
    { label: "Weeks", href: "/admin/weeks", level: 4 },
    { label: "Lectures", href: "/admin/lectures", level: 5 },
  ];

  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: "Admin Dashboard", href: "/admin", level: 0 },
    ];

    if (pathSegments.includes("verticals")) {
      breadcrumbs.push({
        label: "Verticals",
        href: "/admin/verticals",
        level: 1,
      });
    }
    if (pathSegments.includes("batches")) {
      breadcrumbs.push({
        label: "Verticals",
        href: "/admin/verticals",
        level: 1,
      });
      breadcrumbs.push({ label: "Batches", href: "/admin/batches", level: 2 });
    }
    if (pathSegments.includes("modules")) {
      breadcrumbs.push({
        label: "Verticals",
        href: "/admin/verticals",
        level: 1,
      });
      breadcrumbs.push({ label: "Batches", href: "/admin/batches", level: 2 });
      breadcrumbs.push({ label: "Modules", href: "/admin/modules", level: 3 });
    }
    if (pathSegments.includes("weeks")) {
      breadcrumbs.push({
        label: "Verticals",
        href: "/admin/verticals",
        level: 1,
      });
      breadcrumbs.push({ label: "Batches", href: "/admin/batches", level: 2 });
      breadcrumbs.push({ label: "Modules", href: "/admin/modules", level: 3 });
      breadcrumbs.push({ label: "Weeks", href: "/admin/weeks", level: 4 });
    }
    if (pathSegments.includes("lectures")) {
      breadcrumbs.push({
        label: "Verticals",
        href: "/admin/verticals",
        level: 1,
      });
      breadcrumbs.push({ label: "Batches", href: "/admin/batches", level: 2 });
      breadcrumbs.push({ label: "Modules", href: "/admin/modules", level: 3 });
      breadcrumbs.push({ label: "Weeks", href: "/admin/weeks", level: 4 });
      breadcrumbs.push({
        label: "Lectures",
        href: "/admin/lectures",
        level: 5,
      });
    }

    return breadcrumbs;
  };

  const breadcrumbItems = items || generateBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <svg
              className="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          )}

          {/* Level indicator */}
          <div className="flex items-center">
            <span className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 mr-2">
              {item.level}
            </span>

            {index === breadcrumbItems.length - 1 && !currentPage ? (
              <span className="font-medium text-gray-900 dark:text-white">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        </div>
      ))}

      {currentPage && (
        <div className="flex items-center">
          <svg
            className="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="font-medium text-gray-900 dark:text-white">
            {currentPage}
          </span>
        </div>
      )}
    </nav>
  );
}

// Hierarchy indicator component
export function HierarchyIndicator({
  level,
  title,
  parent,
  childrenText,
}: {
  level: number;
  title: string;
  parent?: string;
  childrenText?: string;
}) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium mr-3">
            {level}
          </div>
          <div>
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Level {level}: {title}
            </h3>
          </div>
        </div>

        <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
          Hierarchical Level {level}
        </div>
      </div>
    </div>
  );
}
