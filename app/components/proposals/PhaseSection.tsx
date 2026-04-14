'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PhaseItem {
  title: string;
  description: string;
  bullets?: string[];
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
    <section className="py-16 md:py-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Phase Header - Sticky only on large screens */}
          <div className="lg:col-span-4 flex flex-col items-start lg:sticky lg:top-32 h-fit mb-8 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[#2ddc80] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-4"
            >
              Fase {phase.id}
              <div className="h-[1px] w-8 bg-[#2ddc80]/30" />
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-[0.9] uppercase mb-6"
            >
              {phase.name}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#2ddc80] px-6 py-4 rounded-2xl flex flex-col gap-1 items-start shadow-lg shadow-[#2ddc80]/10"
            >
              <span className="text-[#0e131f] text-[10px] font-black uppercase tracking-widest opacity-60">
                Inversión
              </span>
              <span className="text-[#0e131f] text-2xl md:text-3xl font-black tracking-tight">
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
                className="group relative bg-[#0e131f] hover:bg-white/[0.04] border border-[#2ddc80]/20 hover:border-[#2ddc80]/50 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] transition-all duration-500 overflow-hidden"
              >
                {/* Subtle Emerald Refraction Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#2ddc80]/5 blur-[60px] pointer-events-none" />
                
                <div className="flex gap-4 md:gap-6 items-start">
                  <div className="mt-1 flex-shrink-0 w-7 h-7 rounded-lg bg-[#2ddc80]/10 flex items-center justify-center border border-[#2ddc80]/20">
                    <Check className="w-4 h-4 text-[#2ddc80]" strokeWidth={3} />
                  </div>
                  
                  <div className="flex flex-col gap-2 md:gap-4 w-full">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-white font-black text-xl md:text-2xl tracking-tight uppercase group-hover:text-[#2ddc80] transition-colors leading-none">
                        {item.title}
                      </h3>
                      <p className="text-white/80 text-sm font-medium leading-relaxed max-w-[65ch]">
                        {item.description}
                      </p>
                    </div>

                    {item.bullets && (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mt-2">
                        {item.bullets.map((bullet, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-white/50 text-[13px] font-medium group-hover:text-white/80 transition-colors">
                            <div className="w-1 h-1 rounded-full bg-[#2ddc80]" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Visual Divider */}
      <div className="w-full max-w-7xl mx-auto h-[1px] bg-white/5 mt-20 md:mt-32" />
    </section>
  );
}
