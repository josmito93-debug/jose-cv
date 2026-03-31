'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Activity, 
  Database, 
  Globe, 
  Cpu, 
  TrendingUp, 
  Share2, 
  ShieldCheck, 
  Zap,
  ArrowUpRight,
  Maximize2,
  Users,
  Settings,
  Bell,
  Search,
  Plus,
  Terminal,
  MousePointer2,
  Sparkles
} from 'lucide-react';

export default function HoffmannHQFunctionalV4() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-white flex flex-col overflow-hidden selection:bg-indigo-500/30 font-inter">
      
      {/* Cinematic HUD Header */}
      <div className="h-24 border-b border-white/5 backdrop-blur-2xl px-12 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-4 group">
            <img src="/universalogo.png" alt="JF.OS Logo" className="h-10 w-auto object-contain group-hover:scale-110 transition-transform" />
            <h1 className="text-2xl font-black tracking-tighter uppercase italic">HQ <span className="text-indigo-500">Command</span></h1>
          </Link>
          <div className="h-8 w-[1px] bg-white/10" />
          <div>
             <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">System Surveillance Active</p>
             <p className="text-[11px] font-bold text-zinc-400 mt-1">{currentTime.toLocaleTimeString([], { hour12: false })} <span className="opacity-30">V.2.6.0</span></p>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className="hidden lg:flex flex-col items-end">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-emerald-400 mb-1">Neural Network: Connected</p>
              <div className="flex gap-1">
                 {[1,2,3,4,5].map(i => <div key={i} className="w-3 h-1 bg-emerald-500/20 rounded-full" />)}
              </div>
           </div>
           <div className="flex items-center gap-4 border-l border-white/10 pl-8">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              </div>
           </div>
        </div>
      </div>

      {/* The Central Brain - Switcher Grid */}
      <main className="flex-1 p-12 grid grid-cols-12 gap-8 relative overflow-hidden bg-[radial-gradient(circle_at_50%_50%,rgba(67,56,202,0.05),transparent_70%)] z-10">
        
        {/* Module 1: Financial Intelligence Terminal */}
        <div 
           onClick={() => navigateTo('/dashboard')}
           className="col-span-12 lg:col-span-7 bg-white/[0.02] border border-white/5 rounded-[4rem] p-12 backdrop-blur-3xl hover:bg-white/[0.04] hover:border-indigo-500/50 transition-all group flex flex-col justify-between relative overflow-hidden shadow-2xl cursor-pointer active:scale-[0.98]"
        >
           <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/5 blur-[120px] -mr-40 -mt-40 group-hover:bg-indigo-600/10 transition-colors pointer-events-none" />
           
           <div className="space-y-6 relative z-10 pointer-events-none">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 group-hover:rotate-12 transition-transform">
                       <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                       <h3 className="text-4xl font-black tracking-tighter italic">Financial Terminal</h3>
                       <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 mt-2">Active Surveillance Agent</p>
                    </div>
                 </div>
                 <div className="p-4 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all">
                    <ArrowUpRight className="w-6 h-6 text-indigo-400" />
                 </div>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-10">
                 <MiniMetric label="Portfolio" value="$1.2M" color="text-white" />
                 <MiniMetric label="Profit (24h)" value="+$2.4K" color="text-emerald-400" />
                 <MiniMetric label="API Load" value="Optimal" color="text-indigo-400" />
              </div>
           </div>

           <div className="mt-12 bg-black/40 border border-white/5 rounded-[2.5rem] p-8 relative z-10 pointer-events-none">
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">MtApi Port 8228 Status: Online</span>
                 </div>
                 <MousePointer2 className="w-4 h-4 text-zinc-700 animate-bounce" />
              </div>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                 <motion.div animate={{ width: ['20%', '80%', '20%'] }} transition={{ duration: 10, repeat: Infinity }} className="h-full bg-indigo-500" />
              </div>
           </div>
        </div>

        {/* Column 2: Attom & El Creador */}
        <div className="col-span-12 lg:col-span-5 grid grid-rows-2 gap-8">
           {/* Attom Command */}
           <div 
              onClick={() => navigateTo('/admin')}
              className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-10 backdrop-blur-3xl hover:bg-white/[0.04] hover:border-emerald-500/50 transition-all group flex flex-col justify-between relative overflow-hidden shadow-xl cursor-pointer active:scale-[0.98]"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
              <div className="flex items-center gap-6 relative z-10 pointer-events-none">
                 <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Globe className="w-7 h-7" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black tracking-tighter italic">Attom Command</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 mt-1 italic">Gestión Unificada</p>
                 </div>
              </div>
              <div className="mt-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-[10px] font-black text-center uppercase tracking-widest group-hover:bg-emerald-500 group-hover:text-black transition-all">
                 Abrir Gestión de Clientes
              </div>
           </div>

           {/* El Creador Content Engine */}
           <div 
              onClick={() => navigateTo('/creador')}
              className="bg-white/[0.02] border border-white/5 rounded-[4rem] p-10 backdrop-blur-3xl hover:bg-white/[0.04] hover:border-[#39FF14]/50 transition-all group flex flex-col justify-between relative overflow-hidden shadow-xl cursor-pointer active:scale-[0.98]"
           >
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#39FF14]/5 blur-[100px] -mr-32 -mt-32 pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10 pointer-events-none">
                 <div className="w-14 h-14 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14] group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                    <Sparkles className="w-7 h-7" />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black tracking-tighter italic text-[#39FF14]">El Creador</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-1 italic">Content Machine Agent</p>
                 </div>
              </div>
              <div className="mt-8 py-4 bg-[#39FF14]/10 border border-[#39FF14]/20 rounded-2xl text-[10px] font-black text-center uppercase tracking-widest group-hover:bg-[#39FF14] group-hover:text-black transition-all">
                 Entrar a La Fábrica
              </div>
           </div>
        </div>

        {/* System Status Footer */}
        <div className="col-span-12 bg-white/[0.01] border border-white/5 rounded-[3.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-10 z-20">
           <div className="flex items-center gap-10">
              <div className="flex items-center gap-4">
                 <ShieldCheck className="w-6 h-6 text-indigo-500/50" />
                 <div>
                    <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700 leading-none">Security Encryption</p>
                    <p className="text-[10px] font-black mt-1 italic">AES-256 ACTIVE</p>
                 </div>
              </div>
              <div className="h-10 w-px bg-white/5" />
              <div className="flex items-center gap-3">
                 {['Vercel', 'Airtable', 'Drive', 'n8n'].map(id => (
                   <div key={id} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[8px] font-black text-zinc-700 uppercase">{id}</div>
                 ))}
              </div>
           </div>
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-900 italic">Universa Architecture v2.6</p>
        </div>

      </main>

      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ 
        backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 0.5px)`, 
        backgroundSize: '32px 32px' 
      }}></div>
    </div>
  );
}

function MiniMetric({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-white/5 border border-white/5 p-5 rounded-[2rem] text-center">
       <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-1">{label}</p>
       <p className={`text-xl font-black tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}
