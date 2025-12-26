// // // import { useState } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import { api } from "../api/client";

// // // export default function Login() {
// // //   const navigate = useNavigate();

// // //   const [email, setEmail] = useState("");
// // //   const [password, setPassword] = useState("");
// // //   const [subdomain, setSubdomain] = useState("");
// // //   const [error, setError] = useState("");
// // //   const [loading, setLoading] = useState(false);

// // //   const submit = async (e) => {
// // //     e.preventDefault();
// // //     setError("");
// // //     setLoading(true);

// // //     console.log("Attempting login...");

// // //     try {
// // //       const res = await api("/auth/login", {
// // //         method: "POST",
// // //         body: JSON.stringify({
// // //           email,
// // //           password,
// // //           subdomain,
// // //         }),
// // //       });

// // //       const token = res.data?.token;

// // //       if (!token) {
// // //         throw new Error("No token received from server");
// // //       }

// // //       localStorage.setItem("token", token);
// // //       console.log("Token saved to localStorage");

// // //       console.log("Navigating to dashboard...");
// // //       navigate("/dashboard", { replace: true });
// // //     } catch (err) {
// // //       console.error("LOGIN FAILED:", err);
// // //       setError(err.message || "Login failed");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div style={{ maxWidth: 400, margin: "100px auto", padding: 32 }}>
// // //       <h2>Login</h2>

// // //       {error && (
// // //         <p
// // //           style={{
// // //             color: "red",
// // //             padding: "10px",
// // //             background: "#fee",
// // //             borderRadius: "4px",
// // //           }}
// // //         >
// // //           {error}
// // //         </p>
// // //       )}

// // //       <form onSubmit={submit}>
// // //         <input
// // //           placeholder="Email"
// // //           value={email}
// // //           onChange={(e) => setEmail(e.target.value)}
// // //           required
// // //           style={{
// // //             display: "block",
// // //             width: "100%",
// // //             marginBottom: 10,
// // //             padding: 8,
// // //           }}
// // //         />

// // //         <input
// // //           type="password"
// // //           placeholder="Password"
// // //           value={password}
// // //           onChange={(e) => setPassword(e.target.value)}
// // //           required
// // //           style={{
// // //             display: "block",
// // //             width: "100%",
// // //             marginBottom: 10,
// // //             padding: 8,
// // //           }}
// // //         />

// // //         <input
// // //           placeholder="Tenant Subdomain"
// // //           value={subdomain}
// // //           onChange={(e) => setSubdomain(e.target.value)}
// // //           required
// // //           style={{
// // //             display: "block",
// // //             width: "100%",
// // //             marginBottom: 10,
// // //             padding: 8,
// // //           }}
// // //         />

// // //         <button
// // //           type="submit"
// // //           disabled={loading}
// // //           style={{
// // //             display: "block",
// // //             width: "100%",
// // //             padding: 10,
// // //             cursor: loading ? "not-allowed" : "pointer",
// // //             opacity: loading ? 0.6 : 1,
// // //           }}
// // //         >
// // //           {loading ? "Logging in..." : "Login"}
// // //         </button>
// // //       </form>
// // //     </div>
// // //   );
// // // }
// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { api } from "../api/client";

// // export default function Login() {
// //   const navigate = useNavigate();

// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [subdomain, setSubdomain] = useState("");
// //   const [error, setError] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const submit = async (e) => {
// //     e.preventDefault();
// //     setError("");
// //     setLoading(true);

// //     try {
// //       const res = await api("/auth/login", {
// //         method: "POST",
// //         body: JSON.stringify({
// //           email,
// //           password,
// //           subdomain,
// //         }),
// //       });

// //       const { token, user } = res.data;

// //       // ✅ STORE REQUIRED VALUES
// //       localStorage.setItem("token", token);
// //       localStorage.setItem("tenantId", user.tenantId);
// //       localStorage.setItem("role", user.role);

// //       navigate("/dashboard", { replace: true });
// //     } catch (err) {
// //       setError(err.message || "Login failed");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div style={{ maxWidth: 400, margin: "100px auto", padding: 32 }}>
// //       <h2>Login</h2>

// //       {error && <p style={{ color: "red" }}>{error}</p>}

// //       <form onSubmit={submit}>
// //         <input
// //           placeholder="Email"
// //           value={email}
// //           onChange={(e) => setEmail(e.target.value)}
// //         />
// //         <input
// //           type="password"
// //           placeholder="Password"
// //           value={password}
// //           onChange={(e) => setPassword(e.target.value)}
// //         />
// //         <input
// //           placeholder="Tenant Subdomain"
// //           value={subdomain}
// //           onChange={(e) => setSubdomain(e.target.value)}
// //         />
// //         <button disabled={loading}>
// //           {loading ? "Logging in..." : "Login"}
// //         </button>
// //       </form>

// //     </div>
// //   );
// // }

// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { api } from "../api/client";

// export default function Login() {
//   const navigate = useNavigate();

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [subdomain, setSubdomain] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const submit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await api("/auth/login", {
//         method: "POST",
//         body: JSON.stringify({
//           email,
//           password,
//           subdomain,
//         }),
//       });

//       const token = res.data?.token;
//       if (!token) throw new Error("Login failed");

//       localStorage.setItem("token", token);
//       localStorage.setItem("tenantId", res.data.user.tenantId);

//       navigate("/dashboard");
//     } catch (err) {
//       setError(err.message || "Invalid credentials");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       style={{
//         maxWidth: 420,
//         margin: "100px auto",
//         padding: 32,
//         background: "var(--panel)",
//         borderRadius: 8,
//         border: "1px solid var(--border)",
//       }}
//     >
//       <h2 style={{ marginBottom: 16 }}>Login</h2>

//       {error && (
//         <p
//           style={{
//             color: "red",
//             background: "#fee",
//             padding: 8,
//             borderRadius: 4,
//           }}
//         >
//           {error}
//         </p>
//       )}

//       <form onSubmit={submit}>
//         <input
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//           style={{ width: "100%", marginBottom: 10, padding: 8 }}
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           style={{ width: "100%", marginBottom: 10, padding: 8 }}
//         />

//         <input
//           placeholder="Tenant Subdomain (eg: demo)"
//           value={subdomain}
//           onChange={(e) => setSubdomain(e.target.value)}
//           required
//           style={{ width: "100%", marginBottom: 16, padding: 8 }}
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           style={{
//             width: "100%",
//             padding: 10,
//             cursor: loading ? "not-allowed" : "pointer",
//           }}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>

//       {/* 🔹 REGISTER LINK */}
//       <div style={{ marginTop: 20, textAlign: "center" }}>
//         <p style={{ fontSize: 14, color: "gray" }}>New company?</p>
//         <Link
//           to="/register"
//           style={{
//             display: "inline-block",
//             marginTop: 6,
//             color: "#38bdf8",
//             textDecoration: "underline",
//             fontSize: 14,
//           }}
//         >
//           Register your company
//         </Link>
//       </div>
//     </div>
//   );
// }

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
