"use client";

import React from "react";

export function AdminLogin({
  usernameInput,
  setUsernameInput,
  passwordInput,
  setPasswordInput,
  loginError,
  handleLogin,
  handleQuickLogin,
}) {
  return (
    <div className="admin-login-screen">
      <div className="admin-login-card">
        <div className="admin-login-logo">
          FLINT<span>SECTOR</span>
        </div>
        <div className="admin-login-subtitle">
          Operations & Control Portal
        </div>

        {loginError && <div className="admin-error-banner">{loginError}</div>}

        <form onSubmit={handleLogin}>
          <div className="admin-form-group">
            <label>Admin Username</label>
            <input
              type="text"
              className="admin-input"
              placeholder="admin"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Secret Password</label>
            <input
              type="password"
              className="admin-input"
              placeholder="••••••••••••"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="admin-login-btn">
            Authenticate
          </button>
        </form>

        <button
          type="button"
          className="admin-quick-fill-btn"
          onClick={handleQuickLogin}
        >
          ⚡ Quick Demo Login (admin / flintsector2025)
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;
