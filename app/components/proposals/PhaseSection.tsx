'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PhaseItem {
  title: string;
  description: string;
}

interface PhaseProps {
  phase: {
    id: number;
    name: string;
    investment: number;
    items: PhaseItem[];
  };
}

export default function PhaseSection({ phase }: PhaseProps) {
  return (
    <section className="py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Phase Header */}
          <div className="lg:col-span-4 flex flex-col items-start sticky top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[#2ddc80] font-black text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-4"
            >
              Fase {phase.id}
              <div className="h-[1px] w-8 bg-[#2ddc80]/30" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-none uppercase mb-6"
            >
              {phase.name}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#2ddc80] px-6 py-4 rounded-2xl flex flex-col gap-1 items-start"
            >
              <span className="text-[#0e131f] text-[10px] font-black uppercase tracking-widest opacity-60">
                Inversión
              </span>
              <span className="text-[#0e131f] text-3xl font-black tracking-tight">
                ${phase.investment.toLocaleString()}
              </span>
            </motion.div>
          </div>

          {/* Phase Items */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {phase.items.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.05 }}
                className="group relative bg-[#0e131f] hover:bg-white/[0.03] border border-white/5 hover:border-[#2ddc80]/20 p-8 rounded-[2rem] transition-all duration-500"
              >
                {/* Subtle Refraction Border (Bias Correction 4) */}
                <div className="absolute inset-0 rounded-[2rem] border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                
                <div className="flex flex-col gap-3">
                  <h3 className="text-white font-black text-xl tracking-tight uppercase group-hover:text-[#2ddc80] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-white/40 text-sm leading-relaxed max-w-[65ch]">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Visual Divider (Bias Correction 4 - Anti-Card Overuse) */}
      <div className="w-full max-w-7xl mx-auto h-[1px] bg-white/5 mt-32" />
    </section>
  );
}
