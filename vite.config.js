import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERS_DB_PATH = path.resolve(__dirname, '../src/engine/users_db.json');
const SESSIONS_DB_PATH = path.resolve(__dirname, '../src/engine/sessions_db.json');
const HISTORY_DB_PATH = path.resolve(__dirname, '../src/engine/license_history.json');

const CLOUD_DB_URL = process.env.VITE_FIREBASE_DB_URL || 'https://ghastai-default-rtdb.firebaseio.com';

function syncCloudUser(user, method = 'PUT') {
  if (!user || !user.id) return;
  try {
    const url = `${CLOUD_DB_URL}/users/${user.id}.json`;
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method === 'DELETE' ? undefined : JSON.stringify(user)
    }).catch(() => {});
  } catch (err) {}
}

function syncCloudSession(session, method = 'PUT') {
  if (!session || !session.user_id) return;
  try {
    const url = `${CLOUD_DB_URL}/sessions/${session.user_id}.json`;
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: method === 'DELETE' ? undefined : JSON.stringify(session)
    }).catch(() => {});
  } catch (err) {}
}

function syncCloudHistory(entry) {
  if (!entry || !entry.id) return;
  try {
    const url = `${CLOUD_DB_URL}/history/${entry.id}.json`;
    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    }).catch(() => {});
  } catch (err) {}
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function readJsonFile(filePath, defaultVal = []) {
  try {
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2), 'utf-8');
      return defaultVal;
    }
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`[API] Error reading ${filePath}:`, err);
    return defaultVal;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error(`[API] Error writing ${filePath}:`, err);
    return false;
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

function cleanStaleSessions(sessions) {
  const now = Date.now();
  // If last sync was more than 45 seconds ago, session is deemed inactive/closed
  return sessions.filter((s) => {
    if (!s.last_sync) return false;
    const diff = now - new Date(s.last_sync).getTime();
    return diff < 45000 && s.status === 'active';
  });
}

function apiPlugin() {
  return {
    name: 'ghost-ai-license-api-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith('/api/')) {
          return next();
        }

        const url = new URL(req.url, `http://${req.headers.host}`);
        const pathname = url.pathname;

        res.setHeader('Content-Type', 'application/json');

        const parseBody = (callback) => {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const parsed = body ? JSON.parse(body) : {};
              callback(parsed);
            } catch (e) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Invalid JSON body' }));
            }
          });
        };

        // 1. GET /api/download
        if (pathname === '/api/download' && req.method === 'GET') {
          return res.end(
            JSON.stringify({
              softwareName: 'Ghost AI Assistant',
              version: '1.0.0',
              platform: 'Windows 10 / 11 (64-bit)',
              filename: 'GhostAI-v1.0.0-Windows.zip',
              downloadUrl: '/downloads/GhostAI-v1.0.0-Windows.zip',
              releaseDate: '2026-09-22',
              requirements: 'Windows 10/11 x64, 4GB RAM'
            })
          );
        }

        // 2. POST /api/register
        if (pathname === '/api/register' && req.method === 'POST') {
          return parseBody(({ name, email, password, confirmPassword }) => {
            if (!email || !password) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Email and password are required' }));
            }
            if (password !== confirmPassword) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Passwords do not match' }));
            }
            if (password.length < 6) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Password must be at least 6 characters long' }));
            }

            const users = readJsonFile(USERS_DB_PATH, []);
            const normEmail = email.trim().toLowerCase();
            const existing = users.find((u) => u.email.toLowerCase() === normEmail);
            if (existing) {
              res.statusCode = 409;
              return res.end(JSON.stringify({ error: 'An account with this email already exists' }));
            }

            // Per Requirement #2: remaining_seconds = 0
            const newUser = {
              id: `user_${Date.now()}`,
              name: name ? name.trim() : normEmail.split('@')[0],
              email: normEmail,
              password_hash: hashPassword(password),
              role: 'user',
              remaining_seconds: 0,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            users.push(newUser);
            writeJsonFile(USERS_DB_PATH, users);
            syncCloudUser(newUser);

            // Do not expose password_hash
            const { password_hash, ...safeUser } = newUser;
            return res.end(
              JSON.stringify({
                success: true,
                message: 'Registration successful! Account created. Please sign in.',
                user: safeUser
              })
            );
          });
        }

        // 3. POST /api/login
        if (pathname === '/api/login' && req.method === 'POST') {
          return parseBody(({ email, password }) => {
            if (!email || !password) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Email and password are required' }));
            }

            const users = readJsonFile(USERS_DB_PATH, []);
            const normEmail = email.trim().toLowerCase();
            const hashed = hashPassword(password);
            const user = users.find((u) => u.email.toLowerCase() === normEmail);

            if (!user) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'Account not found. Please register.' }));
            }

            // Check hashed password (or fallback for legacy unhashed entry)
            if (user.password_hash !== hashed && user.password !== password) {
              res.statusCode = 401;
              return res.end(JSON.stringify({ error: 'Incorrect password' }));
            }

            // Ensure password is migrated to hash if was plaintext
            if (!user.password_hash) {
              user.password_hash = hashed;
              delete user.password;
              writeJsonFile(USERS_DB_PATH, users);
            }

            const { password_hash, ...safeUser } = user;
            return res.end(
              JSON.stringify({
                success: true,
                user: safeUser,
                formattedTime: formatSeconds(user.remaining_seconds || 0)
              })
            );
          });
        }

        // 4. GET /api/user-status
        if (pathname === '/api/user-status' && req.method === 'GET') {
          const userId = url.searchParams.get('userId');
          const email = url.searchParams.get('email');
          const users = readJsonFile(USERS_DB_PATH, []);
          const user = users.find(
            (u) => (userId && u.id === userId) || (email && u.email.toLowerCase() === email.toLowerCase())
          );

          if (!user) {
            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'User not found' }));
          }

          const sessions = cleanStaleSessions(readJsonFile(SESSIONS_DB_PATH, []));
          const activeSession = sessions.find((s) => s.user_id === user.id);

          return res.end(
            JSON.stringify({
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              remaining_seconds: user.remaining_seconds || 0,
              formatted_time: formatSeconds(user.remaining_seconds || 0),
              status: (user.remaining_seconds || 0) > 0 ? 'Active' : 'Expired',
              software_status: activeSession ? 'Active on Desktop' : 'Available'
            })
          );
        }

        // 5. POST /api/software/login (Used by Existing Desktop Software)
        if (pathname === '/api/software/login' && req.method === 'POST') {
          return parseBody(({ email, password, software_instance_id }) => {
            if (!email || !password) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ authenticated: false, error: 'Email and password required' }));
            }

            const users = readJsonFile(USERS_DB_PATH, []);
            const normEmail = email.trim().toLowerCase();
            const hashed = hashPassword(password);
            const user = users.find((u) => u.email.toLowerCase() === normEmail);

            if (!user) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ authenticated: false, error: 'Account not found. Please register on website.' }));
            }

            if (user.password_hash !== hashed && user.password !== password) {
              res.statusCode = 401;
              return res.end(JSON.stringify({ authenticated: false, error: 'Incorrect password.' }));
            }

            const instanceId = software_instance_id || `inst_${Date.now()}`;
            let sessions = cleanStaleSessions(readJsonFile(SESSIONS_DB_PATH, []));

            // Prevent multiple concurrent sessions
            const existingOtherSession = sessions.find(
              (s) => s.user_id === user.id && s.software_instance_id !== instanceId
            );

            if (existingOtherSession) {
              res.statusCode = 409;
              return res.end(
                JSON.stringify({
                  authenticated: false,
                  error: 'Active session already open on another instance. Multiple copies are not allowed.',
                  session_conflict: true
                })
              );
            }

            // Upsert session
            const nowIso = new Date().toISOString();
            sessions = sessions.filter((s) => s.user_id !== user.id);
            sessions.push({
              id: `sess_${Date.now()}`,
              user_id: user.id,
              software_instance_id: instanceId,
              started_at: nowIso,
              last_sync: nowIso,
              status: 'active'
            });
            writeJsonFile(SESSIONS_DB_PATH, sessions);

            const remainingSeconds = user.remaining_seconds || 0;
            return res.end(
              JSON.stringify({
                authenticated: true,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  role: user.role
                },
                remaining_seconds: remainingSeconds,
                formatted_time: formatSeconds(remainingSeconds),
                status: remainingSeconds > 0 ? 'active' : 'expired',
                software_instance_id: instanceId
              })
            );
          });
        }

        // 6. POST /api/software/sync (Server-Side Time Validation & Synchronization Heartbeat)
        if (pathname === '/api/software/sync' && req.method === 'POST') {
          return parseBody(({ userId, software_instance_id, elapsed_seconds }) => {
            if (!userId) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'userId required' }));
            }

            const users = readJsonFile(USERS_DB_PATH, []);
            const user = users.find((u) => u.id === userId);
            if (!user) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'User not found' }));
            }

            let sessions = cleanStaleSessions(readJsonFile(SESSIONS_DB_PATH, []));
            const session = sessions.find(
              (s) => s.user_id === userId && s.software_instance_id === software_instance_id
            );

            // Deduct elapsed active seconds from database (server is source of truth)
            const deduction = Math.max(0, parseInt(elapsed_seconds, 10) || 0);
            if (deduction > 0) {
              user.remaining_seconds = Math.max(0, (user.remaining_seconds || 0) - deduction);
              user.updated_at = new Date().toISOString();
              writeJsonFile(USERS_DB_PATH, users);
            }

            if (session) {
              session.last_sync = new Date().toISOString();
              session.status = user.remaining_seconds > 0 ? 'active' : 'expired';
              writeJsonFile(SESSIONS_DB_PATH, sessions);
            }

            return res.end(
              JSON.stringify({
                authenticated: true,
                remaining_seconds: user.remaining_seconds || 0,
                formatted_time: formatSeconds(user.remaining_seconds || 0),
                status: (user.remaining_seconds || 0) > 0 ? 'active' : 'expired'
              })
            );
          });
        }

        // 7. POST /api/software/logout
        if (pathname === '/api/software/logout' && req.method === 'POST') {
          return parseBody(({ userId, software_instance_id }) => {
            let sessions = readJsonFile(SESSIONS_DB_PATH, []);
            sessions = sessions.filter(
              (s) => !(s.user_id === userId && (!software_instance_id || s.software_instance_id === software_instance_id))
            );
            writeJsonFile(SESSIONS_DB_PATH, sessions);
            return res.end(JSON.stringify({ success: true }));
          });
        }

        // 8. GET /api/admin/users
        if (pathname === '/api/admin/users' && req.method === 'GET') {
          const users = readJsonFile(USERS_DB_PATH, []);
          const sessions = cleanStaleSessions(readJsonFile(SESSIONS_DB_PATH, []));

          const userList = users.map((u) => {
            const activeSession = sessions.find((s) => s.user_id === u.id);
            const remSecs = u.remaining_seconds || 0;
            return {
              id: u.id,
              name: u.name,
              email: u.email,
              role: u.role,
              remaining_seconds: remSecs,
              minutesRemaining: Math.floor(remSecs / 60),
              balanceRupees: Math.round((remSecs / 60) * 2.5 * 100) / 100,
              formatted_time: formatSeconds(remSecs),
              status: remSecs > 0 ? 'Active' : 'Expired',
              allowedByAdmin: u.allowedByAdmin !== undefined ? u.allowedByAdmin : remSecs > 0,
              created_at: u.created_at,
              active_session: activeSession
                ? {
                    instance_id: activeSession.software_instance_id,
                    last_sync: activeSession.last_sync
                  }
                : null
            };
          });

          return res.end(JSON.stringify(userList));
        }

        // 9. POST /api/admin/add-time (Admin Adds Amount in Rupees or Minutes)
        if (pathname === '/api/admin/add-time' && req.method === 'POST') {
          return parseBody(({ userId, amountRupees, minutes, addedBy }) => {
            let mins = 0;
            let rupees = 0;

            if (amountRupees !== undefined && amountRupees !== null && !isNaN(Number(amountRupees))) {
              rupees = Number(amountRupees);
              mins = Math.floor(rupees / 2.5); // Rate: ₹2.5 per minute
            } else if (minutes !== undefined && minutes !== null && !isNaN(Number(minutes))) {
              mins = parseInt(minutes, 10);
              rupees = mins * 2.5;
            }

            if (!userId || mins <= 0) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Valid userId and positive amount in rupees or minutes required' }));
            }

            const users = readJsonFile(USERS_DB_PATH, []);
            const user = users.find((u) => u.id === userId);
            if (!user) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'User not found' }));
            }

            const addedSeconds = mins * 60;
            const previousSeconds = user.remaining_seconds || 0;
            user.remaining_seconds = previousSeconds + addedSeconds;
            user.balanceRupees = Math.round((user.remaining_seconds / 60) * 2.5 * 100) / 100;
            user.allowedByAdmin = true;
            user.updated_at = new Date().toISOString();
            writeJsonFile(USERS_DB_PATH, users);
            syncCloudUser(user);

            // Append to audit log in license_history.json
            const history = readJsonFile(HISTORY_DB_PATH, []);
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
            writeJsonFile(HISTORY_DB_PATH, history);
            syncCloudHistory(logEntry);

            return res.end(
              JSON.stringify({
                success: true,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  remaining_seconds: user.remaining_seconds,
                  minutesRemaining: Math.floor(user.remaining_seconds / 60),
                  balanceRupees: user.balanceRupees,
                  formatted_time: formatSeconds(user.remaining_seconds)
                },
                added_minutes: mins,
                amount_rupees: rupees,
                previous_seconds: previousSeconds,
                new_seconds: user.remaining_seconds
              })
            );
          });
        }

        // Also alias POST /api/recharge for amountRupees
        if (pathname === '/api/recharge' && req.method === 'POST') {
          return parseBody(({ userId, amountRupees, addedBy }) => {
            const rupees = Number(amountRupees);
            const mins = Math.floor(rupees / 2.5);
            if (!userId || isNaN(rupees) || rupees <= 0 || mins <= 0) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Valid userId and positive amountRupees required' }));
            }
            const users = readJsonFile(USERS_DB_PATH, []);
            const user = users.find((u) => u.id === userId);
            if (!user) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'User not found' }));
            }
            const addedSeconds = mins * 60;
            user.remaining_seconds = (user.remaining_seconds || 0) + addedSeconds;
            user.balanceRupees = Math.round((user.remaining_seconds / 60) * 2.5 * 100) / 100;
            user.allowedByAdmin = true;
            user.updated_at = new Date().toISOString();
            writeJsonFile(USERS_DB_PATH, users);
            return res.end(JSON.stringify({ success: true, user, addedMinutes: mins, amountRupees: rupees }));
          });
        }

        // 10. GET /api/admin/history
        if (pathname === '/api/admin/history' && req.method === 'GET') {
          const history = readJsonFile(HISTORY_DB_PATH, []);
          return res.end(JSON.stringify(history));
        }

        // 11. POST /api/admin/toggle-access
        if (pathname === '/api/admin/toggle-access' && req.method === 'POST') {
          return parseBody(({ userId, allowed }) => {
            const users = readJsonFile(USERS_DB_PATH, []);
            const user = users.find((u) => u.id === userId);
            if (!user) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'User not found' }));
            }
            user.allowedByAdmin = allowed !== undefined ? allowed : !user.allowedByAdmin;
            user.updated_at = new Date().toISOString();
            writeJsonFile(USERS_DB_PATH, users);
            syncCloudUser(user);
            return res.end(JSON.stringify({ success: true, allowedByAdmin: user.allowedByAdmin }));
          });
        }

        // 12. POST /api/admin/reset-time
        if (pathname === '/api/admin/reset-time' && req.method === 'POST') {
          return parseBody(({ userId, reason, adminEmail }) => {
            const users = readJsonFile(USERS_DB_PATH, []);
            const user = users.find((u) => u.id === userId);
            if (!user) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'User not found' }));
            }
            const prevSecs = user.remaining_seconds || 0;
            user.remaining_seconds = 0;
            user.balanceRupees = 0;
            user.updated_at = new Date().toISOString();
            writeJsonFile(USERS_DB_PATH, users);
            syncCloudUser(user);

            // Log revocation in history
            const history = readJsonFile(HISTORY_DB_PATH, []);
            history.unshift({
              id: `lic_${Date.now()}`,
              user_id: user.id,
              user_email: user.email,
              amount_rupees: 0,
              minutes_added: -Math.floor(prevSecs / 60),
              action: 'RESET_ZERO',
              added_by: adminEmail || 'admin@ghostai.internal',
              created_at: new Date().toISOString()
            });
            writeJsonFile(HISTORY_DB_PATH, history);

            return res.end(JSON.stringify({ success: true, remaining_seconds: 0 }));
          });
        }

        // 13. POST /api/admin/create-candidate
        if (pathname === '/api/admin/create-candidate' && req.method === 'POST') {
          return parseBody(({ name, email, password, initialRupees, addedBy }) => {
            if (!name || !email || !password) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'Name, email, and password are required' }));
            }
            const users = readJsonFile(USERS_DB_PATH, []);
            const normEmail = email.trim().toLowerCase();
            if (users.some((u) => u.email.toLowerCase() === normEmail)) {
              res.statusCode = 409;
              return res.end(JSON.stringify({ error: 'An account with this email already exists' }));
            }

            const initialAmount = Number(initialRupees) || 0;
            const initialMinutes = Math.floor(initialAmount / 2.5);
            const initialSecs = initialMinutes * 60;

            const newCandidate = {
              id: `cand_${Date.now()}`,
              name: name.trim(),
              email: normEmail,
              password_hash: hashPassword(password),
              role: 'user',
              remaining_seconds: initialSecs,
              balanceRupees: initialAmount,
              allowedByAdmin: true,
              created_at: new Date().toISOString()
            };
            users.push(newCandidate);
            writeJsonFile(USERS_DB_PATH, users);
            syncCloudUser(newCandidate);

            if (initialSecs > 0) {
              const history = readJsonFile(HISTORY_DB_PATH, []);
              history.unshift({
                id: `lic_${Date.now()}`,
                user_id: newCandidate.id,
                user_email: newCandidate.email,
                amount_rupees: initialAmount,
                minutes_added: initialMinutes,
                added_by: addedBy || 'admin@ghostai.internal',
                created_at: new Date().toISOString()
              });
              writeJsonFile(HISTORY_DB_PATH, history);
            }

            const { password_hash, ...safeCandidate } = newCandidate;
            return res.end(JSON.stringify({ success: true, candidate: safeCandidate }));
          });
        }

        // 14. POST /api/admin/edit-candidate (Edit everything if entered wrong value)
        if (pathname === '/api/admin/edit-candidate' && req.method === 'POST') {
          return parseBody(({ userId, name, email, balanceRupees, remainingMinutes, remainingSeconds, allowedByAdmin, role, password, adminEmail }) => {
            if (!userId) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'User ID is required' }));
            }
            const users = readJsonFile(USERS_DB_PATH, []);
            const user = users.find((u) => u.id === userId);
            if (!user) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'User not found' }));
            }

            if (name && name.trim()) user.name = name.trim();
            if (email && email.trim()) {
              const normEmail = email.trim().toLowerCase();
              const existing = users.find((u) => u.id !== userId && u.email.toLowerCase() === normEmail);
              if (existing) {
                res.statusCode = 409;
                return res.end(JSON.stringify({ error: 'Another user is already registered with this email' }));
              }
              user.email = normEmail;
            }
            if (role) user.role = role;
            if (allowedByAdmin !== undefined) user.allowedByAdmin = Boolean(allowedByAdmin);
            if (password && password.trim()) {
              user.password_hash = hashPassword(password.trim());
            }

            // Direct balance/time edit (supports entering wrong value and correcting it!)
            if (remainingSeconds !== undefined && !isNaN(Number(remainingSeconds))) {
              user.remaining_seconds = Math.max(0, parseInt(remainingSeconds, 10));
              user.balanceRupees = Math.round((user.remaining_seconds / 60) * 2.5 * 100) / 100;
            } else if (remainingMinutes !== undefined && !isNaN(Number(remainingMinutes))) {
              const mins = Math.max(0, parseInt(remainingMinutes, 10));
              user.remaining_seconds = mins * 60;
              user.balanceRupees = Math.round(mins * 2.5 * 100) / 100;
            } else if (balanceRupees !== undefined && !isNaN(Number(balanceRupees))) {
              const rupees = Math.max(0, Number(balanceRupees));
              const mins = Math.floor(rupees / 2.5);
              user.remaining_seconds = mins * 60;
              user.balanceRupees = rupees;
            }

            user.updated_at = new Date().toISOString();
            writeJsonFile(USERS_DB_PATH, users);
            syncCloudUser(user);

            // Log edit adjustment in history
            const history = readJsonFile(HISTORY_DB_PATH, []);
            history.unshift({
              id: `edit_${Date.now()}`,
              user_id: user.id,
              user_email: user.email,
              amount_rupees: user.balanceRupees,
              minutes_added: Math.floor((user.remaining_seconds || 0) / 60),
              action: 'MANUAL_EDIT_CORRECTION',
              added_by: adminEmail || 'admin@ghostai.internal',
              created_at: new Date().toISOString()
            });
            writeJsonFile(HISTORY_DB_PATH, history);

            const { password_hash, ...safeUser } = user;
            return res.end(JSON.stringify({ success: true, user: safeUser, message: 'Candidate details updated successfully' }));
          });
        }

        // 15. POST /api/admin/delete-candidate
        if (pathname === '/api/admin/delete-candidate' && req.method === 'POST') {
          return parseBody(({ userId }) => {
            if (!userId) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'User ID is required' }));
            }
            let users = readJsonFile(USERS_DB_PATH, []);
            const user = users.find((u) => u.id === userId);
            if (!user) {
              res.statusCode = 404;
              return res.end(JSON.stringify({ error: 'User not found' }));
            }
            users = users.filter((u) => u.id !== userId);
            writeJsonFile(USERS_DB_PATH, users);
            syncCloudUser({ id: userId }, 'DELETE');

            // Clean active session
            let sessions = readJsonFile(SESSIONS_DB_PATH, []);
            sessions = sessions.filter((s) => s.user_id !== userId);
            writeJsonFile(SESSIONS_DB_PATH, sessions);

            return res.end(JSON.stringify({ success: true, message: `Candidate ${user.name} removed.` }));
          });
        }

        // 16. POST /api/admin/delete-history-entry
        if (pathname === '/api/admin/delete-history-entry' && req.method === 'POST') {
          return parseBody(({ historyId }) => {
            if (!historyId) {
              res.statusCode = 400;
              return res.end(JSON.stringify({ error: 'History ID required' }));
            }
            let history = readJsonFile(HISTORY_DB_PATH, []);
            history = history.filter((h) => h.id !== historyId);
            writeJsonFile(HISTORY_DB_PATH, history);
            return res.end(JSON.stringify({ success: true }));
          });
        }

        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: {
    host: '0.0.0.0',
    port: 5173
  }
});
