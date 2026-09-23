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
  IconCode
} from './Icons';

export default function Hero({ onTriggerToast, onOpenAuth, onOpenRecharge, activeUser }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('code'); // 'code', 'mcq', 'speech'
  const [viewMode, setViewMode] = useState('candidate'); // 'candidate' (visible), 'interviewer' (invisible)
  const [isTyping, setIsTyping] = useState(false);
  const [typedCode, setTypedCode] = useState('');

  const handleCopyCmd = () => {
    playTechBeep('click');
    navigator.clipboard.writeText('cscript //nologo run_stealth.vbs');
    setCopied(true);
    if (onTriggerToast) onTriggerToast('Launcher command copied to clipboard!', 'copy');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateType = () => {
    playTechBeep('click');
    setIsTyping(true);
    const fullCode = `// Auto-typing at realistic human speed (45 WPM)\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); ++i) {\n            int comp = target - nums[i];\n            if (seen.count(comp)) return {seen[comp], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`;
    
    let cur = 0;
    setTypedCode('');
    const timer = setInterval(() => {
      cur += 8;
      if (cur >= fullCode.length) {
        setTypedCode(fullCode);
        setIsTyping(false);
        clearInterval(timer);
      } else {
        setTypedCode(fullCode.slice(0, cur));
      }
    }, 40);
  };

  return (
    <HeroWrapper id="hero">
      <div className="minimal-container">
        <div className="hero-split-grid">
          {/* Left Column: Minimal Editorial Typography */}
          <div className="hero-left-col">
            <div className="minimal-tag">
              <span className="live-dot" />
              <span>100% Screen-Share Invisible &bull; ₹2.5 / Min</span>
            </div>

            <h1 className="hero-statement">
              The screen-share invisible copilot for live technical interviews.
            </h1>

            <p className="hero-narrative">
              Solve LeetCode, system design problems, and proctored coding assessments in real time. Visible directly on your physical screen, but <strong>completely absent</strong> on Zoom, Teams, Google Meet, and browser test portals.
            </p>

            {/* Editorial Numbered Proofs (Zero Cards) */}
            <div className="editorial-proofs">
              <div className="proof-item">
                <span className="editorial-idx">01</span>
                <div>
                  <div className="proof-title">Screen-Share Invisible</div>
                  <div className="proof-desc">0 pixels transmitted to interviewers or recording bots.</div>
                </div>
              </div>
              <div className="proof-item">
                <span className="editorial-idx">02</span>
                <div>
                  <div className="proof-title">Safe Focus Lock</div>
                  <div className="proof-desc">Zero tab-switch or window-blur alerts on HackerRank & CodeSignal.</div>
                </div>
              </div>
              <div className="proof-item">
                <span className="editorial-idx">03</span>
                <div>
                  <div className="proof-title">Live Interview Ear</div>
                  <div className="proof-desc">Hears spoken interviewer questions and generates talking points.</div>
                </div>
              </div>
            </div>

            {/* Minimal CTA Buttons & Quick Launcher */}
            <div className="hero-actions-row">
              <button
                className="btn-minimal-primary"
                onClick={() => {
                  playTechBeep('click');
                  if (activeUser) {
                    onOpenRecharge();
                  } else {
                    onOpenAuth();
                  }
                }}
              >
                <IconZap size={14} />
                <span>{activeUser ? 'Recharge Minutes (₹2.5/m)' : 'Get 10m Free Trial'}</span>
              </button>

              <a href="#simulator" className="btn-minimal-secondary" onClick={() => playTechBeep('click')}>
                <IconPlay size={13} />
                <span>Test Invisibility Simulator</span>
              </a>

              <button className="btn-launcher-pill" onClick={handleCopyCmd} title="Click to copy quick launcher command">
                <span className="cmd-prompt">$</span>
                <span className="cmd-text">.\run_ghost_ai.bat</span>
                {copied ? <IconCheck size={13} color="var(--emerald-neon)" /> : <IconCopy size={13} />}
              </button>
            </div>
          </div>

          {/* Right Column: Minimalist Live HUD / Copilot Terminal Slate */}
          <div className="hero-right-col">
            <div className="minimal-slate hud-slate">
              {/* Slate Header & View Switcher */}
              <div className="slate-topbar">
                <div className="slate-brand">
                  <span className="slate-dot" />
                  <span className="slate-title">Ghost AI Copilot</span>
                  <span className="slate-runtime-chip">₹2.5/m</span>
                </div>

                {/* Candidate vs Interviewer View Switcher */}
                <div className="view-mode-pill">
                  <button
                    className={`mode-btn ${viewMode === 'candidate' ? 'active' : ''}`}
                    onClick={() => {
                      playTechBeep('click');
                      setViewMode('candidate');
                    }}
                  >
                    Your Screen
                  </button>
                  <button
                    className={`mode-btn ${viewMode === 'interviewer' ? 'active' : ''}`}
                    onClick={() => {
                      playTechBeep('click');
                      setViewMode('interviewer');
                    }}
                  >
                    Interviewer Share
                  </button>
                </div>
              </div>

              {/* View Content */}
              {viewMode === 'candidate' ? (
                <div className="slate-body">
                  {/* Mode Tabs */}
                  <div className="slate-tabs">
                    <button
                      className={`slate-tab ${activeTab === 'code' ? 'active' : ''}`}
                      onClick={() => setActiveTab('code')}
                    >
                      LeetCode (C++)
                    </button>
                    <button
                      className={`slate-tab ${activeTab === 'mcq' ? 'active' : ''}`}
                      onClick={() => setActiveTab('mcq')}
                    >
                      MCQ Verdict
                    </button>
                    <button
                      className={`slate-tab ${activeTab === 'speech' ? 'active' : ''}`}
                      onClick={() => setActiveTab('speech')}
                    >
                      Speech Ear
                    </button>
                  </div>

                  {/* Tab Display */}
                  {activeTab === 'code' && (
                    <div className="slate-code-area">
                      <div className="code-meta-bar">
                        <span className="code-lang">C++ Optimal &bull; O(n) Time</span>
                        <button className="btn-auto-type" onClick={handleSimulateType} disabled={isTyping}>
                          {isTyping ? 'Simulating Keystrokes...' : '⚡ Test Auto-Type'}
                        </button>
                      </div>
                      <pre className="code-pre">
                        <code>
                          {typedCode ||
`class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int comp = target - nums[i];
            if (seen.count(comp)) return {seen[comp], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};`}
                        </code>
                      </pre>
                    </div>
                  )}

                  {activeTab === 'mcq' && (
                    <div className="slate-mcq-area">
                      <div className="mcq-badge">CORRECT ANSWER: [B]</div>
                      <div className="mcq-question">Which data structure guarantees O(1) average lookup and insertion?</div>
                      <div className="mcq-expl">
                        &bull; <strong>Option [B] Hash Map:</strong> Amortized O(1) via bucket hash array.<br />
                        &bull; <em>Distractors:</em> BST is O(n) worst-case, Red-Black tree is O(log n).
                      </div>
                    </div>
                  )}

                  {activeTab === 'speech' && (
                    <div className="slate-speech-area">
                      <div className="speech-interviewer">
                        <span className="speaker-tag">Interviewer asked:</span>
                        <p>"How do you ensure zero data loss during Kafka partition rebalance?"</p>
                      </div>
                      <div className="speech-response">
                        <span className="response-tag">Recommended talking points:</span>
                        <p>1. Enable cooperative sticky assignor (<code>CooperativeStickyAssignor</code>).<br />
                        2. Commit consumer offsets synchronously before rebalance callback.<br />
                        3. Set <code>acks=all</code> and idempotence on the producer.</p>
                      </div>
                    </div>
                  )}

                  {/* Slate Footer Status */}
                  <div className="slate-footer">
                    <span className="status-live">● Protected with Safe Focus Lock</span>
                    <span className="status-telemetry">0 Tab Switches &bull; 0 Window Blurs</span>
                  </div>
                </div>
              ) : (
                /* Interviewer View (100% Clean / Invisible) */
                <div className="slate-invisible-screen">
                  <div className="invisible-watermark">
                    <IconShieldCheck size={32} color="var(--emerald-neon)" />
                    <div className="inv-title">Interviewer Feed: 100% Clean</div>
                    <p className="inv-desc">
                      Zoom, Microsoft Teams, and Google Meet see only your plain IDE and desktop wallpaper.
                      The floating Ghost AI copilot is completely excluded from the video stream.
                    </p>
                    <div className="inv-tag">0 Pixels Transmitted</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </HeroWrapper>
  );
}

const HeroWrapper = styled.section`
  position: relative;
  padding: 130px 0 80px 0;
  overflow: hidden;

  .hero-split-grid {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    gap: 3.5rem;
    align-items: center;

    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
  }

  .live-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--emerald-neon);
    box-shadow: 0 0 8px var(--emerald-neon);
  }

  .hero-statement {
    font-family: var(--font-display);
    font-size: clamp(2.4rem, 4.2vw, 3.8rem);
    font-weight: 800;
    line-height: 1.08;
    letter-spacing: -0.04em;
    color: var(--text-headline);
    margin-bottom: 1.25rem;
  }

  .hero-narrative {
    font-size: 1.1rem;
    line-height: 1.65;
    color: var(--text-muted);
    margin-bottom: 2rem;
    max-width: 540px;

    strong {
      color: var(--text-headline);
      font-weight: 600;
    }
  }

  .editorial-proofs {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2.25rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-subtle);
  }

  .proof-item {
    display: flex;
    align-items: baseline;
    gap: 1rem;
  }

  .proof-title {
    font-size: 14px;
    font-weight: 700;
    color: var(--text-headline);
    letter-spacing: -0.01em;
  }

  .proof-desc {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .hero-actions-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .btn-launcher-pill {
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

  .cmd-prompt {
    color: var(--emerald-neon);
    font-weight: 700;
  }

  /* Right Column HUD Slate */
  .hud-slate {
    box-shadow: 0 24px 60px -10px rgba(0, 0, 0, 0.45);
    border: 1px solid var(--border-subtle);
  }

  .slate-topbar {
    padding: 10px 16px;
    background: rgba(0, 0, 0, 0.2);
    border-bottom: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .slate-brand {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .slate-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--emerald-neon);
  }

  .slate-title {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 700;
    color: var(--text-headline);
  }

  .slate-runtime-chip {
    font-family: var(--font-mono);
    font-size: 10px;
    background: rgba(45, 212, 191, 0.12);
    color: var(--emerald-neon);
    border: 1px solid rgba(45, 212, 191, 0.3);
    padding: 1px 6px;
    border-radius: 9999px;
    font-weight: 700;
  }

  .view-mode-pill {
    display: flex;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border-subtle);
    border-radius: 9999px;
    padding: 2px;
  }

  .mode-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.15s ease;

    &.active {
      background: #ffffff;
      color: #030712;
      font-weight: 700;
    }
  }

  [data-theme="light"] .mode-btn.active {
    background: #0f172a;
    color: #ffffff;
  }

  .slate-body {
    padding: 16px;
  }

  .slate-tabs {
    display: flex;
    gap: 6px;
    margin-bottom: 12px;
    border-bottom: 1px solid var(--border-subtle);
    padding-bottom: 10px;
  }

  .slate-tab {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;

    &.active {
      color: var(--emerald-neon);
      background: rgba(45, 212, 191, 0.08);
    }
  }

  .code-meta-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .code-lang {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
  }

  .btn-auto-type {
    background: rgba(45, 212, 191, 0.1);
    border: 1px solid rgba(45, 212, 191, 0.3);
    color: var(--emerald-neon);
    font-size: 11px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 4px;
    cursor: pointer;

    &:hover:not(:disabled) {
      background: rgba(45, 212, 191, 0.2);
    }
  }

  .code-pre {
    background: rgba(0, 0, 0, 0.3);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    padding: 12px;
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1.5;
    color: var(--emerald-neon);
    overflow-x: auto;
    max-height: 220px;
  }

  .slate-mcq-area {
    padding: 12px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    border: 1px solid var(--border-subtle);
  }

  .mcq-badge {
    display: inline-block;
    background: rgba(16, 185, 129, 0.15);
    color: var(--emerald-neon);
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 800;
    padding: 2px 8px;
    border-radius: 4px;
    margin-bottom: 8px;
  }

  .mcq-question {
    font-size: 13px;
    font-weight: 700;
    color: var(--text-headline);
    margin-bottom: 8px;
  }

  .mcq-expl {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .slate-speech-area {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    border: 1px solid var(--border-subtle);
  }

  .speaker-tag, .response-tag {
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-muted);
    display: block;
    margin-bottom: 2px;
  }

  .response-tag {
    color: var(--emerald-neon);
  }

  .slate-speech-area p {
    font-size: 12px;
    color: var(--text-headline);
    line-height: 1.4;
  }

  .slate-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    padding-top: 10px;
    border-top: 1px solid var(--border-subtle);
    font-size: 11px;
  }

  .status-live {
    color: var(--emerald-neon);
    font-weight: 600;
  }

  .status-telemetry {
    color: var(--text-muted);
    font-family: var(--font-mono);
  }

  .slate-invisible-screen {
    padding: 48px 24px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 280px;
  }

  .invisible-watermark {
    max-width: 380px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .inv-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--text-headline);
  }

  .inv-desc {
    font-size: 12px;
    color: var(--text-muted);
    line-height: 1.5;
  }

  .inv-tag {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    color: var(--emerald-neon);
    background: rgba(45, 212, 191, 0.1);
    border: 1px solid rgba(45, 212, 191, 0.3);
    padding: 3px 10px;
    border-radius: 9999px;
  }
`;
