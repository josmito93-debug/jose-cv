'use client';

import SectorTerminal from '@/app/components/dashboard/SectorTerminal';
import { Cpu } from 'lucide-react';

export default function CryptoPage() {
  return <SectorTerminal sector="Crypto" title="Crypto Intelligence" icon={Cpu} />;
}
