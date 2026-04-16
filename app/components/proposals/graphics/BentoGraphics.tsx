'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function BentoVideo() {
  return (
    <div className="w-full max-w-[320px] h-[450px] md:h-[500px] bg-[#0e131f] border border-white/10 rounded-2xl relative overflow-hidden p-4 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2ddc80]/5 to-transparent" />
      
      {/* Corner Crop Markers (L-Shapes) */}
      <div className="absolute top-6 left-6 w-4 h-4 border-l-2 border-t-2 border-[#2ddc80]/40 rounded-tl-sm pointer-events-none" />
      <div className="absolute top-6 right-6 w-4 h-4 border-r-2 border-t-2 border-[#2ddc80]/40 rounded-tr-sm pointer-events-none" />
      <div className="absolute bottom-24 left-6 w-4 h-4 border-l-2 border-b-2 border-[#2ddc80]/40 rounded-bl-sm pointer-events-none" />
      <div className="absolute bottom-24 right-6 w-4 h-4 border-r-2 border-b-2 border-[#2ddc80]/40 rounded-br-sm pointer-events-none" />

      {/* Cinematic Viewfinder HUD */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-20">
        <div className="flex gap-2 items-center px-3 py-1 bg-black/40 backdrop-blur-md border border-white/5 rounded-full">
           <motion.div 
             animate={{ opacity: [1, 0, 1] }}
             transition={{ duration: 1, repeat: Infinity }}
             className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_red]" 
           />
           <span className="text-[7px] font-black tracking-[0.2em] text-white/80">REC</span>
        </div>
        <div className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/5 rounded-full">
           <span className="text-[7px] font-black tracking-[0.2em] text-[#2ddc80]">4K 60FPS</span>
        </div>
      </div>

      {/* Battery/Storage HUD (Top Right) */}
      <div className="absolute top-6 right-10 flex flex-col gap-1 items-end opacity-40 z-20">
         <div className="flex gap-1 items-center">
            <span className="text-[6px] font-black text-white uppercase tracking-tighter">SD1</span>
            <div className="w-4 h-2 bg-emerald-500/30 border border-white/10 rounded-sm overflow-hidden">
               <div className="w-3/4 h-full bg-emerald-400" />
            </div>
         </div>
         <span className="text-[5px] font-bold text-white/60">01:24:12</span>
      </div>
      
      {/* Simulated Reels UI with Camera Elements */}
      <div className="mt-8 w-full h-full flex flex-col gap-4">
        <div className="w-full h-[80%] bg-white/5 rounded-xl relative overflow-hidden group/view">
          {/* Main Visual */}
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=400')] bg-cover opacity-60" 
          />
          
          {/* Pro Center Crosshair/Focus */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <motion.div 
                animate={{ scale: [1, 0.95, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 border border-[#2ddc80]/30 rounded-lg flex items-center justify-center"
             >
                <div className="w-1 h-[1px] bg-[#2ddc80]" />
                <div className="h-1 w-[1px] bg-[#2ddc80]" />
             </motion.div>
          </div>

          {/* Histogram (Mini) */}
          <div className="absolute bottom-6 right-6 w-16 h-8 flex items-end gap-[1px] opacity-40">
             {[30, 45, 20, 60, 80, 50, 40, 25, 70, 55].map((h, i) => (
                <div key={i} className="flex-1 bg-white/40" style={{ height: `${h}%` }} />
             ))}
          </div>

          <div className="absolute bottom-4 left-4 flex flex-col gap-2 w-3/4 z-20">
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

        {/* Camera Info Bar (PRO Settings) */}
        <div className="flex justify-between items-center px-4 py-2 bg-black/20 border-t border-white/5 -mt-4 relative z-30">
           <div className="flex gap-4">
              <div className="flex flex-col">
                 <span className="text-[5px] font-black text-white/30 uppercase tracking-widest">ISO</span>
                 <span className="text-[8px] font-black text-white/80">400</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[5px] font-black text-white/30 uppercase tracking-widest">Speed</span>
                 <span className="text-[8px] font-black text-white/80">1/50</span>
              </div>
              <div className="flex flex-col">
                 <span className="text-[5px] font-black text-white/30 uppercase tracking-widest">Iris</span>
                 <span className="text-[8px] font-black text-white/80">f/2.8</span>
              </div>
           </div>
           <div className="w-8 h-8 rounded-full bg-[#2ddc80]/10 border border-[#2ddc80]/30 flex items-center justify-center transition-transform hover:scale-110">
              <div className="w-2.5 h-2.5 bg-[#2ddc80] rounded-sm transform rotate-45 shadow-[0_0_8px_#2ddc80]" />
           </div>
        </div>
      </div>
    </div>
  );
}

export function BentoWeb() {
  return (
    <div className="w-full max-w-[600px] h-[240px] md:h-[300px] bg-[#0e131f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group">
      {/* Browser Bar */}
      <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-6 gap-3">
        <div className="flex gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
        </div>
        <div className="ml-4 h-5 w-64 bg-white/5 rounded-full flex items-center px-4">
           <span className="text-[8px] text-white/40 font-black tracking-widest uppercase">https://panenka-houston.com</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-10 grid grid-cols-12 gap-10 h-full">
        <div className="col-span-7 flex flex-col gap-6">
           <div className="h-4 w-3/4 bg-white/10 rounded-full" />
           <div className="h-2.5 w-full bg-white/5 rounded-full" />
           <div className="h-2.5 w-2/3 bg-white/5 rounded-full" />
           <div className="mt-4 h-12 w-full bg-gradient-to-r from-[#2ddc80] to-[#2ddc80]/80 rounded-xl flex items-center justify-center shadow-[0_15px_30px_-10px_rgba(45,220,128,0.5)]">
              <span className="text-xs font-black text-[#0e131f] uppercase tracking-widest">Hacer Pedido</span>
           </div>
        </div>
        <div className="col-span-5 h-[160px] bg-white/[0.03] border border-white/5 rounded-[2rem] relative flex items-center justify-center overflow-hidden">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
             className="absolute inset-0 opacity-20"
           >
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-[#2ddc80]" />
              <div className="absolute left-0 top-1/2 w-full h-[1px] bg-[#2ddc80]" />
           </motion.div>
           <div className="w-16 h-16 rounded-full bg-[#2ddc80] shadow-[0_0_40px_rgba(45,220,128,0.6)] relative z-10 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#0e131f] rounded-full border-t-transparent animate-spin" />
           </div>
        </div>
      </div>
    </div>
  );
}

export function BentoAdvantage() {
  return (
    <div className="w-full max-w-[360px] h-[360px] bg-[#0e131f] border border-white/10 rounded-[3.5rem] p-10 relative overflow-hidden group">
       <div className="absolute inset-0 bg-gradient-to-tr from-[#2ddc80]/10 to-transparent opacity-50" />
       <div className="relative z-10 flex flex-col h-full justify-between">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
               <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-pulse" />
                  <span className="text-[7px] font-black text-blue-400 uppercase tracking-widest">Meta Pixel Active</span>
               </div>
               <span className="text-[12px] font-black text-[#2ddc80] uppercase tracking-[0.4em]">Analytics</span>
               <h4 className="text-white font-black text-5xl tracking-tighter">100%</h4>
            </div>
            <div className="flex flex-col items-end gap-2">
               <div className="w-12 h-12 rounded-full bg-[#2ddc80]/20 border border-[#2ddc80]/30 flex items-center justify-center">
                  <svg className="w-6 h-6 text-[#2ddc80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
               </div>
               <div className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-full">
                  <span className="text-[5px] font-black text-white/40 uppercase tracking-widest">Source: Proprietary</span>
               </div>
            </div>
          </div>
          
          <div className="flex-1 flex items-end gap-3.5 h-40 mt-8">
             {[0.3, 0.5, 0.4, 0.7, 0.6, 0.9, 0.8, 1.2, 1.0, 1.4].map((height, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height * 65}%` }}
                  transition={{ delay: i * 0.05, duration: 1.5, ease: "easeOut" }}
                  className="flex-1 bg-gradient-to-t from-[#2ddc80]/0 via-[#2ddc80]/20 to-[#2ddc80] rounded-full group-hover:shadow-[0_0_30px_rgba(45,220,128,0.5)] transition-all duration-700"
                />
             ))}
          </div>
          <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[9px] font-black text-white/40 uppercase tracking-[0.3em]">
             <span>Start</span>
             <span>Growth</span>
          </div>
       </div>
    </div>
  );
}

export function BentoJourney() {
  return (
    <div className="w-full max-w-[420px] h-[420px] bg-[#0e131f] border border-white/10 rounded-[5rem] p-6 relative overflow-hidden flex flex-col items-center justify-center">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,220,128,0.08)_0%,transparent_70%)]" />
       <svg className="w-full h-full" viewBox="0 0 100 100">
          <defs>
             <linearGradient id="funnelGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2ddc80" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#2ddc80" stopOpacity="0.05" />
             </linearGradient>
          </defs>
          <motion.path 
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 3, ease: "easeInOut" }}
            d="M20 10 H80 L68 90 H32 Z" 
            fill="url(#funnelGrad)" 
            stroke="#2ddc80" 
            strokeWidth="0.6" 
            strokeDasharray="3 1"
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
            cx="50" cy="15" r="3" fill="#2ddc80" shadow="0 0 15px #2ddc80"
          />
          <motion.circle 
            animate={{ cy: [15, 45, 80, 15], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 1.5, ease: "easeInOut" }}
            cx="40" cy="15" r="2" fill="#2ddc80" opacity="0.6"
          />
          <motion.circle 
            animate={{ cy: [15, 45, 80, 15], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, delay: 2.5, ease: "easeInOut" }}
            cx="60" cy="15" r="2" fill="#2ddc80" opacity="0.6"
          />
          
          <text x="50" y="24" textAnchor="middle" className="fill-white font-black text-[4px] uppercase tracking-[0.5em]">Usuarios</text>
          <text x="50" y="52" textAnchor="middle" className="fill-[#2ddc80] font-black text-[4px] uppercase tracking-[0.5em]">Clientes</text>
          <text x="50" y="88" textAnchor="middle" className="fill-white font-black text-[5px] uppercase tracking-[0.6em]">Ventas</text>
       </svg>
    </div>
  );
}

export function BentoTracking() {
  return (
    <div className="w-full max-w-[360px] h-[360px] bg-[#0e131f] border border-white/10 rounded-full flex items-center justify-center relative group overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.6)]">
       <div className="absolute inset-0 bg-[#2ddc80]/5" />
       <motion.div 
         animate={{ scale: [1, 1.5, 1], opacity: [0.05, 0.2, 0.05] }}
         transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
         className="absolute inset-0 bg-[#2ddc80] rounded-full blur-[80px]" 
       />
       <div className="relative z-10 w-28 h-28 bg-white/5 border border-white/10 backdrop-blur-3xl rounded-[2.5rem] flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:scale-110 group-hover:bg-[#2ddc80]/15">
          <svg className="w-14 h-14 text-[#2ddc80] filter drop-shadow-[0_0_15px_rgba(45,220,128,0.7)]" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
       </div>
       
       <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {[...Array(16)].map((_, i) => {
             const angle = (i * (360/16)) * (Math.PI / 180);
             const r = 100;
             const x = 50 + Math.cos(angle) * 38;
             const y = 50 + Math.sin(angle) * 38;
             return (
                <motion.circle 
                  key={i}
                  animate={{ opacity: [0, 1, 0], scale: [0, 2, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.25 }}
                  cx={x} cy={y} r="1" fill="#2ddc80"
                />
             )
          })}
       </svg>
    </div>
  );
}

export function BentoAds() {
  return (
    <div className="w-full max-w-[600px] h-[300px] bg-[#0e131f] border border-white/10 rounded-[3rem] p-10 flex flex-col gap-8 relative shadow-2xl overflow-hidden">
       <div className="absolute top-0 right-0 w-64 h-64 bg-[#2ddc80]/5 rounded-full blur-[100px] opacity-60" />
       <div className="flex justify-between items-start relative z-10">
          <div className="flex flex-col gap-2">
             <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em]">Propagandastic</span>
             <h4 className="text-white font-black text-5xl tracking-tighter">ROI: 8.4x</h4>
          </div>
          <div className="px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-3 shadow-[0_10px_20px_rgba(16,185,129,0.15)]">
             <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
             <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em]">Active AI Node</span>
          </div>
       </div>
       <div className="flex-1 flex gap-3 items-end py-4 relative z-10">
          {[40, 65, 35, 80, 95, 75, 90, 60, 85, 50, 70, 45, 90, 100, 80].map((h, i) => (
             <div key={i} className="flex-1 bg-white/5 rounded-full relative h-[140px] overflow-hidden">
                <motion.div 
                   initial={{ height: 0 }}
                   whileInView={{ height: `${h}%` }}
                   transition={{ delay: i * 0.04, duration: 1.2, ease: "backOut" }}
                   className="absolute bottom-0 w-full bg-gradient-to-t from-[#2ddc80]/50 to-[#2ddc80] rounded-full" 
                />
             </div>
          ))}
       </div>
       <div className="border-t border-white/5 pt-8 flex justify-between items-center relative z-10">
          <div className="flex gap-8">
             <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">CPC: $0.08</span>
             <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">CTR: 5.2%</span>
          </div>
          <span className="text-[10px] font-black text-[#2ddc80] uppercase tracking-[0.4em]">Viral AI Scaling</span>
       </div>
    </div>
  );
}

export function BentoDesign() {
  return (
    <div className="w-full max-w-[420px] h-[420px] bg-[#0e131f] border border-white/10 rounded-[5rem] p-12 relative overflow-hidden group">
       <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#2ddc80]/15 rounded-full blur-[100px]" />
       <div className="relative z-10 grid grid-cols-2 gap-6 h-full">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 flex flex-col justify-between"
          >
             <div className="w-12 h-12 rounded-xl bg-[#2ddc80]/20 border border-[#2ddc80]/30 shadow-inner flex items-center justify-center" />
             <div className="flex flex-col gap-3">
                <div className="h-2.5 w-full bg-[#2ddc80] rounded-full" />
                <div className="h-2 w-1/2 bg-white/20 rounded-full" />
             </div>
          </motion.div>
          <motion.div 
            animate={{ rotate: [-8, 8, -8] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="bg-[#2ddc80] rounded-[2.5rem] relative overflow-hidden flex items-center justify-center p-8 shadow-[0_25px_50px_-15px_rgba(45,220,128,0.6)]"
          >
             <span className="text-[80px] font-black text-[#0e131f] tracking-tighter leading-none select-none">P</span>
             <div className="absolute top-4 right-4 w-6 h-6 border-2 border-white/30 rounded-full" />
          </motion.div>
          <div className="col-span-2 bg-white/[0.03] border border-white/10 rounded-[3rem] p-8 flex flex-col gap-6">
             <div className="flex justify-between items-center">
                <div className="flex gap-3">
                   <div className="w-4 h-4 rounded-full bg-red-400/70" />
                   <div className="w-4 h-4 rounded-full bg-yellow-400/70" />
                   <div className="w-4 h-4 rounded-full bg-green-400/70" />
                </div>
                <div className="h-2 w-32 bg-white/10 rounded-full" />
             </div>
             <div className="space-y-4">
                <div className="h-2.5 w-full bg-white/20 rounded-full" />
                <div className="h-2.5 w-full bg-white/15 rounded-full" />
                <div className="h-2.5 w-3/4 bg-white/10 rounded-full" />
             </div>
             <div className="mt-4 h-16 w-full border border-[#2ddc80]/30 rounded-[2rem] border-dashed flex items-center justify-center group-hover:bg-[#2ddc80]/5 transition-colors">
                 <span className="text-[12px] font-black text-[#2ddc80] uppercase tracking-[0.4em]">Load Sales Assets</span>
             </div>
          </div>
       </div>
    </div>
  );
}
