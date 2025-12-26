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
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 32px",
        background: "var(--panel)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {/* LEFT: Logo / Title */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "var(--primary)",
            letterSpacing: "0.3px",
          }}
        >
          Multi-Tenant SaaS
        </span>

        <div
          style={{
            width: 1,
            height: 20,
            background: "var(--border)",
          }}
        />
      </div>

      {/* CENTER: Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <a href="/dashboard">Dashboard</a>
        <a href="/projects">Projects</a>

        {user.role === "tenant_admin" && <a href="/users">Users</a>}
        {user.role === "super_admin" && <a href="/tenants">Tenants</a>}
      </div>

      {/* RIGHT: User Info */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            textAlign: "right",
            lineHeight: 1.2,
          }}
        >
          <div style={{ fontSize: 13, fontWeight: 500 }}>{user.full_name}</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>
            {user.role.replace("_", " ")}
          </div>
        </div>

        <button
          onClick={logout}
          style={{
            padding: "6px 12px",
            fontSize: 13,
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
