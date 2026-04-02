// ================================================================
// BOOKING VIEW
// ================================================================
import { bookingSteps } from '../data/mock-data.js';

export function renderBooking(container) {
    container.innerHTML = `
    <div class="page-header" style="position:relative;">
      <div class="glow glow-purple" style="width:400px;height:400px;top:-100px;right:-50px;position:absolute;"></div>
      <span class="page-tag tag-purple">Autonomous Booking</span>
      <h1 class="page-title">End-to-End <span class="hl">Automation</span></h1>
      <p class="page-desc">One WhatsApp message starts the agent. One "yes" triggers the entire booking. You save your details once — the agent handles everything from there.</p>
    </div>

    <div class="booking-timeline" id="bookingTimeline"></div>

    <div class="booking-detail" id="bookingDetail"></div>

    <div class="section-block" style="margin-top:2rem;">
      <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:1rem;">🔧 How It Works Under the Hood</h2>
      <div class="grid-3">
        <div class="card hover-purple">
          <div class="card-icon">🌐</div>
          <h3>Playwright Browser</h3>
          <p>Headless Chromium navigates booking sites, handles CAPTCHAs, fills forms, and completes checkout — all in an isolated sandbox.</p>
        </div>
        <div class="card hover-purple">
          <div class="card-icon">🧠</div>
          <h3>LLM Decision Engine</h3>
          <p>GPT-4 / Ollama evaluates page layouts dynamically, identifies form fields, and adapts to UI changes across different booking sites.</p>
        </div>
        <div class="card hover-purple">
          <div class="card-icon">🔒</div>
          <h3>Credential Injection</h3>
          <p>Passport and payment details are decrypted at runtime, injected directly into forms, and never stored in browser memory or logs.</p>
        </div>
      </div>
    </div>

    <div class="section-block" style="margin-top:2rem;">
      <div class="ai-insight" style="background:linear-gradient(135deg, rgba(155,93,229,0.06), rgba(6,214,160,0.06));border-color:rgba(155,93,229,0.15);">
        <div class="ai-icon" style="background:rgba(155,93,229,0.15);">🤖</div>
        <div class="ai-text">
          <h4 style="color:var(--accent-purple);">Booking Status</h4>
          <p>Your last booking (JFK → LHR, BA 115, $347) was completed on Mar 30 at 2:15 PM. Confirmation code: <strong style="font-family:'Space Mono',monospace;color:var(--accent-cyan);">BAXF7K</strong>. E-ticket and receipt were sent to your WhatsApp. The entire process took 47 seconds from approval to confirmation.</p>
        </div>
      </div>
    </div>
  `;

    const timeline = container.querySelector('#bookingTimeline');
    const detail = container.querySelector('#bookingDetail');
    let activeStep = 0;

    function renderTimeline() {
        timeline.innerHTML = '';
        bookingSteps.forEach((step, i) => {
            const stepEl = document.createElement('div');
            stepEl.className = `bt-step ${i === activeStep ? 'active' : ''} ${i < activeStep ? 'completed' : ''}`;
            stepEl.innerHTML = `
        <div class="bt-num">${i < activeStep ? '✓' : step.num}</div>
        <div class="bt-title">${step.title}</div>
        <div class="bt-desc">${step.desc}</div>
      `;
            stepEl.addEventListener('click', () => {
                activeStep = i;
                renderTimeline();
                renderDetail();
            });
            timeline.appendChild(stepEl);
        });
    }

    function renderDetail() {
        const step = bookingSteps[activeStep];
        detail.innerHTML = `
      <div style="display:flex;align-items:center;gap:0.8rem;margin-bottom:1.2rem;">
        <div class="bt-num" style="margin:0;">${step.num}</div>
        <div>
          <h3 style="font-size:1.1rem;font-weight:700;">${step.title}</h3>
          <p style="font-size:0.78rem;color:var(--text-muted);">Step ${step.num} of 5</p>
        </div>
      </div>
      <div style="font-size:0.88rem;color:var(--text-secondary);line-height:1.8;white-space:pre-line;">${step.detail}</div>
      <div style="display:flex;gap:0.7rem;margin-top:1.5rem;">
        ${activeStep > 0 ? '<button class="btn btn-secondary" id="prevStep">← Previous</button>' : ''}
        ${activeStep < bookingSteps.length - 1 ? '<button class="btn btn-primary" id="nextStep">Next →</button>' : '<button class="btn btn-primary" id="nextStep" style="background:linear-gradient(135deg,var(--accent-purple),var(--accent-cyan));">✓ Complete</button>'}
      </div>
    `;

        const prevBtn = detail.querySelector('#prevStep');
        const nextBtn = detail.querySelector('#nextStep');
        if (prevBtn) prevBtn.addEventListener('click', () => { activeStep--; renderTimeline(); renderDetail(); });
        if (nextBtn) nextBtn.addEventListener('click', () => {
            if (activeStep < bookingSteps.length - 1) { activeStep++; renderTimeline(); renderDetail(); }
        });
    }

    renderTimeline();
    renderDetail();
}
