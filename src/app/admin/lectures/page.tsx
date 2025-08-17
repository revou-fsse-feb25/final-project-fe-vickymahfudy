"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { API_ENDPOINTS } from "../../../lib/config";
import Link from "next/link";
import Breadcrumb, { HierarchyIndicator } from "../../../components/Breadcrumb";
import SearchFilter from "../../../components/SearchFilter";
import { Icons } from "../../../components/ui/icons";
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
  moduleId: string;
  module?: Module;
}

interface Lecture {
  id: string;
  title: string;
  description: string;
  zoomLink?: string;
  deckLink?: string;
  lectureNumber: number;
  duration?: number;
  scheduledAt?: string;
  weekId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  week?: Week;
}

interface LectureFormData {
  title: string;
  description: string;
  zoomLink: string;
  deckLink: string;
  lectureNumber: number;
  duration: number;
  scheduledAt: string;
  weekId: string;
  isActive: boolean;
}

export default function LecturesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const weekIdFromUrl = searchParams.get("weekId");
  const { user, isLoading, isAuthenticated, logout, token } = useAuth();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [selectedWeek, setSelectedWeek] = useState<Week | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<LectureFormData>({
    title: "",
    description: "",
    zoomLink: "",
    deckLink: "",
    lectureNumber: 1,
    duration: 60,
    scheduledAt: "",
    weekId: weekIdFromUrl || "",
    isActive: true,
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchLectures();
      fetchWeeks();
      fetchModules();
      fetchBatches();
      fetchVerticals();
    }
  }, [user]);

  useEffect(() => {
    if (weekIdFromUrl && weeks.length > 0) {
      fetchSelectedWeek();
    }
  }, [weekIdFromUrl, weeks]);

  const fetchSelectedWeek = async () => {
    if (!weekIdFromUrl) return;

    try {
      const response = await fetch(API_ENDPOINTS.WEEKS.BY_ID(weekIdFromUrl), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedWeek(data);
      }
    } catch (err) {
      console.error("Failed to fetch selected week:", err);
    }
  };

  const fetchLectures = async () => {
    try {
      const url = weekIdFromUrl
        ? API_ENDPOINTS.LECTURES.BY_WEEK(weekIdFromUrl)
        : API_ENDPOINTS.LECTURES.BASE;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLectures(data);
      } else {
        setError("Failed to fetch lectures");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeks = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.WEEKS.BASE, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWeeks(data);
      }
    } catch (err) {
      console.error("Failed to fetch weeks:", err);
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

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filterKey: string, value: string) => {
    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [filterKey]: value,
      };

      // Reset dependent filters when parent filter changes
      if (filterKey === "vertical") {
        newFilters.batch = "";
        newFilters.module = "";
        newFilters.week = "";
      } else if (filterKey === "batch") {
        newFilters.module = "";
        newFilters.week = "";
      } else if (filterKey === "module") {
        newFilters.week = "";
      }

      return newFilters;
    });
  };

  const filteredLectures = lectures
    .filter((lecture) => {
      const matchesSearch =
        lecture.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecture.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;

        switch (key) {
          case "status":
            return value === "active" ? lecture.isActive : !lecture.isActive;
          case "week":
            return lecture.weekId === value;
          case "module":
            return lecture.week?.moduleId === value;
          case "batch":
            return lecture.week?.module?.batchId === value;
          case "vertical":
            return lecture.week?.module?.batch?.verticalId === value;
          default:
            return true;
        }
      });

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => a.lectureNumber - b.lectureNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const url = editingLecture
        ? API_ENDPOINTS.LECTURES.BY_ID(editingLecture.id)
        : API_ENDPOINTS.LECTURES.BASE;

      const method = editingLecture ? "PATCH" : "POST";

      // Prepare data with proper scheduledAt handling
      const submitData = {
        ...formData,
        scheduledAt: formData.scheduledAt
          ? new Date(formData.scheduledAt).toISOString()
          : null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        await fetchLectures();
        setShowModal(false);
        setEditingLecture(null);
        setFormData({
          title: "",
          description: "",
          zoomLink: "",
          deckLink: "",
          lectureNumber: 1,
          duration: 60,
          scheduledAt: "",
          weekId: weekIdFromUrl || "",
          isActive: true,
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to save lecture");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  const handleEdit = (lecture: Lecture) => {
    setEditingLecture(lecture);
    setFormData({
      title: lecture.title,
      description: lecture.description,
      zoomLink: lecture.zoomLink || "",
      deckLink: lecture.deckLink || "",
      lectureNumber: lecture.lectureNumber,
      duration: lecture.duration || 60,
      scheduledAt: lecture.scheduledAt
        ? new Date(lecture.scheduledAt).toISOString().slice(0, 16)
        : "",
      weekId: lecture.weekId,
      isActive: lecture.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lecture?")) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.LECTURES.BY_ID(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchLectures();
      } else {
        setError("Failed to delete lecture");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingLecture(null);
    setFormData({
      title: "",
      description: "",
      zoomLink: "",
      deckLink: "",
      lectureNumber: 1,
      duration: 60,
      scheduledAt: "",
      weekId: "",
      isActive: true,
    });
    setError("");
  };

  const getWeekName = (weekId: string) => {
    const foundWeek = weeks.find((w) => w.id === weekId);
    return foundWeek ? foundWeek.name : "Unknown Week";
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full mx-auto mb-4 animate-spin border-4 border-gray-300 border-t-primary"></div>
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
        title={
          selectedWeek ? `${selectedWeek.name} Lectures` : "Lectures Management"
        }
        subtitle={
          selectedWeek
            ? `Level 5: Lectures for ${selectedWeek.name}${
                selectedWeek.module ? ` (${selectedWeek.module.name})` : ""
              }`
            : "Level 5: Individual lectures within weeks"
        }
        icon="Graduation"
        backLink="/admin"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Hierarchy Indicator */}
        <HierarchyIndicator level={5} title="Lectures" parent="Weeks" />

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
            ...(selectedWeek
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
                  {
                    label: "Weeks",
                    value: "week",
                    options: weeks
                      .filter(
                        (w) => !filters.module || w.moduleId === filters.module
                      )
                      .map((w) => ({ label: w.name, value: w.id })),
                  },
                ]),
          ]}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          placeholder="Search lectures by title or description..."
          hierarchyContext={{
            level: 5,
            parentName: selectedWeek?.name,
          }}
        />

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Add New Lecture Button */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: "#ffdd3b" }}
            aria-label="Open modal to add new lecture"
          >
            + Add New Lecture
          </button>
        </div>

        {/* Lectures Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedWeek ? `${selectedWeek.name} Lectures` : "All Lectures"}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({filteredLectures.length}{" "}
                {filteredLectures.length === 1 ? "lecture" : "lectures"})
              </span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Week
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Lecture Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Scheduled At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Links
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
                {filteredLectures.map((lecture) => (
                  <tr
                    key={lecture.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {lecture.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {getWeekName(lecture.weekId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {lecture.lectureNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {lecture.scheduledAt
                          ? new Date(lecture.scheduledAt).toLocaleString(
                              "id-ID",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )
                          : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {lecture.duration ? `${lecture.duration} min` : "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        {lecture.zoomLink && (
                          <a
                            href={lecture.zoomLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded"
                          >
                            Zoom
                          </a>
                        )}
                        {lecture.deckLink && (
                          <a
                            href={lecture.deckLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 text-xs bg-green-100 dark:bg-green-900 px-2 py-1 rounded"
                          >
                            Deck
                          </a>
                        )}
                        {!lecture.zoomLink && !lecture.deckLink && (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
                        {lecture.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          lecture.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {lecture.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {new Date(lecture.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {new Date(lecture.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(lecture)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md mr-2 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(lecture.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredLectures.length === 0 && lectures.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No lectures match your search criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}

            {lectures.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedWeek
                    ? `No lectures found for ${selectedWeek.name}. Create your first lecture to get started.`
                    : "No lectures found. Create your first lecture to get started."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {editingLecture ? "Edit Lecture" : "Add New Lecture"}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Week
                  </label>
                  <select
                    value={formData.weekId}
                    onChange={(e) =>
                      setFormData({ ...formData, weekId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a week</option>
                    {weeks.map((weekItem) => (
                      <option key={weekItem.id} value={weekItem.id}>
                        {weekItem.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lecture Number
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.lectureNumber}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        lectureNumber: parseInt(e.target.value),
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

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Zoom Link
                  </label>
                  <input
                    type="url"
                    value={formData.zoomLink}
                    onChange={(e) =>
                      setFormData({ ...formData, zoomLink: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://zoom.us/j/..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Deck Link
                  </label>
                  <input
                    type="url"
                    value={formData.deckLink}
                    onChange={(e) =>
                      setFormData({ ...formData, deckLink: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    placeholder="https://docs.google.com/presentation/..."
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    placeholder="60"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Scheduled At
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduledAt: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
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
                        id="lecture-toggle"
                      />
                      <label
                        htmlFor="lecture-toggle"
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          formData.isActive ? "bg-green-400" : "bg-gray-300"
                        }`}
                      ></label>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.isActive
                      ? "Lecture is currently active"
                      : "Lecture is currently inactive"}
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
                    {editingLecture ? "Update" : "Create"}
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
