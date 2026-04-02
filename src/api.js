// ================================================================
// API SERVICE — Frontend client for the backend proxy
// ================================================================

const API_BASE = 'http://localhost:3001/api';

export async function checkHealth() {
    try {
        const res = await fetch(`${API_BASE}/health`);
        return await res.json();
    } catch {
        return { status: 'error', hasApiKey: false };
    }
}

export async function searchFlights({ from, to, departDate, returnDate, adults = 1, travelClass = 1, stops = 0 }) {
    const params = new URLSearchParams({
        departure_id: from,
        arrival_id: to,
        outbound_date: departDate,
        adults: String(adults),
        travel_class: String(travelClass),
        stops: String(stops),
        type: returnDate ? '1' : '2',
    });
    if (returnDate) params.set('return_date', returnDate);

    const res = await fetch(`${API_BASE}/flights/search?${params}`);
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Search failed');
    }
    return await res.json();
}

// Map travel class select index to SerpApi value
export const travelClassMap = {
    'Economy': 1,
    'Premium Economy': 2,
    'Business': 3,
    'First Class': 4,
};
