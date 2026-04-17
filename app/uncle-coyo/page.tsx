'use client';

import React from 'react';
import { motion } from 'framer-motion';
import proposalsData from '@/data/proposals.json';
import UniversalProposalNav from '@/app/components/proposals/UniversalProposalNav';
import ProposalHero from '@/app/components/proposals/ProposalHero';
import PhaseSection from '@/app/components/proposals/PhaseSection';
import PricingSummary from '@/app/components/proposals/PricingSummary';
import SpaceRocks from '@/app/components/proposals/SpaceRocks';

export default function UncleCoyoProposalPage() {
  const proposal = (proposalsData as any)["uncle_coyo"];

  if (!proposal) {
    return (
      <div className="min-h-screen bg-[#0e131f] flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl font-black text-white mb-4 uppercase tracking-tighter">Propuesta no encontrada</h1>
        <a href="/" className="mt-8 text-[#2ddc80] font-bold uppercase tracking-widest text-xs border-b border-[#2ddc80]/30 pb-1">Volver al inicio</a>
      </div>
    );
  }

  return (
    <main className="bg-[#0e131f] min-h-screen selection:bg-[#2ddc80] selection:text-[#0e131f] relative overflow-hidden font-sans">
      {/* Background Cinematic Motion Blur */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 80, -40, 0], y: [0, -60, 40, 0], scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[5%] -left-[5%] w-[600px] h-[600px] bg-[#2ddc80]/15 blur-[100px] rounded-full"
        />
        <motion.div 
          animate={{ x: [0, -100, 60, 0], y: [0, 80, -40, 0], scale: [1, 0.9, 1.1, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[30%] -right-[5%] w-[800px] h-[800px] bg-[#2ddc80]/10 blur-[140px] rounded-full"
        />
        <motion.div 
          animate={{ x: [0, 60, -80, 0], y: [0, -30, 70, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-15%] left-[10%] w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full"
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

        {/* Timeline & Delivery Commitment */}
        <div className="max-w-7xl mx-auto px-6 mb-24">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            <div className="p-10 bg-white/[0.03] border border-white/10 rounded-[3rem] relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-[#2ddc80]/10 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:bg-[#2ddc80]/20 transition-colors" />
               <span className="text-[#2ddc80] text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Velocidad de Implementación</span>
               <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-6 leading-none">
                 Timeline: <br />
                 <span className="text-[#2ddc80]">&lt; 7 Días Hábiles</span>
               </h3>
               <p className="text-white/50 text-sm font-medium leading-relaxed max-w-md">
                 Sistema completo llave en mano. Desde la configuración de Clover hasta el despliegue de las campañas de Ads iniciales.
               </p>
            </div>

            <div className="p-10 bg-gradient-to-br from-[#2ddc80]/20 to-transparent border border-[#2ddc80]/30 rounded-[3rem] flex flex-col justify-center">
               <span className="text-white text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">Objetivo de Conversión</span>
               <h3 className="text-4xl font-black text-white tracking-tighter uppercase mb-6 leading-tight">
                 Reducción de Comisiones <br />
                 <span className="opacity-50 line-through text-2xl md:text-3xl">Hasta 30% en Apps</span>
               </h3>
               <div className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#2ddc80] animate-pulse" />
                  <p className="text-[#2ddc80] text-sm font-black uppercase tracking-[0.1em]">Soberanía Digital Total</p>
               </div>
            </div>
          </motion.div>
        </div>
        {/* Facebook Pixel & Data Power Section */}
        <div className="max-w-7xl mx-auto px-6 mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 md:p-16 bg-white/[0.03] border border-white/10 rounded-[3rem] relative overflow-hidden group shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2ddc80]/5 blur-[120px] rounded-full -mr-40 -mt-40 group-hover:bg-[#2ddc80]/10 transition-colors" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="text-[#2ddc80] text-[10px] font-black uppercase tracking-[0.5em] mb-6 block">Inteligencia Comercial</span>
                <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-8 leading-none">
                  El Poder del <br />
                  <span className="text-[#2ddc80]">Facebook Pixel</span>
                </h3>
                
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-black text-white/40">01</span>
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Captura Inmediata (Cliente Frío)</h4>
                      <p className="text-white/40 text-[11px] font-medium leading-relaxed">
                        Desde que el usuario entra a la web, el Píxel ya está trabajando. Capturamos su data sin que tenga que realizar ninguna acción manual. Ya sabemos quién es.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-xl bg-[#2ddc80]/20 border border-[#2ddc80]/30 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-black text-[#2ddc80]">02</span>
                    </div>
                    <div>
                      <h4 className="text-[#2ddc80] font-black uppercase tracking-widest text-sm mb-2">Intención Real (Cliente Tibio)</h4>
                      <p className="text-white/40 text-[11px] font-medium leading-relaxed">
                        Si alguien agrega al carrito, el sistema lo marca como "Ready para comprar". Es un cliente tibio que solo necesita un empujón final para convertirse.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <div className="w-10 h-10 rounded-xl bg-[#2ddc80] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(45,220,128,0.4)]">
                      <span className="text-[10px] font-black text-[#0e131f]">03</span>
                    </div>
                    <div>
                      <h4 className="text-white font-black uppercase tracking-widest text-sm mb-2">Conversión Total (Cliente Caliente)</h4>
                      <p className="text-white/40 text-[11px] font-medium leading-relaxed">
                        Al dar clic en comprar, el eco-sistema identifica el perfil exacto de tu cliente ideal. Esto permite que Facebook busque a miles de personas idénticas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-12 p-6 bg-[#2ddc80]/5 border-l-2 border-[#2ddc80] rounded-r-xl">
                  <p className="text-[#2ddc80] text-[11px] font-bold leading-relaxed italic">
                    "Creamos este ecosistema para que Uncle Coyo's recupere el control: más ventas en delivery sin comisiones externas y recolección de data de cada visitante."
                  </p>
                </div>
              </div>

              <div className="bg-[#0e131f]/50 border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                 {/* Visual Funnel Representation */}
                 <div className="flex flex-col gap-6">
                    {[
                      { l: 'Visitantes', p: '100%', o: 0.2 },
                      { l: 'Vieron Menú', p: '65%', o: 0.4 },
                      { l: 'Agregaron Carrito', p: '35%', o: 0.6 },
                      { l: 'Compraron', p: '12%', o: 1 },
                    ].map((step, i) => (
                      <div key={i} className="flex flex-col gap-2">
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-40">
                          <span>{step.l}</span>
                          <span>{step.p}</span>
                        </div>
                        <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: step.p }}
                            transition={{ delay: i * 0.1, duration: 1.5 }}
                            className="h-full bg-[#2ddc80]"
                            style={{ opacity: step.o }}
                          />
                        </div>
                      </div>
                    ))}
                 </div>
                 
                 <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-center">
                    <div className="flex items-center gap-3 px-4 py-2 bg-[#2ddc80]/10 border border-[#2ddc80]/20 rounded-full">
                       <div className="w-1.5 h-1.5 rounded-full bg-[#2ddc80] animate-pulse" />
                       <span className="text-[9px] font-black text-[#2ddc80] uppercase tracking-widest">Pixel Active & Learning</span>
                    </div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="relative">
          {proposal.phases.map((phase: any) => (
            <PhaseSection key={phase.id} phase={phase} />
          ))}
        </div>

        <PricingSummary 
          phases={proposal.phases.map((p: any) => ({
            name: p.name,
            investment: p.investment
          }))} 
          cta={proposal.cta} 
        />

        {/* Closing Quote */}
        <div className="max-w-7xl mx-auto px-6 py-32 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <span className="w-12 h-[1px] bg-[#2ddc80]/50 mb-12" />
              <h4 className="text-white/30 text-xl md:text-3xl font-black uppercase tracking-[0.3em] max-w-4xl leading-tight">
                "Esto no es una página web. Es la construcción de un activo digital propio que convierte tráfico en clientes."
              </h4>
              <span className="w-12 h-[1px] bg-[#2ddc80]/50 mt-12" />
            </motion.div>
        </div>
      </div>
    </main>
  );
}
