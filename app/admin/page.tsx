'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface ClientData {
  info: {
    clientId: string;
    businessName: string;
    contactName: string;
    phone: string;
    email?: string;
    businessType: string;
    createdAt: string;
    updatedAt: string;
  };
  payment: {
    status: string;
    amount: number;
    currency: string;
    subscription?: {
      status: 'active' | 'past_due' | 'inactive' | 'canceled';
      plan: string;
      price: number;
      nextBillingDate?: string;
      lastPaymentDate?: string;
    };
  };
  deployment: {
    status: string;
    vercel?: {
      url?: string;
      deploymentId?: string;
      status?: string;
    };
    github?: {
      repoUrl?: string;
      branch?: string;
    };
    hosting?: {
      provider: string;
      url?: string;
    };
  };
  collectorInfo?: {
    businessInfo: Array<{ field: string; label: string; value: string }>;
    webStructure: any;
  };
}

interface Stats {
  totalClients: number;
  activeSubscriptions: number;
  totalMonthlyRevenue: number;
  completedDeployments: number;
  pendingPayments: number;
}

type View = 'overview' | 'clients' | 'deployments' | 'payments' | 'settings';

export default function AdminDashboard() {
  const [activeView, setActiveView] = useState<View>('overview');
  const [clients, setClients] = useState<ClientData[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    activeSubscriptions: 0,
    totalMonthlyRevenue: 0,
    completedDeployments: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [vercelProjects, setVercelProjects] = useState<any[]>([]);
  const [gitHubRepos, setGitHubRepos] = useState<any[]>([]);

  useEffect(() => {
    fetchClients();
    fetchVercelProjects();
    fetchGitHubRepos();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients');
      const data = await response.json();
      const clientList = data.clients || [];
      setClients(clientList);
      calculateStats(clientList);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVercelProjects = async () => {
    try {
      const response = await fetch('/api/vercel');
      const data = await response.json();
      setVercelProjects(data.projects || []);
    } catch (error) {
      console.error('Failed to fetch Vercel projects:', error);
    }
  };

  const fetchGitHubRepos = async () => {
    try {
      const response = await fetch('/api/github');
      const data = await response.json();
      setGitHubRepos(data.repositories || []);
    } catch (error) {
      console.error('Failed to fetch GitHub repos:', error);
    }
  };

  const calculateStats = (list: ClientData[]) => {
    const activeSubscribers = list.filter(c => c.payment.subscription?.status === 'active');
    setStats({
      totalClients: list.length,
      activeSubscriptions: activeSubscribers.length,
      totalMonthlyRevenue: activeSubscribers.length * 30,
      completedDeployments: list.filter(c => c.deployment.status === 'completed' || c.deployment.status === 'LIVE').length,
      pendingPayments: list.filter(c => c.payment.status === 'pending').length,
    });
  };

  const generatePaymentLink = (clientId: string) => {
    const url = `${window.location.origin}/pay/${clientId}`;
    navigator.clipboard.writeText(url);
    alert(`Link de pago copiado: ${url}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080810] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-light tracking-widest uppercase text-xs">Sincronizando Datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080810] text-slate-100 font-sans selection:bg-purple-500/30 flex">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* SIDEBAR */}
      <aside className="w-72 border-r border-white/5 bg-black/40 backdrop-blur-xl fixed h-screen z-50 flex flex-col">
        <div className="p-8">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
            ATTOM<span className="text-purple-500">.</span>
          </Link>
          <p className="text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold mt-2 opacity-60">Admin Control</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavItem active={activeView === 'overview'} onClick={() => setActiveView('overview')} icon="📊" label="Métricas" />
          <NavItem active={activeView === 'clients'} onClick={() => setActiveView('clients')} icon="👥" label="Clientes" />
          <NavItem active={activeView === 'deployments'} onClick={() => setActiveView('deployments')} icon="🚀" label="Despliegues" />
          <NavItem active={activeView === 'payments'} onClick={() => setActiveView('payments')} icon="💰" label="Pagos $30" />
        </nav>

        <div className="p-8 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 border border-white/20 flex items-center justify-center font-bold">JF</div>
            <div>
              <p className="text-sm font-bold text-white">Jose F.</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-72 min-h-screen relative z-10 flex flex-col">
        {/* Top Header */}
        <header className="px-10 py-6 border-b border-white/5 bg-black/20 backdrop-blur-md sticky top-0 flex items-center justify-between z-40">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white capitalize">{activeView}</h1>
            <p className="text-xs text-slate-500 mt-0.5">Gestión centralizada de Attom AI</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchClients} className="text-xs text-slate-400 hover:text-white transition-colors uppercase tracking-widest font-bold">Refrescar →</button>
          </div>
        </header>

        <div className="p-10 flex-1">
          {activeView === 'overview' && (
            <div className="animate-fade-in-up">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard label="Ingresos Mensuales" value={`$${stats.totalMonthlyRevenue}`} sub={`Basado en ${stats.activeSubscriptions} activos`} color="purple" />
                <StatCard label="Total Clientes" value={stats.totalClients} sub="Registrados en el sistema" color="indigo" />
                <StatCard label="Webs en Producción" value={stats.completedDeployments} sub="Desplegadas correctamente" color="emerald" />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 backdrop-blur-xl">
                  <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">📈</span> 
                    Crecimiento de Clientes
                  </h3>
                  <div className="h-48 border-b border-l border-white/10 relative flex items-end justify-between px-4 pb-2">
                    {/* Mock Chart */}
                    <div className="w-8 bg-purple-500/30 rounded-t-lg h-[20%]" title="Jan"></div>
                    <div className="w-8 bg-purple-500/40 rounded-t-lg h-[35%]" title="Feb"></div>
                    <div className="w-8 bg-purple-500/50 rounded-t-lg h-[55%]" title="Mar"></div>
                    <div className="w-8 bg-purple-600 rounded-t-lg h-[80%]" title="Apr"></div>
                  </div>
                  <div className="flex justify-between mt-2 px-4 text-[10px] text-slate-600 font-bold tracking-widest">
                    <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 backdrop-blur-xl">
                  <h3 className="text-lg font-bold mb-6">Últimas Actividades</h3>
                  <div className="space-y-6">
                    {clients.slice(0, 3).map((client, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{client.info.businessName} completó el collector</p>
                          <p className="text-[10px] text-slate-500 uppercase">{new Date(client.info.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeView === 'clients' && (
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl animate-fade-in-up">
              <Table 
                headers={['Cliente', 'Tipo', 'Estado Pago', 'Despliegue', 'Acciones']}
                data={clients.map(client => ({
                  id: client.info.clientId,
                  cells: [
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-100">{client.info.businessName}</span>
                      <span className="text-[10px] text-slate-500">{client.info.contactName}</span>
                    </div>,
                    <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded border border-white/5 text-slate-400">{client.info.businessType}</span>,
                    <Badge status={client.payment.status} />,
                    <DeployBadge status={client.deployment.status} />,
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedClient(client)} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all">Detalle</button>
                      <button onClick={() => generatePaymentLink(client.info.clientId)} className="p-2 hover:bg-purple-500/10 rounded-xl text-purple-400 hover:text-purple-300 transition-all font-bold text-[10px] uppercase">Link Pago</button>
                    </div>
                  ]
                }))}
              />
            </div>
          )}

          {activeView === 'deployments' && (
            <div className="space-y-8 animate-fade-in-up">
              {/* Real Vercel Projects */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-9xl -rotate-12 transition-transform group-hover:scale-110 duration-1000">▲</div>
                <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                  <span className="p-2 bg-white/10 rounded-xl text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]">▲</span> 
                  Vercel Infrastructure <span className="text-[10px] text-slate-500 font-normal uppercase tracking-[0.3em] ml-2">Live Status</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vercelProjects.length > 0 ? vercelProjects.map((project) => (
                    <div key={project.id} className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl hover:border-purple-500/50 hover:bg-white/[0.05] transition-all duration-500 group/card relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 blur-[40px] rounded-full -mr-12 -mt-12 group-hover/card:bg-purple-500/10 transition-colors"></div>
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <span className="font-bold text-base tracking-tight text-white group-hover/card:text-purple-300 transition-colors truncate max-w-[160px]">{project.name}</span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-[8px] font-black tracking-widest uppercase animate-pulse">
                          <span className="w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_5px_#34d399]"></span>
                          Live
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-6 font-light truncate group-hover/card:text-slate-400 transition-colors">{project.targets?.production?.url || 'domain pending'}</p>
                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-2">
                          <a href={`https://${project.targets?.production?.url}`} target="_blank" className="text-[10px] font-black uppercase tracking-widest text-purple-400 hover:text-purple-300 transition-colors border-b border-purple-400/20 pb-0.5">Visitar →</a>
                        </div>
                        <span className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">{new Date(project.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="col-span-full py-20 text-center space-y-4">
                      <div className="w-12 h-12 border-2 border-white/5 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
                      <p className="text-slate-500 text-xs font-light uppercase tracking-[0.2em]">Escaneando despliegues...</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Client Deployments Mapping */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
                <div className="px-10 py-6 border-b border-white/5">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Despliegues por Cliente</h3>
                </div>
                <Table 
                  headers={['Cliente', 'GitHub Repo', 'Vercel Deployment', 'Estado']}
                  data={clients.map(client => ({
                    id: client.info.clientId,
                    cells: [
                      <span className="font-bold">{client.info.businessName}</span>,
                      client.deployment.github?.repoUrl ? (
                        <a href={client.deployment.github.repoUrl} target="_blank" className="text-indigo-400 hover:text-indigo-300 text-sm">Repo →</a>
                      ) : <span className="text-slate-600 text-xs italic">N/A</span>,
                      client.deployment.vercel?.url || client.deployment.hosting?.url ? (
                        <a href={client.deployment.vercel?.url || client.deployment.hosting?.url} target="_blank" className="text-emerald-400 hover:text-emerald-300 text-sm">Visit Site →</a>
                      ) : <span className="text-slate-600 text-xs italic">N/A</span>,
                      <DeployBadge status={client.deployment.status} />
                    ]
                  }))}
                />
              </div>
            </div>
          )}

          {activeView === 'payments' && (
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl animate-fade-in-up">
              <Table 
                headers={['Cliente', 'Suscripción', 'Precio', 'Prox. Pago', 'Estado Account']}
                data={clients.map(client => ({
                  id: client.info.clientId,
                  cells: [
                    <span className="font-bold">{client.info.businessName}</span>,
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-200">{client.payment.subscription?.plan || 'Standard'}</span>
                      <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Recurring $30</span>
                    </div>,
                    <span className="font-mono text-white">$30.00</span>,
                    <span className="text-xs text-slate-400">{client.payment.subscription?.nextBillingDate ? new Date(client.payment.subscription.nextBillingDate).toLocaleDateString() : 'Pendiente'}</span>,
                    <div className="flex items-center gap-3">
                      <SubBadge status={client.payment.subscription?.status || 'inactive'} />
                      {client.payment.status === 'processing' && <span className="text-[9px] text-amber-500 animate-pulse font-black uppercase">¡Validar Ref!</span>}
                      <button onClick={() => generatePaymentLink(client.info.clientId)} className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-[9px] font-black uppercase">Cobrar</button>
                    </div>
                  ]
                }))}
              />
            </div>
          )}
        </div>
      </main>

      {/* Details Modal */}
      {selectedClient && (
        <ClientDetailsModal client={selectedClient} onClose={() => setSelectedClient(null)} />
      )}
    </div>
  );
}

// SUPPORT COMPONENTS
function NavItem({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 ${
        active 
          ? 'bg-purple-600/15 border border-purple-500/20 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.1)]' 
          : 'text-slate-500 hover:text-slate-300'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="text-sm font-bold tracking-widest uppercase">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,1)]"></div>}
    </button>
  );
}

function StatCard({ label, value, sub, color }: any) {
  const colors: any = {
    purple: 'from-purple-600/20 to-transparent border-purple-500/20 text-purple-400',
    indigo: 'from-indigo-600/20 to-transparent border-indigo-500/20 text-indigo-400',
    emerald: 'from-emerald-600/20 to-transparent border-emerald-500/20 text-emerald-400',
  };
  return (
    <div className={`p-8 rounded-[3rem] border bg-gradient-to-br ${colors[color]} backdrop-blur-xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500`}>
      <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-60 mb-1">{label}</p>
      <div className="text-5xl font-bold tracking-tighter text-white mb-2">{value}</div>
      <p className="text-xs text-slate-500 font-light">{sub}</p>
      <div className="absolute -right-4 -bottom-4 text-7xl opacity-5 transition-transform group-hover:scale-125 duration-700">📈</div>
    </div>
  );
}

function Table({ headers, data }: { headers: string[], data: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-[10px] uppercase tracking-[0.3em] text-slate-500 border-b border-white/5 font-bold">
            {headers.map((h, i) => <th key={i} className="px-10 py-6">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.02]">
          {data.map((row) => (
            <tr key={row.id} className="group hover:bg-white/[0.01] transition-colors">
              {row.cells.map((cell: any, i: number) => (
                <td key={i} className="px-10 py-6">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ status }: { status: string }) {
  const isCompleted = status === 'completed';
  const isProcessing = status === 'processing';
  return (
    <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-xl border ${
      isCompleted ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
      isProcessing ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
      'bg-white/5 text-slate-400 border-white/10'
    }`}>
      {status}
    </span>
  );
}

function SubBadge({ status }: { status: string }) {
  const colors: any = {
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]',
    past_due: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    inactive: 'bg-white/5 text-slate-500 border-white/5',
  };
  return (
    <span className={`text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-2 rounded-xl border transition-all ${colors[status] || colors.inactive}`}>
      {status}
    </span>
  );
}

function DeployBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    LIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    in_progress: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    failed: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    not_started: 'bg-white/5 text-slate-500 border-white/10',
  };
  return (
    <span className={`text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-xl border ${colors[status] || colors.not_started}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function ClientDetailsModal({ client, onClose }: any) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl bg-[#0d0d15] border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="px-10 py-10 border-b border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-bold tracking-tighter text-white">{client.info.businessName}</h3>
            <p className="text-[10px] uppercase tracking-[0.4em] text-slate-500 font-bold mt-2">Expediente de Proyecto</p>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/10 rounded-full text-slate-500 hover:text-white transition-all">✕</button>
        </div>
        
        <div className="p-12 overflow-y-auto max-h-[70vh] custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div>
              <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-purple-500 mb-6">Información General</h4>
              <div className="space-y-4">
                <InfoRow label="Contacto" value={client.info.contactName} />
                <InfoRow label="Email" value={client.info.email || 'N/A'} />
                <InfoRow label="Teléfono" value={client.info.phone} />
                <InfoRow label="Tipo" value={client.info.businessType} />
              </div>
            </div>

            {client.collectorInfo && (
              <div>
                <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-indigo-500 mb-6">Collector Insights</h4>
                <div className="space-y-3">
                  {client.collectorInfo.businessInfo.map((info: any, i: number) => (
                    <div key={i} className="bg-white/5 p-5 rounded-2xl border border-white/5">
                      <span className="text-[9px] uppercase tracking-widest text-slate-500 block mb-1">{info.label}</span>
                      <span className="text-sm text-slate-200">{info.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-12">
            <div>
              <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-emerald-500 mb-6">Status Operativo</h4>
              <div className="space-y-4">
                <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                  <span className="text-[10px] uppercase tracking-widest text-slate-500 block mb-4">Integraciones</span>
                  <div className="space-y-4">
                    <IntegrationItem label="GitHub" icon="🐙" status={client.deployment.github?.repoUrl ? 'Ready' : 'Pending'} />
                    <IntegrationItem label="Vercel" icon="▲" status={client.deployment.vercel?.url ? 'Live' : 'Pending'} />
                    <IntegrationItem label="Stripe" icon="💳" status={client.payment.subscription?.status === 'active' ? 'Active' : 'Missing'} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-amber-500 mb-6">Quick Links</h4>
              <div className="grid grid-cols-1 gap-3">
                <a href={client.deployment.vercel?.url || '#'} className="p-5 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/5 text-sm font-bold tracking-widest uppercase text-center transition-all">Ver Web Live</a>
                <a href={client.deployment.github?.repoUrl || '#'} className="p-5 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-2xl border border-indigo-500/20 text-sm font-bold tracking-widest uppercase text-center text-indigo-400 transition-all">Ver Código GitHub</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-white/5">
      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{label}</span>
      <span className="text-sm font-bold text-slate-100">{value}</span>
    </div>
  );
}

function IntegrationItem({ label, icon, status }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-xs font-bold text-slate-300">{label}</span>
      </div>
      <span className={`text-[9px] uppercase font-black px-2 py-1 rounded ${status === 'Ready' || status === 'Live' || status === 'Active' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-white/5'}`}>{status}</span>
    </div>
  );
}
