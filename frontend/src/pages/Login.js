import { useState } from 'react';
import { api } from '../api/client';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '', subdomain: '' });
  const [error, setError] = useState('');

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          tenantSubdomain: form.subdomain
        })
      });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', background: 'var(--panel)', padding: 32 }}>
      <h2>Sign in</h2>
      {error && <p style={{ color: 'tomato' }}>{error}</p>}
      <form onSubmit={submit}>
        <input placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
        <input placeholder="Tenant Subdomain" onChange={e => setForm({ ...form, subdomain: e.target.value })} />
        <button>Login</button>
      </form>
    </div>
  );
}
