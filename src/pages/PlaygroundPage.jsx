import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';
import {
  IconCode,
  IconKeyboard,
  IconPanic,
  IconCopy,
  IconCheck,
  IconZap,
  IconShieldCheck,
  IconArrowRight,
  IconChevronDown,
  IconTerminal,
  IconCpu
} from '../components/Icons';

export default function PlaygroundPage({ onTriggerToast, theme }) {
  const [activeProblem, setActiveProblem] = useState('twoSum');
  const [activeTab, setActiveTab] = useState('code');
  const [isTyping, setIsTyping] = useState(false);
  const [panicMode, setPanicMode] = useState(false);
  const [wpmSpeed, setWpmSpeed] = useState(65);
  const [typedBuffer, setTypedBuffer] = useState('');
  const [isSimulatingLiveInput, setIsSimulatingLiveInput] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const typingTimerRef = useRef(null);

  const problems = {
    twoSum: {
      title: '1. Two Sum (LeetCode Easy/Medium)',
      tags: ['Array', 'Hash Map', 'One-Pass'],
      code: `// Time: O(N) | Space: O(N)
class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        throw new IllegalArgumentException("No two sum solution");
    }
}`,
      complexity: 'Time: O(N) single pass traversing array. Space: O(N) auxiliary hash table storing at most N elements.',
      edgeCases: 'Empty array, negative integers, zero target, multiple duplicate candidates with same difference.',
      verbalHook: 'Explain clearly: "I will use a single pass hash table where the complement is looked up in O(1) time before inserting the current index."'
    },
    lruCache: {
      title: '146. LRU Cache (LeetCode Medium/Hard)',
      tags: ['Hash Table', 'Doubly Linked List', 'O(1) Get/Put'],
      code: `class LRUCache {
    class Node {
        int key, val;
        Node prev, next;
        Node(int k, int v) { key = k; val = v; }
    }
    private final int capacity;
    private final Map<Integer, Node> map = new HashMap<>();
    private final Node head = new Node(0, 0), tail = new Node(0, 0);

    public LRUCache(int capacity) {
        this.capacity = capacity;
        head.next = tail; tail.prev = head;
    }
    public int get(int key) {
        if (!map.containsKey(key)) return -1;
        Node node = map.get(key);
        remove(node); insert(node);
        return node.val;
    }
}`,
      complexity: 'Time: O(1) strict for both get() and put(). Space: O(capacity) bounded memory footprint.',
      edgeCases: 'Zero capacity, updating existing key without evicting, immediate consecutive gets on tail node.',
      verbalHook: 'Start with: "To achieve strict O(1) updates and eviction, we combine a Hash Map with a Doubly Linked List with dummy head and tail sentinels."'
    },
    rateLimiter: {
      title: 'System Design: Distributed Token Bucket Rate Limiter',
      tags: ['System Design', 'Redis', 'Concurrency'],
      code: `// Redis Lua Script for Atomic Token Bucket
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local current = tonumber(redis.call('get', key) or "0")

if current + 1 > limit then
    return 0 -- Rejected (Rate limit exceeded)
else
    redis.call("INCRBY", key, 1)
    if current == 0 then
        redis.call("EXPIRE", key, 1) -- 1 second sliding window
    end
    return 1 -- Allowed
end`,
      complexity: 'Latency: <1.2ms via single round-trip atomic Lua script inside Redis cluster. Concurrency: Race-condition free.',
      edgeCases: 'Clock drift across nodes, sudden flash traffic bursts, Redis replica failover latency.',
      verbalHook: 'Lead with: "Rather than multi-step read-modify-writes susceptible to race conditions, we execute an atomic Lua script directly in Redis memory."'
    }
  };

  const current = problems[activeProblem];

  const handleCopyCode = () => {
    playTechBeep('click');
    navigator.clipboard.writeText(current.code);
    if (onTriggerToast) onTriggerToast('Solution code copied (Alt + Shift + C)', 'copy');
  };

  const handleSimulateHumanTyping = () => {
    playTechBeep('type');
    setIsTyping(true);
    if (onTriggerToast) onTriggerToast('Human typing simulation started (Anti-Paste Engine)...', 'keyboard');
    setTimeout(() => {
      setIsTyping(false);
      if (onTriggerToast) onTriggerToast('Human typing completed with randomized keystroke intervals!', 'check');
    }, 1800);
  };

  const handlePanicToggle = () => {
    playTechBeep('panic');
    const next = !panicMode;
    setPanicMode(next);
    if (onTriggerToast) onTriggerToast(next ? 'Emergency Panic Mode: Overlay hidden!' : 'Overlay restored to normal viewport', next ? 'panic' : 'zap');
  };

  // Live anti-paste simulation into the test input box
  const startLiveTypeSimulation = () => {
    playTechBeep('type');
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setTypedBuffer('');
    setIsSimulatingLiveInput(true);

    const sample = `int complement = target - nums[i];`;
    let i = 0;
    const intervalMs = Math.max(25, Math.floor(60000 / (wpmSpeed * 5)));

    typingTimerRef.current = setInterval(() => {
      if (i < sample.length) {
        setTypedBuffer((prev) => prev + sample[i]);
        i++;
      } else {
        clearInterval(typingTimerRef.current);
        setIsSimulatingLiveInput(false);
        playTechBeep('snip');
        if (onTriggerToast) onTriggerToast(`Typed 34 characters at ${wpmSpeed} WPM with human jitter!`, 'check');
      }
    }, intervalMs);
  };

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  return (
    <PageWrapper>
      {/* 1. Hero & Engine Status */}
      <HeroSection>
        <div className="telemetry-badge">
          <IconKeyboard size={14} color="var(--emerald-neon)" />
          <span>ANTI-PASTE HUMAN TYPING & STEALTH LAB</span>
        </div>

        <h1 className="hero-title">
          Interactive <span className="gradient-text">AI Copilot Studio</span>
        </h1>
        <p className="hero-subtitle">
          Test real-time interview suggestions, examine complexity breakdown breakdowns, and test our Anti-Paste
          human typing engine that mimics natural human keyboard delays with zero clipboard event triggers.
        </p>

        <StatusPillsGrid>
          <div className="status-pill">
            <span className="dot active" />
            <span className="title">Anti-Paste Engine:</span>
            <span className="val">Active (Random Jitter)</span>
          </div>
          <div className="status-pill">
            <span className="dot active" />
            <span className="title">Focus Trap Evasion:</span>
            <span className="val">WS_EX_NOACTIVATE</span>
          </div>
          <div className="status-pill">
            <span className="dot active" />
            <span className="title">Panic Response:</span>
            <span className="val">&lt;1ms Hotkey Cloak</span>
          </div>
          <div className="status-pill">
            <span className="dot active" />
            <span className="title">Latency Overhead:</span>
            <span className="val">0.4ms GPU Overhead</span>
          </div>
        </StatusPillsGrid>
      </HeroSection>

      {/* 2. Interactive Playground Lab */}
      <PlaygroundLabSection>
        {/* Problem Selector Bar */}
        <ProblemSelectorBar>
          <div className="problems-list">
            {Object.entries(problems).map(([key, data]) => (
              <button
                key={key}
                className={`problem-btn ${activeProblem === key ? 'active' : ''}`}
                onClick={() => {
                  playTechBeep('click');
                  setActiveProblem(key);
                }}
              >
                <span>{data.title.split('(')[0]}</span>
                <span className="tag">{data.tags[0]}</span>
              </button>
            ))}
          </div>

          <div className="action-buttons">
            <button className="btn-action copy" onClick={handleCopyCode}>
              <IconCopy size={14} />
              <span>Copy Code</span>
            </button>
            <button className={`btn-action type ${isTyping ? 'typing' : ''}`} onClick={handleSimulateHumanTyping} disabled={isTyping}>
              <IconKeyboard size={14} />
              <span>{isTyping ? 'Simulating Keystrokes...' : 'Anti-Paste Type'}</span>
            </button>
            <button className={`btn-action panic ${panicMode ? 'active' : ''}`} onClick={handlePanicToggle}>
              <IconPanic size={14} />
              <span>{panicMode ? 'Restore Overlay' : 'Panic Cloak'}</span>
            </button>
          </div>
        </ProblemSelectorBar>

        {/* Code & Explanation Viewport */}
        <LabViewport>
          {!panicMode ? (
            <>
              <div className="viewport-tabs">
                <button className={`tab-btn ${activeTab === 'code' ? 'active' : ''}`} onClick={() => setActiveTab('code')}>
                  <IconCode size={13} />
                  <span>Optimal Solution Code</span>
                </button>
                <button className={`tab-btn ${activeTab === 'analysis' ? 'active' : ''}`} onClick={() => setActiveTab('analysis')}>
                  <IconZap size={13} />
                  <span>Complexity & Edge Cases</span>
                </button>
                <button className={`tab-btn ${activeTab === 'verbal' ? 'active' : ''}`} onClick={() => setActiveTab('verbal')}>
                  <IconTerminal size={13} />
                  <span>Interviewer Talking Points</span>
                </button>
              </div>

              <div className="tab-content">
                {activeTab === 'code' && (
                  <pre className="code-block">
                    <code>{current.code}</code>
                  </pre>
                )}

                {activeTab === 'analysis' && (
                  <div className="analysis-box">
                    <div className="analysis-item">
                      <h4>Time & Space Invariants</h4>
                      <p>{current.complexity}</p>
                    </div>
                    <div className="analysis-item">
                      <h4>Common Edge Cases & Traps</h4>
                      <p>{current.edgeCases}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'verbal' && (
                  <div className="verbal-box">
                    <h4>What to Say to the Interviewer First</h4>
                    <p className="hook-quote">{current.verbalHook}</p>
                    <p className="hook-tip">
                      Tip: Explaining your solution approach out loud before touching the keyboard establishes senior communication style and buys time for full solution verification.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <PanicCloakMessage>
              <div className="panic-icon">
                <IconPanic size={32} color="#ef4444" />
              </div>
              <h3>EMERGENCY PANIC CLOAK ACTIVE</h3>
              <p>The overlay window has vanished from memory and screen composition. Zero pixels rendered.</p>
              <button className="btn-restore" onClick={handlePanicToggle}>
                Press Alt + Shift + X or Click to Restore
              </button>
            </PanicCloakMessage>
          )}
        </LabViewport>
      </PlaygroundLabSection>

      {/* 3. Anti-Paste Human Typing Speed Controller */}
      <TypingEngineSection>
        <div className="section-head">
          <div className="category-pill">
            <IconKeyboard size={13} color="var(--emerald-neon)" />
            <span>ANTI-PASTE TYPING SYNTHESIZER</span>
          </div>
          <h2>Bypass Proctor Clipboard Detection with Natural Keystrokes</h2>
          <p>
            Proctoring platforms intercept <code>Ctrl+V</code> or <code>document.onpaste</code> events.
            Ghost AI converts full solutions into simulated hardware keypresses with Gaussian jitter and natural syntax pauses.
          </p>
        </div>

        <TypingControlsCard>
          <div className="speed-controller-row">
            <div className="wpm-display">
              <span className="wpm-val">{wpmSpeed}</span>
              <span className="wpm-label">WORDS PER MINUTE (WPM)</span>
            </div>

            <div className="slider-container">
              <div className="slider-labels">
                <span>Relaxed (35 WPM)</span>
                <span>Natural Human (65 WPM)</span>
                <span>Competitive Typist (110 WPM)</span>
              </div>
              <input
                type="range"
                min="35"
                max="110"
                value={wpmSpeed}
                onChange={(e) => setWpmSpeed(Number(e.target.value))}
              />
            </div>

            <button
              className={`btn-test-typing ${isSimulatingLiveInput ? 'active' : ''}`}
              onClick={startLiveTypeSimulation}
              disabled={isSimulatingLiveInput}
            >
              <IconKeyboard size={15} />
              <span>{isSimulatingLiveInput ? 'Typing in real-time...' : 'Run Typing Test'}</span>
            </button>
          </div>

          <div className="live-typing-preview">
            <div className="preview-top">
              <span className="preview-title">Interactive Candidate Input Box (Simulated IDE Target):</span>
              <span className="preview-indicator">{isSimulatingLiveInput ? 'Receiving synthetic keystrokes...' : 'Ready for test'}</span>
            </div>
            <div className="typed-canvas">
              <span className="text">{typedBuffer || 'Click "Run Typing Test" above to watch characters stream with variable human cadence...'}</span>
              <span className="cursor" />
            </div>
          </div>
        </TypingControlsCard>
      </TypingEngineSection>

      {/* 4. Click-Through Architecture & Evasion Grid */}
      <ArchitectureGridSection>
        <div className="section-head">
          <div className="category-pill">
            <IconShieldCheck size={13} color="#38bdf8" />
            <span>ENGINE ARCHITECTURE</span>
          </div>
          <h2>Zero-Footprint Stealth Protections</h2>
          <p>Engineered from the ground up for strict compatibility with high-stakes technical evaluations.</p>
        </div>

        <DefenseCardsGrid>
          <div className="defense-card">
            <div className="card-top">
              <IconShieldCheck size={20} color="var(--emerald-neon)" />
              <span className="pill">Click-Through</span>
            </div>
            <h4>WS_EX_TRANSPARENT</h4>
            <p>
              Mouse clicks and scroll events pass directly through the overlay window to your code editor below.
              You never accidentally click or select the overlay.
            </p>
          </div>

          <div className="defense-card">
            <div className="card-top">
              <IconZap size={20} color="#38bdf8" />
              <span className="pill">Focus Lock</span>
            </div>
            <h4>WS_EX_NOACTIVATE</h4>
            <p>
              Prevents Windows from activating or focusing the overlay window.
              Your browser never fires <code>window.onblur</code>, <code>visibilitychange</code>, or focus loss alerts.
            </p>
          </div>

          <div className="defense-card">
            <div className="card-top">
              <IconPanic size={20} color="#ef4444" />
              <span className="pill">Killswitch</span>
            </div>
            <h4>Instant Panic Mode</h4>
            <p>
              Pressing <code>Alt + Shift + X</code> drops window visibility in under 1 millisecond.
              If an interviewer asks you to adjust cameras or share whole desktop, the screen is instantly clean.
            </p>
          </div>

          <div className="defense-card">
            <div className="card-top">
              <IconCpu size={20} color="#a855f7" />
              <span className="pill">Micro Footprint</span>
            </div>
            <h4>Lightweight C++/Python Core</h4>
            <p>
              Uses negligible system resources (0.8% CPU, 45MB RAM).
              No bloated Electron Chromium instances running in background to trigger proctor process scans.
            </p>
          </div>
        </DefenseCardsGrid>
      </ArchitectureGridSection>

      {/* 5. Playground FAQ */}
      <FaqSection>
        <div className="section-head">
          <div className="category-pill">
            <IconTerminal size={13} color="#a855f7" />
            <span>DEVELOPER FAQ</span>
          </div>
          <h2>Frequently Asked Playground Questions</h2>
          <p>Common questions about human typing cadence, shortcut bindings, and proctor evasion.</p>
        </div>

        <div className="faq-accordion">
          {[
            {
              q: 'How does the Anti-Paste Human Typing engine prevent proctors from flagging code pastes?',
              a: 'When you copy code with standard Ctrl+V, browsers fire the paste event, which proctors like HackerRank, Mercer Mettl, and Codility measure for sudden character influx. Ghost AI uses native OS SendInput with randomized delays between keystrokes (35-85ms) with natural micro-pauses at punctuation, making it indistinguishable from human typing.'
            },
            {
              q: 'Can I customize the hotkey combinations if they conflict with my IDE shortcuts?',
              a: 'Yes. All hotkey bindings (such as Alt+Shift+C for copy, Alt+Shift+V for typing, and Alt+Shift+X for panic) can be easily configured via the local config.json file in the application directory.'
            },
            {
              q: 'Does Ghost AI support custom system design and behavioral rounds, or only DSA?',
              a: 'Ghost AI supports full technical interview rounds including Data Structures & Algorithms, System Design diagrams and bottlenecks, and Behavioral STAR scenarios with immediate speech synthesis.'
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
            <span className="gateway-tag">AFFORDABLE ON-DEMAND ACCESS</span>
            <h3>Ready to Run Ghost AI in Your Live Interview?</h3>
            <p>Recharge only for the minutes you use at ₹2.5/min. No recurring subscription traps.</p>
          </div>
          <div className="gateway-actions">
            <a href="#pricing" className="btn-gateway primary">
              <span>View Transparent Pricing</span>
              <IconArrowRight size={14} />
            </a>
            <a href="#simulator" className="btn-gateway secondary">
              <span>Test Invisibility Simulator</span>
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

const StatusPillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 2rem;

  .status-pill {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    border-radius: 12px;
    padding: 0.85rem 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.78rem;

    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--emerald-neon);
      box-shadow: 0 0 6px var(--emerald-neon);
    }

    .title {
      color: var(--text-muted);
      font-weight: 600;
    }

    .val {
      color: var(--text-headline);
      font-weight: 700;
      margin-left: auto;
    }
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PlaygroundLabSection = styled.section`
  margin-bottom: 4.5rem;
`;

const ProblemSelectorBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem 1.4rem;
  background: var(--bg-card);
  border: 1px solid var(--border-glass);
  border-radius: 16px 16px 0 0;
  border-bottom: none;

  .problems-list {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;

    .problem-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.9rem;
      border-radius: 8px;
      border: 1px solid var(--border-glass);
      background: transparent;
      color: var(--text-muted);
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      .tag {
        font-size: 0.68rem;
        background: rgba(255, 255, 255, 0.08);
        padding: 0.15rem 0.45rem;
        border-radius: 4px;
        color: var(--text-muted);
      }

      &:hover {
        color: var(--text-headline);
        border-color: rgba(255, 255, 255, 0.2);
      }

      &.active {
        background: rgba(82, 183, 136, 0.15);
        border-color: var(--emerald-neon);
        color: var(--emerald-neon);

        .tag {
          background: rgba(82, 183, 136, 0.25);
          color: var(--emerald-neon);
        }
      }
    }
  }

  .action-buttons {
    display: flex;
    align-items: center;
    gap: 0.6rem;

    .btn-action {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.5rem 0.95rem;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid var(--border-glass);
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-headline);

      &.copy:hover {
        border-color: #38bdf8;
        color: #38bdf8;
      }

      &.type {
        background: rgba(82, 183, 136, 0.12);
        border-color: rgba(82, 183, 136, 0.3);
        color: var(--emerald-neon);

        &:hover:not(:disabled) {
          background: var(--emerald-neon);
          color: #06100c;
        }

        &.typing {
          opacity: 0.7;
          cursor: wait;
        }
      }

      &.panic {
        background: rgba(239, 68, 68, 0.1);
        border-color: rgba(239, 68, 68, 0.3);
        color: #f87171;

        &:hover, &.active {
          background: #ef4444;
          color: #fff;
        }
      }
    }
  }
`;

const LabViewport = styled.div`
  border: 1px solid var(--border-glass);
  border-radius: 0 0 16px 16px;
  background: #090c12;
  overflow: hidden;

  .viewport-tabs {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--border-glass);
    background: rgba(0, 0, 0, 0.3);

    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.75rem 1.3rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-muted);
      background: transparent;
      border: none;
      border-bottom: 2px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        color: var(--text-headline);
      }

      &.active {
        color: var(--emerald-neon);
        border-bottom-color: var(--emerald-neon);
        background: rgba(82, 183, 136, 0.06);
      }
    }
  }

  .tab-content {
    padding: 1.5rem;
    min-height: 320px;

    .code-block {
      margin: 0;
      font-family: monospace;
      font-size: 0.88rem;
      line-height: 1.6;
      color: #e2e8f0;
      white-space: pre-wrap;
    }

    .analysis-box {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;

      .analysis-item {
        background: var(--bg-card);
        border: 1px solid var(--border-glass);
        border-radius: 10px;
        padding: 1.2rem;

        h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--emerald-neon);
          margin-bottom: 0.5rem;
        }

        p {
          font-size: 0.85rem;
          line-height: 1.6;
          color: var(--text-muted);
          margin: 0;
        }
      }

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .verbal-box {
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: 12px;
      padding: 1.5rem;

      h4 {
        font-size: 0.95rem;
        font-weight: 700;
        color: #38bdf8;
        margin-bottom: 0.8rem;
      }

      .hook-quote {
        font-size: 1.05rem;
        font-style: italic;
        color: var(--text-headline);
        line-height: 1.6;
        padding-left: 1rem;
        border-left: 3px solid #38bdf8;
        margin-bottom: 1.2rem;
      }

      .hook-tip {
        font-size: 0.85rem;
        color: var(--text-muted);
        line-height: 1.55;
        margin: 0;
      }
    }
  }
`;

const PanicCloakMessage = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .panic-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(239, 68, 68, 0.15);
    border: 1px solid rgba(239, 68, 68, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1.2rem;
  }

  h3 {
    font-size: 1.4rem;
    font-weight: 800;
    color: #f87171;
    letter-spacing: 0.05em;
    margin-bottom: 0.6rem;
  }

  p {
    font-size: 0.9rem;
    color: var(--text-muted);
    max-width: 440px;
    line-height: 1.5;
    margin-bottom: 1.5rem;
  }

  .btn-restore {
    padding: 0.7rem 1.4rem;
    border-radius: 8px;
    border: 1px solid var(--border-glass);
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-headline);
    font-size: 0.85rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.18);
    }
  }
`;

const TypingEngineSection = styled.section`
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
`;

const TypingControlsCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-glass);
  border-radius: 16px;
  padding: 1.8rem;

  .speed-controller-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
    padding-bottom: 1.8rem;
    border-bottom: 1px solid var(--border-glass);

    .wpm-display {
      display: flex;
      flex-direction: column;

      .wpm-val {
        font-size: 2.4rem;
        font-weight: 800;
        color: var(--emerald-neon);
        line-height: 1;
      }

      .wpm-label {
        font-size: 0.68rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: var(--text-muted);
        margin-top: 0.3rem;
      }
    }

    .slider-container {
      flex: 1;
      min-width: 280px;

      .slider-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.75rem;
        color: var(--text-muted);
        margin-bottom: 0.5rem;
      }

      input[type='range'] {
        width: 100%;
        accent-color: var(--emerald-neon);
      }
    }

    .btn-test-typing {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.8rem 1.4rem;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 700;
      background: var(--emerald-neon);
      color: #06100c;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 4px 20px rgba(82, 183, 136, 0.4);
      }

      &.active {
        opacity: 0.8;
        cursor: wait;
      }
    }
  }

  .live-typing-preview {
    margin-top: 1.8rem;

    .preview-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.8rem;
      font-size: 0.8rem;

      .preview-title {
        color: var(--text-headline);
        font-weight: 600;
      }

      .preview-indicator {
        font-family: monospace;
        color: var(--emerald-neon);
      }
    }

    .typed-canvas {
      background: #090c12;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 1.2rem;
      min-height: 80px;
      font-family: monospace;
      font-size: 0.95rem;
      color: #38bdf8;
      display: flex;
      align-items: center;

      .text {
        letter-spacing: 0.02em;
      }

      .cursor {
        display: inline-block;
        width: 8px;
        height: 18px;
        background: var(--emerald-neon);
        margin-left: 4px;
        animation: blink 1s infinite;
      }

      @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
      }
    }
  }
`;

const ArchitectureGridSection = styled.section`
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
    }

    p {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.6;
    }
  }
`;

const DefenseCardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.2rem;

  .defense-card {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    border-radius: 14px;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    transition: all 0.2s ease;

    &:hover {
      border-color: rgba(82, 183, 136, 0.3);
      transform: translateY(-3px);
    }

    .card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .pill {
        font-size: 0.68rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.06);
        color: var(--text-muted);
      }
    }

    h4 {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--text-headline);
      font-family: monospace;
    }

    p {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin: 0;
    }
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
