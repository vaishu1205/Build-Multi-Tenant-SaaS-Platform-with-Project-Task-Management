import { useEffect, useState } from 'react';
import { api } from '../api/client';
import ProtectedRoute from '../auth/ProtectedRoute';

export default function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api('/auth/me').then(res => {
      if (res.data.role !== 'tenant_admin') {
        window.location.href = '/dashboard';
      }
    });

    api(`/tenants/${localStorage.getItem('tenantId')}/users`)
      .then(res => setUsers(res.data.users));
  }, []);

  return (
    <ProtectedRoute>
      <div style={{ padding: 32 }}>
        <h2>Users</h2>

        <table width="100%" style={{ marginTop: 24 }}>
          <thead>
            <tr style={{ color: 'var(--muted)' }}>
              <th align="left">Name</th>
              <th align="left">Email</th>
              <th align="left">Role</th>
              <th align="left">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>{u.fullName}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.isActive ? 'Active' : 'Inactive'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
}
