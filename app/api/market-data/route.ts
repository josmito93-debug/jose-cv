import { NextRequest, NextResponse } from 'next/server';

const SYMBOLS_BY_CATEGORY: Record<string, string[]> = {
  Crypto: ['BTC/USD', 'ETH/USD', 'SOL/USD', 'XRP/USD', 'DOGE/USD'],
  Metals: ['XAU/USD', 'XAG/USD', 'XPT/USD', 'XPD/USD'],
  Forex: ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD'],
  Stocks: ['NVDA', 'TSLA', 'AAPL', 'AMZN', 'MSFT']
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category') || 'Crypto';
  const type = searchParams.get('type') || 'ticker'; // 'ticker', 'trending', 'news'
  
  const apiKey = process.env.TWELVE_DATA_API_KEY;
  const alphaKey = process.env.ALPHA_VANTAGE_API_KEY;
  const newsKey = process.env.NEWS_API_KEY;

  try {
    if (type === 'trending') {
      // Alpha Vantage Top Gainers/Losers
      const url = `https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${alphaKey}`;
      const resp = await fetch(url);
      const data = await resp.json();
      return NextResponse.json({ success: true, data: data.top_gainers?.slice(0, 5) || [] });
    }

    if (type === 'news') {
      // NewsAPI for detailed headlines
      const query = category === 'Crypto' ? 'crypto bitcoin' : 
                    category === 'Metals' ? 'gold silver metals' :
                    category === 'Forex' ? 'forex currency' : 'stocks market nvidia';
      
      const url = `https://newsapi.org/v2/everything?q=${query}&sortBy=publishedAt&pageSize=10&apiKey=${newsKey}`;
      const resp = await fetch(url);
      const data = await resp.json();
      return NextResponse.json({ success: true, data: data.articles || [] });
    }

    // Default: Ticker data
    const symbols = SYMBOLS_BY_CATEGORY[category] || SYMBOLS_BY_CATEGORY.Crypto;
    const url = `https://api.twelvedata.com/quote?symbol=${symbols.join(',')}&apikey=${apiKey}`;
    const resp = await fetch(url);
    const data = await resp.json();

    const results = symbols.map(s => {
      const quote = symbols.length > 1 ? data[s] : data;
      if (!quote) return null;
      
      return {
        symbol: s,
        price: parseFloat(quote.close || quote.price || '0'),
        change: parseFloat(quote.percent_change || '0'),
        isUp: parseFloat(quote.percent_change || '0') >= 0
      };
    }).filter(Boolean);

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Market Data API Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch market data' }, { status: 500 });
  }
}
