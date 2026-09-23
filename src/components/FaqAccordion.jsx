import React, { useState } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';
import { IconChevronDown } from './Icons';

const FAQS = [
  {
    q: 'How does the ₹2.5 / minute Pay-As-You-Go pricing work?',
    a: 'You only pay for the exact runtime you need during an interview or test. For example, ₹50 gives you 20 minutes, and ₹150 gives you a full 60-minute session. The app runs strictly for the duration approved by your Admin. Once your time runs out, the assistant safely pauses and prompts you to recharge.'
  },
  {
    q: 'Will Ghost AI be visible if I share my entire screen on Zoom, Teams, or Google Meet?',
    a: 'No. Ghost AI uses hardware-level screen-share exclusion. Even if you share your entire desktop screen in Zoom, Microsoft Teams, Discord, Google Meet, or OBS, viewers see only your IDE and browser windows. Ghost AI remains 100% invisible in the video feed.'
  },
  {
    q: 'Does clicking Ghost AI trigger tab-switching or focus-loss warnings in browser exams?',
    a: 'No. Ghost AI is designed with Safe Focus Lock. Clicking, dragging, or snipping questions over Ghost AI never steals focus from your active browser tab, preventing any tab-switch or window blur warnings on HackerRank, CodeSignal, or TestGorilla.'
  },
  {
    q: 'How do I register and activate my account?',
    a: 'Simply click "Sign In / Register" in the top navbar and enter your details. Your registration instantly reflects on the Admin panel with 10 free welcome minutes. Once authorized or recharged, your runtime minutes become active immediately.'
  },
  {
    q: 'How does the Anti-Paste Human Typing feature work?',
    a: 'If an exam portal blocks copy-pasting, the Auto-Type shortcut automatically types solutions with natural, human-like keystroke delays (20ms to 75ms). It looks completely natural and bypasses anti-paste blockers effortlessly.'
  },
  {
    q: 'Can I run Ghost AI without any visible terminal window?',
    a: 'Yes. The software includes run_stealth.vbs, which launches Ghost AI completely in the background without any command prompt or terminal window appearing on your Windows taskbar.'
  }
];

export default function FaqAccordion({ theme }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (idx) => {
    playTechBeep('click');
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <FaqWrapper id="faq">
      <div className="minimal-container">
        {/* Minimal Section Header */}
        <div className="faq-head">
          <div className="minimal-tag">
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="minimal-headline">
            Everything You Need to Know
          </h2>
          <p className="minimal-sub">
            Direct answers about platform compatibility, runtime billing, and interview stealth.
          </p>
        </div>

        {/* Minimalist Borderless FAQ List */}
        <div className="faq-list">
          {FAQS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div className={`faq-row ${isOpen ? 'active' : ''}`} key={idx}>
                <button
                  className="faq-question-btn"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                >
                  <span className="faq-q-text">{item.q}</span>
                  <span className={`faq-chevron ${isOpen ? 'open' : ''}`}>
                    <IconChevronDown size={18} />
                  </span>
                </button>

                {isOpen && (
                  <div className="faq-answer-panel">
                    <p className="faq-a-text">{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </FaqWrapper>
  );
}

const FaqWrapper = styled.section`
  padding: 100px 0;
  border-top: 1px solid var(--border-subtle);

  .faq-head {
    margin-bottom: 3rem;
  }

  .faq-list {
    display: flex;
    flex-direction: column;
    border-top: 1px solid var(--border-subtle);
  }

  .faq-row {
    border-bottom: 1px solid var(--border-subtle);
    transition: all 0.15s ease;

    &.active {
      border-color: var(--border-glass);
    }
  }

  .faq-question-btn {
    width: 100%;
    padding: 1.5rem 0.5rem;
    background: transparent;
    border: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    text-align: left;
    gap: 1rem;
    color: var(--text-headline);
    transition: color 0.15s ease;

    &:hover {
      color: var(--emerald-neon);
    }
  }

  .faq-q-text {
    font-family: var(--font-display);
    font-size: 1.1rem;
    font-weight: 700;
    line-height: 1.35;
  }

  .faq-chevron {
    color: var(--text-muted);
    transition: transform 0.2s ease, color 0.2s ease;
    flex-shrink: 0;

    &.open {
      transform: rotate(180deg);
      color: var(--emerald-neon);
    }
  }

  .faq-answer-panel {
    padding: 0 0.5rem 1.5rem 0.5rem;
  }

  .faq-a-text {
    font-size: 14px;
    line-height: 1.65;
    color: var(--text-muted);
    margin: 0;
    max-width: 800px;
  }
`;
