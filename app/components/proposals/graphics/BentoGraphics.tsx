'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function BentoVideo() {
  return (
    <div className="w-full max-w-[280px] h-[400px] md:h-[450px] bg-[#0e131f] border border-white/10 rounded-2xl relative overflow-hidden p-4 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2ddc80]/5 to-transparent" />
      {/* Cinematic Viewfinder */}
      <div className="absolute top-4 left-4 flex gap-2 items-center">
        <motion.div 
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_red]" 
        />
        <span className="text-[8px] font-black tracking-[0.3em] text-white/40">REC 00:24:12</span>
      </div>
      
      {/* Simulated Reels UI */}
      <div className="mt-8 w-full h-full flex flex-col gap-4">
        <div className="w-full h-[75%] bg-white/5 rounded-xl relative overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400')] bg-cover opacity-60" 
          />
          <div className="absolute bottom-4 left-4 flex flex-col gap-2 w-3/4">
             <div className="h-1.5 w-full bg-[#2ddc80]/40 rounded-full overflow-hidden">
                <motion.div 
                   animate={{ x: ["-100%", "100%"] }}
                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                   className="w-1/2 h-full bg-[#2ddc80]"
                />
             </div>
             <div className="h-1 w-1/2 bg-white/20 rounded-full" />
          </div>
        </div>
        <div className="flex justify-between items-center px-2">
           <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              <div className="w-3 h-3 bg-[#2ddc80] rounded-sm transform rotate-45" />
           </div>
           <div className="flex gap-2">
              <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10" />
              <div className="w-6 h-6 rounded-lg bg-white/5 border border-white/10" />
           </div>
        </div>
      </div>
    </div>
  );
}

export function BentoWeb() {
  return (
    <div className="w-full max-w-[450px] h-[220px] md:h-[260px] bg-[#0e131f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group">
      {/* Browser Bar */}
      <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-red-500/30" />
          <div className="w-2 h-2 rounded-full bg-yellow-500/30" />
          <div className="w-2 h-2 rounded-full bg-green-500/30" />
        </div>
        <div className="ml-4 h-4 w-48 bg-white/5 rounded-full flex items-center px-3">
           <span className="text-[7px] text-white/40 font-black tracking-widest uppercase">https://panenka.com.ve</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8 grid grid-cols-12 gap-6 h-full">
        <div className="col-span-7 flex flex-col gap-4">
           <div className="h-3 w-3/4 bg-white/10 rounded-full" />
           <div className="h-2 w-full bg-white/5 rounded-full" />
           <div className="h-2 w-2/3 bg-white/5 rounded-full" />
           <div className="mt-2 h-10 w-full bg-gradient-to-r from-[#2ddc80] to-[#2ddc80]/80 rounded-xl flex items-center justify-center shadow-[0_10px_20px_-10px_rgba(45,220,128,0.4)]">
              <span className="text-[10px] font-black text-[#0e131f] uppercase tracking-tighter">Confirmar Pedido</span>
           </div>
        </div>
        <div className="col-span-5 h-[120px] bg-white/[0.03] border border-white/5 rounded-2xl relative flex items-center justify-center overflow-hidden">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 opacity-20"
           >
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#2ddc80]" />
              <div className="absolute left-0 top-1/2 w-full h-[1px] bg-[#2ddc80]" />
           </motion.div>
           <div className="w-12 h-12 rounded-full bg-[#2ddc80] shadow-[0_0_30px_rgba(45,220,128,0.4)] relative z-10 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#0e131f] rounded-full border-t-transparent animate-spin" />
           </div>
        </div>
      </div>
    </div>
  );
}

export function BentoAdvantage() {
  return (
    <div className="w-full max-w-[320px] h-[320px] bg-[#0e131f] border border-white/10 rounded-[3rem] p-8 relative overflow-hidden group">
       <div className="absolute inset-0 bg-gradient-to-tr from-[#2ddc80]/10 to-transparent opacity-50" />
       <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
               <span className="text-[10px] font-black text-[#2ddc80] uppercase tracking-[0.3em]">Data Retention</span>
               <h4 className="text-white font-black text-4xl">100%</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#2ddc80]/20 border border-[#2ddc80]/30 flex items-center justify-center">
               <svg className="w-5 h-5 text-[#2ddc80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
               </svg>
            </div>
          </div>
          
          <div className="flex-1 flex items-end gap-3 h-32 mt-6">
             {[0.3, 0.5, 0.4, 0.7, 0.6, 0.9, 0.8, 1.2, 1.0, 1.4].map((height, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height * 60}%` }}
                  transition={{ delay: i * 0.05, duration: 1.5, ease: "easeOut" }}
                  className="flex-1 bg-gradient-to-t from-[#2ddc80]/0 via-[#2ddc80]/20 to-[#2ddc80] rounded-full group-hover:shadow-[0_0_20px_rgba(45,220,128,0.4)] transition-all duration-700"
                />
             ))}
          </div>
          <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[8px] font-black text-white/30 uppercase tracking-widest">
             <span>Market Entry</span>
             <span>Dominance</span>
          </div>
       </div>
    </div>
  );
}

export function BentoJourney() {
  return (
    <div className="w-full max-w-[380px] h-[380px] bg-[#0e131f] border border-white/10 rounded-[4rem] p-4 relative overflow-hidden flex flex-col items-center justify-center">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,220,128,0.05)_0%,transparent_70%)]" />
       <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
             <linearGradient id="funnelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2ddc80" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#2ddc80" stopOpacity="0.05" />
             </linearGradient>
          </defs>
          <motion.path 
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 3 }}
            d="M20 10 H80 L65 90 H35 Z" 
            fill="url(#funnelGrad)" 
            stroke="#2ddc80" 
            strokeWidth="0.5" 
            strokeDasharray="2 1"
          />
          
          {[20, 45, 70].map((y, i) => (
             <motion.line 
               key={i}
               initial={{ x1: 20 + i*5, x2: 80 - i*5 }}
               x1={20 + i*5} y1={y} x2={80 - i*5} y2={y} 
               stroke="white" strokeWidth="0.2" strokeOpacity="0.2" 
             />
          ))}

          <motion.circle 
            animate={{ cy: [15, 45, 80, 15], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            cx="50" cy="15" r="2.5" fill="#2ddc80" shadow="0 0 10px #2ddc80"
          />
          <motion.circle 
            animate={{ cy: [15, 45, 80, 15], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
            cx="42" cy="15" r="1.5" fill="#2ddc80" opacity="0.6"
          />
          <motion.circle 
            animate={{ cy: [15, 45, 80, 15], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2.5, ease: "easeInOut" }}
            cx="58" cy="15" r="1.5" fill="#2ddc80" opacity="0.6"
          />
          
          <text x="50" y="22" textAnchor="middle" className="fill-white font-black text-[3px] uppercase tracking-[0.4em]">Tráfico Frío</text>
          <text x="50" y="50" textAnchor="middle" className="fill-[#2ddc80] font-black text-[3px] uppercase tracking-[0.4em]">Interés Directo</text>
          <text x="50" y="85" textAnchor="middle" className="fill-white font-black text-[4px] uppercase tracking-[0.5em]">Venta Final</text>
       </svg>
    </div>
  );
}

export function BentoTracking() {
  return (
    <div className="w-full max-w-[320px] h-[320px] bg-[#0e131f] border border-white/10 rounded-full flex items-center justify-center relative group overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
       <div className="absolute inset-0 bg-[#2ddc80]/5" />
       <motion.div 
         animate={{ scale: [1, 1.4, 1], opacity: [0.05, 0.15, 0.05] }}
         transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
         className="absolute inset-0 bg-[#2ddc80] rounded-full blur-[60px]" 
       />
       <div className="relative z-10 w-24 h-24 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:bg-[#2ddc80]/10">
          <svg className="w-12 h-12 text-[#2ddc80] filter drop-shadow-[0_0_10px_rgba(45,220,128,0.5)]" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
       </div>
       
       <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {[...Array(12)].map((_, i) => {
             const angle = (i * 30) * (Math.PI / 180);
             const r = 100;
             const x = 50 + Math.cos(angle) * 35;
             const y = 50 + Math.sin(angle) * 35;
             return (
                <motion.circle 
                  key={i}
                  animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  cx={x} cy={y} r="0.8" fill="#2ddc80"
                />
             )
          })}
       </svg>
    </div>
  );
}

export function BentoAds() {
  return (
    <div className="w-full max-w-[500px] h-[280px] bg-[#0e131f] border border-white/10 rounded-[2.5rem] p-8 flex flex-col gap-6 relative shadow-2xl overflow-hidden">
       <div className="absolute top-0 right-0 w-48 h-48 bg-[#2ddc80]/5 rounded-full blur-3xl opacity-50" />
       <div className="flex justify-between items-start relative z-10">
          <div className="flex flex-col gap-1">
             <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Gestión Publicitaria</span>
             <h4 className="text-white font-black text-4xl tracking-tighter">ROI: 8.4x</h4>
          </div>
          <div className="px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-2 shadow-[0_5px_15px_rgba(16,185,129,0.1)]">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
             <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Optimización Activa</span>
          </div>
       </div>
       <div className="flex-1 flex gap-2 items-end py-2 relative z-10">
          {[40, 65, 35, 80, 95, 75, 90, 60, 85, 50, 70, 45].map((h, i) => (
             <div key={i} className="flex-1 bg-white/5 rounded-full relative h-[120px] overflow-hidden">
                <motion.div 
                   initial={{ height: 0 }}
                   whileInView={{ height: `${h}%` }}
                   transition={{ delay: i * 0.05, duration: 1, ease: "backOut" }}
                   className="absolute bottom-0 w-full bg-gradient-to-t from-[#2ddc80]/40 to-[#2ddc80] rounded-full" 
                />
             </div>
          ))}
       </div>
       <div className="border-t border-white/5 pt-6 flex justify-between items-center relative z-10">
          <div className="flex gap-4">
             <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">CPC: $0.12</span>
             <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">CTR: 4.8%</span>
          </div>
          <span className="text-[9px] font-black text-[#2ddc80] uppercase tracking-widest">Meta + Google Ads</span>
       </div>
    </div>
  );
}

export function BentoDesign() {
  return (
    <div className="w-full max-w-[360px] h-[360px] bg-[#0e131f] border border-white/10 rounded-[4rem] p-10 relative overflow-hidden group">
       <div className="absolute -top-20 -right-20 w-64 h-64 bg-[#2ddc80]/10 rounded-full blur-[80px]" />
       <div className="relative z-10 grid grid-cols-2 gap-4 h-full">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-4 flex flex-col justify-between"
          >
             <div className="w-8 h-8 rounded-lg bg-[#2ddc80]/20 border border-[#2ddc80]/30 shadow-inner" />
             <div className="flex flex-col gap-2">
                <div className="h-2 w-full bg-[#2ddc80] rounded-full" />
                <div className="h-1.5 w-1/2 bg-white/20 rounded-full" />
             </div>
          </motion.div>
          <motion.div 
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="bg-[#2ddc80] rounded-3xl relative overflow-hidden flex items-center justify-center p-6 shadow-[0_20px_40px_-10px_rgba(45,220,128,0.5)]"
          >
             <span className="text-[60px] font-black text-[#0e131f] tracking-tighter leading-none select-none">P</span>
             <div className="absolute top-2 right-2 w-4 h-4 border-2 border-white/20 rounded-full" />
          </motion.div>
          <div className="col-span-2 bg-white/[0.03] border border-white/10 rounded-3xl p-6 flex flex-col gap-4">
             <div className="flex justify-between items-center">
                <div className="flex gap-2">
                   <div className="w-3 h-3 rounded-full bg-red-400/60" />
                   <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                   <div className="w-3 h-3 rounded-full bg-green-400/60" />
                </div>
                <div className="h-1.5 w-24 bg-white/10 rounded-full" />
             </div>
             <div className="space-y-3">
                <div className="h-2 w-full bg-white/20 rounded-full" />
                <div className="h-2 w-full bg-white/10 rounded-full" />
                <div className="h-2 w-3/4 bg-white/5 rounded-full" />
             </div>
             <div className="mt-2 h-12 w-full border border-[#2ddc80]/30 rounded-2xl border-dashed flex items-center justify-center">
                 <span className="text-[10px] font-black text-[#2ddc80] uppercase tracking-widest">Upload Content</span>
             </div>
          </div>
       </div>
    </div>
  );
}
