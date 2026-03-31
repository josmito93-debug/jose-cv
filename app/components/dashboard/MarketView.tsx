'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Activity, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCcw,
  Globe,
  BarChart3
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import PriceTicker from './PriceTicker';
import TrendingAssets from './TrendingAssets';
import SectorNews from './SectorNews';

interface MarketViewProps {
  category: 'Crypto' | 'Metals' | 'Forex' | 'Stocks' | 'Overview';
  title: string;
  description: string;
  symbols: { symbol: string; name: string; status: string }[];
}

export default function MarketView({ category, title, description, symbols }: MarketViewProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`/api/trading-logs?category=${category}`);
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
        setPerformance(data.performance || []);
      }
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrigger = async (reason: 'TRIGGER' | 'INTEL') => {
    try {
      setDeploying(true);
      const res = await fetch('/api/trading-logs', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, category })
      });
      const data = await res.json();
      if (data.success) {
        alert(`${reason === 'INTEL' ? '🔍 Neural Intel' : '🌐 Signal'} sent for ${category}.`);
        setTimeout(fetchLogs, 5000);
      }
    } catch (error) {
      console.error('Trigger failed:', error);
    } finally {
      setDeploying(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, [category]);

  const latestLog = logs[0] || null;
  const currentCapital = latestLog?.capital_actual || 100000.00;

  return (
    <div className="space-y-0 max-w-[1600px] mx-auto pb-32">
      <PriceTicker category={category} />
      
      <div className="space-y-10 px-4 lg:px-8 mt-10">
      {/* Sector Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-white/5">
        <div className="space-y-4">
           {/* Terminal Badges from Screenshot */}
           <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[8px] font-black uppercase text-emerald-400 tracking-wider">Terminal Active</div>
              <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[8px] font-black uppercase text-zinc-500 tracking-wider">API: Multi-Source AlphaV x CodexID</div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[9px] font-black uppercase text-indigo-400 italic">{category} Specialist</div>
              <div className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-[9px] font-black uppercase text-zinc-500">JF.OS Neural Link V3</div>
           </div>
           <h2 className="text-3xl font-black tracking-tight italic">
             {category === 'Overview' ? 'Global' : title} <span className="text-zinc-500">{category === 'Overview' ? 'Surveillance' : description}</span>
           </h2>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={() => handleTrigger('TRIGGER')}
             disabled={deploying}
             className={`px-8 py-3 bg-white text-black font-black rounded-xl shadow-2xl flex items-center gap-3 hover:bg-zinc-200 transition-all text-xs ${deploying ? 'opacity-50' : ''}`}>
              <Zap className={`w-4 h-4 ${deploying ? 'animate-spin' : ''}`} /> {deploying ? 'Refining...' : 'Trigger Trade'}
           </button>
        </div>
      </div>

      <TrendingAssets category={category} />

      {/* Analytics Chart */}
      <div className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-10">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performance.length > 0 ? performance : [{ timestamp: '00:00', value: 100000 }]}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
              <XAxis dataKey="timestamp" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
                itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="value" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Execution HUD */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        <div className="xl:col-span-8 bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#111113]/50">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><BarChart3 className="w-4 h-4" /></div>
                <h3 className="text-sm font-black uppercase tracking-widest italic">{category} Execution History</h3>
             </div>
             <RefreshCcw className="w-4 h-4 text-zinc-700 hover:text-indigo-400 cursor-pointer transition-colors" onClick={fetchLogs} />
          </div>

          <div className="p-8 space-y-6 min-h-[400px]">
             {logs.map((log: any) => (
               <div key={log.id} className="flex flex-col p-6 bg-white/[0.02] border border-white/5 rounded-2xl gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-6">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[10px] ${
                         log.accion === 'COMPRA' ? 'bg-indigo-500/10 text-indigo-400' : 
                         log.accion === 'VENTA' ? 'bg-emerald-500/10 text-emerald-400' :
                         'bg-zinc-800 text-zinc-500'
                       }`}>
                          {log.accion}
                       </div>
                       <div>
                          <p className="text-sm font-black tracking-tight">{log.categoria || category}</p>
                          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</p>
                       </div>
                    </div>
                    <p className="text-sm font-black italic">${log.precio.toLocaleString()}</p>
                  </div>
                  <div className="text-xs text-zinc-400 bg-black/40 p-4 rounded-xl border border-white/5">
                    <span className="text-[9px] uppercase tracking-widest font-black text-indigo-400 block mb-1">Reasoning & Intelligence:</span>
                    {log.razon}
                  </div>
               </div>
             ))}
             {logs.length === 0 && <div className="text-center py-20 opacity-20 italic">No execution data for this sector.</div>}
          </div>
        </div>

        {/* Intelligence Sidepanel */}
        <div className="xl:col-span-4 space-y-8">
           <div className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group min-h-[400px]">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Globe className="w-4 h-4" /></div>
                  <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Market Intel</h3>
                </div>
                <button onClick={() => handleTrigger('INTEL')} disabled={deploying} className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-zinc-500 hover:text-indigo-400 transition-all">
                  <RefreshCcw className={`w-3.5 h-3.5 ${deploying ? 'animate-spin' : ''}`} />
                </button>
              </div>

              <div className="space-y-6 text-xs text-zinc-400">
                 {latestLog?.news_analysis ? (
                   <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400 italic">Sector Analysis</p>
                      <p className="text-white font-medium leading-relaxed">{latestLog.news_analysis}</p>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center py-20 opacity-30 italic">
                      <p className="text-[10px] uppercase tracking-[0.2em] font-black">Scanning Neural Feed...</p>
                   </div>
                 )}
              </div>
            </div>
         </div>
      </div>
      
      <SectorNews category={category} />
    </div>
  </div>
  );
}
