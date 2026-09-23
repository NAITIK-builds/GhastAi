import React, { useState } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';
import { IconZap, IconCheck, IconShieldCheck } from './Icons';

export default function RechargeModal({ isOpen, onClose, activeUser, onRequestRecharge, onTriggerToast }) {
  const [amount, setAmount] = useState(150); // Default ₹150 = 60 mins
  const RATE_PER_MINUTE = 2.5;

  if (!isOpen) return null;

  const minutesGranted = Math.floor(amount / RATE_PER_MINUTE);

  const handleSubmit = (e) => {
    e.preventDefault();
    playTechBeep('click');

    if (amount <= 0) {
      if (onTriggerToast) onTriggerToast('Please enter a valid amount', 'alert');
      return;
    }

    onRequestRecharge({
      userId: activeUser?.id,
      userName: activeUser?.name,
      amountRupees: Number(amount),
      minutesGranted
    });

    if (onTriggerToast) {
      onTriggerToast(`Recharge request of ₹${amount} (${minutesGranted} mins) sent to Admin!`, 'zap');
    }
    onClose();
  };

  const presetAmounts = [50, 100, 150, 250, 500];

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="header-brand">
            <span className="coin-icon">₹</span>
            <div>
              <h3>Recharge Ghost AI Time</h3>
              <p className="sub-user">User: {activeUser?.name || 'Guest'} &bull; Rate: ₹2.5 / min</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>

        {/* Live Calculation Callout */}
        <div className="calc-callout">
          <div className="calc-amount">₹{amount}</div>
          <div className="calc-arrow">➔</div>
          <div className="calc-mins">
            <span className="mins-num">{minutesGranted}</span>
            <span className="mins-label">Minutes Runtime</span>
          </div>
        </div>

        {/* Preset Amount Chips */}
        <div className="presets-row">
          {presetAmounts.map((p) => (
            <button
              key={p}
              type="button"
              className={`preset-btn ${Number(amount) === p ? 'active' : ''}`}
              onClick={() => {
                playTechBeep('click');
                setAmount(p);
              }}
            >
              ₹{p} <span className="preset-mins">({Math.floor(p / RATE_PER_MINUTE)}m)</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="recharge-form">
          <div className="form-group">
            <label>Enter Custom Amount (₹ Rupees)</label>
            <div className="input-with-currency">
              <span className="curr-sym">₹</span>
              <input
                type="number"
                min="10"
                step="5"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="guarantee-box">
            <IconShieldCheck size={14} color="var(--emerald-neon)" />
            <span>Admin approves request instantly &bull; The app runs only for the allotted time.</span>
          </div>

          <button type="submit" className="btn-submit">
            <span>Request Admin Recharge (₹{amount} for {minutesGranted} mins)</span>
          </button>
        </form>
      </ModalCard>
    </ModalBackdrop>
  );
}

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.75);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 460px;
  background: var(--bg-surface);
  border: 1px solid var(--border-glass);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6);

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.25rem;
  }

  .header-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;

    h3 {
      font-size: 1.15rem;
      font-weight: 800;
      color: var(--text-headline);
      margin: 0;
    }

    .sub-user {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--emerald-neon);
      margin: 0.2rem 0 0;
    }
  }

  .coin-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fbbf24 0%, #d97706 100%);
    color: #030712;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 900;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
  }

  .btn-close {
    background: transparent;
    border: none;
    font-size: 1.6rem;
    color: var(--text-muted);
    cursor: pointer;

    &:hover {
      color: var(--text-headline);
    }
  }

  .calc-callout {
    display: flex;
    align-items: center;
    justify-content: space-around;
    padding: 1rem 1.2rem;
    background: rgba(82, 183, 136, 0.1);
    border: 1px solid var(--border-glass);
    border-radius: 14px;
    margin-bottom: 1.25rem;
  }

  .calc-amount {
    font-family: var(--font-mono);
    font-size: 1.8rem;
    font-weight: 900;
    color: #fbbf24;
  }

  .calc-arrow {
    font-size: 1.2rem;
    color: var(--text-muted);
  }

  .calc-mins {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .mins-num {
    font-family: var(--font-mono);
    font-size: 1.8rem;
    font-weight: 900;
    color: var(--emerald-neon);
    line-height: 1;
  }

  .mins-label {
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.2rem;
  }

  .presets-row {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1.25rem;
  }

  .preset-btn {
    flex: 1;
    min-width: 70px;
    padding: 0.45rem 0.6rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid var(--border-subtle);
    color: var(--text-headline);
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      border-color: var(--emerald-neon);
    }

    &.active {
      background: var(--emerald-neon);
      color: #030712;
      border-color: var(--emerald-neon);

      .preset-mins {
        color: #06241a;
      }
    }
  }

  .preset-mins {
    font-size: 0.68rem;
    color: var(--text-muted);
  }

  .recharge-form {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;

    label {
      font-size: 0.82rem;
      font-weight: 700;
      color: var(--text-headline);
    }
  }

  .input-with-currency {
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid var(--border-subtle);
    border-radius: 10px;
    padding: 0 1rem;

    .curr-sym {
      font-family: var(--font-mono);
      font-weight: 800;
      font-size: 1.1rem;
      color: #fbbf24;
      margin-right: 0.5rem;
    }

    input {
      flex: 1;
      padding: 0.75rem 0;
      background: transparent;
      border: none;
      color: var(--text-headline);
      font-family: var(--font-mono);
      font-size: 1.1rem;
      font-weight: 700;
      outline: none;
    }
  }

  .guarantee-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.76rem;
    color: var(--text-muted);
    line-height: 1.4;
  }

  .btn-submit {
    padding: 0.85rem;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--emerald-neon) 0%, #92c9b1 100%);
    border: none;
    color: #030712;
    font-weight: 800;
    font-size: 0.95rem;
    cursor: pointer;
    box-shadow: 0 4px 15px var(--emerald-glow);
    transition: transform 0.15s ease;

    &:hover {
      transform: translateY(-1px);
    }
  }
`;
