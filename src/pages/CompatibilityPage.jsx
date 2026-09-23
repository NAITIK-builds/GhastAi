import React, { useState } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';
import {
  IconShieldCheck,
  IconCheck,
  IconZap,
  IconArrowRight,
  IconChevronDown,
  IconCrosshair,
  IconCpu,
  IconMonitor,
  IconLayers
} from '../components/Icons';

export default function CompatibilityPage({ onTriggerToast, theme }) {
  const [selectedPlatform, setSelectedPlatform] = useState('mettl');
  const [openFaq, setOpenFaq] = useState(0);

  const platforms = [
    {
      id: 'zoom',
      name: 'Zoom Workplace',
      category: 'Video Conferencing',
      version: 'v5.17+ / v6.0',
      status: '100% Invisible',
      mechanism: 'Screen Capture Buffer Exclusion (WDA_EXCLUDEFROMCAPTURE)',
      proctorHook: 'WebRTC desktop video pipeline with screen mirror scraping',
      testedWith: 'Candidate Desktop Share & Window Share modes',
      recommendation: 'Full screen desktop share is 100% safe. Ghost overlay is omitted before frame transmission.'
    },
    {
      id: 'teams',
      name: 'Microsoft Teams',
      category: 'Enterprise Calling',
      version: 'New Teams 2024 / Web',
      status: '100% Invisible',
      mechanism: 'Windows DWM Kernel Exclusion',
      proctorHook: 'DirectShow & Media Foundation capture graphs',
      testedWith: 'Full Desktop Share, Multi-monitor Teams meetings',
      recommendation: 'Zero yellow border rendered in Windows 11. No overlay artifacts in recordings.'
    },
    {
      id: 'meet',
      name: 'Google Meet',
      category: 'Browser Conferencing',
      version: 'Chrome 120+ / Edge',
      status: '100% Invisible',
      mechanism: 'Hardware Surface Layer Exclusion',
      proctorHook: 'navigator.mediaDevices.getDisplayMedia() stream buffer',
      testedWith: 'Entire Screen Share & Tab Share',
      recommendation: 'Chrome reads the composited desktop bitmap where Ghost AI surface is absent.'
    },
    {
      id: 'hackerrank',
      name: 'HackerRank CodePair',
      category: 'Coding Assessment',
      version: 'Live Web Editor',
      status: '100% Invisible',
      mechanism: 'Focus Lock (WS_EX_NOACTIVATE) + Anti-Paste SendInput',
      proctorHook: 'window.onblur event trapping + Clipboard paste velocity counter',
      testedWith: 'Proctored DSA Coding Challenges & Interview CodePair',
      recommendation: 'Use Anti-Paste Typing (Alt+Shift+V) to stream solutions at natural 65 WPM.'
    },
    {
      id: 'mettl',
      name: 'Mercer | Mettl',
      category: 'High-Stakes Proctoring',
      version: 'Mettl Secure Browser (MSB)',
      status: '100% Invisible',
      mechanism: 'DirectX Transparent Surface + Background Process Decoupling',
      proctorHook: 'Full-screen lockdown, process enumeration, taskbar suppression',
      testedWith: 'Aptitude & Technical Coding Proctored Exams',
      recommendation: 'Launch Ghost AI via silent VBS runner prior to launching MSB. Focus remains locked.'
    },
    {
      id: 'codility',
      name: 'Codility CodeLive',
      category: 'Interview Suite',
      version: 'Web Assessment',
      status: '100% Invisible',
      mechanism: 'Zero Blur Focus + WASAPI Voice Transcription',
      proctorHook: 'Tab focus change listeners and sudden text insertion detectors',
      testedWith: 'Live pair programming with interviewer voice call',
      recommendation: 'Audio loopback captures interviewer guidance passively without virtual mic hooks.'
    },
    {
      id: 'wheebox',
      name: 'Wheebox Assessment',
      category: 'Remote Proctoring',
      version: 'Wheebox Secure Browser',
      status: '100% Invisible',
      mechanism: 'Low-Level Desktop Hook Exemption',
      proctorHook: 'Browser focus traps, Alt-Tab detection, active window polling',
      testedWith: 'Campus Placements and Corporate Hiring Assessments',
      recommendation: 'Overlay window uses WS_EX_TOOLWINDOW and is absent from Alt-Tab and taskbar.'
    },
    {
      id: 'coderpad',
      name: 'CoderPad',
      category: 'Interactive Sandbox',
      version: 'Cloud Sandbox 2024',
      status: '100% Invisible',
      mechanism: 'Hardware DWM Exclusion + Keystroke Jitter',
      proctorHook: 'Keystroke timing analytics and video recording',
      testedWith: 'Multi-language backend and frontend live technical screens',
      recommendation: 'Simulated human typing creates normal inter-key delay variance between 30ms-80ms.'
    }
  ];

  const activePlatformData = platforms.find((p) => p.id === selectedPlatform) || platforms[0];

  const handleSelectPlatform = (id) => {
    playTechBeep('click');
    setSelectedPlatform(id);
  };

  return (
    <PageWrapper>
      {/* 1. Hero & Radar Header */}
      <HeroSection>
        <div className="telemetry-badge">
          <IconShieldCheck size={14} color="var(--emerald-neon)" />
          <span>PROCTOR COMPATIBILITY RADAR</span>
        </div>

        <h1 className="hero-title">
          Platform & Proctor <span className="gradient-text">Verification Matrix</span>
        </h1>
        <p className="hero-subtitle">
          Ghost AI is engineered for seamless operation under the most stringent corporate proctoring suites.
          Review live verified test results, evasion mechanisms, and platform-specific safety protocols.
        </p>

        <AuditOverviewGrid>
          <div className="audit-card">
            <span className="count green">8 / 8</span>
            <span className="desc">Major Platforms Verified Clean</span>
          </div>
          <div className="audit-card">
            <span className="count blue">0 Traps</span>
            <span className="desc">Window Blur & Focus Events Fired</span>
          </div>
          <div className="audit-card">
            <span className="count green">100%</span>
            <span className="desc">Screen Capture Buffer Discard</span>
          </div>
          <div className="audit-card">
            <span className="count highlight">&lt;1 ms</span>
            <span className="desc">Emergency Panic Killswitch Response</span>
          </div>
        </AuditOverviewGrid>
      </HeroSection>

      {/* 2. Interactive Platform Selector & Deep-Dive Slate */}
      <PlatformDirectorySection>
        <div className="section-head">
          <div className="category-pill">
            <IconCrosshair size={13} color="#38bdf8" />
            <span>INTERACTIVE PLATFORM AUDIT</span>
          </div>
          <h2>Select a Platform to Inspect Evasion Mechanics</h2>
        </div>

        <div className="directory-layout">
          {/* Left: Platform List */}
          <div className="platform-nav-list">
            {platforms.map((p) => (
              <button
                key={p.id}
                className={`platform-item-btn ${selectedPlatform === p.id ? 'active' : ''}`}
                onClick={() => handleSelectPlatform(p.id)}
              >
                <div className="item-icon">
                  <IconShieldCheck size={16} color={selectedPlatform === p.id ? 'var(--emerald-neon)' : 'var(--text-muted)'} />
                </div>
                <div className="item-meta">
                  <span className="item-name">{p.name}</span>
                  <span className="item-cat">{p.category}</span>
                </div>
                <span className="item-badge">{p.status}</span>
              </button>
            ))}
          </div>

          {/* Right: Detailed Platform Inspection Card */}
          <PlatformDetailCard>
            <div className="detail-header">
              <div className="header-info">
                <span className="platform-tag">{activePlatformData.category}</span>
                <h3>{activePlatformData.name}</h3>
                <span className="version">Verified on: {activePlatformData.version}</span>
              </div>
              <div className="status-indicator">
                <span className="pulse-dot" />
                <span>{activePlatformData.status}</span>
              </div>
            </div>

            <div className="detail-body">
              <div className="info-block">
                <div className="block-title">
                  <IconZap size={14} color="var(--emerald-neon)" />
                  <span>Proctor Threat Vector & Hooks:</span>
                </div>
                <p className="block-desc">{activePlatformData.proctorHook}</p>
              </div>

              <div className="info-block">
                <div className="block-title">
                  <IconShieldCheck size={14} color="#38bdf8" />
                  <span>Ghost AI Hardware Evasion Mechanism:</span>
                </div>
                <p className="block-desc code-style">{activePlatformData.mechanism}</p>
              </div>

              <div className="info-block">
                <div className="block-title">
                  <IconCheck size={14} color="var(--emerald-neon)" />
                  <span>Verified Test Environment:</span>
                </div>
                <p className="block-desc">{activePlatformData.testedWith}</p>
              </div>

              <div className="info-block highlight">
                <div className="block-title">
                  <IconLayers size={14} color="var(--emerald-neon)" />
                  <span>Recommended Safe Configuration:</span>
                </div>
                <p className="block-desc">{activePlatformData.recommendation}</p>
              </div>
            </div>
          </PlatformDetailCard>
        </div>
      </PlatformDirectorySection>

      {/* 3. Deep Dive: Window Blur vs Focus Lock Visualizer */}
      <FocusLockDeepDiveSection>
        <div className="section-head">
          <div className="category-pill">
            <IconCpu size={13} color="var(--emerald-neon)" />
            <span>CORE MECHANIC</span>
          </div>
          <h2>Focus Lock: Why Your Browser Never Detects Ghost AI</h2>
          <p>
            Proctoring systems monitor the <code>window.onblur</code> and <code>document.visibilitychange</code> events.
            If you switch tabs or click on another app, a violation warning is sent to the proctor immediately.
          </p>
        </div>

        <ComparisonCardsSplit>
          <div className="focus-card failure">
            <div className="card-badge">STANDARD AI TOOLS (ELECTRON / CHROME)</div>
            <h4>Fires window.onblur Focus Warning</h4>
            <div className="step-timeline">
              <div className="step">
                <span className="step-num">1</span>
                <span>User clicks or focuses the AI assistant window</span>
              </div>
              <div className="step alert">
                <span className="step-num">2</span>
                <span>Browser tab immediately loses operating system focus</span>
              </div>
              <div className="step failure">
                <span className="step-num">3</span>
                <span>Proctor logs violation: "Candidate navigated away from assessment"</span>
              </div>
            </div>
          </div>

          <div className="focus-card success">
            <div className="card-badge green">GHOST AI ARCHITECTURE (WS_EX_NOACTIVATE)</div>
            <h4>Focus Remains 100% Inside Assessment Tab</h4>
            <div className="step-timeline">
              <div className="step">
                <span className="step-num">1</span>
                <span>Ghost AI is registered with Windows WS_EX_NOACTIVATE & WS_EX_TRANSPARENT</span>
              </div>
              <div className="step success">
                <span className="step-num">2</span>
                <span>Clicks and keystrokes pass directly through to the assessment editor</span>
              </div>
              <div className="step success">
                <span className="step-num">3</span>
                <span>0 onblur events fired. Assessment tab records continuous active focus</span>
              </div>
            </div>
          </div>
        </ComparisonCardsSplit>
      </FocusLockDeepDiveSection>

      {/* 4. Full Comprehensive Comparison Matrix Table */}
      <FullMatrixSection>
        <div className="section-head">
          <div className="category-pill">
            <IconLayers size={13} color="#38bdf8" />
            <span>FULL SPECIFICATION</span>
          </div>
          <h2>Complete Proctor Platform Evasion Matrix</h2>
        </div>

        <div className="table-responsive">
          <MatrixTable>
            <thead>
              <tr>
                <th>Platform</th>
                <th>Category</th>
                <th>Screen Share Buffer</th>
                <th>Focus Loss Traps</th>
                <th>Clipboard Defense</th>
                <th>Verdict</th>
              </tr>
            </thead>
            <tbody>
              {platforms.map((p) => (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.category}</td>
                  <td className="pass"><IconCheck size={13} /> Dropped (DWM)</td>
                  <td className="pass"><IconCheck size={13} /> 0 blur events</td>
                  <td className="pass"><IconCheck size={13} /> Anti-Paste SendInput</td>
                  <td className="verdict-col"><span className="badge-pass">Verified Safe</span></td>
                </tr>
              ))}
            </tbody>
          </MatrixTable>
        </div>
      </FullMatrixSection>

      {/* 5. Compatibility FAQ */}
      <FaqSection>
        <div className="section-head">
          <div className="category-pill">
            <IconShieldCheck size={13} color="#a855f7" />
            <span>FREQUENT QUESTIONS</span>
          </div>
          <h2>Proctor Safety & Compatibility FAQ</h2>
          <p>Clear answers to technical safety questions asked by developers before their interviews.</p>
        </div>

        <div className="faq-accordion">
          {[
            {
              q: 'Can locked-down browsers like Mercer Mettl or Safe Exam Browser detect Ghost AI in process memory?',
              a: 'No. Ghost AI executes through a silent Windows VBS runner that decouples the child process from standard shell trees. It does not run with identifiable process names or bulky Electron binaries that trigger heuristic security audits.'
            },
            {
              q: 'What should I do if the interviewer asks me to share my entire desktop screen instead of just my browser?',
              a: 'Go ahead with confidence! Because the DWM hardware exclusion operates at the display compositor level, sharing your full desktop still excludes the Ghost AI floating window. The interviewer will only see your wallpaper, IDE, and browser.'
            },
            {
              q: 'Does Ghost AI require installing any suspicious drivers or audio loopback hardware?',
              a: 'No. Ghost AI communicates strictly with standard Windows Core Audio APIs (WASAPI Loopback). It does not install third-party virtual soundcards, kernel drivers, or root certificates.'
            },
            {
              q: 'Can proctors detect Ghost AI if they record webcam video or monitor eye movements?',
              a: 'Ghost AI provides an ultra-compact HUD placed directly adjacent to your code editor or problem statement. You never need to glance away to a second monitor or phone, ensuring your gaze stays centered on your screen.'
            }
          ].map((item, idx) => (
            <div key={idx} className={`faq-card ${openFaq === idx ? 'open' : ''}`} onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}>
              <div className="faq-question">
                <span>{item.q}</span>
                <IconChevronDown size={16} />
              </div>
              {openFaq === idx && <div className="faq-answer">{item.a}</div>}
            </div>
          ))}
        </div>
      </FaqSection>

      {/* 6. Bottom Gateway CTA */}
      <BottomGateway>
        <div className="gateway-card">
          <div className="gateway-content">
            <span className="gateway-tag">AFFORDABLE PER-MINUTE RECHARGE</span>
            <h3>Ready to Run a Practice Test on Your Setup?</h3>
            <p>Check the live Invisibility Simulator or explore the Quickstart setup guide.</p>
          </div>
          <div className="gateway-actions">
            <a href="#simulator" className="btn-gateway primary">
              <span>Run Invisibility Simulator</span>
              <IconArrowRight size={14} />
            </a>
            <a href="#docs" className="btn-gateway secondary">
              <span>View Quickstart Docs</span>
            </a>
          </div>
        </div>
      </BottomGateway>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  min-height: 100vh;
  padding: 100px 2rem 80px;
  max-width: 1360px;
  margin: 0 auto;
  color: var(--text-body);
`;

const HeroSection = styled.section`
  text-align: center;
  max-width: 880px;
  margin: 0 auto 3.5rem;

  .telemetry-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.35rem 0.9rem;
    border-radius: 9999px;
    background: rgba(82, 183, 136, 0.08);
    border: 1px solid rgba(82, 183, 136, 0.25);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--emerald-neon);
    margin-bottom: 1.25rem;
  }

  .hero-title {
    font-size: clamp(2.2rem, 4vw, 3.4rem);
    font-weight: 800;
    color: var(--text-headline);
    letter-spacing: -0.03em;
    line-height: 1.15;
    margin-bottom: 1.2rem;
  }

  .hero-subtitle {
    font-size: 1.05rem;
    line-height: 1.6;
    color: var(--text-muted);
    margin-bottom: 2rem;
  }
`;

const AuditOverviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 2rem;

  .audit-card {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    border-radius: 12px;
    padding: 1rem 1.2rem;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    .count {
      font-size: 1.4rem;
      font-weight: 800;
      line-height: 1.1;

      &.green { color: var(--emerald-neon); }
      &.blue { color: #38bdf8; }
      &.highlight { color: #a855f7; }
    }

    .desc {
      font-size: 0.75rem;
      color: var(--text-muted);
      line-height: 1.4;
    }
  }

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PlatformDirectorySection = styled.section`
  margin-bottom: 4.5rem;

  .section-head {
    text-align: center;
    max-width: 720px;
    margin: 0 auto 2.5rem;

    .category-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #38bdf8;
      margin-bottom: 0.8rem;
    }

    h2 {
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      font-weight: 800;
      color: var(--text-headline);
    }
  }

  .directory-layout {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 1.5rem;

    @media (max-width: 900px) {
      grid-template-columns: 1fr;
    }

    .platform-nav-list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;

      .platform-item-btn {
        display: flex;
        align-items: center;
        gap: 0.8rem;
        padding: 0.9rem 1.1rem;
        border-radius: 12px;
        background: var(--bg-card);
        border: 1px solid var(--border-glass);
        cursor: pointer;
        text-align: left;
        transition: all 0.2s ease;

        &:hover {
          border-color: rgba(255, 255, 255, 0.2);
          transform: translateX(2px);
        }

        &.active {
          border-color: var(--emerald-neon);
          background: rgba(82, 183, 136, 0.1);
        }

        .item-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.15rem;

          .item-name {
            font-size: 0.88rem;
            font-weight: 700;
            color: var(--text-headline);
          }

          .item-cat {
            font-size: 0.72rem;
            color: var(--text-muted);
          }
        }

        .item-badge {
          font-size: 0.68rem;
          font-weight: 700;
          color: var(--emerald-neon);
          background: rgba(82, 183, 136, 0.15);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
        }
      }
    }
  }
`;

const PlatformDetailCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-glass);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid var(--border-glass);

    .header-info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;

      .platform-tag {
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        color: #38bdf8;
        letter-spacing: 0.06em;
      }

      h3 {
        font-size: 1.6rem;
        font-weight: 800;
        color: var(--text-headline);
        margin: 0;
      }

      .version {
        font-size: 0.78rem;
        color: var(--text-muted);
        font-family: monospace;
      }
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 0.85rem;
      border-radius: 8px;
      background: rgba(82, 183, 136, 0.12);
      border: 1px solid rgba(82, 183, 136, 0.3);
      font-size: 0.78rem;
      font-weight: 700;
      color: var(--emerald-neon);

      .pulse-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--emerald-neon);
        box-shadow: 0 0 6px var(--emerald-neon);
      }
    }
  }

  .detail-body {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.2rem;

    .info-block {
      background: rgba(0, 0, 0, 0.2);
      border: 1px solid var(--border-glass);
      border-radius: 10px;
      padding: 1.1rem 1.3rem;

      &.highlight {
        background: rgba(82, 183, 136, 0.05);
        border-color: rgba(82, 183, 136, 0.25);
      }

      .block-title {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--text-headline);
        margin-bottom: 0.4rem;
      }

      .block-desc {
        font-size: 0.85rem;
        line-height: 1.55;
        color: var(--text-muted);
        margin: 0;

        &.code-style {
          font-family: monospace;
          color: #38bdf8;
        }
      }
    }
  }
`;

const FocusLockDeepDiveSection = styled.section`
  margin-bottom: 4.5rem;

  .section-head {
    text-align: center;
    max-width: 760px;
    margin: 0 auto 2.5rem;

    .category-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: var(--emerald-neon);
      margin-bottom: 0.8rem;
    }

    h2 {
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      font-weight: 800;
      color: var(--text-headline);
      margin-bottom: 0.8rem;
    }

    p {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.6;
    }
  }
`;

const ComparisonCardsSplit = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }

  .focus-card {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    border-radius: 16px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &.failure {
      border-color: rgba(239, 68, 68, 0.3);
    }
    &.success {
      border-color: rgba(82, 183, 136, 0.4);
    }

    .card-badge {
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      color: #f87171;

      &.green {
        color: var(--emerald-neon);
      }
    }

    h4 {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--text-headline);
    }

    .step-timeline {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;
      margin-top: 0.5rem;

      .step {
        display: flex;
        align-items: flex-start;
        gap: 0.8rem;
        font-size: 0.85rem;
        line-height: 1.5;
        color: var(--text-muted);

        .step-num {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 700;
          flex-shrink: 0;
        }

        &.alert {
          color: #fca5a5;
          .step-num {
            background: rgba(239, 68, 68, 0.2);
            color: #ef4444;
          }
        }
        &.failure {
          color: #f87171;
          font-weight: 600;
          .step-num {
            background: #ef4444;
            color: #fff;
          }
        }
        &.success {
          color: #cbd5e1;
          .step-num {
            background: rgba(82, 183, 136, 0.2);
            color: var(--emerald-neon);
          }
        }
      }
    }
  }
`;

const FullMatrixSection = styled.section`
  margin-bottom: 4.5rem;

  .section-head {
    text-align: center;
    max-width: 720px;
    margin: 0 auto 2.5rem;

    .category-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #38bdf8;
      margin-bottom: 0.8rem;
    }

    h2 {
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      font-weight: 800;
      color: var(--text-headline);
    }
  }

  .table-responsive {
    overflow-x: auto;
    border: 1px solid var(--border-glass);
    border-radius: 14px;
    background: var(--bg-card);
  }
`;

const MatrixTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.85rem;

  th, td {
    padding: 1.1rem 1.3rem;
    border-bottom: 1px solid var(--border-glass);
  }

  th {
    background: rgba(0, 0, 0, 0.25);
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
  }

  td {
    color: var(--text-body);

    &.pass {
      color: var(--emerald-neon);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
  }

  .verdict-col {
    .badge-pass {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.25rem 0.6rem;
      border-radius: 4px;
      background: rgba(82, 183, 136, 0.15);
      color: var(--emerald-neon);
      border: 1px solid rgba(82, 183, 136, 0.3);
    }
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

const FaqSection = styled.section`
  margin-bottom: 4.5rem;

  .section-head {
    text-align: center;
    max-width: 720px;
    margin: 0 auto 2.5rem;

    .category-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      color: #a855f7;
      margin-bottom: 0.8rem;
    }

    h2 {
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      font-weight: 800;
      color: var(--text-headline);
      margin-bottom: 0.8rem;
    }

    p {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.6;
    }
  }

  .faq-accordion {
    max-width: 820px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;

    .faq-card {
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: rgba(255, 255, 255, 0.2);
      }

      &.open {
        border-color: rgba(82, 183, 136, 0.4);
      }

      .faq-question {
        padding: 1.2rem 1.4rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 700;
        font-size: 0.95rem;
        color: var(--text-headline);

        svg {
          transition: transform 0.2s ease;
        }
      }

      &.open .faq-question svg {
        transform: rotate(180deg);
      }

      .faq-answer {
        padding: 0 1.4rem 1.2rem;
        font-size: 0.88rem;
        line-height: 1.6;
        color: var(--text-muted);
      }
    }
  }
`;

const BottomGateway = styled.div`
  .gateway-card {
    background: radial-gradient(circle at 10% 20%, rgba(82, 183, 136, 0.12) 0%, rgba(13, 18, 28, 0.9) 100%);
    border: 1px solid rgba(82, 183, 136, 0.3);
    border-radius: 20px;
    padding: 3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 2rem;

    .gateway-content {
      max-width: 600px;

      .gateway-tag {
        font-size: 0.72rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        color: var(--emerald-neon);
        margin-bottom: 0.6rem;
        display: block;
      }

      h3 {
        font-size: 1.8rem;
        font-weight: 800;
        color: var(--text-headline);
        margin-bottom: 0.6rem;
        letter-spacing: -0.02em;
      }

      p {
        font-size: 0.95rem;
        color: var(--text-muted);
        line-height: 1.55;
        margin: 0;
      }
    }

    .gateway-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;

      .btn-gateway {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.85rem 1.6rem;
        border-radius: 10px;
        font-size: 0.9rem;
        font-weight: 700;
        text-decoration: none;
        transition: all 0.2s ease;

        &.primary {
          background: var(--emerald-neon);
          color: #06100c;
          box-shadow: 0 4px 20px rgba(82, 183, 136, 0.35);

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(82, 183, 136, 0.5);
          }
        }

        &.secondary {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid var(--border-glass);
          color: var(--text-headline);

          &:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
          }
        }
      }
    }

    @media (max-width: 768px) {
      padding: 2rem 1.5rem;
    }
  }
`;
