'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Video, Globe, ShieldCheck, Users, Activity, Megaphone, Palette, LucideIcon } from 'lucide-react';
import GraphicResolver from './graphics/GraphicResolver';

interface PhaseItem {
  title: string;
  description: string;
  bullets?: string[];
  tag?: string;
  tagLabel?: string;
  tagImage?: string;
  image?: string;
  icon?: string;
}

interface PhaseProps {
  phase: {
    id: number;
    name: string;
    investment: number;
    items: PhaseItem[];
  };
  lang?: 'en' | 'es';
}

const IconMap: Record<string, LucideIcon> = {
  video: Video,
  globe: Globe,
  shield: ShieldCheck,
  users: Users,
  activity: Activity,
  megaphone: Megaphone,
  palette: Palette
};

export default function PhaseSection({ phase, lang = 'es' }: PhaseProps) {
  return (
    <section className="py-24 md:py-48 px-6 relative overflow-hidden">
      {/* Background Illumination (Emerald Aura) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,220,128,0.15)_0%,transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          {/* Phase Header - Sticky only on large screens */}
          <div className="lg:col-span-4 flex flex-col items-start lg:sticky lg:top-32 h-fit mb-8 lg:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[#2ddc80] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-4"
            >
              {lang === 'en' ? 'Phase' : 'Fase'} {phase.id}
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
                {lang === 'en' ? 'Investment' : 'Inversión'}
              </span>
              <span className="text-[#0e131f] text-2xl md:text-3xl font-black tracking-tight">
                ${phase.investment.toLocaleString()}
              </span>
            </motion.div>
          </div>

          {/* Phase Items */}
          <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
            {phase.items.map((item, index) => {
              const IconComponent = (item.icon && IconMap[item.icon]) || Check;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group relative bg-[#0e131f]/70 backdrop-blur-md rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-500 overflow-hidden flex flex-col"
                >
                  {/* Luxury Card Texture Layer - Extreme Fine Grain */}
                  <div className="absolute inset-0 z-0 opacity-[0.25] bg-[url('/images/texture.png')] bg-repeat bg-[length:50px_50px] pointer-events-none" />

                  {/* Absolute Status Tag - Image or Text Label */}
                  {(item.tagImage || item.tagLabel) && (
                    <div className="absolute top-6 right-6 md:top-10 md:right-10 z-30">
                      {item.tagImage ? (
                        <div className="relative group/tag">
                          <img 
                            src={item.tagImage} 
                            alt={item.tagLabel || ""} 
                            className="w-16 h-16 md:w-20 md:h-20 object-contain drop-shadow-[0_0_15px_rgba(45,220,128,0.3)] group-hover/tag:scale-110 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2 group-hover:border-[#2ddc80]/30 transition-colors">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#2ddc80] animate-pulse shadow-[0_0_8px_#2ddc80]" />
                          <span className="text-white font-black text-[9px] uppercase tracking-[0.2em]">
                            {item.tagLabel}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* 
                     Luxury Gradient Border
                     A pseudo-border that is transparent at the top and emerald at the bottom 
                  */}
                  <div 
                    className="absolute inset-0 rounded-[1.5rem] md:rounded-[2.5rem] border-[2.5px] border-transparent transition-all duration-500 z-10 pointer-events-none"
                    style={{
                      maskImage: 'linear-gradient(to bottom, transparent, black)',
                      WebkitMaskImage: 'linear-gradient(to bottom, transparent 20%, black 100%)',
                      borderColor: 'rgba(45, 220, 128, 0.5)'
                    }}
                  />
                  
                  {/* Bottom Glow Aura */}
                  <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#2ddc80]/10 blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Content Block */}
                  <div className="relative z-10 flex flex-col items-start p-10 md:p-14 pb-8 flex-1">
                    {/* Semantic Icon at Top-Left */}
                    <div className="mb-8 flex-shrink-0 w-10 h-10 rounded-lg bg-[#2ddc80]/10 flex items-center justify-center border border-[#2ddc80]/20 shadow-[0_0_20px_rgba(45,220,128,0.1)] group-hover:scale-110 transition-transform duration-500">
                      <IconComponent className="w-5 h-5 text-[#2ddc80]" strokeWidth={2.5} />
                    </div>
                    
                    <div className="flex flex-col gap-4 md:gap-10 w-full">
                      <div className="flex flex-col gap-3">
                        <h3 className="text-white font-black text-2xl md:text-3xl tracking-tight uppercase group-hover:text-[#2ddc80] transition-colors leading-none">
                          {item.title}
                        </h3>
                        <p className="text-white/80 text-base md:text-lg font-medium leading-relaxed max-w-[65ch]">
                          {item.description}
                        </p>
                      </div>

                      {item.bullets && (
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 mt-2">
                          {item.bullets.map((bullet, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-white/50 text-sm md:text-base font-medium group-hover:text-white/80 transition-colors">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#2ddc80] shadow-[0_0_8px_#2ddc80]" />
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Cinematic UI Image */}
                  {item.image && (
                    <div className="relative z-20 px-10 md:px-14 pb-14">
                      <div className="relative rounded-2xl overflow-hidden border border-white/5 bg-black/40 group-hover:border-[#2ddc80]/20 transition-all duration-500 shadow-2xl">
                        <img 
                          src={item.image} 
                          alt={item.title}
                          className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {/* Full-width Graphics Block (Legacy / Special Tags) */}
                  {item.tag && !item.image && (
                    <div className="relative z-20 w-full mt-auto border-t border-white/5 bg-white/[0.01]">
                      <div className="w-full flex justify-center items-center py-12 md:py-20 px-10 md:px-14 transition-transform duration-500 group-hover:scale-[1.01]">
                        {item.tag.startsWith('/') ? (
                          <img 
                            src={item.tag} 
                            alt="" 
                            className="w-full max-w-lg h-auto object-contain opacity-60 group-hover:opacity-100 transition-all duration-500"
                          />
                        ) : (
                          <div className="w-full flex justify-center opacity-70 group-hover:opacity-100 transition-all duration-500">
                            <GraphicResolver id={item.tag} />
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Visual Divider */}
      <div className="w-full max-w-7xl mx-auto h-[1px] bg-white/5 mt-32 md:mt-48 shadow-[0_-10px_30px_rgba(45,220,128,0.05)]" />
    </section>
  );
}
