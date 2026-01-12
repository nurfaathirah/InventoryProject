import React, { useState } from 'react';
import './Login.css';
import { loginUser } from '../services/api';

const Login = ({ onNavigate, onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call server API
    (async () => {
      try {
        const result = await loginUser(formData);
        if (result && result.success && result.user) {
          if (onLogin) onLogin(result.user);
        } else {
          alert(result.error || 'Invalid credentials');
        }
      } catch (err) {
        console.error('Login error', err);
        const msg = err && (err.message || (err.response && JSON.stringify(err.response))) || 'Login failed';
        alert(msg);
      }
    })();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Welcome Back</h1>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full">
            Login
          </button>
          <div className="login-footer">
            <p>Don't have an account?</p>
            <button
              type="button"
              className="btn-link"
              onClick={() => onNavigate('signup')}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
