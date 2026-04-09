'use client';

import SectorTerminal from '@/app/components/dashboard/SectorTerminal';
import { TrendingUp } from 'lucide-react';

export default function StocksPage() {
  return <SectorTerminal sector="Stocks" title="Stocks & Equities" icon={TrendingUp} />;
}
