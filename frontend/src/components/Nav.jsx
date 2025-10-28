// src/components/Nav.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { setToken } from "../lib/api";
import { Plane, LayoutDashboard } from "lucide-react";

function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    // Setup event listener for storage changes
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Custom event for auth state changes within the same window
    const handleAuthChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };
    
    window.addEventListener("auth-change", handleAuthChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    navigate("/");
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("auth-change"));
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition"
          >
            <Plane className="w-6 h-6" />
            <span className="hidden sm:inline">Travel Bucket List</span>
            <span className="sm:hidden">TBL</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                    isActive("/dashboard")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    isActive("/login")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Log in
                </Link>
                <Link 
                  to="/signup" 
                  className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t pt-4">
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                    isActive("/dashboard")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                    isActive("/login")
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold shadow-md"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Nav;
