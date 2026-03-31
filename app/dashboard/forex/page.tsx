'use client';

import SectorTerminal from '@/app/components/dashboard/SectorTerminal';
import { RefreshCcw } from 'lucide-react';

export default function ForexPage() {
  return <SectorTerminal sector="Forex" title="Forex Surveillance" icon={RefreshCcw} />;
}
