'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Wallet, CheckCircle2, PlayCircle, Loader2, CreditCard } from 'lucide-react';

interface PricingSummaryProps {
  phases: Array<{ name: string; investment: number }>;
  cta: string;
  clientSlug?: string;
  lang?: 'en' | 'es';
  ctaText?: string;
}

export default function PricingSummary({ phases, cta, clientSlug, lang = 'es', ctaText }: PricingSummaryProps) {
  const [isPaying, setIsPaying] = React.useState(false);
  const [showZelle, setShowZelle] = React.useState(false);

  const handlePayDeposit = async () => {
    if (!clientSlug) return;
    setIsPaying(true);
    try {
      const res = await fetch('/api/payment/stripe/one-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          clientId: clientSlug,
          amount: phases[0].investment,
          description: `Deposit for ${phases[0].name}`
        })
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        alert("Error al iniciar el pago: " + (data.error || "Desconocido"));
      }
    } catch (err) {
      alert("Error de conexión al procesar el pago.");
    } finally {
      setIsPaying(false);
    }
  };

  const total = phases.reduce((acc, curr) => acc + curr.investment, 0);
  
  const milestones = phases.map((phase, i) => {
    const isFirst = i === 0;
    const isLast = i === phases.length - 1;
    return {
      title: isFirst 
        ? (lang === 'en' ? (phases.length === 1 ? "Full Project Investment" : "Project Deposit") : "Reserva de Proyecto")
        : (isLast ? (lang === 'en' ? "Final Delivery" : "Entrega Final") : phase.name),
      description: isFirst 
        ? (lang === 'en' ? "Full 100% payment for the production and delivery of all high-end assets." : "Iniciamos con el pago inicial para el desarrollo de activos.") 
        : (lang === 'en' ? "Final balance for project completion and full asset delivery." : "Saldo para la entrega final de todos los activos."),
      amount: phase.investment,
      icon: isFirst ? <PlayCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />,
      status: isFirst ? (lang === 'en' ? "START" : "INICIO") : (lang === 'en' ? "COMPLETION" : "FINALIZACIÓN")
    };
  });

  return (
    <section className="py-32 md:py-48 px-6 relative overflow-hidden">
      {/* Background Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] bg-[url('/images/texture.png')] bg-repeat" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32 items-start">
          
          {/* Left Side: Summary & CTA */}
          <div className="lg:col-span-5 flex flex-col items-start text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-3 px-6 py-2 bg-[#2ddc80]/10 border border-[#2ddc80]/20 rounded-full mb-12"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#2ddc80] animate-pulse" />
              <span className="text-[#2ddc80] text-[10px] font-black uppercase tracking-widest">
                {lang === 'en' ? 'Billing Structure' : 'Esquema de Facturación'}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.85] uppercase mb-12"
            >
              {lang === 'en' ? 'Total' : 'Inversión'} <br />
              <span className="text-[#2ddc80]">{lang === 'en' ? 'Investment' : 'Total'}</span>
            </motion.h2>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="flex flex-col gap-6 w-full mb-16"
            >
              {phases.map((phase, i) => (
                <div key={i} className="flex justify-between items-end pb-4 border-b border-white/5">
                  <span className="text-white/40 font-bold uppercase tracking-widest text-xs">
                    {lang === 'en' ? 'Phase' : 'Fase'} 0{i+1}: {phase.name}
                  </span>
                  <span className="text-white font-black text-xl">${phase.investment.toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between items-end pt-4">
                <span className="text-white font-black uppercase tracking-[0.2em] text-sm">
                  {lang === 'en' ? 'TOTAL ACCUMULATED' : 'TOTAL ACUMULADO'}
                </span>
                <span className="text-[#2ddc80] font-black text-4xl tracking-tighter">${total.toLocaleString()}</span>
              </div>
            </motion.div>

            <div className="flex flex-col gap-4 w-full">
              <motion.button
                onClick={handlePayDeposit}
                disabled={isPaying}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex items-center justify-center gap-4 bg-white text-[#0e131f] px-12 py-6 rounded-[1.5rem] md:rounded-[2rem] font-black text-xl uppercase tracking-tighter shadow-[0_20px_40px_-15px_rgba(255,255,255,0.1)] hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50"
              >
                {isPaying ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    {lang === 'en' ? 'Pay Project Deposit' : 'Pagar Reserva ($1,000)'}
                    <CreditCard className="w-6 h-6" strokeWidth={3} />
                  </>
                )}
              </motion.button>

              <motion.a
                href={cta}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full inline-flex items-center justify-center gap-4 bg-[#2ddc80]/10 border border-[#2ddc80]/30 text-[#2ddc80] px-12 py-5 rounded-[1.5rem] md:rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-[#2ddc80]/20 transition-all"
              >
                {ctaText || (lang === 'en' ? 'Contact via WhatsApp' : 'Contactar por WhatsApp')}
                <ArrowRight className="w-5 h-5" strokeWidth={3} />
              </motion.a>

              <div className="mt-4 pt-4 border-t border-white/5 w-full">
                <button 
                  onClick={() => setShowZelle(!showZelle)}
                  className="w-full flex items-center justify-between px-6 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#673ab7] flex items-center justify-center text-white text-[10px] font-black italic">Z</div>
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Pagar con Zelle</span>
                  </div>
                  <ArrowRight className={`w-4 h-4 text-white/20 group-hover:text-white/60 transition-all ${showZelle ? 'rotate-90' : ''}`} />
                </button>

                <AnimatePresence>
                  {showZelle && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 p-6 bg-[#673ab7]/10 border border-[#673ab7]/30 rounded-2xl space-y-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-[#673ab7] uppercase tracking-widest">Account Name</p>
                          <p className="text-white font-black text-sm uppercase">universa Lab Media</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-[#673ab7] uppercase tracking-widest">Zelle Email / Phone</p>
                          <p className="text-white font-black text-xl tracking-tight">7863040124</p>
                        </div>
                        <p className="text-[10px] text-white/40 font-medium leading-relaxed">
                          Una vez realizado el pago, envía el comprobante por WhatsApp para activar tu proyecto.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Side: Visual Roadmap Diagram */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="relative">
              {/* Vertical Connection Line */}
              <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-gradient-to-bottom from-[#2ddc80] via-[#2ddc80]/20 to-transparent z-0" />
              
              <div className="flex flex-col gap-16 relative z-10">
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
                      <div className="flex justify-between items-center mb-2">
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

        <div className="mt-32 md:mt-48 pt-12 border-t border-white/5 text-center">
            <span className="text-white/10 text-[10px] font-bold tracking-[0.2em]">
              Universa Agency &copy; 2026 &nbsp;|&nbsp; {lang === 'en' ? 'Strategic Development Proposal' : 'Propuesta de Desarrollo Estratégico'}
            </span>
        </div>
      </div>
    </section>
  );
}
