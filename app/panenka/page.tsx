'use client';

import React from 'react';
import { motion } from 'framer-motion';
import proposalsData from '@/data/proposals.json';
import UniversalProposalNav from '@/app/components/proposals/UniversalProposalNav';
import ProposalHero from '@/app/components/proposals/ProposalHero';
import PhaseSection from '@/app/components/proposals/PhaseSection';
import PricingSummary from '@/app/components/proposals/PricingSummary';
import SpaceRocks from '@/app/components/proposals/SpaceRocks';

export default function PanenkaProposalPage() {
  const proposal = (proposalsData as any)["panenka"];

  if (!proposal) {
    return (
      <div className="min-h-screen bg-[#0e131f] flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Propuesta no encontrada</h1>
        <a href="/" className="mt-8 text-[#2ddc80] font-bold uppercase tracking-widest text-xs border-b border-[#2ddc80]/30 pb-1">Volver al inicio</a>
      </div>
    );
  }

  return (
    <main className="bg-[#0e131f] min-h-screen selection:bg-[#2ddc80] selection:text-[#0e131f] relative overflow-hidden">
      {/* Background Cinematic Motion Blur */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 100, -50, 0], y: [0, -80, 50, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] bg-[#2ddc80]/15 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ x: [0, -120, 80, 0], y: [0, 100, -50, 0], scale: [1, 0.8, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[10%] w-[700px] h-[700px] bg-[#2ddc80]/10 blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ x: [0, 50, -100, 0], y: [0, -50, 100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[15%] w-[450px] h-[450px] bg-[#2ddc80]/15 blur-[130px] rounded-full"
        />
      </div>

      <SpaceRocks />

      <div className="relative z-10 w-full h-full">
        <UniversalProposalNav clientName={proposal.client} />
        
        <ProposalHero 
          client={proposal.client} 
          status={proposal.status}
          title={proposal.title} 
          summary={proposal.summary} 
        />

        {/* Special Offer Banner */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 bg-gradient-to-r from-[#2ddc80]/20 to-transparent border border-[#2ddc80]/30 rounded-[2rem] md:rounded-[3.5rem] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-32 h-32 text-[#2ddc80]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/></svg>
            </div>
            <div className="relative z-10">
              <span className="text-[#2ddc80] text-xs font-black uppercase tracking-[0.3em] mb-4 block">Oferta de Lanzamiento Universa</span>
              <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
                Valor Estándar: <span className="line-through opacity-30">$2,300</span> <br />
                <span className="text-[#2ddc80]">Inversión Especial: $600</span>
              </h3>
              <p className="text-white/60 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
                Esta oferta es exclusiva para el primer mes de gestión introductiva, permitiéndonos demostrar el ROI real del ecosistema antes de escalar a la inversión estándar.
              </p>
            </div>
          </motion.div>
        </div>

        <div className="relative">
          {proposal.phases.map((phase: any) => (
            <PhaseSection key={phase.id} phase={phase} />
          ))}
        </div>

        <PricingSummary 
          phases={[
            { name: "Introductory Offer (First Month)", investment: 600 }
          ]} 
          cta={proposal.cta} 
        />
      </div>
    </main>
  );
}
