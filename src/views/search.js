// ================================================================
// SEARCH VIEW — Real-time Google Flights via SerpApi
// ================================================================
import { searchResults as mockResults } from '../data/mock-data.js';
import { searchFlights, checkHealth, travelClassMap } from '../api.js';

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

// Estimate a deal score based on price relative to other results
function calculateDealScore(price, allPrices) {
  if (!allPrices.length) return 50;
  const min = Math.min(...allPrices);
  const max = Math.max(...allPrices);
  if (max === min) return 85;
  const normalized = 1 - (price - min) / (max - min);
  return Math.round(60 + normalized * 35); // 60-95 range
}

export function renderSearch(container) {
  // Default dates: 2 weeks out
  const today = new Date();
  const depart = new Date(today);
  depart.setDate(today.getDate() + 14);
  const ret = new Date(depart);
  ret.setDate(depart.getDate() + 7);

  const departStr = depart.toISOString().split('T')[0];
  const returnStr = ret.toISOString().split('T')[0];

  container.innerHTML = `
    <div class="page-header">
      <span class="page-tag tag-blue">Flight Search</span>
      <h1 class="page-title">Search <span class="hl">Real Flights</span></h1>
      <p class="page-desc">Live results from Google Flights via SerpApi. Enter your route and dates to search across airlines in real time.</p>
      <div id="apiStatus" style="margin-top:0.5rem;"></div>
    </div>

    <div class="search-form">
      <div class="search-row">
        <div class="input-group">
          <label>From</label>
          <input class="input-field" type="text" id="searchFrom" placeholder="Airport code" value="JFK">
        </div>
        <div class="input-group">
          <label>To</label>
          <input class="input-field" type="text" id="searchTo" placeholder="Airport code" value="LHR">
        </div>
        <div class="input-group">
          <label>Depart</label>
          <input class="input-field" type="date" id="searchDepart" value="${departStr}">
        </div>
        <div class="input-group">
          <label>Return</label>
          <input class="input-field" type="date" id="searchReturn" value="${returnStr}">
        </div>
        <button class="btn btn-primary" id="searchBtn">Search ✈</button>
      </div>
      <div style="margin-top:1rem;display:flex;gap:0.7rem;flex-wrap:wrap;">
        <div class="input-group" style="margin:0;min-width:120px;">
          <select class="input-field" id="searchClass" style="padding:0.5rem 0.8rem;font-size:0.8rem;">
            <option>Economy</option>
            <option>Premium Economy</option>
            <option>Business</option>
            <option>First Class</option>
          </select>
        </div>
        <div class="input-group" style="margin:0;min-width:120px;">
          <select class="input-field" id="searchAdults" style="padding:0.5rem 0.8rem;font-size:0.8rem;">
            <option value="1">1 Passenger</option>
            <option value="2">2 Passengers</option>
            <option value="3">3 Passengers</option>
            <option value="4">4+ Passengers</option>
          </select>
        </div>
        <div class="input-group" style="margin:0;min-width:120px;">
          <select class="input-field" id="searchStops" style="padding:0.5rem 0.8rem;font-size:0.8rem;">
            <option value="0">Any stops</option>
            <option value="1">Nonstop only</option>
            <option value="2">1 stop or fewer</option>
            <option value="3">2 stops or fewer</option>
          </select>
        </div>
      </div>
    </div>

    <div id="searchLoading" style="display:none;text-align:center;padding:3rem;">
      <div style="font-size:2rem;margin-bottom:1rem;animation:pulse-badge 1.5s ease-in-out infinite;">✈️</div>
      <div style="font-size:0.9rem;color:var(--text-muted);">Searching Google Flights...</div>
      <div style="font-size:0.75rem;color:var(--text-dim);margin-top:0.5rem;">This may take 5-10 seconds</div>
    </div>

    <div id="searchError" style="display:none;"></div>

    <div id="searchResultsHeader" style="display:none;" class="search-results-header">
      <div class="results-count" id="resultsCount"></div>
      <div class="sort-buttons">
        <button class="sort-btn active" data-sort="score">Best Deal</button>
        <button class="sort-btn" data-sort="price">Price ↑</button>
        <button class="sort-btn" data-sort="duration">Duration</button>
      </div>
    </div>

    <div id="priceInsight" style="display:none;margin-bottom:1.5rem;"></div>

    <div id="searchResults"></div>
  `;

  const resultsContainer = container.querySelector('#searchResults');
  const loadingEl = container.querySelector('#searchLoading');
  const errorEl = container.querySelector('#searchError');
  const headerEl = container.querySelector('#searchResultsHeader');
  const countEl = container.querySelector('#resultsCount');
  const insightEl = container.querySelector('#priceInsight');
  let currentResults = [];

  // Check API health
  checkHealth().then(health => {
    const statusEl = container.querySelector('#apiStatus');
    if (health.status === 'ok' && health.hasApiKey) {
      statusEl.innerHTML = '<span class="chip chip-green">🟢 API Connected — Live Data</span>';
    } else if (health.status === 'ok') {
      statusEl.innerHTML = '<span class="chip chip-gold">⚠️ API key not configured — add key to .env</span>';
    } else {
      statusEl.innerHTML = '<span class="chip chip-red">⚠️ Backend not running — start with: node server.js</span>';
    }
  });

  function renderResults(results) {
    resultsContainer.innerHTML = '';
    if (!results.length) {
      resultsContainer.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:2rem;">No flights found for this route and date.</p>';
      return;
    }

    headerEl.style.display = 'flex';
    countEl.innerHTML = `<strong>${results.length} flights</strong> found via <strong>Google Flights</strong>`;

    results.forEach((r, i) => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.style.animation = `fadeInView 0.4s ease ${i * 0.06}s both`;

      const score = r.score || 50;

      card.innerHTML = `
        <div class="result-airline">
          ${r.airlineLogo
          ? `<img src="${r.airlineLogo}" alt="${r.airline}" style="width:40px;height:40px;border-radius:var(--radius-sm);object-fit:contain;background:white;">`
          : `<div class="airline-logo">✈</div>`
        }
          <div>
            <div class="airline-name">${r.airline}</div>
            <div class="airline-code">${r.flightNumber || ''} · via <strong>${r.source}</strong></div>
          </div>
        </div>
        <div class="result-route">
          <div class="route-cities">
            <span>${r.depart ? r.depart.split(' ').pop() || r.depart : ''}</span>
            <div class="route-line"></div>
            <span>${r.arrive ? r.arrive.split(' ').pop() || r.arrive : ''}</span>
          </div>
          <div class="route-details">${r.duration} · ${r.stops}${r.carbon ? ` · ${r.carbon}` : ''}</div>
        </div>
        <div style="text-align:center;">
          <div class="deal-score ${getScoreClass(score)}">
            <span style="font-size:0.65rem;color:var(--text-muted);font-family:'Outfit',sans-serif;font-weight:400;">Deal Score</span>
            <div class="score-bar"><div class="score-bar-fill" style="width:${score}%;background:${getScoreColor(score)}"></div></div>
            ${score}/100
          </div>
          ${r.tier === 'best' ? '<div class="chip chip-green" style="margin-top:0.4rem;font-size:0.65rem;">⭐ Best Flight</div>' : ''}
        </div>
        <div class="result-price-col">
          <div class="result-price">$${r.price}</div>
          ${r.extensions && r.extensions.length ? `<div style="font-size:0.68rem;color:var(--text-dim);margin-top:0.2rem;">${r.extensions.slice(0, 2).join(' · ')}</div>` : ''}
        </div>
      `;
      resultsContainer.appendChild(card);
    });
  }

  function showPriceInsight(data) {
    if (!data?.searchInfo?.priceInsights) {
      insightEl.style.display = 'none';
      return;
    }
    const pi = data.searchInfo.priceInsights;
    insightEl.style.display = 'block';
    insightEl.innerHTML = `
      <div class="ai-insight">
        <div class="ai-icon">📊</div>
        <div class="ai-text">
          <h4>Google Price Insight</h4>
          <p>${pi.price_level ? `Prices are currently <strong>${pi.price_level}</strong>.` : ''}
          ${pi.typical_price_range ? `Typical range for this route: <strong>$${pi.typical_price_range[0]} – $${pi.typical_price_range[1]}</strong>.` : ''}
          ${pi.lowest_price ? `Lowest available: <strong>$${pi.lowest_price}</strong>.` : ''}</p>
        </div>
      </div>
    `;
  }

  async function doSearch() {
    const from = container.querySelector('#searchFrom').value.trim().toUpperCase();
    const to = container.querySelector('#searchTo').value.trim().toUpperCase();
    const departDate = container.querySelector('#searchDepart').value;
    const returnDate = container.querySelector('#searchReturn').value;
    const travelClass = travelClassMap[container.querySelector('#searchClass').value] || 1;
    const adults = container.querySelector('#searchAdults').value;
    const stops = container.querySelector('#searchStops').value;

    if (!from || !to || !departDate) {
      errorEl.style.display = 'block';
      errorEl.innerHTML = '<div class="ai-insight" style="border-color:rgba(239,71,111,0.3);background:rgba(239,71,111,0.05);"><div class="ai-icon" style="background:rgba(239,71,111,0.15);">⚠️</div><div class="ai-text"><h4 style="color:var(--accent-pink);">Missing Fields</h4><p>Please enter origin, destination, and departure date.</p></div></div>';
      return;
    }

    // Show loading
    loadingEl.style.display = 'block';
    errorEl.style.display = 'none';
    headerEl.style.display = 'none';
    insightEl.style.display = 'none';
    resultsContainer.innerHTML = '';

    const btn = container.querySelector('#searchBtn');
    btn.textContent = 'Searching...';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    try {
      const data = await searchFlights({ from, to, departDate, returnDate, adults, travelClass, stops });

      // Calculate deal scores
      const allPrices = data.flights.map(f => f.price).filter(p => p > 0);
      data.flights.forEach(f => {
        f.score = calculateDealScore(f.price, allPrices);
      });

      // Sort by score initially
      currentResults = data.flights.sort((a, b) => b.score - a.score);

      loadingEl.style.display = 'none';
      renderResults(currentResults);
      showPriceInsight(data);

    } catch (err) {
      loadingEl.style.display = 'none';
      errorEl.style.display = 'block';
      errorEl.innerHTML = `
        <div class="ai-insight" style="border-color:rgba(239,71,111,0.3);background:rgba(239,71,111,0.05);">
          <div class="ai-icon" style="background:rgba(239,71,111,0.15);">⚠️</div>
          <div class="ai-text">
            <h4 style="color:var(--accent-pink);">Search Error</h4>
            <p>${err.message}. Make sure the backend server is running (<code style="background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px;font-size:0.8rem;">node server.js</code>) and your SerpApi key is configured in <code style="background:rgba(255,255,255,0.06);padding:2px 6px;border-radius:4px;font-size:0.8rem;">.env</code>.</p>
          </div>
        </div>
      `;
    }

    btn.textContent = 'Search ✈';
    btn.style.opacity = '1';
    btn.disabled = false;
  }

  // Sort buttons
  container.querySelectorAll('.sort-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const sort = btn.dataset.sort;
      let sorted = [...currentResults];
      if (sort === 'price') sorted.sort((a, b) => a.price - b.price);
      else if (sort === 'duration') sorted.sort((a, b) => a.durationMinutes - b.durationMinutes);
      else sorted.sort((a, b) => b.score - a.score);
      renderResults(sorted);
    });
  });

  // Search button
  container.querySelector('#searchBtn').addEventListener('click', doSearch);

  // Enter key on inputs
  container.querySelectorAll('.search-form input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSearch();
    });
  });
}
