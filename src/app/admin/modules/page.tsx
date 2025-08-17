"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icons } from "../../../components/ui/icons";
import { useAuth } from "../../../contexts/AuthContext";
import Link from "next/link";
import Breadcrumb, { HierarchyIndicator } from "../../../components/Breadcrumb";
import SearchFilter from "../../../components/SearchFilter";
import AdminNavbar from "../../../components/AdminNavbar";
import { API_ENDPOINTS } from "../../../lib/config";

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
  moduleOrder: number;
  batchId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  batch?: Batch;
}

interface ModuleFormData {
  name: string;
  description: string;
  moduleOrder: number;
  batchId: string;
  isActive: boolean;
}

export default function ModulesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const batchIdFromUrl = searchParams.get("batchId");
  const { user, isLoading, isAuthenticated, logout, token } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<ModuleFormData>({
    name: "",
    description: "",
    moduleOrder: 1,
    batchId: batchIdFromUrl || "",
    isActive: true,
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      fetchModules();
      fetchBatches();
      fetchVerticals();
    }
  }, [user]);

  useEffect(() => {
    if (batchIdFromUrl && batches.length > 0) {
      fetchSelectedBatch(batchIdFromUrl);
    }
  }, [batchIdFromUrl, batches]);

  const fetchModules = async () => {
    try {
      let url = API_ENDPOINTS.MODULES.BASE;
      if (batchIdFromUrl) {
        url = API_ENDPOINTS.MODULES.BY_BATCH(batchIdFromUrl);
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setModules(data);
      } else {
        setError("Failed to fetch modules");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectedBatch = async (batchId: string) => {
    try {
      const response = await fetch(API_ENDPOINTS.BATCHES.BY_ID(batchId), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedBatch(data);
      }
    } catch (err) {
      console.error("Failed to fetch selected batch:", err);
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
      const url = editingModule
        ? API_ENDPOINTS.MODULES.BY_ID(editingModule.id)
        : API_ENDPOINTS.MODULES.BASE;

      const method = editingModule ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchModules();
        setShowModal(false);
        setEditingModule(null);
        setFormData({
          name: "",
          description: "",
          moduleOrder: 1,
          batchId: "",
          isActive: true,
        });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to save module");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  const handleEdit = (module: Module) => {
    setEditingModule(module);
    setFormData({
      name: module.name,
      description: module.description,
      moduleOrder: module.moduleOrder,
      batchId: module.batchId,
      isActive: module.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this module?")) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.MODULES.BY_ID(id), {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchModules();
      } else {
        setError("Failed to delete module");
      }
    } catch (err) {
      setError("Network error occurred");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingModule(null);
    setFormData({
      name: "",
      description: "",
      moduleOrder: 1,
      batchId: batchIdFromUrl || "",
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
      }

      return newFilters;
    });
  };

  // Filter modules based on search term and filters
  const filteredModules = modules.filter((module) => {
    const matchesSearch =
      module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilters = Object.entries(filters).every(([key, value]) => {
      if (!value) return true;

      switch (key) {
        case "status":
          return value === "active" ? module.isActive : !module.isActive;
        case "batch":
          return module.batchId === value;
        case "vertical":
          const batch = batches.find((b) => b.id === module.batchId);
          return batch?.verticalId === value;
        default:
          return true;
      }
    });

    return matchesSearch && matchesFilters;
  });

  const getBatchName = (batchId: string) => {
    const batch = batches.find((b) => b.id === batchId);
    return batch
      ? `${batch.vertical?.name || "Unknown"} - ${batch.name}`
      : "Unknown Batch";
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
        title={
          selectedBatch
            ? `${selectedBatch.vertical?.name || "Unknown"} - ${
                selectedBatch.name
              } - Modules`
            : "Modules Management"
        }
        subtitle={
          selectedBatch
            ? `Level 3: Modules in ${
                selectedBatch.vertical?.name || "Unknown"
              } - ${selectedBatch.name} batch`
            : "Level 3: Course modules within batches"
        }
        icon="Book"
        backLink="/admin"
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb Navigation */}
        <Breadcrumb />

        {/* Hierarchy Indicator */}
        <HierarchyIndicator
          level={3}
          title="Modules"
          parent="Batches"
          childrenText="Weeks"
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
            ...(selectedBatch
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
                ]),
          ]}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          placeholder="Search modules by name or description..."
          hierarchyContext={{
            level: 3,
            parentName: selectedBatch?.name,
          }}
        />

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Add New Module Button */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-sm font-medium text-gray-800 rounded-md hover:opacity-90 transition-opacity cursor-pointer"
            style={{ backgroundColor: "#ffdd3b" }}
            aria-label="Open modal to add new module"
          >
            + Add New Module
          </button>
        </div>

        {/* Modules Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {selectedBatch
                ? `${selectedBatch.vertical?.name || "Unknown"} - ${
                    selectedBatch.name
                  } Modules`
                : "All Modules"}
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
                ({filteredModules.length}{" "}
                {filteredModules.length === 1 ? "module" : "modules"})
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
                    Batch
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Module Number
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
                {filteredModules.map((module) => (
                  <tr
                    key={module.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {module.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {getBatchName(module.batchId)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {module.moduleOrder}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">
                        {module.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          module.isActive
                            ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                            : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                        }`}
                      >
                        {module.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {new Date(module.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {new Date(module.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        href={`/admin/weeks?moduleId=${module.id}`}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md mr-2 cursor-pointer"
                      >
                        View Weeks
                      </Link>
                      <button
                        onClick={() => handleEdit(module)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md mr-2 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(module.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm hover:shadow-md cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredModules.length === 0 && modules.length > 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  No modules match your search criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}

            {modules.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedBatch
                    ? `No modules found for ${
                        selectedBatch.vertical?.name || "Unknown"
                      } - ${
                        selectedBatch.name
                      }. Create your first module to get started.`
                    : "No modules found. Create your first module to get started."}
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
                {editingModule ? "Edit Module" : "Add New Module"}
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="module-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Name
                  </label>
                  <input
                    id="module-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                    aria-required="true"
                    aria-describedby="module-name-help"
                  />
                  <span id="module-name-help" className="sr-only">
                    Enter the module name
                  </span>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="module-batch"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Batch
                  </label>
                  <select
                    id="module-batch"
                    value={formData.batchId}
                    onChange={(e) =>
                      setFormData({ ...formData, batchId: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                    aria-required="true"
                    aria-describedby="module-batch-help"
                  >
                    <option value="">Select a batch</option>
                    {batches.map((batch) => (
                      <option key={batch.id} value={batch.id}>
                        {batch.vertical?.name || "Unknown"} - {batch.name}
                      </option>
                    ))}
                  </select>
                  <span id="module-batch-help" className="sr-only">
                    Select the batch for this module
                  </span>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="module-order"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Module Order
                  </label>
                  <input
                    id="module-order"
                    type="number"
                    min="1"
                    value={formData.moduleOrder}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        moduleOrder: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                    aria-required="true"
                    aria-describedby="module-order-help"
                  />
                  <span id="module-order-help" className="sr-only">
                    Enter the module order number
                  </span>
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="module-description"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Description
                  </label>
                  <textarea
                    id="module-description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                    required
                    aria-required="true"
                    aria-describedby="module-description-help"
                  />
                  <span id="module-description-help" className="sr-only">
                    Enter a description for the module
                  </span>
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
                        id="module-toggle"
                        aria-describedby="module-active-help"
                      />
                      <label
                        htmlFor="module-toggle"
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          formData.isActive ? "bg-green-400" : "bg-gray-300"
                        }`}
                      ></label>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formData.isActive
                      ? "Module is currently active"
                      : "Module is currently inactive"}
                  </p>
                  <span id="module-active-help" className="sr-only">
                    Toggle to make this module active or inactive
                  </span>
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
                    {editingModule ? "Update" : "Create"}
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
