'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function BentoVideo() {
  return (
    <div className="w-24 h-40 md:w-32 md:h-52 bg-[#0e131f] border border-white/10 rounded-2xl relative overflow-hidden p-3 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-[#2ddc80]/5 to-transparent" />
      {/* Cinematic Viewfinder */}
      <div className="absolute top-2 left-2 flex gap-1 items-center">
        <motion.div 
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="w-1.5 h-1.5 rounded-full bg-red-500" 
        />
        <span className="text-[6px] font-black tracking-widest text-white/40">REC</span>
      </div>
      
      {/* Simulated Reels UI */}
      <div className="mt-4 w-full h-full flex flex-col gap-2">
        <div className="w-full h-3/4 bg-white/5 rounded-lg relative overflow-hidden">
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }} 
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=200')] bg-cover opacity-60" 
          />
          <div className="absolute bottom-2 left-2 flex flex-col gap-1 w-2/3">
             <div className="h-1 w-full bg-[#2ddc80]/50 rounded-full" />
             <div className="h-1 w-1/2 bg-white/20 rounded-full" />
          </div>
        </div>
        <div className="flex justify-between items-center px-1">
           <div className="w-4 h-4 rounded-full bg-white/10" />
           <div className="flex gap-1">
              <div className="w-3 h-3 rounded-sm bg-white/5" />
              <div className="w-3 h-3 rounded-sm bg-white/5" />
           </div>
        </div>
      </div>
    </div>
  );
}

export function BentoWeb() {
  return (
    <div className="w-48 h-32 md:w-56 md:h-36 bg-[#0e131f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative group">
      {/* Browser Bar */}
      <div className="h-6 bg-white/5 border-b border-white/10 flex items-center px-3 gap-1">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500/50" />
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50" />
        <div className="w-1.5 h-1.5 rounded-full bg-green-500/50" />
        <div className="ml-2 h-3 w-32 bg-white/5 rounded-full flex items-center px-1">
           <span className="text-[5px] text-white/20 font-bold">panenka.com.ve</span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4 grid grid-cols-2 gap-3">
        <div className="space-y-2">
           <div className="h-1.5 w-full bg-white/10 rounded-full" />
           <div className="h-1.5 w-3/4 bg-white/5 rounded-full" />
           <div className="h-6 w-full bg-[#2ddc80]/20 border border-[#2ddc80]/30 rounded-lg flex items-center justify-center">
              <span className="text-[6px] font-black text-[#2ddc80] uppercase">Checkout</span>
           </div>
        </div>
        <div className="h-full bg-white/5 rounded-lg border border-white/5 relative flex items-center justify-center">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
             className="w-8 h-8 rounded-full border border-dashed border-[#2ddc80]/40 flex items-center justify-center"
           >
              <div className="w-4 h-4 rounded-full bg-[#2ddc80] shadow-[0_0_10px_#2ddc80]" />
           </motion.div>
        </div>
      </div>
    </div>
  );
}

export function BentoAdvantage() {
  return (
    <div className="w-40 h-40 bg-[#0e131f] border border-white/10 rounded-[2rem] p-6 relative overflow-hidden group">
       <div className="absolute inset-0 bg-gradient-to-tr from-[#2ddc80]/10 to-transparent opacity-50" />
       <div className="relative z-10 flex flex-col h-full justify-between gap-4">
          <div className="flex flex-col gap-1">
             <span className="text-[8px] font-black text-[#2ddc80] uppercase tracking-widest">Growth 2026</span>
             <h4 className="text-white font-black text-xl">+84%</h4>
          </div>
          
          <div className="flex-1 flex items-end gap-1.5 h-20">
             {[0.4, 0.6, 0.3, 0.8, 0.5, 0.9, 1.2].map((height, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${height * 40}%` }}
                  transition={{ delay: i * 0.1, duration: 1 }}
                  className="flex-1 bg-gradient-to-t from-[#2ddc80]/10 to-[#2ddc80] rounded-sm group-hover:shadow-[0_0_15px_rgba(45,220,128,0.3)] transition-shadow"
                />
             ))}
          </div>
          <div className="flex justify-between items-center text-[6px] font-black text-white/20 uppercase">
             <span>Jan</span>
             <span>Apr</span>
             <span>Dec</span>
          </div>
       </div>
    </div>
  );
}

export function BentoJourney() {
  return (
    <div className="w-48 h-48 bg-[#0e131f] border border-white/10 rounded-[2.5rem] p-6 relative overflow-hidden flex flex-col items-center justify-center">
       <svg className="w-full h-full" viewBox="0 0 100 100">
          <motion.path 
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            transition={{ duration: 2 }}
            d="M50 10 L80 40 L50 90 L20 40 Z" 
            fill="none" 
            stroke="#2ddc80" 
            strokeWidth="0.5" 
            strokeDasharray="2 2"
          />
          <circle cx="50" cy="15" r="3" fill="#2ddc80" className="animate-pulse" />
          <circle cx="25" cy="45" r="4" fill="#2ddc80/30" stroke="#2ddc80" strokeWidth="0.5" />
          <circle cx="75" cy="45" r="4" fill="#2ddc80/30" stroke="#2ddc80" strokeWidth="0.5" />
          <motion.circle 
            animate={{ cy: [15, 45, 85, 15] }}
            transition={{ duration: 4, repeat: Infinity }}
            cx="50" cy="15" r="2" fill="#2ddc80" 
          />
          
          <text x="50" y="25" textAnchor="middle" className="fill-white font-black text-[4px] uppercase tracking-widest">Cold</text>
          <text x="25" y="55" textAnchor="middle" className="fill-[#2ddc80] font-black text-[4px] uppercase tracking-widest">Warm</text>
          <text x="75" y="55" textAnchor="middle" className="fill-[#2ddc80] font-black text-[4px] uppercase tracking-widest">Warm</text>
          <text x="50" y="95" textAnchor="middle" className="fill-white font-black text-[5px] uppercase tracking-[0.2em]">Hot Customer</text>
       </svg>
    </div>
  );
}

export function BentoTracking() {
  return (
    <div className="w-40 h-40 bg-[#0e131f] border border-white/10 rounded-full flex items-center justify-center relative group overflow-hidden">
       <motion.div 
         animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
         transition={{ duration: 2, repeat: Infinity }}
         className="absolute inset-0 bg-[#2ddc80] rounded-full blur-[40px]" 
       />
       <div className="relative z-10 w-16 h-16 bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
          <svg className="w-8 h-8 text-[#2ddc80]" fill="currentColor" viewBox="0 0 24 24">
             <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
          </svg>
       </div>
       {/* Data Dots */}
       {[...Array(8)].map((_, i) => (
         <motion.div 
            key={i}
            animate={{ 
               x: [0, (Math.random() - 0.5) * 80],
               y: [0, (Math.random() - 0.5) * 80],
               opacity: [0, 1, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
            className="absolute w-1 h-1 rounded-full bg-[#2ddc80]"
         />
       ))}
    </div>
  );
}

export function BentoAds() {
  return (
    <div className="w-56 h-36 bg-[#0e131f] border border-white/10 rounded-2xl p-4 flex flex-col gap-3 relative shadow-2xl">
       <div className="flex justify-between items-start">
          <div className="flex flex-col">
             <span className="text-[7px] font-black text-white/30 uppercase tracking-widest">ROAS Optimizado</span>
             <span className="text-white font-black text-lg">4.8x</span>
          </div>
          <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
             <span className="text-[6px] font-black text-emerald-400 uppercase tracking-tighter">Active</span>
          </div>
       </div>
       <div className="flex-1 flex gap-1 items-end py-1">
          {[30, 45, 25, 60, 80, 55, 70, 40].map((h, i) => (
             <div key={i} className="flex-1 bg-white/5 rounded-t-sm relative h-full">
                <motion.div 
                   initial={{ height: 0 }}
                   whileInView={{ height: `${h}%` }}
                   className="absolute bottom-0 w-full bg-[#2ddc80] rounded-t-sm" 
                />
             </div>
          ))}
       </div>
       <div className="border-t border-white/5 pt-2 flex justify-between">
          <span className="text-[6px] font-bold text-white/20 uppercase">Meta Ads</span>
          <span className="text-[6px] font-bold text-white/20 uppercase">Google SGE</span>
       </div>
    </div>
  );
}

export function BentoDesign() {
  return (
    <div className="w-44 h-44 bg-[#0e131f] border border-white/10 rounded-[3rem] p-6 relative overflow-hidden group">
       <div className="absolute top-0 right-0 w-32 h-32 bg-[#2ddc80]/5 rounded-full blur-2xl" />
       <div className="relative z-10 grid grid-cols-2 gap-2 h-full">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white/5 border border-white/10 rounded-xl p-2 flex flex-col justify-end"
          >
             <div className="h-1 w-full bg-[#2ddc80] mb-1" />
             <div className="h-1 w-1/2 bg-white/20" />
          </motion.div>
          <motion.div 
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="bg-[#2ddc80]/10 border border-[#2ddc80]/20 rounded-xl relative overflow-hidden flex items-center justify-center"
          >
             <span className="text-[20px] font-black text-[#2ddc80]">P</span>
          </motion.div>
          <div className="col-span-2 bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex flex-col gap-1.5">
             <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                <div className="w-2 h-2 rounded-full bg-yellow-400" />
                <div className="w-2 h-2 rounded-full bg-green-400" />
             </div>
             <div className="h-1 w-full bg-white/10 rounded-full" />
             <div className="h-1 w-full bg-white/5 rounded-full" />
             <div className="h-1 w-2/3 bg-white/5 rounded-full" />
          </div>
       </div>
    </div>
  );
}
