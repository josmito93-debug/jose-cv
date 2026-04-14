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
    <section className="relative min-h-[90dvh] flex flex-col justify-center px-6 pt-20 overflow-hidden bg-[#0e131f]">
      {/* Background Cinematic Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.2, 0.1],
            x: [0, 50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] bg-[#2ddc80]/10 blur-[120px] rounded-full"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-8 flex flex-col items-start gap-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="flex items-center gap-4"
            >
              <div className="h-px w-12 bg-[#2ddc80]" />
              <span className="text-[#2ddc80] font-bold text-xs uppercase tracking-[0.3em]">
                Propuesta Estratégica
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
              className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[0.9] uppercase"
            >
              {title} <br />
              <span className="text-white/20">PARA {client}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
              className="text-lg md:text-xl text-white/50 max-w-xl font-medium leading-relaxed mt-6"
            >
              {summary}
            </motion.p>
          </div>

          <div className="lg:col-span-4 flex flex-col items-end text-right gap-6 pb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.4 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] w-full"
            >
              <span className="block text-[#2ddc80] text-[10px] uppercase tracking-widest font-black mb-2">
                ESTADO ACTUAL
              </span>
              <p className="text-white font-bold text-2xl tracking-tight leading-tight uppercase">
                Análisis <br /> de Mercado <br /> Completado
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
