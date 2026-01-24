import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { Plane, MapPin, CheckCircle2, Clock, Plus, Search, Edit2, Trash2, X } from "lucide-react";
import ConfirmationModal from "../components/ConfirmationModal";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, destination: '' });
  const [visitedModal, setVisitedModal] = useState({ show: false, id: null, destination: '', visited: false });
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

  async function loadDestinations() {
    try {
      const { data } = await api.get("/api/destinations");
      setDestinations(data.destinations);
    } catch (err) {
      console.error("Failed to load destinations:", err);
      setError("Failed to load destinations");
    }
  }

  async function handleAddDestination() {
    if (!formData.destination.trim() || !formData.country.trim()) {
      alert("Please fill in destination and country");
      return;
    }

    try {
      if (editingId !== null) {
        // Update existing
        const { data } = await api.put(`/api/destinations/${editingId}`, formData);
        setDestinations(destinations.map((d) =>
          d.id === editingId ? data.destination : d
        ));
        setEditingId(null);
      } else {
        // Add new
        const { data } = await api.post("/api/destinations", formData);
        setDestinations([data.destination, ...destinations]);
      }

      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error("Failed to save destination:", err);
      alert("Failed to save destination. Please try again.");
    }
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

  async function handleDelete(id) {
    try {
      await api.delete(`/api/destinations/${id}`);
      setDestinations(destinations.filter((d) => d.id !== id));
      setDeleteModal({ show: false, id: null, destination: '' });
    } catch (err) {
      console.error("Failed to delete destination:", err);
      alert("Failed to delete destination. Please try again.");
    }
  }

  function showDeleteConfirmation(dest) {
    setDeleteModal({ show: true, id: dest.id, destination: dest.destination });
  }

  async function toggleVisited(id) {
    try {
      const { data } = await api.patch(`/api/destinations/${id}/visited`);
      setDestinations(destinations.map((d) =>
        d.id === id ? data.destination : d
      ));
      setVisitedModal({ show: false, id: null, destination: '', visited: false });
    } catch (err) {
      console.error("Failed to update destination:", err);
      alert("Failed to update destination. Please try again.");
    }
  }

  function showVisitedConfirmation(dest) {
    setVisitedModal({ show: true, id: dest.id, destination: dest.destination, visited: dest.visited });
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
    <div className="min-h-[calc(100vh-56px)] bg-linear-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto p-6 pt-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600 text-lg">
            Your personal travel bucket list dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-1">Total Destinations</p>
                <p className="text-4xl font-bold">{stats.total}</p>
              </div>
              <MapPin className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="bg-linear-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 mb-1">Visited</p>
                <p className="text-4xl font-bold">{stats.visited}</p>
              </div>
              <CheckCircle2 className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="bg-linear-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 mb-1">Pending</p>
                <p className="text-4xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="w-12 h-12 opacity-80" />
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
              className="bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 w-full md:w-auto flex items-center gap-2 justify-center"
            >
              <Plus className="w-5 h-5" />
              Add Destination
            </button>
          </div>
        </div>

        {/* Destinations Grid */}
        {filteredDestinations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <Plane className="w-24 h-24 mx-auto mb-4 text-gray-400" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No destinations yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start building your travel bucket list by adding your dream destinations!
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
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
                        <MapPin className="w-4 h-4" /> {dest.country}
                      </p>
                    </div>
                    {dest.visited && (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
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
                      onClick={() => showVisitedConfirmation(dest)}
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
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => showDeleteConfirmation(dest)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
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
                  className="flex-1 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition"
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
      
      <ConfirmationModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, id: null, destination: '' })}
        onConfirm={() => handleDelete(deleteModal.id)}
        title="Delete Destination"
        message={`Are you sure you want to delete "${deleteModal.destination}"? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
      
      <ConfirmationModal
        isOpen={visitedModal.show}
        onClose={() => setVisitedModal({ show: false, id: null, destination: '', visited: false })}
        onConfirm={() => toggleVisited(visitedModal.id)}
        title={visitedModal.visited ? "Unmark as Visited" : "Mark as Visited"}
        message={`Are you sure you want to ${visitedModal.visited ? 'unmark' : 'mark'} "${visitedModal.destination}" as ${visitedModal.visited ? 'not visited' : 'visited'}?`}
        confirmText={visitedModal.visited ? "Unmark" : "Mark Visited"}
        type="info"
      />
    </div>
  );
}