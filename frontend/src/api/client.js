// const API_URL = process.env.REACT_APP_API_URL;

// export const api = async (path, options = {}) => {
//   const token = localStorage.getItem('token');

//   const res = await fetch(`${API_URL}${path}`, {
//     ...options,
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token ? { Authorization: `Bearer ${token}` } : {})
//     }
//   });

//   const data = await res.json();
//   if (!res.ok) throw data;
//   return data;
// };
const API_URL = "http://localhost:5000";

export const api = async (path, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  const data = await res.json();
  if (!res.ok) throw data;
  return data;
};
