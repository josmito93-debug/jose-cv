'use client';
import MarketView from '@/app/components/dashboard/MarketView';

export default function MetalsDashboard() {
  return (
    <MarketView 
      category="Metals"
      title="Heavy Metals"
      description="Safe Haven & Commodity Intelligence"
      symbols={[
        { symbol: 'GLD', name: 'Gold ETF', status: 'Active' },
        { symbol: 'SLV', name: 'Silver ETF', status: 'Consolidation' }
      ]}
    />
  );
}
