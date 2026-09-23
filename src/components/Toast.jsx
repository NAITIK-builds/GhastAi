import React from 'react';
import styled from 'styled-components';
import {
  IconCheck,
  IconZap,
  IconShieldCheck,
  IconCopy,
  IconPanic,
  IconSparkles,
  IconTerminal,
  IconKeyboard
} from './Icons';

// Strict mapping: Any icon key or legacy emoji symbol maps directly to a high-contrast SVG
function renderToastIcon(iconKey) {
  if (React.isValidElement(iconKey)) return iconKey;

  switch (iconKey) {
    case 'check':
    case 'success':
    case '✅':
      return <IconCheck size={14} color="var(--emerald-neon)" />;
    case 'zap':
    case 'rate':
    case '⚡':
    case '⏱️':
    case '🟢':
      return <IconZap size={14} color="var(--emerald-neon)" />;
    case 'shield':
    case 'security':
    case '🛡️':
      return <IconShieldCheck size={14} color="var(--emerald-neon)" />;
    case 'copy':
    case 'clipboard':
    case '📋':
      return <IconCopy size={14} color="#38bdf8" />;
    case 'alert':
    case 'warning':
    case '⚠️':
    case '🔴':
      return <IconPanic size={14} color="#f59e0b" />;
    case 'panic':
    case 'emergency':
    case '🚨':
      return <IconPanic size={14} color="#ef4444" />;
    case 'keyboard':
    case 'type':
    case 'typing':
    case '⌨️':
      return <IconKeyboard size={14} color="#a855f7" />;
    case 'terminal':
    case 'code':
    case '$':
      return <IconTerminal size={14} color="#38bdf8" />;
    case 'welcome':
    case 'bonus':
    case '🎉':
    case '👋':
    case 'info':
    case '🔔':
    case '📡':
      return <IconSparkles size={14} color="var(--emerald-neon)" />;
    default:
      return <IconShieldCheck size={14} color="var(--emerald-neon)" />;
  }
}

// Helper to sanitize any stray emoji characters from the message text
function sanitizeToastText(text) {
  if (typeof text !== 'string') return text;
  return text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FAFF}]/gu, '').replace(/\s{2,}/g, ' ').trim();
}

export default function Toast({ toasts }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <ToastContainer>
      {toasts.map((t) => (
        <ToastItem key={t.id}>
          <span className="toast-icon-wrapper">{renderToastIcon(t.icon)}</span>
          <span className="toast-msg">{sanitizeToastText(t.message)}</span>
        </ToastItem>
      ))}
    </ToastContainer>
  );
}

const ToastContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  pointer-events: none;
`;

const ToastItem = styled.div`
  padding: 0.55rem 1.05rem;
  background: rgba(9, 13, 20, 0.92);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45), 0 0 1px rgba(255, 255, 255, 0.2);
  color: #f1f5f9;
  font-size: 0.82rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.55rem;
  animation: toastIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  pointer-events: auto;

  .toast-icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .toast-msg {
    letter-spacing: -0.01em;
  }

  [data-theme="light"] & {
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.04);
    color: #0f172a;
  }

  @keyframes toastIn {
    from {
      transform: translateY(12px) scale(0.96);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
`;
