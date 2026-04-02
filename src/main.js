// ================================================================
// MAIN — Flight Tracker AI Agent
// ================================================================
import './index.css';
import { renderDashboard } from './views/dashboard.js';
import { renderSearch } from './views/search.js';
import { renderTrends } from './views/trends.js';
import { renderAlerts } from './views/alerts.js';
import { renderBooking } from './views/booking.js';
import { renderVault } from './views/vault.js';
import { renderChat } from './views/chat.js';

// ---- View Registry ----
const views = {
  dashboard: { render: renderDashboard, initialized: false },
  search: { render: renderSearch, initialized: false },
  trends: { render: renderTrends, initialized: false },
  alerts: { render: renderAlerts, initialized: false },
  booking: { render: renderBooking, initialized: false },
  vault: { render: renderVault, initialized: false },
  chat: { render: renderChat, initialized: false },
};

let currentView = 'dashboard';

// ---- Navigation ----
function switchView(viewName) {
  if (!views[viewName]) return;

  // Update active view
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  const viewEl = document.getElementById(`view-${viewName}`);
  if (viewEl) {
    viewEl.classList.add('active');
    // Re-render view each time for fresh state
    views[viewName].render(viewEl);
    views[viewName].initialized = true;
  }

  // Update nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.querySelector(`[data-view="${viewName}"]`);
  if (navItem) navItem.classList.add('active');

  currentView = viewName;

  // Close mobile sidebar
  const sidebar = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  sidebar?.classList.remove('open');
  hamburger?.classList.remove('open');
}

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
  // Nav click handlers
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      switchView(item.dataset.view);
    });
  });

  // Mobile hamburger
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  hamburger?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    hamburger.classList.toggle('open');
  });

  // Close sidebar on mobile when clicking outside
  document.getElementById('mainContent')?.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      sidebar?.classList.remove('open');
      hamburger?.classList.remove('open');
    }
  });

  // Initialize dashboard
  switchView('dashboard');
});

// Remove default Vite content
const existingCounter = document.querySelector('#counter');
if (existingCounter) existingCounter.remove();
const existingApp = document.querySelector('#app');
if (existingApp && existingApp.children.length === 0) existingApp.remove();
