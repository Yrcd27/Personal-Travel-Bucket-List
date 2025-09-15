import { useState } from "react";
import { api } from "../lib/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setOk(false);

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("All fields are required");
      return;
    }
    try {
      await api.post("/api/auth/signup", form);
      setOk(true);
      setTimeout(() => nav("/login"), 800);
    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-semibold">Create your account</h2>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
          Sign up
        </button>
      </form>
      {error && <p className="text-red-600 mt-3 text-sm">{error}</p>}
      {ok && <p className="text-green-600 mt-3 text-sm">Signup successful. Redirecting to login</p>}
    </div>
  );
}
