import React, { useState } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';
import {
  IconTerminal,
  IconCopy,
  IconCheck,
  IconShieldCheck,
  IconZap,
  IconArrowRight,
  IconChevronDown,
  IconCpu,
  IconLayers,
  IconKeyboard,
  IconPanic
} from '../components/Icons';

export default function DocsPage({ onTriggerToast, theme }) {
  const [activeStep, setActiveStep] = useState(0);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [openFaq, setOpenFaq] = useState(0);

  const installSteps = [
    {
      step: '01',
      title: 'Environment & Prerequisites',
      desc: 'Ensure you have Python 3.10+ installed on Windows 10 or Windows 11 with 64-bit architecture.',
      code: `python --version
# Expected: Python 3.10.x or higher`
    },
    {
      step: '02',
      title: 'Install Lightweight Core Dependencies',
      desc: 'Install the native dependencies for Windows DWM window management, Core Audio, and input synthesis.',
      code: `pip install PyQt6 pywin32 sounddevice pyaudio pynput`
    },
    {
      step: '03',
      title: 'Configure Your API Key & Shortcuts',
      desc: 'Set your preferred AI model provider (OpenAI, Anthropic Claude, or Google Gemini) in config.json.',
      code: `{
  "api_provider": "gemini",
  "api_key": "YOUR_AI_API_KEY",
  "hotkeys": {
    "copy_code": "alt+shift+c",
    "anti_paste_type": "alt+shift+v",
    "panic_cloak": "alt+shift+x"
  }
}`
    },
    {
      step: '04',
      title: 'Launch with Silent VBS Runner',
      desc: 'Launch Ghost AI silently without an open command prompt terminal or visible taskbar icon.',
      code: `cscript //nologo run_stealth.vbs`
    }
  ];

  const masterHotkeys = [
    { keys: ['Alt', 'Shift', 'C'], action: 'Copy Solution Code', desc: 'Copies current recommended code to clipboard silently without opening overlay.' },
    { keys: ['Alt', 'Shift', 'V'], action: 'Anti-Paste Human Typing', desc: 'Injects solution with Gaussian typing delays (50-80 WPM) directly into code editor.' },
    { keys: ['Alt', 'Shift', 'X'], action: 'Emergency Panic Mode', desc: 'Drops overlay window immediately in <1ms. Vanishes from display and memory buffer.' },
    { keys: ['Alt', 'Shift', 'A'], action: 'Listen & Transcribe Voice', desc: 'Triggers WASAPI audio capture to record interviewer question passively.' },
    { keys: ['Alt', 'Shift', 'H'], action: 'Toggle Compact HUD', desc: 'Switches between full solution view and ultra-discreet single-line hint mode.' }
  ];

  const handleCopyCode = (code, idx) => {
    playTechBeep('click');
    navigator.clipboard.writeText(code);
    setCopiedIndex(idx);
    if (onTriggerToast) onTriggerToast('Terminal command copied to clipboard!', 'copy');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <PageWrapper>
      {/* 1. Hero & Documentation Overview */}
      <HeroSection>
        <div className="telemetry-badge">
          <IconTerminal size={14} color="var(--emerald-neon)" />
          <span>TECHNICAL DOCUMENTATION & SETUP HANDBOOK</span>
        </div>

        <h1 className="hero-title">
          Developer <span className="gradient-text">Quickstart & Architecture</span>
        </h1>
        <p className="hero-subtitle">
          Everything you need to configure Ghost AI for stealth operations on Windows 10 and 11.
          From silent background launchers to zero-driver WASAPI loopback audio routing.
        </p>

        <SpecsGrid>
          <div className="spec-card">
            <span className="spec-title">Target OS:</span>
            <span className="spec-val highlight">Windows 10 / 11 (64-bit)</span>
          </div>
          <div className="spec-card">
            <span className="spec-title">Memory Footprint:</span>
            <span className="spec-val green">~42 MB RAM</span>
          </div>
          <div className="spec-card">
            <span className="spec-title">Audio Pipeline:</span>
            <span className="spec-val highlight">WASAPI Core Audio Loopback</span>
          </div>
          <div className="spec-card">
            <span className="spec-title">Silent Launcher:</span>
            <span className="spec-val green">VBScript Runner Included</span>
          </div>
        </SpecsGrid>
      </HeroSection>

      {/* 2. Step-by-Step Installation Pipeline */}
      <PipelineSection>
        <div className="section-head">
          <div className="category-pill">
            <IconZap size={13} color="var(--emerald-neon)" />
            <span>4-STEP SETUP PIPELINE</span>
          </div>
          <h2>Install & Launch in Under 2 Minutes</h2>
        </div>

        <div className="steps-container">
          <div className="steps-nav">
            {installSteps.map((step, idx) => (
              <button
                key={idx}
                className={`step-nav-btn ${activeStep === idx ? 'active' : ''}`}
                onClick={() => {
                  playTechBeep('click');
                  setActiveStep(idx);
                }}
              >
                <span className="step-badge">{step.step}</span>
                <span className="step-text">{step.title}</span>
              </button>
            ))}
          </div>

          <div className="step-details-card">
            <div className="card-top">
              <span className="step-indicator">STEP {installSteps[activeStep].step}</span>
              <h3>{installSteps[activeStep].title}</h3>
              <p className="desc">{installSteps[activeStep].desc}</p>
            </div>

            <div className="code-block-wrapper">
              <div className="code-header">
                <span className="code-label">Command / Configuration:</span>
                <button
                  className="btn-copy-code"
                  onClick={() => handleCopyCode(installSteps[activeStep].code, activeStep)}
                >
                  <IconCopy size={13} />
                  <span>{copiedIndex === activeStep ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <pre className="code-snippet">
                <code>{installSteps[activeStep].code}</code>
              </pre>
            </div>
          </div>
        </div>
      </PipelineSection>

      {/* 3. Audio Setup Masterclass */}
      <AudioSetupSection>
        <div className="section-head">
          <div className="category-pill">
            <IconCpu size={13} color="#38bdf8" />
            <span>AUDIO PIPELINE</span>
          </div>
          <h2>Zero-Driver Audio Loopback: How Ghost AI Listens</h2>
          <p>
            Standard tools install virtual microphone drivers (like VB-Cable) that proctor security software easily flags in device manager.
            Ghost AI taps Windows Core Audio (WASAPI) loopback directly from your active headphones.
          </p>
        </div>

        <AudioGrid>
          <div className="audio-card">
            <div className="audio-icon">
              <IconShieldCheck size={24} color="var(--emerald-neon)" />
            </div>
            <h4>Passive Output Loopback</h4>
            <p>
              Ghost AI reads the digital audio stream being piped to your default headphones or speakers.
              It does not intercept your physical microphone hardware or create virtual soundcards.
            </p>
          </div>

          <div className="audio-card">
            <div className="audio-icon">
              <IconZap size={24} color="#38bdf8" />
            </div>
            <h4>Zero Permission Popups</h4>
            <p>
              Because loopback audio is captured natively via Windows Core Audio APIs, browsers and third-party proctors
              never receive requests or notifications for secondary microphone permissions.
            </p>
          </div>

          <div className="audio-card">
            <div className="audio-icon">
              <IconLayers size={24} color="#a855f7" />
            </div>
            <h4>Automatic Echo Suppression</h4>
            <p>
              When you speak back to the interviewer, Ghost AI isolates incoming interviewer audio from your speech,
              ensuring only the interviewer's technical questions are sent to the AI speech model.
            </p>
          </div>
        </AudioGrid>
      </AudioSetupSection>

      {/* 4. Master Hotkeys & Command Reference */}
      <HotkeysSection>
        <div className="section-head">
          <div className="category-pill">
            <IconKeyboard size={13} color="var(--emerald-neon)" />
            <span>GLOBAL SHORTCUT REFERENCE</span>
          </div>
          <h2>Master Hotkey Command Palette</h2>
          <p>Control the entire Ghost AI suite discreetly without ever moving your mouse outside the coding assessment.</p>
        </div>

        <HotkeysTableWrapper>
          <HotkeysTable>
            <thead>
              <tr>
                <th>Shortcut Keys</th>
                <th>Action Triggered</th>
                <th>Operational Behavior</th>
              </tr>
            </thead>
            <tbody>
              {masterHotkeys.map((hk, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="keys-combo">
                      {hk.keys.map((k, kIdx) => (
                        <kbd key={kIdx}>{k}</kbd>
                      ))}
                    </div>
                  </td>
                  <td><strong>{hk.action}</strong></td>
                  <td>{hk.desc}</td>
                </tr>
              ))}
            </tbody>
          </HotkeysTable>
        </HotkeysTableWrapper>
      </HotkeysSection>

      {/* 5. Documentation FAQ */}
      <FaqSection>
        <div className="section-head">
          <div className="category-pill">
            <IconShieldCheck size={13} color="#a855f7" />
            <span>TECHNICAL TROUBLESHOOTING</span>
          </div>
          <h2>Frequently Asked Technical Questions</h2>
          <p>Common troubleshooting scenarios and recommended operational configurations.</p>
        </div>

        <div className="faq-accordion">
          {[
            {
              q: 'How does run_stealth.vbs differ from running python main.py directly?',
              a: 'Running python main.py opens a black Windows terminal console that appears in your taskbar and Alt-Tab window switcher. The run_stealth.vbs script invokes the Windows Script Host to launch the python process completely detached from any command window, keeping the taskbar clean.'
            },
            {
              q: 'Does Ghost AI work properly on high DPI 4K monitors with 125% or 150% Windows scaling?',
              a: 'Yes. Ghost AI includes automatic DPI awareness configuration (SetProcessDpiAwarenessContext) so the floating HUD renders at crystal clear native sharpness on 1080p, 1440p, and 4K displays.'
            },
            {
              q: 'What if the interview platform requires using a corporate VPN or proxy server?',
              a: 'Ghost AI supports custom HTTPS proxy routing. You can set the http_proxy and https_proxy environment variables or specify a custom proxy host in config.json.'
            },
            {
              q: 'How do I test that the overlay is truly invisible before entering my real interview?',
              a: 'Start a practice Zoom or Teams meeting with yourself or a friend. Share your entire screen and launch Ghost AI. Observe that while you see the overlay on your monitor, the screen share video feed shows 100% untouched clean desktop.'
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
            <span className="gateway-tag">COMMENCE STEALTH TESTING</span>
            <h3>Ready to Run a Dry Run Interview?</h3>
            <p>Try our Dual-Screen Invisibility Simulator or test the Anti-Paste Human Typing engine live.</p>
          </div>
          <div className="gateway-actions">
            <a href="#simulator" className="btn-gateway primary">
              <span>Run Invisibility Simulator</span>
              <IconArrowRight size={14} />
            </a>
            <a href="#playground" className="btn-gateway secondary">
              <span>Try AI Playground</span>
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

const SpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 2rem;

  .spec-card {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    border-radius: 12px;
    padding: 1rem 1.2rem;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    .spec-title {
      font-size: 0.72rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-muted);
    }

    .spec-val {
      font-size: 0.88rem;
      font-weight: 700;

      &.highlight { color: #38bdf8; }
      &.green { color: var(--emerald-neon); }
    }
  }

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const PipelineSection = styled.section`
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
      color: var(--emerald-neon);
      margin-bottom: 0.8rem;
    }

    h2 {
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      font-weight: 800;
      color: var(--text-headline);
    }
  }

  .steps-container {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 1.5rem;

    @media (max-width: 860px) {
      grid-template-columns: 1fr;
    }

    .steps-nav {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;

      .step-nav-btn {
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
        }

        &.active {
          border-color: var(--emerald-neon);
          background: rgba(82, 183, 136, 0.1);

          .step-badge {
            background: var(--emerald-neon);
            color: #06100c;
          }

          .step-text {
            color: var(--text-headline);
            font-weight: 700;
          }
        }

        .step-badge {
          width: 28px;
          height: 28px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-muted);
          font-family: monospace;
          font-size: 0.78rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .step-text {
          font-size: 0.85rem;
          color: var(--text-muted);
        }
      }
    }

    .step-details-card {
      background: var(--bg-card);
      border: 1px solid var(--border-glass);
      border-radius: 16px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .card-top {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;

        .step-indicator {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: var(--emerald-neon);
        }

        h3 {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--text-headline);
          margin: 0;
        }

        .desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          line-height: 1.5;
          margin: 0;
        }
      }

      .code-block-wrapper {
        background: #090c12;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 10px;
        overflow: hidden;

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.6rem 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);

          .code-label {
            font-size: 0.75rem;
            color: var(--text-muted);
            font-family: monospace;
          }

          .btn-copy-code {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            font-size: 0.72rem;
            font-weight: 700;
            padding: 0.25rem 0.6rem;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid var(--border-glass);
            color: var(--text-headline);
            cursor: pointer;
            transition: all 0.2s ease;

            &:hover {
              background: var(--emerald-neon);
              color: #06100c;
            }
          }
        }

        .code-snippet {
          margin: 0;
          padding: 1.2rem;
          font-family: monospace;
          font-size: 0.85rem;
          line-height: 1.6;
          color: #38bdf8;
          overflow-x: auto;
        }
      }
    }
  }
`;

const AudioSetupSection = styled.section`
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

const AudioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }

  .audio-card {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    border-radius: 16px;
    padding: 1.8rem;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;

    .audio-icon {
      width: 46px;
      height: 46px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    h4 {
      font-size: 1.1rem;
      font-weight: 800;
      color: var(--text-headline);
    }

    p {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.6;
      margin: 0;
    }
  }
`;

const HotkeysSection = styled.section`
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
      color: var(--emerald-neon);
      margin-bottom: 0.8rem;
    }

    h2 {
      font-size: clamp(1.8rem, 3vw, 2.4rem);
      font-weight: 800;
      color: var(--text-headline);
    }
  }
`;

const HotkeysTableWrapper = styled.div`
  overflow-x: auto;
  border: 1px solid var(--border-glass);
  border-radius: 16px;
  background: var(--bg-card);
`;

const HotkeysTable = styled.table`
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

    .keys-combo {
      display: flex;
      align-items: center;
      gap: 0.3rem;

      kbd {
        padding: 0.2rem 0.55rem;
        border-radius: 4px;
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-family: monospace;
        font-size: 0.75rem;
        font-weight: 700;
        color: var(--text-headline);
        box-shadow: 0 2px 0 rgba(0, 0, 0, 0.5);
      }
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
