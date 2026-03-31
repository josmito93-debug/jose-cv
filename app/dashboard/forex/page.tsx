'use client';
import MarketView from '@/app/components/dashboard/MarketView';

export default function ForexDashboard() {
  return (
    <MarketView 
      category="Forex"
      title="Currency Command"
      description="Global FX Neural Feed"
      symbols={[
        { symbol: 'EUR/USD', name: 'Euro / US Dollar', status: 'Active' },
        { symbol: 'USD/JPY', name: 'US Dollar / Yen', status: 'Neutral' }
      ]}
    />
  );
}
