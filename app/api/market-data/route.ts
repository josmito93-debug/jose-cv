import { NextResponse } from 'next/server';

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY;

const SYMBOLS_BY_CATEGORY: Record<string, string[]> = {
  Crypto: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'BNB/USD'],
  Forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'],
  Metals: ['XAU/USD', 'XAG/USD', 'XPT/USD', 'XPD/USD'],
  Stocks: ['AAPL', 'TSLA', 'NVDA', 'MSFT']
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'Crypto';
  const type = searchParams.get('type') || 'ticker';

  try {
    if (type === 'news') {
      // Mock professional-grade news feed (can be replaced with GNews or AlphaVantage News API)
      const mockNews = [
        {
          id: 1,
          category: 'Crypto',
          title: 'Institutional Inflow surging in Bitcoin ETFs',
          content: 'BlackRock and Fidelity report record-breaking inflows as BTC holds above $68k.',
          sentiment: 'BULLISH',
          time: '5m ago'
        },
        {
          id: 2,
          category: 'Forex',
          title: 'Dollar Index stabilizes after CPI data',
          content: 'The DXY finds support as market anticipates Fed rate trajectory.',
          sentiment: 'NEUTRAL',
          time: '12m ago'
        },
        {
          id: 3,
          category: 'Metals',
          title: 'Gold hits all-time high amid geopolitical tension',
          content: 'Safe-haven demand drives XAU/USD past $2180 resistance.',
          sentiment: 'BULLISH',
          time: '20m ago'
        },
        {
          id: 4,
          category: 'Stocks',
          title: 'NVIDIA quarterly earnings exceed expectation',
          content: 'AI-driven demand boosts EPS as NVDA market cap nears new milestone.',
          sentiment: 'BULLISH',
          time: '45m ago'
        }
      ];

      const filteredNews = mockNews.filter(n => n.category === category);
      return NextResponse.json({ success: true, data: filteredNews });
    }

    // Default: Ticker data from Twelve Data
    const symbols = SYMBOLS_BY_CATEGORY[category] || SYMBOLS_BY_CATEGORY.Crypto;
    const url = `https://api.twelvedata.com/quote?symbol=${symbols.join(',')}&apikey=${TWELVE_DATA_API_KEY}`;
    const resp = await fetch(url);
    const data = await resp.json();

    const results = symbols.map(s => {
      const quote = symbols.length > 1 ? data[s] : data;
      if (!quote || quote.code === 401) return null;
      
      return {
        symbol: s.includes('/') ? s.split('/')[0] : s,
        price: parseFloat(quote.close || quote.price || '0'),
        change: parseFloat(quote.percent_change || '0'),
        isUp: parseFloat(quote.percent_change || '0') >= 0,
        sector: category
      };
    }).filter(Boolean);

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Market Data API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch market data' }, { status: 500 });
  }
}
