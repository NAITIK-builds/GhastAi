import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { playTechBeep } from '../utils/sound';

export default function AdminPortal({
  users = [],
  activeUser,
  onUpdateUser,
  onTriggerToast,
  onNavigate,
  onClose
}) {
  const [rechargeInputs, setRechargeInputs] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'expired' | 'session'
  const [sortBy, setSortBy] = useState('name'); // 'name' | 'time' | 'balance'
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'history' | 'sessions'
  const [history, setHistory] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState('Just now');
  
  // Add Candidate Modal
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [newCandidateData, setNewCandidateData] = useState({
    name: '',
    email: '',
    password: '',
    initialRupees: '0'
  });
  const [isCreatingCandidate, setIsCreatingCandidate] = useState(false);

  // Edit Candidate Modal (Full correction in case of wrong value entered)
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    balanceRupees: 0,
    remainingMinutes: 0,
    allowedByAdmin: true,
    role: 'user',
    password: ''
  });
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  const RATE_PER_MINUTE = 2.5;

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/admin/history');
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleManualSync = async () => {
    playTechBeep('click');
    setIsSyncing(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          data.forEach((u) => onUpdateUser(u));
        }
      }
      await fetchHistory();
      const now = new Date();
      setLastSyncedTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      if (onTriggerToast) onTriggerToast('Synchronized with licensing database', 'check');
    } catch (e) {
      if (onTriggerToast) onTriggerToast('Sync failed (offline)', 'alert');
    } finally {
      setTimeout(() => setIsSyncing(false), 350);
    }
  };

  const handleInputChange = (userId, value) => {
    setRechargeInputs((prev) => ({
      ...prev,
      [userId]: value
    }));
  };

  const handleSetPreset = (userId, presetRupees) => {
    playTechBeep('click');
    setRechargeInputs((prev) => ({
      ...prev,
      [userId]: presetRupees
    }));
  };

  const handleApplyRecharge = (user) => {
    playTechBeep('click');
    const enteredRupees = Number(rechargeInputs[user.id]);
    if (!enteredRupees || enteredRupees <= 0) {
      if (onTriggerToast) onTriggerToast('Please enter a valid amount in ₹', 'alert');
      return;
    }

    const additionalMinutes = Math.floor(enteredRupees / RATE_PER_MINUTE);
    const addedSeconds = additionalMinutes * 60;
    const prevSeconds = user.remaining_seconds || (user.minutesRemaining ? user.minutesRemaining * 60 : 0);
    const newSeconds = prevSeconds + addedSeconds;
    const newMinutes = Math.floor(newSeconds / 60);
    const newRupees = Math.round((newSeconds / 60) * RATE_PER_MINUTE * 100) / 100;

    fetch('/api/admin/add-time', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        amountRupees: enteredRupees,
        addedBy: activeUser?.email || 'admin@ghostai.internal'
      })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          onUpdateUser({
            ...user,
            ...data.user,
            remaining_seconds: data.user.remaining_seconds,
            minutesRemaining: Math.floor(data.user.remaining_seconds / 60),
            balanceRupees: data.user.balanceRupees || newRupees,
            allowedByAdmin: true,
            status: 'Active'
          });
        } else {
          onUpdateUser({
            ...user,
            remaining_seconds: newSeconds,
            minutesRemaining: newMinutes,
            balanceRupees: newRupees,
            allowedByAdmin: true,
            status: 'Active'
          });
        }
        fetchHistory();
      })
      .catch(() => {
        onUpdateUser({
          ...user,
          remaining_seconds: newSeconds,
          minutesRemaining: newMinutes,
          balanceRupees: newRupees,
          allowedByAdmin: true,
          status: 'Active'
        });
      });

    setRechargeInputs((prev) => ({ ...prev, [user.id]: '' }));
    if (onTriggerToast) {
      onTriggerToast(`Credited ₹${enteredRupees} (+${additionalMinutes}m) to ${user.name}! Desktop app will sync.`, 'check');
    }
  };

  const handleToggleAccess = async (user) => {
    playTechBeep('click');
    const nextAllowed = !user.allowedByAdmin;
    
    // Optimistic UI update
    onUpdateUser({
      ...user,
      allowedByAdmin: nextAllowed,
      status: nextAllowed ? 'Active' : 'Paused by Admin'
    });

    try {
      await fetch('/api/admin/toggle-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, allowed: nextAllowed })
      });
    } catch (e) {
      console.error('Failed to sync access toggle to backend', e);
    }

    if (onTriggerToast) {
      onTriggerToast(
        nextAllowed ? `Access GRANTED for ${user.name}` : `Access PAUSED for ${user.name}`,
        nextAllowed ? 'zap' : 'alert'
      );
    }
  };

  const handleResetTime = async (user) => {
    if (!window.confirm(`Are you sure you want to reset remaining time for ${user.name} to 00:00:00?`)) {
      return;
    }
    playTechBeep('click');
    try {
      const res = await fetch('/api/admin/reset-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          adminEmail: activeUser?.email || 'admin@ghostai.internal'
        })
      });
      if (res.ok) {
        onUpdateUser({
          ...user,
          remaining_seconds: 0,
          minutesRemaining: 0,
          balanceRupees: 0,
          status: 'Expired'
        });
        fetchHistory();
        if (onTriggerToast) onTriggerToast(`Reset balance to 0 for ${user.name}`, 'alert');
      }
    } catch (e) {
      console.error('Reset time failed', e);
    }
  };

  // Open Edit Modal for any candidate
  const handleOpenEdit = (user) => {
    playTechBeep('click');
    const totalSecs = user.remaining_seconds || (user.minutesRemaining ? user.minutesRemaining * 60 : 0);
    const mins = Math.floor(totalSecs / 60);
    const rupees = user.balanceRupees || Math.round((mins * RATE_PER_MINUTE) * 100) / 100;

    setEditingCandidate(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      balanceRupees: rupees,
      remainingMinutes: mins,
      allowedByAdmin: user.allowedByAdmin !== undefined ? user.allowedByAdmin : totalSecs > 0,
      role: user.role || 'user',
      password: ''
    });
  };

  // Save Edit Changes (Name, Email, Balance, Time, Permissions, Password)
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingCandidate) return;

    setIsSavingEdit(true);
    playTechBeep('click');
    try {
      const res = await fetch('/api/admin/edit-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingCandidate.id,
          name: editFormData.name,
          email: editFormData.email,
          balanceRupees: Number(editFormData.balanceRupees),
          remainingMinutes: Number(editFormData.remainingMinutes),
          allowedByAdmin: editFormData.allowedByAdmin,
          role: editFormData.role,
          password: editFormData.password || undefined,
          adminEmail: activeUser?.email || 'admin@ghostai.internal'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update candidate');
      }

      const updatedUser = {
        ...editingCandidate,
        ...data.user,
        formatted_time: data.user.formatted_time || `${String(Math.floor(data.user.remaining_seconds / 3600)).padStart(2, '0')}:${String(Math.floor((data.user.remaining_seconds % 3600) / 60)).padStart(2, '0')}:${String(data.user.remaining_seconds % 60).padStart(2, '0')}`
      };

      onUpdateUser(updatedUser);
      setEditingCandidate(null);
      fetchHistory();
      if (onTriggerToast) onTriggerToast(`Updated details & balance for ${updatedUser.name}!`, 'check');
    } catch (err) {
      if (onTriggerToast) onTriggerToast(err.message, 'alert');
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Delete candidate account
  const handleDeleteCandidate = async (user) => {
    if (!window.confirm(`Permanently remove candidate account "${user.name}" (${user.email})? This action cannot be undone.`)) {
      return;
    }
    playTechBeep('click');
    try {
      const res = await fetch('/api/admin/delete-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });
      const data = await res.json();
      if (res.ok) {
        setEditingCandidate(null);
        handleManualSync();
        if (onTriggerToast) onTriggerToast(`Candidate ${user.name} removed.`, 'check');
      } else {
        throw new Error(data.error || 'Failed to delete candidate');
      }
    } catch (err) {
      if (onTriggerToast) onTriggerToast(err.message, 'alert');
    }
  };

  // Delete audit history entry
  const handleDeleteHistoryEntry = async (historyId) => {
    playTechBeep('click');
    try {
      const res = await fetch('/api/admin/delete-history-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historyId })
      });
      if (res.ok) {
        setHistory((prev) => prev.filter((h) => h.id !== historyId));
        if (onTriggerToast) onTriggerToast('Audit entry removed', 'check');
      }
    } catch (err) {
      console.error('Failed to delete history entry', err);
    }
  };

  const handleCreateCandidate = async (e) => {
    e.preventDefault();
    if (!newCandidateData.name || !newCandidateData.email || !newCandidateData.password) {
      if (onTriggerToast) onTriggerToast('Please fill in Name, Email and Password', 'alert');
      return;
    }

    setIsCreatingCandidate(true);
    playTechBeep('click');
    try {
      const res = await fetch('/api/admin/create-candidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCandidateData.name,
          email: newCandidateData.email,
          password: newCandidateData.password,
          initialRupees: Number(newCandidateData.initialRupees) || 0,
          addedBy: activeUser?.email || 'admin@ghostai.internal'
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create candidate');
      }

      onUpdateUser(data.candidate);
      setShowAddCandidateModal(false);
      setNewCandidateData({ name: '', email: '', password: '', initialRupees: '0' });
      fetchHistory();
      if (onTriggerToast) onTriggerToast(`Candidate ${data.candidate.name} registered successfully!`, 'check');
    } catch (err) {
      if (onTriggerToast) onTriggerToast(err.message, 'alert');
    } finally {
      setIsCreatingCandidate(false);
    }
  };

  const handleExportCSV = () => {
    playTechBeep('click');
    if (!users.length) return;
    const headers = ['ID', 'Name', 'Email', 'Role', 'Balance (Rupees)', 'Seconds Remaining', 'Minutes', 'Status', 'Allowed'];
    const rows = users.map((u) => [
      u.id,
      `"${u.name}"`,
      `"${u.email}"`,
      u.role || 'user',
      ((u.remaining_seconds || 0) / 60 * RATE_PER_MINUTE).toFixed(2),
      u.remaining_seconds || 0,
      Math.floor((u.remaining_seconds || 0) / 60),
      u.status || 'Active',
      u.allowedByAdmin ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ghost_ai_candidates_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (onTriggerToast) onTriggerToast('Exported candidates to CSV', 'check');
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    playTechBeep('click');
    if (onTriggerToast) onTriggerToast(`Copied ${label} to clipboard`, 'check');
  };

  // Metrics calculations
  const totalUsers = users.length;
  const activeSessionsCount = users.filter((u) => u.active_session).length;
  const totalSeconds = users.reduce((acc, u) => acc + (u.remaining_seconds || (u.minutesRemaining ? u.minutesRemaining * 60 : 0)), 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMins = Math.floor((totalSeconds % 3600) / 60);

  // Active vs Expired counts for filter pills
  const activeCount = users.filter((u) => (u.remaining_seconds || 0) > 0 && u.allowedByAdmin).length;
  const expiredCount = users.filter((u) => (u.remaining_seconds || 0) <= 0 || !u.allowedByAdmin).length;

  // Filtered & Sorted users list
  const filteredUsers = useMemo(() => {
    let list = users.filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.id && u.id.toLowerCase().includes(q));

      if (!matchQuery) return false;

      const remSec = u.remaining_seconds || (u.minutesRemaining ? u.minutesRemaining * 60 : 0);
      if (filterStatus === 'active') return remSec > 0 && u.allowedByAdmin;
      if (filterStatus === 'expired') return remSec <= 0 || !u.allowedByAdmin;
      if (filterStatus === 'session') return Boolean(u.active_session);
      return true;
    });

    return list.sort((a, b) => {
      if (sortBy === 'time') {
        const secA = a.remaining_seconds || 0;
        const secB = b.remaining_seconds || 0;
        return secB - secA;
      }
      if (sortBy === 'balance') {
        const balA = a.balanceRupees || ((a.remaining_seconds || 0) / 60) * RATE_PER_MINUTE;
        const balB = b.balanceRupees || ((b.remaining_seconds || 0) / 60) * RATE_PER_MINUTE;
        return balB - balA;
      }
      return a.name.localeCompare(b.name);
    });
  }, [users, searchQuery, filterStatus, sortBy, RATE_PER_MINUTE]);

  // Deterministic avatar gradient
  const getAvatarGradient = (str = 'U') => {
    const charCode = str.charCodeAt(0) || 65;
    const gradients = [
      'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
      'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
      'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
      'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
      'linear-gradient(135deg, #d97706 0%, #ea580c 100%)'
    ];
    return gradients[charCode % gradients.length];
  };

  return (
    <PortalWrapper>
      <div className="portal-container">
        {/* Top Header Bar */}
        <header className="portal-header">
          <div className="header-text-col">
            <div className="admin-status-chip">
              <span className="live-dot" />
              <span>ADMINISTRATIVE LICENSING CONSOLE</span>
              <span className="rate-subtag">Rate: ₹2.50 / min</span>
            </div>
            <h1 className="header-title">Candidate Licensing &amp; Hardware Telemetry</h1>
            <p className="header-sub">
              Manage candidate accounts, credit runtime balances in Rupees, toggle software access permissions, and monitor active Windows desktop software sessions.
            </p>
          </div>

          <div className="header-actions">
            <button
              className="btn-action-primary"
              onClick={() => setShowAddCandidateModal(true)}
              title="Add a new candidate account"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
              <span>+ New Candidate</span>
            </button>

            <button
              className="btn-action-outline"
              onClick={handleExportCSV}
              title="Export candidate list as CSV"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export CSV</span>
            </button>

            <button
              className={`btn-action-outline ${isSyncing ? 'syncing' : ''}`}
              onClick={handleManualSync}
              title="Synchronize user states with server database"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              <span>{isSyncing ? 'Syncing...' : 'Live Sync'}</span>
            </button>

            {onNavigate && (
              <button
                className="btn-action-ghost"
                onClick={() => onNavigate('dashboard')}
                title="Preview candidate dashboard view"
              >
                User View
              </button>
            )}

            <button className="btn-action-close" onClick={onClose} title="Return to home page">
              Exit
            </button>
          </div>
        </header>

        {/* Executive KPI Metrics Grid */}
        <section className="metrics-grid">
          {/* Metric 1 */}
          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-label">REGISTERED CANDIDATES</span>
              <div className="metric-icon-box blue">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
            <div className="metric-value">{totalUsers}</div>
            <div className="metric-detail">
              <span className="highlight-pill">{activeCount} with runtime</span> in database
            </div>
          </div>

          {/* Metric 2 */}
          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-label">ACTIVE DESKTOP SESSIONS</span>
              <div className="metric-icon-box emerald">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
            </div>
            <div className="metric-value text-emerald">
              <span className="pulse-dot" />
              {activeSessionsCount}
            </div>
            <div className="metric-detail">
              {activeSessionsCount > 0 ? (
                <span className="text-emerald font-semibold">Live Windows instances syncing</span>
              ) : (
                'No desktop instances active right now'
              )}
            </div>
          </div>

          {/* Metric 3 */}
          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-label">TOTAL ALLOCATED TIME POOL</span>
              <div className="metric-icon-box gold">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
            </div>
            <div className="metric-value text-cyan">
              {totalHours}h {totalMins}m
            </div>
            <div className="metric-detail">Across all candidate wallets</div>
          </div>

          {/* Metric 4 */}
          <div className="metric-card">
            <div className="metric-top">
              <span className="metric-label">LICENSING RATE</span>
              <div className="metric-icon-box purple">
                <span className="rupee-icon-sym">₹</span>
              </div>
            </div>
            <div className="metric-value text-gold">₹2.50 <span className="value-sub">/ min</span></div>
            <div className="metric-detail">
              <span className="rate-formula">₹150 = 60 mins (1 hr)</span> &bull; Admin Managed
            </div>
          </div>
        </section>

        {/* Navigation Tabs Bar */}
        <div className="tabs-strip">
          <div className="tabs-left">
            <button
              className={`tab-link ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Candidate Accounts <span className="tab-badge">{users.length}</span>
            </button>
            <button
              className={`tab-link ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              Credit Audit Ledger <span className="tab-badge">{history.length}</span>
            </button>
            <button
              className={`tab-link ${activeTab === 'sessions' ? 'active' : ''}`}
              onClick={() => setActiveTab('sessions')}
            >
              Hardware Sessions <span className="tab-badge">{activeSessionsCount}</span>
            </button>
          </div>

          <div className="tabs-right-meta">
            <span className="last-sync-tag">Last Synced: {lastSyncedTime}</span>
            <span className="server-truth-badge">⚡ Source of Truth: Server API</span>
          </div>
        </div>

        {/* Tab 1: Candidates Management Table */}
        {activeTab === 'users' && (
          <div className="table-wrapper-card">
            {/* Search and Filters Bar */}
            <div className="filter-toolbar">
              <div className="search-box">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search candidate by name, email, or candidate ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="clear-search" onClick={() => setSearchQuery('')} title="Clear search">✕</button>
                )}
              </div>

              <div className="filter-chips">
                <button
                  className={`chip ${filterStatus === 'all' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('all')}
                >
                  All ({users.length})
                </button>
                <button
                  className={`chip ${filterStatus === 'active' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('active')}
                >
                  Active ({activeCount})
                </button>
                <button
                  className={`chip ${filterStatus === 'expired' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('expired')}
                >
                  Expired / 0m ({expiredCount})
                </button>
                <button
                  className={`chip ${filterStatus === 'session' ? 'active' : ''}`}
                  onClick={() => setFilterStatus('session')}
                >
                  In Desktop ({activeSessionsCount})
                </button>
              </div>

              <div className="sort-box">
                <span className="sort-label">Sort by:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                  <option value="name">Name (A-Z)</option>
                  <option value="time">Time Remaining (High-Low)</option>
                  <option value="balance">Wallet Balance (High-Low)</option>
                </select>
              </div>
            </div>

            {/* Candidates Table */}
            <div className="table-responsive">
              <table className="portal-table">
                <thead>
                  <tr>
                    <th style={{ minWidth: '220px' }}>CANDIDATE</th>
                    <th style={{ minWidth: '130px' }}>WALLET (₹)</th>
                    <th style={{ minWidth: '160px' }}>TIME REMAINING</th>
                    <th style={{ minWidth: '110px' }}>APP STATUS</th>
                    <th style={{ minWidth: '150px' }}>DESKTOP SESSION</th>
                    <th style={{ minWidth: '280px' }}>CREDIT TIME (₹)</th>
                    <th style={{ minWidth: '110px' }}>ACCESS</th>
                    <th style={{ minWidth: '110px', textAlign: 'right' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="empty-state-cell">
                        <div className="empty-state-box">
                          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                          </svg>
                          <h4>No candidate accounts found</h4>
                          <p>Try adjusting your search query or filter tags.</p>
                          {searchQuery && (
                            <button className="btn-empty-reset" onClick={() => setSearchQuery('')}>
                              Clear search query
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const totalSecs = user.remaining_seconds || (user.minutesRemaining ? user.minutesRemaining * 60 : 0);
                      const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
                      const mns = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
                      const scs = String(totalSecs % 60).padStart(2, '0');
                      const formattedHMS = `${hrs}:${mns}:${scs}`;
                      const isExpired = totalSecs <= 0;
                      const isAllowed = user.allowedByAdmin && !isExpired;
                      const currentInput = rechargeInputs[user.id] || '';
                      const previewMins = currentInput > 0 ? Math.floor(Number(currentInput) / RATE_PER_MINUTE) : 0;
                      const totalMinsCalc = Math.floor(totalSecs / 60);

                      return (
                        <tr key={user.id} className={!user.allowedByAdmin ? 'row-paused' : ''}>
                          {/* Candidate Identity */}
                          <td>
                            <div className="candidate-cell" onClick={() => handleOpenEdit(user)} style={{ cursor: 'pointer' }}>
                              <div
                                className="candidate-avatar"
                                style={{ background: getAvatarGradient(user.name) }}
                              >
                                {(user.name || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div className="candidate-info">
                                <div className="candidate-name">
                                  <span>{user.name}</span>
                                  {user.role === 'admin' && <span className="admin-chip">ADMIN</span>}
                                </div>
                                <div className="candidate-email-row">
                                  <span className="candidate-email" title={user.email}>{user.email}</span>
                                  <button
                                    className="btn-copy-mini"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      copyToClipboard(user.email, 'email');
                                    }}
                                    title="Copy email"
                                  >
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Wallet Balance in Rupees (Clickable to edit directly) */}
                          <td>
                            <div
                              className="balance-cell-box clickable"
                              onClick={() => handleOpenEdit(user)}
                              title="Click to edit balance directly"
                            >
                              <span className="currency-symbol">₹</span>
                              <span className="balance-number">
                                {((totalSecs / 60) * RATE_PER_MINUTE).toLocaleString('en-IN', {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </span>
                              <span className="pencil-hover-icon">✎</span>
                            </div>
                          </td>

                          {/* Time Remaining in HH:MM:SS (Clickable to edit directly) */}
                          <td>
                            <div
                              className="time-badge-col clickable"
                              onClick={() => handleOpenEdit(user)}
                              title="Click to edit remaining time"
                            >
                              <span className={`time-code ${isExpired ? 'expired' : 'active'}`}>
                                {formattedHMS}
                              </span>
                              <div className="time-sub-row">
                                <span className="time-sub-mins">{totalMinsCalc} mins</span>
                                <div className="runtime-meter">
                                  <div
                                    className={`meter-bar ${isExpired ? 'bar-expired' : 'bar-active'}`}
                                    style={{
                                      width: `${Math.min(100, Math.max(isExpired ? 0 : 15, (totalSecs / 7200) * 100))}%`
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* App Access Status */}
                          <td>
                            <span className={`status-pill ${isAllowed ? 'pill-active' : isExpired ? 'pill-expired' : 'pill-paused'}`}>
                              <span className="dot" />
                              {isAllowed ? 'Active' : isExpired ? 'Expired' : 'Paused'}
                            </span>
                          </td>

                          {/* Desktop Session State */}
                          <td>
                            {user.active_session ? (
                              <div className="desktop-session-pill connected">
                                <span className="pulse-beacon" />
                                <div className="session-texts">
                                  <span className="session-status-text">Connected</span>
                                  <span className="session-id-text">
                                    ID: {user.active_session.instance_id.slice(-6)}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="desktop-session-pill idle">
                                <span className="idle-dot" />
                                <span className="idle-text">Offline / Idle</span>
                              </div>
                            )}
                          </td>

                          {/* Enter Amount in Rupees */}
                          <td>
                            <div className="recharge-cell">
                              <div className="recharge-input-bar">
                                <span className="currency-prefix">₹</span>
                                <input
                                  type="number"
                                  min="5"
                                  step="10"
                                  placeholder="Amount (₹)"
                                  className="recharge-num-input"
                                  value={currentInput}
                                  onChange={(e) => handleInputChange(user.id, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleApplyRecharge(user);
                                  }}
                                />
                                {previewMins > 0 && (
                                  <span className="preview-inline-tag">
                                    +{previewMins}m
                                  </span>
                                )}
                                <button
                                  className="btn-credit-rupees"
                                  onClick={() => handleApplyRecharge(user)}
                                  title={`Credit ₹${currentInput || '0'} to candidate`}
                                >
                                  + Add ₹
                                </button>
                              </div>

                              {/* Quick Presets */}
                              <div className="preset-row">
                                {[
                                  { amt: 50, label: '₹50' },
                                  { amt: 150, label: '₹150 (1h)' },
                                  { amt: 300, label: '₹300 (2h)' },
                                  { amt: 500, label: '₹500' }
                                ].map((p) => (
                                  <button
                                    key={p.amt}
                                    type="button"
                                    className={`preset-btn ${Number(currentInput) === p.amt ? 'active' : ''}`}
                                    onClick={() => handleSetPreset(user.id, p.amt)}
                                  >
                                    {p.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </td>

                          {/* Access Control Switch */}
                          <td>
                            <button
                              className={`btn-access-toggle ${user.allowedByAdmin ? 'allowed' : 'paused'}`}
                              onClick={() => handleToggleAccess(user)}
                              title={user.allowedByAdmin ? 'Click to pause software access' : 'Click to grant software access'}
                            >
                              <span className="toggle-indicator" />
                              <span>{user.allowedByAdmin ? 'Allowed' : 'Paused'}</span>
                            </button>
                          </td>

                          {/* Actions Column (Edit everything, Reset, Delete) */}
                          <td style={{ textAlign: 'right' }}>
                            <div className="actions-col">
                              {/* Edit Everything Button */}
                              <button
                                className="btn-icon-action edit"
                                onClick={() => handleOpenEdit(user)}
                                title="Edit candidate details, balance, or correct wrong value"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                              </button>

                              {/* Reset Time Button */}
                              <button
                                className="btn-icon-action danger"
                                onClick={() => handleResetTime(user)}
                                title="Reset balance to 0 (Revoke time)"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="1 4 1 10 7 10" />
                                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                                </svg>
                              </button>

                              {/* Delete Candidate Button */}
                              <button
                                className="btn-icon-action trash"
                                onClick={() => handleDeleteCandidate(user)}
                                title="Delete candidate account"
                              >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="3 6 5 6 21 6" />
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Credit Audit Ledger */}
        {activeTab === 'history' && (
          <div className="table-wrapper-card">
            <div className="card-header-bar">
              <div>
                <h3 className="card-title">Administrator Credit &amp; Licensing Ledger</h3>
                <p className="card-subtitle">Real-time audit log of all rupee grants, corrections, and minute updates issued by administrators.</p>
              </div>
              <span className="badge-counter">{history.length} Transactions</span>
            </div>

            <div className="table-responsive">
              <table className="portal-table">
                <thead>
                  <tr>
                    <th>TRANSACTION REF</th>
                    <th>TIMESTAMP</th>
                    <th>CANDIDATE EMAIL</th>
                    <th>AMOUNT (₹)</th>
                    <th>MINUTES</th>
                    <th>ACTION / NOTE</th>
                    <th>AUTHORIZED BY</th>
                    <th style={{ textAlign: 'right' }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="empty-state-cell">
                        No credit history records found in database.
                      </td>
                    </tr>
                  ) : (
                    history.map((h) => (
                      <tr key={h.id}>
                        <td>
                          <span className="ref-hash">#{h.id.slice(-8).toUpperCase()}</span>
                        </td>
                        <td>
                          <span className="timestamp-badge">
                            {new Date(h.created_at).toLocaleString()}
                          </span>
                        </td>
                        <td>
                          <strong className="candidate-email-text">{h.user_email}</strong>
                        </td>
                        <td>
                          <span className="rupee-grant">
                            ₹{Number(h.amount_rupees || (h.minutes_added * RATE_PER_MINUTE)).toFixed(2)}
                          </span>
                        </td>
                        <td>
                          <span className="mins-grant">
                            {h.minutes_added > 0 ? `+${h.minutes_added}` : h.minutes_added} Mins
                          </span>
                        </td>
                        <td>
                          <span className="action-tag">
                            {h.action || 'CREDIT_GRANT'}
                          </span>
                        </td>
                        <td>
                          <span className="admin-grant-tag">{h.added_by}</span>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn-icon-action trash"
                            onClick={() => handleDeleteHistoryEntry(h.id)}
                            title="Delete this history entry"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Hardware Sessions */}
        {activeTab === 'sessions' && (
          <div className="table-wrapper-card">
            <div className="card-header-bar">
              <div>
                <h3 className="card-title">Connected Desktop Hardware Instances</h3>
                <p className="card-subtitle">Real-time telemetry showing live Windows copilot copies connected to the server.</p>
              </div>
              <span className="badge-counter text-emerald">{activeSessionsCount} Active</span>
            </div>

            <div className="table-responsive">
              <table className="portal-table">
                <thead>
                  <tr>
                    <th>INSTANCE HARDWARE ID</th>
                    <th>CANDIDATE</th>
                    <th>EMAIL</th>
                    <th>REMAINING RUNTIME</th>
                    <th>HEARTBEAT STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter((u) => u.active_session).length === 0 ? (
                    <tr>
                      <td colSpan="5" className="empty-state-cell">
                        <div className="empty-state-box">
                          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                          </svg>
                          <h4>No Desktop Sessions Currently Connected</h4>
                          <p>When candidates launch Ghost AI desktop software, their hardware connection will appear here live.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users
                      .filter((u) => u.active_session)
                      .map((u) => (
                        <tr key={u.id}>
                          <td>
                            <span className="hardware-id-tag">
                              {u.active_session.instance_id}
                            </span>
                          </td>
                          <td><strong>{u.name}</strong></td>
                          <td>{u.email}</td>
                          <td>
                            <span className="time-code active">{u.formatted_time || '00:00:00'}</span>
                          </td>
                          <td>
                            <span className="live-sync-pill">
                              <span className="pulse-dot" />
                              Active Heartbeat
                            </span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Edit Candidate & Correct Balance Modal (In case wrong value entered) */}
      {editingCandidate && (
        <ModalOverlay onClick={() => setEditingCandidate(null)}>
          <div className="modal-dialog edit-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <span className="modal-badge edit">ADMIN CORRECTION MODE</span>
                <h3>Edit Candidate &amp; Correct Balance</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setEditingCandidate(null)}>✕</button>
            </div>

            <form onSubmit={handleSaveEdit} className="modal-form">
              {/* Candidate Info */}
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  />
                </div>
                <div className="form-group flex-1">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Balance & Time Direct Correction */}
              <div className="correction-panel">
                <div className="panel-title-bar">
                  <span className="panel-title">Direct Balance &amp; Time Correction</span>
                  <span className="panel-hint">Rate: ₹2.50 = 1 min</span>
                </div>

                <div className="form-row">
                  <div className="form-group flex-1">
                    <label>Balance in Rupees (₹)</label>
                    <div className="input-rupee-row">
                      <span className="rupee-pre">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={editFormData.balanceRupees}
                        onChange={(e) => {
                          const val = Math.max(0, Number(e.target.value) || 0);
                          const mins = Math.floor(val / RATE_PER_MINUTE);
                          setEditFormData({
                            ...editFormData,
                            balanceRupees: e.target.value,
                            remainingMinutes: mins
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group flex-1">
                    <label>Runtime in Minutes</label>
                    <div className="input-rupee-row">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={editFormData.remainingMinutes}
                        onChange={(e) => {
                          const mins = Math.max(0, Number(e.target.value) || 0);
                          const rupees = Math.round(mins * RATE_PER_MINUTE * 100) / 100;
                          setEditFormData({
                            ...editFormData,
                            remainingMinutes: e.target.value,
                            balanceRupees: rupees
                          });
                        }}
                      />
                      <span className="mins-calc-label">mins</span>
                    </div>
                  </div>
                </div>

                {/* Quick Presets to immediately set exact values */}
                <div className="preset-quick-set">
                  <span className="quick-set-label">Quick set exact value:</span>
                  <div className="preset-set-buttons">
                    {[
                      { label: 'Reset ₹0 (0m)', rupees: 0, mins: 0 },
                      { label: 'Set ₹50 (20m)', rupees: 50, mins: 20 },
                      { label: 'Set ₹150 (1h)', rupees: 150, mins: 60 },
                      { label: 'Set ₹300 (2h)', rupees: 300, mins: 120 },
                      { label: 'Set ₹500 (3h 20m)', rupees: 500, mins: 200 }
                    ].map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        className="btn-set-chip"
                        onClick={() => {
                          setEditFormData({
                            ...editFormData,
                            balanceRupees: p.rupees,
                            remainingMinutes: p.mins
                          });
                        }}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Permissions & Role */}
              <div className="form-row">
                <div className="form-group flex-1">
                  <label>Software Access Permission</label>
                  <select
                    value={editFormData.allowedByAdmin ? 'allowed' : 'paused'}
                    onChange={(e) => setEditFormData({ ...editFormData, allowedByAdmin: e.target.value === 'allowed' })}
                    className="styled-select"
                  >
                    <option value="allowed">Allowed (Candidate Can Run)</option>
                    <option value="paused">Paused (Blocked by Admin)</option>
                  </select>
                </div>

                <div className="form-group flex-1">
                  <label>Account Role</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    className="styled-select"
                  >
                    <option value="user">Candidate (User)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {/* Password Change (Optional) */}
              <div className="form-group">
                <label>Change Password (Leave blank to keep unchanged)</label>
                <input
                  type="password"
                  placeholder="New password (optional)"
                  value={editFormData.password}
                  onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                />
              </div>

              {/* Modal Actions */}
              <div className="modal-actions-split">
                <button
                  type="button"
                  className="btn-danger-link"
                  onClick={() => handleDeleteCandidate(editingCandidate)}
                >
                  Delete Candidate
                </button>

                <div className="actions-right">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => setEditingCandidate(null)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingEdit}
                    className="btn-submit"
                  >
                    {isSavingEdit ? 'Saving...' : 'Save & Apply Correction'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </ModalOverlay>
      )}

      {/* Quick Add Candidate Modal */}
      {showAddCandidateModal && (
        <ModalOverlay onClick={() => setShowAddCandidateModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-row">
                <span className="modal-badge">ADMIN PRIVILEGE</span>
                <h3>Create New Candidate</h3>
              </div>
              <button className="btn-modal-close" onClick={() => setShowAddCandidateModal(false)}>✕</button>
            </div>

            <form onSubmit={handleCreateCandidate} className="modal-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newCandidateData.name}
                  onChange={(e) => setNewCandidateData({ ...newCandidateData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="candidate@example.com"
                  value={newCandidateData.email}
                  onChange={(e) => setNewCandidateData({ ...newCandidateData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Temporary Password</label>
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={newCandidateData.password}
                  onChange={(e) => setNewCandidateData({ ...newCandidateData, password: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Initial Time Credit in Rupees (₹)</label>
                <div className="input-rupee-row">
                  <span className="rupee-pre">₹</span>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    placeholder="0"
                    value={newCandidateData.initialRupees}
                    onChange={(e) => setNewCandidateData({ ...newCandidateData, initialRupees: e.target.value })}
                  />
                  <span className="mins-calc-label">
                    ={Math.floor((Number(newCandidateData.initialRupees) || 0) / RATE_PER_MINUTE)} mins runtime
                  </span>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowAddCandidateModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCandidate}
                  className="btn-submit"
                >
                  {isCreatingCandidate ? 'Creating...' : 'Register & Credit Candidate'}
                </button>
              </div>
            </form>
          </div>
        </ModalOverlay>
      )}
    </PortalWrapper>
  );
}

const PortalWrapper = styled.div`
  min-height: calc(100vh - 80px);
  background: var(--bg-canvas, #090b10);
  padding: 36px 24px 80px;

  .portal-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* Header */
  .portal-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
    margin-bottom: 28px;
    flex-wrap: wrap;
  }

  .admin-status-chip {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px;
    border-radius: 6px;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.3);
    color: var(--accent, #10b981);
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.06em;
    margin-bottom: 8px;

    .live-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
    }

    .rate-subtag {
      padding-left: 8px;
      border-left: 1px solid rgba(16, 185, 129, 0.3);
      color: var(--text-muted, #94a3b8);
      font-weight: 600;
    }
  }

  .header-title {
    font-size: 27px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text-headline, #f8fafc);
    margin: 0 0 6px 0;
  }

  .header-sub {
    font-size: 14px;
    color: var(--text-muted, #94a3b8);
    max-width: 720px;
    line-height: 1.55;
    margin: 0;
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .btn-action-primary {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 16px;
    border-radius: 8px;
    background: var(--accent, #10b981);
    border: none;
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
      background: #059669;
    }
  }

  .btn-action-outline {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 8px 14px;
    border-radius: 8px;
    background: var(--surface2, #151c2e);
    border: 1px solid var(--border2, #2d3c58);
    color: var(--text-bright, #f8fafc);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      background: var(--surface3, #1c263c);
      border-color: #38bdf8;
      color: #38bdf8;
    }

    &.syncing svg {
      transform: rotate(180deg);
      transition: transform 0.35s ease;
    }
  }

  .btn-action-ghost {
    padding: 8px 14px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid var(--border, #1e293d);
    color: var(--text-muted, #94a3b8);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      color: var(--text-headline, #f8fafc);
      border-color: var(--border2, #2d3c58);
    }
  }

  .btn-action-close {
    padding: 8px 14px;
    border-radius: 8px;
    background: transparent;
    border: 1px solid var(--border, #1e293d);
    color: var(--text-muted, #94a3b8);
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;

    &:hover {
      color: #f43f5e;
      border-color: rgba(244, 63, 94, 0.4);
    }
  }

  /* Executive Metrics 4-Card Grid */
  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .metric-card {
    background: var(--surface, #0e1422);
    border: 1px solid var(--border, #1e293d);
    border-radius: 12px;
    padding: 18px 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;

    .metric-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .metric-label {
      font-size: 11px;
      font-weight: 700;
      color: var(--text-muted, #64748b);
      letter-spacing: 0.05em;
    }

    .metric-icon-box {
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.blue {
        background: rgba(56, 189, 248, 0.1);
        color: #0284c7;
      }
      &.emerald {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }
      &.gold {
        background: rgba(245, 158, 11, 0.1);
        color: #d97706;
      }
      &.purple {
        background: rgba(168, 85, 247, 0.1);
        color: #9333ea;
      }

      .rupee-icon-sym {
        font-weight: 800;
        font-size: 14px;
      }
    }

    .metric-value {
      font-size: 27px;
      font-weight: 800;
      color: var(--text-headline, #f8fafc);
      line-height: 1.2;
      display: flex;
      align-items: center;
      gap: 8px;

      &.text-emerald { color: #10b981; }
      &.text-cyan { color: #0284c7; }
      &.text-gold { color: #d97706; }

      .value-sub {
        font-size: 14px;
        color: var(--text-muted, #64748b);
        font-weight: 500;
      }

      .pulse-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #10b981;
      }
    }

    .metric-detail {
      font-size: 12px;
      color: var(--text-muted, #94a3b8);
      margin-top: 6px;

      .highlight-pill {
        color: var(--text-headline, #0f172a);
        font-weight: 700;
      }

      .rate-formula {
        font-weight: 600;
        color: var(--text-headline, #0f172a);
      }
    }
  }

  /* Tabs Strip */
  .tabs-strip {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    border-bottom: 1px solid var(--border, #1e293d);
    padding-bottom: 12px;
    margin-bottom: 18px;
    flex-wrap: wrap;

    .tabs-left {
      display: flex;
      gap: 6px;
    }

    .tab-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-muted, #94a3b8);
      font-size: 13.5px;
      font-weight: 600;
      padding: 7px 14px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.15s ease;

      .tab-badge {
        font-size: 11px;
        font-weight: 700;
        padding: 1px 6px;
        border-radius: 10px;
        background: var(--surface2, #151c2e);
        color: var(--text-muted, #94a3b8);
      }

      &:hover {
        color: var(--text-headline, #f8fafc);
        background: var(--surface2, #151c2e);
      }

      &.active {
        background: var(--surface, #0e1422);
        color: var(--accent, #10b981);
        font-weight: 700;
        border-color: var(--border, #1e293d);

        .tab-badge {
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        }
      }
    }

    .tabs-right-meta {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 12px;
      color: var(--text-muted, #94a3b8);

      .last-sync-tag {
        font-size: 11.5px;
      }

      .server-truth-badge {
        background: var(--surface, #0e1422);
        border: 1px solid var(--border, #1e293d);
        padding: 3px 8px;
        border-radius: 6px;
        font-weight: 600;
        font-size: 11px;
        color: #10b981;
      }
    }
  }

  /* Table Wrapper Card */
  .table-wrapper-card {
    background: var(--surface, #0e1422);
    border: 1px solid var(--border, #1e293d);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  }

  /* Filter Toolbar */
  .filter-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 14px;
    padding: 14px 18px;
    background: var(--surface2, #151c2e);
    border-bottom: 1px solid var(--border, #1e293d);
    flex-wrap: wrap;

    .search-box {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--surface, #0e1422);
      border: 1px solid var(--border, #1e293d);
      border-radius: 8px;
      padding: 6px 12px;
      min-width: 320px;
      flex: 1;
      max-width: 440px;

      input {
        background: transparent;
        border: none;
        outline: none;
        color: var(--text-headline, #f8fafc);
        font-size: 13px;
        width: 100%;

        &::placeholder {
          color: var(--text-muted, #64748b);
        }
      }

      .clear-search {
        background: transparent;
        border: none;
        color: var(--text-muted, #64748b);
        cursor: pointer;
        font-size: 12px;
        padding: 2px 4px;

        &:hover {
          color: var(--text-headline, #f8fafc);
        }
      }
    }

    .filter-chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;

      .chip {
        padding: 5px 12px;
        border-radius: 6px;
        background: var(--surface, #0e1422);
        border: 1px solid var(--border, #1e293d);
        color: var(--text-muted, #94a3b8);
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.15s ease;

        &:hover {
          color: var(--text-headline, #f8fafc);
          border-color: var(--border2, #2d3c58);
        }

        &.active {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          border-color: rgba(16, 185, 129, 0.35);
          font-weight: 700;
        }
      }
    }

    .sort-box {
      display: flex;
      align-items: center;
      gap: 8px;

      .sort-label {
        font-size: 12px;
        color: var(--text-muted, #64748b);
      }

      .sort-select {
        background: var(--surface, #0e1422);
        border: 1px solid var(--border, #1e293d);
        color: var(--text-headline, #f8fafc);
        font-size: 12px;
        font-weight: 600;
        padding: 5px 10px;
        border-radius: 6px;
        outline: none;
        cursor: pointer;
      }
    }
  }

  .table-responsive {
    overflow-x: auto;
  }

  /* Table Style */
  .portal-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    th {
      text-align: left;
      padding: 12px 18px;
      background: var(--surface2, #151c2e);
      color: var(--text-muted, #94a3b8);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      border-bottom: 1px solid var(--border, #1e293d);
      white-space: nowrap;
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
      background: rgba(0, 0, 0, 0.02);
    }

    .row-paused {
      opacity: 0.7;
    }

    .empty-state-cell {
      text-align: center;
      padding: 48px;
      color: var(--text-muted, #64748b);

      .empty-state-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        h4 {
          margin: 4px 0 0;
          color: var(--text-headline, #f8fafc);
          font-size: 15px;
        }

        p {
          margin: 0;
          font-size: 13px;
        }

        .btn-empty-reset {
          margin-top: 8px;
          background: var(--surface2, #151c2e);
          border: 1px solid var(--border, #1e293d);
          color: #10b981;
          font-size: 12px;
          font-weight: 600;
          padding: 5px 12px;
          border-radius: 6px;
          cursor: pointer;
        }
      }
    }
  }

  /* Candidate Cell */
  .candidate-cell {
    display: flex;
    align-items: center;
    gap: 12px;

    .candidate-avatar {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      color: #ffffff;
      font-weight: 800;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .candidate-name {
      font-size: 13.5px;
      font-weight: 700;
      color: var(--text-headline, #f8fafc);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .candidate-email-row {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-top: 1px;
    }

    .candidate-email {
      font-size: 12px;
      color: var(--text-muted, #94a3b8);
      max-width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .btn-copy-mini {
      background: transparent;
      border: none;
      color: var(--text-muted, #64748b);
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;

      &:hover {
        color: var(--text-headline, #f8fafc);
      }
    }

    .admin-chip {
      font-size: 9px;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 4px;
      background: rgba(168, 85, 247, 0.15);
      color: #9333ea;
      border: 1px solid rgba(168, 85, 247, 0.35);
    }
  }

  /* Wallet Cell */
  .balance-cell-box {
    display: inline-flex;
    align-items: baseline;
    gap: 3px;
    font-family: 'JetBrains Mono', monospace;
    padding: 3px 8px;
    border-radius: 6px;
    background: var(--surface2, #151c2e);
    border: 1px solid var(--border, #1e293d);
    position: relative;

    &.clickable {
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        border-color: #10b981;
        background: rgba(16, 185, 129, 0.08);

        .pencil-hover-icon {
          opacity: 1;
        }
      }
    }

    .pencil-hover-icon {
      opacity: 0;
      font-size: 10px;
      color: #10b981;
      margin-left: 4px;
      transition: opacity 0.15s ease;
    }

    .currency-symbol {
      color: #10b981;
      font-weight: 700;
      font-size: 12px;
    }

    .balance-number {
      font-size: 13.5px;
      font-weight: 700;
      color: var(--text-headline, #f8fafc);
    }
  }

  /* Time Badge Cell */
  .time-badge-col {
    display: flex;
    flex-direction: column;
    gap: 4px;

    &.clickable {
      cursor: pointer;
      padding: 3px 6px;
      border-radius: 6px;
      transition: background 0.15s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.04);
      }
    }

    .time-code {
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      font-weight: 800;

      &.active { color: #10b981; }
      &.expired { color: #f43f5e; }
    }

    .time-sub-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .time-sub-mins {
      font-size: 11px;
      color: var(--text-muted, #64748b);
      white-space: nowrap;
    }

    .runtime-meter {
      width: 48px;
      height: 4px;
      background: var(--surface2, #151c2e);
      border-radius: 2px;
      overflow: hidden;

      .meter-bar {
        height: 100%;
        border-radius: 2px;

        &.bar-active { background: #10b981; }
        &.bar-expired { background: #f43f5e; }
      }
    }
  }

  /* App Status Pill */
  .status-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 4px;

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    &.pill-active {
      color: #10b981;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.25);
      .dot { background: #10b981; }
    }

    &.pill-expired {
      color: #f43f5e;
      background: rgba(244, 63, 94, 0.1);
      border: 1px solid rgba(244, 63, 94, 0.25);
      .dot { background: #f43f5e; }
    }

    &.pill-paused {
      color: #d97706;
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.25);
      .dot { background: #d97706; }
    }
  }

  /* Desktop Session Pill */
  .desktop-session-pill {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 3px 8px;
    border-radius: 5px;
    font-size: 11.5px;

    &.connected {
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.25);
      color: #0284c7;

      .pulse-beacon {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #0284c7;
      }

      .session-texts {
        display: flex;
        flex-direction: column;
        line-height: 1.15;
      }

      .session-status-text {
        font-weight: 700;
        font-size: 11.5px;
      }

      .session-id-text {
        font-size: 9.5px;
        font-family: 'JetBrains Mono', monospace;
        color: var(--text-muted, #64748b);
      }
    }

    &.idle {
      color: var(--text-muted, #64748b);

      .idle-dot {
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: var(--text-muted, #64748b);
      }

      .idle-text {
        font-size: 11.5px;
      }
    }
  }

  /* Unified Recharge Control Group */
  .recharge-cell {
    display: flex;
    flex-direction: column;
    gap: 5px;
    max-width: 270px;

    .recharge-input-bar {
      display: flex;
      align-items: center;
      background: var(--surface2, #151c2e);
      border: 1px solid var(--border, #1e293d);
      border-radius: 7px;
      padding: 2px 3px 2px 8px;

      .currency-prefix {
        font-weight: 800;
        color: #10b981;
        font-size: 13px;
        margin-right: 4px;
      }

      .recharge-num-input {
        background: transparent;
        border: none;
        outline: none;
        color: var(--text-headline, #f8fafc);
        font-size: 13px;
        font-weight: 700;
        width: 75px;

        &::placeholder {
          color: var(--text-muted, #64748b);
          font-weight: 400;
        }
      }

      .preview-inline-tag {
        font-size: 10.5px;
        font-weight: 700;
        color: #10b981;
        background: rgba(16, 185, 129, 0.12);
        padding: 2px 6px;
        border-radius: 4px;
        margin-right: 6px;
      }

      .btn-credit-rupees {
        margin-left: auto;
        padding: 5px 12px;
        border-radius: 5px;
        background: #10b981;
        color: #ffffff;
        font-size: 11.5px;
        font-weight: 700;
        border: none;
        cursor: pointer;
        transition: background 0.15s ease;

        &:hover {
          background: #059669;
        }
      }
    }

    .preset-row {
      display: flex;
      align-items: center;
      gap: 4px;

      .preset-btn {
        background: transparent;
        border: 1px solid var(--border, #1e293d);
        border-radius: 4px;
        padding: 2px 6px;
        color: var(--text-muted, #94a3b8);
        font-size: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.12s ease;

        &:hover {
          border-color: #10b981;
          color: #10b981;
        }

        &.active {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
          font-weight: 700;
        }
      }
    }
  }

  /* Access Control Switch */
  .btn-access-toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 10px;
    border-radius: 6px;
    font-size: 11.5px;
    font-weight: 700;
    cursor: pointer;
    border: 1px solid transparent;
    transition: all 0.15s ease;

    .toggle-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    &.allowed {
      background: rgba(16, 185, 129, 0.08);
      color: #10b981;
      border-color: rgba(16, 185, 129, 0.25);
      .toggle-indicator { background: #10b981; }

      &:hover {
        background: rgba(16, 185, 129, 0.15);
      }
    }

    &.paused {
      background: rgba(245, 158, 11, 0.08);
      color: #d97706;
      border-color: rgba(245, 158, 11, 0.25);
      .toggle-indicator { background: #d97706; }

      &:hover {
        background: rgba(245, 158, 11, 0.15);
      }
    }
  }

  /* Actions column */
  .actions-col {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;

    .btn-icon-action {
      background: transparent;
      border: 1px solid var(--border, #1e293d);
      color: var(--text-muted, #94a3b8);
      width: 28px;
      height: 28px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        color: var(--text-headline, #f8fafc);
        border-color: var(--border2, #2d3c58);
      }

      &.edit:hover {
        color: #10b981;
        border-color: rgba(16, 185, 129, 0.4);
        background: rgba(16, 185, 129, 0.08);
      }

      &.danger:hover {
        color: #f59e0b;
        border-color: rgba(245, 158, 11, 0.4);
        background: rgba(245, 158, 11, 0.08);
      }

      &.trash:hover {
        color: #f43f5e;
        border-color: rgba(244, 63, 94, 0.4);
        background: rgba(244, 63, 94, 0.08);
      }
    }
  }

  /* Ledger / History / Sessions Card Header */
  .card-header-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border, #1e293d);

    .card-title {
      font-size: 15px;
      font-weight: 700;
      color: var(--text-headline, #f8fafc);
      margin: 0 0 3px;
    }

    .card-subtitle {
      font-size: 12px;
      color: var(--text-muted, #94a3b8);
      margin: 0;
    }

    .badge-counter {
      font-size: 12px;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 6px;
      background: var(--surface2, #151c2e);
      border: 1px solid var(--border, #1e293d);
      color: var(--text-muted, #94a3b8);

      &.text-emerald {
        color: #10b981;
        background: rgba(16, 185, 129, 0.1);
        border-color: rgba(16, 185, 129, 0.25);
      }
    }
  }

  .ref-hash {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11.5px;
    color: var(--text-muted, #64748b);
  }

  .timestamp-badge {
    font-size: 12px;
    color: var(--text-muted, #94a3b8);
  }

  .candidate-email-text {
    font-size: 12.5px;
    color: var(--text-headline, #f8fafc);
  }

  .rupee-grant {
    font-family: 'JetBrains Mono', monospace;
    color: #10b981;
    font-weight: 700;
    font-size: 13px;
  }

  .mins-grant {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-headline, #f8fafc);
  }

  .action-tag {
    font-size: 10px;
    font-weight: 700;
    padding: 2px 6px;
    border-radius: 4px;
    background: var(--surface2, #151c2e);
    border: 1px solid var(--border, #1e293d);
    color: var(--text-muted, #94a3b8);
  }

  .admin-grant-tag {
    font-size: 12px;
    color: var(--text-muted, #94a3b8);
  }

  .hardware-id-tag {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 4px;
    background: var(--surface2, #151c2e);
    border: 1px solid var(--border, #1e293d);
    color: var(--text-headline, #f8fafc);
  }

  .live-sync-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 600;
    color: #10b981;

    .pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
    }
  }

  @media (max-width: 1080px) {
    .metrics-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .metrics-grid {
      grid-template-columns: 1fr;
    }
    .portal-header {
      flex-direction: column;
    }
    .filter-toolbar .search-box {
      min-width: 100%;
    }
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;

  .modal-dialog {
    background: var(--surface, #0e1422);
    border: 1px solid var(--border, #1e293d);
    border-radius: 12px;
    width: 100%;
    max-width: 480px;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.35);
    overflow: hidden;

    &.edit-dialog {
      max-width: 540px;
    }
  }

  .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border, #1e293d);

    .modal-badge {
      font-size: 9px;
      font-weight: 800;
      color: #10b981;
      letter-spacing: 0.05em;

      &.edit {
        color: #38bdf8;
      }
    }

    h3 {
      margin: 2px 0 0;
      font-size: 16px;
      font-weight: 700;
      color: var(--text-headline, #f8fafc);
    }

    .btn-modal-close {
      background: transparent;
      border: none;
      color: var(--text-muted, #94a3b8);
      font-size: 16px;
      cursor: pointer;

      &:hover {
        color: var(--text-headline, #f8fafc);
      }
    }
  }

  .modal-form {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;

    .form-row {
      display: flex;
      gap: 12px;
    }

    .flex-1 {
      flex: 1;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;

      label {
        font-size: 12px;
        font-weight: 600;
        color: var(--text-muted, #94a3b8);
      }

      input,
      .styled-select {
        background: var(--surface2, #151c2e);
        border: 1px solid var(--border, #1e293d);
        border-radius: 6px;
        padding: 8px 12px;
        color: var(--text-headline, #f8fafc);
        font-size: 13px;
        outline: none;

        &:focus {
          border-color: #10b981;
        }
      }
    }

    .input-rupee-row {
      display: flex;
      align-items: center;
      background: var(--surface2, #151c2e);
      border: 1px solid var(--border, #1e293d);
      border-radius: 6px;
      padding: 0 10px;

      .rupee-pre {
        font-weight: 800;
        color: #10b981;
        font-size: 14px;
        margin-right: 6px;
      }

      input {
        border: none;
        background: transparent;
        padding: 8px 0;
        width: 100%;
        color: var(--text-headline, #f8fafc);
        font-size: 13px;
        font-weight: 700;
        outline: none;
      }

      .mins-calc-label {
        margin-left: auto;
        font-size: 11px;
        font-weight: 600;
        color: #10b981;
        white-space: nowrap;
      }
    }

    /* Correction Panel */
    .correction-panel {
      background: rgba(16, 185, 129, 0.04);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: 8px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 10px;

      .panel-title-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .panel-title {
          font-size: 12px;
          font-weight: 700;
          color: #10b981;
        }

        .panel-hint {
          font-size: 11px;
          color: var(--text-muted, #64748b);
        }
      }

      .preset-quick-set {
        display: flex;
        flex-direction: column;
        gap: 6px;

        .quick-set-label {
          font-size: 11px;
          color: var(--text-muted, #94a3b8);
          font-weight: 600;
        }

        .preset-set-buttons {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;

          .btn-set-chip {
            background: var(--surface, #0e1422);
            border: 1px solid var(--border, #1e293d);
            border-radius: 4px;
            padding: 3px 8px;
            font-size: 11px;
            font-weight: 600;
            color: var(--text-headline, #f8fafc);
            cursor: pointer;
            transition: all 0.12s ease;

            &:hover {
              border-color: #10b981;
              color: #10b981;
            }
          }
        }
      }
    }

    .modal-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 10px;

      .btn-cancel {
        background: transparent;
        border: 1px solid var(--border, #1e293d);
        color: var(--text-muted, #94a3b8);
        padding: 8px 14px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;

        &:hover {
          color: var(--text-headline, #f8fafc);
        }
      }

      .btn-submit {
        background: #10b981;
        border: none;
        color: #ffffff;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;

        &:hover {
          background: #059669;
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }

    .modal-actions-split {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      margin-top: 10px;
      padding-top: 12px;
      border-top: 1px solid var(--border, #1e293d);

      .btn-danger-link {
        background: transparent;
        border: none;
        color: #f43f5e;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        padding: 4px 0;

        &:hover {
          text-decoration: underline;
        }
      }

      .actions-right {
        display: flex;
        align-items: center;
        gap: 8px;

        .btn-cancel {
          background: transparent;
          border: 1px solid var(--border, #1e293d);
          color: var(--text-muted, #94a3b8);
          padding: 8px 14px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;

          &:hover {
            color: var(--text-headline, #f8fafc);
          }
        }

        .btn-submit {
          background: #10b981;
          border: none;
          color: #ffffff;
          padding: 8px 16px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;

          &:hover {
            background: #059669;
          }

          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }
      }
    }
  }
`;
