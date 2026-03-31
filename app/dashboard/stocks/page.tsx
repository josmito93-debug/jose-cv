'use client';
import MarketView from '@/app/components/dashboard/MarketView';

export default function StocksDashboard() {
  return (
    <MarketView 
      category="Stocks"
      title="Equity Intelligence"
      description="High-Growth Options & Stock Analysis"
      symbols={[
        { symbol: 'TSLA', name: 'Tesla Inc.', status: 'Volatile' },
        { symbol: 'NVDA', name: 'Nvidia Corp.', status: 'Hyper-Bullish' },
        { symbol: 'AAPL', name: 'Apple Inc.', status: 'Active' }
      ]}
    />
  );
}
