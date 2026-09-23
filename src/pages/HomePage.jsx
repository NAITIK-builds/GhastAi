import React, { useState } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';
import {
  IconPlay,
  IconCopy,
  IconCheck,
  IconZap,
  IconShieldCheck,
  IconTerminal,
  IconCode,
  IconMonitor,
  IconMic,
  IconArrowRight,
  IconEyeOff,
  IconKeyboard
} from '../components/Icons';

export default function HomePage({ onNavigate, onOpenAuth, onOpenRecharge, activeUser, onTriggerToast, theme }) {
  const [copied, setCopied] = useState(false);

  const handleCopyCmd = () => {
    playTechBeep('click');
    navigator.clipboard.writeText('cscript //nologo run_stealth.vbs');
    setCopied(true);
    if (onTriggerToast) onTriggerToast('Launcher command copied to clipboard!', 'copy');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <HomeWrapper data-theme={theme} className={theme === 'light' ? 'light-mode' : ''}>
      {/* 1. Hero Stage: Centered Headline & Ambient High-Tech Backdrop */}
      <section className="hero-section">
        <div className="minimal-container">
          <div className="hero-center-wrapper">
            <div className="hero-center-tag">
              <span className="live-dot" />
              <span>100% SCREEN-SHARE INVISIBLE &bull; ADMIN AUTHORIZED LICENSING &bull; WINDOWS 10/11</span>
            </div>

            <h1 className="hero-headline centered">
              The <span className="gradient-text">Invisible AI Copilot</span> for Live Technical Interviews
            </h1>

            <p className="hero-subtext centered">
              Solve LeetCode, system design problems, and live coding assessments in real time. Visible directly on your physical monitor—yet <strong>100% invisible</strong> across Zoom, Teams, Google Meet, and proctored browser test portals.
            </p>

            <div className="hero-cta-strip centered">
              <button
                className="btn-minimal-primary"
                onClick={() => {
                  playTechBeep('click');
                  if (onNavigate) onNavigate('download');
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 6 }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                <span>Download Software v1.0</span>
              </button>

              <button
                className="btn-minimal-secondary"
                onClick={() => {
                  playTechBeep('click');
                  if (activeUser) onNavigate('dashboard');
                  else onOpenAuth('login');
                }}
              >
                <IconPlay size={13} />
                <span>{activeUser ? 'Open User Dashboard →' : 'Sign In to Dashboard →'}</span>
              </button>

              <button className="btn-cmd-chip" onClick={handleCopyCmd} title="Click to copy quick launcher command">
                <span className="cmd-symbol">$</span>
                <span className="cmd-str">cscript //nologo run_stealth.vbs</span>
                {copied ? <IconCheck size={12} color="var(--emerald-neon)" /> : <IconCopy size={12} />}
              </button>
            </div>

            {/* Centered Telemetry & Defense Grid */}
            <div className="hero-telemetry-grid">
              <div className="telem-badge">
                <IconShieldCheck size={14} color="var(--emerald-neon)" />
                <span><strong>DWM Exclusion:</strong> Zoom &bull; Teams Clean</span>
              </div>
              <div className="telem-badge">
                <IconCheck size={14} color="var(--emerald-neon)" />
                <span><strong>Safe Focus Lock:</strong> 0 Tab-Switch Alerts</span>
              </div>
              <div className="telem-badge">
                <IconKeyboard size={14} color="#38bdf8" />
                <span><strong>Anti-Paste Engine:</strong> Natural 55 WPM Jitter</span>
              </div>
              <div className="telem-badge">
                <IconZap size={14} color="var(--emerald-neon)" />
                <span><strong>Pay-Per-Minute:</strong> ₹2.5/m &bull; Never Expires</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three Pillars Section */}
      <section className="pillars-section">
        <div className="minimal-container">
          <div className="section-head">
            <span className="editorial-idx">CORE ARCHITECTURE</span>
            <h2 className="minimal-headline" style={{ fontSize: '2.2rem' }}>Three Layers of Defense</h2>
            <p className="minimal-sub">Engineered specifically to solve real coding interviews without leaving traces.</p>
          </div>

          <div className="pillars-grid">
            <div className="pillar-item minimal-slate">
              <span className="pillar-num">01</span>
              <h3 className="pillar-title">100% Screen Share Invisible</h3>
              <p className="pillar-text">
                Renders exclusively on your physical monitor. Meeting software (Zoom, Teams, Meet, Discord) captures 0 pixels of the assistant window.
              </p>
              <div className="pillar-tag">Meeting Stream Safe</div>
            </div>

            <div className="pillar-item minimal-slate">
              <span className="pillar-num">02</span>
              <h3 className="pillar-title">Safe Focus Lock</h3>
              <p className="pillar-text">
                Clicking, dragging, or snipping over Ghost AI never steals window focus from your active browser tab, preventing exam blur alerts on HackerRank & CodeSignal.
              </p>
              <div className="pillar-tag">0 Tab-Switch Events</div>
            </div>

            <div className="pillar-item minimal-slate">
              <span className="pillar-num">03</span>
              <h3 className="pillar-title">Live Interview Ear</h3>
              <p className="pillar-text">
                Listens directly to interviewer questions through loopback audio and generates structured bullet points and optimal code in seconds.
              </p>
              <div className="pillar-tag">Real-Time Audio Loopback</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Platform Compatibility Marquee */}
      <section className="compat-marquee-section">
        <div className="minimal-container">
          <div className="marquee-label">Verified Safe &amp; Undetected on:</div>
          <div className="platform-badges-row">
            {['Zoom Meetings', 'Microsoft Teams', 'Google Meet', 'HackerRank Tests', 'CodeSignal Assessments', 'Proctorio', 'TestGorilla', 'Discord 60FPS'].map((p, i) => (
              <div key={i} className="platform-chip">
                <IconShieldCheck size={12} color="var(--emerald-neon)" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Dedicated Page Portals / Gateways */}
      <section className="gateways-section">
        <div className="minimal-container">
          <div className="gateways-header">
            <span className="editorial-idx">DEDICATED LABS &amp; PAGES</span>
            <h2 className="minimal-headline" style={{ fontSize: '2.2rem' }}>Explore Every Feature</h2>
            <p className="minimal-sub">Each capability has its own dedicated page with deep interactive tools and telemetry.</p>
          </div>

          <div className="gateways-list">
            <div className="gateway-row" onClick={() => { playTechBeep('click'); onNavigate('simulator'); }}>
              <div className="gateway-col-idx">
                <span className="editorial-idx">01</span>
                <span className="gateway-tag">Verification Lab</span>
              </div>
              <div className="gateway-col-body">
                <h3 className="gateway-title">Dual-Screen Invisibility Simulator</h3>
                <p className="gateway-desc">
                  Interactive side-by-side comparison studio. See what you see on your physical monitor vs. what interviewers see over Zoom or Teams with 0 pixels transmitted.
                </p>
              </div>
              <div className="gateway-col-action">
                <span className="action-link">Open Simulator &rarr;</span>
              </div>
            </div>

            <div className="gateway-row" onClick={() => { playTechBeep('click'); onNavigate('playground'); }}>
              <div className="gateway-col-idx">
                <span className="editorial-idx">02</span>
                <span className="gateway-tag">Desktop Lab</span>
              </div>
              <div className="gateway-col-body">
                <h3 className="gateway-title">Floating HUD Playground &amp; Auto-Typer</h3>
                <p className="gateway-desc">
                  Test the actual floating translucent window. Generate runnable C++, Python, and Java LeetCode solutions, test anti-paste auto-typing, and test panic hide.
                </p>
              </div>
              <div className="gateway-col-action">
                <span className="action-link">Launch Playground &rarr;</span>
              </div>
            </div>

            <div className="gateway-row" onClick={() => { playTechBeep('click'); onNavigate('compatibility'); }}>
              <div className="gateway-col-idx">
                <span className="editorial-idx">03</span>
                <span className="gateway-tag">Platform Protection</span>
              </div>
              <div className="gateway-col-body">
                <h3 className="gateway-title">Platform Compatibility &amp; Focus Defense</h3>
                <p className="gateway-desc">
                  Verified safe on HackerRank, CodeSignal, Proctorio, TestGorilla, Zoom, and Teams. Detailed breakdown of detection vectors vs Ghost AI defense.
                </p>
              </div>
              <div className="gateway-col-action">
                <span className="action-link">View Compatibility &rarr;</span>
              </div>
            </div>

            <div className="gateway-row" onClick={() => { playTechBeep('click'); onNavigate('pricing'); }}>
              <div className="gateway-col-idx">
                <span className="editorial-idx">04</span>
                <span className="gateway-tag">₹2.50 / Minute</span>
              </div>
              <div className="gateway-col-body">
                <h3 className="gateway-title">Transparent Pay-As-You-Go Pricing Console</h3>
                <p className="gateway-desc">
                  No monthly lock-in. Pay only for the exact interview runtime you need. 10 free trial minutes upon registration. Full admin control.
                </p>
              </div>
              <div className="gateway-col-action">
                <span className="action-link">Calculate Runtime &rarr;</span>
              </div>
            </div>

            <div className="gateway-row" onClick={() => { playTechBeep('click'); onNavigate('docs'); }}>
              <div className="gateway-col-idx">
                <span className="editorial-idx">05</span>
                <span className="gateway-tag">Setup &amp; Keys</span>
              </div>
              <div className="gateway-col-body">
                <h3 className="gateway-title">Developer Quickstart &amp; Shortcuts Index</h3>
                <p className="gateway-desc">
                  Complete 60-second installation guide, background stealth launcher (`run_stealth.vbs`), global hotkey index, and full FAQ.
                </p>
              </div>
              <div className="gateway-col-action">
                <span className="action-link">Read Documentation &rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Metrics & Proven Track Record */}
      <section className="metrics-section">
        <div className="minimal-container">
          <div className="metrics-grid">
            <div className="metric-box">
              <span className="m-number">14,000+</span>
              <span className="m-label">Live Interview Hours Powered</span>
            </div>
            <div className="metric-box">
              <span className="m-number">0</span>
              <span className="m-label">Detection or Proctor Incidents</span>
            </div>
            <div className="metric-box">
              <span className="m-number">100%</span>
              <span className="m-label">Screen Share Stream Exclusion</span>
            </div>
            <div className="metric-box">
              <span className="m-number">₹2.50</span>
              <span className="m-label">Cost per Minute (₹150 / hr)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom Call to Action */}
      <section className="statement-section">
        <div className="minimal-container">
          <div className="statement-box minimal-slate">
            <div className="statement-left">
              <h3 className="statement-title">Start your live interview with 100% confidence.</h3>
              <p className="statement-sub">Sign up now and receive 10 welcome minutes (₹25 value) instantly authorized by Admin.</p>
            </div>
            <div className="statement-right">
              <button
                className="btn-minimal-primary"
                onClick={() => {
                  playTechBeep('click');
                  if (activeUser) onOpenRecharge();
                  else onOpenAuth();
                }}
              >
                <IconZap size={14} />
                <span>{activeUser ? 'Recharge Minutes' : 'Get 10m Free Trial'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </HomeWrapper>
  );
}

const HomeWrapper = styled.div`
  padding-top: 0;

  .hero-section {
    position: relative;
    min-height: 100vh;
    min-height: 100dvh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 110px 1.5rem 80px 1.5rem;
    background: radial-gradient(circle at 50% 45%, rgba(6, 10, 16, 0.4) 0%, rgba(6, 10, 16, 0.85) 68%, var(--bg-canvas) 100%),
                url('/hero-bg.jpg') no-repeat center center / cover;
    overflow: hidden;
    border-bottom: 1px solid var(--border-subtle);
  }

  .hero-center-wrapper {
    max-width: 1160px;
    margin: 0 auto;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .hero-center-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0.35rem 0.95rem;
    border-radius: 9999px;
    background: rgba(82, 183, 136, 0.1);
    border: 1px solid rgba(82, 183, 136, 0.3);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--emerald-neon);
    margin-bottom: 1.5rem;
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--emerald-neon);
    box-shadow: 0 0 8px var(--emerald-neon);
  }

  .hero-headline.centered {
    font-family: var(--font-display);
    font-size: clamp(2.4rem, 4.6vw, 4.2rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.035em;
    color: var(--text-headline);
    margin-bottom: 1.4rem;
    max-width: 860px;
  }

  .hero-subtext.centered {
    font-size: 1.15rem;
    line-height: 1.7;
    color: var(--text-muted);
    margin-bottom: 2.2rem;
    max-width: 700px;

    strong {
      color: var(--text-headline);
      font-weight: 600;
    }
  }

  .hero-cta-strip.centered {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 14px;
    flex-wrap: wrap;
    margin-bottom: 2.5rem;
  }

  .btn-cmd-chip {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 12px;
    padding: 9px 14px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      border-color: var(--border-glass);
      color: var(--text-headline);
      background: rgba(255, 255, 255, 0.06);
    }
  }

  .cmd-symbol {
    color: var(--emerald-neon);
    font-weight: 700;
  }

  .hero-telemetry-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 0.55rem;
    width: 100%;
    max-width: 1200px;
    margin: 0.5rem auto 0 auto;
  }

  .telem-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0.5rem 0.75rem;
    border-radius: 9999px;
    background: rgba(9, 13, 20, 0.75);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border-subtle);
    font-size: 0.73rem;
    color: var(--text-muted);
    white-space: nowrap;

    strong {
      color: var(--text-headline);
    }
  }

  /* Pillars Section */
  .pillars-section {
    padding: 80px 0;
    border-top: 1px solid var(--border-subtle);
  }

  .section-head {
    margin-bottom: 2.5rem;
  }

  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;

    @media (max-width: 860px) {
      grid-template-columns: 1fr;
    }
  }

  .pillar-item {
    padding: 2rem;
    display: flex;
    flex-direction: column;
  }

  .pillar-num {
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 700;
    color: var(--emerald-neon);
    margin-bottom: 12px;
  }

  .pillar-title {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-headline);
    margin-bottom: 8px;
  }

  .pillar-text {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    flex: 1;
  }

  .pillar-tag {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--emerald-neon);
  }

  /* Marquee Section */
  .compat-marquee-section {
    padding: 30px 0;
    border-top: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
    background: rgba(0, 0, 0, 0.2);
  }

  .marquee-label {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 12px;
    text-align: center;
  }

  .platform-badges-row {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .platform-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--text-headline);
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border-subtle);
    padding: 5px 12px;
    border-radius: 9999px;
  }

  /* Gateways Section */
  .gateways-section {
    padding: 90px 0;
  }

  .gateways-header {
    margin-bottom: 2.5rem;
  }

  .gateways-list {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--border-subtle);
  }

  .gateway-row {
    display: grid;
    grid-template-columns: 140px 1fr 180px;
    gap: 2rem;
    align-items: center;
    padding: 1.75rem 0.5rem;
    border-bottom: 1px solid var(--border-subtle);
    cursor: pointer;
    transition: all 0.15s ease;

    @media (max-width: 860px) {
      grid-template-columns: 1fr;
      gap: 0.75rem;
    }

    &:hover {
      padding-left: 1rem;
      border-color: var(--border-glass);

      .gateway-title { color: var(--emerald-neon); }
      .action-link { color: var(--emerald-neon); transform: translateX(4px); }
    }
  }

  .gateway-col-idx {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .gateway-tag {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
  }

  .gateway-title {
    font-family: var(--font-display);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-headline);
    margin-bottom: 4px;
    transition: color 0.15s ease;
  }

  .gateway-desc {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.5;
    margin: 0;
  }

  .gateway-col-action {
    display: flex;
    justify-content: flex-end;
    @media (max-width: 860px) { justify-content: flex-start; }
  }

  .action-link {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-muted);
    transition: all 0.15s ease;
  }

  /* Metrics Section */
  .metrics-section {
    padding: 60px 0;
    border-top: 1px solid var(--border-subtle);
    border-bottom: 1px solid var(--border-subtle);
    background: rgba(0, 0, 0, 0.2);
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;

    @media (max-width: 860px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .metric-box {
    display: flex;
    flex-direction: column;
    text-align: center;
  }

  .m-number {
    font-family: var(--font-display);
    font-size: 2.5rem;
    font-weight: 900;
    color: var(--emerald-neon);
    line-height: 1;
    margin-bottom: 6px;
  }

  .m-label {
    font-size: 12px;
    color: var(--text-muted);
  }

  /* Statement Section */
  .statement-section {
    padding: 80px 0 100px 0;
  }

  .statement-box {
    padding: 3rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
  }

  .statement-title {
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--text-headline);
    margin-bottom: 6px;
  }

  .statement-sub {
    font-size: 13px;
    color: var(--text-muted);
    margin: 0;
  }

  /* Full Light Mode Styling for Home Page */
  &.light-mode,
  &[data-theme="light"],
  [data-theme="light"] & {
    .hero-section {
      background:
        radial-gradient(
          ellipse 85% 70% at 50% 48%,
          rgba(255, 255, 255, 0.88) 0%,
          rgba(255, 255, 255, 0.76) 36%,
          rgba(248, 250, 252, 0.38) 72%,
          rgba(248, 250, 252, 0.85) 100%
        ),
        url('/hero-bg-light.jpg') no-repeat center center / cover !important;
      border-bottom-color: rgba(0, 0, 0, 0.06);
    }

    .hero-center-tag {
      background: rgba(16, 185, 129, 0.1);
      border-color: rgba(16, 185, 129, 0.3);
      color: #047857;
    }

    .hero-headline.centered {
      color: #0f172a;

      .gradient-text {
        background: linear-gradient(135deg, #059669 0%, #0284c7 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }

    .hero-subtext.centered {
      color: #475569;

      strong {
        color: #0f172a;
        font-weight: 700;
      }
    }

    .btn-minimal-primary {
      background: #059669;
      color: #ffffff;
      box-shadow: 0 4px 18px rgba(5, 150, 105, 0.35);

      &:hover {
        background: #047857;
        box-shadow: 0 6px 24px rgba(5, 150, 105, 0.45);
      }
    }

    .btn-minimal-secondary {
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.12);
      color: #0f172a;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

      &:hover {
        background: #f8fafc;
        border-color: rgba(0, 0, 0, 0.22);
      }
    }

    .btn-cmd-chip {
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.12);
      color: #334155;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

      &:hover {
        background: #f8fafc;
        border-color: #059669;
        color: #0f172a;
      }

      .cmd-symbol {
        color: #059669;
      }
    }

    .telem-badge {
      background: rgba(255, 255, 255, 0.94);
      border: 1px solid rgba(226, 232, 240, 1);
      box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
      color: #475569;

      strong {
        color: #0f172a;
      }
    }

    .pillars-section {
      border-top-color: #e2e8f0;
    }

    .section-head {
      .editorial-idx {
        color: #059669;
      }
      .minimal-headline {
        color: #0f172a;
      }
      .minimal-sub {
        color: #475569;
      }
    }

    .pillar-item {
      background: #ffffff;
      border: 1px solid rgba(226, 232, 240, 1);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 2px 6px -1px rgba(0, 0, 0, 0.02);

      .pillar-num {
        color: #059669;
      }

      .pillar-title {
        color: #0f172a;
      }

      .pillar-text {
        color: #475569;
      }

      .pillar-tag {
        background: rgba(5, 150, 105, 0.08);
        border: 1px solid rgba(5, 150, 105, 0.2);
        color: #047857;
      }
    }

    .compat-marquee-section {
      border-top-color: #e2e8f0;
      border-bottom-color: #e2e8f0;
      background: rgba(248, 250, 252, 0.8);

      .marquee-label {
        color: #64748b;
      }
    }

    .platform-chip {
      background: #ffffff;
      border: 1px solid rgba(226, 232, 240, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
      color: #334155;
    }

    .gateways-section {
      border-top-color: #e2e8f0;

      .gateways-header {
        .editorial-idx {
          color: #059669;
        }
        .minimal-headline {
          color: #0f172a;
        }
        .minimal-sub {
          color: #475569;
        }
      }
    }

    .gateway-row {
      border-top-color: #e2e8f0;

      &:hover {
        background: #ffffff;
        border-color: rgba(5, 150, 105, 0.3);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.04);
      }

      .editorial-idx {
        color: #059669;
      }

      .gateway-tag {
        background: rgba(5, 150, 105, 0.08);
        border: 1px solid rgba(5, 150, 105, 0.2);
        color: #047857;
      }

      .gateway-title {
        color: #0f172a;
      }

      .gateway-desc {
        color: #475569;
      }

      .action-link {
        color: #059669;
        font-weight: 700;
      }
    }

    .metrics-section {
      border-top-color: #e2e8f0;
      border-bottom-color: #e2e8f0;
      background: #ffffff;

      .m-number {
        color: #059669;
      }

      .m-label {
        color: #475569;
      }
    }

    .statement-box {
      background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
      border: 1px solid rgba(5, 150, 105, 0.25);
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.05);

      .statement-title {
        color: #0f172a;
      }

      .statement-sub {
        color: #475569;
      }

      .btn-minimal-primary {
        background: #059669;
        color: #ffffff;

        &:hover {
          background: #047857;
        }
      }
    }
  }
`;
