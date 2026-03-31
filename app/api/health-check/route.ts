import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

async function checkAlpaca(): Promise<{ status: string; latency: number }> {
  const start = Date.now();
  try {
    const res = await fetch('https://paper-api.alpaca.markets/v2/account', {
      headers: {
        'APCA-API-KEY-ID': process.env.ALPACA_API_KEY || '',
        'APCA-API-SECRET-KEY': process.env.ALPACA_SECRET_KEY || '',
      },
    });
    if (res.ok) return { status: 'online', latency: Date.now() - start };
    return { status: 'offline', latency: Date.now() - start };
  } catch {
    return { status: 'offline', latency: Date.now() - start };
  }
}

async function checkTwelveData(): Promise<{ status: string; latency: number }> {
  const start = Date.now();
  try {
    const res = await fetch(`https://api.twelvedata.com/quote?symbol=BTC/USD&apikey=${process.env.TWELVE_DATA_API_KEY}`);
    const data = await res.json();
    if (data.status === 'ok') return { status: 'online', latency: Date.now() - start };
    return { status: 'offline', latency: Date.now() - start };
  } catch {
    return { status: 'offline', latency: Date.now() - start };
  }
}

async function checkGemini(): Promise<{ status: string; latency: number }> {
  const start = Date.now();
  try {
    // Lightweight check for API key validity
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    if (res.ok) return { status: 'online', latency: Date.now() - start };
    return { status: 'offline', latency: Date.now() - start };
  } catch {
    return { status: 'offline', latency: Date.now() - start };
  }
}

async function checkAlphaVantage(): Promise<{ status: string; latency: number }> {
  const start = Date.now();
  try {
    const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=IBM&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`);
    const data = await res.json();
    // Handling rate limit as "degraded"
    if (data['Global Quote']) return { status: 'online', latency: Date.now() - start };
    if (data['Note'] || data['Information']) return { status: 'degraded', latency: Date.now() - start };
    return { status: 'offline', latency: Date.now() - start };
  } catch {
    return { status: 'offline', latency: Date.now() - start };
  }
}

async function checkAirtable(): Promise<{ status: string; latency: number }> {
  const start = Date.now();
  try {
    const res = await fetch(`https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Trading%20Logs?maxRecords=1`, {
      headers: { Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}` }
    });
    if (res.ok) return { status: 'online', latency: Date.now() - start };
    return { status: 'offline', latency: Date.now() - start };
  } catch {
    return { status: 'offline', latency: Date.now() - start };
  }
}

export async function GET() {
  const [alpaca, twelve, gemini, alpha, airtable] = await Promise.all([
    checkAlpaca(),
    checkTwelveData(),
    checkGemini(),
    checkAlphaVantage(),
    checkAirtable()
  ]);

  return NextResponse.json({
    success: true,
    timestamp: new Date().toISOString(),
    services: [
      { name: 'Alpaca Execution', ...alpaca, type: 'Broker' },
      { name: 'TwelveData Feed', ...twelve, type: 'Data' },
      { name: 'Gemini Neural', ...gemini, type: 'AI' },
      { name: 'Alpha Vantage Intel', ...alpha, type: 'Data' },
      { name: 'Airtable Ledger', ...airtable, type: 'Database' }
    ]
  });
}
