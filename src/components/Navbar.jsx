import React from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';
import { IconSun, IconMoon } from './Icons';

export default function Navbar({
  theme = 'dark',
  onToggleTheme,
  currentPage = 'home',
  onNavigate,
  activeUser,
  onOpenAuth,
  onLogout
}) {
  const isDark = theme === 'dark';

  const handleToggle = () => {
    playTechBeep('click');
    if (onToggleTheme) onToggleTheme();
  };

  const handleDownload = () => {
    playTechBeep('click');
    if (onNavigate) onNavigate('download');
  };

  // Helper to format seconds as HH:MM:SS
  const formatTime = (secs) => {
    const s = Math.max(0, Math.floor(secs || 0));
    const hours = Math.floor(s / 3600);
    const minutes = Math.floor((s % 3600) / 60);
    const seconds = s % 60;
    return [
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0')
    ].join(':');
  };

  return (
    <NavWrapper data-theme={theme}>
      <div className="nav-container">
        {/* Brand Logo */}
        <button
          className="brand-logo-btn"
          onClick={() => {
            playTechBeep('click');
            onNavigate('home');
          }}
          title="Ghost AI Home"
        >
          <div className="brand-aperture">
            <span className="aperture-core" />
          </div>
          <div className="brand-text-col">
            <span className="brand-title">GHOST<span className="brand-accent">AI</span></span>
          </div>
          <span className="stealth-pill">100% INVISIBLE</span>
        </button>

        {/* Old-Style Rounded Pill Nav Menu (Unwanted pages removed) */}
        <nav className="nav-pill-menu" aria-label="Primary Navigation">
          <button
            className={`nav-pill-btn ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => {
              playTechBeep('click');
              onNavigate('home');
            }}
          >
            Home
          </button>

          <button
            className={`nav-pill-btn ${currentPage === 'download' ? 'active' : ''}`}
            onClick={handleDownload}
            title="Download Windows Desktop Software"
          >
            Download Software
          </button>

          {activeUser && (
            <button
              className={`nav-pill-btn ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => {
                playTechBeep('click');
                onNavigate('dashboard');
              }}
            >
              Dashboard
            </button>
          )}

          {activeUser?.role === 'admin' && (
            <button
              className={`nav-pill-btn admin-pill-btn ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={() => {
                playTechBeep('click');
                onNavigate('admin');
              }}
            >
              Admin Portal
            </button>
          )}
        </nav>

        {/* Right Controls */}
        <div className="nav-actions">
          {/* Theme Toggle Button */}
          <button
            className="theme-toggle-btn"
            onClick={handleToggle}
            aria-label="Toggle dark/light theme"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <IconSun size={16} /> : <IconMoon size={16} />}
          </button>

          {/* User Auth / Status */}
          {activeUser ? (
            <div className="user-profile-badge">
              <button
                className="user-balance-pill"
                onClick={() => {
                  playTechBeep('click');
                  onNavigate('dashboard');
                }}
                title="View User Dashboard & Remaining Time"
              >
                <span className={`status-dot ${(activeUser.remaining_seconds || 0) > 0 ? 'online' : 'expired'}`} />
                <span className="balance-text">
                  {formatTime(activeUser.remaining_seconds || 0)}
                </span>
              </button>

              <button
                className="btn-signout"
                onClick={() => {
                  playTechBeep('click');
                  onLogout();
                }}
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-btn-group">
              <button
                className="btn-candidate-signin"
                onClick={() => {
                  playTechBeep('click');
                  onOpenAuth('login');
                }}
                id="nav-signin-btn"
              >
                Sign In
              </button>
              <button
                className="btn-candidate-register"
                onClick={() => {
                  playTechBeep('click');
                  onOpenAuth('register');
                }}
                id="nav-register-btn"
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </NavWrapper>
  );
}

const NavWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--nav-bg, rgba(10, 15, 29, 0.88));
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));

  .nav-container {
    max-width: 1360px;
    margin: 0 auto;
    padding: 12px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  .brand-logo-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
  }

  .brand-aperture {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 2px solid var(--emerald-neon, #52b788);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px var(--emerald-glow, rgba(82, 183, 136, 0.35));

    .aperture-core {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--emerald-neon, #52b788);
    }
  }

  .brand-title {
    font-size: 16px;
    font-weight: 900;
    color: var(--text-headline, #ffffff);
    letter-spacing: 0.08em;

    .brand-accent {
      color: var(--emerald-neon, #52b788);
    }
  }

  .stealth-pill {
    font-size: 9px;
    font-weight: 800;
    color: var(--emerald-neon, #52b788);
    background: rgba(82, 183, 136, 0.12);
    border: 1px solid rgba(82, 183, 136, 0.35);
    padding: 2px 7px;
    border-radius: 4px;
    letter-spacing: 0.05em;
  }

  /* Exact Pill Container from Screenshot */
  .nav-pill-menu {
    display: flex;
    align-items: center;
    gap: 6px;
    background: var(--nav-links-bg, rgba(241, 245, 249, 0.9));
    border: 1px solid var(--nav-border, rgba(0, 0, 0, 0.08));
    padding: 5px 8px;
    border-radius: 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);

    .nav-pill-btn {
      background: transparent;
      border: none;
      color: var(--nav-link-color, #475569);
      font-size: 13.5px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.18s ease;

      &:hover {
        color: var(--text-headline, #0f172a);
        background: var(--nav-link-hover-bg, rgba(5, 150, 105, 0.08));
      }

      &.active {
        color: var(--emerald-neon, #059669);
        background: rgba(16, 185, 129, 0.12);
        font-weight: 700;
      }

      &.admin-pill-btn {
        color: #7c3aed;
        &:hover {
          background: rgba(124, 58, 237, 0.08);
        }
        &.active {
          color: #7c3aed;
          background: rgba(124, 58, 237, 0.12);
        }
      }
    }
  }

  /* Dark mode specific adjustments for the pill */
  [data-theme="dark"] & .nav-pill-menu {
    background: rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.08);

    .nav-pill-btn {
      color: #94a3b8;

      &:hover {
        color: #f8fafc;
        background: rgba(255, 255, 255, 0.06);
      }

      &.active {
        color: #10b981;
        background: rgba(16, 185, 129, 0.15);
      }

      &.admin-pill-btn {
        color: #c084fc;
        &.active {
          background: rgba(168, 85, 247, 0.18);
        }
      }
    }
  }

  .nav-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .theme-toggle-btn {
    width: 34px;
    height: 34px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.1));
    color: var(--text-muted, #94a3b8);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: var(--text-headline, #ffffff);
      border-color: rgba(255, 255, 255, 0.25);
    }
  }

  .auth-btn-group {
    display: flex;
    align-items: center;
    gap: 8px;

    .btn-candidate-signin {
      background: transparent;
      border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.12));
      color: var(--text-headline, #ffffff);
      font-size: 13px;
      font-weight: 600;
      padding: 7px 14px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.08);
      }
    }

    .btn-candidate-register {
      background: var(--emerald-neon, #52b788);
      border: none;
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      padding: 7px 16px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #40916c;
      }
    }
  }

  .user-profile-badge {
    display: flex;
    align-items: center;
    gap: 8px;

    .user-balance-pill {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      background: rgba(82, 183, 136, 0.12);
      border: 1px solid rgba(82, 183, 136, 0.35);
      border-radius: 8px;
      padding: 6px 12px;
      cursor: pointer;
      color: var(--emerald-neon, #52b788);
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      font-weight: 700;

      .status-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;

        &.online {
          background: var(--emerald-neon, #52b788);
          box-shadow: 0 0 6px var(--emerald-neon, #52b788);
        }

        &.expired {
          background: #f43f5e;
        }
      }

      &:hover {
        border-color: var(--emerald-neon, #52b788);
      }
    }

    .btn-signout {
      background: transparent;
      border: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.12));
      color: var(--text-muted, #94a3b8);
      font-size: 12px;
      font-weight: 600;
      padding: 6px 10px;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        color: #f43f5e;
        border-color: rgba(244, 63, 94, 0.4);
      }
    }
  }

  @media (max-width: 820px) {
    .nav-pill-menu {
      display: none;
    }
  }
`;
