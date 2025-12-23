import { useEffect, useState } from "react";
import { api } from "../api/client";
import { logout } from "../utils/auth";
import Navbar from "../components/Navbar";

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
        <header style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Dashboard</h2>
          <button onClick={logout}>Logout</button>
        </header>

        <div style={{ marginTop: 24 }}>
          <h3>Welcome, {me.fullName}</h3>
          <p>Role: {me.role}</p>
          <p>Tenant: {me.tenant?.name}</p>
          <p>Plan: {me.tenant?.subscriptionPlan}</p>
        </div>
      </div>
    </>
  );
}
