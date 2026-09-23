import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../services/api';

export default function AuthModal({
  isOpen,
  initialMode = 'login', // 'login' | 'register'
  onClose,
  onLogin,
  onRegister,
  onTriggerToast
}) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSuccessNotice, setRegSuccessNotice] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setRegSuccessNotice(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      onTriggerToast('Please enter both email and password', 'alert');
      return;
    }

    if (mode === 'register') {
      if (!name) {
        onTriggerToast('Please enter your full name', 'alert');
        return;
      }
      if (password !== confirmPassword) {
        onTriggerToast('Passwords do not match', 'alert');
        return;
      }
      if (password.length < 6) {
        onTriggerToast('Password must be at least 6 characters long', 'alert');
        return;
      }

      setIsSubmitting(true);
      try {
        const data = await api.register({ name, email, password, confirmPassword });
        if (data.success) {
          // Requirement #2:
          // Registration successful -> Account created -> Login
          setRegSuccessNotice(true);
          onTriggerToast('Registration successful! Account created.', 'check');
          // Switch to login tab and prefill email
          setMode('login');
          setPassword('');
          setConfirmPassword('');
        }
      } catch (err) {
        onTriggerToast(err.message || 'Registration failed', 'alert');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Login
      setIsSubmitting(true);
      try {
        const data = await api.login({ email, password });
        if (data.success) {
          onTriggerToast(`Signed in as ${data.user.name}`, 'welcome');
          onLogin(data.user);
          onClose();
        }
      } catch (err) {
        onTriggerToast(err.message || 'Invalid email or password', 'alert');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-title-box">
            <span className="brand-dot" />
            <h3>{mode === 'login' ? 'Sign In to Ghost AI' : 'Create New Account'}</h3>
          </div>
          <button className="btn-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Success Flow Notification (Requirement #2) */}
        {regSuccessNotice && (
          <div className="success-banner">
            <span className="banner-icon">✓</span>
            <div>
              <strong>Account Created Successfully!</strong>
              <p>Your account has been created with 0 minutes. Please sign in to access your dashboard.</p>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="mode-tabs">
          <button
            type="button"
            className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
            onClick={() => {
              setMode('login');
              setRegSuccessNotice(false);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
            onClick={() => {
              setMode('register');
              setRegSuccessNotice(false);
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                id="reg-name-input"
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              id="auth-email-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              id="auth-password-input"
            />
          </div>

          {mode === 'register' && (
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                id="reg-confirm-password-input"
              />
            </div>
          )}

          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitting}
            id="auth-submit-btn"
          >
            {isSubmitting
              ? 'Authenticating...'
              : mode === 'login'
              ? 'Sign In to Dashboard →'
              : 'Create Account'}
          </button>
        </form>

        <div className="modal-footer-text">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                className="link-switch"
                onClick={() => setMode('register')}
              >
                Register here
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                className="link-switch"
                onClick={() => setMode('login')}
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </ModalCard>
    </ModalBackdrop>
  );
}

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
`;

const ModalCard = styled.div`
  background: var(--surface, #0e1422);
  border: 1px solid var(--border2, #2d3c58);
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  padding: 28px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .header-title-box {
      display: flex;
      align-items: center;
      gap: 10px;

      .brand-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 8px #10b981;
      }

      h3 {
        font-size: 18px;
        font-weight: 800;
        color: var(--text-bright, #f8fafc);
        margin: 0;
      }
    }

    .btn-close {
      background: transparent;
      border: none;
      color: var(--text-muted, #64748b);
      font-size: 16px;
      cursor: pointer;
      padding: 4px;
      line-height: 1;

      &:hover {
        color: var(--text-bright, #f8fafc);
      }
    }
  }

  .success-banner {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    background: rgba(16, 185, 129, 0.12);
    border: 1px solid rgba(16, 185, 129, 0.35);
    border-radius: 8px;
    padding: 10px 12px;
    margin-bottom: 18px;
    font-size: 12px;
    color: var(--text, #cbd5e1);

    .banner-icon {
      color: #10b981;
      font-weight: 900;
      font-size: 14px;
    }

    strong {
      color: #10b981;
      display: block;
      margin-bottom: 2px;
    }

    p {
      margin: 0;
      color: var(--text-muted, #94a3b8);
      line-height: 1.4;
    }
  }

  .mode-tabs {
    display: flex;
    background: var(--surface2, #151c2e);
    border: 1px solid var(--border, #1e293d);
    border-radius: 8px;
    padding: 4px;
    margin-bottom: 20px;

    .tab-btn {
      flex: 1;
      padding: 8px;
      border-radius: 6px;
      background: transparent;
      border: none;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted, #94a3b8);
      cursor: pointer;
      transition: all 0.2s;

      &.active {
        background: var(--surface, #0e1422);
        color: var(--text-bright, #f8fafc);
        font-weight: 700;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
      }
    }
  }

  .auth-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;

    label {
      font-size: 12px;
      font-weight: 700;
      color: var(--text-muted, #94a3b8);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    input {
      padding: 10px 14px;
      background: var(--surface2, #151c2e);
      border: 1px solid var(--border, #1e293d);
      border-radius: 8px;
      color: var(--text-bright, #f8fafc);
      font-size: 14px;
      outline: none;
      transition: border-color 0.2s;

      &:focus {
        border-color: #10b981;
      }

      &::placeholder {
        color: var(--text-muted, #64748b);
      }
    }
  }

  .btn-submit {
    margin-top: 6px;
    padding: 12px;
    border-radius: 8px;
    background: #10b981;
    color: #ffffff;
    font-size: 14px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);

    &:hover {
      background: #059669;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .modal-footer-text {
    text-align: center;
    margin-top: 18px;
    font-size: 13px;
    color: var(--text-muted, #94a3b8);

    .link-switch {
      background: transparent;
      border: none;
      color: #10b981;
      font-weight: 700;
      cursor: pointer;
      padding: 0;
      font-size: 13px;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;
