'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
            cx="50" cy="15" r="3" fill="#2ddc80"
            style={{ filter: 'drop-shadow(0 0 8px #2ddc80)' }}
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

export function BentoEcosystem() {
  return (
    <div className="w-full max-w-[600px] h-[350px] bg-[#0e131f] border border-white/10 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group shadow-2xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,220,128,0.05)_0%,transparent_60%)]" />
      
      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-[#2ddc80] uppercase tracking-[0.4em]">Integrated Architecture</span>
            <h4 className="text-white font-black text-4xl tracking-tighter">Digital Ecosystem</h4>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#2ddc80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-1.5l1.13-1.13a4.5 4.5 0 001.272-3.181V5.125c0-.621.504-1.125 1.125-1.125h.75c.621 0 1.125.504 1.125 1.125v4.576c0 .62.247 1.214.686 1.654l1.17 1.17a3 3 0 010 4.242 3 3 0 01-4.242 0z" />
            </svg>
          </div>
        </div>

        <div className="flex items-center justify-between relative py-6">
          {/* Path Line */}
          <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2ddc80]/30 to-transparent -translate-y-1/2" />
          
          {[
            { label: 'ADS', icon: 'megaphone' },
            { label: 'WEB', icon: 'globe' },
            { label: 'CLOVER', icon: 'pos' },
            { label: 'SALES', icon: 'check' }
          ].map((step, i) => (
            <motion.div 
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center gap-3 relative z-10"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#0e131f] border border-[#2ddc80]/30 flex items-center justify-center shadow-[0_0_20px_rgba(45,220,128,0.15)] group-hover:border-[#2ddc80] transition-colors duration-500">
                <div className="w-6 h-6 bg-[#2ddc80]/20 rounded-lg animate-pulse" />
              </div>
              <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.2em]">{step.label}</span>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex gap-6 text-[8px] font-black text-white/30 uppercase tracking-[0.3em] overflow-hidden whitespace-nowrap">
          <motion.div 
            animate={{ x: [0, -100, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="flex gap-10"
          >
            <span>Instagram Bio Hub &bull; Direct Checkout &bull; Real Time Orders &bull; Clover Sync &bull; No Commissions</span>
            <span>Instagram Bio Hub &bull; Direct Checkout &bull; Real Time Orders &bull; Clover Sync &bull; No Commissions</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function BentoQR() {
  return (
    <div className="w-full max-w-[360px] h-[450px] bg-[#0e131f] border border-white/10 rounded-[4rem] p-6 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2ddc80]/10 to-transparent opacity-30" />
      
      {/* Mobile Mockup */}
      <div className="mx-auto w-[240px] h-full bg-black border-[6px] border-[#1a1f2e] rounded-[3rem] relative shadow-2xl overflow-hidden mt-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1a1f2e] rounded-b-2xl z-20" />
        
        <div className="p-6 pt-12 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="h-3 w-1/2 bg-white/10 rounded-full" />
            <div className="h-6 w-3/4 bg-[#2ddc80]/20 border border-[#2ddc80]/30 rounded-lg" />
          </div>

          <div className="aspect-square w-full bg-white/5 border border-dashed border-[#2ddc80]/30 rounded-3xl flex items-center justify-center p-8 relative overflow-hidden">
            <motion.div 
              animate={{ rotate: 90 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border-[10px] border-[#2ddc80]/20 rounded-2xl" 
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-white/[0.03] border border-white/10 rounded-lg flex items-center justify-center">
                 <div className="w-16 h-16 grid grid-cols-4 grid-rows-4 gap-1 opacity-40">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className={`bg-[#2ddc80] ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} />
                    ))}
                 </div>
              </div>
            </div>
            {/* Scan Line */}
            <motion.div 
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-[2px] bg-[#2ddc80] shadow-[0_0_15px_#2ddc80] z-10" 
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="h-10 w-full bg-[#2ddc80] rounded-xl flex items-center justify-center shadow-[0_10px_20px_rgba(45,220,128,0.3)]">
               <span className="text-[10px] font-black text-[#0e131f] uppercase tracking-widest">Pagar Orden</span>
            </div>
            <div className="h-2 w-1/3 bg-white/10 rounded-full self-center" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-0 w-full text-center px-10">
        <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em]">QR Ordering System</span>
      </div>
    </div>
  );
}

export function BentoDataTracking() {
  return (
    <div className="w-full max-w-[420px] h-[350px] bg-[#0e131f] border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
      <div className="flex flex-col h-full justify-between relative z-10">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-black text-[#2ddc80] uppercase tracking-[0.4em]">Data Science</span>
          <h4 className="text-white font-black text-4xl tracking-tighter">Pixel Funnel</h4>
        </div>

        <div className="flex flex-col gap-4 mt-8">
          {[
            { label: 'Cold Traffic', color: 'bg-white/10', width: '100%', count: '24.5k' },
            { label: 'Menu Interaction', color: 'bg-[#2ddc80]/20', width: '75%', count: '12.2k' },
            { label: 'Add to Cart', color: 'bg-[#2ddc80]/40', width: '45%', count: '4.8k' },
            { label: 'Completed Sale', color: 'bg-[#2ddc80]', width: '25%', count: '1.2k' },
          ].map((row, i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-40">
                <span>{row.label}</span>
                <span>{row.count}</span>
              </div>
              <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: row.width }}
                  transition={{ delay: i * 0.1, duration: 1.5, ease: "easeOut" }}
                  className={`h-full ${row.color}`} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BentoClover() {
  return (
    <div className="w-full max-w-[360px] h-[360px] bg-[#0e131f] border border-white/10 rounded-[3.5rem] p-8 relative overflow-hidden group flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,220,128,0.1)_0%,transparent_70%)] opacity-50" />
      
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Connection Orbits */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-2 border-dashed border-[#2ddc80]/20 rounded-full" 
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute inset-4 border border-dashed border-[#2ddc80]/10 rounded-full" 
        />

        {/* Central Clover Node */}
        <div className="w-24 h-24 bg-[#0e131f] border border-[#2ddc80]/40 rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(45,220,128,0.2)] relative z-20">
           <div className="flex flex-col items-center gap-1">
             <div className="w-8 h-8 rounded-lg bg-[#2ddc80] flex items-center justify-center shadow-[0_0_20px_#2ddc80]">
                <div className="w-4 h-4 border-2 border-[#0e131f]" />
             </div>
             <span className="text-[8px] font-black text-[#2ddc80] tracking-widest mt-2 uppercase">CLOVER</span>
           </div>
        </div>

        {/* Satellite Nodes */}
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2"
        >
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
           <span className="text-[7px] font-black text-white/60 tracking-widest uppercase">Syncing Orders</span>
        </motion.div>
      </div>

      <div className="mt-8 text-center">
        <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em]">Clover POS Integration</span>
      </div>
    </div>
  );
}

export function BentoEvents() {
  return (
    <div className="w-full max-w-[420px] h-[350px] bg-[#0e131f] border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10" />
      
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em]">Nightlife Strategy</span>
            <h4 className="text-white font-black text-4xl tracking-tighter">RWR Records</h4>
          </div>
          <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full">
            <span className="text-[8px] font-black text-white/40 uppercase tracking-[0.2em]">Live Events</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 relative py-10">
           {/* Abstract Audio Visualization */}
           <div className="flex items-end gap-1 h-20">
              {[...Array(15)].map((_, i) => (
                <motion.div 
                  key={i}
                  animate={{ height: [20, 80, 40, 90, 30] }}
                  transition={{ delay: i * 0.1, duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  className="w-2 bg-gradient-to-t from-purple-500 to-blue-400 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                />
              ))}
           </div>
        </div>

        <div className="flex justify-between items-center text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">
           <span>Activaciones</span>
           <span>&bull;</span>
           <span>Tráfico Nocturno</span>
           <span>&bull;</span>
           <span>Engagement</span>
        </div>
      </div>
    </div>
  );
}

export function BentoComparison() {
  const [step, setStep] = React.useState(0);
  const [isClicking, setIsClicking] = React.useState(false);
  const [showShockwave, setShowShockwave] = React.useState(false);
  
  const images = [
    '/proposals/uncle-coyo/website-yes-1.png',
    '/proposals/uncle-coyo/website-yes-3.png',
    '/proposals/uncle-coyo/website-yes-2.png',
  ];

  // Steps: 
  // 0: Image 1 - Cursor Moving to +
  // 1: Image 1 - Clic +
  // 2: Transition to Image 2
  // 3: Image 2 - Cursor Moving to Pagar
  // 4: Image 2 - Clic Pagar
  // 5: Transition to Image 3 (Success)
  // 6: Success Wait & Loop

  React.useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runSequence = async () => {
      // Step 0 -> 1: Move to + and Click
      setStep(0);
      await new Promise(r => setTimeout(r, 1500));
      setIsClicking(true);
      setShowShockwave(true);
      await new Promise(r => setTimeout(r, 400));
      setIsClicking(false);
      setShowShockwave(false);
      
      // Step 1 -> 2: Transition to Img 2
      await new Promise(r => setTimeout(r, 300));
      setStep(2);
      
      // Step 2 -> 3: Move to Pagar and Click
      await new Promise(r => setTimeout(r, 1500));
      setIsClicking(true);
      setShowShockwave(true);
      await new Promise(r => setTimeout(r, 400));
      setIsClicking(false);
      setShowShockwave(false);

      // Step 3 -> 4: Transition to Img 3
      await new Promise(r => setTimeout(r, 300));
      setStep(4);
      
      // Success Wait
      await new Promise(r => setTimeout(r, 3000));
      setStep(6); // Reset Trigger
    };

    runSequence();
    const interval = setInterval(runSequence, 10000);
    return () => clearInterval(interval);
  }, []);

  // Cursor Positions based on steps
  const cursorCoords = React.useMemo(() => {
    if (step <= 1) return { x: '78%', y: '32%' }; // Position of the Red + Button
    if (step >= 2 && step <= 4) return { x: '50%', y: '88%' }; // Position of Pagar Button
    return { x: '50%', y: '50%' };
  }, [step]);

  return (
    <div className="w-full max-w-[900px] bg-[#0e131f] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden group shadow-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* YES Side (Animated) */}
        <div className="flex flex-col gap-6">
          <div className="relative group/yes">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#2ddc80] to-[#2ddc80]/50 rounded-xl blur opacity-10 group-hover/yes:opacity-30 transition duration-1000"></div>
            
            <div className="relative aspect-[3/5] w-full bg-[#0e131f] border border-[#2ddc80]/60 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(45,220,128,0.1)]">
              {/* Checkmark Badge */}
              <div className="absolute top-4 left-4 z-30 w-8 h-8 bg-[#2ddc80] rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-[#0e131f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              {/* Image Layer */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <motion.div 
                   animate={{ 
                     scale: isClicking ? 0.995 : 1,
                     filter: isClicking ? 'brightness(1.1)' : 'brightness(1)'
                   }}
                   className="w-full h-full relative"
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={step < 2 ? 0 : step < 4 ? 1 : 2}
                      src={images[step < 2 ? 0 : step < 4 ? 1 : 2]}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8 }}
                      className="absolute inset-0 w-full object-cover object-top"
                    />
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Simulation Layer (Cursor & Shockwave) */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                {/* Virtual Cursor */}
                {step < 5 && (
                  <motion.div
                    animate={{ 
                      left: cursorCoords.x, 
                      top: cursorCoords.y,
                      scale: isClicking ? 0.8 : 1
                    }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="absolute w-8 h-8 -ml-4 -mt-4 flex items-center justify-center"
                  >
                    {/* Visual Cursor Circle */}
                    <div className="w-full h-full rounded-full border-2 border-white bg-black/20 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center">
                       <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    </div>
                    
                    {/* Shockwave Effect */}
                    {showShockwave && (
                      <motion.div 
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 4, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="absolute w-full h-full rounded-full bg-white ring-4 ring-white"
                      />
                    )}
                  </motion.div>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-[#2ddc80] animate-pulse" />
                 <span className="text-[#2ddc80] text-[10px] font-black uppercase tracking-[0.4em]">Experiencia Optimizada</span>
              </div>
              <p className="text-white/60 text-[11px] font-medium leading-relaxed">Simulación de pedido: Scan &bull; Order &bull; Pay en menos de 30 segundos.</p>
            </div>
          </div>

          {/* CTA Button */}
          <motion.a
            href="https://unclecoyo.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-4 bg-gradient-to-r from-[#2ddc80] to-[#2ddc80]/80 rounded-xl flex items-center justify-center gap-3 shadow-[0_20px_40px_-10px_rgba(45,220,128,0.4)] group/btn relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
            <span className="text-[12px] font-black text-[#0e131f] uppercase tracking-[0.2em] relative z-10">Ver Website en Vivo</span>
            <svg className="w-4 h-4 text-[#0e131f] relative z-10 animate-bounce-x" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.a>
        </div>

        {/* NO Side (Static) */}
        <div className="flex flex-col gap-6">
          <div className="relative">
            <div className="relative aspect-[3/5] w-full bg-[#0e131f] border border-red-500/30 rounded-xl overflow-hidden shadow-2xl">
              {/* X Badge */}
              <div className="absolute top-4 left-4 z-20 w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>

              <img 
                src="/proposals/uncle-coyo/website-no.png" 
                className="w-full object-cover object-top" 
                alt="Website No"
              />
            </div>
            
            <div className="mt-4 flex flex-col gap-2 border-l border-red-500/20 pl-4">
              <span className="text-red-500/60 text-[10px] font-black uppercase tracking-[0.4em]">Estado Actual / Genérico</span>
              <p className="text-white/30 text-[11px] font-medium leading-relaxed">Interfaces limitadas que no capturan la esencia del negocio.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BentoMilexPortfolio() {
  return (
    <div className="w-full max-w-[500px] h-[300px] bg-[#0e131f] border border-white/10 rounded-3xl relative overflow-hidden group/portfolio">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2ddc80]/5 to-transparent" />
      
      {/* Viewfinder HUD */}
      <div className="absolute inset-4 border border-white/5 rounded-2xl pointer-events-none z-20">
        <div className="absolute top-4 left-4 w-6 h-[1px] bg-[#2ddc80]/40" />
        <div className="absolute top-4 left-4 w-[1px] h-6 bg-[#2ddc80]/40" />
        <div className="absolute top-4 right-4 w-6 h-[1px] bg-[#2ddc80]/40" />
        <div className="absolute top-4 right-4 w-[1px] h-6 bg-[#2ddc80]/40" />
        <div className="absolute bottom-4 left-4 w-6 h-[1px] bg-[#2ddc80]/40" />
        <div className="absolute bottom-4 left-4 w-[1px] h-6 bg-[#2ddc80]/40" />
        <div className="absolute bottom-4 right-4 w-6 h-[1px] bg-[#2ddc80]/40" />
        <div className="absolute bottom-4 right-4 w-[1px] h-6 bg-[#2ddc80]/40" />
      </div>

      <div className="p-8 h-full flex gap-6">
        <div className="w-1/2 h-full bg-white/5 rounded-xl relative overflow-hidden">
          <motion.img 
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 15, repeat: Infinity }}
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=400" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-4 left-4 flex flex-col gap-1">
             <span className="text-[8px] font-black text-[#2ddc80] uppercase tracking-widest">Shutter: 1/125</span>
             <span className="text-[10px] font-black text-white uppercase tracking-tighter">PORTFOLIO_V1.RAW</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 py-2">
           <div className="flex justify-between items-center">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Exif Data</span>
              <div className="flex gap-1">
                 <div className="w-1 h-1 rounded-full bg-[#2ddc80]" />
                 <div className="w-1 h-1 rounded-full bg-[#2ddc80]/30" />
              </div>
           </div>
           
           <div className="flex flex-col gap-3">
              {[
                { label: 'ISO', val: '100' },
                { label: 'F-STOP', val: 'f/1.8' },
                { label: 'FOCUS', val: 'AUTO_AI' }
              ].map((stat, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5">
                   <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">{stat.label}</span>
                   <span className="text-[10px] font-black text-[#2ddc80] uppercase tracking-tighter">{stat.val}</span>
                </div>
              ))}
           </div>

           <div className="mt-auto h-12 w-full border border-[#2ddc80]/20 rounded-lg flex items-center justify-center bg-[#2ddc80]/5">
              <span className="text-[8px] font-black text-[#2ddc80] uppercase tracking-[0.3em]">Cinematic Rendering</span>
           </div>
        </div>
      </div>
    </div>
  );
}

export function BentoMilexServices() {
  return (
    <div className="w-full max-w-[420px] h-[350px] bg-[#0e131f] border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group">
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2ddc80] to-transparent opacity-30" />
       
       <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-8">
             <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black text-[#2ddc80] uppercase tracking-[0.4em]">Service Hub</span>
                <h4 className="text-white font-black text-3xl tracking-tighter">Production Tiers</h4>
             </div>
             <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="w-4 h-4 bg-[#2ddc80] rounded-sm transform rotate-45" />
             </div>
          </div>

          <div className="flex flex-col gap-4">
             {[
               { name: 'Cinematic Session', price: '300', active: true },
               { name: 'Wedding Full Pack', price: '850', active: false },
               { name: 'Commercial Post', price: '200', active: true }
             ].map((svc, i) => (
               <motion.div 
                 key={i}
                 whileHover={{ x: 5 }}
                 className={`p-4 rounded-xl border ${svc.active ? 'border-[#2ddc80]/30 bg-[#2ddc80]/5' : 'border-white/5 bg-white/[0.02] opacity-50'} flex justify-between items-center transition-all`}
               >
                  <div className="flex items-center gap-3">
                     <div className={`w-2 h-2 rounded-full ${svc.active ? 'bg-[#2ddc80] shadow-[0_0_8px_#2ddc80]' : 'bg-white/20'}`} />
                     <span className="text-xs font-black text-white uppercase tracking-tight">{svc.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white/40">${svc.price}</span>
               </motion.div>
             ))}
          </div>

          <div className="mt-auto flex justify-between items-center pt-6 border-t border-white/5 text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">
             <span>Dynamic Pricing</span>
             <span className="text-[#2ddc80]">Market Optimized</span>
          </div>
       </div>
    </div>
  );
}

export function BentoMilexBooking() {
  return (
    <div className="w-full max-w-[360px] h-[360px] bg-[#0e131f] border border-white/10 rounded-[3.5rem] p-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,220,128,0.05)_0%,transparent_70%)]" />
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-8">
           <div className="w-8 h-8 rounded-lg bg-[#2ddc80]/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#2ddc80]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
           </div>
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-[#2ddc80] uppercase tracking-[0.2em]">Booking Logic</span>
              <span className="text-[12px] font-black text-white uppercase tracking-widest">April 2026</span>
           </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-6">
           {[...Array(28)].map((_, i) => {
             const isBooked = [4, 7, 12, 15, 22].includes(i + 1);
             return (
               <motion.div 
                 key={i}
                 whileHover={{ scale: 1.1 }}
                 className={`aspect-square rounded-lg flex items-center justify-center border ${isBooked ? 'bg-[#2ddc80]/40 border-[#2ddc80]/60' : 'bg-white/5 border-white/10 hover:border-[#2ddc80]/40'} transition-all cursor-pointer`}
               >
                  <span className={`text-[8px] font-bold ${isBooked ? 'text-white' : 'text-white/20'}`}>{i + 1}</span>
               </motion.div>
             );
           })}
        </div>

        <div className="mt-auto p-4 bg-[#2ddc80] rounded-2xl flex items-center justify-center shadow-[0_15px_30px_-10px_rgba(45,220,128,0.5)] group-hover:scale-[1.02] transition-transform">
           <span className="text-[10px] font-black text-[#0e131f] uppercase tracking-[0.3em]">Confirm Reservation</span>
        </div>
      </div>
    </div>
  );
}

export function BentoMilexPayments() {
  return (
    <div className="w-full max-w-[420px] h-[300px] bg-[#0e131f] border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group">
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#2ddc80]/5 rounded-full blur-[100px]" />
      
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-10">
           <div className="flex flex-col gap-1">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">Transaction</span>
              <h4 className="text-white font-black text-3xl tracking-tighter">Payment Verified</h4>
           </div>
           <div className="px-4 py-2 bg-[#2ddc80]/10 border border-[#2ddc80]/30 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#2ddc80] animate-pulse" />
              <span className="text-[9px] font-black text-[#2ddc80] uppercase tracking-widest">SECURE</span>
           </div>
        </div>

        <div className="flex items-center gap-8">
           {/* Glow Card Visual */}
           <div className="w-32 h-20 bg-gradient-to-br from-white/10 to-white/5 rounded-xl border border-white/10 p-4 relative group-hover:border-[#2ddc80]/40 transition-colors">
              <div className="w-6 h-4 bg-[#2ddc80]/40 rounded-sm mb-4" />
              <div className="flex gap-1">
                 <div className="w-2 h-1 bg-white/20 rounded-full" />
                 <div className="w-2 h-1 bg-white/20 rounded-full" />
                 <div className="w-2 h-1 bg-white/20 rounded-full" />
                 <div className="w-6 h-1 bg-white/40 rounded-full" />
              </div>
              <motion.div 
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2ddc80] rounded-full blur-md opacity-40" 
              />
           </div>

           <div className="flex flex-col gap-2">
              <span className="text-[24px] font-black text-white tracking-widest">$200.00</span>
              <span className="text-[9px] font-black text-[#2ddc80] uppercase tracking-[0.3em]">Session Deposit (50%)</span>
           </div>
        </div>

        <div className="mt-auto h-2 w-full bg-white/5 rounded-full overflow-hidden">
           <motion.div 
             initial={{ width: 0 }}
             whileInView={{ width: '100%' }}
             transition={{ duration: 2, ease: "easeInOut" }}
             className="h-full bg-[#2ddc80]" 
           />
        </div>
      </div>
    </div>
  );
}

export function BentoMilexNotifications() {
  return (
    <div className="w-full max-w-[360px] h-[400px] bg-[#0e131f] border border-white/10 rounded-[3rem] p-8 relative overflow-hidden group">
      <div className="absolute inset-0 bg-[#2ddc80]/3 opacity-[0.02]" />
      
      <div className="relative z-10 flex flex-col h-full">
         <div className="flex items-center justify-between mb-8">
            <span className="text-[10px] font-black text-[#2ddc80] uppercase tracking-[0.4em]">Automation Hub</span>
            <div className="w-6 h-6 rounded-full border border-white/10 flex items-center justify-center">
               <div className="w-1.5 h-1.5 rounded-full bg-[#2ddc80]" />
            </div>
         </div>

         <div className="flex flex-col gap-4">
            {[
              { type: 'Booking', msg: 'New Session Reserved', time: '2m ago' },
              { type: 'Payment', msg: 'Deposit Received', time: '15m ago' },
              { type: 'Reminder', msg: 'Session Reminder Sent', time: '1h ago' },
              { type: 'System', msg: 'Calendar Synced', time: 'Now' }
            ].map((node, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col gap-1 relative overflow-hidden"
              >
                 <div className="absolute top-0 right-0 w-12 h-12 bg-[#2ddc80]/5 rounded-bl-3xl" />
                 <div className="flex justify-between items-center text-[7px] font-black uppercase tracking-widest text-[#2ddc80]/60">
                    <span>{node.type} Node</span>
                    <span className="text-white/20">{node.time}</span>
                 </div>
                 <span className="text-[10px] font-black text-white uppercase tracking-tight">{node.msg}</span>
              </motion.div>
            ))}
         </div>

         <div className="mt-auto pt-6 flex flex-col gap-3">
            <div className="flex items-center gap-4">
               <div className="flex-1 h-[1px] bg-white/10" />
               <span className="text-[7px] font-black text-white/20 uppercase tracking-[0.5em]">Realtime Stream</span>
               <div className="flex-1 h-[1px] bg-white/10" />
            </div>
            <div className="flex justify-center gap-4">
               {[...Array(4)].map((_, i) => (
                 <motion.div 
                   key={i}
                   animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                   transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                   className="w-1.5 h-1.5 rounded-full bg-[#2ddc80]" 
                 />
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}

export function BentoN8nFlow() {
  return (
    <div className="w-full max-w-[550px] h-[320px] bg-[#0e131f] border border-white/10 rounded-[2.5rem] relative overflow-hidden p-8 shadow-2xl group">
      {/* Background Grid - n8n style */}
      <div className="absolute inset-0 opacity-[0.05]" 
           style={{ 
             backgroundImage: 'radial-gradient(circle, #2ddc80 1px, transparent 1px)', 
             backgroundSize: '24px 24px' 
           }} 
      />
      
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,220,128,0.03)_0%,transparent_70%)]" />

      <div className="relative h-full flex items-center justify-between px-6">
        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(45,220,128,0.1)" />
              <stop offset="50%" stopColor="rgba(45,220,128,0.8)" />
              <stop offset="100%" stopColor="rgba(45,220,128,0.1)" />
            </linearGradient>
          </defs>
          <motion.path 
            d="M 120 160 C 180 160, 180 100, 240 100" 
            stroke="url(#lineGrad)" strokeWidth="3" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          <motion.path 
            d="M 120 160 C 180 160, 180 220, 240 220" 
            stroke="url(#lineGrad)" strokeWidth="3" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5, ease: "linear" }}
          />
          <motion.path 
            d="M 310 100 C 370 100, 370 160, 430 160" 
            stroke="url(#lineGrad)" strokeWidth="3" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, delay: 1, ease: "linear" }}
          />
          <motion.path 
            d="M 310 220 C 370 220, 370 160, 430 160" 
            stroke="url(#lineGrad)" strokeWidth="3" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, repeat: Infinity, delay: 1.5, ease: "linear" }}
          />
        </svg>

        {/* Trigger Node (Webhook/Call) */}
        <div className="flex flex-col items-center gap-4 relative z-10">
           <div className="w-20 h-20 rounded-2xl bg-[#1a1f2e] border-2 border-[#2ddc80] flex items-center justify-center shadow-[0_0_40px_rgba(45,220,128,0.2)] group-hover:scale-105 transition-transform relative">
              {/* Input/Output Dots */}
              <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2ddc80] rounded-full border-4 border-[#0e131f] shadow-[0_0_10px_#2ddc80]" />
              
              <div className="flex flex-col items-center gap-1">
                 <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center border border-orange-500/40">
                    <div className="w-4 h-4 bg-orange-500 rounded-sm animate-pulse" />
                 </div>
                 <span className="text-[6px] font-black text-white tracking-[0.2em] uppercase mt-1">Webhook</span>
              </div>
           </div>
           <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
              <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Inbound</span>
           </div>
        </div>

        {/* Processing Nodes (AI & Logic) */}
        <div className="flex flex-col gap-16 relative z-10">
           {/* AI Node */}
           <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#1a1f2e] border border-white/20 flex items-center justify-center group-hover:border-[#2ddc80]/50 transition-colors relative shadow-xl">
                 <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white/40 rounded-full border-2 border-[#0e131f]" />
                 <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#2ddc80] rounded-full border-2 border-[#0e131f]" />
                 
                 <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
                    <div className="w-3.5 h-3.5 border-2 border-emerald-500 rounded-full border-t-transparent animate-spin" />
                 </div>
              </div>
              <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em]">AI Agent</span>
           </div>

           {/* Booksy Node */}
           <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-[#1a1f2e] border border-white/20 flex items-center justify-center group-hover:border-[#2ddc80]/50 transition-colors relative shadow-xl">
                 <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-white/40 rounded-full border-2 border-[#0e131f]" />
                 <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#2ddc80] rounded-full border-2 border-[#0e131f]" />
                 
                 <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/30">
                    <div className="w-4 h-1 bg-blue-400 rounded-full" />
                 </div>
              </div>
              <span className="text-[7px] font-black text-white/30 uppercase tracking-[0.3em]">Booksy API</span>
           </div>
        </div>

        {/* Destination Node (WhatsApp/Client) */}
        <div className="flex flex-col items-center gap-4 relative z-10">
           <div className="w-20 h-20 rounded-2xl bg-[#1a1f2e] border border-[#2ddc80]/40 flex items-center justify-center shadow-2xl group-hover:border-[#2ddc80] transition-colors relative">
              <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#2ddc80] rounded-full border-4 border-[#0e131f] shadow-[0_0_10px_#2ddc80]" />
              
              <div className="flex flex-col items-center gap-1">
                 <div className="w-8 h-8 rounded-lg bg-[#2ddc80]/10 flex items-center justify-center border border-[#2ddc80]/30">
                    <svg className="w-4 h-4 text-[#2ddc80]" fill="currentColor" viewBox="0 0 24 24">
                       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                 </div>
                 <span className="text-[6px] font-black text-white tracking-[0.2em] uppercase mt-1">Guas App</span>
              </div>
           </div>
           <div className="px-3 py-1 bg-[#2ddc80]/10 rounded-full border border-[#2ddc80]/20">
              <span className="text-[8px] font-black text-[#2ddc80] uppercase tracking-widest">Confirmed</span>
           </div>
        </div>
      </div>
    </div>
  );
}
