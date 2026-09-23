import React, { useState } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';
import {
  IconCode,
  IconCopy,
  IconCheck,
  IconZap,
  IconPanic
} from './Icons';

const DATA = {
  leetcode: {
    python: {
      lang: 'Python 3',
      code: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        seen = {}\n        for i, num in enumerate(nums):\n            comp = target - num\n            if comp in seen:\n                return [seen[comp], i]\n            seen[num] = i\n        return []`,
      complexity: 'O(n) Time • O(n) Space'
    },
    cpp: {
      lang: 'C++',
      code: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> seen;\n        for (int i = 0; i < nums.size(); ++i) {\n            int comp = target - nums[i];\n            if (seen.count(comp)) return {seen[comp], i};\n            seen[nums[i]] = i;\n        }\n        return {};\n    }\n};`,
      complexity: 'O(n) Optimal • LeetCode Ready'
    },
    java: {
      lang: 'Java',
      code: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) return new int[]{map.get(comp), i};\n            map.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`,
      complexity: 'O(n) Time • O(n) Map'
    }
  },
  mcq: {
    python: {
      lang: 'MCQ Verdict',
      code: `/* Online Exam Question: Data Structures */\nVerdict: OPTION [B] Hash Map (Hash Table)\nConfidence: 99.8%\nReasoning: Hash Map provides O(1) amortized lookup via hash function.\nDistractors: BST is O(n) worst-case, Red-Black is O(log n).`,
      complexity: 'Confidence: 99.8%'
    }
  },
  interview: {
    python: {
      lang: 'Interview Ear',
      code: `Interviewer: "How would you handle cache stampede in a high-scale service?"\n\nGhost Talking Points:\n1. Mutex locking (single-flight cache fill).\n2. Probabilistic early expiration (XFetch algorithm).\n3. Background worker refreshes before key hard TTL.`,
      complexity: 'Audio Ear Live'
    }
  }
};

export default function OverlayPlayground({ onTriggerToast, theme }) {
  const [mode, setMode] = useState('leetcode');
  const [lang, setLang] = useState('cpp');
  const [opacity, setOpacity] = useState(90);
  const [copied, setCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [panicHidden, setPanicHidden] = useState(false);

  const modeData = DATA[mode] || DATA.leetcode;
  const current = modeData[lang] || modeData.cpp || modeData.python;

  const handleCopy = () => {
    playTechBeep('click');
    navigator.clipboard.writeText(current.code);
    setCopied(true);
    if (onTriggerToast) onTriggerToast('Code copied to clipboard (Alt + Shift + C)', 'copy');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateTyper = () => {
    playTechBeep('snip');
    setIsTyping(true);
    if (onTriggerToast) onTriggerToast('Simulating realistic human typing (Anti-Paste Bypass)...', 'keyboard');
    setTimeout(() => {
      setIsTyping(false);
      if (onTriggerToast) onTriggerToast('Human typing simulation complete!', 'check');
    }, 1600);
  };

  const handlePanic = () => {
    playTechBeep('panic');
    const next = !panicHidden;
    setPanicHidden(next);
    if (onTriggerToast) onTriggerToast(next ? 'Panic mode: Overlay hidden' : 'Overlay restored', 'panic');
  };

  return (
    <PlaygroundWrapper id="playground">
      <div className="minimal-container">
        {/* Minimal Section Header */}
        <div className="playground-head">
          <div className="minimal-tag">
            <IconCode size={13} color="var(--emerald-neon)" />
            <span>LIVE INTERACTIVE HUD PLAYGROUND</span>
          </div>
          <h2 className="minimal-headline">
            The Translucent Floating Assistant
          </h2>
          <p className="minimal-sub">
            Interact with the actual desktop window layout. Test multi-language code generation, window opacity, and anti-paste human auto-typing.
          </p>
        </div>

        {/* Desktop Canvas Container */}
        <div className="desktop-stage-canvas minimal-slate">
          {/* Wallpaper with subtle pattern */}
          <div className="stage-wallpaper user-pattern-geometric" aria-hidden="true" />

          {/* Controls Bar */}
          <div className="stage-controls-bar">
            {/* Mode Switcher */}
            <div className="mode-toggle-group">
              <button
                className={`mode-btn ${mode === 'leetcode' ? 'active' : ''}`}
                onClick={() => { playTechBeep('click'); setMode('leetcode'); }}
              >
                LeetCode Mode
              </button>
              <button
                className={`mode-btn ${mode === 'mcq' ? 'active' : ''}`}
                onClick={() => { playTechBeep('click'); setMode('mcq'); }}
              >
                MCQ Verdict
              </button>
              <button
                className={`mode-btn ${mode === 'interview' ? 'active' : ''}`}
                onClick={() => { playTechBeep('click'); setMode('interview'); }}
              >
                Interview Ear
              </button>
            </div>

            {/* Language & Opacity */}
            <div className="controls-right">
              {mode === 'leetcode' && (
                <div className="lang-pill-selector">
                  {['cpp', 'python', 'java'].map((l) => (
                    <button
                      key={l}
                      className={`lang-btn ${lang === l ? 'active' : ''}`}
                      onClick={() => { playTechBeep('click'); setLang(l); }}
                    >
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              )}

              <div className="opacity-control">
                <span className="opacity-lbl">Opacity: {opacity}%</span>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="opacity-slider"
                />
              </div>

              <button className="btn-panic" onClick={handlePanic} title="Test Emergency Panic Hide (Alt+H)">
                <IconPanic size={13} />
                <span>{panicHidden ? 'Restore' : 'Panic Hide'}</span>
              </button>
            </div>
          </div>

          {/* The Floating Overlay Window */}
          <div className="stage-viewport">
            {!panicHidden ? (
              <div
                className="floating-overlay-window"
                style={{ opacity: opacity / 100 }}
              >
                {/* Overlay 44px Super Header */}
                <div className="window-header">
                  <div className="win-left">
                    <span className="win-dot" />
                    <span className="win-title">Ghost AI</span>
                    <span className="win-mode-badge">{mode.toUpperCase()}</span>
                    <span className="win-wallet-pill">₹25 • 10m</span>
                  </div>

                  <div className="win-actions">
                    <button className="win-action-btn" onClick={handleCopy}>
                      {copied ? <IconCheck size={12} color="var(--emerald-neon)" /> : <IconCopy size={12} />}
                      <span>{copied ? 'Copied' : 'Copy Code'}</span>
                    </button>
                    <button className="win-action-btn" onClick={handleSimulateTyper} disabled={isTyping}>
                      <IconZap size={12} color="var(--emerald-neon)" />
                      <span>{isTyping ? 'Typing...' : 'Auto-Type'}</span>
                    </button>
                  </div>
                </div>

                {/* Solution Body */}
                <div className="window-content">
                  <div className="content-meta">
                    <span className="meta-lang">{current.lang}</span>
                    <span className="meta-comp">{current.complexity}</span>
                  </div>
                  <pre className="content-code">
                    <code>{current.code}</code>
                  </pre>
                </div>

                {/* Window Footer */}
                <div className="window-footer">
                  <span className="foot-status">● Safe Focus Lock Active (0 Blurs)</span>
                  <span className="foot-tele">Excluded From Zoom &bull; Teams &bull; Meet</span>
                </div>
              </div>
            ) : (
              <div className="panic-hidden-state">
                <IconPanic size={24} color="var(--emerald-neon)" />
                <span>Ghost AI is hidden on your monitor (Press Alt+H or click Restore to unhide)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </PlaygroundWrapper>
  );
}

const PlaygroundWrapper = styled.section`
  padding: 100px 0;
  border-top: 1px solid var(--border-subtle);

  .playground-head {
    margin-bottom: 2.5rem;
  }

  .desktop-stage-canvas {
    position: relative;
    box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4);
    min-height: 520px;
    overflow: hidden;
  }

  .stage-wallpaper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.35;
    pointer-events: none;
  }

  .stage-controls-bar {
    position: relative;
    z-index: 5;
    padding: 12px 20px;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border-subtle);
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .mode-toggle-group {
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
    font-size: 12px;
    font-weight: 600;
    padding: 5px 12px;
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

  .controls-right {
    display: flex;
    align-items: center;
    gap: 14px;
    flex-wrap: wrap;
  }

  .lang-pill-selector {
    display: flex;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid var(--border-subtle);
    border-radius: 6px;
    padding: 2px;
  }

  .lang-btn {
    background: transparent;
    border: none;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    color: var(--text-muted);
    padding: 3px 8px;
    border-radius: 4px;
    cursor: pointer;

    &.active {
      color: var(--emerald-neon);
      background: rgba(45, 212, 191, 0.12);
    }
  }

  .opacity-control {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .opacity-lbl {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
  }

  .opacity-slider {
    width: 80px;
    height: 4px;
    border-radius: 9999px;
    outline: none;
    cursor: pointer;
  }

  .btn-panic {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(244, 63, 94, 0.1);
    border: 1px solid rgba(244, 63, 94, 0.3);
    color: #f43f5e;
    font-size: 11px;
    font-weight: 700;
    padding: 5px 12px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: rgba(244, 63, 94, 0.2);
    }
  }

  .stage-viewport {
    position: relative;
    z-index: 2;
    padding: 40px 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 440px;
  }

  /* Floating Window */
  .floating-overlay-window {
    width: 100%;
    max-width: 660px;
    background: rgba(10, 15, 29, 0.9);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    overflow: hidden;
    transition: opacity 0.2s ease;
  }

  .window-header {
    height: 44px;
    padding: 0 14px;
    background: rgba(0, 0, 0, 0.35);
    border-bottom: 1px solid var(--border-subtle);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .win-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .win-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--emerald-neon);
  }

  .win-title {
    font-family: var(--font-display);
    font-size: 13px;
    font-weight: 800;
    color: var(--text-headline);
  }

  .win-mode-badge {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--emerald-neon);
    background: rgba(45, 212, 191, 0.1);
    padding: 1px 6px;
    border-radius: 4px;
    font-weight: 700;
  }

  .win-wallet-pill {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--text-muted);
    background: rgba(255, 255, 255, 0.05);
    padding: 1px 6px;
    border-radius: 4px;
  }

  .win-actions {
    display: flex;
    gap: 8px;
  }

  .win-action-btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-subtle);
    color: var(--text-headline);
    font-size: 11px;
    font-weight: 600;
    padding: 4px 9px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--border-glass);
    }
  }

  .window-content {
    padding: 16px;
  }

  .content-meta {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    margin-bottom: 10px;
  }

  .meta-comp {
    color: var(--emerald-neon);
  }

  .content-code {
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid var(--border-subtle);
    border-radius: 6px;
    padding: 14px;
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1.55;
    color: var(--emerald-neon);
    overflow-x: auto;
    max-height: 220px;
  }

  .window-footer {
    padding: 10px 14px;
    background: rgba(0, 0, 0, 0.25);
    border-top: 1px solid var(--border-subtle);
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: var(--text-muted);
  }

  .foot-status {
    color: var(--emerald-neon);
    font-weight: 600;
  }

  .panic-hidden-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    color: var(--text-muted);
    font-size: 13px;
  }
`;
