"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../contexts/AuthContext";
import { API_ENDPOINTS } from "../../../lib/config";
import Link from "next/link";
import Breadcrumb, { HierarchyIndicator } from "../../../components/Breadcrumb";
import SearchFilter, {
  useSearchFilter,
} from "../../../components/SearchFilter";
import { AssignmentService } from "../../../lib/assignmentService";
import {
  Assignment,
  AssignmentFormData,
  AssignmentType,
  AssignmentStatus,
  Batch,
  Vertical,
} from "../../../types/assignment";
import AdminNavbar from "../../../components/AdminNavbar";

export default function AssignmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const batchIdFromUrl = searchParams.get("batchId");
  const { user, isLoading, isAuthenticated, logout, token } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(
    null
  );
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: "",
    description: "",
    type: AssignmentType.INDIVIDUAL,
    status: AssignmentStatus.DRAFT,
    maxScore: 100,
    dueDate: "",
    publishedAt: "",
    batchId: batchIdFromUrl || "",
  });

  // Search and filter functionality
  const { searchTerm, filters, handleSearchChange, handleFilterChange: originalHandleFilterChange } =
    useSearchFilter({
      status: "",
      type: "",
      batch: "",
      vertical: "",
    });

  // Custom handleFilterChange with dependent dropdown logic
  const handleFilterChange = (filterKey: string, value: string) => {
    // Reset dependent filters when parent filter changes
    if (filterKey === "vertical") {
      originalHandleFilterChange("batch", "");
      originalHandleFilterChange("type", "");
      originalHandleFilterChange("status", "");
    } else if (filterKey === "batch") {
      originalHandleFilterChange("type", "");
      originalHandleFilterChange("status", "");
    } else if (filterKey === "type") {
      originalHandleFilterChange("status", "");
    }
    
    // Apply the current filter change
    originalHandleFilterChange(filterKey, value);
  };

  // Filtered assignments based on search and filters
  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filters.status === "" || assignment.status === filters.status;
    const matchesType = filters.type === "" || assignment.type === filters.type;
    const matchesBatch =
      filters.batch === "" || assignment.batchId === filters.batch;
    const matchesVertical =
      filters.vertical === "" || assignment.batch?.verticalId === filters.vertical;

    return matchesSearch && matchesStatus && matchesType && matchesBatch && matchesVertical;
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchAssignments();
      fetchBatches();
      fetchVerticals();
      if (batchIdFromUrl) {
        fetchSelectedBatch();
      }
    }
  }, [user, batchIdFromUrl]);

  // Handle filter parameter from URL
  useEffect(() => {
    const filterParam = searchParams.get("filter");
    if (filterParam) {
      if (filterParam === "published") {
        handleFilterChange("status", AssignmentStatus.PUBLISHED);
      } else if (filterParam === "draft") {
        handleFilterChange("status", AssignmentStatus.DRAFT);
      }
    }
  }, [searchParams]);

  const fetchSelectedBatch = async () => {
    if (!batchIdFromUrl) return;

    try {
      const response = await fetch(
        API_ENDPOINTS.BATCHES.BY_ID(batchIdFromUrl),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedBatch(data);
      }
    } catch (err) {
      console.error("Failed to fetch selected batch:", err);
    }
  };

  const fetchAssignments = async () => {
    try {
      const data = await AssignmentService.getAll(
        token!,
        batchIdFromUrl || undefined
      );
      setAssignments(data);
    } catch (err) {
      setError("Failed to fetch assignments");
    } finally {
      setLoading(false);
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
        setVerticals(data.filter((v: Vertical) => v.isActive));
      }
    } catch (err) {
      console.error("Failed to fetch verticals:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (editingAssignment) {
        await AssignmentService.update(token!, editingAssignment.id, {
          ...formData,
          publishedAt: formData.publishedAt || undefined,
        });
      } else {
        await AssignmentService.create(token!, {
          ...formData,
          publishedAt: formData.publishedAt || undefined,
        });
      }

      await fetchAssignments();
      setShowModal(false);
      setEditingAssignment(null);
      resetForm();
    } catch (err) {
      setError("Failed to save assignment");
    }
  };

  const handleEdit = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setFormData({
      title: assignment.title,
      description: assignment.description,
      type: assignment.type,
      status: assignment.status,
      maxScore: assignment.maxScore,
      dueDate: new Date(assignment.dueDate).toISOString().split("T")[0],
      publishedAt: assignment.publishedAt
        ? new Date(assignment.publishedAt).toISOString().split("T")[0]
        : "",
      batchId: assignment.batchId,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this assignment?")) {
      try {
        await AssignmentService.delete(token!, id);
        await fetchAssignments();
      } catch (err) {
        setError("Failed to delete assignment");
      }
    }
  };

  const handlePublish = async (assignment: Assignment) => {
    try {
      if (assignment.status === AssignmentStatus.PUBLISHED) {
        await AssignmentService.unpublish(token!, assignment.id);
      } else {
        await AssignmentService.publish(token!, assignment.id);
      }
      await fetchAssignments();
    } catch (err) {
      setError("Failed to update assignment status");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      type: AssignmentType.INDIVIDUAL,
      status: AssignmentStatus.DRAFT,
      maxScore: 100,
      dueDate: "",
      publishedAt: "",
      batchId: batchIdFromUrl || "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "maxScore" ? parseInt(value) || 0 : value,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status: AssignmentStatus) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    if (status === AssignmentStatus.PUBLISHED) {
      return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
    }
    return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
  };

  const getTypeBadge = (type: AssignmentType) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    if (type === AssignmentType.PROJECT) {
      return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
    }
    return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`;
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar
        title="Assignment Management"
        subtitle={
          selectedBatch
            ? `Assignments for ${selectedBatch.name} batch`
            : "Manage assignments across all batches"
        }
        icon="Assignment"
        backLink="/admin"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Admin", href: "/admin", level: 0 },
            { label: "Assignments", href: "/admin/assignments", level: 1 },
          ]}
        />

        {selectedBatch && (
          <div className="mb-6">
            <HierarchyIndicator
              level={2}
              title={`${selectedBatch.vertical?.name || "Unknown"} - ${
                selectedBatch.name
              }`}
              parent={selectedBatch.vertical?.name}
            />
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-6">
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            filterOptions={[
              {
                label: "Verticals",
                value: "vertical",
                options: [
                  { value: "", label: "All Verticals" },
                  ...verticals.map((vertical) => ({
                    value: vertical.id,
                    label: vertical.name,
                  })),
                ],
              },
              {
                label: "Batches",
                value: "batch",
                options: [
                  { value: "", label: "All Batches" },
                  ...batches
                    .filter((batch) => 
                      filters.vertical === "" || batch.verticalId === filters.vertical
                    )
                    .map((batch) => ({
                      value: batch.id,
                      label: `${batch.vertical?.name || "Unknown"} - ${
                        batch.name
                      }`,
                    })),
                ],
              },
              {
                label: "Type",
                value: "type",
                options: [
                  { value: "", label: "All Types" },
                  { value: AssignmentType.INDIVIDUAL, label: "Individual" },
                  { value: AssignmentType.PROJECT, label: "Project" },
                ],
              },
              {
                label: "Status",
                value: "status",
                options: [
                  { value: "", label: "All Statuses" },
                  { value: AssignmentStatus.DRAFT, label: "Draft" },
                  { value: AssignmentStatus.PUBLISHED, label: "Published" },
                ],
              },
            ]}
            activeFilters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-200 rounded">
            {error}
          </div>
        )}

        {/* Add New Assignment Button */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => {
              setEditingAssignment(null);
              resetForm();
              setShowModal(true);
            }}
            className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: "#ffdd3b" }}
          >
            + Add New Assignment
          </button>
        </div>

        {/* Assignments Table */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Max Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Due Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredAssignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {assignment.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                          {assignment.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getTypeBadge(assignment.type)}>
                        {assignment.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(assignment.status)}>
                        {assignment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {assignment.maxScore}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(assignment.dueDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {assignment.batch
                        ? `${assignment.batch.vertical?.name || "Unknown"} - ${
                            assignment.batch.name
                          }`
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(assignment)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handlePublish(assignment)}
                        className={`inline-flex items-center px-3 py-1.5 text-sm font-medium text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer ${
                          assignment.status === AssignmentStatus.PUBLISHED
                            ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                            : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        }`}
                      >
                        {assignment.status === AssignmentStatus.PUBLISHED
                          ? "Unpublish"
                          : "Publish"}
                      </button>
                      <button
                        onClick={() => handleDelete(assignment.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAssignments.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No assignments found.
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2
                id="modal-title"
                className="text-xl font-semibold text-gray-900 dark:text-white mb-4"
              >
                {editingAssignment ? "Edit Assignment" : "Add New Assignment"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="assignment-title"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Title
                  </label>
                  <input
                    id="assignment-title"
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                    aria-describedby="title-help"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <span id="title-help" className="sr-only">
                    Enter the assignment title
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="assignment-description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id="assignment-description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    aria-required="true"
                    aria-describedby="description-help"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                  <span id="description-help" className="sr-only">
                    Enter the assignment description
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="assignment-type"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Type
                    </label>
                    <select
                      id="assignment-type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-describedby="type-help"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value={AssignmentType.INDIVIDUAL}>
                        Individual
                      </option>
                      <option value={AssignmentType.PROJECT}>Project</option>
                    </select>
                    <span id="type-help" className="sr-only">
                      Select the assignment type
                    </span>
                  </div>

                  <div>
                    <label
                      htmlFor="assignment-status"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Status
                    </label>
                    <select
                      id="assignment-status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                      aria-describedby="status-help"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value={AssignmentStatus.DRAFT}>Draft</option>
                      <option value={AssignmentStatus.PUBLISHED}>
                        Published
                      </option>
                    </select>
                    <span id="status-help" className="sr-only">
                      Select the assignment status
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Max Score
                    </label>
                    <input
                      type="number"
                      name="maxScore"
                      value={formData.maxScore}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Batch
                    </label>
                    <select
                      name="batchId"
                      value={formData.batchId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select Batch</option>
                      {batches.map((batch) => (
                        <option key={batch.id} value={batch.id}>
                          {batch.vertical?.name || "Unknown"} - {batch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Published At (Optional)
                    </label>
                    <input
                      type="date"
                      name="publishedAt"
                      value={formData.publishedAt}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingAssignment(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg cursor-pointer"
                  >
                    {editingAssignment ? "Update" : "Create"} Assignment
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
