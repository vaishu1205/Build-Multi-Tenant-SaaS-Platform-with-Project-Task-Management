import { useEffect, useState } from "react";
import { api } from "../api/client";
import ProtectedRoute from "../auth/ProtectedRoute";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/projects")
      .then((res) => setProjects(res.data.projects))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <ProtectedRoute>
      <div style={{ padding: 32 }}>
        <h2>Projects</h2>

        {projects.length === 0 && (
          <p style={{ color: "var(--muted)" }}>No projects found</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
            marginTop: 24,
          }}
        >
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => (window.location.href = `/projects/${p.id}`)}
              style={{
                background: "var(--panel)",
                padding: 20,
                borderRadius: 8,
                border: "1px solid var(--border)",
                cursor: "pointer",
              }}
            >
              <h3>{p.name}</h3>
              <p style={{ color: "var(--muted)" }}>
                {p.description || "No description"}
              </p>

              <span
                style={{
                  display: "inline-block",
                  marginTop: 12,
                  fontSize: 12,
                  color: "#22c55e",
                }}
              >
                {p.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
