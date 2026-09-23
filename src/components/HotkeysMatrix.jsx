import React, { useState } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';
import { IconKeyboard, IconCheck } from './Icons';

const HOTKEYS = [
  {
    keys: ['Alt', 'S'],
    title: 'Question Snip',
    badge: 'AI Vision',
    desc: 'Drag a box over any math question or LeetCode problem. Solves without clicking away from your active exam tab.'
  },
  {
    keys: ['Alt', 'Shift', 'C'],
    title: 'Clean Code Copy',
    badge: 'Ready to Paste',
    desc: 'Copies clean runnable class Solution directly to your clipboard with zero conversational chatter.'
  },
  {
    keys: ['Alt', 'L'],
    title: 'Interview Audio Ear',
    badge: 'Speaker Loopback',
    desc: 'Listens directly to interviewer questions in Zoom or Teams and gives you instant talking points.'
  },
  {
    keys: ['Alt', 'C'],
    title: 'Solve Clipboard',
    badge: 'Instant OCR',
    desc: 'Parses any copied code problem in your clipboard and computes the optimal answer immediately.'
  },
  {
    keys: ['Alt', 'H'],
    title: 'Emergency Panic Hide',
    badge: 'Instant Stealth',
    desc: 'Hides the assistant window on your physical monitor in 0.01 seconds if someone approaches.'
  },
  {
    keys: ['Alt', 'M'],
    title: 'Minimize to Bubble',
    badge: 'Floating Logo',
    desc: 'Collapses the full window into a discreet 36px floating translucent ghost icon.'
  }
];

export default function HotkeysMatrix({ onTriggerToast, theme }) {
  const [activeIdx, setActiveIdx] = useState(0);

  const handleSelect = (idx) => {
    playTechBeep('click');
    setActiveIdx(idx);
    if (onTriggerToast) onTriggerToast(`Shortcut: ${HOTKEYS[idx].keys.join(' + ')} active`, 'zap');
  };

  return (
    <HotkeysWrapper id="hotkeys">
      <div className="minimal-container">
        {/* Minimal Section Header */}
        <div className="hotkeys-head">
          <div className="minimal-tag">
            <IconKeyboard size={13} color="var(--emerald-neon)" />
            <span>GLOBAL HOTKEY ENGINE</span>
          </div>
          <h2 className="minimal-headline">
            Zero-Latency Keyboard Controls
          </h2>
          <p className="minimal-sub">
            Trigger every action via global Windows hotkeys that work across all apps without stealing foreground browser tab focus.
          </p>
        </div>

        {/* Minimalist Horizontal Shortcuts Grid (Clean & Borderless) */}
        <div className="shortcuts-row-matrix">
          {HOTKEYS.map((item, idx) => {
            const isSelected = activeIdx === idx;
            return (
              <div
                key={idx}
                className={`shortcut-strip-item ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelect(idx)}
              >
                <div className="keys-combo-pill">
                  {item.keys.map((k, kIdx) => (
                    <span key={kIdx} className="key-cap">{k}</span>
                  ))}
                </div>

                <div className="item-meta">
                  <div className="item-title">{item.title}</div>
                  <div className="item-badge">{item.badge}</div>
                </div>

                <p className="item-desc">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </HotkeysWrapper>
  );
}

const HotkeysWrapper = styled.section`
  padding: 90px 0;
  border-top: 1px solid var(--border-subtle);

  .hotkeys-head {
    margin-bottom: 3rem;
  }

  .shortcuts-row-matrix {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;

    @media (max-width: 960px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }

  .shortcut-strip-item {
    padding: 1.5rem;
    background: var(--bg-surface);
    border: 1px solid var(--border-subtle);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.15s ease;
    display: flex;
    flex-direction: column;

    &:hover {
      border-color: var(--border-glass);
      transform: translateY(-2px);
    }

    &.active {
      border-color: var(--emerald-neon);
      background: rgba(45, 212, 191, 0.04);
    }
  }

  .keys-combo-pill {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 1rem;
  }

  .key-cap {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    color: var(--text-headline);
    background: rgba(255, 255, 255, 0.06);
    border: 1px solid var(--border-subtle);
    padding: 3px 8px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .item-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .item-title {
    font-family: var(--font-display);
    font-size: 15px;
    font-weight: 700;
    color: var(--text-headline);
  }

  .item-badge {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--emerald-neon);
    background: rgba(45, 212, 191, 0.1);
    padding: 1px 6px;
    border-radius: 4px;
    font-weight: 700;
  }

  .item-desc {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.5;
    margin: 0;
  }
`;
