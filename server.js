// ================================================================
// EXPRESS BACKEND PROXY — SerpApi Google Flights
// ================================================================
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const SERPAPI_KEY = process.env.SERPAPI_KEY;

app.use(cors());
app.use(express.json());

// ---- Health Check ----
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasApiKey: !!SERPAPI_KEY && SERPAPI_KEY !== 'YOUR_API_KEY_HERE' });
});

// ---- Google Flights Search ----
app.get('/api/flights/search', async (req, res) => {
    try {
        if (!SERPAPI_KEY || SERPAPI_KEY === 'YOUR_API_KEY_HERE') {
            return res.status(400).json({ error: 'SerpApi key not configured. Add your key to .env file.' });
        }

        const {
            departure_id = 'JFK',
            arrival_id = 'LHR',
            outbound_date = '',
            return_date = '',
            adults = 1,
            travel_class = 1,  // 1=Economy, 2=Premium Economy, 3=Business, 4=First
            stops = 0,         // 0=any, 1=nonstop, 2=1stop, 3=2+stops
            currency = 'USD',
            type = 1,          // 1=round trip, 2=one way
        } = req.query;

        // Build SerpApi URL
        const params = new URLSearchParams({
            engine: 'google_flights',
            departure_id,
            arrival_id,
            outbound_date,
            adults: String(adults),
            currency,
            hl: 'en',
            type: String(type),
            api_key: SERPAPI_KEY,
        });

        if (return_date) params.set('return_date', return_date);
        if (travel_class > 1) params.set('travel_class', String(travel_class));
        if (stops > 0) params.set('stops', String(stops));

        const url = `https://serpapi.com/search.json?${params}`;
        console.log(`[SerpApi] Fetching: ${departure_id} → ${arrival_id} on ${outbound_date}`);

        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error('[SerpApi Error]', data.error);
            return res.status(500).json({ error: data.error });
        }

        // Transform SerpApi response into our app's format
        const flights = transformFlights(data);
        res.json({
            flights,
            searchInfo: {
                departure_id,
                arrival_id,
                outbound_date,
                return_date,
                totalResults: flights.length,
                priceInsights: data.price_insights || null,
            },
            raw: data, // include raw for debugging
        });

    } catch (err) {
        console.error('[Server Error]', err.message);
        res.status(500).json({ error: 'Failed to fetch flight data', details: err.message });
    }
});

// ---- Transform SerpApi data to our format ----
function transformFlights(data) {
    const results = [];

    // Best flights
    if (data.best_flights) {
        data.best_flights.forEach(flightGroup => {
            results.push(parseFlightGroup(flightGroup, 'best'));
        });
    }

    // Other flights
    if (data.other_flights) {
        data.other_flights.forEach(flightGroup => {
            results.push(parseFlightGroup(flightGroup, 'other'));
        });
    }

    return results;
}

function parseFlightGroup(group, tier) {
    const flights = group.flights || [];
    const firstLeg = flights[0] || {};
    const lastLeg = flights[flights.length - 1] || {};

    // Calculate total duration
    const totalDuration = group.total_duration || 0;
    const hours = Math.floor(totalDuration / 60);
    const mins = totalDuration % 60;

    // Determine stops
    const numStops = flights.length - 1;
    let stopsText = 'Nonstop';
    if (numStops === 1) {
        const layoverAirport = flights[0]?.arrival_airport?.id || '';
        stopsText = `1 stop (${layoverAirport})`;
    } else if (numStops > 1) {
        stopsText = `${numStops} stops`;
    }

    // Get airline info
    const airlineName = firstLeg.airline || 'Unknown';
    const airlineLogo = firstLeg.airline_logo || '';
    const flightNumber = firstLeg.flight_number || '';

    // Departure and arrival
    const departTime = firstLeg.departure_airport?.time || '';
    const arriveTime = lastLeg.arrival_airport?.time || '';
    const departAirport = firstLeg.departure_airport?.id || '';
    const arriveAirport = lastLeg.arrival_airport?.id || '';

    // Price
    const price = group.price || 0;

    // Carbon emissions
    const carbon = group.carbon_emissions?.this_flight
        ? `${Math.round(group.carbon_emissions.this_flight / 1000)} kg CO₂`
        : null;

    // Extensions (baggage, etc)
    const extensions = group.extensions || [];

    return {
        tier,
        airline: airlineName,
        airlineLogo,
        flightNumber,
        from: departAirport,
        to: arriveAirport,
        depart: departTime,
        arrive: arriveTime,
        duration: `${hours}h ${mins}m`,
        durationMinutes: totalDuration,
        stops: stopsText,
        numStops,
        price,
        carbon,
        extensions,
        legs: flights.map(f => ({
            airline: f.airline,
            flightNumber: f.flight_number,
            aircraft: f.airplane,
            from: f.departure_airport?.id,
            fromName: f.departure_airport?.name,
            to: f.arrival_airport?.id,
            toName: f.arrival_airport?.name,
            depart: f.departure_airport?.time,
            arrive: f.arrival_airport?.time,
            duration: f.duration,
            legroom: f.legroom,
            extensions: f.extensions || [],
        })),
        source: 'Google Flights',
    };
}

// ---- Start Server ----
app.listen(PORT, () => {
    console.log(`\n✈  FlightTracker API server running on http://localhost:${PORT}`);
    console.log(`   SerpApi key: ${SERPAPI_KEY && SERPAPI_KEY !== 'YOUR_API_KEY_HERE' ? '✓ configured' : '✗ NOT configured — update .env'}\n`);
});
