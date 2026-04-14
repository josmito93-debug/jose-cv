'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Zap, 
  Globe, 
  Plus, 
  Search, 
  MoreVertical, 
  ExternalLink, 
  CheckCircle2, 
  Clock,
  Activity,
  Filter,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  FileText,
  CreditCard,
  AlertCircle
} from 'lucide-react';

export default function UnifiedAdminVercel() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [vercelProjects, setVercelProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    monthlyRevenue: 0,
    pendingPayments: 0
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = clients.filter(client => 
    client.business?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    client.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, vercelRes] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/vercel/projects')
        ]);
        
        const clientsData = await clientsRes.json();
        const vercelData = await vercelRes.json();

        let unifiedClients: any[] = [];

        if (vercelData.success && vercelData.projects) {
          // 1. Start with Vercel projects as the base
          unifiedClients = vercelData.projects.map((project: any) => {
            // Find corresponding Airtable data if exists
            const atClient = clientsData.clients?.find((c: any) => 
               c.business?.toLowerCase().includes(project.name.toLowerCase()) ||
               project.name.toLowerCase().includes(c.business?.toLowerCase())
            );

            return {
              id: atClient?.info?.clientId || project.id,
              name: atClient?.name || 'Unknown Owner',
              business: project.name,
              status: 'DEPLOYED',
              paymentStatus: atClient?.paymentStatus || 'UNPAID',
              vercelUrl: project.targets?.production?.url || project.link || '',
              lastDeploy: project.updatedAt,
              isVercelMaster: true,
              atData: atClient || null
            };
          });

          // 2. Add Airtable clients that AREN'T in Vercel yet
          const vercelProjectNames = new Set(vercelData.projects.map((p: any) => p.name.toLowerCase()));
          const extraClients = (clientsData.clients || []).filter((c: any) => 
            !vercelProjectNames.has(c.business?.toLowerCase())
          );

          unifiedClients = [...unifiedClients, ...extraClients.map((c: any) => ({
            ...c,
            isVercelMaster: false,
            status: 'PENDING'
          }))];

          setClients(unifiedClients);
          setVercelProjects(vercelData.projects);
          
          setStats({
            totalClients: unifiedClients.length,
            activeProjects: vercelData.projects.length,
            monthlyRevenue: unifiedClients.filter((c: any) => c.paymentStatus === 'PAID').length * 30,
            pendingPayments: unifiedClients.filter((c: any) => c.paymentStatus !== 'PAID').length
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const generateInvoice = async (client: any) => {
     try {
       const res = await fetch('/api/billing/invoice', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ clientId: client.id, businessName: client.business })
       });
       const data = await res.json();
        if (data.success) {
          // Robust clipboard copy with fallback
          const copyToClipboard = (text: string) => {
            if (navigator.clipboard && window.isSecureContext) {
              return navigator.clipboard.writeText(text);
            } else {
              const textArea = document.createElement("textarea");
              textArea.value = text;
              textArea.style.position = "fixed";
              textArea.style.left = "-999999px";
              textArea.style.top = "-999999px";
              document.body.appendChild(textArea);
              textArea.focus();
              textArea.select();
              return new Promise<void>((res, rej) => {
                document.execCommand('copy') ? res() : rej();
                textArea.remove();
              });
            }
          };

          try {
            await copyToClipboard(data.paymentUrl);
            alert(`LINK GENERATED & COPIED: ${client.business} ($30/mo)\nURL: ${data.paymentUrl}`);
          } catch (e) {
            alert(`LINK GENERATED (Could not copy to clipboard):\nURL: ${data.paymentUrl}`);
          }
        } else {
          alert(`Failed to generate invoice: ${data.error || 'Unknown error'}`);
        }
     } catch (err: any) {
       console.error('Failed to generate link:', err);
       alert(`Error generating invoice: ${err.message}`);
     }
  };

  const handleCommandAgent = () => {
    router.push('/creador');
  };

  const getVercelStatus = (client: any) => {
     const project = vercelProjects.find(p => p.name.toLowerCase().includes(client.business.toLowerCase()));
     return project ? { live: true, url: project.targets?.production?.url } : { live: false };
  };

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto px-4 lg:px-8 pb-32">
      
      {/* Header Area - Stakent Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-white/5">
        <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-md text-[9px] font-black uppercase text-indigo-400 ">Universa v2.6</div>
              <div className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-[9px] font-black uppercase text-zinc-500">Cloud Sync Active</div>
            </div>
            <h2 className="text-3xl font-black tracking-tight uppercase italic">Agency <span className="text-zinc-500">Headquarter</span></h2>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex flex-col items-end px-6 border-r border-white/5">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Monthly Recurring Revenue</p>
              <p className="text-xl font-black tracking-tighter text-emerald-400">${stats.monthlyRevenue.toLocaleString()}.00</p>
           </div>
           <Link href="/admin/clients/new">
             <button className="px-8 py-3 bg-white text-black font-black rounded-xl shadow-2xl flex items-center gap-3 hover:bg-zinc-200 transition-all text-xs">
                <Plus className="w-4 h-4" /> Register Client
             </button>
           </Link>
        </div>
      </div>

      {/* KPI Cards - Stakent High Density */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ModernStatCard label="Total Clients" value={stats.totalClients.toString()} subValue="Active base" icon={<Users className="w-4 h-4" />} color="indigo" />
        <ModernStatCard label="Live on Vercel" value={stats.activeProjects.toString()} subValue="Real-time check" icon={<Globe className="w-4 h-4" />} color="emerald" />
        <ModernStatCard label="Pending Payments" value={stats.pendingPayments.toString()} subValue="Requires Action" icon={<AlertCircle className="w-4 h-4" />} color="amber" />
        <ModernStatCard label="Billing Cycle" value="30d" subValue="Next: April 15" icon={<CreditCard className="w-4 h-4" />} color="purple" />
      </div>

      {/* Main Content Layout - Split View */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Client Inventory (Stakent List View) */}
        <div className="xl:col-span-8 bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#111113]/50">
             <h3 className="text-sm font-black uppercase tracking-widest italic">Inventory & Billing Module</h3>
             <div className="flex items-center gap-4">
                <div className="relative">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700" />
                   <input 
                      type="text" 
                      placeholder="Search clients..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white/5 border border-white/5 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold w-48 focus:outline-none focus:border-white/10" 
                    />
                </div>
                <Filter className="w-4 h-4 text-zinc-700 hover:text-white transition-colors cursor-pointer" />
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px] lg:min-w-0">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">Client / Vision</th>
                  <th className="hidden sm:table-cell p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-zinc-600 text-center">Vercel Sync</th>
                  <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-zinc-600 text-center">Payment</th>
                  <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-zinc-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse"><td colSpan={4} className="p-10 bg-white/5" /></tr>
                  ))
                ) : filteredClients.length > 0 ? (
                  filteredClients.map((client) => {
                    const isDeployed = client.status === 'DEPLOYED';
                    return (
                      <tr key={client.id} className="group hover:bg-white/[0.02] transition-colors">
                        <td className="p-4 md:p-6">
                          <div className="flex items-center gap-3 md:gap-4">
                             <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px] md:text-xs shrink-0">
                                {client.business.charAt(0)}
                             </div>
                             <div className="min-w-0">
                                 <p className="text-sm font-black tracking-tight truncate flex items-center gap-2">
                                  {client.business}
                                  {client.name === 'Pendiente (Attom Link)' && (
                                    <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 text-[7px] font-black uppercase rounded border border-indigo-500/30">Lead Ingest</span>
                                  )}
                                </p>
                                <p className="text-[9px] md:text-[10px] font-bold text-zinc-600 uppercase tracking-widest truncate">
                                  {client.name === 'Pendiente (Attom Link)' ? 'BOT COLLECTION' : (client.isVercelMaster ? 'Vercel' : 'Airtable')} / {client.name}
                                </p>
                             </div>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell p-4 md:p-6 text-center">
                           <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${
                             isDeployed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                           }`}>
                              {isDeployed ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              <span className="hidden md:inline">{isDeployed ? 'Live' : 'Pending'}</span>
                           </div>
                        </td>
                        <td className="p-4 md:p-6 text-center">
                           <div className={`inline-flex items-center gap-2 px-2 md:px-3 py-1 rounded-full border text-[7px] md:text-[8px] font-black uppercase tracking-widest ${
                             client.paymentStatus === 'PAID' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                           }`}>
                              {client.paymentStatus === 'PAID' ? 'PAID' : 'UNPAID'}
                           </div>
                        </td>
                        <td className="p-4 md:p-6 text-right">
                           <div className="flex items-center justify-end gap-2 md:gap-3">
                             {client.paymentStatus !== 'PAID' && (
                               <button 
                                 onClick={() => generateInvoice(client)}
                                 className="flex px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-indigo-400 hover:bg-indigo-500 hover:text-white transition-all items-center gap-2"
                               >
                                  <FileText className="w-3 h-3" /> <span className="hidden lg:inline">Invoice</span>
                               </button>
                             )}
                             {client.vercelUrl && (
                               <a href={client.vercelUrl} target="_blank" className="p-2 md:p-2.5 bg-white/5 rounded-lg md:rounded-xl border border-white/5 text-zinc-500 hover:text-white transition-all shrink-0">
                                  <ExternalLink className="w-3.5 h-3.5" />
                               </a>
                             )}
                             <button className="p-2 md:p-2.5 bg-white/5 rounded-lg md:rounded-xl border border-white/5 text-zinc-500 hover:text-white transition-all shrink-0">
                                <MoreVertical className="w-3.5 h-3.5" />
                             </button>
                           </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="p-20 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700 italic">No matching clients found in local node</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Autonomous Agents */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-8">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 italic">Active Agents</h3>
                <div className="flex items-center gap-2">
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                   </span>
                   <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Online</span>
                </div>
             </div>

             <div className="space-y-4">
                {/* n8n Automation Agent */}
                <div className="group p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all">
                   <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                            <Cpu className="w-5 h-5 text-indigo-400" />
                         </div>
                         <div>
                            <h4 className="text-sm font-black tracking-tighter">Automator (n8n)</h4>
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Workflow Engine</p>
                         </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                   </div>
                   <div className="flex items-center gap-4 text-[10px] font-bold mb-4">
                      <div className="flex items-center gap-1.5 text-zinc-500 px-2 py-1 bg-white/5 rounded border border-white/5"><Zap className="w-3 h-3 text-amber-400" /> 1,204 runs</div>
                      <div className="flex items-center gap-1.5 text-zinc-500 px-2 py-1 bg-white/5 rounded border border-white/5"><CheckCircle2 className="w-3 h-3 text-emerald-400" /> 99% OK</div>
                   </div>
                   <a href="https://n8n.cloud" target="_blank" rel="noopener noreferrer" className="block w-full py-2.5 bg-white/5 hover:bg-indigo-500/10 text-center rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-indigo-400 transition-all">Launch Studio</a>
                </div>

                {/* Content Creator Agent */}
                <div className="group p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-purple-500/30 hover:bg-purple-500/5 transition-all">
                   <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-purple-400" />
                         </div>
                         <div>
                            <h4 className="text-sm font-black tracking-tighter">Copywriter AI</h4>
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Content Engine</p>
                         </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-purple-400 transition-colors" />
                   </div>
                   <div className="flex items-center gap-4 text-[10px] font-bold mb-4">
                      <div className="flex items-center gap-1.5 text-zinc-500 px-2 py-1 bg-white/5 rounded border border-white/5"><Zap className="w-3 h-3 text-amber-400" /> 84 posts</div>
                      <div className="flex items-center gap-1.5 text-zinc-500 px-2 py-1 bg-white/5 rounded border border-white/5"><Activity className="w-3 h-3 text-blue-400" /> Synced</div>
                   </div>
                   <button 
                      onClick={handleCommandAgent}
                      className="block w-full py-2.5 bg-white/5 hover:bg-purple-500/10 text-center rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-purple-400 transition-all focus:outline-none"
                    >
                      Command Agent
                    </button>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ModernStatCard({ label, value, subValue, icon, color }: { label: string; value: string; subValue: string; icon: React.ReactNode; color: string }) {
  const colorMap: any = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };

  return (
    <div className="bg-[#0C0C0E] border border-white/5 rounded-[2rem] p-8 group hover:border-white/10 transition-all">
      <div className="flex items-center justify-between mb-8">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>{icon}</div>
        <div className={`p-1.5 rounded-full ${colorMap[color]} animate-pulse`} />
      </div>
      <div>
         <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">{label}</p>
         <div className="flex items-end gap-2">
            <h4 className="text-3xl font-black tracking-tighter">{value}</h4>
            <p className="text-[9px] font-bold text-zinc-700 mb-1">{subValue}</p>
         </div>
      </div>
    </div>
  );
}
