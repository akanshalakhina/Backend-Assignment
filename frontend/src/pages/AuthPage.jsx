import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ mode }) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const isRegister = mode === 'register';

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister
        ? form
        : { email: form.email, password: form.password };
      const res = await client.post(endpoint, payload);
      login(res.data.data.token);
      setMessage(isRegister ? 'Registration successful' : 'Login successful');
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="card auth-card">
      <h1>{isRegister ? 'Create account' : 'Welcome back'}</h1>
      <p className="subtitle">
        {isRegister
          ? 'Register to access your secure task dashboard.'
          : 'Login with your credentials.'}
      </p>
      <form onSubmit={onSubmit} className="form-grid">
        {isRegister && (
          <input
            name="name"
            placeholder="Full name"
            value={form.name}
            onChange={onChange}
            required
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={onChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
        />
        <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <p>
        {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
        <Link to={isRegister ? '/login' : '/register'}>
          {isRegister ? 'Login' : 'Register'}
        </Link>
      </p>
    </div>
  );
}
