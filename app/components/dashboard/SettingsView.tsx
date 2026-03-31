'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  RefreshCcw, 
  Activity, 
  Database, 
  Globe, 
  Zap, 
  Cpu,
  AlertTriangle,
  Lock,
  ExternalLink
} from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  latency: number;
  type: string;
}

export default function SettingsView() {
  const [statuses, setStatuses] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState(new Date());

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/health-check');
      const data = await res.json();
      if (data.success) {
        setStatuses(data.services);
        setLastCheck(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch system status:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Auto refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 max-w-[1200px] mx-auto pb-32">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-white/5">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase text-emerald-400 tracking-[0.2em]">System Diagnostics</div>
            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">v3.4.0-Neural</div>
          </div>
          <h2 className="text-4xl font-black tracking-tight italic">Global <span className="text-zinc-500">Settings</span></h2>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
             <Activity className="w-3 h-3" /> Last Scan: {lastCheck.toLocaleTimeString()}
          </p>
        </div>
        
        <button 
          onClick={fetchStatus}
          disabled={loading}
          className="px-8 py-4 bg-white text-black font-black rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center gap-3 hover:bg-zinc-200 transition-all text-xs group"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          {loading ? 'Analyzing...' : 'Re-verify All APIs'}
        </button>
      </div>

      {/* API Monitoring Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {statuses.map((service, index) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={service.name}
            className="bg-[#0C0C0E] border border-white/5 rounded-[2rem] p-8 group hover:border-white/10 transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${
                    service.type === 'Broker' ? 'bg-indigo-500/10 text-indigo-400' :
                    service.type === 'AI' ? 'bg-purple-500/10 text-purple-400' :
                    service.type === 'Data' ? 'bg-emerald-500/10 text-emerald-400' :
                    'bg-amber-500/10 text-amber-400'
                  }`}>
                    {service.type === 'Broker' && <Zap className="w-4 h-4" />}
                    {service.type === 'AI' && <Cpu className="w-4 h-4" />}
                    {service.type === 'Data' && <Globe className="w-4 h-4" />}
                    {service.type === 'Database' && <Database className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{service.type} Connection</span>
               </div>
               
               <div className="flex items-center gap-2">
                 <div className={`w-2 h-2 rounded-full ${
                    service.status === 'online' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' :
                    service.status === 'degraded' ? 'bg-amber-500 shadow-[0_0_10px_#f59e0b]' :
                    'bg-rose-500 shadow-[0_0_10px_#f43f5e]'
                 }`} />
               </div>
            </div>

            <div className="space-y-1">
               <h3 className="text-xl font-black italic tracking-tight">{service.name}</h3>
               <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${
                     service.status === 'online' ? 'text-emerald-500' :
                     service.status === 'degraded' ? 'text-amber-500' :
                     'text-rose-500'
                  }`}>
                    {service.status === 'online' ? 'Operational' : 
                     service.status === 'degraded' ? 'Rate Limited' : 'Offline'}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-800" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{service.latency}ms Latency</span>
               </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
               <span className="text-[9px] font-black uppercase tracking-widest text-zinc-700">Auth: External Secret</span>
               <ShieldCheck className="w-3.5 h-3.5 text-zinc-800" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security & Infrastructure Section */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
         <div className="xl:col-span-8 bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-10 space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-red-500/10 rounded-2xl text-red-400"><Lock className="w-5 h-5" /></div>
               <div>
                  <h3 className="text-lg font-black italic tracking-tight">Security Hardening & Key Protection</h3>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Confidential Information Surveillance</p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                  <p className="text-[11px] font-black uppercase tracking-widest text-white italic">Git Secrets Protection</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">All API keys are strictly configured through environment variables. The system detects and ignores `.env` files automatically to prevent leakage in public repositories.</p>
                  <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                     <ShieldCheck className="w-3 h-3" /> Protection Active
                  </div>
               </div>
               
               <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
                  <p className="text-[11px] font-black uppercase tracking-widest text-white italic">Cloud Infrastructure</p>
                  <p className="text-xs text-zinc-500 leading-relaxed">Integrated with Vercel Advanced Security. Keys are injected at the runtime layer, ensuring zero filesystem footprint of plain-text credentials.</p>
                  <div className="flex items-center gap-2 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                     <Cpu className="w-3 h-3" /> Secure Node V20
                  </div>
               </div>
            </div>
         </div>

         <div className="xl:col-span-4 bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden group">
            <div className="space-y-6">
               <div className="p-3 bg-amber-500/10 rounded-2xl text-amber-400 w-fit"><AlertTriangle className="w-5 h-5" /></div>
               <h3 className="text-lg font-black italic tracking-tight">Action Required</h3>
               <p className="text-xs text-zinc-500 leading-relaxed">If a service shows <span className="text-rose-500 font-bold uppercase">Offline</span>, verify your credentials in the Vercel Dashboard or contact the API provider for access restoration.</p>
            </div>
            
            <button className="mt-8 w-full py-4 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center gap-3">
               Documentation <ExternalLink className="w-3.5 h-3.5" />
            </button>
         </div>
      </div>
    </div>
  );
}
