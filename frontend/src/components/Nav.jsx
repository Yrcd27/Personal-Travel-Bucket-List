// src/components/Nav.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setToken } from "../lib/api";

function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

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
    navigate("/");
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("auth-change"));
  };

  return (
    <nav className="w-full border-b bg-white">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold">Travel Bucket List</Link>
        <div className="space-x-4">
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="text-sm text-blue-600">Dashboard</Link>
              <button 
                onClick={handleLogout}
                className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1.5 rounded"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-blue-600">Log in</Link>
              <Link to="/signup" className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Nav;
