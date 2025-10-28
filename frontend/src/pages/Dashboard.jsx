import { useState, useEffect } from "react";
import { api } from "../lib/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, visited
  const [formData, setFormData] = useState({
    destination: "",
    country: "",
    notes: "",
    priority: "medium",
    visited: false
  });

  useEffect(() => {
    fetchUserData();
    loadDestinations();
  }, []);

  async function fetchUserData() {
    try {
      const { data } = await api.get("/api/auth/me");
      setUser(data.user);
    } catch (err) {
      setError("Failed to load user data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function loadDestinations() {
    // Simulate loading from localStorage (since backend doesn't have destinations API yet)
    const saved = localStorage.getItem("destinations");
    if (saved) {
      setDestinations(JSON.parse(saved));
    }
  }

  function saveDestinations(list) {
    localStorage.setItem("destinations", JSON.stringify(list));
    setDestinations(list);
  }

  function handleAddDestination() {
    if (!formData.destination.trim() || !formData.country.trim()) {
      alert("Please fill in destination and country");
      return;
    }

    if (editingId !== null) {
      // Update existing
      const updated = destinations.map((d) =>
        d.id === editingId ? { ...formData, id: editingId } : d
      );
      saveDestinations(updated);
      setEditingId(null);
    } else {
      // Add new
      const newDest = {
        ...formData,
        id: Date.now(),
        createdAt: new Date().toISOString()
      };
      saveDestinations([...destinations, newDest]);
    }

    setShowAddModal(false);
    resetForm();
  }

  function handleEdit(dest) {
    setFormData({
      destination: dest.destination,
      country: dest.country,
      notes: dest.notes || "",
      priority: dest.priority,
      visited: dest.visited
    });
    setEditingId(dest.id);
    setShowAddModal(true);
  }

  function handleDelete(id) {
    if (confirm("Are you sure you want to delete this destination?")) {
      saveDestinations(destinations.filter((d) => d.id !== id));
    }
  }

  function toggleVisited(id) {
    const updated = destinations.map((d) =>
      d.id === id ? { ...d, visited: !d.visited } : d
    );
    saveDestinations(updated);
  }

  function resetForm() {
    setFormData({
      destination: "",
      country: "",
      notes: "",
      priority: "medium",
      visited: false
    });
    setEditingId(null);
  }

  const filteredDestinations = destinations.filter((d) => {
    const matchesSearch =
      d.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "visited" && d.visited) ||
      (filterStatus === "pending" && !d.visited);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: destinations.length,
    visited: destinations.filter((d) => d.visited).length,
    pending: destinations.filter((d) => !d.visited).length
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-56px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 mt-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 pt-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! ✈️
          </h1>
          <p className="text-gray-600 text-lg">
            Your personal travel bucket list dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">Total Destinations</p>
                <p className="text-4xl font-bold">{stats.total}</p>
              </div>
              <div className="text-5xl opacity-80">🗺️</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 mb-1">Visited</p>
                <p className="text-4xl font-bold">{stats.visited}</p>
              </div>
              <div className="text-5xl opacity-80">✅</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 mb-1">Pending</p>
                <p className="text-4xl font-bold">{stats.pending}</p>
              </div>
              <div className="text-5xl opacity-80">⏳</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <input
                type="text"
                placeholder="Search destinations or countries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStatus("pending")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === "pending"
                    ? "bg-amber-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilterStatus("visited")}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filterStatus === "visited"
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Visited
              </button>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 w-full md:w-auto"
            >
              + Add Destination
            </button>
          </div>
        </div>

        {/* Destinations Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">🌍</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No destinations yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start building your travel bucket list by adding your dream destinations!
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Add Your First Destination
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 ${
                  dest.visited ? "border-emerald-200" : "border-transparent"
                }`}
              >
                <div
                  className={`h-2 ${
                    dest.priority === "high"
                      ? "bg-red-500"
                      : dest.priority === "medium"
                      ? "bg-amber-500"
                      : "bg-blue-500"
                  }`}
                ></div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {dest.destination}
                      </h3>
                      <p className="text-gray-600 flex items-center gap-1">
                        <span>📍</span> {dest.country}
                      </p>
                    </div>
                    {dest.visited && (
                      <span className="text-2xl">✅</span>
                    )}
                  </div>

                  {dest.notes && (
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                      {dest.notes}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        dest.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : dest.priority === "medium"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {dest.priority.toUpperCase()} PRIORITY
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleVisited(dest.id)}
                      className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                        dest.visited
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      }`}
                    >
                      {dest.visited ? "Unmark" : "Mark Visited"}
                    </button>
                    <button
                      onClick={() => handleEdit(dest)}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(dest.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-scale-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingId ? "Edit Destination" : "Add New Destination"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Destination *
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  placeholder="e.g., Jaisalmer Fort"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  placeholder="e.g., India"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) =>
                    setFormData({ ...formData, priority: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Add notes, reasons to visit, or reminders..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="visited"
                  checked={formData.visited}
                  onChange={(e) =>
                    setFormData({ ...formData, visited: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="visited" className="text-sm font-medium text-gray-700">
                  Already visited
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddDestination}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition"
                >
                  {editingId ? "Update" : "Add"} Destination
                </button>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}