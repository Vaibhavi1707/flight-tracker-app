// ================================================================
// MOCK DATA — Flight Tracker AI Agent
// ================================================================

export const airlines = [
  { code: 'DL', name: 'Delta Air Lines', icon: '🔺' },
  { code: 'UA', name: 'United Airlines', icon: '🌐' },
  { code: 'AA', name: 'American Airlines', icon: '🦅' },
  { code: 'BA', name: 'British Airways', icon: '🇬🇧' },
  { code: 'LH', name: 'Lufthansa', icon: '🟡' },
  { code: 'EK', name: 'Emirates', icon: '🏜️' },
  { code: 'AF', name: 'Air France', icon: '🇫🇷' },
  { code: 'JL', name: 'Japan Airlines', icon: '🇯🇵' },
  { code: 'SQ', name: 'Singapore Airlines', icon: '🦁' },
  { code: 'QR', name: 'Qatar Airways', icon: '🟤' },
];

export const sources = ['Kayak', 'Google Flights', 'Skyscanner', 'Amadeus'];

export const liveDeals = [
  { from: 'JFK', to: 'LHR', price: 347, airline: airlines[3], duration: '7h 15m', stops: 'Nonstop', source: 'Google Flights', score: 92, trend: 'down', savings: 128 },
  { from: 'LAX', to: 'NRT', price: 489, airline: airlines[7], duration: '11h 30m', stops: 'Nonstop', source: 'Skyscanner', score: 88, trend: 'down', savings: 95 },
  { from: 'ORD', to: 'CDG', price: 412, airline: airlines[6], duration: '8h 45m', stops: 'Nonstop', source: 'Kayak', score: 85, trend: 'stable', savings: 76 },
  { from: 'SFO', to: 'SIN', price: 578, airline: airlines[8], duration: '17h 20m', stops: 'Nonstop', source: 'Amadeus', score: 94, trend: 'down', savings: 211 },
  { from: 'MIA', to: 'DXB', price: 623, airline: airlines[5], duration: '14h 10m', stops: '1 stop', source: 'Google Flights', score: 79, trend: 'up', savings: 42 },
  { from: 'BOS', to: 'MUC', price: 398, airline: airlines[4], duration: '8h 05m', stops: 'Nonstop', source: 'Kayak', score: 91, trend: 'down', savings: 152 },
];

export const searchResults = [
  { airline: airlines[3], from: 'JFK', to: 'LHR', depart: '08:30 AM', arrive: '08:45 PM', duration: '7h 15m', stops: 'Nonstop', price: 347, source: 'Google Flights', score: 92, savings: 128 },
  { airline: airlines[0], from: 'JFK', to: 'LHR', depart: '06:00 PM', arrive: '06:25 AM+1', duration: '7h 25m', stops: 'Nonstop', price: 389, source: 'Kayak', score: 84, savings: 86 },
  { airline: airlines[1], from: 'JFK', to: 'LHR', depart: '10:15 PM', arrive: '10:20 AM+1', duration: '7h 05m', stops: 'Nonstop', price: 412, source: 'Skyscanner', score: 78, savings: 63 },
  { airline: airlines[2], from: 'JFK', to: 'LHR', depart: '11:00 AM', arrive: '11:30 PM', duration: '7h 30m', stops: 'Nonstop', price: 425, source: 'Amadeus', score: 75, savings: 50 },
  { airline: airlines[6], from: 'JFK', to: 'LHR', depart: '07:45 PM', arrive: '09:50 AM+1', duration: '9h 05m', stops: '1 stop (CDG)', price: 298, source: 'Google Flights', score: 87, savings: 177 },
  { airline: airlines[4], from: 'JFK', to: 'LHR', depart: '03:00 PM', arrive: '07:20 AM+1', duration: '10h 20m', stops: '1 stop (FRA)', price: 315, source: 'Skyscanner', score: 83, savings: 160 },
];

export const priceHistory = {
  '7d': {
    labels: ['Mar 27', 'Mar 28', 'Mar 29', 'Mar 30', 'Mar 31', 'Apr 1', 'Apr 2'],
    kayak:   [412, 398, 405, 389, 375, 362, 347],
    google:  [425, 410, 420, 395, 380, 355, 347],
    skyscanner: [430, 415, 408, 400, 390, 370, 352],
    amadeus: [420, 420, 415, 405, 395, 380, 365],
  },
  '30d': {
    labels: ['W1', 'W2', 'W3', 'W4'],
    kayak:   [510, 475, 430, 362],
    google:  [520, 490, 445, 355],
    skyscanner: [515, 480, 435, 370],
    amadeus: [505, 470, 425, 380],
  },
  '90d': {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    kayak:   [620, 580, 510, 362],
    google:  [640, 595, 520, 355],
    skyscanner: [630, 585, 515, 370],
    amadeus: [615, 575, 505, 380],
  },
};

export const alerts = [
  { id: 1, from: 'JFK', to: 'LHR', dates: 'May 15 – May 22', threshold: 400, status: 'active', lastPrice: 347, lastCheck: '2 min ago' },
  { id: 2, from: 'LAX', to: 'NRT', dates: 'Jun 10 – Jun 24', threshold: 550, status: 'active', lastPrice: 489, lastCheck: '15 min ago' },
  { id: 3, from: 'SFO', to: 'SIN', dates: 'Jul 1 – Jul 15', threshold: 650, status: 'active', lastPrice: 578, lastCheck: '8 min ago' },
  { id: 4, from: 'ORD', to: 'CDG', dates: 'May 28 – Jun 4', threshold: 500, status: 'paused', lastPrice: 412, lastCheck: '1 hr ago' },
  { id: 5, from: 'BOS', to: 'MUC', dates: 'Aug 5 – Aug 12', threshold: 450, status: 'active', lastPrice: 398, lastCheck: '5 min ago' },
];

export const chatMessages = [
  { role: 'bot', text: '👋 Hey Vaibhavi! I\'m your FlightTracker AI agent. I\'ve been monitoring 4 booking sites for your upcoming trips. Ready to find you an amazing deal!', time: '9:00 AM' },
  { role: 'user', text: 'Hi! Can you check flights from JFK to London around mid-May?', time: '9:01 AM' },
  { role: 'bot', text: '✈️ Scanning JFK → LHR across Kayak, Google Flights, Skyscanner, and Amadeus now...', time: '9:01 AM' },
  { role: 'bot', text: '🔥 **Great deal found!**\n\n✈ British Airways BA 115\n📅 May 15 → May 22\n💰 **$347** (was $475 last week)\n⏱️ 7h 15m · Nonstop\n📊 Deal Score: 92/100\n\nThis is in the bottom 5% of prices I\'ve seen for this route in 90 days. Prices are trending down but I expect them to bottom out in the next 24-48 hours.', time: '9:02 AM' },
  { role: 'user', text: 'That looks great! What about other options?', time: '9:03 AM' },
  { role: 'bot', text: 'Here are your top 3 alternatives:\n\n1. 🔺 Delta DL 1 — $389 · 7h 25m · Nonstop\n2. 🇫🇷 Air France AF 22 — $298 · 9h 05m · 1 stop (CDG)\n3. 🟡 Lufthansa LH 401 — $315 · 10h 20m · 1 stop (FRA)\n\nThe BA flight at $347 is the best value for a nonstop. The AF option saves $49 but adds 2 hours. Your call!', time: '9:03 AM' },
];

export const bookingSteps = [
  {
    num: 1,
    title: 'Onboarding',
    desc: 'Message the bot with your route, dates, and budget. It securely stores your passport, card, and preferences.',
    detail: 'During onboarding, you share your travel details through a simple WhatsApp conversation. The agent asks for:\n• Full name (as on passport)\n• Passport number & expiry\n• Payment card details\n• Seat and meal preferences\n\nAll data is encrypted with AES-256 and stored in an isolated vault. You only need to do this once.'
  },
  {
    num: 2,
    title: 'Monitoring',
    desc: 'Agent runs periodic scans across 4+ platforms. Compares results and tracks historical trends.',
    detail: 'The agent runs every 30 minutes (configurable), querying:\n• Kayak — via Playwright scraper\n• Google Flights — via structured data extraction\n• Skyscanner — via API partner access\n• Amadeus — via official GDS API\n\nResults are stored in SQLite with timestamps for trend analysis. The LLM compares current prices against historical averages.'
  },
  {
    num: 3,
    title: 'Deal Alert',
    desc: 'When a significant price drop is detected, you get a rich notification with all the details.',
    detail: 'The LLM evaluates each price update against:\n• Your budget threshold\n• Historical price percentile (is this in the bottom 10%?)\n• Price velocity (how fast is it dropping?)\n• Route-specific seasonal patterns\n\nWhen it finds a deal, it sends a rich WhatsApp message with price, airline, duration, deal score, and a mini price chart.'
  },
  {
    num: 4,
    title: 'Approval',
    desc: 'You reply "yes" or tap a button. That single action authorizes the full booking.',
    detail: 'The approval flow is designed for zero friction:\n• Tap "Book it!" inline button\n• Or reply "yes" / "book" / "go"\n• The agent confirms your selection and starts the booking process\n• You can also say "wait" to hold the deal and check later\n\nNo app to open, no forms to fill, no passwords to remember.'
  },
  {
    num: 5,
    title: 'Auto-Book',
    desc: 'Playwright fills forms, enters your details, completes payment, and sends confirmation.',
    detail: 'The booking agent:\n1. Opens the airline/OTA site in a sandboxed Playwright browser\n2. Creates an account if needed (using your details from the vault)\n3. Selects the exact flight you approved\n4. Fills in passenger details, seat preferences, meal choices\n5. Enters payment card information\n6. Completes checkout and captures the confirmation\n7. Sends you the booking reference, e-ticket, and receipt via WhatsApp\n\nAll browser sessions are recorded for audit. Card details are injected at runtime and never cached.'
  },
];

export const credentials = [
  { type: 'passport', icon: '🛂', name: 'Passport Details', detail: 'Last updated Mar 15, 2026', status: 'Encrypted', statusColor: 'green' },
  { type: 'payment', icon: '💳', name: 'Payment Card', detail: '•••• •••• •••• 4242 · Visa', status: 'Encrypted', statusColor: 'green' },
  { type: 'prefs', icon: '⚙️', name: 'Travel Preferences', detail: 'Window seat · Vegetarian meal · Priority boarding', status: 'Saved', statusColor: 'cyan' },
];
