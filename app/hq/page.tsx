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
  ShieldCheck, 
  Zap,
  ArrowUpRight,
  Sparkles,
  Layers,
  Terminal,
  MousePointer2,
  Lock,
  Wifi,
  BarChart3,
  Search,
  Plus
} from 'lucide-react';

export default function UniversaNexusV5() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('nexus');
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
    <div className="min-h-screen w-full bg-[#080809] text-white flex flex-col overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Precision HUD Background Layer */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ 
        backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 0.5px)`, 
        backgroundSize: '24px 24px' 
      }}></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {/* Cinematic HUD Header v5 */}
      <header className="h-20 border-b border-white/[0.05] backdrop-blur-3xl px-8 flex items-center justify-between shrink-0 z-50 sticky top-0">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 group-hover:scale-110 transition-transform flex items-center justify-center">
              <img src="/images/universa_logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div className="h-6 w-px bg-white/10 mx-2" />
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tight italic leading-none">Universa <span className="text-indigo-500">Nexus</span></h1>
              <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-[0.3em] mt-1">Central Command Hub</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 ml-10">
            {['Nexus', 'Metrics', 'Security', 'Logs'].map(item => (
              <button 
                key={item}
                onClick={() => setActiveTab(item.toLowerCase())}
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === item.toLowerCase() ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-full">
            <Wifi className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Node: Active</span>
          </div>
          <div className="flex flex-col items-end border-l border-white/10 pl-8">
            <p className="text-[11px] font-bold text-zinc-300 font-mono tracking-tighter">
              {currentTime.toLocaleTimeString([], { hour12: false })}
            </p>
            <p className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-600">SYSTIME_UTC</p>
          </div>
        </div>
      </header>

      {/* Main Command Workspace - The Bento Grid */}
      <main className="flex-1 p-8 lg:p-12 relative z-10">
        
        {/* Dynamic Asymmetrical Bento Grid */}
        <div className="grid grid-cols-12 auto-rows-[160px] gap-6 max-w-[1600px] mx-auto">
          
          {/* 1. Prime Asset: Financial Intelligence Terminal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigateTo('/dashboard')}
            className="col-span-12 lg:col-span-8 row-span-3 bg-white/[0.03] border border-white/[0.08] rounded-[2.5rem] p-10 backdrop-blur-2xl hover:bg-white/[0.05] hover:border-indigo-500/30 transition-all group relative overflow-hidden cursor-pointer shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/[0.02] blur-[100px] -mr-40 -mt-40 group-hover:bg-indigo-600/[0.05] transition-colors duration-700" />
            
            <div className="h-full flex flex-col justify-between relative z-10">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-600/40 group-hover:rotate-6 transition-transform">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400 block mb-1">Financial Intelligence Unit</span>
                      <h2 className="text-4xl font-black tracking-tighter italic uppercase text-white/90">Quant Terminal</h2>
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <ArrowUpRight className="w-6 h-6 text-indigo-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatItem label="Active Capital" value="$1.42M" trend="+12.4%" />
                  <StatItem label="Realized Profit" value="+$42.6K" isPositive />
                  <StatItem label="Signal Load" value="Optimal" tech />
                </div>
              </div>

              <div className="mt-auto pt-10">
                <div className="bg-black/40 border border-white/5 rounded-2xl p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">MtApi Protocol v2.4 Listening on Port 8228</span>
                  </div>
                  <div className="flex gap-1">
                    {[1,2,3,4,5,6,7,8].map(i => <div key={i} className={`w-1 h-3 rounded-full ${i < 5 ? 'bg-indigo-500' : 'bg-white/5'}`} />)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 2. Utility: Attom CMS */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            onClick={() => navigateTo('/admin')}
            className="col-span-12 lg:col-span-4 row-span-2 bg-[#0C0D0E] border border-white/[0.08] rounded-[2.5rem] p-8 backdrop-blur-2xl hover:border-emerald-500/30 transition-all group relative overflow-hidden cursor-pointer active:scale-[0.98]"
          >
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/5 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter italic">Attom <span className="text-zinc-600 italic lowercase font-bold">Deployer</span></h3>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[9px] font-black text-zinc-500 uppercase">Live Deployments</span>
                    <span className="text-[10px] font-black text-emerald-400">12 ACTIVE</span>
                 </div>
                 <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[78%]" />
                 </div>
              </div>
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-600 px-2 mt-4">
                 <span>Sync: 0.2ms</span>
                 <Wifi className="w-3 h-3 opcaity-30" />
              </div>
            </div>
          </motion.div>

          {/* 3. Creative: El Creador */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigateTo('/creador')}
            className="col-span-12 lg:col-span-4 row-span-2 bg-[#0C0D0E] border border-white/[0.08] rounded-[2.5rem] p-8 backdrop-blur-2xl hover:border-[#39FF14]/30 transition-all group relative overflow-hidden cursor-pointer active:scale-[0.98]"
          >
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#39FF14]/5 blur-3xl pointer-events-none" />
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center text-[#39FF14] group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter italic text-[#39FF14]">El creador</h3>
            </div>
            <div className="bg-[#39FF14]/5 border border-[#39FF14]/10 rounded-xl p-4 text-[9px] font-black text-[#39FF14] uppercase tracking-widest text-center">
              Content Engine Status: Processing
            </div>
            <div className="mt-6 flex gap-2">
               {[1,2,3,4].map(i => <div key={i} className="flex-1 h-1 bg-[#39FF14]/20 rounded-full" />)}
            </div>
          </motion.div>

          {/* 4. Infrastructure: n8n Architect */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => window.open('https://n8n.cloud', '_blank')}
            className="col-span-12 lg:col-span-4 row-span-1 bg-[#0C0D0E] border border-white/[0.08] rounded-[2rem] px-8 flex items-center justify-between hover:border-amber-500/30 transition-all group cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black uppercase tracking-tighter italic">n8n Architect</h4>
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Automation Studio</p>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-black transition-all">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </motion.div>

           {/* 5. System Status Block */}
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-12 lg:col-span-8 row-span-1 bg-white/[0.01] border border-white/5 rounded-[2rem] px-10 flex items-center justify-between"
          >
            <div className="flex items-center gap-10">
               <div className="flex items-center gap-4">
                  <ShieldCheck className="w-5 h-5 text-indigo-500/40" />
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-700">Protocol Status</span>
                    <span className="text-[10px] font-black text-zinc-400 uppercase italic">Encrypted Secure</span>
                  </div>
               </div>
               <div className="h-8 w-px bg-white/5" />
               <div className="flex gap-4">
                  {['fastapi', 'vercel', 'alpaca'].map(id => (
                    <span key={id} className="text-[8px] font-bold text-zinc-800 uppercase tracking-widest">{id}</span>
                  ))}
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <p className="text-[8px] font-black text-zinc-800 uppercase">Universa Architecture</p>
                  <p className="text-[9px] font-black text-zinc-600 uppercase">Version 5.2.Nexus</p>
               </div>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Decorative Scanned Corner Elements */}
      <div className="fixed bottom-8 left-8 p-4 border-l border-b border-white/10 opacity-30 pointer-events-none">
         <p className="text-[10px] font-mono uppercase tracking-tighter text-zinc-700">OS_RECON_INITIALIZED</p>
      </div>
      <div className="fixed bottom-8 right-8 p-4 border-r border-b border-white/10 opacity-30 pointer-events-none">
         <p className="text-[10px] font-mono uppercase tracking-tighter text-zinc-700">NEXUS_CORE_V5_STABLE</p>
      </div>

    </div>
  );
}

function StatItem({ label, value, trend, isPositive, tech }: { label: string, value: string, trend?: string, isPositive?: boolean, tech?: boolean }) {
  return (
    <div className="bg-white/[0.03] border border-white/5 p-6 rounded-[1.5rem] group/item hover:bg-white/[0.05] transition-colors relative">
      <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-2">{label}</p>
      <div className="flex items-baseline gap-3">
        <p className={`text-2xl font-black tracking-tighter italic ${tech ? 'text-indigo-400' : 'text-white'}`}>{value}</p>
        {trend && (
          <span className={`text-[10px] font-black ${isPositive ? 'text-emerald-400' : 'text-emerald-500'}`}>{trend}</span>
        )}
      </div>
    </div>
  );
}
