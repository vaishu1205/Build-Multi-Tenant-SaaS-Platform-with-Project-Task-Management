import { useState } from "react";
import { api } from "../api/client";

export default function Register() {
  const [form, setForm] = useState({
    tenantName: "",
    subdomain: "",
    adminEmail: "",
    adminFullName: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api("/auth/register-tenant", {
        method: "POST",
        body: JSON.stringify({
          tenantName: form.tenantName,
          subdomain: form.subdomain,
          adminEmail: form.adminEmail,
          adminPassword: form.password,
          adminFullName: form.adminFullName,
        }),
      });
      window.location.href = "/login";
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          width: 420,
          background: "var(--panel)",
          padding: 32,
          borderRadius: 10,
          border: "1px solid var(--border)",
        }}
      >
        <h2>Create Organization</h2>

        {error && <p style={{ color: "tomato", marginTop: 8 }}>{error}</p>}

        <input
          placeholder="Organization Name"
          required
          onChange={(e) => setForm({ ...form, tenantName: e.target.value })}
        />

        <input
          placeholder="Subdomain (e.g. acme)"
          required
          onChange={(e) =>
            setForm({ ...form, subdomain: e.target.value.toLowerCase() })
          }
        />
        <small style={{ color: "var(--muted)" }}>
          {form.subdomain && `${form.subdomain}.yourapp.com`}
        </small>

        <input
          placeholder="Admin Full Name"
          required
          onChange={(e) => setForm({ ...form, adminFullName: e.target.value })}
        />

        <input
          type="email"
          placeholder="Admin Email"
          required
          onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          required
          onChange={(e) =>
            setForm({ ...form, confirmPassword: e.target.value })
          }
        />

        <button disabled={loading} style={{ width: "100%", marginTop: 16 }}>
          {loading ? "Creating..." : "Register"}
        </button>

        <p style={{ marginTop: 16, fontSize: 13 }}>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
}
