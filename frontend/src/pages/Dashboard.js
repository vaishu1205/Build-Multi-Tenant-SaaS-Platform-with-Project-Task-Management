import { useEffect, useState } from "react";
import { api } from "../api/client";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api("/api/dashboard")
      .then((res) => {
        setStats(res.data.stats);
        setMyTasks(res.data.myTasks);
      })
      .catch(() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 32 }}>Loading dashboard…</div>;

  return (
    <>
      <Navbar />
      <div className="page" style={{ padding: 32 }}>
        <h2 style={{ marginBottom: 6 }}>Dashboard</h2>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>
          Overview of your workspace
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginTop: 28,
          }}
        >
          <StatCard title="Total Projects" value={stats.total_projects} />
          <StatCard title="Total Tasks" value={stats.total_tasks} />
          <StatCard title="Completed Tasks" value={stats.completed_tasks} />
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 style={{ marginBottom: 12 }}>My Tasks</h3>

          {myTasks.length === 0 && <p className="empty">No tasks assigned</p>}

          {myTasks.map((t) => (
            <div
              key={t.id}
              style={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
                padding: 16,
                borderRadius: 8,
                marginTop: 12,
              }}
            >
              <strong>{t.title}</strong>

              <div
                style={{
                  display: "flex",
                  gap: 20,
                  fontSize: 13,
                  color: "var(--muted)",
                  marginTop: 6,
                }}
              >
                <span>Project: {t.project_name}</span>
                <span>Status: {t.status}</span>
                <span>Priority: {t.priority}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
