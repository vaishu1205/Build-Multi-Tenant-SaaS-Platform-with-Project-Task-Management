const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

export async function api(path, options = {}) {
  const token = localStorage.getItem("token");

  
  const fullPath = path.startsWith("/api") ? path : `/api${path}`;

  const res = await fetch(`${API_BASE}${fullPath}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: options.body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }

  return res.json();
}
