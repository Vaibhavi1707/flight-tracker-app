// ================================================================
// CHAT VIEW — WhatsApp-style conversational interface
// ================================================================
import { chatMessages } from '../data/mock-data.js';

const botResponses = [
    "Let me check the latest prices for you... 🔍",
    "Great question! I'm scanning all 4 platforms right now. Give me just a moment... ✈️",
    "I've found some interesting options! Here's what I'm seeing across Kayak, Google Flights, and Skyscanner.",
    "Based on current trends, I'd recommend booking within the next 24 hours. Prices are at a seasonal low! 📊",
    "Sure! I can set up a price alert for that route. What's your target price? 🎯",
    "Your booking is ready to go! Just say 'yes' and I'll handle everything — account creation, form filling, and payment. 🚀",
    "I've been monitoring this route for 2 weeks now. The current price of $347 is the lowest I've seen — it's in the bottom 5th percentile! 🔥",
];

export function renderChat(container) {
    container.innerHTML = `
    <div class="page-header">
      <span class="page-tag tag-cyan">AI Chat</span>
      <h1 class="page-title">Talk to Your <span class="hl">Agent</span></h1>
      <p class="page-desc">Chat naturally to search flights, set alerts, approve bookings, and get AI-powered travel advice.</p>
    </div>

    <div class="chat-container">
      <div class="chat-header-bar">
        <div class="chat-avatar">✈</div>
        <div>
          <div class="chat-name">FlightTracker AI</div>
          <div class="chat-online"><span class="status-dot"></span> Online · Monitoring 5 routes</div>
        </div>
        <div style="margin-left:auto;display:flex;gap:0.5rem;">
          <div class="chip chip-green" style="font-size:0.65rem;">Agent Active</div>
        </div>
      </div>

      <div class="chat-messages" id="chatMessages"></div>

      <div class="chat-input-bar">
        <input class="chat-input" id="chatInput" type="text" placeholder="Type a message...">
        <button class="chat-send" id="chatSend">➤</button>
      </div>
    </div>
  `;

    const messagesEl = container.querySelector('#chatMessages');
    const inputEl = container.querySelector('#chatInput');
    const sendBtn = container.querySelector('#chatSend');
    let msgIndex = 0;

    function addMessage(role, text, animate = true) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${role}`;
        if (!animate) msg.style.animation = 'none';

        // Format bold text
        const formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        msg.innerHTML = `
      <div class="msg-bubble">${formatted}</div>
      <div class="msg-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
    `;
        messagesEl.appendChild(msg);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'chat-msg bot';
        typing.id = 'typingIndicator';
        typing.innerHTML = `
      <div class="typing-indicator">
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
      </div>
    `;
        messagesEl.appendChild(typing);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function removeTyping() {
        const typing = messagesEl.querySelector('#typingIndicator');
        if (typing) typing.remove();
    }

    function addQuickReplies() {
        const replies = document.createElement('div');
        replies.className = 'chat-msg bot';
        replies.style.maxWidth = '100%';
        replies.innerHTML = `
      <div class="quick-replies">
        <button class="quick-reply" data-msg="Yes, book it!">✅ Yes, book it!</button>
        <button class="quick-reply" data-msg="Show other options">🔍 Show other options</button>
        <button class="quick-reply" data-msg="Set a price alert">🔔 Set a price alert</button>
        <button class="quick-reply" data-msg="Check trends">📊 Check trends</button>
      </div>
    `;
        messagesEl.appendChild(replies);
        messagesEl.scrollTop = messagesEl.scrollHeight;

        replies.querySelectorAll('.quick-reply').forEach(btn => {
            btn.addEventListener('click', () => {
                replies.remove();
                sendMessage(btn.dataset.msg);
            });
        });
    }

    function sendMessage(text) {
        addMessage('user', text);

        // Simulate bot response
        setTimeout(() => {
            showTyping();
            setTimeout(() => {
                removeTyping();
                const response = botResponses[msgIndex % botResponses.length];
                msgIndex++;
                addMessage('bot', response);

                // Add quick replies after every bot message
                setTimeout(() => addQuickReplies(), 300);
            }, 1200 + Math.random() * 800);
        }, 300);
    }

    // Load initial messages
    chatMessages.forEach((msg, i) => {
        setTimeout(() => {
            addMessage(msg.role, msg.text, i > 0);
            if (i === chatMessages.length - 1) {
                setTimeout(() => addQuickReplies(), 400);
            }
        }, i * 200);
    });

    // Send message handlers
    function handleSend() {
        const text = inputEl.value.trim();
        if (!text) return;
        inputEl.value = '';

        // Remove existing quick replies
        const existing = messagesEl.querySelectorAll('.quick-replies');
        existing.forEach(el => el.closest('.chat-msg')?.remove());

        sendMessage(text);
    }

    sendBtn.addEventListener('click', handleSend);
    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSend();
    });
}
