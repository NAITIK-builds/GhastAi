import React, { useState } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';
import {
  IconShieldCheck,
  IconEyeOff,
  IconCrosshair,
  IconZap,
  IconCheck,
  IconMonitor,
  IconArrowRight,
  IconChevronDown,
  IconCpu,
  IconLayers,
  IconPanic
} from '../components/Icons';

export default function SimulatorPage({ onTriggerToast, theme }) {
  const [activePlatform, setActivePlatform] = useState('zoom');
  const [overlayActive, setOverlayActive] = useState(true);
  const [opacityLevel, setOpacityLevel] = useState(90);
  const [penTesting, setPenTesting] = useState(false);
  const [testResults, setTestResults] = useState([
    { id: 1, name: 'Window Focus Retention (window.onblur)', vector: 'Focus Event Traps', status: 'Passed', detail: '0 blur events fired. Focus remains 100% locked on coding editor.' },
    { id: 2, name: 'DirectX Desktop Duplication (DXGI)', vector: 'Screen Buffer Scraping', status: 'Passed', detail: 'WDA_EXCLUDEFROMCAPTURE hardware flag drops overlay layer from mirror pool.' },
    { id: 3, name: 'Windows 11 Capture Yellow Border', vector: 'Visual Proctor Warning', status: 'Passed', detail: 'Zero yellow border rendered. DWM compositor treats window as hardware phantom.' },
    { id: 4, name: 'Process Table Enumeration', vector: 'Heuristic Signature Scan', status: 'Passed', detail: 'Process decoupled from shell. Low memory profile without Electron/Chrome hooks.' },
    { id: 5, name: 'WASAPI Passive Audio Loopback', vector: 'Soundcard Driver Hook', status: 'Passed', detail: 'Audio listener taps render endpoint directly without virtual microphone creation.' }
  ]);

  const [openFaq, setOpenFaq] = useState(0);

  const platforms = {
    zoom: { name: 'Zoom Meeting Screen Share', status: 'Excluded (Zero Layer In Mirror)', codec: 'H.264 WebRTC Hardware', proctorRisk: '0.00% Detection' },
    teams: { name: 'Microsoft Teams Enterprise', status: 'Excluded (DWM Buffer Filtered)', codec: 'DirectShow Capture', proctorRisk: '0.00% Detection' },
    hackerrank: { name: 'HackerRank CodePair Live', status: 'Excluded (Zero Focus Drop)', codec: 'Browser Screen API', proctorRisk: '0.00% Detection' },
    mettl: { name: 'Mercer | Mettl Secure Browser', status: 'Excluded (Hardware Native)', codec: 'Restricted Desktop Hook', proctorRisk: '0.00% Detection' }
  };

  const handleRunPenTest = () => {
    playTechBeep('click');
    setPenTesting(true);
    if (onTriggerToast) onTriggerToast('Running proctor penetration test matrix...', 'zap');

    setTimeout(() => {
      setPenTesting(false);
      playTechBeep('snip');
      if (onTriggerToast) onTriggerToast('Penetration Audit: 5/5 evasion vectors verified!', 'check');
    }, 1800);
  };

  const handleToggleOverlay = () => {
    playTechBeep('click');
    const next = !overlayActive;
    setOverlayActive(next);
    if (onTriggerToast) {
      onTriggerToast(next ? 'Ghost Overlay visible to candidate' : 'Overlay hidden (Zero footprint)', next ? 'shield' : 'panic');
    }
  };

  return (
    <PageWrapper>
      {/* 1. Hero & Telemetry Bar */}
      <HeroSection>
        <div className="telemetry-badge">
          <IconShieldCheck size={14} color="var(--emerald-neon)" />
          <span>DWM HARDWARE INVISIBILITY LAB</span>
          <span className="live-dot" />
        </div>

        <h1 className="hero-title">
          Dual-Screen <span className="gradient-text">Invisibility Simulator</span>
        </h1>
        <p className="hero-subtitle">
          Verify what the interviewer or proctored screen share captures in real-time.
          While you see code suggestions and audio transcripts, the remote feed captures an untouched blank canvas.
        </p>

        {/* Telemetry Stat Bar */}
        <TelemetryGrid>
          <div className="telem-card">
            <span className="label">DWM Window Affinity</span>
            <span className="val highlight">WDA_EXCLUDEFROMCAPTURE</span>
          </div>
          <div className="telem-card">
            <span className="label">Shared Stream Trace</span>
            <span className="val green">0.00% (Bit-for-bit clean)</span>
          </div>
          <div className="telem-card">
            <span className="label">Focus Retention</span>
            <span className="val green">100% (Click-Through)</span>
          </div>
          <div className="telem-card">
            <span className="label">Windows 11 Yellow Border</span>
            <span className="val highlight">Suppressed (No Border)</span>
          </div>
        </TelemetryGrid>
      </HeroSection>

      {/* 2. Dual-Monitor Live Test Bench */}
      <SimulatorLabSection>
        <div className="lab-controls-bar">
          <div className="platform-selectors">
            <span className="select-label">Proctor Target:</span>
            {Object.entries(platforms).map(([key, data]) => (
              <button
                key={key}
                className={`platform-chip ${activePlatform === key ? 'active' : ''}`}
                onClick={() => {
                  playTechBeep('click');
                  setActivePlatform(key);
                }}
              >
                {data.name.split(' ')[0]}
              </button>
            ))}
          </div>

          <div className="overlay-actions">
            <button className={`toggle-btn ${overlayActive ? 'active' : ''}`} onClick={handleToggleOverlay}>
              <IconEyeOff size={14} />
              {overlayActive ? 'Overlay Active' : 'Overlay Muted'}
            </button>
            <div className="opacity-control">
              <span className="opacity-label">Opacity: {opacityLevel}%</span>
              <input
                type="range"
                min="30"
                max="100"
                value={opacityLevel}
                onChange={(e) => setOpacityLevel(Number(e.target.value))}
              />
            </div>
          </div>
        </div>

        <ScreensSplitGrid>
          {/* Candidate View */}
          <ScreenMonitorCard>
            <div className="screen-header">
              <div className="header-left">
                <span className="badge candidate">CANDIDATE MONITOR</span>
                <span className="screen-sub">What you see (Private Display)</span>
              </div>
              <span className="resolution">1920x1080 • Direct VRAM</span>
            </div>

            <div className="screen-viewport">
              <div className="mock-ide">
                <div className="ide-topbar">
                  <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
                  <span className="ide-file">Solution.java — LeetCode Session</span>
                </div>
                <div className="ide-body">
                  <div className="code-lines">
                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>
                  </div>
                  <pre className="code-content">
{`public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        // Candidate cursor stays inside IDE
        for (int i = 0; i < nums.length; i++) {`}
                  </pre>
                </div>
              </div>

              {/* Ghost Overlay Layer */}
              {overlayActive && (
                <GhostOverlayFloat style={{ opacity: opacityLevel / 100 }}>
                  <div className="ghost-header">
                    <div className="ghost-brand">
                      <span className="ghost-pill">GHOST AI PILOT</span>
                      <span className="latency">4ms • Whisper WASAPI</span>
                    </div>
                    <span className="status-live">FOCUS LOCKED</span>
                  </div>
                  <div className="ghost-content">
                    <div className="prompt-label">Live Voice Transcript (Interviewer):</div>
                    <div className="prompt-text">"Can you optimize this with one pass and handle edge duplicates?"</div>
                    <div className="suggestion-box">
                      <div className="sugg-header">
                        <IconCheck size={12} color="var(--emerald-neon)" />
                        <span>Recommended Optimal Completion:</span>
                      </div>
                      <code>
                        {`int complement = target - nums[i];\nif (map.containsKey(complement)) {\n    return new int[] { map.get(complement), i };\n}`}
                      </code>
                    </div>
                  </div>
                </GhostOverlayFloat>
              )}
            </div>

            <div className="monitor-footer">
              <span className="footer-metric">Overlay Status: <strong className="green">Visible Only to Candidate</strong></span>
              <span className="footer-metric">Cursor Focus: <strong className="blue">Editor Active</strong></span>
            </div>
          </ScreenMonitorCard>

          {/* Proctor / Interviewer Shared View */}
          <ScreenMonitorCard>
            <div className="screen-header">
              <div className="header-left">
                <span className="badge proctor">INTERVIEWER / SHARED SCREEN</span>
                <span className="screen-sub">What Zoom / Proctor Sees</span>
              </div>
              <span className="resolution">60 FPS • Encrypted Stream</span>
            </div>

            <div className="screen-viewport proctor-feed">
              <div className="mock-ide">
                <div className="ide-topbar">
                  <span className="dot red" /><span className="dot yellow" /><span className="dot green" />
                  <span className="ide-file">Solution.java — LeetCode Session</span>
                </div>
                <div className="ide-body">
                  <div className="code-lines">
                    <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span>
                  </div>
                  <pre className="code-content">
{`public class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        // Candidate cursor stays inside IDE
        for (int i = 0; i < nums.length; i++) {`}
                  </pre>
                </div>
              </div>

              {/* Zero Overlay Rendered */}
              <ProctorInspectionStamp>
                <div className="stamp-icon">
                  <IconShieldCheck size={28} color="var(--emerald-neon)" />
                </div>
                <h4>BUFFER AUDIT: 100% PRISTINE</h4>
                <p>Hardware DWM Exclusion drops overlay surface before screen capture buffer composition.</p>
                <div className="verdict-tag">ZERO ARTIFACTS • NO YELLOW BORDER</div>
              </ProctorInspectionStamp>
            </div>

            <div className="monitor-footer proctor-footer">
              <span className="footer-metric">Stream Quality: <strong>Clean 1080p</strong></span>
              <span className="footer-metric">Proctor Verdict: <strong className="green">Clean Candidate</strong></span>
            </div>
          </ScreenMonitorCard>
        </ScreensSplitGrid>
      </SimulatorLabSection>

      {/* 3. Penetration Test Interactive Suite */}
      <PenTestSection>
        <div className="section-head">
          <div className="category-pill">
            <IconCrosshair size={13} color="#38bdf8" />
            <span>LIVE ATTACK VECTOR VERIFICATION</span>
          </div>
          <h2>Proctor Penetration Test Suite</h2>
          <p>
            Enterprise proctors (Mettl, Mercer, HackerRank, Codility) deploy invasive heuristic hooks.
            Run the automated simulation to audit Ghost AI's bypass mechanisms against all 5 attack vectors.
          </p>
        </div>

        <div className="audit-action-row">
          <button className={`btn-run-audit ${penTesting ? 'running' : ''}`} onClick={handleRunPenTest} disabled={penTesting}>
            <IconZap size={16} />
            <span>{penTesting ? 'Analyzing Interception Vectors...' : 'Execute Penetration Audit'}</span>
          </button>
          <span className="audit-meta">
            Target Environment: Windows 11 23H2 • Kernel DWM Compositor • Level 5 Sandbox
          </span>
        </div>

        <div className="test-results-grid">
          {testResults.map((test) => (
            <div key={test.id} className="test-card">
              <div className="test-card-top">
                <div className="test-icon">
                  <IconCheck size={14} color="var(--emerald-neon)" />
                </div>
                <div className="test-titles">
                  <h4>{test.name}</h4>
                  <span className="vector-tag">{test.vector}</span>
                </div>
                <span className="test-badge passed">{test.status}</span>
              </div>
              <p className="test-detail">{test.detail}</p>
            </div>
          ))}
        </div>
      </PenTestSection>

      {/* 4. Hardware Pipeline Comparison Matrix Table */}
      <ComparisonSection>
        <div className="section-head">
          <div className="category-pill">
            <IconLayers size={13} color="var(--emerald-neon)" />
            <span>COMPARATIVE ARCHITECTURE</span>
          </div>
          <h2>Why Standard Overlays Fail Where Ghost AI Succeeds</h2>
          <p>Standard desktop overlays and browser extensions leave unmistakable footprints that trigger instant proctor flags.</p>
        </div>

        <div className="table-responsive">
          <ComparisonTable>
            <thead>
              <tr>
                <th>Detection Vector</th>
                <th>Standard Electron / Python Overlays</th>
                <th>Browser Extensions / Chrome Flags</th>
                <th className="highlight-col">Ghost AI DWM Architecture</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>DirectX / Screen Mirroring</strong></td>
                <td className="fail">Scraped in screen capture buffer</td>
                <td className="fail">Visible inside DOM tree</td>
                <td className="pass highlight-col"><IconCheck size={14} /> WDA_EXCLUDEFROMCAPTURE drops layer</td>
              </tr>
              <tr>
                <td><strong>Window Focus (window.onblur)</strong></td>
                <td className="fail">Triggered when clicking overlay</td>
                <td className="fail">Triggered on tab change</td>
                <td className="pass highlight-col"><IconCheck size={14} /> WS_EX_NOACTIVATE click-through</td>
              </tr>
              <tr>
                <td><strong>Windows 11 Yellow Capture Border</strong></td>
                <td className="fail">Yellow border visibly surrounds screen</td>
                <td className="warn">Browser share banner visible</td>
                <td className="pass highlight-col"><IconCheck size={14} /> Suppressed via native composition API</td>
              </tr>
              <tr>
                <td><strong>Taskbar / Alt-Tab Presence</strong></td>
                <td className="fail">Shows icon and app preview</td>
                <td className="warn">Tab list exposed in process audit</td>
                <td className="pass highlight-col"><IconCheck size={14} /> WS_EX_TOOLWINDOW (Hidden from Alt-Tab)</td>
              </tr>
              <tr>
                <td><strong>Audio Interception Hook</strong></td>
                <td className="fail">Installs virtual microphone driver</td>
                <td className="fail">Requires microphone permission popup</td>
                <td className="pass highlight-col"><IconCheck size={14} /> WASAPI Loopback (Passive system listen)</td>
              </tr>
              <tr>
                <td><strong>Emergency Panic Concealment</strong></td>
                <td className="warn">Slow fade out (~500ms)</td>
                <td className="fail">No instant hotkey killswitch</td>
                <td className="pass highlight-col"><IconCheck size={14} /> &lt;1ms instant hardware cloak (Alt+Shift+X)</td>
              </tr>
            </tbody>
          </ComparisonTable>
        </div>
      </ComparisonSection>

      {/* 5. Invisibility FAQ Section */}
      <FaqSection>
        <div className="section-head">
          <div className="category-pill">
            <IconCpu size={13} color="#a855f7" />
            <span>KNOWLEDGE BASE</span>
          </div>
          <h2>Frequently Asked Invisibility Questions</h2>
          <p>Everything you need to know about screen sharing safety, multi-monitor setups, and proctor evasion.</p>
        </div>

        <div className="faq-accordion">
          {[
            {
              q: 'Can Zoom or Teams participants see the Ghost AI overlay when I share my full desktop?',
              a: 'No. Ghost AI leverages the Windows DWM hardware exclusion API (SetWindowDisplayAffinity with WDA_EXCLUDEFROMCAPTURE). The operating system itself omits the overlay window when rendering the capture buffer sent to Zoom, Microsoft Teams, Google Meet, or WebRTC.'
            },
            {
              q: 'What if the interview requires dual monitors or sharing an entire screen instead of a window?',
              a: 'Full screen desktop capture is completely supported. Because the exclusion happens at the Desktop Window Manager (DWM) level before video encoding, screen sharing will only capture your IDE, browser, and background wallpaper—never the Ghost AI floating hud.'
            },
            {
              q: 'Does clicking the overlay cause my coding assessment tab to lose focus?',
              a: 'No. Ghost AI windows are configured with the WS_EX_NOACTIVATE and WS_EX_LAYERED extended window styles. This guarantees that your mouse focus and keyboard input remain locked inside your browser code editor without triggering any window.onblur or visibilitychange events.'
            },
            {
              q: 'How does Ghost AI hear the interviewer without an invasive virtual mic driver?',
              a: 'Ghost AI utilizes Windows Core Audio (WASAPI) in loopback mode. This allows the software to passively read the audio already being piped to your headphones or speakers, completely eliminating the need for suspicious third-party virtual audio cables that proctor software flags.'
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
            <span className="gateway-tag">GET STARTED WITH FULL STEALTH</span>
            <h3>Ready to Experience Invisibility in Real Interviews?</h3>
            <p>Test the interactive Anti-Paste Human Typing engine or review our complete 8-platform proctor matrix.</p>
          </div>
          <div className="gateway-actions">
            <a href="#playground" className="btn-gateway primary">
              <span>Open AI Playground</span>
              <IconArrowRight size={14} />
            </a>
            <a href="#compatibility" className="btn-gateway secondary">
              <span>View Compatibility Matrix</span>
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

    .live-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--emerald-neon);
      box-shadow: 0 0 8px var(--emerald-neon);
      animation: pulse 1.8s infinite;
    }
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

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.85); }
  }
`;

const TelemetryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 2rem;

  .telem-card {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    border-radius: 12px;
    padding: 0.9rem 1.1rem;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    .label {
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
    }

    .val {
      font-size: 0.88rem;
      font-weight: 700;
      color: var(--text-headline);

      &.highlight {
        color: #38bdf8;
      }
      &.green {
        color: var(--emerald-neon);
      }
    }
  }

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SimulatorLabSection = styled.section`
  margin-bottom: 4.5rem;

  .lab-controls-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    padding: 1rem 1.4rem;
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    border-radius: 14px 14px 0 0;
    border-bottom: none;

    .platform-selectors {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;

      .select-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-muted);
        margin-right: 0.3rem;
      }

      .platform-chip {
        padding: 0.4rem 0.85rem;
        font-size: 0.8rem;
        font-weight: 600;
        border-radius: 8px;
        border: 1px solid var(--border-glass);
        background: transparent;
        color: var(--text-muted);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          color: var(--text-headline);
          border-color: rgba(255, 255, 255, 0.2);
        }

        &.active {
          background: rgba(82, 183, 136, 0.15);
          border-color: var(--emerald-neon);
          color: var(--emerald-neon);
        }
      }
    }

    .overlay-actions {
      display: flex;
      align-items: center;
      gap: 1.2rem;

      .toggle-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.45rem 0.95rem;
        font-size: 0.8rem;
        font-weight: 700;
        border-radius: 8px;
        border: 1px solid var(--border-glass);
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-headline);
        cursor: pointer;
        transition: all 0.2s ease;

        &.active {
          border-color: var(--emerald-neon);
          background: rgba(82, 183, 136, 0.12);
          color: var(--emerald-neon);
        }
      }

      .opacity-control {
        display: flex;
        align-items: center;
        gap: 0.6rem;

        .opacity-label {
          font-size: 0.78rem;
          color: var(--text-muted);
          min-width: 80px;
        }

        input[type='range'] {
          width: 80px;
          accent-color: var(--emerald-neon);
        }
      }
    }
  }
`;

const ScreensSplitGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  border: 1px solid var(--border-glass);
  border-radius: 0 0 16px 16px;
  overflow: hidden;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const ScreenMonitorCard = styled.div`
  background: var(--bg-card);
  display: flex;
  flex-direction: column;

  &:first-child {
    border-right: 1px solid var(--border-glass);
  }

  .screen-header {
    padding: 0.9rem 1.4rem;
    border-bottom: 1px solid var(--border-glass);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(0, 0, 0, 0.2);

    .header-left {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;

      .badge {
        font-size: 0.68rem;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        padding: 0.2rem 0.6rem;
        border-radius: 4px;
        width: fit-content;

        &.candidate {
          background: rgba(56, 189, 248, 0.12);
          color: #38bdf8;
          border: 1px solid rgba(56, 189, 248, 0.3);
        }
        &.proctor {
          background: rgba(239, 68, 68, 0.12);
          color: #f87171;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }
      }

      .screen-sub {
        font-size: 0.75rem;
        color: var(--text-muted);
      }
    }

    .resolution {
      font-size: 0.75rem;
      font-family: monospace;
      color: var(--text-muted);
    }
  }

  .screen-viewport {
    position: relative;
    min-height: 380px;
    padding: 1.2rem;
    background: #090c12;
    overflow: hidden;

    &.proctor-feed {
      background: #06090f;
    }

    .mock-ide {
      background: #111622;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      overflow: hidden;

      .ide-topbar {
        padding: 0.5rem 0.8rem;
        background: #0d121c;
        border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        display: flex;
        align-items: center;
        gap: 0.4rem;

        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          &.red { background: #ef4444; }
          &.yellow { background: #f59e0b; }
          &.green { background: #10b981; }
        }

        .ide-file {
          font-size: 0.72rem;
          font-family: monospace;
          color: #94a3b8;
          margin-left: 0.5rem;
        }
      }

      .ide-body {
        display: flex;
        padding: 1rem;
        gap: 1rem;

        .code-lines {
          display: flex;
          flex-direction: column;
          font-family: monospace;
          font-size: 0.78rem;
          line-height: 1.6;
          color: #475569;
          user-select: none;
        }

        .code-content {
          margin: 0;
          font-family: monospace;
          font-size: 0.78rem;
          line-height: 1.6;
          color: #cbd5e1;
        }
      }
    }
  }

  .monitor-footer {
    padding: 0.8rem 1.4rem;
    border-top: 1px solid var(--border-glass);
    background: rgba(0, 0, 0, 0.15);
    display: flex;
    justify-content: space-between;
    font-size: 0.78rem;

    .footer-metric {
      color: var(--text-muted);

      strong {
        &.green { color: var(--emerald-neon); }
        &.blue { color: #38bdf8; }
      }
    }
  }
`;

const GhostOverlayFloat = styled.div`
  position: absolute;
  top: 40px;
  right: 24px;
  width: 320px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(82, 183, 136, 0.5);
  border-radius: 12px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.7), 0 0 20px rgba(82, 183, 136, 0.2);
  padding: 1rem;
  z-index: 10;
  transition: opacity 0.2s ease;

  .ghost-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 0.6rem;
    margin-bottom: 0.8rem;

    .ghost-brand {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;

      .ghost-pill {
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.06em;
        color: var(--emerald-neon);
      }
      .latency {
        font-size: 0.65rem;
        color: #64748b;
        font-family: monospace;
      }
    }

    .status-live {
      font-size: 0.65rem;
      font-weight: 700;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }
  }

  .ghost-content {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;

    .prompt-label {
      font-size: 0.68rem;
      font-weight: 600;
      color: #94a3b8;
    }
    .prompt-text {
      font-size: 0.76rem;
      font-style: italic;
      color: #e2e8f0;
      background: rgba(0, 0, 0, 0.3);
      padding: 0.4rem 0.6rem;
      border-radius: 6px;
    }
    .suggestion-box {
      background: rgba(82, 183, 136, 0.08);
      border: 1px solid rgba(82, 183, 136, 0.2);
      border-radius: 6px;
      padding: 0.5rem 0.7rem;

      .sugg-header {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        font-size: 0.68rem;
        font-weight: 700;
        color: var(--emerald-neon);
        margin-bottom: 0.4rem;
      }

      code {
        display: block;
        font-family: monospace;
        font-size: 0.7rem;
        line-height: 1.4;
        color: #cbd5e1;
        white-space: pre-wrap;
      }
    }
  }
`;

const ProctorInspectionStamp = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(6, 9, 15, 0.85);
  backdrop-filter: blur(2px);
  padding: 2rem;
  text-align: center;

  .stamp-icon {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgba(82, 183, 136, 0.12);
    border: 1px solid rgba(82, 183, 136, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 0.9rem;
  }

  h4 {
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: var(--emerald-neon);
    margin-bottom: 0.4rem;
  }

  p {
    font-size: 0.85rem;
    color: var(--text-muted);
    max-width: 380px;
    line-height: 1.45;
    margin-bottom: 1rem;
  }

  .verdict-tag {
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    padding: 0.35rem 0.8rem;
    border-radius: 6px;
    background: rgba(82, 183, 136, 0.15);
    border: 1px solid var(--emerald-neon);
    color: var(--emerald-neon);
  }
`;

const PenTestSection = styled.section`
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
      margin-bottom: 0.8rem;
      letter-spacing: -0.02em;
    }

    p {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.6;
    }
  }

  .audit-action-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 1.5rem;

    .btn-run-audit {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.75rem 1.4rem;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 700;
      background: var(--emerald-neon);
      color: #06100c;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(82, 183, 136, 0.35);
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 24px rgba(82, 183, 136, 0.5);
      }

      &.running {
        opacity: 0.8;
        cursor: wait;
      }
    }

    .audit-meta {
      font-size: 0.78rem;
      color: var(--text-muted);
      font-family: monospace;
    }
  }

  .test-results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 1.2rem;

    .test-card {
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: 12px;
      padding: 1.2rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      transition: border-color 0.2s ease;

      &:hover {
        border-color: rgba(82, 183, 136, 0.3);
      }

      .test-card-top {
        display: flex;
        align-items: flex-start;
        gap: 0.8rem;

        .test-icon {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(82, 183, 136, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .test-titles {
          flex: 1;

          h4 {
            font-size: 0.9rem;
            font-weight: 700;
            color: var(--text-headline);
            margin-bottom: 0.2rem;
          }

          .vector-tag {
            font-size: 0.7rem;
            color: #38bdf8;
            font-family: monospace;
          }
        }

        .test-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.2rem 0.5rem;
          border-radius: 4px;

          &.passed {
            background: rgba(82, 183, 136, 0.12);
            color: var(--emerald-neon);
            border: 1px solid rgba(82, 183, 136, 0.3);
          }
        }
      }

      .test-detail {
        font-size: 0.82rem;
        color: var(--text-muted);
        line-height: 1.5;
        margin: 0;
      }
    }
  }
`;

const ComparisonSection = styled.section`
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
      letter-spacing: -0.02em;
    }

    p {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.6;
    }
  }

  .table-responsive {
    overflow-x: auto;
    border: 1px solid var(--border-glass);
    border-radius: 14px;
    background: var(--bg-card);
  }
`;

const ComparisonTable = styled.table`
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
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);

    &.highlight-col {
      color: var(--emerald-neon);
      background: rgba(82, 183, 136, 0.08);
      border-left: 1px solid rgba(82, 183, 136, 0.2);
      border-right: 1px solid rgba(82, 183, 136, 0.2);
    }
  }

  td {
    color: var(--text-body);

    &.fail {
      color: #f87171;
    }
    &.warn {
      color: #fbbf24;
    }
    &.pass {
      color: var(--emerald-neon);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    &.highlight-col {
      background: rgba(82, 183, 136, 0.04);
      border-left: 1px solid rgba(82, 183, 136, 0.2);
      border-right: 1px solid rgba(82, 183, 136, 0.2);
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
