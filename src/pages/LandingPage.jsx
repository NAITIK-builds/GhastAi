import React from 'react';
import styled from 'styled-components';

export default function LandingPage({
  onNavigate,
  onOpenAuth,
  activeUser,
  onTriggerToast,
  theme = 'dark'
}) {
  const handleDownload = () => {
    onTriggerToast('Starting download for Ghost AI Desktop v1.0.0...', 'download');
    // Trigger download of release archive or script
    const link = document.createElement('a');
    link.href = '/api/download';
    link.target = '_blank';
    document.body.appendChild(link);
    // Also trigger mock file download for user convenience
    const blob = new Blob(
      [
        'Ghost AI Assistant Desktop v1.0.0\n\n' +
        'Instructions:\n' +
        '1. Ensure Python 3.10+ is installed on your Windows system.\n' +
        '2. Run: run_ghost_ai.bat or python main.py\n' +
        '3. Log in with your registered account credentials.\n' +
        '4. Your active remaining time will synchronize with the server.\n'
      ],
      { type: 'text/plain;charset=utf-8' }
    );
    const blobUrl = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = blobUrl;
    downloadAnchor.download = 'GhostAI-v1.0.0-Quickstart.txt';
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <LandingWrapper>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <span className="badge-dot" />
          <span>Desktop Software Portal • Windows 10/11</span>
        </div>

        <h1 className="hero-title">
          Ghost AI <span className="gradient-text">Assistant</span>
        </h1>

        <p className="hero-description">
          A high-performance stealth AI copilot engineered as a dedicated Windows desktop application. 
          Manage your account credentials, view server-synchronized usage time, and download the official software client.
        </p>

        {/* Primary Call-to-Actions */}
        <div className="hero-actions">
          <button className="btn-primary" onClick={handleDownload} id="hero-download-btn">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download Software
          </button>

          {activeUser ? (
            <button
              className="btn-secondary"
              onClick={() => onNavigate(activeUser.role === 'admin' ? 'admin' : 'dashboard')}
              id="hero-dashboard-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Open {activeUser.role === 'admin' ? 'Admin Portal' : 'User Dashboard'}
            </button>
          ) : (
            <>
              <button
                className="btn-secondary"
                onClick={() => onOpenAuth('login')}
                id="hero-login-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <polyline points="10 17 15 12 10 7" />
                  <line x1="15" y1="12" x2="3" y2="12" />
                </svg>
                Sign In
              </button>

              <button
                className="btn-tertiary"
                onClick={() => onOpenAuth('register')}
                id="hero-register-btn"
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </section>

      {/* Feature Highlights (Clean & Minimal) */}
      <section className="highlights-section">
        <div className="highlight-card">
          <div className="card-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <h3>Native Windows Application</h3>
          <p>
            Runs directly on your Windows desktop. Independent of web browser limitations, offering instant response times and low system latency.
          </p>
        </div>

        <div className="highlight-card">
          <div className="card-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <h3>Secure Authentication</h3>
          <p>
            Sign into the desktop application with your registered account credentials. Multi-session protection prevents concurrent duplicate instances.
          </p>
        </div>

        <div className="highlight-card">
          <div className="card-icon-wrap">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <h3>Server-Side Time Validation</h3>
          <p>
            Time balance is managed and verified on the server. When the administrator adds minutes, active software sessions automatically sync in real-time.
          </p>
        </div>
      </section>

      {/* Software Download Section */}
      <section className="download-section" id="download-section">
        <div className="download-card">
          <div className="download-header">
            <div className="software-logo">
              <div className="logo-glow" />
              <span className="logo-text">AI</span>
            </div>
            <div className="software-meta">
              <div className="software-badge">Official Release</div>
              <h2>Your AI Software</h2>
              <p className="platform-tag">Windows 10 / 11 (64-bit)</p>
            </div>
          </div>

          <div className="download-body">
            <div className="version-info">
              <div className="info-item">
                <span className="info-label">Version</span>
                <span className="info-value">1.0.0</span>
              </div>
              <div className="info-item">
                <span className="info-label">Architecture</span>
                <span className="info-value">x64 Native</span>
              </div>
              <div className="info-item">
                <span className="info-label">License</span>
                <span className="info-value">Admin Managed</span>
              </div>
              <div className="info-item">
                <span className="info-label">Status</span>
                <span className="info-value status-online">● Ready to Deploy</span>
              </div>
            </div>

            <div className="download-cta-row">
              <button className="btn-download-large" onClick={handleDownload} id="main-download-button">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Software
              </button>
            </div>
          </div>

          <div className="setup-steps">
            <h4>Quick Setup in 3 Steps:</h4>
            <div className="steps-grid">
              <div className="step-item">
                <span className="step-num">1</span>
                <div>
                  <strong>Download & Install</strong>
                  <p>Download the software package and launch it on your Windows desktop.</p>
                </div>
              </div>
              <div className="step-item">
                <span className="step-num">2</span>
                <div>
                  <strong>Sign In with Account</strong>
                  <p>Enter your website email and password into the desktop login prompt.</p>
                </div>
              </div>
              <div className="step-item">
                <span className="step-num">3</span>
                <div>
                  <strong>Server-Sync Access</strong>
                  <p>Your remaining minutes are verified and synced with the backend server.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LandingWrapper>
  );
}

const LandingWrapper = styled.div`
  max-width: 1040px;
  margin: 0 auto;
  padding: 48px 24px 80px;

  /* Hero Section */
  .hero-section {
    text-align: center;
    padding: 40px 0 60px;
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    border-radius: 9999px;
    background: var(--surface2, #151c2e);
    border: 1px solid var(--border, #1e293d);
    color: var(--text-muted, #94a3b8);
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 24px;

    .badge-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
    }
  }

  .hero-title {
    font-size: 48px;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text-bright, #f8fafc);
    line-height: 1.15;
    margin-bottom: 18px;

    .gradient-text {
      background: linear-gradient(135deg, #10b981 0%, #38bdf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .hero-description {
    max-width: 640px;
    margin: 0 auto 36px;
    font-size: 17px;
    line-height: 1.6;
    color: var(--text-muted, #94a3b8);
  }

  .hero-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 24px;
    border-radius: 10px;
    background: #10b981;
    color: #ffffff;
    font-weight: 700;
    font-size: 15px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);

    &:hover {
      background: #059669;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
    }
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 12px 22px;
    border-radius: 10px;
    background: var(--surface2, #151c2e);
    color: var(--text-bright, #f8fafc);
    font-weight: 600;
    font-size: 15px;
    border: 1px solid var(--border2, #2d3c58);
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--surface3, #1c263c);
      border-color: #38bdf8;
      color: #38bdf8;
    }
  }

  .btn-tertiary {
    padding: 12px 20px;
    border-radius: 10px;
    background: transparent;
    color: var(--text-muted, #94a3b8);
    font-weight: 600;
    font-size: 15px;
    border: 1px solid transparent;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      color: var(--text-bright, #f8fafc);
      background: rgba(255, 255, 255, 0.05);
    }
  }

  /* Highlights Section */
  .highlights-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
    margin-bottom: 64px;
  }

  .highlight-card {
    background: var(--surface, #0e1422);
    border: 1px solid var(--border, #1e293d);
    border-radius: 14px;
    padding: 24px;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--border2, #2d3c58);
      transform: translateY(-2px);
    }

    .card-icon-wrap {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--surface2, #151c2e);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    h3 {
      font-size: 17px;
      font-weight: 700;
      color: var(--text-bright, #f8fafc);
      margin-bottom: 8px;
    }

    p {
      font-size: 14px;
      line-height: 1.55;
      color: var(--text-muted, #94a3b8);
    }
  }

  /* Download Section */
  .download-section {
    margin-top: 20px;
  }

  .download-card {
    background: var(--surface, #0e1422);
    border: 1px solid var(--border2, #2d3c58);
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  }

  .download-header {
    display: flex;
    align-items: center;
    gap: 20px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--border, #1e293d);
    margin-bottom: 24px;
  }

  .software-logo {
    position: relative;
    width: 60px;
    height: 60px;
    border-radius: 14px;
    background: linear-gradient(135deg, #090b10, #151c2e);
    border: 1px solid #10b981;
    display: flex;
    align-items: center;
    justify-content: center;

    .logo-text {
      font-size: 20px;
      font-weight: 900;
      color: #10b981;
      letter-spacing: 0.05em;
    }

    .logo-glow {
      position: absolute;
      inset: -4px;
      border-radius: 16px;
      background: rgba(16, 185, 129, 0.15);
      z-index: -1;
    }
  }

  .software-meta {
    .software-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      color: #10b981;
      background: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 6px;
    }

    h2 {
      font-size: 22px;
      font-weight: 800;
      color: var(--text-bright, #f8fafc);
      margin-bottom: 4px;
    }

    .platform-tag {
      font-size: 13px;
      color: var(--text-muted, #94a3b8);
    }
  }

  .download-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
    padding-bottom: 28px;
    border-bottom: 1px solid var(--border, #1e293d);
  }

  .version-info {
    display: flex;
    align-items: center;
    gap: 28px;
    flex-wrap: wrap;

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .info-label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-muted, #64748b);
        font-weight: 600;
      }

      .info-value {
        font-size: 14px;
        font-weight: 700;
        color: var(--text-bright, #f8fafc);

        &.status-online {
          color: #10b981;
        }
      }
    }
  }

  .btn-download-large {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 13px 28px;
    border-radius: 10px;
    background: #10b981;
    color: #ffffff;
    font-size: 15px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);

    &:hover {
      background: #059669;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
    }
  }

  .setup-steps {
    margin-top: 24px;

    h4 {
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted, #94a3b8);
      margin-bottom: 16px;
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: var(--surface2, #151c2e);
      border: 1px solid var(--border, #1e293d);
      border-radius: 10px;
      padding: 14px;

      .step-num {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
        font-size: 12px;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      strong {
        display: block;
        font-size: 13px;
        color: var(--text-bright, #f8fafc);
        margin-bottom: 4px;
      }

      p {
        font-size: 12px;
        color: var(--text-muted, #94a3b8);
        line-height: 1.45;
        margin: 0;
      }
    }
  }

  @media (max-width: 768px) {
    .hero-title {
      font-size: 34px;
    }

    .download-body {
      flex-direction: column;
      align-items: stretch;
    }

    .btn-download-large {
      justify-content: center;
    }
  }
`;
