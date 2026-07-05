// 30-Day C++ Sprint — Main Application Logic
// Vanilla JS, ES Modules, no dependencies

import { curriculumData } from './curriculum-data.js';

// State
let currentDay = curriculumData.currentDay;
let completedDays = new Set();
let activePanelDay = null;

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

// Initialize
document.addEventListener('DOMContentLoaded', init);

async function init() {
  // Load progress from KV
  await loadProgress();
  
  // Render progress bars
  renderProgressBars();
  
  // Attach event listeners
  attachTableListeners();
  attachCardListeners();
  attachPanelListeners();
  attachMarkCompleteListeners();
  
  // Handle keyboard navigation
  document.addEventListener('keydown', handleGlobalKeydown);
  
  // Sync progress to KV on changes
  window.addEventListener('beforeunload', saveProgress);
}

// ============================================================================
// Progress Persistence (Cloudflare Workers KV)
// ============================================================================

async function loadProgress() {
  try {
    const response = await fetch('/api/progress');
    if (response.ok) {
      const data = await response.json();
      if (data.completed) {
        completedDays = new Set(data.completed);
      }
    }
  } catch (e) {
    console.warn('Progress load failed, using localStorage fallback:', e);
    // Fallback to localStorage
    const stored = localStorage.getItem('cpp-sprint-progress');
    if (stored) {
      try { completedDays = new Set(JSON.parse(stored)); } catch {}
    }
  }
  
  // Update UI for completed days
  updateCompletedDayStyles();
}

async function saveProgress() {
  const data = { completed: Array.from(completedDays).sort((a, b) => a - b) };
  
  try {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  } catch (e) {
    console.warn('Progress save failed, using localStorage fallback:', e);
    localStorage.setItem('cpp-sprint-progress', JSON.stringify(data.completed));
  }
}

function updateCompletedDayStyles() {
  // Table rows
  document.querySelectorAll('.curriculum-row').forEach(row => {
    const day = parseInt(row.dataset.day, 10);
    if (completedDays.has(day) && day !== currentDay) {
      row.dataset.status = 'done';
      const badge = row.querySelector('.status-badge');
      if (badge) {
        badge.className = 'status-badge status-badge--done';
        badge.textContent = '✓';
        badge.setAttribute('aria-label', 'Complete');
      }
    }
  });
  
  // Cards
  document.querySelectorAll('.curriculum-card').forEach(card => {
    const day = parseInt(card.dataset.day, 10);
    if (completedDays.has(day) && day !== currentDay) {
      card.dataset.status = 'done';
      const badge = card.querySelector('.status-badge');
      if (badge) {
        badge.className = 'status-badge status-badge--done';
        badge.textContent = '✓';
        badge.setAttribute('aria-label', 'Complete');
      }
      const btn = card.querySelector('.mark-complete-btn');
      if (btn) {
        btn.disabled = true;
        btn.textContent = '✓ Marked Complete';
      }
    }
  });
}

// ============================================================================
// Progress Bar Rendering
// ============================================================================

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
    if (bar.hasAttribute('aria-valuenow')) {
      bar.setAttribute('aria-valuenow', currentDay);
    }
  });
  
  // Update badge
  if (currentDayBadge) {
    currentDayBadge.textContent = `Day ${currentDay} of 30`;
  }
  
  // Update progress labels
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
    row.addEventListener('click', () => openPanel(parseInt(row.dataset.day, 10)));
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openPanel(parseInt(row.dataset.day, 10));
      }
    });
  });
  
  // Keyboard navigation within table
  curriculumTable.addEventListener('keydown', (e) => {
    const rows = Array.from(curriculumTable.querySelectorAll('.curriculum-row'));
    const focused = document.activeElement;
    const idx = rows.indexOf(focused);
    
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
      // Let details handle toggle, but track for analytics
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
  // Force reflow for animation
  slidePanel.getBoundingClientRect();
  slidePanel.setAttribute('open', '');
  slidePanelOverlay.setAttribute('open', '');
  
  // Focus management
  slidePanelClose.focus();
  document.body.style.overflow = 'hidden';
  
  // Trap focus
  trapFocus(slidePanel);
}

function closePanel() {
  slidePanel.removeAttribute('open');
  slidePanelOverlay.removeAttribute('open');
  document.body.style.overflow = '';
  
  // Return focus to triggering element
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
  
  // Attach checkbox listeners
  slidePanelBody.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', () => {
      // Could track per-requirement completion if needed
    });
  });
  
  // Update mark complete button in panel footer
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
  
  // Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && slidePanel.hasAttribute('open')) {
      closePanel();
    }
  });
}

// Focus trap for modal
function trapFocus(element) {
  const focusable = element.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  
  element.addEventListener('keydown', function trap(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });
}

// ============================================================================
// Global Keyboard
// ============================================================================

function handleGlobalKeydown(e) {
  // Number keys 1-9 jump to day (when not in input)
  if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
    const num = parseInt(e.key, 10);
    if (num >= 1 && num <= 9) {
      openPanel(num);
    }
  }
}

// ============================================================================
// Completion Toggle
// ============================================================================

function toggleComplete(day) {
  if (completedDays.has(day)) {
    completedDays.delete(day);
  } else {
    completedDays.add(day);
  }
  saveProgress();
  updateCompletedDayStyles();
  
  // If panel is open for this day, re-render
  if (activePanelDay === day) {
    const dayData = curriculumData.days.find(d => d.day === day);
    if (dayData) renderPanel(dayData);
  }
}

// Export for debugging
window.cppSprint = { curriculumData, completedDays, currentDay };