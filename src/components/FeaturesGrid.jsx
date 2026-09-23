import React, { useState } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';
import { IconShieldCheck, IconMonitor, IconCode, IconMic, IconZap, IconEyeOff } from './Icons';

const CAPABILITIES = [
  {
    id: 'zoom_teams',
    index: '01',
    category: 'Screen Share',
    platform: 'Zoom & Microsoft Teams',
    headline: 'Full Desktop Video Stream Exclusion',
    detectionMethod: 'Meeting software captures your active display buffer.',
    ghostSolution: 'Hardware-level display affinity masks Ghost AI from the compositor, ensuring zero pixels are transmitted to meeting participants or recording bots.',
    verifiedTag: '100% Invisible on Stream',
    telemetry: '0 Pixels Captured &bull; 60FPS Fluid'
  },
  {
    id: 'hackerrank_codesignal',
    index: '02',
    category: 'Coding Assessment',
    platform: 'HackerRank & CodeSignal',
    headline: 'Safe Focus Lock Protection',
    detectionMethod: 'Browser monitors window.onblur and visibilitychange events when clicking outside the test page.',
    ghostSolution: 'Ghost AI runs without stealing foreground focus. Clicking or reading the overlay never triggers a tab-switch or window blur warning.',
    verifiedTag: 'Zero Tab-Switch Alerts',
    telemetry: 'window.onblur: 0 &bull; Safe Clicks'
  },
  {
    id: 'meet_webrtc',
    index: '03',
    category: 'WebRTC Calls',
    platform: 'Google Meet, Slack & Discord',
    headline: 'Single-Monitor Stealth Sharing',
    detectionMethod: 'Captures full browser or desktop screens directly in Chromium or Electron.',
    ghostSolution: 'Excludes the floating assistant cleanly on single-laptop screens without requiring secondary monitors or HDMI capture cards.',
    verifiedTag: 'Single Screen Safe',
    telemetry: '0 External Hardware Needed'
  },
  {
    id: 'proctorio_testgorilla',
    index: '04',
    category: 'Browser Lockdown',
    platform: 'Proctorio, TestGorilla & Codility',
    headline: 'Native OS Process Independence',
    detectionMethod: 'Browser extensions monitor browser memory, tabs, and clipboard.',
    ghostSolution: 'Ghost AI operates as a native standalone desktop application completely outside the browser extension sandbox.',
    verifiedTag: 'Sandbox Independent',
    telemetry: 'External Process &bull; Undetected'
  },
  {
    id: 'auto_typer',
    index: '05',
    category: 'Anti-Paste Shield',
    platform: 'Human Typing Simulation',
    headline: 'Natural Keystroke Cadence',
    detectionMethod: 'Proctored IDEs flag instant paste events and unnatural 500 WPM text dumps.',
    ghostSolution: 'Simulates natural human typing at 40-75 WPM with organic micro-delays between characters, bypassing anti-paste blockers effortlessly.',
    verifiedTag: 'Realistic Human Cadence',
    telemetry: '45 WPM &bull; Random Delays'
  },
  {
    id: 'audio_listener',
    index: '06',
    category: 'Audio Intelligence',
    platform: 'Live Speech Ear & Gemini Live',
    headline: 'Direct Speaker Audio Ear',
    detectionMethod: 'Candidate speaking answers vs typing.',
    ghostSolution: 'Listens directly to interviewer questions through loopback audio and generates crisp talking points in real time.',
    verifiedTag: 'Loopback Audio Ear',
    telemetry: 'Real-time Speech-to-Text'
  }
];

export default function FeaturesGrid({ theme }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeItem = CAPABILITIES[activeIdx];

  return (
    <FeaturesWrapper id="features">
      <div className="minimal-container">
        {/* Minimal Section Header */}
        <div className="section-head">
          <div className="minimal-tag">
            <IconShieldCheck size={13} color="var(--emerald-neon)" />
            <span>PLATFORM COMPATIBILITY &amp; CAPABILITIES</span>
          </div>
          <h2 className="minimal-headline">
            Engineered for Every Platform
          </h2>
          <p className="minimal-sub">
            Verified across every major video conference app, proctored code environment, and technical interview portal.
          </p>
        </div>

        {/* Asymmetrical Editorial Index (No Cards) */}
        <div className="editorial-split-layout">
          {/* Left Column: Numbered Interactive Directory */}
          <div className="capabilities-index">
            {CAPABILITIES.map((item, idx) => {
              const isSelected = activeIdx === idx;
              return (
                <div
                  key={item.id}
                  className={`index-row ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    playTechBeep('click');
                    setActiveIdx(idx);
                  }}
                  onMouseEnter={() => {
                    if (activeIdx !== idx) setActiveIdx(idx);
                  }}
                >
                  <span className="row-num">{item.index}</span>
                  <div className="row-info">
                    <span className="row-category">{item.category}</span>
                    <span className="row-platform">{item.platform}</span>
                  </div>
                  <span className="row-arrow">&rarr;</span>
                </div>
              );
            })}
          </div>

          {/* Right Column: Sleek Architectural Slate Preview */}
          <div className="capability-preview-slate minimal-slate">
            <div className="preview-top">
              <span className="preview-badge">{activeItem.category}</span>
              <span className="preview-verified-tag">{activeItem.verifiedTag}</span>
            </div>

            <h3 className="preview-headline">{activeItem.headline}</h3>
            <div className="preview-platform-sub">Target: <strong>{activeItem.platform}</strong></div>

            <div className="preview-analysis">
              <div className="analysis-block">
                <span className="analysis-label">Platform Detection Vector:</span>
                <p className="analysis-text">{activeItem.detectionMethod}</p>
              </div>

              <div className="analysis-block solution-block">
                <span className="analysis-label solution-label">Ghost AI Protection:</span>
                <p className="analysis-text">{activeItem.ghostSolution}</p>
              </div>
            </div>

            <div className="preview-footer">
              <span className="telemetry-chip">{activeItem.telemetry}</span>
              <a href="#simulator" className="preview-link" onClick={() => playTechBeep('click')}>
                Test In Simulator &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </FeaturesWrapper>
  );
}

const FeaturesWrapper = styled.section`
  padding: 100px 0;
  position: relative;

  .section-head {
    margin-bottom: 3rem;
  }

  .editorial-split-layout {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 3rem;
    align-items: start;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  .capabilities-index {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--border-subtle);
  }

  .index-row {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    padding: 1.25rem 0.5rem;
    border-bottom: 1px solid var(--border-subtle);
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      padding-left: 0.75rem;
      border-color: var(--border-glass);

      .row-platform {
        color: var(--text-headline);
      }

      .row-arrow {
        transform: translateX(4px);
        color: var(--emerald-neon);
      }
    }

    &.active {
      border-color: var(--emerald-neon);

      .row-num {
        color: var(--emerald-neon);
      }

      .row-platform {
        color: var(--text-headline);
        font-weight: 700;
      }

      .row-arrow {
        color: var(--emerald-neon);
        opacity: 1;
      }
    }
  }

  .row-num {
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 700;
    color: var(--text-muted);
    transition: color 0.15s ease;
  }

  .row-info {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .row-category {
    font-family: var(--font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--text-muted);
    margin-bottom: 2px;
  }

  .row-platform {
    font-size: 15px;
    font-weight: 600;
    color: var(--text-body);
    transition: color 0.15s ease;
  }

  .row-arrow {
    font-size: 14px;
    color: var(--text-muted);
    opacity: 0.5;
    transition: all 0.15s ease;
  }

  /* Right Column Preview Slate */
  .capability-preview-slate {
    padding: 2rem;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.25);
  }

  .preview-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }

  .preview-badge {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .preview-verified-tag {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    color: var(--emerald-neon);
    background: rgba(45, 212, 191, 0.1);
    border: 1px solid rgba(45, 212, 191, 0.3);
    padding: 3px 10px;
    border-radius: 9999px;
  }

  .preview-headline {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 800;
    line-height: 1.2;
    color: var(--text-headline);
    margin-bottom: 0.5rem;
  }

  .preview-platform-sub {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 1.75rem;

    strong {
      color: var(--text-headline);
    }
  }

  .preview-analysis {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    margin-bottom: 2rem;
  }

  .analysis-block {
    padding: 1rem;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
  }

  .solution-block {
    border-color: rgba(45, 212, 191, 0.25);
    background: rgba(45, 212, 191, 0.04);
  }

  .analysis-label {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
    display: block;
    margin-bottom: 6px;
  }

  .solution-label {
    color: var(--emerald-neon);
  }

  .analysis-text {
    font-size: 13px;
    line-height: 1.55;
    color: var(--text-body);
    margin: 0;
  }

  .preview-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid var(--border-subtle);
    flex-wrap: wrap;
    gap: 10px;
  }

  .telemetry-chip {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
  }

  .preview-link {
    font-size: 12px;
    font-weight: 700;
    color: var(--emerald-neon);
    text-decoration: none;
    transition: opacity 0.15s ease;

    &:hover {
      opacity: 0.8;
    }
  }
`;
