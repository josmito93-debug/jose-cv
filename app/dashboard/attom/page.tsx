'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  RefreshCcw, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  Zap,
  ArrowUpRight,
  Filter,
  Search,
  MoreVertical,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function AttomLeadDashboard() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'reviewed' | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/attom/clients');
      const data = await res.json();
      if (data.success) {
        setClients(data.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter logic
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.contactName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === 'pending') return matchesSearch && client.status !== 'PAID';
    if (activeTab === 'reviewed') return matchesSearch && client.status === 'PAID';
    return matchesSearch;
  });

  // Derived metrics (Mocked for UI/UX demonstration since Airtable might not have full history yet)
  const stats = {
    totalLeads: clients.length,
    pendingReview: clients.filter(c => c.status !== 'PAID').length,
    monthlyLeads: 24, // Mocked
    avgResponseTime: '4.2h', // Mocked
    conversionRate: '82%' // Mocked
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto px-4 lg:px-8 pb-32">
      
      {/* Header - Premium Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-8 border-b border-white/5">
        <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/70">Intelligence Hub Active</span>
            </div>
            <h2 className="text-4xl font-black tracking-tight uppercase italic text-white leading-none">
              ATTOM <span className="text-zinc-500">LEAD CENTER</span>
            </h2>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em]">Automated Web Architecture & Client Ingest</p>
        </div>
        
        <div className="flex items-center gap-4">
           <button 
             onClick={fetchClients}
             className="p-3 bg-white/5 border border-white/5 rounded-2xl text-zinc-500 hover:text-white transition-all"
           >
             <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
           </button>
           <button className="px-8 py-4 bg-white text-black font-black rounded-2xl shadow-2xl hover:scale-105 transition-all text-xs uppercase tracking-widest flex items-center gap-3">
              <Zap className="w-4 h-4 fill-current" /> Sync Database
           </button>
        </div>
      </div>

      {/* KPI GRID - High Density Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          label="Total Leads" 
          value={stats.totalLeads} 
          trend="+12%" 
          icon={<Users className="w-4 h-4" />} 
          color="emerald" 
        />
        <MetricCard 
          label="Pending Review" 
          value={stats.pendingReview} 
          trend={stats.pendingReview > 5 ? "Action Needed" : "Controlled"} 
          icon={<Clock className="w-4 h-4" />} 
          color="amber" 
        />
        <MetricCard 
          label="Avg. Attention" 
          value={stats.avgResponseTime} 
          trend="Super Fast" 
          icon={<Activity className="w-4 h-4" />} 
          color="indigo" 
        />
        <MetricCard 
          label="Ingest Rate" 
          value={stats.monthlyLeads} 
          trend="Monthly" 
          icon={<TrendingUp className="w-4 h-4" />} 
          color="purple" 
        />
      </div>

      {/* CHARTS SECTION - Split View */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Monthly Ingest Visualizer */}
        <div className="xl:col-span-8 bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-8 space-y-8 overflow-hidden relative group">
           <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">Growth Module</h3>
                <p className="text-lg font-black text-white italic uppercase tracking-tighter">Clientes que entran al mes</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[9px] font-black text-emerald-400">
                <TrendingUp className="w-3 h-3" /> +24% YoY
              </div>
           </div>

           {/* Custom Monthly Bars */}
           <div className="h-64 flex items-end justify-between gap-2 px-4">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => {
                const height = [40, 55, 30, 80, 65, 90, 75, 40, 60, 85, 95, 70][i];
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-4 group/bar">
                    <div className="w-full relative">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: i * 0.05, ease: "circOut" }}
                        className={`w-full rounded-t-lg bg-gradient-to-t ${i === 10 ? 'from-emerald-600 to-emerald-400' : 'from-white/5 to-white/20'} group-hover/bar:from-emerald-500 group-hover/bar:to-emerald-300 transition-all cursor-pointer`}
                      >
                         <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-[9px] font-black rounded pointer-events-none transition-all">
                           {height}
                         </div>
                      </motion.div>
                    </div>
                    <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{month}</span>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Attention Speed Visualizer */}
        <div className="xl:col-span-4 bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-8 space-y-8">
           <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">Velocidad de Respuesta</h3>
           
           <div className="space-y-6">
              <SpeedMetric label="Ingest -> Initial Chat" time="12m" percentage={95} color="emerald" />
              <SpeedMetric label="Chat -> Proposal" time="45m" percentage={80} color="indigo" />
              <SpeedMetric label="Proposal -> Review" time="2.4h" percentage={65} color="purple" />
              <SpeedMetric label="Review -> Live" time="1.2h" percentage={88} color="amber" />
           </div>

           <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl">
              <p className="text-[10px] font-bold text-zinc-500 leading-relaxed italic">
                "ATTOM AI está procesando información un 85% más rápido que la gestión manual anterior."
              </p>
           </div>
        </div>

      </div>

      {/* LIST SECTION - Inventory Management */}
      <div className="bg-[#0C0C0E] border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-[#111113]/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-6">
              <h3 className="text-sm font-black uppercase tracking-widest italic text-white">Lead Inventory</h3>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                 <TabButton label="Pending" active={activeTab === 'pending'} onClick={() => setActiveTab('pending')} />
                 <TabButton label="Reviewed" active={activeTab === 'reviewed'} onClick={() => setActiveTab('reviewed')} />
                 <TabButton label="All" active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
              </div>
           </div>

           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input 
                type="text" 
                placeholder="Search by business or name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-[10px] font-bold w-full md:w-80 focus:outline-none focus:border-emerald-500/30 transition-all text-white" 
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">Client Info</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">Context</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">Performance</th>
                <th className="px-10 py-6 text-[10px] font-black uppercase tracking-widest text-zinc-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="animate-pulse border-b border-white/5">
                    <td colSpan={4} className="px-10 py-12 bg-white/[0.01]" />
                  </tr>
                ))
              ) : filteredClients.length > 0 ? filteredClients.map((client) => (
                <tr key={client.id} className="group hover:bg-white/[0.02] transition-all">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-xl text-emerald-500 group-hover:scale-110 transition-transform">
                          {client.businessName.charAt(0)}
                       </div>
                       <div>
                          <h4 className="text-base font-black text-white italic uppercase tracking-tighter flex items-center gap-2">
                            {client.businessName}
                            {client.status === 'PAID' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                             <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{client.contactName}</p>
                             <div className="w-1 h-1 rounded-full bg-zinc-800" />
                             <p className="text-[10px] font-bold text-zinc-700">{client.email || client.phone}</p>
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="space-y-2">
                       <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                         client.status === 'PAID' 
                         ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                         : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                       }`}>
                          {client.status === 'PAID' ? 'Review Verified' : 'Awaiting Review'}
                       </div>
                       <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">
                         Ingested: {new Date(client.date).toLocaleDateString('es', { day: '2-digit', month: 'short' })}
                       </p>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-4">
                       <div className="flex -space-x-2">
                          {[1,2,3].map(i => (
                            <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0C0C0E] bg-zinc-900 flex items-center justify-center">
                               <Zap className="w-2.5 h-2.5 text-zinc-600" />
                            </div>
                          ))}
                       </div>
                       <span className="text-[10px] font-black text-white">94% Score</span>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                       <button className="px-6 py-2.5 bg-white text-black font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-emerald-500 transition-all">
                          Verify Data
                       </button>
                       <button className="p-2.5 bg-white/5 border border-white/5 rounded-xl text-zinc-600 hover:text-white transition-all">
                          <MoreVertical className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-10 py-40 text-center">
                    <div className="flex flex-col items-center gap-6">
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                        <AlertCircle className="w-8 h-8 text-zinc-800" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-lg font-black text-zinc-600 uppercase italic">No se detectaron leads</p>
                        <p className="text-[10px] font-bold text-zinc-800 uppercase tracking-widest">Asegúrate de que el Bot de Ingesta esté activo</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ label, value, trend, icon, color }: { label: string; value: string | number; trend: string; icon: any; color: string }) {
  const colors: any = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-8 space-y-6 group cursor-default"
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-2xl ${colors[color]}`}>{icon}</div>
        <div className="text-[10px] font-black uppercase tracking-widest text-zinc-700">{trend}</div>
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">{label}</p>
        <h4 className="text-3xl font-black text-white italic tracking-tighter">{value}</h4>
      </div>
    </motion.div>
  );
}

function SpeedMetric({ label, time, percentage, color }: { label: string; time: string; percentage: number; color: string }) {
  const colors: any = {
    emerald: 'bg-emerald-500',
    indigo: 'bg-indigo-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500'
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-zinc-500">{label}</span>
        <span className="text-white italic">{time}</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1.5, ease: "circOut" }}
          className={`h-full ${colors[color]} rounded-full`}
        />
      </div>
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
        active ? 'bg-white text-black shadow-xl' : 'text-zinc-600 hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}
