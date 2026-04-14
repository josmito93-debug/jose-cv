'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import proposalsData from '@/data/proposals.json';
import UniversalProposalNav from '@/app/components/proposals/UniversalProposalNav';
import ProposalHero from '@/app/components/proposals/ProposalHero';
import PhaseSection from '@/app/components/proposals/PhaseSection';
import PricingSummary from '@/app/components/proposals/PricingSummary';

interface ProposalData {
  client: string;
  title: string;
  phases: Array<{
    id: number;
    name: string;
    investment: number;
    items: Array<{ title: string; description: string }>;
  }>;
  summary: string;
  cta: string;
}

export default function ProposalPage() {
  const params = useParams();
  const clientSlug = (params.client as string)?.toLowerCase();
  const proposal = (proposalsData as Record<string, ProposalData>)[clientSlug];

  if (!proposal) {
    return (
      <div className="min-h-screen bg-[#0e131f] flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Propuesta no encontrada</h1>
        <p className="text-white/40 max-w-md">No hemos encontrado una propuesta activa para este identificador. Por favor, verifica el enlace.</p>
        <a href="/" className="mt-8 text-[#2ddc80] font-bold uppercase tracking-widest text-xs border-b border-[#2ddc80]/30 pb-1">Volver al inicio</a>
      </div>
    );
  }

  return (
    <main className="bg-[#0e131f] min-h-screen selection:bg-[#2ddc80] selection:text-[#0e131f]">
      <UniversalProposalNav clientName={proposal.client} />
      
      <ProposalHero 
        client={proposal.client} 
        title={proposal.title} 
        summary={proposal.summary} 
      />

      <div className="relative z-10 bg-[#0e131f]">
        {proposal.phases.map((phase) => (
          <PhaseSection key={phase.id} phase={phase} />
        ))}
      </div>

      <PricingSummary 
        phases={proposal.phases} 
        cta={proposal.cta} 
      />
    </main>
  );
}
