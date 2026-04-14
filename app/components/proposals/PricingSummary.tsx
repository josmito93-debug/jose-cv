'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Wallet, CheckCircle2, PlayCircle } from 'lucide-react';

interface PricingSummaryProps {
  phases: Array<{ name: string; investment: number }>;
  cta: string;
}

export default function PricingSummary({ phases, cta }: PricingSummaryProps) {
  const total = phases.reduce((acc, curr) => acc + curr.investment, 0);
  
  // Phase 1 Breakdown
  const p1_total = phases[0]?.investment || 0;
  const p1_start = p1_total * 0.5;
  const p1_end = p1_total * 0.5;
  
  // Phase 2 Breakdown
  const p2_total = phases[1]?.investment || 0;
  const p2_start = p2_total * 0.5;
  const p2_end = p2_total * 0.5;

  const milestones = [
    {
      title: "Inicio de Proyecto",
      description: "50% de la Fase 01 para comenzar",
      amount: p1_start,
      icon: <PlayCircle className="w-5 h-5" />,
      status: "Reserva"
    },
    {
      title: "Cierre de Fase 01",
      description: "50% restante al finalizar el desarrollo estratégico",
      amount: p1_end,
      icon: <CheckCircle2 className="w-5 h-5" />,
      status: "Entregable"
    },
    {
      title: "Inicio de Fase 02",
      description: "50% de la Fase 02 para integración de sistemas",
      amount: p2_start,
      icon: <Wallet className="w-5 h-5" />,
      status: "Integración"
    },
    {
       title: "Lanzamiento Final",
       description: "Saldo final para entrega de claves y acceso total",
       amount: p2_end,
       icon: <ArrowRight className="w-5 h-5" />,
       status: "Finalización"
    }
  ];

  return (
    <section className="py-20 md:py-32 px-6 relative overflow-hidden">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-[url('/images/texture.png')] bg-repeat" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20 items-start">
          
          {/* Left Side: Summary & CTA */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-6 py-2 bg-[#2ddc80]/10 border border-[#2ddc80]/20 rounded-full mb-8"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#2ddc80] animate-pulse" />
              <span className="text-[#2ddc80] text-[10px] font-black uppercase tracking-widest">
                Esquema de Facturación
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.85] uppercase mb-8"
            >
              Inversión <br />
              <span className="text-[#2ddc80]">Total</span>
            </motion.h2>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="flex flex-col gap-4 w-full mb-12"
            >
              {phases.map((phase, i) => (
                <div key={i} className="flex justify-between items-end pb-4 border-b border-white/5">
                  <span className="text-white/40 font-bold uppercase tracking-widest text-xs">Fase 0{i+1}: {phase.name}</span>
                  <span className="text-white font-black text-xl">${phase.investment.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between items-end pt-4">
                <span className="text-white font-black uppercase tracking-[0.2em] text-sm">TOTAL ACUMULADO</span>
                <span className="text-[#2ddc80] font-black text-4xl tracking-tighter">${total.toLocaleString()}</span>
              </div>
            </motion.div>

            <motion.a
              href={cta}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full inline-flex items-center justify-center gap-4 bg-[#2ddc80] text-[#0e131f] px-12 py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-xl uppercase tracking-tighter shadow-[0_20px_40px_-15px_rgba(45,220,128,0.4)]"
            >
              Aceptar Propuesta
              <ArrowRight className="w-6 h-6" strokeWidth={3} />
            </motion.a>
          </div>

          {/* Right Side: Visual Roadmap Diagram */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="relative">
              {/* Vertical Connection Line */}
              <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-gradient-to-bottom from-[#2ddc80] via-[#2ddc80]/20 to-transparent z-0" />
              
              <div className="flex flex-col gap-10 relative z-10">
                {milestones.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 items-start group"
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#0e131f] border border-[#2ddc80]/30 flex items-center justify-center text-[#2ddc80] shadow-[0_10px_20px_rgba(45,220,128,0.1)] group-hover:scale-110 transition-transform duration-500">
                      {m.icon}
                    </div>
                    
                    <div className="flex flex-col gap-1 pt-1 flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#2ddc80] text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                          {m.status}
                        </span>
                        <span className="text-white font-black text-2xl tracking-tighter">
                          ${m.amount.toLocaleString()}
                        </span>
                      </div>
                      <h3 className="text-white font-black text-xl uppercase tracking-tight leading-none group-hover:text-[#2ddc80] transition-colors">
                        {m.title}
                      </h3>
                      <p className="text-white/40 text-[13px] font-medium leading-relaxed max-w-[30ch]">
                        {m.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>

        <div className="mt-20 md:mt-32 pt-12 border-t border-white/5 text-center">
            <span className="text-white/10 text-[10px] font-bold uppercase tracking-[0.4em]">
              Universa Agency &copy; 2026 &nbsp;|&nbsp; Propuesta de Desarrollo Estratégico
            </span>
        </div>
      </div>
    </section>
  );
}
