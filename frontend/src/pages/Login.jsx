import { useState } from "react";
import { api, setToken } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!form.email.trim() || !form.password) {
      setError("Email and password are required");
      return;
    }
    try {
      const { data } = await api.post("/api/auth/login", form);
      setToken(data.token);
      nav("/dashboard");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold">Log in</h2>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input
          className="w-full border rounded px-3 py-2"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="w-full border rounded px-3 py-2"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button className="w-full bg-blue-600 text-white rounded px-3 py-2">
          Log in
        </button>
      </form>
      {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
    </div>
  );
}
