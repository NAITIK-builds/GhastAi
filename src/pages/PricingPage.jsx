import React, { useState } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';
import {
  IconZap,
  IconCheck,
  IconShieldCheck,
  IconArrowRight,
  IconChevronDown,
  IconCpu,
  IconLayers
} from '../components/Icons';

export default function PricingPage({ onOpenRecharge, onOpenAuth, activeUser, onTriggerToast, theme }) {
  const [minutesCount, setMinutesCount] = useState(60);
  const [openFaq, setOpenFaq] = useState(0);
  const RATE_PER_MINUTE = 2.5;

  const calculatedRupees = (minutesCount * RATE_PER_MINUTE).toFixed(0);

  const tiers = [
    {
      name: 'Quick Screen',
      minutes: 30,
      price: 75,
      popular: false,
      desc: 'Ideal for an initial technical screening or 30-minute phone screen.',
      features: ['30 Live Overlay Minutes', 'Anti-Paste Human Typing', 'Full DSA & Code Completion', 'Balance never expires']
    },
    {
      name: 'Full Interview Pro',
      minutes: 60,
      price: 150,
      popular: true,
      desc: 'Our most popular tier. Enough for a comprehensive 60-minute coding interview.',
      features: ['60 Live Overlay Minutes', 'Anti-Paste Human Typing', 'WASAPI Voice Loopback', 'Emergency Panic Killswitch', 'Priority Admin Approval']
    },
    {
      name: 'Super Onsite Pack',
      minutes: 150,
      price: 375,
      popular: false,
      desc: 'Designed for multi-round onsite marathons with 2-3 back-to-back technical rounds.',
      features: ['150 Live Overlay Minutes', 'Multi-day Split Support', 'System Design & DSA', 'Unlimited Solution Queries', 'Dedicated Admin Support']
    }
  ];

  const handleSelectTier = (tier) => {
    playTechBeep('click');
    if (!activeUser) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (onOpenRecharge) onOpenRecharge();
  };

  return (
    <PageWrapper>
      {/* 1. Hero & Value Proposition */}
      <HeroSection>
        <div className="telemetry-badge">
          <IconZap size={14} color="var(--emerald-neon)" />
          <span>TRANSPARENT PAY-PER-MINUTE BILLING</span>
        </div>

        <h1 className="hero-title">
          Strictly <span className="gradient-text">₹2.50 Per Minute</span>. No Monthly Traps.
        </h1>
        <p className="hero-subtitle">
          Never pay $80 to $120 per month for American interview tools when you only have an interview once or twice a month.
          Ghost AI only charges for active overlay usage, and your minutes never expire.
        </p>

        <PricingStatsGrid>
          <div className="stat-card">
            <span className="stat-num green">₹2.50</span>
            <span className="stat-label">Cost per minute active</span>
          </div>
          <div className="stat-card">
            <span className="stat-num blue">₹0.00</span>
            <span className="stat-label">Monthly subscription fee</span>
          </div>
          <div className="stat-card">
            <span className="stat-num green">Never</span>
            <span className="stat-label">Unused minutes expiry</span>
          </div>
          <div className="stat-card">
            <span className="stat-num highlight">10 Mins</span>
            <span className="stat-label">Free welcome credit on signup</span>
          </div>
        </PricingStatsGrid>
      </HeroSection>

      {/* 2. Interactive Calculator */}
      <CalculatorSection>
        <div className="calc-card">
          <div className="calc-head">
            <div className="badge-pill">
              <IconZap size={13} color="var(--emerald-neon)" />
              <span>CUSTOM BUDGET CALCULATOR</span>
            </div>
            <h3>Estimate Your Exact Interview Cost</h3>
            <p>Slide to specify your planned interview duration. See the total cost and savings in real time.</p>
          </div>

          <div className="calc-controls">
            <div className="calc-readouts">
              <div className="readout-item">
                <span className="label">Planned Duration:</span>
                <span className="val-large">{minutesCount} Minutes</span>
              </div>
              <div className="readout-item price">
                <span className="label">Total Wallet Cost:</span>
                <span className="val-large green">₹{calculatedRupees}</span>
              </div>
            </div>

            <div className="slider-box">
              <input
                type="range"
                min="15"
                max="240"
                step="5"
                value={minutesCount}
                onChange={(e) => setMinutesCount(Number(e.target.value))}
              />
              <div className="slider-ticks">
                <span>15 mins (₹37.5)</span>
                <span>45 mins (₹112.5)</span>
                <span>60 mins (₹150)</span>
                <span>120 mins (₹300)</span>
                <span>240 mins (₹600)</span>
              </div>
            </div>

            <div className="savings-comparison-banner">
              <div className="compare-item">
                <span className="compare-title">Ghost AI Wallet Cost:</span>
                <span className="compare-val green">₹{calculatedRupees}</span>
              </div>
              <div className="vs-divider">VS</div>
              <div className="compare-item">
                <span className="compare-title">Standard US Subscriptions:</span>
                <span className="compare-val strike">₹6,800/mo ($80)</span>
              </div>
              <div className="savings-pill">
                You save ~97% by paying only for actual interview minutes!
              </div>
            </div>
          </div>
        </div>
      </CalculatorSection>

      {/* 3. Recharge Tiers Matrix */}
      <TiersSection>
        <div className="section-head">
          <div className="category-pill">
            <IconShieldCheck size={13} color="#38bdf8" />
            <span>POPULAR WALLET PACKAGES</span>
          </div>
          <h2>Select a Package or Enter Any Custom Amount</h2>
          <p>Request recharge instantly. Your account is credited upon Admin verification.</p>
        </div>

        <TiersGrid>
          {tiers.map((tier, idx) => (
            <div key={idx} className={`tier-card ${tier.popular ? 'popular' : ''}`}>
              {tier.popular && <div className="popular-badge">RECOMMENDED FOR CODING ROUNDS</div>}
              <h3 className="tier-name">{tier.name}</h3>
              <p className="tier-desc">{tier.desc}</p>

              <div className="tier-price-row">
                <span className="currency">₹</span>
                <span className="amount">{tier.price}</span>
                <span className="time-granted">/ {tier.minutes} mins</span>
              </div>

              <ul className="features-list">
                {tier.features.map((feat, fIdx) => (
                  <li key={fIdx}>
                    <IconCheck size={14} color="var(--emerald-neon)" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <button className={`btn-tier ${tier.popular ? 'primary' : 'secondary'}`} onClick={() => handleSelectTier(tier)}>
                <span>{activeUser ? `Request ₹${tier.price} Recharge` : 'Sign In to Recharge'}</span>
                <IconArrowRight size={14} />
              </button>
            </div>
          ))}
        </TiersGrid>
      </TiersSection>

      {/* 4. Comparative Breakdown Table */}
      <ComparisonSection>
        <div className="section-head">
          <div className="category-pill">
            <IconLayers size={13} color="var(--emerald-neon)" />
            <span>VALUE COMPARISON</span>
          </div>
          <h2>Ghost AI vs High-Priced Alternatives</h2>
        </div>

        <div className="table-responsive">
          <ComparisonTable>
            <thead>
              <tr>
                <th>Criteria</th>
                <th className="highlight-col">Ghost AI Assistant</th>
                <th>FinalRound AI / Copilot</th>
                <th>Interviewing.io Mock</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Pricing Structure</strong></td>
                <td className="pass highlight-col"><IconCheck size={13} /> ₹2.50 / minute on-demand</td>
                <td className="fail">$80 - $140 / monthly auto-renewal</td>
                <td className="fail">$150 - $250 / single mock</td>
              </tr>
              <tr>
                <td><strong>Cost for 1 Full Interview</strong></td>
                <td className="pass highlight-col"><IconCheck size={13} /> ₹150 (approx $1.80)</td>
                <td className="fail">$80 minimum upfront</td>
                <td className="fail">$200+ minimum upfront</td>
              </tr>
              <tr>
                <td><strong>Hardware DWM Screen Invisibility</strong></td>
                <td className="pass highlight-col"><IconCheck size={13} /> Yes (Zero mirror buffer trace)</td>
                <td className="fail">No (Browser tab or visible window)</td>
                <td className="warn">N/A (Human mock interviewer)</td>
              </tr>
              <tr>
                <td><strong>Anti-Paste Human Keystroke Engine</strong></td>
                <td className="pass highlight-col"><IconCheck size={13} /> Included (Zero clipboard paste hook)</td>
                <td className="fail">Requires manual copy-paste</td>
                <td className="warn">Manual typing</td>
              </tr>
              <tr>
                <td><strong>Unspent Balance Expiration</strong></td>
                <td className="pass highlight-col"><IconCheck size={13} /> Never expires</td>
                <td className="fail">Forfeited at end of billing cycle</td>
                <td className="fail">Expires after 30-60 days</td>
              </tr>
            </tbody>
          </ComparisonTable>
        </div>
      </ComparisonSection>

      {/* 5. Pricing FAQ */}
      <FaqSection>
        <div className="section-head">
          <div className="category-pill">
            <IconCpu size={13} color="#a855f7" />
            <span>TRANSPARENCY GUARANTEE</span>
          </div>
          <h2>Frequently Asked Billing Questions</h2>
          <p>Everything you need to know about our wallet, admin approvals, and recharge rules.</p>
        </div>

        <div className="faq-accordion">
          {[
            {
              q: 'What happens if my interview ends earlier than expected?',
              a: 'You only spend the minutes during which the Ghost AI overlay is actively running. If you booked 60 minutes but your interview concludes in 35 minutes, the remaining 25 minutes (worth ₹62.50) stay in your wallet permanently for your next interview.'
            },
            {
              q: 'How does the Admin recharge approval workflow function?',
              a: 'When you submit a recharge request from the website or desktop app, it appears in our live Admin Portal. The admin verifies the payment transaction and authorizes the exact minutes to your account balance with one click.'
            },
            {
              q: 'Will Ghost AI abruptly close or shut down mid-sentence if my minutes reach zero?',
              a: 'No. When your balance reaches zero, Ghost AI finishes displaying your current active response and transitions to a discreet "Recharge Required" prompt. It never crashes or disrupts your running code editor.'
            },
            {
              q: 'Can I split my minutes across different days and different interview companies?',
              a: 'Absolutely. Your wallet balance is stored securely with your registered email and is completely decoupled from individual sessions. Use 20 minutes on Monday for Google and 40 minutes on Thursday for Amazon.'
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
            <span className="gateway-tag">ZERO RISK GUARANTEE</span>
            <h3>Start with 10 Free Minutes on Us</h3>
            <p>Create an account to test the stealth overlay and verify complete screen share invisibility.</p>
          </div>
          <div className="gateway-actions">
            <button className="btn-gateway primary" onClick={onOpenAuth}>
              <span>Create Account (10 Free Mins)</span>
              <IconArrowRight size={14} />
            </button>
            <a href="#simulator" className="btn-gateway secondary">
              <span>Test Simulator First</span>
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

const PricingStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 2rem;

  .stat-card {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    border-radius: 12px;
    padding: 1rem 1.2rem;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.3rem;

    .stat-num {
      font-size: 1.6rem;
      font-weight: 800;
      line-height: 1.1;

      &.green { color: var(--emerald-neon); }
      &.blue { color: #38bdf8; }
      &.highlight { color: #a855f7; }
    }

    .stat-label {
      font-size: 0.75rem;
      color: var(--text-muted);
      line-height: 1.4;
    }
  }

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const CalculatorSection = styled.section`
  margin-bottom: 4.5rem;

  .calc-card {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    border-radius: 20px;
    padding: 2.5rem;

    @media (max-width: 768px) {
      padding: 1.5rem;
    }

    .calc-head {
      text-align: center;
      max-width: 650px;
      margin: 0 auto 2rem;

      .badge-pill {
        display: inline-flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.06em;
        color: var(--emerald-neon);
        margin-bottom: 0.6rem;
      }

      h3 {
        font-size: 1.8rem;
        font-weight: 800;
        color: var(--text-headline);
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 0.9rem;
        color: var(--text-muted);
      }
    }

    .calc-controls {
      max-width: 820px;
      margin: 0 auto;

      .calc-readouts {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;

        .readout-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;

          .label {
            font-size: 0.78rem;
            color: var(--text-muted);
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }

          .val-large {
            font-size: 2rem;
            font-weight: 800;
            color: var(--text-headline);

            &.green {
              color: var(--emerald-neon);
            }
          }
        }
      }

      .slider-box {
        margin-bottom: 2rem;

        input[type='range'] {
          width: 100%;
          accent-color: var(--emerald-neon);
          height: 6px;
        }

        .slider-ticks {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }
      }

      .savings-comparison-banner {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid var(--border-glass);
        border-radius: 12px;
        padding: 1.2rem 1.6rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;

        .compare-item {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;

          .compare-title {
            font-size: 0.72rem;
            color: var(--text-muted);
            font-weight: 600;
          }

          .compare-val {
            font-size: 1.2rem;
            font-weight: 800;

            &.green { color: var(--emerald-neon); }
            &.strike {
              color: #f87171;
              text-decoration: line-through;
            }
          }
        }

        .vs-divider {
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--text-muted);
        }

        .savings-pill {
          background: rgba(82, 183, 136, 0.15);
          border: 1px solid var(--emerald-neon);
          color: var(--emerald-neon);
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
        }
      }
    }
  }
`;

const TiersSection = styled.section`
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

const TiersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }

  .tier-card {
    background: var(--bg-card);
    border: 1px solid var(--border-glass);
    border-radius: 16px;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    position: relative;
    transition: all 0.2s ease;

    &:hover {
      transform: translateY(-4px);
    }

    &.popular {
      border-color: var(--emerald-neon);
      box-shadow: 0 12px 36px rgba(82, 183, 136, 0.15);
    }

    .popular-badge {
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--emerald-neon);
      color: #06100c;
      font-size: 0.65rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      padding: 0.25rem 0.8rem;
      border-radius: 9999px;
      white-space: nowrap;
    }

    .tier-name {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--text-headline);
      margin-bottom: 0.4rem;
    }

    .tier-desc {
      font-size: 0.82rem;
      color: var(--text-muted);
      line-height: 1.5;
      min-height: 48px;
      margin-bottom: 1.2rem;
    }

    .tier-price-row {
      display: flex;
      align-items: baseline;
      gap: 0.2rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.2rem;
      border-bottom: 1px solid var(--border-glass);

      .currency {
        font-size: 1.4rem;
        font-weight: 700;
        color: var(--emerald-neon);
      }

      .amount {
        font-size: 2.5rem;
        font-weight: 800;
        color: var(--text-headline);
        line-height: 1;
      }

      .time-granted {
        font-size: 0.85rem;
        color: var(--text-muted);
        font-weight: 600;
        margin-left: 0.3rem;
      }
    }

    .features-list {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      flex: 1;

      li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
        color: var(--text-body);
      }
    }

    .btn-tier {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.85rem 1.4rem;
      border-radius: 10px;
      font-size: 0.88rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
      border: 1px solid transparent;

      &.primary {
        background: var(--emerald-neon);
        color: #06100c;
        box-shadow: 0 4px 16px rgba(82, 183, 136, 0.3);

        &:hover {
          box-shadow: 0 6px 22px rgba(82, 183, 136, 0.5);
          transform: translateY(-2px);
        }
      }

      &.secondary {
        background: rgba(255, 255, 255, 0.06);
        border-color: var(--border-glass);
        color: var(--text-headline);

        &:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
`;

const ComparisonSection = styled.section`
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

  .table-responsive {
    overflow-x: auto;
    border: 1px solid var(--border-glass);
    border-radius: 14px;
    background: var(--bg-card);
  }
`;

const ComparisonTable = styled.table`
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

    &.highlight-col {
      color: var(--emerald-neon);
      background: rgba(82, 183, 136, 0.08);
      border-left: 1px solid rgba(82, 183, 136, 0.2);
      border-right: 1px solid rgba(82, 183, 136, 0.2);
    }
  }

  td {
    color: var(--text-body);

    &.fail { color: #f87171; }
    &.warn { color: #fbbf24; }
    &.pass {
      color: var(--emerald-neon);
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    &.highlight-col {
      background: rgba(82, 183, 136, 0.04);
      border-left: 1px solid rgba(82, 183, 136, 0.2);
      border-right: 1px solid rgba(82, 183, 136, 0.2);
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
        cursor: pointer;
        border: none;
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
