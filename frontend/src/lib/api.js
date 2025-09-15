import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const api = axios.create({
  baseURL
});

export function setToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
  
  // Dispatch a custom event to notify components about authentication changes
  window.dispatchEvent(new Event("auth-change"));
}

const saved = localStorage.getItem("token");
if (saved) setToken(saved);
