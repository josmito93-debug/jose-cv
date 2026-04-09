'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Activity, 
  Database, 
  Zap, 
  Cpu, 
  ArrowLeft,
  RefreshCw,
  GitBranch,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Play,
  Copy,
  ChevronRight,
  Settings2,
  Clock,
  HardDrive,
  BarChart3,
  Server
} from 'lucide-react';

export default function N8NAgentDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchData = async () => {
    try {
      const res = await fetch('/api/n8n/stats');
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Live sync every 10s
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white  overflow-x-hidden selection:bg-indigo-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0" style={{ 
        backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 0.5px)`, 
        backgroundSize: '32px 32px' 
      }} />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 blur-[150px] rounded-full -mr-40 -mt-40" />

      {/* Cinematic HUD Header */}
      <header className="h-24 border-b border-white/5 backdrop-blur-2xl px-12 flex items-center justify-between relative z-50">
        <div className="flex items-center gap-8">
          <Link href="/hq" className="p-3 hover:bg-white/5 rounded-2xl transition-all group border border-transparent hover:border-white/10 active:scale-95">
            <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-white" />
          </Link>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <Database className="w-6 h-6" />
             </div>
             <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase italic leading-none">N8N <span className="text-indigo-400">Agent Explorer</span></h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 mt-1">Autonomous Infrastructure Monitoring</p>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-10">
           <div className="flex flex-col items-end">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">Surveillance Time</span>
              <span className="text-sm font-bold text-zinc-400 font-mono">{currentTime.toLocaleTimeString([], { hour12: false })}</span>
           </div>
           <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
             <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">System Core: Online</span>
           </div>
        </div>
      </header>

      <main className="p-12 space-y-12 relative z-10 max-w-[1600px] mx-auto pb-32">
        
        {/* Executive Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           <StatusCard 
              label="Workflows Active" 
              value={loading ? '...' : data?.stats?.activeWorkflows} 
              subValue={`of ${data?.stats?.totalWorkflows} total`}
              icon={<Zap className="w-5 h-5" />} 
              color="text-indigo-400"
              bg="bg-indigo-400/5"
           />
           <StatusCard 
              label="Success Rate" 
              value={loading ? '...' : `${data?.stats?.successRate}%`} 
              subValue="Last 24h Executions"
              icon={<ShieldCheck className="w-5 h-5" />} 
              color="text-emerald-400"
              bg="bg-emerald-400/5"
           />
           <StatusCard 
              label="System Health" 
              value={loading ? '...' : data?.stats?.systemHealth} 
              subValue="Latency: 124ms"
              icon={<Activity className="w-5 h-5" />} 
              color="text-amber-400"
              bg="bg-amber-400/5"
           />
           <StatusCard 
              label="Data Storage" 
              value="82%" 
              subValue="Optimizing Auto-Purge"
              icon={<HardDrive className="w-5 h-5" />} 
              color="text-white"
              bg="bg-white/5"
           />
        </div>

        <div className="grid grid-cols-12 gap-8">
           {/* Center Table: Workflow Registry */}
           <div className="col-span-12 lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
                       <BarChart3 className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-black uppercase tracking-tighter italic">Workflow Registry</h2>
                 </div>
                 <button onClick={fetchData} className="p-2 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all">
                    <RefreshCw className={`w-4 h-4 text-zinc-600 ${loading ? 'animate-spin' : ''}`} />
                 </button>
              </div>

              <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-xl">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="border-b border-white/5 bg-white/[0.01]">
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">Workflow Identity</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">Status</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">Nodes</th>
                          <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {loading ? (
                          [1,2,3,4,5].map(i => <tr key={i} className="animate-pulse"><td colSpan={4} className="h-20 bg-white/[0.01]" /></tr>)
                       ) : (
                          data?.workflows.map((wf: any) => (
                             <motion.tr 
                                key={wf.id}
                                className="group hover:bg-white/[0.02] transition-colors"
                             >
                                <td className="px-10 py-6">
                                   <div className="flex items-center gap-4">
                                      <div className={`w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center ${wf.active ? 'text-indigo-400 shadow-[0_0_15px_rgba(129,140,248,0.1)]' : 'text-zinc-600'}`}>
                                         <Zap className="w-5 h-5" />
                                      </div>
                                      <div>
                                         <p className="text-sm font-black uppercase tracking-tight text-white group-hover:text-indigo-400 transition-colors">{wf.name}</p>
                                         <p className="text-[9px] font-bold text-zinc-500 uppercase">ID: {wf.id}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="px-10 py-6">
                                   <div className="flex items-center gap-2">
                                      <div className={`w-1.5 h-1.5 rounded-full ${wf.active ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
                                      <span className={`text-[10px] font-black uppercase ${wf.active ? 'text-emerald-400' : 'text-red-400'}`}>
                                         {wf.active ? 'Active' : 'Inactive'}
                                      </span>
                                   </div>
                                </td>
                                <td className="px-10 py-6">
                                   <span className="text-xs font-bold text-zinc-400">{wf.nodes?.length || 0} Nodes</span>
                                </td>
                                <td className="px-10 py-6 text-right">
                                   <Link href={`/hq/architect?workflow=${wf.id}`} className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:border-indigo-500 hover:text-white transition-all">
                                      Architect <ChevronRight className="w-3 h-3" />
                                   </Link>
                                </td>
                             </motion.tr>
                          ))
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Right Column: Live Executions (Width 4/12) */}
           <div className="col-span-12 lg:col-span-4 space-y-6 flex flex-col h-full">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
                    <Terminal className="w-5 h-5" />
                 </div>
                 <h2 className="text-xl font-black uppercase tracking-tighter italic">Live Intelligence Stream</h2>
              </div>

              <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 flex flex-col backdrop-blur-xl relative overflow-hidden h-[600px]">
                 <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Activity className="w-32 h-32 text-indigo-400" />
                 </div>
                 
                 <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2 relative z-10">
                    {loading ? (
                       Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 bg-white/5 rounded-2xl animate-pulse" />)
                    ) : (
                       data?.executions.length === 0 ? (
                          <div className="h-full flex flex-col items-center justify-center text-center opacity-30 gap-4">
                             <Server className="w-12 h-12" />
                             <p className="text-[10px] font-black uppercase tracking-[0.2em]">No Recent Executions Found</p>
                          </div>
                       ) : (
                          data?.executions.map((exe: any) => (
                             <div 
                                key={exe.id}
                                className="p-5 bg-black/40 border border-white/5 rounded-[2rem] group hover:border-indigo-500/30 transition-all flex flex-col gap-3"
                             >
                                <div className="flex items-center justify-between">
                                   <div className="flex items-center gap-3">
                                      <div className={`w-2 h-2 rounded-full ${exe.finished && !exe.stopped ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-red-500 shadow-[0_0_10px_#ef4444]'}`} />
                                      <span className="text-[10px] font-black text-white uppercase tracking-tight truncate max-w-[150px]">
                                         Workflow Run #{exe.id}
                                      </span>
                                   </div>
                                   <span className="text-[9px] font-bold text-zinc-600 block">
                                      {new Date(exe.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                   </span>
                                </div>
                                <div className="flex items-center justify-between border-t border-white/5 pt-3">
                                   <span className="text-[8px] font-black uppercase text-zinc-700 tracking-widest">{exe.mode} Processing</span>
                                   <div className="flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-zinc-700" />
                                      <span className="text-[9px] font-bold text-zinc-500">{(new Date(exe.stoppedAt || Date.now()).getTime() - new Date(exe.startedAt).getTime()) / 1000}s</span>
                                   </div>
                                </div>
                             </div>
                          ))
                       )
                    )}
                 </div>
              </div>
              
              {/* Hardware Status Card */}
              <div className="p-8 bg-indigo-600/10 border border-indigo-600/20 rounded-[3rem] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-[60px] -mr-16 -mt-16 pointer-events-none" />
                 <div className="flex items-center gap-6 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 group-hover:scale-110 transition-transform">
                       <Cpu className="w-7 h-7" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black italic uppercase tracking-tighter">Instance Performance</h3>
                       <p className="text-[9px] font-bold text-indigo-400/70 uppercase tracking-widest">Autonomous Core v3.2</p>
                    </div>
                 </div>
                 <div className="mt-8 grid grid-cols-2 gap-4 relative z-10">
                    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                       <p className="text-[8px] font-black uppercase text-zinc-600 mb-1">RAM Usage</p>
                       <p className="text-sm font-black text-white">428MB / 1GB</p>
                    </div>
                    <div className="p-4 bg-black/40 border border-white/5 rounded-2xl">
                       <p className="text-[8px] font-black uppercase text-zinc-600 mb-1">CPU Load</p>
                       <p className="text-sm font-black text-white">12.4%</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 h-10 bg-black/90 backdrop-blur-xl border-t border-white/5 px-12 flex items-center justify-between text-[10px] font-black text-zinc-600 tracking-widest z-[60]">
        <div className="flex gap-10">
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              <span>N8N CORE VERSION: 1.34.2</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>API POLLING: ACTIVE (10s)</span>
           </div>
        </div>
        <span>AUTONOMOUS SURVEILLANCE ACTIVE</span>
      </footer>
    </div>
  );
}

function StatusCard({ label, value, subValue, icon, color, bg }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      className={`p-10 ${bg} border border-white/5 rounded-[3.5rem] relative overflow-hidden group`}
    >
       <div className="absolute top-0 right-0 w-32 h-32 group-hover:scale-150 transition-transform opacity-10 pointer-events-none">
          {icon}
       </div>
       <div className={`p-4 rounded-2xl bg-white/5 border border-white/5 ${color} w-fit mb-6`}>
          {icon}
       </div>
       <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">{label}</p>
          <h4 className={`text-4xl font-black tracking-tighter italic ${color} leading-none mb-2`}>{value}</h4>
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{subValue}</p>
       </div>
    </motion.div>
  );
}
