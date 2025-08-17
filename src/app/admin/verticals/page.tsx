"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "../../../components/ui/icons";
import { useAuth } from "../../../contexts/AuthContext";
import { API_ENDPOINTS } from "../../../lib/config";
import Link from "next/link";
import Breadcrumb, { HierarchyIndicator } from "../../../components/Breadcrumb";
import SearchFilter, {
  useSearchFilter,
} from "../../../components/SearchFilter";
import AdminNavbar from "../../../components/AdminNavbar";

type VerticalType = "FULLSTACK";

interface Vertical {
  id: string;
  name: string;
  description: string;
  type: VerticalType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VerticalFormData {
  name: string;
  description: string;
  type: VerticalType;
  isActive: boolean;
}

export default function VerticalsPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, logout, token } = useAuth();
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingVertical, setEditingVertical] = useState<Vertical | null>(null);
  const [formData, setFormData] = useState<VerticalFormData>({
    name: "",
    description: "",
    type: "FULLSTACK",
    isActive: true,
  });

  // Search and filter functionality
  const { searchTerm, filters, handleSearchChange, handleFilterChange } =
    useSearchFilter({
      status: "",
      type: "",
    });

  // Filtered verticals based on search and filters
  const filteredVerticals = verticals.filter((vertical) => {
    const matchesSearch =
      vertical.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vertical.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filters.status === "" ||
      (filters.status === "active" && vertical.isActive) ||
      (filters.status === "inactive" && !vertical.isActive);
    const matchesType = filters.type === "" || vertical.type === filters.type;

    return matchesSearch && matchesStatus && matchesType;
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchVerticals();
    }
  }, [user]);

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
      } else {
        setError("Failed to fetch verticals");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const url = editingVertical
        ? API_ENDPOINTS.VERTICALS.BY_ID(editingVertical.id)
        : API_ENDPOINTS.VERTICALS.BASE;

      const method = editingVertical ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchVerticals();
        setShowModal(false);
        setEditingVertical(null);
        setFormData({
          name: "",
          description: "",
          type: "FULLSTACK",
          isActive: true,
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to save vertical");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  const handleEdit = (vertical: Vertical) => {
    setEditingVertical(vertical);
    setFormData({
      name: vertical.name,
      description: vertical.description,
      type: vertical.type,
      isActive: vertical.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vertical?")) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.VERTICALS.BY_ID(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchVerticals();
      } else {
        setError("Failed to delete vertical");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingVertical(null);
    setFormData({
      name: "",
      description: "",
      type: "FULLSTACK",
      isActive: true,
    });
    setError("");
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
        title="Verticals Management"
        subtitle="Level 1: Learning tracks and specializations"
        icon="Target"
        backLink="/admin"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Hierarchy Indicator */}
        <HierarchyIndicator
          level={1}
          title="Verticals"
          childrenText="Batches"
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
            {
              label: "Type",
              value: "type",
              options: [
                { label: "Full Stack", value: "FULLSTACK" },
                { label: "Frontend", value: "FRONTEND" },
                { label: "Backend", value: "BACKEND" },
                { label: "Data Science", value: "DATA_SCIENCE" },
                { label: "Mobile", value: "MOBILE" },
                { label: "DevOps", value: "DEVOPS" },
              ],
            },
          ]}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          placeholder="Search verticals by name or description..."
          hierarchyContext={{
            level: 1,
          }}
        />

        {/* Add New Vertical Button */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: "#ffdd3b" }}
            aria-label="Open modal to add new vertical"
          >
            + Add New Vertical
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Verticals Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              All Verticals
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
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Type
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
                {filteredVerticals.map((vertical) => (
                  <tr
                    key={vertical.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {vertical.name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
                        {vertical.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                        {vertical.type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          vertical.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {vertical.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(vertical.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(vertical.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/batches?verticalId=${vertical.id}`}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md mr-2 cursor-pointer"
                      >
                        View Batches
                      </Link>
                      <button
                        onClick={() => handleEdit(vertical)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md mr-2 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(vertical.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredVerticals.length === 0 && verticals.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No verticals match your search criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}

            {verticals.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No verticals found. Create your first vertical to get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3
                id="modal-title"
                className="text-lg font-medium text-gray-900 dark:text-white mb-4"
              >
                {editingVertical ? "Edit Vertical" : "Add New Vertical"}
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
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as VerticalType,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="FULLSTACK">Full Stack</option>
                  </select>
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
                        id="vertical-toggle"
                      />
                      <label
                        htmlFor="vertical-toggle"
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          formData.isActive ? "bg-green-400" : "bg-gray-300"
                        }`}
                      ></label>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.isActive
                      ? "Vertical is currently active"
                      : "Vertical is currently inactive"}
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
                    {editingVertical ? "Update" : "Create"}
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
