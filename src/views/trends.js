// ================================================================
// TRENDS VIEW — SVG Price Chart
// ================================================================
import { priceHistory, sources } from '../data/mock-data.js';

const colors = {
    kayak: '#ff6b35',
    google: '#06d6a0',
    skyscanner: '#118ab2',
    amadeus: '#9b5de5',
};

function drawChart(container, period) {
    const data = priceHistory[period];
    const canvas = container.querySelector('#trendChart');
    if (!canvas) return;

    const W = canvas.clientWidth;
    const H = 300;
    const padL = 55, padR = 20, padT = 20, padB = 40;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    // Get all values for scale
    const allVals = [...data.kayak, ...data.google, ...data.skyscanner, ...data.amadeus];
    const minV = Math.min(...allVals) - 20;
    const maxV = Math.max(...allVals) + 20;

    const xStep = chartW / (data.labels.length - 1 || 1);

    function toX(i) { return padL + i * xStep; }
    function toY(v) { return padT + chartH - ((v - minV) / (maxV - minV)) * chartH; }

    // Build SVG
    let svg = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" style="overflow:visible;">`;

    // Grid lines
    const gridCount = 5;
    for (let i = 0; i <= gridCount; i++) {
        const y = padT + (chartH / gridCount) * i;
        const val = Math.round(maxV - ((maxV - minV) / gridCount) * i);
        svg += `<line x1="${padL}" y1="${y}" x2="${W - padR}" y2="${y}" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>`;
        svg += `<text x="${padL - 10}" y="${y + 4}" text-anchor="end" fill="#6b7f99" font-size="11" font-family="Space Mono, monospace">$${val}</text>`;
    }

    // X labels
    data.labels.forEach((label, i) => {
        svg += `<text x="${toX(i)}" y="${H - 5}" text-anchor="middle" fill="#6b7f99" font-size="11" font-family="Space Mono, monospace">${label}</text>`;
    });

    // Lines and areas
    const datasets = [
        { key: 'kayak', label: 'Kayak' },
        { key: 'google', label: 'Google Flights' },
        { key: 'skyscanner', label: 'Skyscanner' },
        { key: 'amadeus', label: 'Amadeus' },
    ];

    datasets.forEach(ds => {
        const pts = data[ds.key];
        const color = colors[ds.key];

        // Area fill
        let areaPath = `M${toX(0)},${toY(pts[0])}`;
        pts.forEach((v, i) => { if (i > 0) areaPath += ` L${toX(i)},${toY(v)}`; });
        areaPath += ` L${toX(pts.length - 1)},${padT + chartH} L${toX(0)},${padT + chartH} Z`;
        svg += `<path d="${areaPath}" fill="${color}" opacity="0.05"/>`;

        // Line
        let linePath = `M${toX(0)},${toY(pts[0])}`;
        pts.forEach((v, i) => { if (i > 0) linePath += ` L${toX(i)},${toY(v)}`; });
        svg += `<path d="${linePath}" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="1.5s" fill="freeze"/>
      <animate attributeName="stroke-dasharray" from="1000" to="1000" dur="0.01s" fill="freeze"/>
    </path>`;

        // Dots
        pts.forEach((v, i) => {
            svg += `<circle cx="${toX(i)}" cy="${toY(v)}" r="4" fill="${color}" stroke="var(--bg-deep)" stroke-width="2" opacity="0.9">
        <animate attributeName="r" from="0" to="4" dur="0.4s" begin="${0.3 + i * 0.1}s" fill="freeze"/>
      </circle>`;
        });
    });

    svg += '</svg>';
    canvas.innerHTML = svg;

    // Legend
    const legend = container.querySelector('#trendLegend');
    legend.innerHTML = datasets.map(ds => `
    <div style="display:flex;align-items:center;gap:6px;">
      <div style="width:12px;height:3px;border-radius:2px;background:${colors[ds.key]};"></div>
      <span style="font-size:0.75rem;color:var(--text-muted);">${ds.label}</span>
    </div>
  `).join('');
}

export function renderTrends(container) {
    container.innerHTML = `
    <div class="page-header">
      <span class="page-tag tag-orange">Price Trends</span>
      <h1 class="page-title">Historical <span class="hl">Analysis</span></h1>
      <p class="page-desc">Track price movements across all platforms. Our AI analyzes trends and predicts the best time to buy.</p>
    </div>

    <div class="trend-controls">
      <div class="input-group" style="margin:0;min-width:200px;">
        <select class="input-field" id="routeSelect" style="padding:0.5rem 0.8rem;font-size:0.82rem;">
          <option>JFK → LHR (New York to London)</option>
          <option>LAX → NRT (Los Angeles to Tokyo)</option>
          <option>SFO → SIN (San Francisco to Singapore)</option>
          <option>ORD → CDG (Chicago to Paris)</option>
        </select>
      </div>
      <div class="time-toggle">
        <button class="time-btn active" data-period="7d">7 Days</button>
        <button class="time-btn" data-period="30d">30 Days</button>
        <button class="time-btn" data-period="90d">90 Days</button>
      </div>
      <div id="trendLegend" style="display:flex;gap:1rem;margin-left:auto;flex-wrap:wrap;"></div>
    </div>

    <div class="chart-container">
      <div id="trendChart" class="chart-canvas"></div>
    </div>

    <div class="grid-2" style="gap:1.25rem;">
      <div class="ai-insight">
        <div class="ai-icon">🤖</div>
        <div class="ai-text">
          <h4>AI Price Prediction</h4>
          <p>Based on historical data and seasonal patterns, I predict JFK → LHR prices will bottom out within the next 24-48 hours before beginning a typical spring rebound. Current price of $347 is in the <strong>bottom 5th percentile</strong> of the past 90 days. Confidence: 87%.</p>
        </div>
      </div>
      <div class="ai-insight" style="background:linear-gradient(135deg, rgba(255,107,53,0.06), rgba(155,93,229,0.06));border-color:rgba(255,107,53,0.15);">
        <div class="ai-icon" style="background:rgba(255,107,53,0.15);">📊</div>
        <div class="ai-text">
          <h4 style="color:var(--accent-orange);">Cross-Platform Analysis</h4>
          <p>Google Flights currently has the lowest price at $347 (-$18 vs. Amadeus average). Kayak tends to lag Google by ~24 hours on price drops. Consider booking on Google Flights or waiting for Kayak to match tomorrow.</p>
        </div>
      </div>
    </div>

    <div class="section-block" style="margin-top:2rem;">
      <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:1rem;">📈 Key Metrics</h2>
      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-label">Current Low</div>
          <div class="stat-value">$347</div>
          <div class="stat-sub">Google Flights</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">90-Day Average</div>
          <div class="stat-value">$512</div>
          <div class="stat-sub">Across all sources</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Price Drop</div>
          <div class="stat-value" style="color:var(--accent-green);">-32%</div>
          <div class="stat-sub">Last 30 days</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Percentile</div>
          <div class="stat-value" style="color:var(--accent-gold);">5th</div>
          <div class="stat-sub">Historically low</div>
        </div>
      </div>
    </div>
  `;

    // Draw initial chart
    setTimeout(() => drawChart(container, '7d'), 100);

    // Time toggle
    container.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            drawChart(container, btn.dataset.period);
        });
    });

    // Window resize handler
    const resizeHandler = () => {
        const activeBtn = container.querySelector('.time-btn.active');
        if (activeBtn) drawChart(container, activeBtn.dataset.period);
    };
    window.addEventListener('resize', resizeHandler);
}
