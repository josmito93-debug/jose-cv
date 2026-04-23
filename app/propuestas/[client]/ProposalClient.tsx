'use client';

import React from 'react';
import { motion } from 'framer-motion';
import proposalsData from '@/data/proposals.json';
import UniversalProposalNav from '@/app/components/proposals/UniversalProposalNav';
import ProposalHero from '@/app/components/proposals/ProposalHero';
import PhaseSection from '@/app/components/proposals/PhaseSection';
import PricingSummary from '@/app/components/proposals/PricingSummary';
import SpaceRocks from '@/app/components/proposals/SpaceRocks';
import RelatedProjects from '@/app/components/proposals/RelatedProjects';

interface ProposalData {
  client: string;
  status?: string;
  title: string;
  lang?: 'en' | 'es';
  ctaText?: string;
  phases: Array<{
    id: number;
    name: string;
    investment: number;
    items: Array<{ title: string; description: string; bullets?: string[]; tag?: string; tagLabel?: string }>;
  }>;
  summary: string;
  cta: string;
  hideRelated?: boolean;
}

export default function ProposalClient({ clientSlug: initialSlug }: { clientSlug: string }) {
  const clientSlug = initialSlug?.toLowerCase();
  const proposal = (proposalsData as any)[clientSlug] as ProposalData;

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
    <main className="bg-[#0e131f] min-h-screen selection:bg-[#2ddc80] selection:text-[#0e131f] relative overflow-hidden">
      {/* Background Cinematic Motion Blur */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 100, -50, 0],
            y: [0, -80, 50, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] bg-[#2ddc80]/15 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -120, 80, 0],
            y: [0, 100, -50, 0],
            scale: [1, 0.8, 1.1, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[10%] w-[700px] h-[700px] bg-[#2ddc80]/10 blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, 50, -100, 0],
            y: [0, -50, 100, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[15%] w-[450px] h-[450px] bg-[#2ddc80]/15 blur-[130px] rounded-full"
        />
      </div>

      {/* Atmospheric Space Rocks */}
      <SpaceRocks />

      <div className="relative z-10 w-full h-full">
        <UniversalProposalNav clientName={proposal.client} lang={proposal.lang} />
        
        <ProposalHero 
          client={proposal.client} 
          status={proposal.status || "Análisis de Mercado Completado"}
          title={proposal.title} 
          summary={proposal.summary} 
          lang={proposal.lang}
        />

        <div className="relative">
          {proposal.phases.map((phase) => (
            <PhaseSection key={phase.id} phase={phase} lang={proposal.lang} />
          ))}
        </div>

        {!proposal.hideRelated && <RelatedProjects lang={proposal.lang} />}

        <PricingSummary 
          phases={proposal.phases} 
          cta={proposal.cta} 
          clientSlug={clientSlug}
          lang={proposal.lang}
          ctaText={proposal.ctaText}
        />
      </div>
    </main>
  );
}
