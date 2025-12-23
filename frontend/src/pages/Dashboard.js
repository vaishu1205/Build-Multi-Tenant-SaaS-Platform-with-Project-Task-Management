import { useEffect, useState } from "react";
import { api } from "../api/client";
import { logout } from "../utils/auth";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [me, setMe] = useState(null);

  useEffect(() => {
    api("/auth/me")
      .then((res) => setMe(res.data))
      .catch(() => logout());
  }, []);

  if (!me) return null;

  return (
    <>
      <Navbar />
      <div style={{ padding: 32 }}>
        <h2>Dashboard</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginTop: 24,
          }}
        >
          <StatCard
            title="Total Projects"
            value={me.tenant?.stats?.totalProjects || 0}
          />
          <StatCard
            title="Total Tasks"
            value={me.tenant?.stats?.totalTasks || 0}
          />
          <StatCard
            title="Completed Tasks"
            value={me.tenant?.stats?.completedTasks || 0}
          />
        </div>

        <div style={{ marginTop: 40 }}>
          <h3>My Tasks</h3>
          <p style={{ color: "var(--muted)" }}>
            Assigned tasks will appear here
          </p>
        </div>
      </div>
    </>
  );
}
