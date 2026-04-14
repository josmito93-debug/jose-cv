'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface PricingSummaryProps {
  phases: Array<{ investment: number }>;
  cta: string;
}

export default function PricingSummary({ phases, cta }: PricingSummaryProps) {
  const total = phases.reduce((acc, curr) => acc + curr.investment, 0);

  return (
    <section className="py-20 md:py-32 px-6 relative bg-white/[0.02]">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-6 py-2 bg-[#2ddc80]/10 border border-[#2ddc80]/20 rounded-full mb-8 md:mb-12"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#2ddc80] animate-pulse" />
          <span className="text-[#2ddc80] text-[10px] font-black uppercase tracking-widest">
            Resumen de Inversión
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tighter text-white leading-[0.85] uppercase mb-8 md:mb-12"
        >
          Total <br />
          <span className="text-[#2ddc80]">${total.toLocaleString()}</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/60 text-sm md:text-xl font-medium mb-12 md:mb-16 uppercase tracking-tight max-w-lg mx-auto leading-relaxed"
        >
          Infraestructura de ventas digital diseñada <br className="hidden md:block" /> para el crecimiento de tu marca.
        </motion.p>

        <motion.a
          href={cta}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center gap-4 bg-[#2ddc80] text-[#0e131f] px-8 md:px-12 py-5 md:py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-lg md:text-xl uppercase tracking-tighter shadow-[0_20px_40px_-15px_rgba(45,220,128,0.4)]"
        >
          Aceptar Propuesta
          <ArrowRight className="w-5 h-5 md:w-6 md:h-6" strokeWidth={3} />
        </motion.a>
        
        <div className="mt-12">
            <span className="text-white/10 text-[10px] font-bold uppercase tracking-[0.4em]">
              Universa Agency &copy; 2026
            </span>
        </div>
      </div>
    </section>
  );
}
