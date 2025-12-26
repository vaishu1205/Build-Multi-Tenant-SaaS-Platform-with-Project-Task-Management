import { useEffect, useState } from "react";
import { api } from "../api/client";
import Navbar from "../components/Navbar";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  const loadProjects = async () => {
    const res = await api("/api/projects");
    setProjects(res.data.projects);
  };

  useEffect(() => {
    const init = async () => {
      const meRes = await api("/auth/me");
      setMe(meRes.data);
      await loadProjects();
      setLoading(false);
    };
    init();
  }, []);

  const createProject = async () => {
    if (!name.trim()) return;

    setCreating(true);
    await api("/api/projects", {
      method: "POST",
      body: JSON.stringify({ name, description }),
    });

    setName("");
    setDescription("");
    setCreating(false);
    loadProjects();
  };

  const deleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    await api(`/api/projects/${id}`, { method: "DELETE" });
    loadProjects();
  };

  if (loading) return <p style={{ padding: 32 }}>Loading…</p>;

  return (
    <>
      <Navbar />
      <div className="page" style={{ padding: 32 }}>
        <h2>Projects</h2>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>
          Manage and track project progress
        </p>

        {me?.role === "tenant_admin" && (
          <div
            style={{
              marginTop: 24,
              maxWidth: 420,
              background: "var(--panel)",
              padding: 16,
              borderRadius: 8,
              border: "1px solid var(--border)",
            }}
          >
            <h4>Create Project</h4>
            <input
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button onClick={createProject} disabled={creating}>
              {creating ? "Creating…" : "Create Project"}
            </button>
          </div>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
            marginTop: 32,
          }}
        >
          {projects.map((p) => (
            <div
              key={p.id}
              onClick={() => (window.location.href = `/projects/${p.id}`)}
              style={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
                padding: 20,
                borderRadius: 10,
                cursor: "pointer",
              }}
            >
              <h3 style={{ marginBottom: 6 }}>{p.name}</h3>
              <p style={{ fontSize: 14, color: "var(--muted)" }}>
                {p.description || "No description"}
              </p>

              <span
                style={{
                  display: "inline-block",
                  marginTop: 10,
                  padding: "4px 10px",
                  fontSize: 12,
                  borderRadius: 12,
                  background:
                    p.status === "active"
                      ? "rgba(34,197,94,0.15)"
                      : "rgba(239,68,68,0.15)",
                  color: p.status === "active" ? "#22c55e" : "#ef4444",
                  fontWeight: 500,
                }}
              >
                {p.status}
              </span>

              {me?.role === "tenant_admin" && (
                <div style={{ marginTop: 14 }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(p.id);
                    }}
                    style={{
                      background: "#dc2626",
                      padding: "6px 12px",
                      fontSize: 13,
                    }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
