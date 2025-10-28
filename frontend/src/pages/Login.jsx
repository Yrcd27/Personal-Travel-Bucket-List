import { useState } from "react";
import { api, setToken } from "../lib/api";
import { useNavigate, Link } from "react-router-dom";
import { Plane } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    
    if (!form.email.trim() || !form.password) {
      setError("Email and password are required");
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", form);
      setToken(data.token);
      nav("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
              <Plane className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue your journey</p>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition outline-none"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg px-4 py-3 font-semibold shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
