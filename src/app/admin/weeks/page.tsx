"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { API_ENDPOINTS } from "../../../lib/config";
import Link from "next/link";
import Breadcrumb, { HierarchyIndicator } from "../../../components/Breadcrumb";
import SearchFilter from "../../../components/SearchFilter";
import AdminNavbar from "../../../components/AdminNavbar";

interface Vertical {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

interface Batch {
  id: string;
  name: string;
  description: string;
  verticalId: string;
  vertical?: Vertical;
}

interface Module {
  id: string;
  name: string;
  description: string;
  batchId: string;
  batch?: Batch;
}

interface Week {
  id: string;
  name: string;
  description: string;
  weekNumber: number;
  moduleId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  module?: Module;
}

interface WeekFormData {
  name: string;
  description: string;
  weekNumber: number;
  moduleId: string;
  isActive: boolean;
}

function WeeksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const moduleIdFromUrl = searchParams.get("moduleId");
  const { user, isLoading, isAuthenticated, logout, token } = useAuth();
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingWeek, setEditingWeek] = useState<Week | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<WeekFormData>({
    name: "",
    description: "",
    weekNumber: 1,
    moduleId: moduleIdFromUrl || "",
    isActive: true,
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchWeeks();
      fetchModules();
      fetchBatches();
      fetchVerticals();
    }
  }, [user]);

  useEffect(() => {
    if (moduleIdFromUrl && modules.length > 0) {
      fetchSelectedModule(moduleIdFromUrl);
    }
  }, [moduleIdFromUrl, modules]);

  const fetchWeeks = async () => {
    try {
      let url = API_ENDPOINTS.WEEKS.BASE;
      if (moduleIdFromUrl) {
        url = API_ENDPOINTS.WEEKS.BY_MODULE(moduleIdFromUrl);
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWeeks(data);
      } else {
        setError("Failed to fetch weeks");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectedModule = async (moduleId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.MODULES.BY_ID(moduleId), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedModule(data);
      }
    } catch (err) {
      console.error("Failed to fetch selected module:", err);
    }
  };

  const fetchModules = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.MODULES.BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setModules(data);
      }
    } catch (err) {
      console.error("Failed to fetch modules:", err);
    }
  };

  const fetchBatches = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.BATCHES.BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBatches(data);
      }
    } catch (err) {
      console.error("Failed to fetch batches:", err);
    }
  };

  const fetchVerticals = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.VERTICALS.BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVerticals(data);
      }
    } catch (err) {
      console.error("Failed to fetch verticals:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const url = editingWeek
        ? API_ENDPOINTS.WEEKS.BY_ID(editingWeek.id)
        : API_ENDPOINTS.WEEKS.BASE;

      const method = editingWeek ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchWeeks();
        setShowModal(false);
        setEditingWeek(null);
        setFormData({
          name: "",
          description: "",
          weekNumber: 1,
          moduleId: "",
          isActive: true,
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to save week");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  const handleEdit = (week: Week) => {
    setEditingWeek(week);
    setFormData({
      name: week.name,
      description: week.description,
      weekNumber: week.weekNumber,
      moduleId: week.moduleId,
      isActive: week.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this week?")) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.WEEKS.BY_ID(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchWeeks();
      } else {
        setError("Failed to delete week");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingWeek(null);
    setFormData({
      name: "",
      description: "",
      weekNumber: 1,
      moduleId: moduleIdFromUrl || "",
      isActive: true,
    });
    setError("");
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterKey: string, filterValue: string) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [filterKey]: filterValue,
      };

      // Reset dependent filters when parent filter changes
      if (filterKey === "vertical") {
        newFilters.batch = "";
        newFilters.module = "";
      } else if (filterKey === "batch") {
        newFilters.module = "";
      }

      return newFilters;
    });
  };

  // Filter weeks based on search term and filters
  const filteredWeeks = weeks
    .filter((week) => {
      const matchesSearch =
        week.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        week.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        switch (key) {
          case "status":
            return value === "active" ? week.isActive : !week.isActive;
          case "module":
            return week.moduleId === value;
          case "batch":
            return week.module?.batchId === value;
          case "vertical":
            return week.module?.batch?.verticalId === value;
          default:
            return true;
        }
      });

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => a.weekNumber - b.weekNumber);

  const getModuleName = (moduleId: string) => {
    const foundModule = modules.find((m) => m.id === moduleId);
    return foundModule
      ? `${foundModule.name} (${foundModule.batch?.name || "Unknown Batch"})`
      : "Unknown Module";
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 animate-spin border-4 border-gray-300 border-t-yellow-400"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <AdminNavbar
        title={selectedModule ? "Weeks" : "Weeks Management"}
        subtitle={
          selectedModule
            ? `Level 4: Weeks in ${selectedModule.name} module`
            : "Level 4: Weekly schedules within modules"
        }
        icon="Calendar"
        backLink="/admin"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Hierarchy Indicator */}
        <HierarchyIndicator
          level={4}
          title="Weeks"
          parent="Modules"
          childrenText="Lectures"
        />

        {/* Search and Filter */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filterOptions={[
            {
              label: "Status",
              value: "status",
              options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ],
            },
            ...(selectedModule
              ? []
              : [
                  {
                    label: "Verticals",
                    value: "vertical",
                    options: verticals.map((v) => ({
                      label: v.name,
                      value: v.id,
                    })),
                  },
                  {
                    label: "Batches",
                    value: "batch",
                    options: batches
                      .filter(
                        (b) =>
                          !filters.vertical || b.verticalId === filters.vertical
                      )
                      .map((b) => ({
                        label: `${b.vertical?.name || "Unknown"} - ${b.name}`,
                        value: b.id,
                      })),
                  },
                  {
                    label: "Modules",
                    value: "module",
                    options: modules
                      .filter(
                        (m) => !filters.batch || m.batchId === filters.batch
                      )
                      .map((m) => ({
                        label: m.name,
                        value: m.id,
                      })),
                  },
                ]),
          ]}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          placeholder="Search weeks by name or description..."
          hierarchyContext={{
            level: 4,
            parentName: selectedModule?.name,
          }}
        />

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Add New Week Button */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: "#ffdd3b" }}
            aria-label="Open modal to add new week"
          >
            + Add New Week
          </button>
        </div>

        {/* Weeks Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedModule ? "Weeks" : "All Weeks"}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({filteredWeeks.length}{" "}
                {filteredWeeks.length === 1 ? "week" : "weeks"})
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Week Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredWeeks.map((week) => (
                  <tr
                    key={week.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {week.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {getModuleName(week.moduleId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {week.weekNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
                        {week.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          week.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {week.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {new Date(week.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {new Date(week.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/lectures?weekId=${week.id}`}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md mr-2 cursor-pointer"
                      >
                        View Lectures
                      </Link>
                      <button
                        onClick={() => handleEdit(week)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md mr-2 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(week.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredWeeks.length === 0 && weeks.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No weeks match your search criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}

            {weeks.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedModule
                    ? "No weeks found. Create your first week to get started."
                    : "No weeks found. Create your first week to get started."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingWeek ? "Edit Week" : "Add New Week"}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Module
                  </label>
                  <select
                    value={formData.moduleId}
                    onChange={(e) =>
                      setFormData({ ...formData, moduleId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a module</option>
                    {modules.map((moduleItem) => (
                      <option key={moduleItem.id} value={moduleItem.id}>
                        {moduleItem.name} (
                        {moduleItem.batch?.name || "Unknown Batch"})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Week Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.weekNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weekNumber: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Active Status
                    </label>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all duration-300 ease-in-out transform"
                        style={{
                          right: formData.isActive ? "0px" : "16px",
                          borderColor: formData.isActive
                            ? "#10b981"
                            : "#d1d5db",
                        }}
                        id="week-toggle"
                      />
                      <label
                        htmlFor="week-toggle"
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          formData.isActive ? "bg-green-400" : "bg-gray-300"
                        }`}
                      ></label>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.isActive
                      ? "Week is currently active"
                      : "Week is currently inactive"}
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    {editingWeek ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function WeeksPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <WeeksContent />
    </Suspense>
  );
}
