import React, { useState } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';
import { IconTerminal, IconCopy, IconCheck } from './Icons';

const STEPS = [
  {
    idx: '01',
    title: 'Clone & Virtual Environment',
    desc: 'Set up an isolated Python 3.10+ environment on your Windows machine.',
    cmd: `git clone https://github.com/naitik/ghost-ai-assistant.git\ncd ghost-ai-assistant\npython -m venv venv\n.\\venv\\Scripts\\activate\npip install -r requirements.txt`
  },
  {
    idx: '02',
    title: 'Configure Free Gemini API Key',
    desc: 'Get your free API key from Google AI Studio and configure it via GUI or environment.',
    cmd: `set GEMINI_API_KEY=AIzaSy...your_key\n# Or press Alt+K inside the app to save directly in encrypted config`
  },
  {
    idx: '03',
    title: 'Launch Ghost AI Assistant',
    desc: 'Launch directly with the fast batch runner or silent background launcher.',
    cmd: `.\\run_ghost_ai.bat\n# Or launch completely in the background without any console window:\nwscript.exe run_stealth.vbs`
  }
];

export default function QuickstartGuide({ onTriggerToast, theme }) {
  const [activeStep, setActiveStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const step = STEPS[activeStep];

  const handleCopy = () => {
    playTechBeep('click');
    navigator.clipboard.writeText(step.cmd);
    setCopied(true);
    if (onTriggerToast) onTriggerToast('Terminal command copied!', 'copy');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <QuickWrapper id="quickstart">
      <div className="minimal-container">
        {/* Minimal Section Header */}
        <div className="quick-head">
          <div className="minimal-tag">
            <IconTerminal size={13} color="var(--emerald-neon)" />
            <span>DEVELOPER QUICKSTART &bull; 60 SECONDS</span>
          </div>
          <h2 className="minimal-headline">
            Install &amp; Run in Three Steps
          </h2>
          <p className="minimal-sub">
            Built purely in Python and PyQt6 for Windows. Zero kernel drivers or invasive system hooks required.
          </p>
        </div>

        {/* Minimal Steps Tabs */}
        <div className="steps-tabs-strip">
          {STEPS.map((s, i) => (
            <button
              key={s.idx}
              className={`step-tab-pill ${activeStep === i ? 'active' : ''}`}
              onClick={() => {
                playTechBeep('click');
                setActiveStep(i);
              }}
            >
              <span className="tab-idx">{s.idx}</span>
              <span className="tab-title">{s.title}</span>
            </button>
          ))}
        </div>

        {/* Minimal Terminal Slate */}
        <div className="terminal-slate minimal-slate">
          <div className="terminal-header">
            <div className="term-left">
              <span className="term-dot red" />
              <span className="term-dot yellow" />
              <span className="term-dot green" />
              <span className="term-title">powershell.exe — {step.title}</span>
            </div>

            <button className="btn-copy-cmd" onClick={handleCopy}>
              {copied ? <IconCheck size={12} color="var(--emerald-neon)" /> : <IconCopy size={12} />}
              <span>{copied ? 'Copied' : 'Copy Commands'}</span>
            </button>
          </div>

          <div className="terminal-content">
            <pre className="term-pre">
              <code>{step.cmd}</code>
            </pre>
          </div>

          <div className="terminal-footer">
            <span className="foot-desc">{step.desc}</span>
            <span className="foot-status">Rate: ₹2.5/min &bull; 10m Free Welcome Trial</span>
          </div>
        </div>
      </div>
    </QuickWrapper>
  );
}

const QuickWrapper = styled.section`
  padding: 100px 0;
  border-top: 1px solid var(--border-subtle);

  .quick-head {
    margin-bottom: 2.5rem;
  }

  .steps-tabs-strip {
    display: flex;
    gap: 10px;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
  }

  .step-tab-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: 1px solid var(--border-subtle);
    color: var(--text-muted);
    font-size: 13px;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.15s ease;

    .tab-idx {
      font-family: var(--font-mono);
      font-size: 11px;
      font-weight: 700;
      color: var(--emerald-neon);
    }

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

  .terminal-slate {
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);
  }

  .terminal-header {
    padding: 10px 16px;
    background: rgba(0, 0, 0, 0.4);
    border-bottom: 1px solid var(--border-subtle);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .term-left {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .term-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;

    &.red { background: #f43f5e; }
    &.yellow { background: #f59e0b; }
    &.green { background: #10b981; }
  }

  .term-title {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    margin-left: 6px;
  }

  .btn-copy-cmd {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-subtle);
    color: var(--text-headline);
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: var(--border-glass);
    }
  }

  .terminal-content {
    padding: 20px;
    background: rgba(0, 0, 0, 0.25);
  }

  .term-pre {
    margin: 0;
    font-family: var(--font-mono);
    font-size: 13px;
    line-height: 1.6;
    color: var(--emerald-neon);
    white-space: pre-wrap;
  }

  .terminal-footer {
    padding: 10px 16px;
    background: rgba(0, 0, 0, 0.35);
    border-top: 1px solid var(--border-subtle);
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: var(--text-muted);
    flex-wrap: wrap;
    gap: 8px;
  }

  .foot-status {
    font-family: var(--font-mono);
    color: var(--emerald-neon);
  }
`;
