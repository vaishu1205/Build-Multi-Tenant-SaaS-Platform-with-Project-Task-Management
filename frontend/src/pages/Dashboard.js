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

        {/* STATS */}
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

        {/* MY TASKS */}
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

// import { useEffect, useState } from "react";
// import { api } from "../api/client";
// import Navbar from "../components/Navbar";
// import StatCard from "../components/StatCard";

// export default function Dashboard() {
//   const [stats, setStats] = useState(null);
//   const [myTasks, setMyTasks] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     api("/api/dashboard")
//       .then((res) => {
//         setStats(res.data.stats);
//         setMyTasks(res.data.myTasks);
//       })
//       .catch(() => {
//         localStorage.removeItem("token");
//         window.location.href = "/login";
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   if (loading) return <div style={{ padding: 32 }}>Loading dashboard…</div>;

//   return (
//     <>
//       <Navbar />
//       <div style={{ padding: 32 }}>
//         <h2>Dashboard</h2>

//         {/* STATS */}
//         <div
//           style={{
//             display: "grid",
//             gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
//             gap: 16,
//             marginTop: 24,
//           }}
//         >
//           <StatCard title="Total Projects" value={stats.total_projects} />
//           <StatCard title="Total Tasks" value={stats.total_tasks} />
//           <StatCard title="Completed Tasks" value={stats.completed_tasks} />
//         </div>

//         {/* MY TASKS */}
//         <div style={{ marginTop: 40 }}>
//           <h3>My Tasks</h3>

//           {myTasks.length === 0 && (
//             <p style={{ color: "gray" }}>No tasks assigned</p>
//           )}

//           {myTasks.map((t) => (
//             <div
//               key={t.id}
//               style={{
//                 background: "#020617",
//                 padding: 12,
//                 borderRadius: 6,
//                 marginTop: 12,
//               }}
//             >
//               <strong>{t.title}</strong>
//               <p style={{ fontSize: 12 }}>Project: {t.project_name}</p>
//               <p style={{ fontSize: 12 }}>Status: {t.status}</p>
//               <p style={{ fontSize: 12 }}>Priority: {t.priority}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

// // import { useEffect, useState } from "react";
// // import { api } from "../api/client";
// // import { logout } from "../utils/auth";
// // import Navbar from "../components/Navbar";
// // import StatCard from "../components/StatCard";

// // export default function Dashboard() {

// //   const [stats, setStats] = useState(null);
// //   const [myTasks, setMyTasks] = useState([]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     const loadDashboard = async () => {
// //       try {
// //         // 1️⃣ Logged in user
// //         const meRes = await api("/auth/me");
// //         setMe(meRes.data);

// //         // 2️⃣ Tenant stats
// //         const tenantRes = await api(`/api/tenants/${meRes.data.tenantId}`);
// //         setStats(tenantRes.data);

// //         // 3️⃣ My assigned tasks
// //         const tasksRes = await api("/api/tasks/my");
// //         setMyTasks(tasksRes.data.tasks);
// //       } catch (err) {
// //         console.error("Dashboard load failed", err);
// //         logout();
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     loadDashboard();
// //   }, []);

// //   if (loading) return <div style={{ padding: 32 }}>Loading dashboard…</div>;

// //   return (
// //     <>
// //       <Navbar />
// //       <div style={{ padding: 32 }}>
// //         <h2>Dashboard</h2>

// //         {/* STATS */}
// //         <div
// //           style={{
// //             display: "grid",
// //             gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
// //             gap: 16,
// //             marginTop: 24,
// //           }}
// //         >
// //           <StatCard title="Total Projects" value={stats.stats.total_projects} />
// //           <StatCard title="Total Tasks" value={stats.stats.total_tasks} />
// //           <StatCard
// //             title="Completed Tasks"
// //             value={stats.stats.completed_tasks}
// //           />
// //         </div>

// //         {/* MY TASKS */}
// //         <div style={{ marginTop: 40 }}>
// //           <h3>My Tasks</h3>

// //           {myTasks.length === 0 && (
// //             <p style={{ color: "var(--muted)" }}>No tasks assigned to you</p>
// //           )}

// //           {myTasks.map((t) => (
// //             <div
// //               key={t.id}
// //               style={{
// //                 background: "var(--panel)",
// //                 padding: 12,
// //                 borderRadius: 6,
// //                 marginTop: 10,
// //               }}
// //             >
// //               <strong>{t.title}</strong>
// //               <p style={{ fontSize: 12 }}>Project: {t.project_name}</p>
// //               <p style={{ fontSize: 12 }}>
// //                 Status: {t.status} | Priority: {t.priority}
// //               </p>
// //               {t.due_date && <p style={{ fontSize: 12 }}>Due: {t.due_date}</p>}
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// // import { useEffect, useState } from "react";
// // import { api } from "../api/client";
// // import { logout } from "../utils/auth";
// // import Navbar from "../components/Navbar";
// // import StatCard from "../components/StatCard";

// // export default function Dashboard() {
// //   const [me, setMe] = useState(null);

// //   useEffect(() => {
// //     console.log("Fetching user data...");
// //     api("/auth/me")
// //       .then((res) => {
// //         console.log("/auth/me response:", res);
// //         setMe(res.data || res);
// //       })
// //       .catch((err) => {
// //         console.error("Failed to fetch user:", err);
// //         logout();
// //       });
// //   }, []);

// //   if (!me) return <div style={{ padding: 32 }}>Loading...</div>;

// //   return (
// //     <>
// //       <Navbar />
// //       <div className="page" style={{ padding: 32 }}>
// //         <h2>Dashboard</h2>

// //         <div
// //           style={{
// //             display: "grid",
// //             gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
// //             gap: 16,
// //             marginTop: 24,
// //           }}
// //         >
// //           <StatCard
// //             title="Total Projects"
// //             value={me.tenant?.stats?.totalProjects || 0}
// //           />
// //           <StatCard
// //             title="Total Tasks"
// //             value={me.tenant?.stats?.totalTasks || 0}
// //           />
// //           <StatCard
// //             title="Completed Tasks"
// //             value={me.tenant?.stats?.completedTasks || 0}
// //           />
// //         </div>

// //         <div style={{ marginTop: 40 }}>
// //           <h3>My Tasks</h3>
// //           <p style={{ color: "var(--muted)" }}>
// //             Assigned tasks will appear here
// //           </p>
// //         </div>
// //       </div>
// //     </>
// //   );
// // }
