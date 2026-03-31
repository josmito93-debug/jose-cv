'use client';
import MarketView from '@/app/components/dashboard/MarketView';

export default function CryptoDashboard() {
  return (
    <MarketView 
      category="Crypto"
      title="Neural Crypto"
      description="Blockchain Sentiment & Volatility Analysis"
      symbols={[
        { symbol: 'BTC', name: 'Bitcoin', status: 'Active' },
        { symbol: 'ETH', name: 'Ethereum', status: 'Stable' },
        { symbol: 'SOL', name: 'Solana', status: 'Bullish' }
      ]}
    />
  );
}
