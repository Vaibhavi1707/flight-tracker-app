# ✈ FlightTracker AI — Flight Price Tracker Agent

> An AI-powered flight price tracking dashboard that monitors prices across multiple booking sites, analyzes trends, sends deal alerts, and automates the booking process — all from a sleek dark-themed web interface.

![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📋 Features

| View | Description |
|------|-------------|
| **Dashboard** | Hero stats, live deal cards with deal scores, quick search, AI insights |
| **Search** | Multi-source flight comparison (Kayak, Google Flights, Skyscanner, Amadeus) with sort/filter |
| **Trends** | Interactive SVG price chart with 7d/30d/90d toggles, cross-platform analysis, AI predictions |
| **Alerts** | Price alert management with thresholds, active/paused status, create new alerts |
| **Booking** | 5-step autonomous booking timeline (Onboarding → Monitoring → Deal Alert → Approval → Auto-Book) |
| **Vault** | Credential security management, AES-256 encryption badges, audit trail log |
| **Chat** | WhatsApp-style AI chat interface with typing indicators, quick replies, simulated bot responses |

---

## 🏗️ Project Structure

```
flight-tracker-app/
├── index.html              # Root HTML with sidebar navigation
├── package.json
├── vite.config.js
└── src/
    ├── main.js             # App entry point, view routing
    ├── index.css           # Design system & global styles
    ├── data/
    │   └── mock-data.js    # Mock flights, airlines, price history, alerts, chat
    └── views/
        ├── dashboard.js    # Dashboard with stats, deals, quick search
        ├── search.js       # Multi-source flight search & results
        ├── trends.js       # SVG price charts & AI analysis
        ├── alerts.js       # Price alert management
        ├── booking.js      # 5-step booking timeline
        ├── vault.js        # Credential vault & security
        └── chat.js         # WhatsApp-style chat interface
```

---

## 🎨 Design

- **Theme**: Dark navy (#0a0e1a) with glassmorphism cards and grain texture overlay
- **Accents**: Cyan (#06d6a0), Orange (#ff6b35), Pink (#ef476f), Purple (#9b5de5), Gold (#ffd166)
- **Typography**: [Outfit](https://fonts.google.com/specimen/Outfit) for body, [Space Mono](https://fonts.google.com/specimen/Space+Mono) for monospace/data
- **Responsive**: Sidebar collapses to hamburger menu on mobile (≤768px)
- **Animations**: Fade-in views, hover effects, typing indicators, pulsing badges

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Build Tool | Vite |
| Language | Vanilla JavaScript (ES Modules) |
| Styling | Vanilla CSS with custom properties |
| Charts | Custom SVG rendering (no external library) |
| Fonts | Google Fonts (Outfit, Space Mono) |

---

## 👥 Team

Nishit Anand · Ramaneswaran Selvakumar · Aryan Bhosale · Vaibhavi Lokegaonkar
