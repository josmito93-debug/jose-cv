'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TradingLog {
  id: string;
  timestamp: string;
  accion: 'COMPRA' | 'VENTA' | 'ESPERA';
  precio: number;
  razon: string;
  capital_actual: number;
}

export default function TradingDashboard() {
  const [logs, setLogs] = useState<TradingLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'realtime' | 'history'>('realtime');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/trading-logs');
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
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
  const initialCapital = 300.00; // Mock initial capital or fetch from DB
  const currentCapital = latestLog?.capital_actual || initialCapital;
  const profit = ((currentCapital - initialCapital) / initialCapital) * 100;

  return (
    <div className="bg-[#050507] text-white min-h-screen selection:bg-indigo-500/30 font-inter">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:32px_32px]" />
      </div>

      <header className="sticky top-0 z-[100] border-b border-white/5 bg-black/40 backdrop-blur-2xl">
        <div className="max-w-[1600px] mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-indigo-600/20 shadow-glow">
              <span className="text-2xl">📉</span>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter">
                JF.OS <span className="text-zinc-600 font-extralight text-lg ml-1">/ Trading Intelligence</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
               <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#10b981]"></span>
               <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Neural Link Active</span>
            </div>
            <Link href="/" className="text-sm font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest px-4">CV</Link>
            <Link href="/dashboard" className="text-sm font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest px-4 border-l border-white/10 ml-2">Attom OS</Link>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-8 py-12 relative z-10">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="group bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl hover:border-indigo-500/30 transition-all duration-500 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors"></div>
            <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Capital en Gestión</p>
            <div className="text-6xl font-black tracking-tighter text-white mb-2">
              ${currentCapital.toFixed(2)}<span className="text-zinc-700 text-3xl font-extralight ml-2">USD</span>
            </div>
            <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Apalancamiento: 1:500</p>
          </div>

          <div className="group bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl transition-all duration-500 shadow-2xl relative overflow-hidden">
             <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Rendimiento Histórico</p>
             <div className={`text-6xl font-black tracking-tighter mb-2 ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
               {profit >= 0 ? '+' : ''}{profit.toFixed(2)}%
             </div>
             <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">ROI Total (Desde Inception)</p>
          </div>

          <div className="group bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl transition-all duration-500 shadow-2xl relative overflow-hidden">
             <p className="text-xs font-black text-zinc-500 uppercase tracking-[0.3em] mb-4">Estado del Agente</p>
             <div className="flex items-center gap-6 mt-4">
               <div className="flex flex-col">
                 <span className="text-4xl font-black tracking-tighter">ESPERA</span>
                 <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Siguiente Pulso: 15s</span>
               </div>
               <div className="flex-1 h-12 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-center">
                 <div className="w-full px-4 flex justify-between">
                   {[...Array(6)].map((_, i) => (
                     <div key={i} className="w-1.5 h-6 bg-indigo-500/30 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                   ))}
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Console & History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-black/40 border border-white/5 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="px-10 py-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400 font-mono text-xs">LOG</span>
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400">Consola de Decisiones</h3>
              </div>
              <div className="flex gap-2">
                 <button onClick={() => setActiveTab('realtime')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'realtime' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-white'}`}>Real-time</button>
                 <button onClick={() => setActiveTab('history')} className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white' : 'text-zinc-500 hover:text-white'}`}>Historial</button>
              </div>
            </div>

            <div className="h-[600px] overflow-y-auto p-10 font-mono text-sm space-y-6 custom-scrollbar-premium">
              {logs.length > 0 ? (activeTab === 'realtime' ? logs.slice(0, 5) : logs).map((log, i) => (
                <div key={log.id} className="animate-[slideInUp_0.4s_ease-out] group">
                   <div className="flex items-start gap-6 border-l-2 border-white/5 group-hover:border-indigo-500/50 pl-6 transition-all">
                     <span className="text-zinc-600 text-xs mt-1 w-20 shrink-0">{new Date(log.timestamp).toLocaleTimeString()}</span>
                     <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter ${
                            log.accion === 'COMPRA' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                            log.accion === 'VENTA' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                            'bg-white/5 text-zinc-500 border border-white/5'
                          }`}>
                            {log.accion}
                          </span>
                          <span className="text-zinc-300 font-bold">${log.precio.toFixed(2)}</span>
                        </div>
                        <p className="text-zinc-500 text-xs leading-relaxed font-light">{log.razon}</p>
                     </div>
                   </div>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-zinc-700 animate-pulse">
                   <div className="text-4xl mb-4">〰️</div>
                   <p className="uppercase tracking-[0.3em] font-black text-[10px]">Escaneando señales del mercado...</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 backdrop-blur-xl h-max">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-8">Interpretación IA</h3>
               <div className="space-y-6">
                 {logs.slice(0, 3).map((log, i) => (
                    <div key={i} className="flex gap-4 items-start">
                       <span className="text-lg opacity-40">{i === 0 ? '🧠' : i === 1 ? '👁️' : '🔍'}</span>
                       <div className="flex-1">
                          <p className="text-zinc-300 text-[13px] leading-relaxed italic">"{log.razon.split(' ').slice(0, 15).join(' ')}..."</p>
                          <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest mt-2 block">Certeza: 8{i}%.4</span>
                       </div>
                    </div>
                 ))}
               </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-[2.5rem] p-10 backdrop-blur-xl relative overflow-hidden group">
               <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-[0.03] transition-opacity"></div>
               <h3 className="text-sm font-black uppercase tracking-widest text-white mb-4">Exportar Data</h3>
               <p className="text-xs text-zinc-400 leading-relaxed font-light mb-8">Descarga el historial completo de operaciones en formato estructurado para auditoría externa.</p>
               <button className="w-full py-4 bg-white/[0.05] hover:bg-white/[0.1] rounded-2xl border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] transition-all">CSV Reporting</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
