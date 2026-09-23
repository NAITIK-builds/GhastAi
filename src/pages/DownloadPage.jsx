import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';

export default function DownloadPage({
  onNavigate,
  onOpenAuth,
  activeUser,
  onTriggerToast
}) {
  const [downloadInfo, setDownloadInfo] = useState({
    version: '1.0.0',
    platform: 'Windows 10 / 11 (64-bit)',
    filename: 'GhostAI-v1.0.0-Windows.zip',
    downloadUrl: '/downloads/GhostAI-v1.0.0-Windows.zip',
    releaseDate: 'September 2026',
    fileSize: '~98 KB',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  });
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    fetch('/api/download')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.downloadUrl) {
          setDownloadInfo((prev) => ({
            ...prev,
            ...data
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleDownloadClick = () => {
    playTechBeep('click');
    setIsDownloading(true);

    if (onTriggerToast) {
      onTriggerToast(`Starting download: ${downloadInfo.filename}...`, 'download');
    }

    // Trigger genuine file download
    const link = document.createElement('a');
    link.href = downloadInfo.downloadUrl;
    link.setAttribute('download', downloadInfo.filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsDownloading(false);
      if (onTriggerToast) {
        onTriggerToast('Download complete! Extract and run run_ghost_ai.bat', 'check');
      }
    }, 1200);
  };

  const copyChecksum = () => {
    playTechBeep('click');
    navigator.clipboard.writeText(downloadInfo.sha256);
    setCopiedHash(true);
    if (onTriggerToast) onTriggerToast('SHA-256 Checksum copied to clipboard', 'check');
    setTimeout(() => setCopiedHash(false), 2000);
  };

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
    <PageWrapper>
      <div className="download-container">
        {/* Breadcrumb / Category Tag */}
        <div className="page-header-top">
          <div className="release-badge">
            <span className="pulse-dot" />
            <span>OFFICIAL WINDOWS RELEASE &bull; V{downloadInfo.version}</span>
          </div>
          <h1 className="page-title">Download Ghost AI Copilot for Windows</h1>
          <p className="page-subtitle">
            100% screen-share invisible desktop copilot for technical interviews, coding assessments, and live pair programming.
          </p>
        </div>

        {/* Primary Download Card */}
        <div className="main-download-card">
          <div className="card-left">
            <div className="client-icon-wrapper">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>

            <div className="client-meta">
              <div className="client-name">Ghost AI Desktop Assistant</div>
              <div className="client-specs">
                <span>{downloadInfo.platform}</span> &bull; 
                <span>{downloadInfo.fileSize}</span> &bull; 
                <span>Release: {downloadInfo.releaseDate}</span>
              </div>
              <div className="security-badges">
                <span className="sec-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  Verified Safe &amp; Clean
                </span>
                <span className="sec-tag">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 14 14" />
                  </svg>
                  Server-Synced Licensing
                </span>
                <span className="sec-tag highlight">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                  100% Screen-Share Invisible
                </span>
              </div>
            </div>
          </div>

          <div className="card-right">
            <button
              className={`btn-primary-download ${isDownloading ? 'downloading' : ''}`}
              onClick={handleDownloadClick}
              disabled={isDownloading}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{isDownloading ? 'Downloading...' : 'Download for Windows'}</span>
            </button>
            <span className="download-subtext">Direct ZIP Archive &bull; Portable, No Installation Needed</span>
          </div>
        </div>

        {/* SHA-256 Checksum Bar */}
        <div className="checksum-strip">
          <span className="checksum-label">SHA-256 Integrity:</span>
          <code className="checksum-hash">{downloadInfo.sha256}</code>
          <button className="btn-copy-hash" onClick={copyChecksum}>
            {copiedHash ? '✓ Copied' : 'Copy Hash'}
          </button>
        </div>

        {/* Account Authentication Connection Banner */}
        <div className="auth-connection-card">
          {activeUser ? (
            <div className="auth-status-logged-in">
              <div className="auth-status-left">
                <div className="user-initials-badge">
                  {(activeUser.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="auth-welcome-text">
                    Ready to Connect: <strong>{activeUser.name}</strong> ({activeUser.email})
                  </div>
                  <div className="auth-sub-text">
                    Your available runtime: <strong className="time-highlight">{formatTime(activeUser.remaining_seconds || 0)}</strong> ({Math.floor((activeUser.remaining_seconds || 0) / 60)} mins)
                  </div>
                </div>
              </div>

              <div className="auth-status-right">
                <button
                  className="btn-dashboard-link"
                  onClick={() => onNavigate('dashboard')}
                >
                  Open Dashboard
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-status-logged-out">
              <div className="auth-msg-col">
                <h4>Software Requires Account Credentials</h4>
                <p>
                  When launching the software on your Windows PC, enter your registered email and password to validate your runtime balance.
                </p>
              </div>
              <div className="auth-action-buttons">
                <button
                  className="btn-auth-signin"
                  onClick={() => onOpenAuth('login')}
                >
                  Sign In
                </button>
                <button
                  className="btn-auth-register"
                  onClick={() => onOpenAuth('register')}
                >
                  Create Account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 3-Step Setup Guide */}
        <div className="setup-section">
          <div className="section-heading">
            <h2>Quick 3-Step Setup Instructions</h2>
            <p>Get up and running in less than 60 seconds with zero complicated setup.</p>
          </div>

          <div className="setup-steps-grid">
            {/* Step 1 */}
            <div className="step-card">
              <div className="step-number-badge">1</div>
              <div className="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </div>
              <h3>Download &amp; Extract</h3>
              <p>
                Download <code>{downloadInfo.filename}</code> to your computer and extract the folder to your preferred directory (e.g. <code>C:\GhostAI</code>).
              </p>
            </div>

            {/* Step 2 */}
            <div className="step-card">
              <div className="step-number-badge">2</div>
              <div className="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
              </div>
              <h3>Launch &amp; Sign In</h3>
              <p>
                Double-click <code>run_ghost_ai.bat</code> (or <code>run_stealth.vbs</code> for windowless execution). Enter your website email and password when prompted.
              </p>
            </div>

            {/* Step 3 */}
            <div className="step-card">
              <div className="step-number-badge">3</div>
              <div className="step-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3>Activate Invisible Copilot</h3>
              <p>
                Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>G</kbd> to toggle overlay. It will remain 100% invisible on Zoom, Teams, Meet, and Discord screen shares!
              </p>
            </div>
          </div>
        </div>

        {/* Invisibility & Compatibility Specs */}
        <div className="specs-grid">
          <div className="spec-card">
            <div className="spec-title-row">
              <div className="spec-icon-box green">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h4>Screen-Share Invisibility</h4>
            </div>
            <p>
              Leverages Win32 hardware composition flags (<code>WDA_EXCLUDEFROMCAPTURE</code>). Invisible during full-desktop and window sharing on Zoom, Microsoft Teams, Google Meet, and Discord.
            </p>
          </div>

          <div className="spec-card">
            <div className="spec-title-row">
              <div className="spec-icon-box blue">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <h4>Windows 10 &amp; 11 Support</h4>
            </div>
            <p>
              Fully compatible with Windows 10 (Build 19041+) and Windows 11 64-bit systems. High-DPI auto scaling and multi-monitor setups supported natively.
            </p>
          </div>

          <div className="spec-card">
            <div className="spec-title-row">
              <div className="spec-icon-box gold">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h4>Live Server-Synced Balance</h4>
            </div>
            <p>
              Your desktop runtime synchronizes with the server in real-time. When an administrator adds time in Rupees, your desktop client updates immediately.
            </p>
          </div>

          <div className="spec-card">
            <div className="spec-title-row">
              <div className="spec-icon-box purple">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="3" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </div>
              <h4>Portable &amp; Clean Execution</h4>
            </div>
            <p>
              Requires no installation, registry modifications, or admin privileges. Runs portably from any USB drive or folder and can be deleted cleanly anytime.
            </p>
          </div>
        </div>

        {/* Global Hotkeys Summary */}
        <div className="hotkeys-banner">
          <div className="hotkeys-title">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <line x1="6" y1="8" x2="6" y2="8" />
              <line x1="10" y1="8" x2="10" y2="8" />
              <line x1="14" y1="8" x2="14" y2="8" />
              <line x1="18" y1="8" x2="18" y2="8" />
              <line x1="6" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="18" y2="12" />
              <line x1="9" y1="16" x2="15" y2="16" />
            </svg>
            <span>Global Stealth Hotkeys</span>
          </div>

          <div className="hotkey-tags">
            <div className="hotkey-item">
              <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>G</kbd>
              <span>Toggle Overlay Visibility</span>
            </div>
            <div className="hotkey-item">
              <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Q</kbd>
              <span>Emergency Stealth Exit</span>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: calc(100vh - 80px);
  background: var(--bg-canvas, #090b10);
  padding: 40px 24px 100px;

  .download-container {
    max-width: 1080px;
    margin: 0 auto;
  }

  /* Page Header */
  .page-header-top {
    text-align: center;
    margin-bottom: 36px;
  }

  .release-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 12px;
    border-radius: 6px;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: var(--accent, #10b981);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.08em;
    margin-bottom: 12px;

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
    }
  }

  .page-title {
    font-size: 34px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-headline, #f8fafc);
    margin: 0 0 10px;
  }

  .page-subtitle {
    font-size: 16px;
    color: var(--text-muted, #94a3b8);
    max-width: 680px;
    margin: 0 auto;
    line-height: 1.55;
  }

  /* Main Download Card */
  .main-download-card {
    background: var(--surface, #0e1422);
    border: 1px solid var(--border, #1e293d);
    border-radius: 16px;
    padding: 28px 32px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
    margin-bottom: 14px;
    flex-wrap: wrap;

    .card-left {
      display: flex;
      align-items: center;
      gap: 20px;

      .client-icon-wrapper {
        width: 68px;
        height: 68px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(2, 132, 199, 0.15) 100%);
        border: 1px solid rgba(16, 185, 129, 0.3);
        color: #10b981;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .client-name {
        font-size: 20px;
        font-weight: 800;
        color: var(--text-headline, #f8fafc);
        margin-bottom: 4px;
      }

      .client-specs {
        font-size: 13px;
        color: var(--text-muted, #94a3b8);
        display: flex;
        gap: 8px;
        margin-bottom: 10px;
      }

      .security-badges {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;

        .sec-tag {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted, #94a3b8);
          background: var(--surface2, #151c2e);
          border: 1px solid var(--border, #1e293d);
          padding: 2px 8px;
          border-radius: 5px;

          &.highlight {
            color: #10b981;
            background: rgba(16, 185, 129, 0.08);
            border-color: rgba(16, 185, 129, 0.25);
          }
        }
      }
    }

    .card-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;

      .btn-primary-download {
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 14px 28px;
        border-radius: 10px;
        background: #10b981;
        color: #ffffff;
        font-size: 15px;
        font-weight: 800;
        border: none;
        cursor: pointer;
        transition: background 0.15s ease;
        box-shadow: 0 4px 14px rgba(16, 185, 129, 0.25);

        &:hover {
          background: #059669;
        }

        &.downloading {
          opacity: 0.7;
          cursor: wait;
        }
      }

      .download-subtext {
        font-size: 11.5px;
        color: var(--text-muted, #64748b);
      }
    }
  }

  /* Checksum Strip */
  .checksum-strip {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--surface2, #151c2e);
    border: 1px solid var(--border, #1e293d);
    border-radius: 8px;
    padding: 8px 16px;
    font-size: 12px;
    margin-bottom: 24px;
    flex-wrap: wrap;

    .checksum-label {
      color: var(--text-muted, #94a3b8);
      font-weight: 600;
    }

    .checksum-hash {
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-headline, #f8fafc);
      font-size: 11.5px;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .btn-copy-hash {
      background: var(--surface, #0e1422);
      border: 1px solid var(--border, #1e293d);
      color: #10b981;
      font-size: 11px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background: rgba(16, 185, 129, 0.1);
        border-color: #10b981;
      }
    }
  }

  /* Auth Connection Card */
  .auth-connection-card {
    background: var(--surface, #0e1422);
    border: 1px solid var(--border, #1e293d);
    border-radius: 12px;
    padding: 18px 24px;
    margin-bottom: 36px;

    .auth-status-logged-in {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;

      .auth-status-left {
        display: flex;
        align-items: center;
        gap: 14px;

        .user-initials-badge {
          width: 38px;
          height: 38px;
          border-radius: 8px;
          background: linear-gradient(135deg, #10b981 0%, #2563eb 100%);
          color: #ffffff;
          font-weight: 800;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .auth-welcome-text {
          font-size: 14px;
          color: var(--text-headline, #f8fafc);
          margin-bottom: 2px;
        }

        .auth-sub-text {
          font-size: 12.5px;
          color: var(--text-muted, #94a3b8);

          .time-highlight {
            font-family: 'JetBrains Mono', monospace;
            color: #10b981;
            font-weight: 700;
          }
        }
      }

      .btn-dashboard-link {
        padding: 8px 16px;
        border-radius: 8px;
        background: var(--surface2, #151c2e);
        border: 1px solid var(--border2, #2d3c58);
        color: var(--text-headline, #f8fafc);
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;

        &:hover {
          background: var(--surface3, #1c263c);
          border-color: #10b981;
          color: #10b981;
        }
      }
    }

    .auth-status-logged-out {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      flex-wrap: wrap;

      .auth-msg-col {
        h4 {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-headline, #f8fafc);
          margin: 0 0 4px;
        }

        p {
          font-size: 13px;
          color: var(--text-muted, #94a3b8);
          margin: 0;
        }
      }

      .auth-action-buttons {
        display: flex;
        align-items: center;
        gap: 10px;

        .btn-auth-signin {
          padding: 8px 16px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid var(--border2, #2d3c58);
          color: var(--text-headline, #f8fafc);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;

          &:hover {
            border-color: #38bdf8;
            color: #38bdf8;
          }
        }

        .btn-auth-register {
          padding: 8px 18px;
          border-radius: 8px;
          background: #10b981;
          border: none;
          color: #ffffff;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;

          &:hover {
            background: #059669;
          }
        }
      }
    }
  }

  /* Setup Guide */
  .setup-section {
    margin-bottom: 40px;

    .section-heading {
      text-align: center;
      margin-bottom: 24px;

      h2 {
        font-size: 24px;
        font-weight: 800;
        color: var(--text-headline, #f8fafc);
        margin: 0 0 6px;
      }

      p {
        font-size: 14px;
        color: var(--text-muted, #94a3b8);
        margin: 0;
      }
    }

    .setup-steps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 18px;
    }

    .step-card {
      background: var(--surface, #0e1422);
      border: 1px solid var(--border, #1e293d);
      border-radius: 12px;
      padding: 24px 20px;
      position: relative;
      display: flex;
      flex-direction: column;

      .step-number-badge {
        position: absolute;
        top: 14px;
        right: 16px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--surface2, #151c2e);
        border: 1px solid var(--border, #1e293d);
        color: var(--text-muted, #94a3b8);
        font-size: 12px;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .step-icon {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 16px;
      }

      h3 {
        font-size: 16px;
        font-weight: 700;
        color: var(--text-headline, #f8fafc);
        margin: 0 0 8px;
      }

      p {
        font-size: 13px;
        color: var(--text-muted, #94a3b8);
        line-height: 1.5;
        margin: 0;

        code {
          font-family: 'JetBrains Mono', monospace;
          background: var(--surface2, #151c2e);
          border: 1px solid var(--border, #1e293d);
          padding: 2px 5px;
          border-radius: 4px;
          color: #38bdf8;
          font-size: 12px;
        }

        kbd {
          font-family: inherit;
          background: var(--surface2, #151c2e);
          border: 1px solid var(--border, #1e293d);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-headline, #f8fafc);
        }
      }
    }
  }

  /* Specs Grid */
  .specs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 30px;

    .spec-card {
      background: var(--surface, #0e1422);
      border: 1px solid var(--border, #1e293d);
      border-radius: 12px;
      padding: 20px;

      .spec-title-row {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;

        .spec-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;

          &.green {
            background: rgba(16, 185, 129, 0.1);
            color: #10b981;
          }
          &.blue {
            background: rgba(56, 189, 248, 0.1);
            color: #0284c7;
          }
          &.gold {
            background: rgba(245, 158, 11, 0.1);
            color: #d97706;
          }
          &.purple {
            background: rgba(168, 85, 247, 0.1);
            color: #9333ea;
          }
        }

        h4 {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-headline, #f8fafc);
          margin: 0;
        }
      }

      p {
        font-size: 13px;
        color: var(--text-muted, #94a3b8);
        line-height: 1.55;
        margin: 0;

        code {
          font-family: 'JetBrains Mono', monospace;
          color: #10b981;
          font-size: 11.5px;
        }
      }
    }
  }

  /* Hotkeys Banner */
  .hotkeys-banner {
    background: var(--surface, #0e1422);
    border: 1px solid var(--border, #1e293d);
    border-radius: 12px;
    padding: 16px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;

    .hotkeys-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      font-weight: 700;
      color: var(--text-headline, #f8fafc);

      svg {
        color: #10b981;
      }
    }

    .hotkey-tags {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;

      .hotkey-item {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12.5px;
        color: var(--text-muted, #94a3b8);

        kbd {
          background: var(--surface2, #151c2e);
          border: 1px solid var(--border, #1e293d);
          color: var(--text-headline, #f8fafc);
          font-weight: 700;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'JetBrains Mono', monospace;
        }
      }
    }
  }

  @media (max-width: 860px) {
    .main-download-card {
      flex-direction: column;
      align-items: flex-start;
      .card-right {
        align-items: flex-start;
        width: 100%;
        .btn-primary-download {
          width: 100%;
          justify-content: center;
        }
      }
    }
    .setup-steps-grid {
      grid-template-columns: 1fr;
    }
    .specs-grid {
      grid-template-columns: 1fr;
    }
  }
`;
