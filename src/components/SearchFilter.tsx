"use client";

import { useState } from "react";
// Simple SVG icons as components
const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const FunnelIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
    />
  </svg>
);

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterOptions?: {
    label: string;
    value: string;
    options: { label: string; value: string }[];
  }[];
  activeFilters: Record<string, string>;
  onFilterChange: (filterKey: string, value: string) => void;
  placeholder?: string;
  hierarchyContext?: {
    level: number;
    parentName?: string;
    parentId?: string;
  };
}

export default function SearchFilter({
  searchTerm,
  onSearchChange,
  filterOptions = [],
  activeFilters,
  onFilterChange,
  placeholder = "Search...",
  hierarchyContext,
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const clearAllFilters = () => {
    filterOptions.forEach((filter) => {
      onFilterChange(filter.value, "");
    });
    onSearchChange("");
  };

  const hasActiveFilters =
    Object.values(activeFilters).some((value) => value !== "") ||
    searchTerm !== "";

  return (
    <section
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6"
      role="search"
      aria-label="Search and filter content"
    >
      {/* Hierarchy Context */}
      {hierarchyContext && hierarchyContext.parentName && (
        <div
          className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center text-sm text-blue-700 dark:text-blue-300">
            <span className="font-medium">
              Viewing Level {hierarchyContext.level} items
            </span>
            {hierarchyContext.parentName && (
              <span className="ml-2">
                under &ldquo;{hierarchyContext.parentName}&rdquo;
              </span>
            )}
          </div>
        </div>
      )}

      {/* Filter Options - Now displayed above search */}
      {filterOptions.length > 0 && (
        <div
          id="filter-options"
          className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700"
          role="group"
          aria-label="Filter options"
        >
          <div className="flex items-center justify-between">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 text-sm rounded-md bg-red-100 hover:bg-red-200 text-red-600 hover:text-red-800 dark:bg-red-700 dark:hover:bg-red-600 dark:text-red-300 dark:hover:text-red-100 transition-colors duration-200 cursor-pointer"
                aria-label="Clear all active filters"
              >
                Clear filter
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filterOptions.map((filter) => (
              <div key={filter.value}>
                <label
                  htmlFor={`filter-${filter.value}`}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {filter.label}
                </label>
                <select
                  id={`filter-${filter.value}`}
                  value={activeFilters[filter.value] || ""}
                  onChange={(e) => onFilterChange(filter.value, e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  aria-describedby={`filter-${filter.value}-description`}
                >
                  <option value="">All {filter.label}</option>
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span
                  id={`filter-${filter.value}-description`}
                  className="sr-only"
                >
                  Filter by {filter.label.toLowerCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Input */}
      <div className="flex-1">
        <label htmlFor="search-input" className="sr-only">
          Search content
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            id="search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
            placeholder={placeholder}
            aria-describedby={
              hasActiveFilters ? "active-filters-status" : undefined
            }
          />
        </div>
      </div>
    </section>
  );
}

// Hook for managing search and filter state
export function useSearchFilter(initialFilters: Record<string, string> = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState(initialFilters);

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  const resetFilters = () => {
    setSearchTerm("");
    setFilters(initialFilters);
  };

  return {
    searchTerm,
    filters,
    handleSearchChange,
    handleFilterChange,
    resetFilters,
  };
}
