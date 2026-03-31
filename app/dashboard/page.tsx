'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Zap, 
  Activity, 
  Cpu, 
  Globe, 
  RefreshCcw,
  ArrowUpRight,
  ShieldCheck,
  BarChart3
} from 'lucide-react';
import PriceTicker from '@/app/components/dashboard/PriceTicker';
import Link from 'next/link';

export default function TerminalHQ() {
  const sectors = [
    { id: 'crypto', name: 'Crypto', icon: Cpu, href: '/dashboard/crypto', color: 'emerald' },
    { id: 'forex', name: 'Forex', icon: RefreshCcw, href: '/dashboard/forex', color: 'blue' },
    { id: 'metals', name: 'Metals', icon: Zap, href: '/dashboard/metals', color: 'amber' },
    { id: 'stocks', name: 'Stocks', icon: TrendingUp, href: '/dashboard/stocks', color: 'indigo' }
  ];

  return (
    <div className="space-y-12 max-w-[1600px] mx-auto pb-32">
      
      {/* Universal Marketina */}
      <div className="space-y-1 -mx-10">
        <PriceTicker sector="Crypto" />
        <PriceTicker sector="Forex" />
        <PriceTicker sector="Metals" />
        <PriceTicker sector="Stocks" />
      </div>

      {/* Terminal HQ Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-white/5">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[9px] font-black uppercase text-indigo-400 italic">Terminal HQ</div>
              <div className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-[9px] font-black uppercase text-zinc-500">Node: Universa-Prime Mainframe</div>
           </div>
           <h2 className="text-4xl font-black tracking-tight italic uppercase">Global <span className="text-zinc-500">Surveillance</span></h2>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex flex-col items-end px-6 border-r border-white/5">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Total Intelligence Coverage</p>
              <p className="text-xl font-black tracking-tighter text-white italic">100% Operational</p>
           </div>
           <Link href="/dashboard/settings">
             <button className="px-8 py-3 bg-white text-black font-black rounded-xl shadow-2xl flex items-center gap-3 hover:bg-zinc-200 transition-all text-xs uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> System Guard
             </button>
           </Link>
        </div>
      </div>

      {/* Sector Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sectors.map((sector) => (
          <Link href={sector.href} key={sector.id}>
            <motion.div 
               whileHover={{ scale: 1.02, y: -5 }}
               className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-emerald-500/30 transition-all"
            >
               <div className="flex items-center justify-between mb-10">
                  <div className={`p-4 rounded-2xl bg-white/5 group-hover:bg-emerald-500/10 transition-colors`}>
                     <sector.icon className="w-6 h-6 text-zinc-500 group-hover:text-emerald-400" />
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-zinc-800 group-hover:text-emerald-400" />
               </div>
               
               <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 mb-2">Surveillance Active</p>
                  <h4 className="text-2xl font-black italic tracking-tighter uppercase">{sector.name}</h4>
                  <p className="text-[9px] font-bold text-zinc-600 mt-4 leading-relaxed uppercase tracking-widest">Enter the {sector.name} terminal for real-time order execution and intelligence.</p>
               </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Intelligence Mainframe */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Network Status */}
        <div className="xl:col-span-8 bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#111113]/50">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><BarChart3 className="w-4 h-4" /></div>
                <h3 className="text-sm font-black uppercase tracking-widest italic font-bold">Network Consensus</h3>
             </div>
             <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          </div>

          <div className="p-10 space-y-8">
             <div className="flex items-center justify-between p-8 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                <div className="flex items-center gap-6">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <Globe className="w-6 h-6 text-indigo-400" />
                   </div>
                   <div>
                      <h4 className="text-lg font-black italic tracking-tight uppercase text-white">Global Feed Synchronized</h4>
                      <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-1">TwelveData & AlphaVantage nodes active</p>
                   </div>
                </div>
                <div className="hidden md:flex gap-1.5">
                   {[1,2,3,4,5,6,7,8].map(i => (
                     <div key={i} className="w-1.5 h-8 bg-emerald-500/20 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                   ))}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700 mb-2">Sentiment Node</p>
                   <h5 className="text-sm font-black italic uppercase">Market Fear: Neutral</h5>
                   <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                      <div className="w-1/2 h-full bg-amber-500" />
                   </div>
                </div>
                <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem]">
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700 mb-2">Liquidity Node</p>
                   <h5 className="text-sm font-black italic uppercase">Institutional Inflow: High</h5>
                   <div className="w-full h-1 bg-white/5 rounded-full mt-4 overflow-hidden">
                      <div className="w-[85%] h-full bg-emerald-500" />
                   </div>
                </div>
             </div>
          </div>
        </div>

        {/* Neural Link Info */}
        <div className="xl:col-span-4 bg-indigo-600 border border-indigo-500 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
           <Activity className="w-8 h-8 mb-6" />
           <h4 className="text-2xl font-black tracking-tighter mb-4 italic leading-tight uppercase underline decoration-white/20">Neural Terminal <br /> Active.</h4>
           <p className="text-indigo-100 text-xs font-bold leading-relaxed mb-10 opacity-80 uppercase tracking-widest">JF.OS is processing millions of data points across global markets to ensure your command execution is flawless.</p>
           <button className="w-full py-5 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl">
              Sync Intelligence <RefreshCcw className="w-4 h-4" />
           </button>
        </div>

      </div>
    </div>
  );
}