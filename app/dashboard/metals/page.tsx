'use client';

import SectorTerminal from '@/app/components/dashboard/SectorTerminal';
import { Zap } from 'lucide-react';

export default function MetalsPage() {
  return <SectorTerminal sector="Metals" title="Metals Command" icon={Zap} />;
}
