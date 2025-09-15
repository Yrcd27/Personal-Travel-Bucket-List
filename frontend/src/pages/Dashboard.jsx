import { useState, useEffect } from "react";
import { api } from "../lib/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-56px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10">
      <div className="bg-white shadow rounded-xl p-6">
        <div className="mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold">Welcome to your Dashboard, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">
            This is your personal travel bucket list dashboard. Here you can manage your dream destinations and track your travels.
          </p>
        </div>

        {/* Dashboard content sections */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h2 className="text-xl font-semibold mb-4">Your Travel Stats</h2>
            <div className="space-y-2">
              <p>🌍 Destinations on your list: 0</p>
              <p>✅ Places visited: 0</p>
              <p>🗓️ Member since: {new Date(user?.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-100">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-white border border-gray-300 shadow-sm rounded px-4 py-2 text-left hover:bg-gray-50">
                Add new destination
              </button>
              <button className="w-full bg-white border border-gray-300 shadow-sm rounded px-4 py-2 text-left hover:bg-gray-50">
                View your bucket list
              </button>
              <button className="w-full bg-white border border-gray-300 shadow-sm rounded px-4 py-2 text-left hover:bg-gray-50">
                Manage account settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}