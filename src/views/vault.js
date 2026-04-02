// ================================================================
// VAULT VIEW
// ================================================================
import { credentials } from '../data/mock-data.js';

export function renderVault(container) {
    container.innerHTML = `
    <div class="page-header" style="position:relative;">
      <div class="glow glow-orange" style="width:350px;height:350px;top:-80px;right:-60px;position:absolute;"></div>
      <span class="page-tag tag-gold">Secure Vault</span>
      <h1 class="page-title">Credential <span class="hl">Vault</span> & Security</h1>
      <p class="page-desc">Your passport, card details, and personal info are stored in an encrypted sandbox — never in plaintext, never exposed, always under your control.</p>
    </div>

    <div class="vault-grid">
      <div class="card vault-card hover-gold">
        <div class="vault-icon">🔐</div>
        <h3>AES-256 Encryption</h3>
        <p>All sensitive data encrypted at rest. Decryption keys managed via HashiCorp Vault or OS-level keyring with per-session tokens.</p>
      </div>
      <div class="card vault-card hover-gold">
        <div class="vault-icon">🏖️</div>
        <h3>Sandboxed Execution</h3>
        <p>Booking automation runs inside isolated browser containers. Credentials injected at runtime, never persisted in browser storage.</p>
      </div>
      <div class="card vault-card hover-gold">
        <div class="vault-icon">📋</div>
        <h3>Audit Trail</h3>
        <p>Every credential access is logged with timestamps. Revoke access, update details, or wipe your vault anytime via chat.</p>
      </div>
    </div>

    <div class="section-block">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.2rem;">
        <h2 style="font-size:1.1rem;font-weight:700;">Stored Credentials</h2>
        <button class="btn btn-secondary" id="addCredBtn">+ Add Credential</button>
      </div>
      <div class="credential-list" id="credentialList"></div>
    </div>

    <div id="addCredForm" style="display:none;margin-top:1.5rem;">
      <div class="card" style="padding:1.5rem;">
        <h3 style="margin-bottom:1rem;">Add New Credential</h3>
        <div class="grid-2">
          <div class="input-group">
            <label>Credential Type</label>
            <select class="input-field">
              <option>Passport</option>
              <option>Payment Card</option>
              <option>Travel Preferences</option>
              <option>Loyalty Program</option>
            </select>
          </div>
          <div class="input-group">
            <label>Label</label>
            <input class="input-field" type="text" placeholder="e.g., Personal Passport">
          </div>
        </div>
        <div class="input-group">
          <label>Details (Encrypted on save)</label>
          <textarea class="input-field" rows="3" placeholder="Enter credential details..."></textarea>
        </div>
        <div style="display:flex;gap:0.7rem;">
          <button class="btn btn-primary" id="saveCredBtn">🔐 Encrypt & Save</button>
          <button class="btn btn-secondary" id="cancelCredBtn">Cancel</button>
        </div>
      </div>
    </div>

    <div class="section-block" style="margin-top:2rem;">
      <h2 style="font-size:1.1rem;font-weight:700;margin-bottom:1rem;">🕵️ Access Log</h2>
      <div class="card" style="padding:0;overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;font-size:0.8rem;">
          <thead>
            <tr style="border-bottom:1px solid var(--border-subtle);background:rgba(255,255,255,0.02);">
              <th style="padding:0.8rem 1.2rem;text-align:left;color:var(--text-muted);font-weight:600;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;">Timestamp</th>
              <th style="padding:0.8rem 1.2rem;text-align:left;color:var(--text-muted);font-weight:600;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;">Action</th>
              <th style="padding:0.8rem 1.2rem;text-align:left;color:var(--text-muted);font-weight:600;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;">Credential</th>
              <th style="padding:0.8rem 1.2rem;text-align:left;color:var(--text-muted);font-weight:600;font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid var(--border-subtle);">
              <td style="padding:0.7rem 1.2rem;font-family:'Space Mono',monospace;color:var(--text-dim);">Apr 02, 14:02</td>
              <td style="padding:0.7rem 1.2rem;">Booking — BA 115</td>
              <td style="padding:0.7rem 1.2rem;">Passport + Payment Card</td>
              <td style="padding:0.7rem 1.2rem;"><span class="chip chip-green" style="font-size:0.68rem;">✓ Completed</span></td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
              <td style="padding:0.7rem 1.2rem;font-family:'Space Mono',monospace;color:var(--text-dim);">Mar 30, 14:15</td>
              <td style="padding:0.7rem 1.2rem;">Form Fill — ba.com</td>
              <td style="padding:0.7rem 1.2rem;">Passport Details</td>
              <td style="padding:0.7rem 1.2rem;"><span class="chip chip-green" style="font-size:0.68rem;">✓ Completed</span></td>
            </tr>
            <tr style="border-bottom:1px solid var(--border-subtle);">
              <td style="padding:0.7rem 1.2rem;font-family:'Space Mono',monospace;color:var(--text-dim);">Mar 30, 14:15</td>
              <td style="padding:0.7rem 1.2rem;">Payment — ba.com</td>
              <td style="padding:0.7rem 1.2rem;">Visa •••• 4242</td>
              <td style="padding:0.7rem 1.2rem;"><span class="chip chip-green" style="font-size:0.68rem;">✓ Completed</span></td>
            </tr>
            <tr>
              <td style="padding:0.7rem 1.2rem;font-family:'Space Mono',monospace;color:var(--text-dim);">Mar 15, 09:30</td>
              <td style="padding:0.7rem 1.2rem;">Credential Updated</td>
              <td style="padding:0.7rem 1.2rem;">Passport Details</td>
              <td style="padding:0.7rem 1.2rem;"><span class="chip chip-cyan" style="font-size:0.68rem;">↻ Updated</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="section-block" style="margin-top:2rem;">
      <div class="ai-insight" style="background:linear-gradient(135deg, rgba(255,209,102,0.06), rgba(255,107,53,0.06));border-color:rgba(255,209,102,0.15);">
        <div class="ai-icon" style="background:rgba(255,209,102,0.15);">🛡️</div>
        <div class="ai-text">
          <h4 style="color:var(--accent-gold);">Security Status</h4>
          <p>All credentials are encrypted and up to date. Last vault access was 2 hours ago for a booking operation. No unauthorized access attempts detected. Encryption keys were last rotated 7 days ago.</p>
        </div>
      </div>
    </div>
  `;

    // Render credential items
    const credList = container.querySelector('#credentialList');
    credentials.forEach((cred, i) => {
        const item = document.createElement('div');
        item.className = 'credential-item';
        item.style.animation = `fadeInView 0.3s ease ${i * 0.08}s both`;
        item.innerHTML = `
      <div class="cred-icon ${cred.type}">
        ${cred.icon}
      </div>
      <div class="cred-info">
        <div class="cred-name">${cred.name}</div>
        <div class="cred-detail">${cred.detail}</div>
      </div>
      <div class="cred-status" style="color:var(--accent-${cred.statusColor});">
        🔒 ${cred.status}
      </div>
      <div class="alert-actions">
        <button class="alert-action-btn" title="Edit">✏️</button>
        <button class="alert-action-btn" title="Delete" style="color:var(--accent-pink);">🗑</button>
      </div>
    `;
        credList.appendChild(item);
    });

    // Toggle add credential form
    const addForm = container.querySelector('#addCredForm');
    container.querySelector('#addCredBtn').addEventListener('click', () => {
        addForm.style.display = addForm.style.display === 'none' ? 'block' : 'none';
    });
    container.querySelector('#cancelCredBtn').addEventListener('click', () => {
        addForm.style.display = 'none';
    });
    container.querySelector('#saveCredBtn').addEventListener('click', () => {
        addForm.style.display = 'none';
        const btn = container.querySelector('#saveCredBtn');
        btn.textContent = '✓ Encrypted & Saved!';
        setTimeout(() => { btn.textContent = '🔐 Encrypt & Save'; }, 1500);
    });
}
