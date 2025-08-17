"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { API_ENDPOINTS } from "@/lib/config";
import { useAuth } from "../../../contexts/AuthContext";
import Link from "next/link";
import Breadcrumb, { HierarchyIndicator } from "../../../components/Breadcrumb";
import SearchFilter, {
  useSearchFilter,
} from "../../../components/SearchFilter";
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
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  vertical?: Vertical;
}

interface BatchFormData {
  name: string;
  description: string;
  verticalId: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export default function BatchesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verticalIdFromUrl = searchParams.get("verticalId");
  const { user, isLoading, isAuthenticated, logout, token } = useAuth();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [selectedVertical, setSelectedVertical] = useState<Vertical | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [formData, setFormData] = useState<BatchFormData>({
    name: "",
    description: "",
    verticalId: verticalIdFromUrl || "",
    startDate: "",
    endDate: "",
    isActive: true,
  });

  // Search and filter functionality
  const { searchTerm, filters, handleSearchChange, handleFilterChange } =
    useSearchFilter({
      status: "",
      vertical: "",
    });

  // Filtered batches based on search and filters
  const filteredBatches = batches.filter((batch) => {
    const matchesSearch =
      batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      batch.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filters.status === "" ||
      (filters.status === "active" && new Date(batch.endDate) > new Date()) ||
      (filters.status === "inactive" && new Date(batch.endDate) <= new Date());
    const matchesVertical =
      filters.vertical === "" || batch.verticalId === filters.vertical;

    return matchesSearch && matchesStatus && matchesVertical;
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchBatches();
      fetchVerticals();
      if (verticalIdFromUrl) {
        fetchSelectedVertical();
      }
    }
  }, [user, verticalIdFromUrl]);

  const fetchSelectedVertical = async () => {
    if (!verticalIdFromUrl) return;

    try {
      const response = await fetch(
        API_ENDPOINTS.VERTICALS.BY_ID(verticalIdFromUrl),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSelectedVertical(data);
      }
    } catch (err) {
      console.error("Failed to fetch selected vertical:", err);
    }
  };

  const fetchBatches = async () => {
    try {
      let url = API_ENDPOINTS.BATCHES.BASE;
      if (verticalIdFromUrl) {
        url += `?verticalId=${verticalIdFromUrl}`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBatches(data);
      } else {
        setError("Failed to fetch batches");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
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
      const url = editingBatch
        ? API_ENDPOINTS.BATCHES.BY_ID(editingBatch.id)
        : API_ENDPOINTS.BATCHES.BASE;

      const method = editingBatch ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          startDate: new Date(formData.startDate).toISOString(),
          endDate: new Date(formData.endDate).toISOString(),
        }),
      });

      if (response.ok) {
        await fetchBatches();
        setShowModal(false);
        setEditingBatch(null);
        setFormData({
          name: "",
          description: "",
          verticalId: "",
          startDate: "",
          endDate: "",
          isActive: true,
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to save batch");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  const handleEdit = (batch: Batch) => {
    setEditingBatch(batch);
    setFormData({
      name: batch.name,
      description: batch.description,
      verticalId: batch.verticalId,
      startDate: new Date(batch.startDate).toISOString().split("T")[0],
      endDate: new Date(batch.endDate).toISOString().split("T")[0],
      isActive: batch.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this batch?")) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.BATCHES.BY_ID(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchBatches();
      } else {
        setError("Failed to delete batch");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBatch(null);
    setFormData({
      name: "",
      description: "",
      verticalId: "",
      startDate: "",
      endDate: "",
      isActive: true,
    });
    setError("");
  };

  const getVerticalName = (verticalId: string) => {
    const vertical = verticals.find((v) => v.id === verticalId);
    return vertical ? vertical.name : "Unknown Vertical";
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
          selectedVertical
            ? `${selectedVertical.name} - Batches`
            : "Batches Management"
        }
        subtitle={
          selectedVertical
            ? `Level 2: Student cohorts within ${selectedVertical.name}`
            : "Level 2: Student cohorts within verticals"
        }
        icon="Users"
        backLink="/admin"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Hierarchy Indicator */}
        <HierarchyIndicator
          level={2}
          title="Batches"
          parent="Verticals"
          childrenText="Modules"
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
            ...(selectedVertical
              ? []
              : [
                  {
                    label: "Vertical",
                    value: "vertical",
                    options: verticals.map((v) => ({
                      label: v.name,
                      value: v.id,
                    })),
                  },
                ]),
          ]}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          placeholder="Search batches by name or description..."
          hierarchyContext={{
            level: 2,
            parentName: selectedVertical?.name,
          }}
        />

        {/* Add New Batch Button */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: "#ffdd3b" }}
            aria-label="Open modal to add new batch"
          >
            + Add New Batch
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Batches Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedVertical
                ? `${selectedVertical.name} Batches`
                : "All Batches"}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({filteredBatches.length}{" "}
                {filteredBatches.length === 1 ? "batch" : "batches"})
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
                    Vertical
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Duration
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
                {filteredBatches.map((batch) => (
                  <tr
                    key={batch.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {batch.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {getVerticalName(batch.verticalId)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
                        {batch.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      <div>
                        <div>
                          Start:{" "}
                          {new Date(batch.startDate).toLocaleDateString()}
                        </div>
                        <div>
                          End: {new Date(batch.endDate).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          batch.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {batch.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(batch.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(batch.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/modules?batchId=${batch.id}`}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md mr-2 cursor-pointer"
                      >
                        View Modules
                      </Link>
                      <button
                        onClick={() => handleEdit(batch)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md mr-2 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(batch.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBatches.length === 0 && batches.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No batches match your search criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}

            {batches.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedVertical
                    ? `No batches found for ${selectedVertical.name}. Create your first batch to get started.`
                    : "No batches found. Create your first batch to get started."}
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
                {editingBatch ? "Edit Batch" : "Add New Batch"}
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
                    Vertical
                  </label>
                  <select
                    value={formData.verticalId}
                    onChange={(e) =>
                      setFormData({ ...formData, verticalId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                  >
                    <option value="">Select a vertical</option>
                    {verticals.map((vertical) => (
                      <option key={vertical.id} value={vertical.id}>
                        {vertical.name}
                      </option>
                    ))}
                  </select>
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
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
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
                        id="toggle"
                      />
                      <label
                        htmlFor="toggle"
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          formData.isActive ? "bg-green-400" : "bg-gray-300"
                        }`}
                      ></label>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.isActive
                      ? "Batch is currently active"
                      : "Batch is currently inactive"}
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
                    {editingBatch ? "Update" : "Create"}
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
