import React from 'react';
import styled from 'styled-components';

export default function Footer({ onNavigate }) {
  return (
    <FooterWrapper>
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-brand">
            <span className="dot" />
            <span>GHOST<span className="accent">AI</span></span>
          </div>
          <span className="footer-desc">
            Desktop AI Assistant Licensing &amp; Authentication Portal
          </span>
        </div>

        <div className="footer-right">
          <button className="footer-link" onClick={() => onNavigate('home')}>
            Home
          </button>
          <button
            className="footer-link"
            onClick={() => {
              onNavigate('home');
              setTimeout(() => {
                document.getElementById('download-section')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          >
            Download
          </button>
          <span className="footer-copy">
            &copy; {new Date().getFullYear()} Ghost AI. All rights reserved.
          </span>
        </div>
      </div>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.footer`
  border-top: 1px solid var(--border, #1e293d);
  background: var(--surface, #0e1422);
  padding: 24px 20px;
  color: var(--text-muted, #94a3b8);
  font-size: 13px;

  .footer-container {
    max-width: 1040px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
  }

  .footer-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .footer-brand {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 800;
    color: var(--text-bright, #f8fafc);
    font-size: 14px;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
    }

    .accent {
      color: #10b981;
    }
  }

  .footer-desc {
    color: var(--text-muted, #64748b);
    font-size: 12px;
  }

  .footer-right {
    display: flex;
    align-items: center;
    gap: 18px;
    flex-wrap: wrap;
  }

  .footer-link {
    background: transparent;
    border: none;
    color: var(--text-muted, #94a3b8);
    font-size: 13px;
    cursor: pointer;
    padding: 0;

    &:hover {
      color: var(--text-bright, #f8fafc);
    }
  }

  .footer-copy {
    color: var(--text-muted, #64748b);
    font-size: 12px;
  }
`;
