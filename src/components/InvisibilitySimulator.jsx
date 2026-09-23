import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';
import { IconShieldCheck, IconMonitor, IconCode, IconZap } from './Icons';

const SCENARIOS = {
  leetcode: {
    title: 'LeetCode 1. Two Sum',
    problem: `// LeetCode Problem 1: Two Sum\n// Return indices of two numbers that add up to target.\nvector<int> twoSum(vector<int>& nums, int target);`,
    solution: `// GHOST AI OPTIMAL SOLUTION\nunordered_map<int, int> seen;\nfor (int i = 0; i < nums.size(); ++i) {\n    int comp = target - nums[i];\n    if (seen.count(comp)) return {seen[comp], i};\n    seen[nums[i]] = i;\n}\nreturn {}; // O(n) Time • O(n) Space`,
    telemetry: 'LeetCode Proctor Safe &bull; Focus Retained'
  },
  mcq: {
    title: 'Computer Science MCQ Test',
    problem: `Question 14 of 40:\nWhich data structure guarantees O(1) average lookup and insertion?\n\n[A] Binary Search Tree (Unbalanced)\n[B] Hash Map (Hash Table)\n[C] Red-Black Tree\n[D] Min-Heap Priority Queue`,
    solution: `CORRECT VERDICT: OPTION [B]\nHash Map provides O(1) amortized lookup via hash function.\nConfidence: 99.8% &bull; Distractor Analysis Verified.`,
    telemetry: 'Zero Tab-Switch Events &bull; Safe Focus'
  },
  system: {
    title: 'System Design Interview Prompt',
    problem: `Interviewer Question:\n"Design a URL shortening service handling 100,000 writes/sec\nwith 99.999% uptime and zero ID collision."`,
    solution: `TALKING POINTS:\n1. Snowflake 64-bit ID generator (avoids DB lock contention)\n2. Base62 encoding creates 7-char clean hash\n3. Sharded Redis cache with LRU eviction for top 20% URLs.`,
    telemetry: 'Gemini Live Speech Ear Active'
  }
};

export default function InvisibilitySimulator({ onTriggerToast, theme }) {
  const [sliderPos, setSliderPos] = useState(50);
  const [scenarioKey, setScenarioKey] = useState('leetcode');
  const containerRef = useRef(null);

  const scenario = SCENARIOS[scenarioKey];

  const handleSliderMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offset = clientX - rect.left;
    const pct = Math.max(10, Math.min(90, (offset / rect.width) * 100));
    setSliderPos(pct);
  };

  return (
    <SimWrapper id="simulator">
      <div className="minimal-container">
        {/* Minimal Section Header */}
        <div className="sim-header">
          <div className="minimal-tag">
            <IconShieldCheck size={13} color="var(--emerald-neon)" />
            <span>INTERACTIVE VERIFICATION LENS</span>
          </div>
          <h2 className="minimal-headline">
            Dual-Screen Invisibility Lens
          </h2>
          <p className="minimal-sub">
            Drag the divider to compare what you see on your physical monitor versus what your interviewer sees over Zoom, Teams, or browser proctors.
          </p>
        </div>

        {/* Scenario Selectors (Clean Horizontal Tabs) */}
        <div className="scenario-tabs-row">
          {Object.entries(SCENARIOS).map(([key, item], idx) => (
            <button
              key={key}
              className={`scenario-pill ${scenarioKey === key ? 'active' : ''}`}
              onClick={() => {
                playTechBeep('click');
                setScenarioKey(key);
              }}
            >
              <span className="editorial-idx">0{idx + 1}</span>
              <span>{item.title}</span>
            </button>
          ))}
        </div>

        {/* Seamless Cinema Dual-Pane Canvas (No Bulky Cards) */}
        <div
          className="minimal-slate cinema-canvas"
          ref={containerRef}
          onMouseMove={(e) => { if (e.buttons === 1) handleSliderMove(e); }}
          onTouchMove={handleSliderMove}
        >
          {/* Top Bar with Stream Status */}
          <div className="cinema-topbar">
            <div className="pane-tag left-tag">
              <span className="dot-active" />
              <span>YOUR DISPLAY &bull; ASSISTANT ACTIVE</span>
            </div>
            <div className="pane-tag right-tag">
              <span className="dot-invisible" />
              <span>INTERVIEWER STREAM &bull; 100% INVISIBLE</span>
            </div>
          </div>

          {/* Dual Split Screens */}
          <div className="split-view-container">
            {/* Background Layer: Interviewer View (Clean Screen, Copilot Invisible) */}
            <div className="interviewer-view-layer">
              <div className="code-canvas-inner">
                <div className="screen-watermark-label">Zoom / Teams / Meet Stream</div>
                <pre className="code-content-base">
                  <code>{scenario.problem}</code>
                </pre>
                <div className="interviewer-empty-status">
                  <IconShieldCheck size={18} color="var(--emerald-neon)" />
                  <span>Ghost AI Excluded &bull; Only IDE Transmitted</span>
                </div>
              </div>
            </div>

            {/* Foreground Clipped Layer: Candidate View (With Ghost AI Overlay) */}
            <div
              className="candidate-view-layer"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <div className="code-canvas-inner">
                <div className="screen-watermark-label candidate-label">Your Physical Monitor</div>
                <pre className="code-content-base">
                  <code>{scenario.problem}</code>
                </pre>

                {/* Floating Ghost Copilot Overlay HUD */}
                <div className="floating-copilot-hud">
                  <div className="hud-header">
                    <span className="hud-title">Ghost AI Solution HUD</span>
                    <span className="hud-rate">₹2.5/m</span>
                  </div>
                  <div className="hud-body">
                    <pre className="hud-solution-code">
                      <code>{scenario.solution}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Vertical Drag Handle */}
            <div
              className="slider-divider"
              style={{ left: `${sliderPos}%` }}
              onMouseDown={() => playTechBeep('click')}
            >
              <div className="slider-handle">
                <span className="arrow-left">&lsaquo;</span>
                <span className="arrow-right">&rsaquo;</span>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Strip */}
          <div className="cinema-footer">
            <div className="telemetry-item">
              <span className="tele-lbl">Zoom Feed:</span>
              <span className="tele-val">0px Excluded</span>
            </div>
            <div className="telemetry-sep">&bull;</div>
            <div className="telemetry-item">
              <span className="tele-lbl">Teams Feed:</span>
              <span className="tele-val">100% Hidden</span>
            </div>
            <div className="telemetry-sep">&bull;</div>
            <div className="telemetry-item">
              <span className="tele-lbl">Focus Lock:</span>
              <span className="tele-val">Safe (0 Blurs)</span>
            </div>
            <div className="telemetry-sep">&bull;</div>
            <div className="telemetry-item">
              <span className="tele-lbl">Proctor Status:</span>
              <span className="tele-val highlight">{scenario.telemetry}</span>
            </div>
          </div>
        </div>
      </div>
    </SimWrapper>
  );
}

const SimWrapper = styled.section`
  padding: 90px 0;
  border-top: 1px solid var(--border-subtle);
  border-bottom: 1px solid var(--border-subtle);

  .sim-header {
    margin-bottom: 2rem;
  }

  .scenario-tabs-row {
    display: flex;
    gap: 10px;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .scenario-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 600;
    padding: 7px 14px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      border-color: var(--border-glass);
      color: var(--text-headline);
    }

    &.active {
      background: rgba(255, 255, 255, 0.05);
      border-color: var(--emerald-neon);
      color: var(--text-headline);
    }
  }

  .cinema-canvas {
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
    user-select: none;
  }

  .cinema-topbar {
    padding: 10px 20px;
    background: rgba(0, 0, 0, 0.35);
    border-bottom: 1px solid var(--border-subtle);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 11px;
    font-family: var(--font-mono);
    letter-spacing: 0.06em;
  }

  .pane-tag {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
  }

  .left-tag {
    color: var(--text-headline);
  }

  .right-tag {
    color: var(--emerald-neon);
  }

  .dot-active {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #38bdf8;
  }

  .dot-invisible {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--emerald-neon);
  }

  .split-view-container {
    position: relative;
    height: 420px;
    overflow: hidden;
  }

  .interviewer-view-layer,
  .candidate-view-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-surface);
  }

  .code-canvas-inner {
    padding: 24px;
    height: 100%;
    position: relative;
    font-family: var(--font-mono);
  }

  .screen-watermark-label {
    font-size: 11px;
    color: var(--text-muted);
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 16px;
  }

  .candidate-label {
    color: #38bdf8;
  }

  .code-content-base {
    color: var(--text-body);
    font-size: 13px;
    line-height: 1.6;
    background: transparent;
    border: none;
    padding: 0;
    max-width: 650px;
  }

  .interviewer-empty-status {
    position: absolute;
    bottom: 24px;
    right: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    font-family: var(--font-mono);
    color: var(--emerald-neon);
    background: rgba(45, 212, 191, 0.08);
    border: 1px solid rgba(45, 212, 191, 0.25);
    padding: 6px 14px;
    border-radius: 9999px;
  }

  /* Floating Ghost HUD on Candidate Screen */
  .floating-copilot-hud {
    position: absolute;
    top: 50px;
    right: 40px;
    width: 380px;
    background: rgba(10, 15, 29, 0.88);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(56, 189, 248, 0.35);
    border-radius: 8px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6);
    overflow: hidden;

    @media (max-width: 768px) {
      width: 280px;
      right: 15px;
    }
  }

  .hud-header {
    padding: 8px 12px;
    background: rgba(0, 0, 0, 0.4);
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .hud-title {
    font-size: 11px;
    font-weight: 700;
    color: #38bdf8;
    letter-spacing: 0.04em;
  }

  .hud-rate {
    font-size: 10px;
    font-family: var(--font-mono);
    color: var(--emerald-neon);
    background: rgba(45, 212, 191, 0.12);
    padding: 1px 6px;
    border-radius: 4px;
    font-weight: 700;
  }

  .hud-body {
    padding: 12px;
  }

  .hud-solution-code {
    font-size: 11px;
    line-height: 1.5;
    color: var(--emerald-neon);
    white-space: pre-wrap;
    background: transparent;
    border: none;
    padding: 0;
  }

  /* Vertical Sliding Divider */
  .slider-divider {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 2px;
    background: #ffffff;
    cursor: ew-resize;
    z-index: 10;
    box-shadow: 0 0 16px rgba(255, 255, 255, 0.8);
  }

  .slider-handle {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 32px;
    height: 32px;
    background: #ffffff;
    color: #030712;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 800;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    gap: 1px;
  }

  .cinema-footer {
    padding: 12px 20px;
    background: rgba(0, 0, 0, 0.25);
    border-top: 1px solid var(--border-subtle);
    display: flex;
    align-items: center;
    gap: 14px;
    font-size: 12px;
    font-family: var(--font-mono);
    flex-wrap: wrap;
  }

  .telemetry-item {
    display: flex;
    gap: 6px;
  }

  .tele-lbl {
    color: var(--text-muted);
  }

  .tele-val {
    color: var(--text-headline);
    font-weight: 600;

    &.highlight {
      color: var(--emerald-neon);
    }
  }

  .telemetry-sep {
    color: var(--border-subtle);
  }
`;
