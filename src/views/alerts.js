// ================================================================
// ALERTS VIEW
// ================================================================
import { alerts } from '../data/mock-data.js';

export function renderAlerts(container) {
    container.innerHTML = `
    <div class="page-header">
      <span class="page-tag tag-gold">Deal Alerts</span>
      <h1 class="page-title">Your <span class="hl">Price Alerts</span></h1>
      <p class="page-desc">Set price thresholds for your routes. When our AI detects a deal below your target, you'll get an instant WhatsApp notification.</p>
    </div>

    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;flex-wrap:wrap;gap:1rem;">
      <div style="display:flex;gap:0.7rem;">
        <div class="chip chip-green">● ${alerts.filter(a => a.status === 'active').length} Active</div>
        <div class="chip chip-gold">⏸ ${alerts.filter(a => a.status === 'paused').length} Paused</div>
      </div>
      <button class="btn btn-primary" id="newAlertBtn">+ New Alert</button>
    </div>

    <div class="alerts-list" id="alertsList"></div>

    <div id="newAlertForm" style="display:none;margin-top:2rem;">
      <div class="card" style="padding:1.5rem;">
        <h3 style="margin-bottom:1rem;font-size:1rem;">Create New Price Alert</h3>
        <div class="grid-2" style="gap:1rem;">
          <div class="input-group">
            <label>From</label>
            <input class="input-field" type="text" placeholder="Airport code (e.g., JFK)">
          </div>
          <div class="input-group">
            <label>To</label>
            <input class="input-field" type="text" placeholder="Airport code (e.g., LHR)">
          </div>
          <div class="input-group">
            <label>Depart Date</label>
            <input class="input-field" type="date">
          </div>
          <div class="input-group">
            <label>Return Date</label>
            <input class="input-field" type="date">
          </div>
          <div class="input-group">
            <label>Price Threshold ($)</label>
            <input class="input-field" type="number" placeholder="e.g., 500" value="500">
          </div>
          <div class="input-group">
            <label>Notify Via</label>
            <select class="input-field">
              <option>WhatsApp</option>
              <option>Telegram</option>
              <option>Email</option>
              <option>All Channels</option>
            </select>
          </div>
        </div>
        <div style="display:flex;gap:0.7rem;margin-top:1rem;">
          <button class="btn btn-primary" id="saveAlertBtn">Save Alert</button>
          <button class="btn btn-secondary" id="cancelAlertBtn">Cancel</button>
        </div>
      </div>
    </div>

    <div class="section-block" style="margin-top:2rem;">
      <div class="ai-insight">
        <div class="ai-icon">🤖</div>
        <div class="ai-text">
          <h4>Alert Summary</h4>
          <p>3 of your 5 alerts are currently below threshold — great time to book! JFK→LHR is at $347 (threshold $400), LAX→NRT at $489 (threshold $550), and BOS→MUC at $398 (threshold $450). I'll send you detailed deal cards via WhatsApp if you'd like to proceed.</p>
        </div>
      </div>
    </div>
  `;

    const alertsList = container.querySelector('#alertsList');
    const newAlertForm = container.querySelector('#newAlertForm');

    function renderAlertsList() {
        alertsList.innerHTML = '';
        alerts.forEach((alert, i) => {
            const belowThreshold = alert.lastPrice < alert.threshold;
            const item = document.createElement('div');
            item.className = 'alert-item';
            item.style.animation = `fadeInView 0.3s ease ${i * 0.06}s both`;
            item.innerHTML = `
        <div class="alert-status-dot ${alert.status}"></div>
        <div class="alert-info">
          <div class="alert-route-name">${alert.from} → ${alert.to}</div>
          <div class="alert-details">
            📅 ${alert.dates} · 
            ${belowThreshold ? `<span style="color:var(--accent-green)">✓ Below threshold</span>` : `<span style="color:var(--text-dim)">Above threshold</span>`} · 
            Last check: ${alert.lastCheck}
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-family:'Space Mono',monospace;font-size:0.85rem;font-weight:700;color:${belowThreshold ? 'var(--accent-green)' : 'var(--text-primary)'};">$${alert.lastPrice}</div>
          <div class="alert-threshold">Target: $${alert.threshold}</div>
        </div>
        <div class="alert-actions">
          <button class="alert-action-btn" title="${alert.status === 'active' ? 'Pause' : 'Resume'}">${alert.status === 'active' ? '⏸' : '▶'}</button>
          <button class="alert-action-btn" title="Edit">✏️</button>
          <button class="alert-action-btn" title="Delete" style="color:var(--accent-pink);">🗑</button>
        </div>
      `;
            alertsList.appendChild(item);
        });
    }

    renderAlertsList();

    // Toggle new alert form
    container.querySelector('#newAlertBtn').addEventListener('click', () => {
        newAlertForm.style.display = newAlertForm.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#cancelAlertBtn').addEventListener('click', () => {
        newAlertForm.style.display = 'none';
    });
    container.querySelector('#saveAlertBtn').addEventListener('click', () => {
        newAlertForm.style.display = 'none';
        // Show a brief success feedback
        const btn = container.querySelector('#saveAlertBtn');
        btn.textContent = '✓ Saved!';
        btn.style.background = 'var(--accent-green)';
        setTimeout(() => { btn.textContent = 'Save Alert'; btn.style.background = ''; }, 1500);
    });
}
