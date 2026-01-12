import React, { useState } from 'react';
import './Login.css';
import { registerUser } from '../services/api';

const SignUp = ({ onNavigate, onSignUp }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    (async () => {
      try {
        const payload = { name: formData.name, email: formData.email, password: formData.password };
        const result = await registerUser(payload);
        if (result && result.success) {
          // server returns userId and name
          if (onSignUp) onSignUp({ name: result.name, id: result.userId, email: formData.email });
        } else {
          alert(result.error || 'Sign up failed');
        }
      } catch (err) {
        console.error('Sign up error', err);
        const msg = err && (err.message || (err.response && JSON.stringify(err.response))) || 'Sign up failed';
        alert(msg);
      }
    })();
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>Create Account</h1>
          <p>Sign up to get started</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
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
              placeholder="Create a password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full">
            Sign Up
          </button>
          <div className="login-footer">
            <p>Already have an account?</p>
            <button
              type="button"
              className="btn-link"
              onClick={() => onNavigate('login')}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
