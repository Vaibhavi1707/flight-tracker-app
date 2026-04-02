// ================================================================
// SEARCH VIEW
// ================================================================
import { searchResults } from '../data/mock-data.js';

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

export function renderSearch(container) {
    container.innerHTML = `
    <div class="page-header">
      <span class="page-tag tag-blue">Flight Search</span>
      <h1 class="page-title">Compare <span class="hl">4+ Sources</span> Instantly</h1>
      <p class="page-desc">Search across Kayak, Google Flights, Skyscanner, and Amadeus in parallel. We rank results by price, value, and deal score.</p>
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
          <input class="input-field" type="date" id="searchDepart" value="2026-05-15">
        </div>
        <div class="input-group">
          <label>Return</label>
          <input class="input-field" type="date" id="searchReturn" value="2026-05-22">
        </div>
        <button class="btn btn-primary" id="searchBtn">Search ✈</button>
      </div>
      <div style="margin-top:1rem;display:flex;gap:0.7rem;flex-wrap:wrap;">
        <div class="input-group" style="margin:0;min-width:120px;">
          <select class="input-field" style="padding:0.5rem 0.8rem;font-size:0.8rem;">
            <option>Economy</option>
            <option>Premium Economy</option>
            <option>Business</option>
            <option>First Class</option>
          </select>
        </div>
        <div class="input-group" style="margin:0;min-width:120px;">
          <select class="input-field" style="padding:0.5rem 0.8rem;font-size:0.8rem;">
            <option>1 Passenger</option>
            <option>2 Passengers</option>
            <option>3 Passengers</option>
            <option>4+ Passengers</option>
          </select>
        </div>
        <div class="chip chip-cyan" style="cursor:pointer;align-self:center;">Nonstop only</div>
      </div>
    </div>

    <div class="search-results-header">
      <div class="results-count"><strong>${searchResults.length} flights</strong> found across 4 sources</div>
      <div class="sort-buttons">
        <button class="sort-btn active" data-sort="score">Best Deal</button>
        <button class="sort-btn" data-sort="price">Price ↑</button>
        <button class="sort-btn" data-sort="duration">Duration</button>
      </div>
    </div>

    <div id="searchResults"></div>
  `;

    const resultsContainer = container.querySelector('#searchResults');

    function renderResults(results) {
        resultsContainer.innerHTML = '';
        results.forEach((r, i) => {
            const card = document.createElement('div');
            card.className = 'result-card';
            card.style.animation = `fadeInView 0.4s ease ${i * 0.08}s both`;
            card.innerHTML = `
        <div class="result-airline">
          <div class="airline-logo">${r.airline.icon}</div>
          <div>
            <div class="airline-name">${r.airline.name}</div>
            <div class="airline-code">${r.airline.code} · via ${r.source}</div>
          </div>
        </div>
        <div class="result-route">
          <div class="route-cities">
            <span>${r.depart}</span>
            <div class="route-line"></div>
            <span>${r.arrive}</span>
          </div>
          <div class="route-details">${r.duration} · ${r.stops}</div>
        </div>
        <div style="text-align:center;">
          <div class="deal-score ${getScoreClass(r.score)}">
            <div class="score-bar"><div class="score-bar-fill" style="width:${r.score}%;background:${getScoreColor(r.score)}"></div></div>
            ${r.score}/100
          </div>
        </div>
        <div class="result-price-col">
          <div class="result-price">$${r.price}</div>
          ${r.savings > 80 ? `<div class="result-savings">↓ Save $${r.savings}</div>` : ''}
          <button class="btn btn-primary" style="margin-top:0.5rem;padding:0.5rem 1rem;font-size:0.78rem;">Book →</button>
        </div>
      `;
            resultsContainer.appendChild(card);
        });
    }

    renderResults(searchResults);

    // Sort buttons
    const sortBtns = container.querySelectorAll('.sort-btn');
    sortBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sortBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const sort = btn.dataset.sort;
            let sorted = [...searchResults];
            if (sort === 'price') sorted.sort((a, b) => a.price - b.price);
            else if (sort === 'duration') sorted.sort((a, b) => a.duration.localeCompare(b.duration));
            else sorted.sort((a, b) => b.score - a.score);
            renderResults(sorted);
        });
    });

    // Search button animation
    container.querySelector('#searchBtn').addEventListener('click', () => {
        const btn = container.querySelector('#searchBtn');
        btn.textContent = 'Scanning...';
        btn.style.opacity = '0.7';
        setTimeout(() => {
            btn.textContent = 'Search ✈';
            btn.style.opacity = '1';
            renderResults(searchResults);
        }, 1500);
    });
}
