import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password, subdomain }),
      });

      const token = res.data?.token;
      if (!token) throw new Error("Login failed");

      localStorage.setItem("token", token);
      localStorage.setItem("tenantId", res.data.user.tenantId);

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid credentials");
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
      <div
        style={{
          width: 420,
          background: "var(--panel)",
          padding: 36,
          borderRadius: 10,
          border: "1px solid var(--border)",
        }}
      >
        <h2 style={{ marginBottom: 6 }}>Sign in</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 20 }}>
          Access your organization workspace
        </p>

        {error && (
          <div
            style={{
              background: "#1f2933",
              color: "#f87171",
              padding: 10,
              borderRadius: 6,
              marginBottom: 16,
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <input
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            placeholder="Tenant subdomain (e.g. demo)"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              marginTop: 16,
              padding: "10px 0",
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: 14,
            color: "var(--muted)",
          }}
        >
          New organization?{" "}
          <Link to="/register" style={{ color: "var(--primary)" }}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}
