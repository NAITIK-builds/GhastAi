/**
 * api.js - Robust Unified API Client for Ghost AI
 * Seamlessly interfaces with:
 * 1. Local Vite dev API server (/api/*) when available.
 * 2. Client-side cloud sync (Firebase Realtime Database) and persistent LocalStorage
 *    when deployed statically (e.g. Netlify) or offline.
 *
 * Prevents HTML/JSON parsing SyntaxErrors completely.
 */

import { db, ref, get, set, update, remove } from '../firebase';

const SEED_USERS = [
  {
    id: "user_admin",
    name: "System Administrator",
    email: "admin@ghostai.internal",
    password_hash: "426848eb68bf6aa07212a4070863dbe30d92456cf011e238252ddfd86a247856", // admin@123
    role: "admin",
    remaining_seconds: 2400000,
    created_at: "2026-09-20T10:00:00.000Z",
    updated_at: "2026-09-22T05:16:29.773Z",
    balanceRupees: 100000,
    allowedByAdmin: true
  },
  {
    id: "user_1790055745588",
    name: "Naitik",
    email: "naitik@gmail.com",
    password_hash: "5f906d3fc1945d8ee58ba974f12e8049720cb224bfc219fa4a73c5b703be9764", // naitik123
    role: "admin",
    remaining_seconds: 7200,
    created_at: "2026-09-22T05:42:25.588Z",
    updated_at: "2026-09-23T05:21:56.079Z",
    balanceRupees: 300,
    allowedByAdmin: true
  },
  {
    id: "user_1790051951942",
    name: "Naitik Test",
    email: "naitik.test@example.com",
    password_hash: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", // password123
    role: "user",
    remaining_seconds: 7200,
    created_at: "2026-09-22T04:39:11.942Z",
    updated_at: "2026-09-23T05:20:37.246Z",
    allowedByAdmin: true,
    balanceRupees: 300
  },
  {
    id: "user_2",
    name: "Priya Patel",
    email: "priya.patel@techmail.com",
    password_hash: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
    role: "user",
    remaining_seconds: 10730,
    created_at: "2026-09-21T08:30:00.000Z",
    updated_at: "2026-09-22T05:59:07.592Z",
    balanceRupees: 450,
    allowedByAdmin: true
  }
];

const SEED_HISTORY = [
  {
    id: "lic_1790140842105",
    user_id: "user_1790055745588",
    user_email: "naitik@gmail.com",
    amount_rupees: 5,
    minutes_added: 2,
    added_by: "naitik@gmail.com",
    created_at: "2026-09-23T05:20:42.105Z"
  },
  {
    id: "edit_1790140837254",
    user_id: "user_1790051951942",
    user_email: "naitik.test@example.com",
    amount_rupees: 300,
    minutes_added: 120,
    action: "MANUAL_EDIT_CORRECTION",
    added_by: "naitik@gmail.com",
    created_at: "2026-09-23T05:20:37.254Z"
  }
];

// Helper to hash password using Web Crypto API
async function sha256Hex(plainText) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(plainText);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return plainText;
  }
}

function formatSeconds(totalSeconds) {
  const secs = Math.max(0, Math.floor(Number(totalSeconds) || 0));
  const hrs = Math.floor(secs / 3600);
  const mins = Math.floor((secs % 3600) / 60);
  const remainingSecs = secs % 60;
  return [
    String(hrs).padStart(2, '0'),
    String(mins).padStart(2, '0'),
    String(remainingSecs).padStart(2, '0')
  ].join(':');
}

// Local Storage helpers
function getLocalUsers() {
  try {
    const raw = localStorage.getItem('ghost_users_db');
    if (!raw) {
      localStorage.setItem('ghost_users_db', JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_USERS;
  } catch (e) {
    return SEED_USERS;
  }
}

function saveLocalUsers(users) {
  try {
    localStorage.setItem('ghost_users_db', JSON.stringify(users));
  } catch (e) {}
}

function getLocalHistory() {
  try {
    const raw = localStorage.getItem('ghost_license_history');
    if (!raw) {
      localStorage.setItem('ghost_license_history', JSON.stringify(SEED_HISTORY));
      return SEED_HISTORY;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SEED_HISTORY;
  } catch (e) {
    return SEED_HISTORY;
  }
}

function saveLocalHistory(history) {
  try {
    localStorage.setItem('ghost_license_history', JSON.stringify(history));
  } catch (e) {}
}

// Cloud sync fire-and-forget
function syncToCloud(pathStr, data, method = 'set') {
  if (!db) return;
  try {
    const targetRef = ref(db, pathStr);
    if (method === 'set') set(targetRef, data).catch(() => {});
    else if (method === 'update') update(targetRef, data).catch(() => {});
    else if (method === 'remove') remove(targetRef).catch(() => {});
  } catch (e) {}
}

/**
 * Safely calls backend /api/*.
 * If backend returns valid JSON (local Vite dev server), returns { ok: true, data }.
 * If backend returns HTML (Netlify 404/SPA rewrite) or network error, returns { isOfflineOrHtml: true }.
 */
async function tryBackendApi(endpoint, options = {}) {
  try {
    const res = await fetch(endpoint, options);
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const data = await res.json();
      return { ok: res.ok, status: res.status, data, isOfflineOrHtml: false };
    }
    // Received HTML (e.g. Netlify index.html fallback for missing API)
    return { ok: false, status: res.status, isOfflineOrHtml: true, error: 'Static host - no local backend server' };
  } catch (err) {
    return { ok: false, status: 0, isOfflineOrHtml: true, error: err.message };
  }
}

export const api = {
  // 1. Get all users
  async getUsers() {
    const res = await tryBackendApi('/api/admin/users');
    if (!res.isOfflineOrHtml && res.ok && Array.isArray(res.data)) {
      saveLocalUsers(res.data);
      return res.data;
    }

    // Try Firebase RTDB if available
    if (db) {
      try {
        const snapshot = await get(ref(db, 'users'));
        if (snapshot.exists()) {
          const cloudVal = snapshot.val();
          const list = Array.isArray(cloudVal) ? cloudVal : Object.values(cloudVal);
          if (list.length > 0) {
            saveLocalUsers(list);
            return list;
          }
        }
      } catch (e) {}
    }

    return getLocalUsers();
  },

  // 2. User status
  async getUserStatus(userId, email) {
    const query = userId ? `userId=${encodeURIComponent(userId)}` : `email=${encodeURIComponent(email)}`;
    const res = await tryBackendApi(`/api/user-status?${query}`);
    if (!res.isOfflineOrHtml && res.ok && res.data) {
      return res.data;
    }

    const users = getLocalUsers();
    const user = users.find((u) => (userId && u.id === userId) || (email && u.email?.toLowerCase() === email?.toLowerCase()));
    if (!user) {
      throw new Error('User not found');
    }

    const remSecs = user.remaining_seconds || 0;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      remaining_seconds: remSecs,
      formatted_time: formatSeconds(remSecs),
      status: remSecs > 0 ? 'Active' : 'Expired',
      software_status: remSecs > 0 ? 'Available' : 'Expired'
    };
  },

  // 3. Register
  async register({ name, email, password, confirmPassword }) {
    if (!email || !password) throw new Error('Email and password are required');
    if (password !== confirmPassword) throw new Error('Passwords do not match');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');

    const res = await tryBackendApi('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, confirmPassword })
    });

    if (!res.isOfflineOrHtml) {
      if (res.ok && res.data?.success) return res.data;
      throw new Error(res.data?.error || 'Registration failed');
    }

    // Fallback: Local + Cloud sync
    const users = getLocalUsers();
    const normEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email?.toLowerCase() === normEmail)) {
      throw new Error('An account with this email already exists');
    }

    const hash = await sha256Hex(password);
    const newUser = {
      id: `user_${Date.now()}`,
      name: name ? name.trim() : normEmail.split('@')[0],
      email: normEmail,
      password_hash: hash,
      role: 'user',
      remaining_seconds: 0,
      balanceRupees: 0,
      allowedByAdmin: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newUser);
    saveLocalUsers(users);
    syncToCloud(`users/${newUser.id}`, newUser);

    const { password_hash, ...safeUser } = newUser;
    return { success: true, message: 'Registration successful! Account created.', user: safeUser };
  },

  // 4. Login
  async login({ email, password }) {
    if (!email || !password) throw new Error('Email and password required');

    const res = await tryBackendApi('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!res.isOfflineOrHtml) {
      if (res.ok && res.data?.success) return res.data;
      throw new Error(res.data?.error || 'Invalid credentials');
    }

    // Fallback: Client authentication against local database
    const users = getLocalUsers();
    const normEmail = email.trim().toLowerCase();
    const hash = await sha256Hex(password);

    const user = users.find((u) => u.email?.toLowerCase() === normEmail);
    if (!user) {
      throw new Error('Account not found. Please register first.');
    }

    const isValid = user.password_hash === hash || user.password === password;
    if (!isValid) {
      throw new Error('Incorrect password');
    }

    const { password_hash, ...safeUser } = user;
    return {
      success: true,
      user: safeUser,
      formattedTime: formatSeconds(user.remaining_seconds || 0)
    };
  },

  // 5. Add Time / Recharge
  async addTime({ userId, amountRupees, minutes, addedBy }) {
    const res = await tryBackendApi('/api/admin/add-time', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amountRupees, minutes, addedBy })
    });

    if (!res.isOfflineOrHtml) {
      if (res.ok && res.data?.success) return res.data;
      throw new Error(res.data?.error || 'Failed to add time');
    }

    let mins = 0;
    let rupees = 0;
    if (amountRupees !== undefined && !isNaN(Number(amountRupees))) {
      rupees = Number(amountRupees);
      mins = Math.floor(rupees / 2.5);
    } else if (minutes !== undefined && !isNaN(Number(minutes))) {
      mins = parseInt(minutes, 10);
      rupees = mins * 2.5;
    }

    if (!userId || mins <= 0) throw new Error('Invalid recharge amount');

    const users = getLocalUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    const addedSeconds = mins * 60;
    user.remaining_seconds = (user.remaining_seconds || 0) + addedSeconds;
    user.balanceRupees = Math.round((user.remaining_seconds / 60) * 2.5 * 100) / 100;
    user.allowedByAdmin = true;
    user.updated_at = new Date().toISOString();
    saveLocalUsers(users);
    syncToCloud(`users/${user.id}`, user);

    const history = getLocalHistory();
    const logEntry = {
      id: `lic_${Date.now()}`,
      user_id: user.id,
      user_email: user.email,
      amount_rupees: rupees,
      minutes_added: mins,
      added_by: addedBy || 'admin@ghostai.internal',
      created_at: new Date().toISOString()
    };
    history.unshift(logEntry);
    saveLocalHistory(history);
    syncToCloud(`history/${logEntry.id}`, logEntry);

    return {
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        remaining_seconds: user.remaining_seconds,
        minutesRemaining: Math.floor(user.remaining_seconds / 60),
        balanceRupees: user.balanceRupees,
        formatted_time: formatSeconds(user.remaining_seconds)
      }
    };
  },

  // 6. Toggle Access
  async toggleAccess({ userId, allowed }) {
    const res = await tryBackendApi('/api/admin/toggle-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, allowed })
    });

    if (!res.isOfflineOrHtml) {
      if (res.ok && res.data?.success) return res.data;
    }

    const users = getLocalUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      user.allowedByAdmin = allowed !== undefined ? allowed : !user.allowedByAdmin;
      user.updated_at = new Date().toISOString();
      saveLocalUsers(users);
      syncToCloud(`users/${user.id}`, user);
      return { success: true, allowedByAdmin: user.allowedByAdmin };
    }
    throw new Error('User not found');
  },

  // 7. Reset Time
  async resetTime({ userId, reason, adminEmail }) {
    const res = await tryBackendApi('/api/admin/reset-time', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, reason, adminEmail })
    });

    if (!res.isOfflineOrHtml) {
      if (res.ok && res.data?.success) return res.data;
    }

    const users = getLocalUsers();
    const user = users.find((u) => u.id === userId);
    if (user) {
      const prevSecs = user.remaining_seconds || 0;
      user.remaining_seconds = 0;
      user.balanceRupees = 0;
      user.updated_at = new Date().toISOString();
      saveLocalUsers(users);
      syncToCloud(`users/${user.id}`, user);

      const history = getLocalHistory();
      const logEntry = {
        id: `lic_${Date.now()}`,
        user_id: user.id,
        user_email: user.email,
        amount_rupees: 0,
        minutes_added: -Math.floor(prevSecs / 60),
        action: 'RESET_ZERO',
        added_by: adminEmail || 'admin@ghostai.internal',
        created_at: new Date().toISOString()
      };
      history.unshift(logEntry);
      saveLocalHistory(history);
      syncToCloud(`history/${logEntry.id}`, logEntry);

      return { success: true, remaining_seconds: 0 };
    }
    throw new Error('User not found');
  },

  // 8. Create Candidate
  async createCandidate({ name, email, password, initialRupees, addedBy }) {
    const res = await tryBackendApi('/api/admin/create-candidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, initialRupees, addedBy })
    });

    if (!res.isOfflineOrHtml) {
      if (res.ok && res.data?.success) return res.data;
      throw new Error(res.data?.error || 'Failed to create candidate');
    }

    const users = getLocalUsers();
    const normEmail = email.trim().toLowerCase();
    if (users.some((u) => u.email?.toLowerCase() === normEmail)) {
      throw new Error('An account with this email already exists');
    }

    const amount = Number(initialRupees) || 0;
    const mins = Math.floor(amount / 2.5);
    const secs = mins * 60;
    const hash = await sha256Hex(password);

    const newCandidate = {
      id: `cand_${Date.now()}`,
      name: name.trim(),
      email: normEmail,
      password_hash: hash,
      role: 'user',
      remaining_seconds: secs,
      balanceRupees: amount,
      allowedByAdmin: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    users.push(newCandidate);
    saveLocalUsers(users);
    syncToCloud(`users/${newCandidate.id}`, newCandidate);

    if (secs > 0) {
      const history = getLocalHistory();
      const logEntry = {
        id: `lic_${Date.now()}`,
        user_id: newCandidate.id,
        user_email: newCandidate.email,
        amount_rupees: amount,
        minutes_added: mins,
        added_by: addedBy || 'admin@ghostai.internal',
        created_at: new Date().toISOString()
      };
      history.unshift(logEntry);
      saveLocalHistory(history);
      syncToCloud(`history/${logEntry.id}`, logEntry);
    }

    const { password_hash, ...safe } = newCandidate;
    return { success: true, candidate: safe };
  },

  // 9. Edit Candidate
  async editCandidate(payload) {
    const res = await tryBackendApi('/api/admin/edit-candidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.isOfflineOrHtml) {
      if (res.ok && res.data?.success) return res.data;
      throw new Error(res.data?.error || 'Failed to edit candidate');
    }

    const { userId, name, email, balanceRupees, remainingMinutes, remainingSeconds, allowedByAdmin, role, password, adminEmail } = payload;
    const users = getLocalUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');

    if (name) user.name = name.trim();
    if (email) user.email = email.trim().toLowerCase();
    if (role) user.role = role;
    if (allowedByAdmin !== undefined) user.allowedByAdmin = Boolean(allowedByAdmin);
    if (password && password.trim()) {
      user.password_hash = await sha256Hex(password.trim());
    }

    if (remainingSeconds !== undefined && !isNaN(Number(remainingSeconds))) {
      user.remaining_seconds = Math.max(0, parseInt(remainingSeconds, 10));
      user.balanceRupees = Math.round((user.remaining_seconds / 60) * 2.5 * 100) / 100;
    } else if (remainingMinutes !== undefined && !isNaN(Number(remainingMinutes))) {
      const mins = Math.max(0, parseInt(remainingMinutes, 10));
      user.remaining_seconds = mins * 60;
      user.balanceRupees = Math.round(mins * 2.5 * 100) / 100;
    } else if (balanceRupees !== undefined && !isNaN(Number(balanceRupees))) {
      const r = Math.max(0, Number(balanceRupees));
      user.remaining_seconds = Math.floor(r / 2.5) * 60;
      user.balanceRupees = r;
    }

    user.updated_at = new Date().toISOString();
    saveLocalUsers(users);
    syncToCloud(`users/${user.id}`, user);

    const history = getLocalHistory();
    const logEntry = {
      id: `edit_${Date.now()}`,
      user_id: user.id,
      user_email: user.email,
      amount_rupees: user.balanceRupees,
      minutes_added: Math.floor((user.remaining_seconds || 0) / 60),
      action: 'MANUAL_EDIT_CORRECTION',
      added_by: adminEmail || 'admin@ghostai.internal',
      created_at: new Date().toISOString()
    };
    history.unshift(logEntry);
    saveLocalHistory(history);
    syncToCloud(`history/${logEntry.id}`, logEntry);

    const { password_hash, ...safeUser } = user;
    return { success: true, user: safeUser };
  },

  // 10. Delete Candidate
  async deleteCandidate({ userId }) {
    const res = await tryBackendApi('/api/admin/delete-candidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });

    if (!res.isOfflineOrHtml) {
      if (res.ok && res.data?.success) return res.data;
    }

    let users = getLocalUsers();
    users = users.filter((u) => u.id !== userId);
    saveLocalUsers(users);
    syncToCloud(`users/${userId}`, null, 'remove');
    return { success: true };
  },

  // 11. Get History
  async getHistory() {
    const res = await tryBackendApi('/api/admin/history');
    if (!res.isOfflineOrHtml && res.ok && Array.isArray(res.data)) {
      saveLocalHistory(res.data);
      return res.data;
    }

    if (db) {
      try {
        const snapshot = await get(ref(db, 'history'));
        if (snapshot.exists()) {
          const cloudVal = snapshot.val();
          const list = Array.isArray(cloudVal) ? cloudVal : Object.values(cloudVal);
          if (list.length > 0) {
            saveLocalHistory(list);
            return list;
          }
        }
      } catch (e) {}
    }

    return getLocalHistory();
  },

  // 12. Delete History Entry
  async deleteHistoryEntry({ historyId }) {
    const res = await tryBackendApi('/api/admin/delete-history-entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ historyId })
    });

    if (!res.isOfflineOrHtml) {
      if (res.ok && res.data?.success) return res.data;
    }

    let history = getLocalHistory();
    history = history.filter((h) => h.id !== historyId);
    saveLocalHistory(history);
    syncToCloud(`history/${historyId}`, null, 'remove');
    return { success: true };
  },

  // 13. Download Info
  async getDownloadInfo() {
    const res = await tryBackendApi('/api/download');
    if (!res.isOfflineOrHtml && res.ok && res.data) {
      return res.data;
    }
    return {
      softwareName: 'Ghost AI Assistant',
      version: '1.0.0',
      platform: 'Windows 10 / 11 (64-bit)',
      filename: 'GhostAI-v1.0.0-Windows.zip',
      downloadUrl: '/GhostAI-v1.0.0-Windows.zip',
      releaseDate: 'September 2026',
      requirements: 'Windows 10/11 x64, 4GB RAM'
    };
  }
};
