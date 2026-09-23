import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { api } from '../services/api';

export default function AdminDashboard({
  activeUser,
  onTriggerToast,
  onNavigate
}) {
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [amountToAdd, setAmountToAdd] = useState(150);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'history'

  const fetchUsers = async () => {
    try {
      const data = await api.getUsers();
      if (Array.isArray(data)) {
        setUsers(data);
      }
    } catch (err) {
      // Quiet on offline
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await api.getHistory();
      if (Array.isArray(data)) {
        setHistory(data);
      }
    } catch (err) {
      // Quiet on offline
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchHistory();
    // Auto refresh every 5 seconds to observe active sessions and time changes
    const interval = setInterval(() => {
      fetchUsers();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAddTime = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      onTriggerToast('Please select a user first', 'alert');
      return;
    }

    const rupees = Number(amountToAdd);
    if (isNaN(rupees) || rupees <= 0) {
      onTriggerToast('Please enter a valid positive amount in ₹', 'alert');
      return;
    }

    const mins = Math.floor(rupees / 2.5);
    setIsSubmitting(true);
    try {
      const result = await api.addTime({
        userId: selectedUser.id,
        amountRupees: rupees,
        addedBy: activeUser?.email || 'admin@ghostai.internal'
      });

      if (result.success) {
        onTriggerToast(`Added ₹${rupees} (+${mins} mins) to ${selectedUser.email}! Desktop software will sync automatically.`, 'check');
        setSelectedUser(null);
        setAmountToAdd(150);
        fetchUsers();
        fetchHistory();
      }
    } catch (err) {
      onTriggerToast(err.message || 'Error while adding time', 'alert');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      u.email.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.id.toLowerCase().includes(q)
    );
  });

  return (
    <AdminWrapper>
      {/* Header Bar */}
      <div className="admin-header">
        <div>
          <div className="admin-badge">Admin Access Control</div>
          <h1 className="admin-title">Software Licensing & Time Manager</h1>
          <p className="admin-subtitle">
            Assign usage time directly to candidate accounts. Software instances automatically sync time balances in real time.
          </p>
        </div>

        <div className="header-actions">
          <button className="btn-secondary" onClick={() => onNavigate('dashboard')}>
            User Dashboard View
          </button>
          <button className="btn-refresh" onClick={fetchUsers}>
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-bar">
        <button
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          All Users ({users.length})
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          License History ({history.length})
        </button>
      </div>

      {activeTab === 'users' && (
        <>
          {/* Search bar & quick stats */}
          <div className="controls-row">
            <div className="search-input-wrap">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button className="clear-btn" onClick={() => setSearchTerm('')}>✕</button>
              )}
            </div>

            <div className="stat-pill">
              <span className="dot online" />
              <span>{users.filter((u) => u.active_session).length} Active Desktop Sessions</span>
            </div>
          </div>

          {/* User List Table */}
          <div className="table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User / Email</th>
                  <th>Role</th>
                  <th>Remaining Time</th>
                  <th>Status</th>
                  <th>Desktop Session</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="empty-row">
                      No users found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isZero = (u.remaining_seconds || 0) <= 0;
                    return (
                      <tr key={u.id} className={selectedUser?.id === u.id ? 'row-selected' : ''}>
                        <td>
                          <div className="user-name-cell">
                            <strong>{u.name}</strong>
                            <span className="email-sub">{u.email}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`role-tag ${u.role === 'admin' ? 'tag-admin' : 'tag-user'}`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <span className={`time-badge ${isZero ? 'badge-zero' : 'badge-active'}`}>
                            {u.formatted_time || '00:00:00'}
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill ${isZero ? 'pill-expired' : 'pill-active'}`}>
                            <span className="dot" />
                            {isZero ? 'Expired' : 'Active'}
                          </span>
                        </td>
                        <td>
                          {u.active_session ? (
                            <span className="session-active-tag">
                              <span className="dot-pulse" />
                              Active ({u.active_session.instance_id.slice(-8)})
                            </span>
                          ) : (
                            <span className="session-idle-tag">Idle</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn-add-time"
                            onClick={() => setSelectedUser(u)}
                            id={`add-time-btn-${u.id}`}
                          >
                            + Add Time
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'history' && (
        <div className="table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>User Email</th>
                <th>Minutes Added</th>
                <th>Authorized By</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-row">
                    No license grant records found.
                  </td>
                </tr>
              ) : (
                history.map((h) => (
                  <tr key={h.id}>
                    <td>
                      <span className="timestamp-text">
                        {new Date(h.created_at).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <strong>{h.user_email}</strong>
                    </td>
                    <td>
                      <span className="time-granted-pill">+{h.minutes_added} Minutes</span>
                    </td>
                    <td>
                      <span className="admin-email-tag">{h.added_by}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Time Modal (Requirement #12) */}
      {selectedUser && (
        <div className="modal-backdrop" onClick={() => setSelectedUser(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Time to User Account</h3>
              <button className="close-btn" onClick={() => setSelectedUser(null)}>✕</button>
            </div>

            <form onSubmit={handleAddTime}>
              <div className="form-group">
                <label>User Account</label>
                <div className="user-preview-card">
                  <div>
                    <strong>{selectedUser.name}</strong>
                    <div className="preview-email">{selectedUser.email}</div>
                  </div>
                  <div className="preview-balance">
                    Current: <span>{selectedUser.formatted_time}</span>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Amount to Add (₹)</label>
                <div className="quick-presets">
                  {[50, 150, 300, 500, 1000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      className={`preset-chip ${amountToAdd === preset ? 'active' : ''}`}
                      onClick={() => setAmountToAdd(preset)}
                    >
                      +₹{preset} ({Math.floor(preset / 2.5)}m)
                    </button>
                  ))}
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <span style={{ position: 'absolute', left: '12px', color: '#10b981', fontWeight: 800, fontSize: '16px' }}>₹</span>
                  <input
                    type="number"
                    min="5"
                    step="10"
                    value={amountToAdd}
                    onChange={(e) => setAmountToAdd(e.target.value)}
                    className="input-minutes"
                    style={{ paddingLeft: '28px' }}
                    id="input-amount-to-add"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Calculation Preview */}
              <div className="calc-preview">
                <div className="calc-row">
                  <span>Current Balance:</span>
                  <span>{selectedUser.formatted_time} (₹{(((selectedUser.remaining_seconds || 0) / 60) * 2.5).toFixed(2)})</span>
                </div>
                <div className="calc-row">
                  <span>Adding:</span>
                  <span className="calc-add">+₹{amountToAdd || 0} (+{Math.floor((Number(amountToAdd) || 0) / 2.5)} Minutes)</span>
                </div>
                <div className="calc-divider" />
                <div className="calc-row calc-total">
                  <strong>New Projected Balance:</strong>
                  <strong>
                    {Math.floor(((selectedUser.remaining_seconds || 0) + Math.floor((Number(amountToAdd) || 0) / 2.5) * 60) / 3600)}h{' '}
                    {Math.floor((((selectedUser.remaining_seconds || 0) + Math.floor((Number(amountToAdd) || 0) / 2.5) * 60) % 3600) / 60)}m{' '}
                    (₹{((((selectedUser.remaining_seconds || 0) + Math.floor((Number(amountToAdd) || 0) / 2.5) * 60) / 60) * 2.5).toFixed(2)})
                  </strong>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setSelectedUser(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-submit-time"
                  disabled={isSubmitting}
                  id="confirm-add-time-btn"
                >
                  {isSubmitting ? 'Updating...' : `Add ₹${amountToAdd} (+${Math.floor((Number(amountToAdd) || 0) / 2.5)}m)`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminWrapper>
  );
}

const AdminWrapper = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 20px 80px;

  .admin-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 28px;
    flex-wrap: wrap;

    .admin-badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 800;
      color: #a855f7;
      background: rgba(168, 85, 247, 0.15);
      border: 1px solid rgba(168, 85, 247, 0.35);
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 8px;
      letter-spacing: 0.05em;
    }

    .admin-title {
      font-size: 26px;
      font-weight: 800;
      color: var(--text-bright, #f8fafc);
      margin-bottom: 6px;
    }

    .admin-subtitle {
      font-size: 14px;
      color: var(--text-muted, #94a3b8);
      max-width: 600px;
      line-height: 1.5;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .btn-secondary {
      padding: 9px 16px;
      border-radius: 8px;
      background: var(--surface2, #151c2e);
      border: 1px solid var(--border2, #2d3c58);
      color: var(--text-bright, #f8fafc);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: var(--surface3, #1c263c);
      }
    }

    .btn-refresh {
      padding: 9px 14px;
      border-radius: 8px;
      background: transparent;
      border: 1px solid var(--border, #1e293d);
      color: var(--text-muted, #94a3b8);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        color: var(--text-bright, #f8fafc);
        border-color: var(--border2, #2d3c58);
      }
    }
  }

  /* Tabs */
  .tabs-bar {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
    border-bottom: 1px solid var(--border, #1e293d);
    padding-bottom: 12px;

    .tab-btn {
      padding: 8px 16px;
      border-radius: 8px;
      background: transparent;
      border: none;
      color: var(--text-muted, #94a3b8);
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        color: var(--text-bright, #f8fafc);
      }

      &.active {
        background: var(--surface2, #151c2e);
        color: #10b981;
        border: 1px solid var(--border2, #2d3c58);
      }
    }
  }

  .controls-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 18px;
    flex-wrap: wrap;

    .search-input-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--surface, #0e1422);
      border: 1px solid var(--border, #1e293d);
      border-radius: 8px;
      padding: 8px 14px;
      min-width: 280px;

      input {
        background: transparent;
        border: none;
        outline: none;
        color: var(--text-bright, #f8fafc);
        font-size: 13px;
        width: 100%;

        &::placeholder {
          color: var(--text-muted, #64748b);
        }
      }

      .clear-btn {
        background: transparent;
        border: none;
        color: var(--text-muted, #64748b);
        cursor: pointer;
        font-size: 12px;
      }
    }

    .stat-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: var(--text-muted, #94a3b8);
      background: var(--surface, #0e1422);
      border: 1px solid var(--border, #1e293d);
      padding: 6px 14px;
      border-radius: 9999px;

      .dot {
        width: 7px;
        height: 7px;
        border-radius: 50%;
        background: #10b981;
        box-shadow: 0 0 6px #10b981;
      }
    }
  }

  /* Table */
  .table-card {
    background: var(--surface, #0e1422);
    border: 1px solid var(--border, #1e293d);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }

  .admin-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    th {
      text-align: left;
      padding: 14px 18px;
      background: var(--surface2, #151c2e);
      color: var(--text-muted, #94a3b8);
      font-weight: 700;
      text-transform: uppercase;
      font-size: 11px;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border, #1e293d);
    }

    td {
      padding: 14px 18px;
      border-bottom: 1px solid var(--border, #1e293d);
      color: var(--text, #cbd5e1);
      vertical-align: middle;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover {
      background: rgba(255, 255, 255, 0.015);
    }

    .empty-row {
      text-align: center;
      padding: 40px;
      color: var(--text-muted, #64748b);
    }
  }

  .user-name-cell {
    display: flex;
    flex-direction: column;
    gap: 2px;

    strong {
      color: var(--text-bright, #f8fafc);
      font-size: 14px;
    }

    .email-sub {
      color: var(--text-muted, #94a3b8);
      font-size: 12px;
    }
  }

  .role-tag {
    font-size: 10px;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 4px;
    letter-spacing: 0.05em;

    &.tag-admin {
      background: rgba(168, 85, 247, 0.15);
      color: #c084fc;
      border: 1px solid rgba(168, 85, 247, 0.35);
    }

    &.tag-user {
      background: var(--surface2, #151c2e);
      color: var(--text-muted, #94a3b8);
      border: 1px solid var(--border, #1e293d);
    }
  }

  .time-badge {
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;

    &.badge-active {
      background: rgba(16, 185, 129, 0.12);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.3);
    }

    &.badge-zero {
      background: rgba(244, 63, 94, 0.12);
      color: #f43f5e;
      border: 1px solid rgba(244, 63, 94, 0.3);
    }
  }

  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    &.pill-active {
      color: #10b981;
      .dot { background: #10b981; }
    }

    &.pill-expired {
      color: #f43f5e;
      .dot { background: #f43f5e; }
    }
  }

  .session-active-tag {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: #38bdf8;
    background: rgba(56, 189, 248, 0.1);
    border: 1px solid rgba(56, 189, 248, 0.3);
    padding: 2px 8px;
    border-radius: 4px;

    .dot-pulse {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #38bdf8;
      box-shadow: 0 0 6px #38bdf8;
    }
  }

  .session-idle-tag {
    font-size: 12px;
    color: var(--text-muted, #64748b);
  }

  .btn-add-time {
    padding: 6px 14px;
    border-radius: 8px;
    background: #10b981;
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #059669;
    }
  }

  .time-granted-pill {
    font-family: 'JetBrains Mono', monospace;
    color: #10b981;
    font-weight: 700;
    font-size: 13px;
  }

  .timestamp-text {
    color: var(--text-muted, #94a3b8);
    font-size: 12px;
  }

  .admin-email-tag {
    font-size: 12px;
    color: var(--text, #cbd5e1);
  }

  /* Modal */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .modal-box {
    background: var(--surface, #0e1422);
    border: 1px solid var(--border2, #2d3c58);
    border-radius: 16px;
    width: 100%;
    max-width: 480px;
    padding: 24px;
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    h3 {
      font-size: 18px;
      font-weight: 800;
      color: var(--text-bright, #f8fafc);
      margin: 0;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-muted, #64748b);
      font-size: 16px;
      cursor: pointer;

      &:hover {
        color: var(--text-bright, #f8fafc);
      }
    }
  }

  .form-group {
    margin-bottom: 18px;

    label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted, #94a3b8);
      margin-bottom: 8px;
    }
  }

  .user-preview-card {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface2, #151c2e);
    border: 1px solid var(--border, #1e293d);
    border-radius: 10px;
    padding: 12px 16px;

    strong {
      color: var(--text-bright, #f8fafc);
      font-size: 14px;
    }

    .preview-email {
      font-size: 12px;
      color: var(--text-muted, #94a3b8);
    }

    .preview-balance {
      font-size: 12px;
      color: var(--text-muted, #94a3b8);

      span {
        font-family: 'JetBrains Mono', monospace;
        color: #38bdf8;
        font-weight: 700;
        margin-left: 4px;
      }
    }
  }

  .quick-presets {
    display: flex;
    gap: 8px;
    margin-bottom: 10px;
    flex-wrap: wrap;

    .preset-chip {
      padding: 5px 12px;
      border-radius: 6px;
      background: var(--surface2, #151c2e);
      border: 1px solid var(--border, #1e293d);
      color: var(--text, #cbd5e1);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        border-color: #10b981;
      }

      &.active {
        background: rgba(16, 185, 129, 0.15);
        color: #10b981;
        border-color: #10b981;
      }
    }
  }

  .input-minutes {
    width: 100%;
    padding: 10px 14px;
    background: var(--surface2, #151c2e);
    border: 1px solid var(--border, #1e293d);
    border-radius: 8px;
    color: var(--text-bright, #f8fafc);
    font-size: 15px;
    font-weight: 700;
    outline: none;

    &:focus {
      border-color: #10b981;
    }
  }

  .calc-preview {
    background: var(--surface2, #151c2e);
    border: 1px solid var(--border, #1e293d);
    border-radius: 10px;
    padding: 14px;
    margin-bottom: 22px;
    font-size: 13px;

    .calc-row {
      display: flex;
      justify-content: space-between;
      color: var(--text-muted, #94a3b8);
      margin-bottom: 6px;
    }

    .calc-add {
      color: #10b981;
      font-weight: 700;
    }

    .calc-divider {
      height: 1px;
      background: var(--border, #1e293d);
      margin: 8px 0;
    }

    .calc-total {
      margin-bottom: 0;
      color: var(--text-bright, #f8fafc);
      font-size: 14px;
    }
  }

  .modal-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;

    .btn-cancel {
      padding: 10px 18px;
      border-radius: 8px;
      background: transparent;
      border: 1px solid var(--border, #1e293d);
      color: var(--text-muted, #94a3b8);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;

      &:hover {
        color: var(--text-bright, #f8fafc);
      }
    }

    .btn-submit-time {
      padding: 10px 20px;
      border-radius: 8px;
      background: #10b981;
      color: #ffffff;
      font-size: 13px;
      font-weight: 700;
      border: none;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #059669;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
`;
