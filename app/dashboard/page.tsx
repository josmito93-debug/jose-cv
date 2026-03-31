'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity, Cpu, Zap, ShieldCheck, ArrowUpRight, Globe, BarChart3, Search } from 'lucide-react';
import PriceTicker from '../components/dashboard/PriceTicker';
import TrendingAssets from '../components/dashboard/TrendingAssets';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function GlobalOverview() {
  const [logs, setLogs] = useState<any[]>([]);
  const [performance, setPerformance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/trading-logs');
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

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const latestLog = logs[0] || null;
  const currentCapital = latestLog?.capital_actual || 100000.00;

  return (
    <div className="space-y-0 max-w-[1600px] mx-auto pb-32">
      
      <PriceTicker category="Overview" />
      
      <div className="px-4 lg:px-8 space-y-10 mt-10">
      {/* Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-white/5">
        <div className="space-y-4">
           {/* Terminal Badges from Screenshot */}
           <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[8px] font-black uppercase text-emerald-400 tracking-wider">Terminal Active</div>
              <div className="px-2 py-1 bg-white/5 border border-white/10 rounded-md text-[8px] font-black uppercase text-zinc-500 tracking-wider">API: Multi-Source AlphaV x CodexID</div>
           </div>
           
           <div className="flex items-center gap-3">
              <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[9px] font-black uppercase text-indigo-400 italic">Global Surveillance</div>
              <div className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-[9px] font-black uppercase text-zinc-500">JF.OS Neural Link V3</div>
           </div>
           <h2 className="text-3xl font-black tracking-tight italic">Global <span className="text-zinc-500">Overview</span></h2>
           <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Multi-Market Autonomous Surveillance Hub</p>
        </div>
        
        <div className="flex items-center gap-10">
           <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Total Portfolio Value</p>
              <p className="text-2xl font-black tracking-tighter text-white">${currentCapital.toLocaleString()}</p>
           </div>
        </div>
      </div>

      <TrendingAssets category="Overview" />
        
        <div className="flex items-center gap-10">
           <div className="text-right">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Total Portfolio Value</p>
              <p className="text-2xl font-black tracking-tighter text-white">${currentCapital.toLocaleString()}</p>
           </div>
        </div>
      </div>

      {/* Aggregated Performance Chart */}
      <div className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Unified ROI Stream</h3>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-[10px] font-black uppercase tracking-widest text-indigo-400">Master Node</div>
          </div>
        </div>

        <div className="h-[300px] w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performance.length > 0 ? performance : [{ timestamp: '00:00', value: 100000 }]}>
              <defs>
                <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
              <XAxis dataKey="timestamp" hide />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px' }}
                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multi-Sector Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {['Crypto', 'Metals', 'Forex', 'Stocks'].map((cat) => (
          <div key={cat} className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-8 group hover:border-indigo-500/30 transition-all">
            <div className="flex items-center justify-between mb-6">
               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-700">{cat} Unit</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-2xl font-black italic mb-2 tracking-tighter">Active</p>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Neural Link Syncing...</p>
          </div>
        ))}
      </div>

      {/* Recent Global Activity */}
      <div className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-[#111113]/50">
           <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><Activity className="w-4 h-4" /></div>
           <h3 className="text-sm font-black uppercase tracking-widest italic">Global Event Feed</h3>
        </div>

        <div className="p-8 space-y-4">
           {logs.slice(0, 8).map((log: any) => (
             <div key={log.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                   <span className={`text-[10px] font-black px-3 py-1 rounded-full ${
                     log.categoria === 'Stocks' ? 'bg-indigo-500/20 text-indigo-400' :
                     log.categoria === 'Metals' ? 'bg-amber-500/20 text-amber-400' :
                     log.categoria === 'Forex' ? 'bg-blue-500/20 text-blue-400' :
                     'bg-emerald-500/20 text-emerald-400'
                   }`}>{log.categoria || 'Crypto'}</span>
                   <p className="text-xs font-bold text-white">{log.accion} @ ${log.precio.toLocaleString()}</p>
                </div>
                <span className="text-[9px] font-bold text-zinc-700 uppercase">{new Date(log.timestamp).toLocaleTimeString()}</span>
             </div>
           ))}
        </div>
      </div>

    </div>
  );
}