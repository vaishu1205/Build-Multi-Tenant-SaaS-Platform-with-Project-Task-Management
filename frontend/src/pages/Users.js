// // import { useEffect, useState } from "react";
// // import { api } from "../api/client";
// // import Navbar from "../components/Navbar";

// // export default function Users() {
// //   const [users, setUsers] = useState([]);
// //   const [email, setEmail] = useState("");
// //   const [fullName, setFullName] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [role, setRole] = useState("user");

// //   const tenantId = localStorage.getItem("tenantId");

// //   const loadUsers = async () => {
// //     const res = await api(`/api/tenants/${tenantId}/users`);
// //     setUsers(res.data.users);
// //   };

// //   useEffect(() => {
// //     api("/auth/me").then((res) => {
// //       if (res.data.role !== "tenant_admin") {
// //         window.location.href = "/dashboard";
// //       }
// //     });

// //     loadUsers();
// //   }, []);

// //   const addUser = async () => {
// //     await api(`/api/tenants/${tenantId}/users`, {
// //       method: "POST",
// //       body: JSON.stringify({
// //         email,
// //         password,
// //         fullName,
// //         role,
// //       }),
// //     });

// //     setEmail("");
// //     setPassword("");
// //     setFullName("");
// //     setRole("user");

// //     loadUsers();
// //   };

// //   const deleteUser = async (userId) => {
// //     await api(`/api/users/${userId}`, {
// //       method: "DELETE",
// //     });

// //     loadUsers();
// //   };

// //   return (
// //     <>
// //       <Navbar />
// //       <div style={{ padding: 32 }}>
// //         <h2>Users</h2>

// //         {/* ADD USER */}
// //         <h3>Add User</h3>

// //         <input
// //           placeholder="Full Name"
// //           value={fullName}
// //           onChange={(e) => setFullName(e.target.value)}
// //         />

// //         <input
// //           placeholder="Email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //         />

// //         <input
// //           placeholder="Password"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //         />

// //         <select value={role} onChange={(e) => setRole(e.target.value)}>
// //           <option value="user">User</option>
// //           <option value="tenant_admin">Tenant Admin</option>
// //         </select>

// //         <button onClick={addUser}>Add User</button>

// //         {/* USERS LIST */}
// //         <table width="100%" style={{ marginTop: 24 }}>
// //           <thead>
// //             <tr>
// //               <th>Name</th>
// //               <th>Email</th>
// //               <th>Role</th>
// //               <th>Status</th>
// //               <th>Action</th>
// //             </tr>
// //           </thead>

// //           <tbody>
// //             {users.map((u) => (
// //               <tr key={u.id}>
// //                 {/* 👇 FIXED HERE */}
// //                 <td>{u.full_name}</td>
// //                 <td>{u.email}</td>
// //                 <td>{u.role}</td>
// //                 <td>{u.is_active ? "Active" : "Inactive"}</td>
// //                 <td>
// //                   <button onClick={() => deleteUser(u.id)}>Delete</button>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </>
// //   );
// // }

// // // import { useEffect, useState } from "react";
// // // import { api } from "../api/client";
// // // import Navbar from "../components/Navbar";

// // // export default function Users() {
// // //   const [users, setUsers] = useState([]);
// // //   const [email, setEmail] = useState("");
// // //   const [fullName, setFullName] = useState("");
// // //   const [password, setPassword] = useState("");
// // //   const [role, setRole] = useState("user");
// // //   const tenantId = localStorage.getItem("tenantId");

// // //   const loadUsers = () => {
// // //     api(`/api/tenants/${tenantId}/users`).then((res) => {
// // //       setUsers(res.data.users);
// // //     });
// // //   };

// // //   useEffect(() => {
// // //     api("/auth/me").then((res) => {
// // //       if (res.data.role !== "tenant_admin") {
// // //         window.location.href = "/dashboard";
// // //       }
// // //     });

// // //     loadUsers();
// // //   }, []);

// // //   const addUser = async () => {
// // //     await api(`/api/tenants/${tenantId}/users`, {
// // //       method: "POST",
// // //       body: JSON.stringify({
// // //         email,
// // //         password,
// // //         fullName,
// // //         role,
// // //       }),
// // //     });

// // //     setEmail("");
// // //     setPassword("");
// // //     setFullName("");
// // //     loadUsers();
// // //   };

// // //   const deleteUser = async (userId) => {
// // //     await api(`/api/users/${userId}`, {
// // //       method: "DELETE",
// // //     });
// // //     loadUsers();
// // //   };

// // //   return (
// // //     <>
// // //       <Navbar />
// // //       <div style={{ padding: 32 }}>
// // //         <h2>Users</h2>

// // //         {/* ADD USER */}
// // //         <h3>Add User</h3>
// // //         <input
// // //           placeholder="Name"
// // //           value={fullName}
// // //           onChange={(e) => setFullName(e.target.value)}
// // //         />
// // //         <input
// // //           placeholder="Email"
// // //           value={email}
// // //           onChange={(e) => setEmail(e.target.value)}
// // //         />
// // //         <input
// // //           placeholder="Password"
// // //           value={password}
// // //           onChange={(e) => setPassword(e.target.value)}
// // //         />

// // //         <select value={role} onChange={(e) => setRole(e.target.value)}>
// // //           <option value="user">User</option>
// // //           <option value="tenant_admin">Tenant Admin</option>
// // //         </select>

// // //         <button onClick={addUser}>Add User</button>

// // //         {/* USERS LIST */}
// // //         <table width="100%" style={{ marginTop: 24 }}>
// // //           <thead>
// // //             <tr>
// // //               <th>Name</th>
// // //               <th>Email</th>
// // //               <th>Role</th>
// // //               <th>Action</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {users.map((u) => (
// // //               <tr key={u.id}>
// // //                 <td>{u.fullName}</td>
// // //                 <td>{u.email}</td>
// // //                 <td>{u.role}</td>
// // //                 <td>
// // //                   <button onClick={() => deleteUser(u.id)}>Delete</button>
// // //                 </td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </div>
// // //     </>
// // //   );
// // // }

// // // import { useEffect, useState } from "react";
// // // import { api } from "../api/client";
// // // import Navbar from "../components/Navbar";

// // // export default function Users() {
// // //   const [users, setUsers] = useState([]);

// // //   useEffect(() => {
// // //     // Role check
// // //     api("/auth/me").then((res) => {
// // //       if (res.data.role !== "tenant_admin") {
// // //         window.location.href = "/dashboard";
// // //       }
// // //     });

// // //     const tenantId = localStorage.getItem("tenantId");

// // //     api(`/api/tenants/${tenantId}/users`).then((res) => {
// // //       console.log("USERS API RESPONSE:", res); // 👈 IMPORTANT
// // //       setUsers(res.data.users); // ✅ CORRECT
// // //     });
// // //   }, []);

// // //   return (
// // //     <>
// // //       <Navbar />
// // //       <div style={{ padding: 32 }}>
// // //         <h2>Users</h2>

// // //         <table width="100%" style={{ marginTop: 24 }}>
// // //           <thead>
// // //             <tr>
// // //               <th align="left">Name</th>
// // //               <th align="left">Email</th>
// // //               <th align="left">Role</th>
// // //               <th align="left">Status</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {users.map((u) => (
// // //               <tr key={u.id}>
// // //                 <td>{u.fullName}</td>
// // //                 <td>{u.email}</td>
// // //                 <td>{u.role}</td>
// // //                 <td>{u.isActive ? "Active" : "Inactive"}</td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </div>
// // //     </>
// // //   );
// // // }

// // // import { useEffect, useState } from "react";
// // // import { api } from "../api/client";
// // // import Navbar from "../components/Navbar";

// // // export default function Users() {
// // //   const [users, setUsers] = useState([]);

// // //   useEffect(() => {
// // //     api("/auth/me").then((res) => {
// // //       if (res.data.role !== "tenant_admin") {
// // //         window.location.href = "/dashboard";
// // //       }
// // //     });

// // //     api(`/api/tenants/${localStorage.getItem("tenantId")}/users`).then((res) =>
// // //       setUsers(res.data.users)
// // //     );
// // //   }, []);

// // //   return (
// // //     <>
// // //       <Navbar />
// // //       <div className="page" style={{ padding: 32 }}>
// // //         <h2>Users</h2>

// // //         <table width="100%" style={{ marginTop: 24 }}>
// // //           <thead>
// // //             <tr style={{ color: "var(--muted)" }}>
// // //               <th align="left">Name</th>
// // //               <th align="left">Email</th>
// // //               <th align="left">Role</th>
// // //               <th align="left">Status</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {users.map((u) => (
// // //               <tr key={u.id}>
// // //                 <td>{u.fullName}</td>
// // //                 <td>{u.email}</td>
// // //                 <td>{u.role}</td>
// // //                 <td>{u.isActive ? "Active" : "Inactive"}</td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </div>
// // //     </>
// // //   );
// // // }

// // // import { useEffect, useState } from "react";
// // // import { api } from "../api/client";
// // // import Navbar from "../components/Navbar";

// // // export default function Users() {
// // //   const [users, setUsers] = useState([]);

// // //   useEffect(() => {
// // //     // Role check
// // //     api("/auth/me").then((res) => {
// // //       if (res.data.role !== "tenant_admin") {
// // //         window.location.href = "/dashboard";
// // //       }
// // //     });

// // //     const tenantId = localStorage.getItem("tenantId");

// // //     api(`/api/tenants/${tenantId}/users`).then((res) => {
// // //       setUsers(res.data.users);
// // //     });
// // //   }, []);

// // //   return (
// // //     <>
// // //       <Navbar />
// // //       <div style={{ padding: 32 }}>
// // //         <h2>Users</h2>

// // //         <table width="100%" style={{ marginTop: 24 }}>
// // //           <thead>
// // //             <tr>
// // //               <th align="left">Name</th>
// // //               <th align="left">Email</th>
// // //               <th align="left">Role</th>
// // //               <th align="left">Status</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {users.map((u) => (
// // //               <tr key={u.id}>
// // //                 <td>{u.fullName}</td>
// // //                 <td>{u.email}</td>
// // //                 <td>{u.role}</td>
// // //                 <td>{u.isActive ? "Active" : "Inactive"}</td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </div>
// // //     </>
// // //   );
// // // }

// import { useEffect, useState, useCallback } from "react";
// import { api } from "../api/client";
// import Navbar from "../components/Navbar";

// export default function Users() {
//   const [users, setUsers] = useState([]);
//   const [email, setEmail] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [password, setPassword] = useState("");
//   const [role, setRole] = useState("user");

//   const tenantId = localStorage.getItem("tenantId");

//   const loadUsers = useCallback(async () => {
//     const res = await api(`/api/tenants/${tenantId}/users`);
//     setUsers(res.data.users);
//   }, [tenantId]);

//   useEffect(() => {
//     api("/auth/me").then((res) => {
//       if (res.data.role !== "tenant_admin") {
//         window.location.href = "/dashboard";
//       }
//     });

//     loadUsers();
//   }, [loadUsers]);

//   const addUser = async () => {
//     await api(`/api/tenants/${tenantId}/users`, {
//       method: "POST",
//       body: JSON.stringify({
//         email,
//         password,
//         fullName,
//         role,
//       }),
//     });

//     setEmail("");
//     setPassword("");
//     setFullName("");
//     setRole("user");

//     loadUsers();
//   };

//   const deleteUser = async (userId) => {
//     await api(`/api/users/${userId}`, {
//       method: "DELETE",
//     });
//     loadUsers();
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={{ padding: 32 }}>
//         <h2>Users</h2>

//         <h3>Add User</h3>
//         <input
//           placeholder="Full Name"
//           value={fullName}
//           onChange={(e) => setFullName(e.target.value)}
//         />
//         <input
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />

//         <select value={role} onChange={(e) => setRole(e.target.value)}>
//           <option value="user">User</option>
//           <option value="tenant_admin">Tenant Admin</option>
//         </select>

//         <button onClick={addUser}>Add User</button>

//         <table width="100%" style={{ marginTop: 24 }}>
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Email</th>
//               <th>Role</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {users.map((u) => (
//               <tr key={u.id}>
//                 <td>{u.full_name}</td>
//                 <td>{u.email}</td>
//                 <td>{u.role}</td>
//                 <td>{u.is_active ? "Active" : "Inactive"}</td>
//                 <td>
//                   <button onClick={() => deleteUser(u.id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// }

import { useEffect, useState, useCallback } from "react";
import { api } from "../api/client";
import Navbar from "../components/Navbar";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const tenantId = localStorage.getItem("tenantId");

  const loadUsers = useCallback(async () => {
    const res = await api(`/api/tenants/${tenantId}/users`);
    setUsers(res.data.users);
  }, [tenantId]);

  useEffect(() => {
    api("/auth/me").then((res) => {
      if (res.data.role !== "tenant_admin") {
        window.location.href = "/dashboard";
      }
    });
    loadUsers();
  }, [loadUsers]);

  const addUser = async () => {
    await api(`/api/tenants/${tenantId}/users`, {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        fullName,
        role,
      }),
    });

    setEmail("");
    setPassword("");
    setFullName("");
    setRole("user");
    loadUsers();
  };

  const deleteUser = async (userId) => {
    await api(`/api/users/${userId}`, {
      method: "DELETE",
    });
    loadUsers();
  };

  return (
    <>
      <Navbar />
      <div className="page" style={{ padding: 32 }}>
        <h2 style={{ marginBottom: 6 }}>Users</h2>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>
          Manage users within your organization
        </p>

        {/* ADD USER CARD */}
        <div
          style={{
            marginTop: 24,
            maxWidth: 520,
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            padding: 20,
          }}
        >
          <h3 style={{ marginBottom: 12 }}>Add User</h3>

          <div style={{ display: "grid", gap: 12 }}>
            <input
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{
                padding: 10,
                background: "#020617",
                border: "1px solid var(--border)",
                color: "var(--text)",
                borderRadius: 6,
              }}
            >
              <option value="user">User</option>
              <option value="tenant_admin">Tenant Admin</option>
            </select>

            <button onClick={addUser} style={{ marginTop: 8 }}>
              Add User
            </button>
          </div>
        </div>

        {/* USERS TABLE */}
        <div
          style={{
            marginTop: 40,
            background: "var(--panel)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <table width="100%" style={{ borderCollapse: "collapse" }}>
            <thead style={{ background: "#020617" }}>
              <tr>
                <th style={th}>Name</th>
                <th style={th}>Email</th>
                <th style={th}>Role</th>
                <th style={th}>Status</th>
                <th style={th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: 20, textAlign: "center" }}>
                    <span className="empty">No users found</span>
                  </td>
                </tr>
              )}

              {users.map((u) => (
                <tr key={u.id} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={td}>{u.full_name}</td>
                  <td style={td}>{u.email}</td>
                  <td style={td}>{u.role}</td>
                  <td style={td}>{u.is_active ? "Active" : "Inactive"}</td>
                  <td style={td}>
                    <button
                      onClick={() => deleteUser(u.id)}
                      style={{
                        background: "#dc2626",
                        padding: "6px 10px",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

const th = {
  textAlign: "left",
  padding: "14px 16px",
  fontSize: 13,
  color: "var(--muted)",
  fontWeight: 500,
};

const td = {
  padding: "14px 16px",
  fontSize: 14,
};
