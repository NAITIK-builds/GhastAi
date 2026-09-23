import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

export default function UserDashboard({
  activeUser,
  onLogout,
  onTriggerToast,
  onNavigate
}) {
  const [userData, setUserData] = useState(activeUser);
  const [remainingSeconds, setRemainingSeconds] = useState(activeUser?.remaining_seconds || 0);
  const [softwareStatus, setSoftwareStatus] = useState('Available');
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Sync with server
  const fetchLatestStatus = async (silent = true) => {
    if (!activeUser?.id) return;
    if (!silent) setIsRefreshing(true);
    try {
      const res = await fetch(`/api/user-status?userId=${encodeURIComponent(activeUser.id)}`);
      if (res.ok) {
        const data = await res.json();
        setUserData((prev) => ({ ...prev, ...data }));
        setRemainingSeconds(data.remaining_seconds || 0);
        setSoftwareStatus(data.software_status || (data.remaining_seconds > 0 ? 'Available' : 'Expired'));
        if (!silent) {
          onTriggerToast('Balance synchronized with server', 'check');
        }
      }
    } catch (err) {
      if (!silent) onTriggerToast('Sync failed (offline)', 'alert');
    } finally {
      if (!silent) setIsRefreshing(false);
    }
  };

  // Poll server every 5 seconds for live synchronization
  useEffect(() => {
    fetchLatestStatus(true);
    const interval = setInterval(() => {
      fetchLatestStatus(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeUser?.id]);

  const handleDownload = () => {
    onTriggerToast('Downloading Ghost AI Software for Windows...', 'download');
    const link = document.createElement('a');
    link.href = '/downloads/GhostAI-v1.0.0-Windows.zip';
    link.setAttribute('download', 'GhostAI-v1.0.0-Windows.zip');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isExpired = remainingSeconds <= 0;

  return (
    <DashboardWrapper>
      {/* Top Welcome Bar */}
      <div className="welcome-bar">
        <div className="user-info">
          <div className="avatar-circle">
            {(userData?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="welcome-title">Welcome, {userData?.name || 'User'}</h1>
            <p className="user-email">
              {userData?.email}
              {userData?.role === 'admin' && <span className="admin-tag">ADMIN</span>}
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="btn-refresh"
            onClick={() => fetchLatestStatus(false)}
            disabled={isRefreshing}
            title="Sync with server"
          >
            <svg
              className={isRefreshing ? 'spin' : ''}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <polyline points="1 20 1 14 7 14" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Sync
          </button>

          {userData?.role === 'admin' && (
            <button className="btn-admin" onClick={() => onNavigate('admin')}>
              Admin Panel
            </button>
          )}

          <button className="btn-logout" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Grid: Balance & Software Access */}
      <div className="dashboard-grid">
        {/* Available Time Card (Requirement #4) */}
        <div className={`time-card ${isExpired ? 'card-expired' : ''}`}>
          <div className="time-card-header">
            <span className="card-label">Available Time</span>
            <span className={`status-indicator ${isExpired ? 'indicator-expired' : 'indicator-active'}`}>
              <span className="dot" />
              {isExpired ? 'Access Expired' : 'Active Balance'}
            </span>
          </div>

          <div className="time-display" id="remaining-time-display">
            {formatTime(remainingSeconds)}
          </div>

          <p className="time-subtext">
            {isExpired
              ? 'Your available time has ended. Please contact your system administrator to assign minutes to your account.'
              : 'Server-synchronized balance. Automatically updates while the desktop software is in use.'}
          </p>

          <div className="admin-managed-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <span>Time allocations are strictly managed by your administrator. No user self-recharge required.</span>
          </div>
        </div>

        {/* Software Download & Status Card (Requirement #5) */}
        <div className="software-card">
          <div className="software-card-header">
            <div className="soft-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div>
              <h3>Your AI Software</h3>
              <span className="platform-label">Windows 10 / 11 (64-bit)</span>
            </div>
          </div>

          <div className="software-status-row">
            <span className="status-label">Software Status:</span>
            <span className={`status-pill ${softwareStatus.includes('Active') ? 'pill-active' : 'pill-available'}`}>
              <span className="dot" />
              {softwareStatus}
            </span>
          </div>

          <div className="download-action-box">
            <button className="btn-download-software" onClick={handleDownload} id="dashboard-download-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download Software
            </button>
            <span className="version-caption">Version 1.0.0</span>
          </div>

          <div className="usage-guide">
            <div className="guide-title">How to authenticate desktop software:</div>
            <ol className="guide-list">
              <li>Launch the downloaded software on your Windows computer.</li>
              <li>Enter your email: <strong>{userData?.email}</strong></li>
              <li>Enter your website account password.</li>
              <li>Your remaining balance will automatically load into the software.</li>
            </ol>
          </div>
        </div>
      </div>
    </DashboardWrapper>
  );
}

const DashboardWrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 20px 80px;

  .welcome-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    background: var(--surface, #0e1422);
    border: 1px solid var(--border, #1e293d);
    border-radius: 14px;
    padding: 20px 24px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .avatar-circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: linear-gradient(135deg, #10b981 0%, #2563eb 100%);
    color: #ffffff;
    font-size: 20px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
  }

  .welcome-title {
    font-size: 22px;
    font-weight: 800;
    color: var(--text-bright, #f8fafc);
    margin-bottom: 4px;
  }

  .user-email {
    font-size: 13px;
    color: var(--text-muted, #94a3b8);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .admin-tag {
    font-size: 10px;
    font-weight: 800;
    background: rgba(168, 85, 247, 0.15);
    color: #c084fc;
    border: 1px solid rgba(168, 85, 247, 0.4);
    padding: 1px 6px;
    border-radius: 4px;
    letter-spacing: 0.05em;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .btn-refresh {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 8px;
    background: var(--surface2, #151c2e);
    border: 1px solid var(--border2, #2d3c58);
    color: var(--text, #cbd5e1);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: var(--surface3, #1c263c);
      color: #38bdf8;
    }

    .spin {
      animation: spin 1s linear infinite;
    }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .btn-admin {
    padding: 8px 14px;
    border-radius: 8px;
    background: rgba(168, 85, 247, 0.15);
    border: 1px solid rgba(168, 85, 247, 0.4);
    color: #c084fc;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: rgba(168, 85, 247, 0.25);
    }
  }

  .btn-logout {
    padding: 8px 14px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid var(--border, #1e293d);
    color: var(--text-muted, #94a3b8);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      color: #f43f5e;
      border-color: rgba(244, 63, 94, 0.4);
      background: rgba(244, 63, 94, 0.08);
    }
  }

  /* Grid Layout */
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  /* Time Card */
  .time-card {
    background: var(--surface, #0e1422);
    border: 1px solid var(--border2, #2d3c58);
    border-radius: 16px;
    padding: 28px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

    &.card-expired {
      border-color: rgba(244, 63, 94, 0.35);
    }
  }

  .time-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
  }

  .card-label {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted, #94a3b8);
    font-weight: 700;
  }

  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    &.indicator-active {
      color: #10b981;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      .dot { background: #10b981; box-shadow: 0 0 6px #10b981; }
    }

    &.indicator-expired {
      color: #f43f5e;
      background: rgba(244, 63, 94, 0.12);
      border: 1px solid rgba(244, 63, 94, 0.3);
      .dot { background: #f43f5e; }
    }
  }

  .time-display {
    font-family: 'JetBrains Mono', monospace, -apple-system;
    font-size: 46px;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: var(--text-bright, #f8fafc);
    margin: 8px 0 16px;
    padding: 12px 18px;
    background: var(--surface2, #151c2e);
    border: 1px solid var(--border, #1e293d);
    border-radius: 12px;
    text-align: center;
    box-shadow: inset 0 2px 6px rgba(0, 0, 0, 0.3);
  }

  .time-subtext {
    font-size: 13px;
    line-height: 1.55;
    color: var(--text-muted, #94a3b8);
    margin-bottom: 20px;
    flex-grow: 1;
  }

  .admin-managed-note {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid var(--border, #1e293d);
    border-radius: 8px;
    font-size: 12px;
    color: var(--text-muted, #64748b);
    line-height: 1.45;

    svg {
      flex-shrink: 0;
      margin-top: 2px;
    }
  }

  /* Software Card */
  .software-card {
    background: var(--surface, #0e1422);
    border: 1px solid var(--border, #1e293d);
    border-radius: 16px;
    padding: 28px;
    display: flex;
    flex-direction: column;
  }

  .software-card-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 18px;

    .soft-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--surface2, #151c2e);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border2, #2d3c58);
    }

    h3 {
      font-size: 18px;
      font-weight: 800;
      color: var(--text-bright, #f8fafc);
      margin-bottom: 2px;
    }

    .platform-label {
      font-size: 12px;
      color: var(--text-muted, #94a3b8);
    }
  }

  .software-status-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: var(--surface2, #151c2e);
    border: 1px solid var(--border, #1e293d);
    border-radius: 8px;
    margin-bottom: 20px;

    .status-label {
      font-size: 13px;
      font-weight: 600;
      color: var(--text-muted, #94a3b8);
    }
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    &.pill-available {
      color: #10b981;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      .dot { background: #10b981; }
    }

    &.pill-active {
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.12);
      border: 1px solid rgba(56, 189, 248, 0.3);
      .dot { background: #38bdf8; }
    }
  }

  .download-action-box {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 20px;

    .btn-download-software {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px;
      border-radius: 10px;
      background: #10b981;
      color: #ffffff;
      font-size: 15px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);

      &:hover {
        background: #059669;
        transform: translateY(-1px);
      }
    }

    .version-caption {
      text-align: center;
      font-size: 12px;
      color: var(--text-muted, #64748b);
    }
  }

  .usage-guide {
    background: var(--surface2, #151c2e);
    border: 1px solid var(--border, #1e293d);
    border-radius: 8px;
    padding: 14px;

    .guide-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-bright, #f8fafc);
      margin-bottom: 8px;
    }

    .guide-list {
      margin: 0;
      padding-left: 18px;
      font-size: 12px;
      color: var(--text-muted, #94a3b8);
      line-height: 1.5;

      li {
        margin-bottom: 4px;
      }
    }
  }

  @media (max-width: 768px) {
    .dashboard-grid {
      grid-template-columns: 1fr;
    }
    .welcome-bar {
      flex-direction: column;
      align-items: stretch;
    }
    .header-actions {
      justify-content: flex-end;
    }
  }
`;
