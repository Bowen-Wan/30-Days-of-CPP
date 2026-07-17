// 30-Day C++ Sprint — Main Application Logic
// Vanilla JS, ES Modules, no dependencies

import { curriculumData } from './curriculum-data.js';

// Global config from Eleventy
const GOOGLE_CLIENT_ID = window.GOOGLE_CLIENT_ID || '';
const ADMIN_EMAIL = window.ADMIN_EMAIL || ''; // set via Eleventy global data

// State
let currentDay = curriculumData.currentDay;
let completedDays = new Set();
let activePanelDay = null;
let currentUser = null; // { sub, email, name, picture }

// DOM Elements
const curriculumTable = document.getElementById('curriculumTable');
const curriculumCards = document.getElementById('curriculumCards');
const slidePanel = document.getElementById('slidePanel');
const slidePanelOverlay = document.getElementById('slidePanelOverlay');
const slidePanelBody = document.getElementById('slidePanelBody');
const slidePanelClose = document.getElementById('slidePanelClose');
const slidePanelPrev = document.getElementById('slidePanelPrev');
const slidePanelNext = document.getElementById('slidePanelNext');
const heroProgressBar = document.getElementById('heroProgressBar');
const sectionProgressBar = document.getElementById('sectionProgressBar');
const sectionProgressBarMobile = document.getElementById('sectionProgressBarMobile');
const currentDayBadge = document.getElementById('currentDayBadge');
const authControls = document.getElementById('auth-controls');
const gsiBtnContainer = document.getElementById('gsi-btn');
const userInfoEl = document.getElementById('user-info');

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  // Load any existing user session
  loadUserSession();

  // Initialize Google Sign-In
  initGoogleSignIn();

  // Load progress for current user (or anonymous)
  await loadProgress();

  // Render progress bars
  renderProgressBars();

  // Attach event listeners
  attachTableListeners();
  attachCardListeners();
  attachPanelListeners();
  attachMarkCompleteListeners();

  // Keyboard navigation
  document.addEventListener('keydown', handleGlobalKeydown);

  // Sync progress on changes
  window.addEventListener('beforeunload', saveProgress);

  // Update auth UI
  updateAuthUI();
}

// ============================================================================
// Google Sign-In
// ============================================================================

function initGoogleSignIn() {
  if (!GOOGLE_CLIENT_ID) {
    console.warn('Google Client ID not configured; auth disabled');
    gsiBtnContainer.innerHTML = '<span style="color:var(--fg-subtle);font-size:0.75rem;">Auth not configured</span>';
    return;
  }

  // Wait for GIS library
  if (window.google && window.google.accounts) {
    renderSignInButton();
  } else {
    // Wait for library load
    const check = setInterval(() => {
      if (window.google && window.google.accounts) {
        clearInterval(check);
        renderSignInButton();
      }
    }, 100);
  }
}

function renderSignInButton() {
  if (currentUser) {
    // Signed in: show user info and sign-out button
    gsiBtnContainer.innerHTML = '';
    userInfoEl.style.display = 'inline';
    userInfoEl.textContent = `${currentUser.name} (${currentUser.email})`;
    const signOutBtn = document.createElement('button');
    signOutBtn.className = 'btn btn--ghost btn--sm';
    signOutBtn.textContent = 'Sign out';
    signOutBtn.addEventListener('click', signOut);
    gsiBtnContainer.appendChild(signOutBtn);
    // Show admin link if admin
    maybeShowAdminLink();
    return;
  }

  // Not signed in: render Google Sign-In button
  gsiBtnContainer.innerHTML = '';
  window.google.accounts.id.renderButton(gsiBtnContainer, {
    theme: 'outline',
    size: 'large',
    width: 200,
    text: 'signin_with',
    logo_alignment: 'left'
  });

  // Also listen for credential response
  window.google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,
    callback: handleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true
  });
}

function handleCredentialResponse(response) {
  // Decode JWT to get user info
  const payload = parseJwt(response.credential);
  currentUser = {
    sub: payload.sub,
    email: payload.email,
    name: payload.name,
    picture: payload.picture
  };
  // Persist user session
  localStorage.setItem('googleUser', JSON.stringify(currentUser));
  updateAuthUI();
  // Load this user's progress
  loadProgress();
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  return JSON.parse(jsonPayload);
}

function loadUserSession() {
  const stored = localStorage.getItem('googleUser');
  if (stored) {
    try {
      currentUser = JSON.parse(stored);
    } catch (e) {
      localStorage.removeItem('googleUser');
    }
  }
}

function signOut() {
  // Revoke Google session
  if (window.google && window.google.accounts) {
    window.google.accounts.id.disableAutoSelect();
  }
  currentUser = null;
  localStorage.removeItem('googleUser');
  completedDays.clear();
  updateAuthUI();
  // Reset UI progress
  updateCompletedDayStyles();
  renderProgressBars();
}

function updateAuthUI() {
  renderSignInButton();
}

// ============================================================================
// Progress Persistence (per user)
// ============================================================================

function getProgressStorageKey() {
  return currentUser ? `cpp-sprint-progress-${currentUser.sub}` : 'cpp-sprint-progress-anon';
}

async function loadProgress() {
  const key = getProgressStorageKey();
  try {
    const response = await fetch('/api/progress?user=' + encodeURIComponent(currentUser?.sub || 'anon'));
    if (response.ok) {
      const data = await response.json();
      if (data.completed) {
        completedDays = new Set(data.completed);
      }
    }
  } catch (e) {
    // Fallback to localStorage
    const stored = localStorage.getItem('cpp-sprint-progress-' + (currentUser?.sub || 'anon'));
    if (stored) {
      try { completedDays = new Set(JSON.parse(stored)); } catch {}
    }
  }
  updateCompletedDayStyles();
}

async function saveProgress() {
  const key = getProgressStorageKey();
  const data = { completed: Array.from(completedDays).sort((a, b) => a - b) };
  try {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: currentUser?.sub || 'anon', completed: data.completed })
    });
  } catch (e) {
    localStorage.setItem('cpp-sprint-progress-' + (currentUser?.sub || 'anon'), JSON.stringify(data.completed));
  }
}

// ============================================================================
// UI Updates
// ============================================================================

function updateCompletedDayStyles() {
  // Table rows
  document.querySelectorAll('.curriculum-row').forEach(row => {
    const day = parseInt(row.dataset.day, 10);
    const isDone = completedDays.has(day) && day !== currentDay;
    row.dataset.status = isDone ? 'done' : (day === currentDay ? 'current' : 'pending');
    const badge = row.querySelector('.status-badge');
    if (badge) {
      badge.className = `status-badge status-badge--${isDone ? 'done' : (day === currentDay ? 'current' : 'pending')}`;
      badge.textContent = isDone ? '✓' : (day === currentDay ? '●' : '○');
      badge.setAttribute('aria-label', isDone ? 'Complete' : (day === currentDay ? 'In Progress' : 'Pending'));
    }
    // Update checkbox
    const cb = row.querySelector('.status-checkbox');
    if (cb) {
      cb.checked = completedDays.has(day);
      cb.disabled = completedDays.has(day) || day < currentDay;
    }
  });

  // Cards
  document.querySelectorAll('.curriculum-card').forEach(card => {
    const day = parseInt(card.dataset.day, 10);
    const isDone = completedDays.has(day) && day !== currentDay;
    card.dataset.status = isDone ? 'done' : (day === currentDay ? 'current' : 'pending');
    const badge = card.querySelector('.status-badge');
    if (badge) {
      badge.className = `status-badge status-badge--${isDone ? 'done' : (day === currentDay ? 'current' : 'pending')}`;
      badge.textContent = isDone ? '✓' : (day === currentDay ? '●' : '○');
      badge.setAttribute('aria-label', isDone ? 'Complete' : (day === currentDay ? 'In Progress' : 'Pending'));
    }
    const btn = card.querySelector('.mark-complete-btn');
    if (btn) {
      btn.disabled = completedDays.has(day);
      btn.textContent = completedDays.has(day) ? '✓ Marked Complete' : 'Mark Complete';
    }
  });
}

function renderProgressBars() {
  const bars = [heroProgressBar, sectionProgressBar, sectionProgressBarMobile];
  bars.forEach(bar => {
    if (!bar) return;
    bar.innerHTML = '';
    for (let i = 1; i <= 30; i++) {
      const seg = document.createElement('span');
      seg.className = 'progress-segment';
      seg.title = `Day ${i}: ${curriculumData.days[i-1]?.project || '—'}`;
      if (i < currentDay) seg.classList.add('progress-segment--done');
      else if (i === currentDay) seg.classList.add('progress-segment--current');
      else seg.classList.add('progress-segment--pending');
      bar.appendChild(seg);
    }
    if (bar.hasAttribute('aria-valuenow')) bar.setAttribute('aria-valuenow', currentDay);
  });
  if (currentDayBadge) currentDayBadge.textContent = `Day ${currentDay} of 30`;
  document.querySelectorAll('.progress-label').forEach(label => {
    label.textContent = `${currentDay - 1} complete · Day ${currentDay} current · ${30 - currentDay} remaining`;
  });
}

// ============================================================================
// Table Listeners (Desktop)
// ============================================================================

function attachTableListeners() {
  if (!curriculumTable) return;
  curriculumTable.querySelectorAll('.curriculum-row').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('.status-checkbox')) return;
      openPanel(parseInt(row.dataset.day, 10));
    });
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPanel(parseInt(row.dataset.day, 10));
      }
    });
  });
  curriculumTable.querySelectorAll('.status-checkbox').forEach(cb => {
    cb.addEventListener('change', (e) => {
      e.stopPropagation();
      const day = parseInt(cb.dataset.day, 10);
      toggleComplete(day);
      cb.disabled = completedDays.has(day);
    });
  });
  curriculumTable.addEventListener('keydown', (e) => {
    const rows = Array.from(curriculumTable.querySelectorAll('.curriculum-row'));
    const idx = rows.indexOf(document.activeElement);
    if (idx === -1) return;
    let newIdx = idx;
    if (e.key === 'ArrowDown') newIdx = Math.min(idx + 1, rows.length - 1);
    else if (e.key === 'ArrowUp') newIdx = Math.max(idx - 1, 0);
    else if (e.key === 'Home') newIdx = 0;
    else if (e.key === 'End') newIdx = rows.length - 1;
    else return;
    e.preventDefault();
    rows[newIdx].focus();
  });
}

// ============================================================================
// Card Listeners (Mobile)
// ============================================================================

function attachCardListeners() {
  if (!curriculumCards) return;
  curriculumCards.querySelectorAll('.curriculum-card summary').forEach(summary => {
    summary.addEventListener('click', (e) => {
      const card = summary.closest('.curriculum-card');
      const day = parseInt(card.dataset.day, 10);
      console.debug('Card toggled:', day);
    });
  });
}

function attachMarkCompleteListeners() {
  document.querySelectorAll('.mark-complete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const day = parseInt(btn.dataset.day, 10);
      toggleComplete(day);
    });
  });
}

// ============================================================================
// Slide Panel
// ============================================================================

function openPanel(day) {
  const dayData = curriculumData.days.find(d => d.day === day);
  if (!dayData) return;
  activePanelDay = day;
  renderPanel(dayData);
  updatePanelNav();
  slidePanel.hidden = false;
  slidePanelOverlay.hidden = false;
  slidePanel.getBoundingClientRect();
  slidePanel.setAttribute('open', '');
  slidePanelOverlay.setAttribute('open', '');
  slidePanelClose.focus();
  document.body.style.overflow = 'hidden';
  trapFocus(slidePanel);
}

function closePanel() {
  slidePanel.removeAttribute('open');
  slidePanelOverlay.removeAttribute('open');
  document.body.style.overflow = '';
  const trigger = document.querySelector(`.curriculum-row[data-day="${activePanelDay}"], .curriculum-card[data-day="${activePanelDay}"] summary`);
  trigger?.focus();
  activePanelDay = null;
}

function renderPanel(dayData) {
  const isDone = completedDays.has(dayData.day) || dayData.status === 'done';
  const isCurrent = dayData.day === currentDay;
  let statusClass = 'badge--pending';
  let statusLabel = 'Pending';
  if (isDone) { statusClass = 'badge--ok'; statusLabel = 'Complete'; }
  else if (isCurrent) { statusClass = 'badge--warn'; statusLabel = 'In Progress'; }
  else if (dayData.status === 'missed') { statusClass = 'badge--err'; statusLabel = 'Missed'; }

  slidePanelBody.innerHTML = `
    <div class="day-detail-meta">
      <span class="badge ${statusClass}">${statusLabel}</span>
      <span class="badge badge--pending">${dayData.concept}</span>
    </div>
    <section class="day-detail-section">
      <h4>Objective</h4>
      <p>${dayData.description || 'No description provided.'}</p>
    </section>
    ${dayData.requirements && dayData.requirements.length ? `
    <section class="day-detail-section">
      <h4>Requirements</h4>
      <ul class="day-detail-requirements">
        ${dayData.requirements.map((req, i) => `
          <li>
            <input type="checkbox" id="panel-req-${dayData.day}-${i}" ${completedDays.has(dayData.day) ? 'checked' : ''} data-day="${dayData.day}" data-req-index="${i}">
            <label for="panel-req-${dayData.day}-${i}">${req}</label>
          </li>
        `).join('')}
      </ul>
    </section>
    ` : ''}
    ${dayData.extraChallenge ? `
    <section class="day-detail-section">
      <h4>Extra Challenge</h4>
      <p>${dayData.extraChallenge}</p>
    </section>
    ` : ''}
    ${dayData.commit ? `
    <section class="day-detail-section">
      <h4>Commit</h4>
      <a href="https://github.com/Bowen-Wan/30-Days-of-CPP/commit/${dayData.commit}" target="_blank" rel="noopener" class="day-detail-commit">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
        View commit ${dayData.commit.slice(0, 7)}
      </a>
    </section>
    ` : '<section class="day-detail-section"><h4>Commit</h4><p style="color: var(--fg-subtle);">No commit pushed yet</p></section>'}
  `;
  slidePanelBody.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {});
  });
  const markBtn = document.getElementById('slidePanelMarkComplete');
  if (markBtn) {
    markBtn.textContent = isDone ? '✓ Marked Complete' : 'Mark Complete';
    markBtn.disabled = isDone;
    markBtn.onclick = () => {
      toggleComplete(dayData.day);
      renderPanel(dayData);
      updatePanelNav();
    };
  }
}

function updatePanelNav() {
  const days = curriculumData.days.map(d => d.day).sort((a, b) => a - b);
  const idx = days.indexOf(activePanelDay);
  slidePanelPrev.disabled = idx <= 0;
  slidePanelNext.disabled = idx >= days.length - 1;
  slidePanelPrev.onclick = () => idx > 0 && openPanel(days[idx - 1]);
  slidePanelNext.onclick = () => idx < days.length - 1 && openPanel(days[idx + 1]);
}

function attachPanelListeners() {
  slidePanelClose?.addEventListener('click', closePanel);
  slidePanelOverlay?.addEventListener('click', closePanel);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && slidePanel.hasAttribute('open')) closePanel();
  });
}

function trapFocus(element) {
  const focusable = element.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  element.addEventListener('keydown', function trap(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
}

// ============================================================================
// Global Keyboard
// ============================================================================
function handleGlobalKeydown(e) {
  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= 9) openPanel(num);
  }
}

// ============================================================================
// Completion Toggle
// ============================================================================
function toggleComplete(day) {
  if (completedDays.has(day)) completedDays.delete(day);
  else completedDays.add(day);
  saveProgress();
  updateCompletedDayStyles();
  if (activePanelDay === day) {
    const dayData = curriculumData.days.find(d => d.day === day);
    if (dayData) renderPanel(dayData);
  }
}

// ============================================================================
// Admin Link Visibility
// ============================================================================
function maybeShowAdminLink() {
  if (ADMIN_EMAIL && currentUser && currentUser.email === ADMIN_EMAIL) {
    const adminLink = document.querySelector('.admin-link');
    if (adminLink) adminLink.style.display = 'inline';
  }
}

// Export for debugging
window.cppSprint = { curriculumData, completedDays, currentDay, currentUser };

// Initialize Google Sign-In when library loads
if (typeof window.google !== 'undefined' && window.google.accounts) {
  // library already loaded
  initGoogleSignIn();
} else {
  // listen for load
  const originalOnLoad = window.onload;
  window.onload = () => {
    if (originalOnLoad) originalOnLoad();
    initGoogleSignIn();
  };
}