import React, { useState } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';
import { IconShieldCheck, IconZap, IconCheck } from './Icons';

export default function ArchitectureDeepDive({ theme, onOpenAuth, onOpenRecharge, activeUser }) {
  const [calcAmount, setCalcAmount] = useState(150); // Default ₹150 = 60 mins
  const RATE_PER_MINUTE = 2.5;

  const calculatedMinutes = Math.floor(calcAmount / RATE_PER_MINUTE);
  const calculatedHours = (calculatedMinutes / 60).toFixed(1);

  const PRESETS = [
    { label: '₹50', amount: 50, mins: 20 },
    { label: '₹100', amount: 100, mins: 40 },
    { label: '₹150', amount: 150, mins: 60, popular: true },
    { label: '₹250', amount: 250, mins: 100 },
    { label: '₹500', amount: 500, mins: 200 }
  ];

  return (
    <PricingWrapper id="pricing">
      <div className="minimal-container">
        {/* Minimal Section Header */}
        <div className="pricing-head">
          <div className="minimal-tag">
            <IconZap size={13} color="var(--emerald-neon)" />
            <span>PAY-AS-YOU-GO RUNTIME MODEL</span>
          </div>
          <h2 className="minimal-headline">
            Transparent ₹2.5 / Minute Pricing
          </h2>
          <p className="minimal-sub">
            No recurring monthly commitments or hidden lock-ins. You only pay for the exact interview or test runtime you use.
          </p>
        </div>

        {/* Minimalist 3-Step Horizontal Timeline */}
        <div className="steps-horizontal-strip">
          <div className="step-col">
            <span className="step-idx">01</span>
            <div className="step-name">Register &amp; Get 10m Free</div>
            <p className="step-txt">Sign up on web or app. 10 trial minutes (₹25 value) are instantly credited.</p>
          </div>
          <div className="step-col">
            <span className="step-idx">02</span>
            <div className="step-name">Top Up Your Wallet (₹2.5/m)</div>
            <p className="step-txt">Choose your interview runtime (e.g. ₹150 for 60m). Admin approves instantly.</p>
          </div>
          <div className="step-col">
            <span className="step-idx">03</span>
            <div className="step-name">Run With Full Invisibility</div>
            <p className="step-txt">The assistant deducts 1m/minute while active and pauses safely when time ends.</p>
          </div>
        </div>

        {/* Pricing Calculator Console Slate */}
        <div className="minimal-slate pricing-console-slate">
          <div className="console-split">
            {/* Left: Giant Rate & Presets */}
            <div className="console-left">
              <span className="rate-badge">PAY-AS-YOU-GO RATE</span>
              <div className="giant-rate-display">
                <span className="rate-currency">₹</span>
                <span className="rate-value">2.50</span>
                <span className="rate-unit">/ min</span>
              </div>
              <div className="rate-hourly-note">Equivalent to ₹150 per full hour of runtime</div>

              <div className="preset-buttons-row">
                {PRESETS.map((p) => (
                  <button
                    key={p.amount}
                    className={`btn-preset ${calcAmount === p.amount ? 'active' : ''}`}
                    onClick={() => {
                      playTechBeep('click');
                      setCalcAmount(p.amount);
                    }}
                  >
                    <span>{p.label}</span>
                    <span className="preset-mins">{p.mins}m</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Interactive Linear Slider & Total */}
            <div className="console-right">
              <div className="slider-box">
                <div className="slider-header-labels">
                  <span className="slider-lbl">Select Budget:</span>
                  <span className="slider-val">₹{calcAmount}</span>
                </div>

                <input
                  type="range"
                  min="25"
                  max="1000"
                  step="25"
                  value={calcAmount}
                  onChange={(e) => setCalcAmount(Number(e.target.value))}
                  className="runtime-slider"
                />

                <div className="slider-extremes">
                  <span>₹25 (10m)</span>
                  <span>₹500 (200m)</span>
                  <span>₹1000 (400m)</span>
                </div>
              </div>

              {/* Calculated Runtime Readout */}
              <div className="calculated-output-strip">
                <div className="runtime-metric">
                  <span className="metric-num">{calculatedMinutes}</span>
                  <span className="metric-lbl">Minutes Runtime ({calculatedHours} hrs)</span>
                </div>

                <button
                  className="btn-minimal-primary btn-recharge-action"
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
                  <span>{activeUser ? `Recharge ₹${calcAmount} (${calculatedMinutes}m)` : 'Get 10m Free Trial'}</span>
                </button>
              </div>

              {/* Truth In Billing Proofs */}
              <div className="billing-truth-list">
                <div className="truth-item">
                  <IconCheck size={13} color="var(--emerald-neon)" />
                  <span>10-minute free trial upon registration</span>
                </div>
                <div className="truth-item">
                  <IconCheck size={13} color="var(--emerald-neon)" />
                  <span>Zero subscription fees &bull; Wallet never expires</span>
                </div>
                <div className="truth-item">
                  <IconCheck size={13} color="var(--emerald-neon)" />
                  <span>Deductions occur only while assistant is running</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PricingWrapper>
  );
}

const PricingWrapper = styled.section`
  padding: 100px 0;
  border-top: 1px solid var(--border-subtle);

  .pricing-head {
    margin-bottom: 2.5rem;
  }

  .steps-horizontal-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2.5rem;
    padding-bottom: 3rem;
    margin-bottom: 3rem;
    border-bottom: 1px solid var(--border-subtle);

    @media (max-width: 860px) {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  .step-col {
    display: flex;
    flex-direction: column;
  }

  .step-idx {
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 700;
    color: var(--emerald-neon);
    margin-bottom: 8px;
  }

  .step-name {
    font-family: var(--font-display);
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--text-headline);
    margin-bottom: 6px;
  }

  .step-txt {
    font-size: 13px;
    color: var(--text-muted);
    line-height: 1.55;
    margin: 0;
  }

  /* Pricing Console Slate */
  .pricing-console-slate {
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
    padding: 2.5rem;
  }

  .console-split {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 3rem;
    align-items: center;

    @media (max-width: 960px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  .rate-badge {
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--text-muted);
    letter-spacing: 0.08em;
    display: block;
    margin-bottom: 8px;
  }

  .giant-rate-display {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 8px;
  }

  .rate-currency {
    font-family: var(--font-display);
    font-size: 2rem;
    font-weight: 700;
    color: var(--emerald-neon);
  }

  .rate-value {
    font-family: var(--font-display);
    font-size: 4.5rem;
    font-weight: 900;
    color: var(--text-headline);
    line-height: 1;
    letter-spacing: -0.04em;
  }

  .rate-unit {
    font-size: 1.25rem;
    color: var(--text-muted);
    font-weight: 500;
  }

  .rate-hourly-note {
    font-size: 13px;
    color: var(--text-muted);
    margin-bottom: 1.75rem;
  }

  .preset-buttons-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .btn-preset {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid var(--border-subtle);
    padding: 8px 12px;
    border-radius: 8px;
    color: var(--text-headline);
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;

    .preset-mins {
      font-size: 11px;
      font-family: var(--font-mono);
      color: var(--text-muted);
      margin-top: 2px;
    }

    &:hover {
      border-color: var(--border-glass);
    }

    &.active {
      background: rgba(45, 212, 191, 0.1);
      border-color: var(--emerald-neon);

      .preset-mins {
        color: var(--emerald-neon);
      }
    }
  }

  /* Right Side Controls */
  .slider-box {
    margin-bottom: 1.75rem;
  }

  .slider-header-labels {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    font-size: 14px;
  }

  .slider-lbl {
    color: var(--text-muted);
  }

  .slider-val {
    font-family: var(--font-mono);
    font-size: 1.2rem;
    font-weight: 800;
    color: var(--emerald-neon);
  }

  .runtime-slider {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 9999px;
    outline: none;
    -webkit-appearance: none;
    cursor: pointer;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: var(--emerald-neon);
      box-shadow: 0 0 10px var(--emerald-neon);
      cursor: pointer;
    }
  }

  .slider-extremes {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 8px;
  }

  .calculated-output-strip {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid var(--border-subtle);
    border-radius: 8px;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .runtime-metric {
    display: flex;
    flex-direction: column;
  }

  .metric-num {
    font-family: var(--font-display);
    font-size: 2.2rem;
    font-weight: 900;
    color: var(--emerald-neon);
    line-height: 1;
  }

  .metric-lbl {
    font-size: 12px;
    color: var(--text-muted);
    margin-top: 4px;
  }

  .btn-recharge-action {
    padding: 12px 24px;
    font-size: 14px;
  }

  .billing-truth-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .truth-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: var(--text-muted);
  }
`;
