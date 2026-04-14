'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ProposalHeroProps {
  client: string;
  title: string;
  summary: string;
}

export default function ProposalHero({ client, title, summary }: ProposalHeroProps) {
  return (
    <section className="relative min-h-[90dvh] md:min-h-[80dvh] flex flex-col justify-center px-6 pt-24 md:pt-32 pb-12 overflow-hidden bg-[#0e131f]">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1],
            x: [0, 30, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[5%] w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-[#2ddc80]/10 blur-[100px] md:blur-[120px] rounded-full"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12 items-end">
          <div className="lg:col-span-8 flex flex-col items-start gap-5 md:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="flex items-center gap-4"
            >
              <div className="h-[2px] w-8 md:w-12 bg-[#2ddc80]" />
              <span className="text-[#2ddc80] font-black text-[10px] md:text-xs uppercase tracking-[0.4em]">
                Propuesta Estratégica
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] uppercase"
            >
              {title} <br />
              <span className="text-white/10">PARA {client}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
              className="text-base md:text-xl text-white/80 max-w-xl font-medium leading-relaxed mt-4 md:mt-6"
            >
              {summary}
            </motion.p>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end text-left lg:text-right gap-6 pb-4 w-full">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
              className="relative group bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] w-full lg:max-w-xs overflow-hidden shadow-2xl"
            >
              {/* Animated Accent Glow */}
              <div className="absolute -bottom-1/2 -right-1/2 w-48 h-48 bg-[#2ddc80]/20 blur-[60px] rounded-full group-hover:bg-[#2ddc80]/30 transition-colors" />
              
              <span className="block text-[#2ddc80] text-[10px] uppercase tracking-widest font-black mb-2 relative z-10">
                ESTADO ACTUAL
              </span>
              <p className="text-white font-black text-xl md:text-2xl tracking-tight leading-tight uppercase relative z-10">
                Análisis <br className="hidden lg:block" /> de Mercado <br className="hidden lg:block" /> Completado
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
