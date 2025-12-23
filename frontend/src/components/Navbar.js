import { useEffect, useState } from "react";
import { api } from "../api/client";
import { logout } from "../utils/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api("/auth/me").then((res) => setUser(res.data));
  }, []);

  if (!user) return null;

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "16px 32px",
        background: "var(--panel)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <strong style={{ color: "var(--primary)" }}>Multi-Tenant SaaS</strong>

      <div style={{ display: "flex", gap: 20 }}>
        <a href="/dashboard">Dashboard</a>
        <a href="/projects">Projects</a>

        {user.role === "tenant_admin" && <a href="/users">Users</a>}

        {user.role === "super_admin" && <a href="/tenants">Tenants</a>}

        <span style={{ color: "var(--muted)" }}>{user.fullName}</span>

        <button onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
