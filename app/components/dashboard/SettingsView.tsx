'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Activity, 
  Zap, 
  Database, 
  Cpu, 
  RefreshCcw, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ExternalLink
} from 'lucide-react';

interface ServiceStatus {
  name: string;
  status: 'online' | 'offline';
  latency: number;
  type: string;
}

export default function SettingsView() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<string>('');

  const checkHealth = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/health-check');
      const data = await res.json();
      if (data.success) {
        setServices(data.services);
        setLastCheck(new Date(data.timestamp).toLocaleTimeString());
      }
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-32">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-white/5">
        <div className="space-y-1">
           <div className="flex items-center gap-3">
              <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[9px] font-black uppercase text-indigo-400">System Diagnostics</div>
           </div>
           <h2 className="text-3xl font-black tracking-tight italic">API <span className="text-zinc-500">Integrations</span></h2>
        </div>
        
        <button 
          onClick={checkHealth}
          disabled={loading}
          className="px-6 py-2.5 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all disabled:opacity-50"
        >
          <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Analyzing...' : 'Refresh Status'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
         <div className="lg:col-span-8 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-700">Communication Channels</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {services.map((service, i) => (
                 <motion.div 
                   key={service.name}
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-6 bg-[#0C0C0E] border border-white/5 rounded-3xl group hover:border-indigo-500/30 transition-all"
                 >
                    <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl ${service.status === 'online' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                             {service.type === 'Broker' ? <Zap className="w-5 h-5" /> : 
                              service.type === 'Data' ? <Activity className="w-5 h-5" /> :
                              service.type === 'AI' ? <Cpu className="w-5 h-5" /> :
                              <Database className="w-5 h-5" />}
                          </div>
                          <div>
                             <p className="text-sm font-black tracking-tight">{service.name}</p>
                             <p className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">{service.type} Interface</p>
                          </div>
                       </div>
                       {service.status === 'online' ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-rose-500" />}
                    </div>

                    <div className="flex items-center justify-between">
                       <div className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-500">
                          Latency: {service.latency}ms
                       </div>
                       <div className={`text-[10px] font-black uppercase tracking-widest ${service.status === 'online' ? 'text-emerald-400' : 'text-rose-500'}`}>
                          {service.status}
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>

            <div className="p-8 bg-indigo-600/5 border border-indigo-500/20 rounded-[2.5rem] flex items-center justify-between">
               <div className="flex items-center gap-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white"><ShieldCheck className="w-6 h-6" /></div>
                  <div>
                     <h4 className="text-sm font-black uppercase tracking-widest italic">Encrypted Secure Tunnel</h4>
                     <p className="text-xs text-zinc-500 font-bold mt-1 uppercase tracking-widest">Ultima verificación: {lastCheck || 'N/A'}</p>
                  </div>
               </div>
               <div className="hidden md:flex gap-1">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="w-1.5 h-6 bg-indigo-500/20 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />)}
               </div>
            </div>
         </div>

         <div className="lg:col-span-4 bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-10 h-fit sticky top-32">
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
