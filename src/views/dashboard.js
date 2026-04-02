// ================================================================
// DASHBOARD VIEW
// ================================================================
import { liveDeals } from '../data/mock-data.js';

function getScoreClass(score) {
  if (score >= 90) return 'great';
  if (score >= 80) return 'good';
  if (score >= 65) return 'fair';
  return 'poor';
}

function getScoreColor(score) {
  if (score >= 90) return '#2ed573';
  if (score >= 80) return '#06d6a0';
  if (score >= 65) return '#ffd166';
  return '#ff4757';
}

function getTrendIcon(trend) {
  if (trend === 'down') return '📉';
  if (trend === 'up') return '📈';
  return '➡️';
}

export function renderDashboard(container) {
  container.innerHTML = `
    <div class="page-header" style="position:relative;">
      <div class="glow glow-cyan" style="width:400px;height:400px;top:-100px;right:-100px;position:absolute;"></div>
      <span class="page-tag tag-cyan">Dashboard</span>
      <h1 class="page-title">Never Overpay for a <span class="hl">Flight</span> Again.</h1>
      <p class="page-desc">Your AI agent is monitoring 4+ booking sites 24/7. Here's what's happening right now.</p>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-label">Monitoring</div>
        <div class="stat-value">24/7</div>
        <div class="stat-sub">Autonomous scans every 30 min</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Sites Compared</div>
        <div class="stat-value">4+</div>
        <div class="stat-sub">Kayak · Google · Skyscanner · Amadeus</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active Alerts</div>
        <div class="stat-value">5</div>
        <div class="stat-sub">3 deals below threshold</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Saved</div>
        <div class="stat-value">$704</div>
        <div class="stat-sub">Across 3 bookings this month</div>
      </div>
    </div>

    <div class="section-block">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem;">
        <h2 style="font-size:1.2rem;font-weight:700;">🔥 Live Deals</h2>
        <span style="font-size:0.75rem;color:var(--text-dim);font-family:'Space Mono',monospace;">Updated 2 min ago</span>
      </div>
      <div class="dash-deals" id="dashDeals"></div>
    </div>

    <div class="section-block">
      <h2 style="font-size:1.2rem;font-weight:700;margin-bottom:1rem;">⚡ Quick Search</h2>
      <div class="search-form">
        <div class="search-row">
          <div class="input-group">
            <label>From</label>
            <input class="input-field" type="text" placeholder="JFK" value="JFK">
          </div>
          <div class="input-group">
            <label>To</label>
            <input class="input-field" type="text" placeholder="LHR" value="LHR">
          </div>
          <div class="input-group">
            <label>Depart</label>
            <input class="input-field" type="date" value="2026-05-15">
          </div>
          <div class="input-group">
            <label>Return</label>
            <input class="input-field" type="date" value="2026-05-22">
          </div>
          <button class="btn btn-primary" onclick="document.querySelector('[data-view=search]').click()">Search ✈</button>
        </div>
      </div>
    </div>

    <div class="ai-insight">
      <div class="ai-icon">🤖</div>
      <div class="ai-text">
        <h4>AI Insight</h4>
        <p>Based on 90 days of data, JFK → LHR fares are at their lowest point this quarter. The current $347 price is in the bottom 5th percentile. I recommend booking within the next 24-48 hours before the typical spring rebound. Three of your five alerts are currently below threshold — check the Alerts tab for details.</p>
      </div>
    </div>
  `;

  const dealsContainer = container.querySelector('#dashDeals');
  liveDeals.forEach((deal, i) => {
    const card = document.createElement('div');
    card.className = 'deal-card';
    card.style.animationDelay = `${i * 0.1}s`;
    card.innerHTML = `
      <div class="deal-header">
        <div>
          <div class="deal-route">${deal.from} <span class="arrow">→</span> ${deal.to}</div>
          <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.2rem;">${deal.airline.name}</div>
        </div>
        <div style="text-align:right;">
          <div class="deal-price">$${deal.price}</div>
          ${deal.savings > 80 ? `<div class="chip chip-green" style="margin-top:0.3rem;font-size:0.68rem;">Save $${deal.savings}</div>` : ''}
        </div>
      </div>
      <div class="deal-meta">
        <span>⏱ ${deal.duration}</span>
        <span>✈ ${deal.stops}</span>
        <span>${getTrendIcon(deal.trend)} ${deal.trend === 'down' ? 'Dropping' : deal.trend === 'up' ? 'Rising' : 'Stable'}</span>
      </div>
      <div class="deal-footer">
        <div class="deal-source">via <strong>${deal.source}</strong></div>
        <div class="deal-score ${getScoreClass(deal.score)}">
          <span style="font-size:0.68rem;color:var(--text-muted);font-family:'Outfit',sans-serif;font-weight:400;">Deal Score</span>
          <div class="score-bar"><div class="score-bar-fill" style="width:${deal.score}%;background:${getScoreColor(deal.score)}"></div></div>
          ${deal.score}/100
        </div>
      </div>
    `;
    dealsContainer.appendChild(card);
  });
}
