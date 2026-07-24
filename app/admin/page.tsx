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
  AlertCircle,
  Copy,
  X,
  Link2
} from 'lucide-react';
function ensureString(val: any): string {
  if (!val) return '';
  if (Array.isArray(val)) {
    return val.length > 0 ? String(val[0]) : '';
  }
  return String(val);
}

const COMMON_STOPWORDS = new Set([
  'main', 'app', 'website', 'web', 'site', 'project', 'client', 'code', 
  'design', 'hub', 'draft', 'test', 'brand', 'presentation', 'digital', 
  'express', 'sequence', 'solutions', 'services', 'store', 'shop', 'group',
  'sin', 'nombre', 'negocio', 'owner', 'unknown', 'fashion', 'week', 
  'magazine', 'food', 'street', 'eats', 'agency', 'hero', 'platform', 'fit',
  'alliance', 'guardian', 'engine', 'delivery', 'amigo', 'market', 'art'
]);

function matchClientAndProject(client: any, project: any): boolean {
  const busLower = String(client.business || '').toLowerCase();
  const projLower = String(project.name || '').toLowerCase();
  
  // 1. Direct equal match
  if (busLower === projLower) return true;
  
  // 2. Clean match (no spaces or special chars) - exact comparison
  const busClean = busLower.replace(/[^a-z0-9]/g, '');
  const projClean = projLower.replace(/[^a-z0-9]/g, '');
  if (busClean && projClean && busClean === projClean) return true;
  
  // 3. Substring match, but only if distinctive (not a stopword)
  const isStopword = (str: string) => {
    const stops = ['main', 'app', 'website', 'web', 'site', 'code', 'design', 'brand', 'presentation'];
    return stops.some(s => str.includes(s) || s.includes(str));
  };
  
  if (!isStopword(busLower) && !isStopword(projLower)) {
    if (busLower.includes(projLower) || projLower.includes(busLower)) return true;
    if (busClean && projClean && (busClean.includes(projClean) || projClean.includes(busClean))) return true;
  }
  
  // 4. Word overlap of distinctive words
  const busWords = busLower.split(/[\s-_]+/).filter((w: string) => w.length > 3 && !COMMON_STOPWORDS.has(w));
  const projWords = projLower.split(/[\s-_]+/).filter((w: string) => w.length > 3 && !COMMON_STOPWORDS.has(w));
  
  const hasSharedWord = busWords.some((w: string) => 
    projWords.some((pw: string) => pw === w)
  );
  if (hasSharedWord) return true;
  
  // 5. Domain Alias matching
  const aliases = project.targets?.production?.alias || [];
  for (const alias of aliases) {
    const aliasClean = alias.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (busClean && aliasClean && busClean === aliasClean) return true;
    
    const aliasWords = alias.toLowerCase().split(/[\s.-]+/).filter((w: string) => w.length > 3 && !COMMON_STOPWORDS.has(w));
    const hasSharedAliasWord = busWords.some((w: string) =>
      aliasWords.some((aw: string) => aw === w)
    );
    if (hasSharedAliasWord) return true;
  }
  
  return false;
}

function cleanProjectName(name: string): string {
  if (!name) return '';
  
  // 1. Remove common suffixes/prefixes/keywords
  let cleaned = name
    .replace(/-main$/, '')
    .replace(/-app$/, '')
    .replace(/-website$/, '')
    .replace(/-web$/, '')
    .replace(/-site$/, '')
    .replace(/-code$/, '')
    .replace(/-design$/, '')
    .replace(/-presentation$/, '')
    .replace(/-brand-dna$/, '')
    .replace(/-digital$/, '');
    
  // 2. Remove random hashes (like -ws8x, -h2vo, -mx4y, -c2ku, etc. at the end)
  cleaned = cleaned.replace(/-[a-z0-9]{4}$/i, '');

  // 3. Replace hyphens and underscores with spaces
  cleaned = cleaned.replace(/[-_]+/g, ' ');

  // 4. Capitalize each word
  return cleaned
    .split(' ')
    .map(word => {
      if (!word) return '';
      if (['cv', 'seo', 'pm', 'pm2', 'db'].includes(word.toLowerCase())) {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

const getFaviconUrl = (url: string) => {
  if (!url) return null;
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
  } catch (e) {
    try {
      const domain = url.replace(/https?:\/\//, '').split('/')[0];
      return `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
    } catch {
      return null;
    }
  }
};

export default function UnifiedAdminVercel() {
  const router = useRouter();
  const [clients, setClients] = useState<any[]>([]);
  const [vercelProjects, setVercelProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    paidPayments: 0
  });
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'LIVE' | 'PENDING_PAYMENT' | 'PAID'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentModal, setPaymentModal] = useState<{ visible: boolean; business: string; url: string; copied: boolean } | null>(null);
  const [loadingInvoice, setLoadingInvoice] = useState<string | null>(null);

  const normalizeStr = (str: any) => 
    String(str || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[-_./]/g, ' ')
      .toLowerCase();

  const filteredClients = clients.filter(client => {
    const rawQuery = searchQuery.trim();
    if (rawQuery) {
      const queryTokens = normalizeStr(rawQuery).split(/\s+/).filter(Boolean);
      
      const aggregateSearchableText = normalizeStr([
        client.business,
        client.name,
        client.rawProjectName,
        client.vercelUrl,
        client.id,
        client.paymentStatus,
        client.status,
        client.info?.email,
        client.info?.phone,
        client.info?.contactName,
        client.info?.businessName,
        client.atData?.name,
        client.atData?.business,
        client.atData?.info?.email,
        client.atData?.info?.phone,
        client.atData?.info?.contactName,
        client.atData?.info?.businessName
      ].join(' '));

      // Precision match: EVERY query word must match somewhere in the client's aggregate text
      const matchesSearch = queryTokens.every(token => aggregateSearchableText.includes(token));

      if (!matchesSearch) return false;
    }

    if (filterStatus === 'LIVE') return client.status === 'DEPLOYED';
    if (filterStatus === 'PENDING_PAYMENT') return client.paymentStatus !== 'PAID';
    if (filterStatus === 'PAID') return client.paymentStatus === 'PAID';

    return true;
  });

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
            // Find corresponding Airtable data if exists using our matching function
            const atClient = clientsData.clients?.find((c: any) => matchClientAndProject(c, project));

            // Find the best URL from production aliases (prefer custom domains over vercel.app)
            let bestUrl = '';
            const aliases = project.targets?.production?.alias || [];
            if (aliases.length > 0) {
              const customDomain = aliases.find((a: string) => !a.includes('vercel.app'));
              bestUrl = customDomain ? `https://${customDomain}` : `https://${aliases[0]}`;
            } else if (project.targets?.production?.url) {
              bestUrl = `https://${project.targets.production.url}`;
            } else {
              bestUrl = project.link || '';
            }

            return {
              id: atClient?.info?.clientId || project.id,
              name: ensureString(atClient?.name) || 'Unknown Owner',
              business: ensureString(project.brandName || atClient?.business || cleanProjectName(project.name)),
              rawProjectName: project.name,
              status: 'DEPLOYED',
              paymentStatus: ensureString(atClient?.paymentStatus) || 'UNPAID',
              monthlyPrice: atClient?.monthlyPrice || 30,
              vercelUrl: bestUrl,
              lastDeploy: project.updatedAt,
              isVercelMaster: true,
              atData: atClient || null
            };
          });

          // 2. Add Airtable clients that AREN'T in Vercel yet
          const extraClients = (clientsData.clients || []).filter((c: any) => {
            // Check if this Airtable client was already matched to a Vercel project
            const wasMatched = vercelData.projects.some((p: any) => matchClientAndProject(c, p));
            return !wasMatched;
          });

          unifiedClients = [...unifiedClients, ...extraClients.map((c: any) => ({
            ...c,
            name: ensureString(c.name) || 'Unknown Owner',
            business: ensureString(c.business) || 'Sin Negocio',
            paymentStatus: ensureString(c.paymentStatus) || 'UNPAID',
            monthlyPrice: c.monthlyPrice || 30,
            isVercelMaster: false,
            status: 'PENDING'
          }))];

          setClients(unifiedClients);
          setVercelProjects(vercelData.projects);
          
          const paidClients = unifiedClients.filter((c: any) => c.paymentStatus === 'PAID');
          const pendingCount = unifiedClients.filter((c: any) => c.paymentStatus !== 'PAID').length;
          
          // De-duplicate paid subscriptions by email or name to represent real Stripe subscriptions
          const seenPaidEmails = new Set<string>();
          const seenPaidNames = new Set<string>();
          let uniquePaidCount = 0;
          let totalRevenue = 0;

          paidClients.forEach((c: any) => {
            const email = (c.info?.email || c.atData?.info?.email || c.email || '').toLowerCase().trim();
            const name = (c.name || c.atData?.name || '').toLowerCase().trim();
            const price = c.monthlyPrice || 30;

            if (email) {
              if (!seenPaidEmails.has(email)) {
                seenPaidEmails.add(email);
                uniquePaidCount++;
                totalRevenue += price;
              }
            } else if (name) {
              if (!seenPaidNames.has(name)) {
                seenPaidNames.add(name);
                uniquePaidCount++;
                totalRevenue += price;
              }
            } else {
              uniquePaidCount++;
              totalRevenue += price;
            }
          });

          setStats({
            totalClients: unifiedClients.length,
            activeProjects: vercelData.projects.length,
            monthlyRevenue: totalRevenue,
            pendingPayments: pendingCount,
            paidPayments: uniquePaidCount
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Poll for updates in real time every 10 seconds
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const generateInvoice = async (client: any) => {
     setLoadingInvoice(client.id);
     try {
       const res = await fetch('/api/billing/invoice', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ clientId: client.id, businessName: client.business })
       });
       const data = await res.json();
        if (data.success) {
          setPaymentModal({ visible: true, business: client.business, url: data.paymentUrl, copied: false });
        } else {
          alert(`Error: ${data.error || 'No se pudo generar el link'}`);
        }
     } catch (err: any) {
       alert(`Error: ${err.message}`);
     } finally {
       setLoadingInvoice(null);
     }
  };

  const copyPaymentLink = async () => {
    if (!paymentModal) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(paymentModal.url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = paymentModal.url;
        ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.focus(); ta.select();
        document.execCommand('copy'); ta.remove();
      }
      setPaymentModal(prev => prev ? { ...prev, copied: true } : null);
      setTimeout(() => setPaymentModal(prev => prev ? { ...prev, copied: false } : null), 2500);
    } catch {}
  };

  const handleCommandAgent = () => {
    router.push('/creador');
  };

  const getVercelStatus = (client: any) => {
     const project = vercelProjects.find(p => String(p.name || '').toLowerCase().includes(String(client.business || '').toLowerCase()));
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

      {/* ===== PAYMENT LINK MODAL ===== */}
      <AnimatePresence>
        {paymentModal?.visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPaymentModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-[#0e0e10] border border-white/10 rounded-3xl p-8 w-full max-w-lg shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Link2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Link de Pago Generado</p>
                    <h3 className="text-sm font-black tracking-tight text-white">{paymentModal.business}</h3>
                  </div>
                </div>
                <button onClick={() => setPaymentModal(null)} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-zinc-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Price Tag */}
              <div className="mb-6 p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-emerald-400/60 mb-0.5">Monto Mensual</p>
                  <p className="text-3xl font-black tracking-tighter text-emerald-400">$30<span className="text-sm font-bold text-emerald-400/50">/mes</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-0.5">Concepto</p>
                  <p className="text-[10px] font-bold text-zinc-400">Hosting + Mantenimiento Web</p>
                </div>
              </div>

              {/* URL Box */}
              <div className="mb-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">Enlace de Pago</p>
                <div className="flex items-center gap-2 p-3 bg-black/50 border border-white/10 rounded-xl">
                  <p className="text-[10px] font-mono text-zinc-300 flex-1 truncate">{paymentModal.url}</p>
                </div>
              </div>

              {/* Copy Button */}
              <button
                onClick={copyPaymentLink}
                className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                  paymentModal.copied
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-white text-black hover:bg-zinc-100'
                }`}
              >
                {paymentModal.copied ? (
                  <><CheckCircle2 className="w-4 h-4" /> ¡Copiado al Portapapeles!</>
                ) : (
                  <><Copy className="w-4 h-4" /> Copiar Link de Pago</>
                )}
              </button>
              <p className="text-center text-[9px] text-zinc-600 mt-3 font-bold uppercase tracking-widest">
                Pega este link en WhatsApp, email o donde prefieras
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>      {/* KPI Cards - Stakent High Density */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <ModernStatCard 
          label="Total Clients" 
          value={stats.totalClients.toString()} 
          subValue="Active base" 
          icon={<Users className="w-4 h-4" />} 
          color="indigo" 
          onClick={() => setFilterStatus('ALL')}
          isActive={filterStatus === 'ALL'}
        />
        <ModernStatCard 
          label="Live on Vercel" 
          value={stats.activeProjects.toString()} 
          subValue="Real-time check" 
          icon={<Globe className="w-4 h-4" />} 
          color="emerald" 
          onClick={() => setFilterStatus('LIVE')}
          isActive={filterStatus === 'LIVE'}
        />
        <ModernStatCard 
          label="Pending Payments" 
          value={stats.pendingPayments.toString()} 
          subValue="Requires Action" 
          icon={<AlertCircle className="w-4 h-4" />} 
          color="amber" 
          onClick={() => setFilterStatus('PENDING_PAYMENT')}
          isActive={filterStatus === 'PENDING_PAYMENT'}
        />
        <ModernStatCard 
          label="Monthly MRR" 
          value={`$${stats.monthlyRevenue.toLocaleString()}`} 
          subValue={`${stats.paidPayments} active plans`} 
          icon={<CreditCard className="w-4 h-4" />} 
          color="purple" 
          onClick={() => setFilterStatus('PAID')}
          isActive={filterStatus === 'PAID'}
        />
      </div>
      {/* Main Content Layout - Split View */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Client Inventory (Stakent List View) */}
        <div className="xl:col-span-8 bg-[#0C0C0E] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#111113]/50">
             <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h3 className="text-sm font-black uppercase tracking-widest italic">Inventory & Billing Module</h3>
                {filterStatus !== 'ALL' && (
                  <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase tracking-wider rounded-md inline-flex items-center gap-1.5 self-start">
                    {filterStatus === 'LIVE' ? 'LIVE ON VERCEL' : filterStatus === 'PENDING_PAYMENT' ? 'PENDING PAYMENTS' : 'PAID PAYMENTS'}
                    <button onClick={() => setFilterStatus('ALL')} className="hover:text-white transition-colors text-[10px]">✕</button>
                  </span>
                )}
             </div>
             <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-auto">
                   <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                   <input 
                      type="text" 
                      placeholder="Buscar cliente, marca o dominio..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-8 text-xs font-medium w-36 xs:w-48 sm:w-64 focus:outline-none focus:border-indigo-500/50 focus:bg-white/10 text-white placeholder:text-zinc-500 transition-all" 
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs p-1"
                        title="Limpiar búsqueda"
                      >
                        ✕
                      </button>
                    )}
                </div>
                <Filter className="w-4 h-4 text-zinc-600 hover:text-white transition-colors cursor-pointer shrink-0" />
             </div>
          </div>

          <div className="overflow-x-auto sm:overflow-visible">
            <table className="w-full text-left border-collapse min-w-0">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="p-3 md:p-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">Client / Vision</th>
                  <th className="hidden sm:table-cell p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-zinc-600 text-center">Vercel Sync</th>
                  <th className="hidden sm:table-cell p-4 md:p-6 text-[10px] font-black uppercase tracking-widest text-zinc-600 text-center">Payment</th>
                  <th className="p-3 md:p-6 text-[10px] font-black uppercase tracking-widest text-zinc-600 text-right">Action</th>
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
                        <td className="p-3 md:p-6">
                          <div className="flex items-center gap-2.5 md:gap-4">
                             <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 relative">
                                {client.vercelUrl ? (
                                  <img 
                                    src={getFaviconUrl(client.vercelUrl) || ''} 
                                    alt="" 
                                    className="w-5 h-5 object-contain"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      const fallback = e.currentTarget.parentElement?.querySelector('.fallback-txt') as HTMLElement;
                                      if (fallback) fallback.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <span 
                                  className="fallback-txt font-black text-[10px] md:text-xs uppercase absolute inset-0 items-center justify-center" 
                                  style={{ display: client.vercelUrl ? 'none' : 'flex' }}
                                >
                                  {(client.business || 'P').charAt(0)}
                                </span>
                             </div>
                             <div className="min-w-0 flex-1">
                                 <div className="flex flex-wrap items-center gap-1.5">
                                   <p className="text-xs md:text-sm font-black tracking-tight text-white truncate max-w-[120px] xs:max-w-[150px] sm:max-w-none">
                                    {client.business}
                                   </p>
                                   {client.name === 'Pendiente (Attom Link)' && (
                                     <span className="px-1 py-0.5 bg-indigo-500/20 text-indigo-400 text-[6px] font-black uppercase rounded border border-indigo-500/30">Lead Ingest</span>
                                   )}
                                   {/* Mobile-only status tags */}
                                   <span className={`sm:hidden px-1.5 py-0.5 rounded text-[6px] font-black uppercase tracking-wider ${
                                     client.paymentStatus === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                   }`}>
                                     {client.paymentStatus}
                                   </span>
                                   <span className={`sm:hidden px-1.5 py-0.5 rounded text-[6px] font-black uppercase tracking-wider ${
                                     isDeployed ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                                   }`}>
                                     {isDeployed ? 'LIVE' : 'PENDING'}
                                   </span>
                                 </div>
                                 <p className="text-[8px] md:text-[9px] font-bold text-zinc-600 uppercase tracking-widest truncate flex items-center gap-1.5 flex-wrap mt-0.5">
                                   <span className="text-zinc-500 font-mono text-[7px] bg-white/5 px-1 py-0.5 rounded border border-white/5">
                                     {client.rawProjectName || 'Airtable Node'}
                                   </span>
                                   {client.name && client.name !== 'Unknown Owner' && client.name !== 'Sin Nombre' && (
                                     <>
                                       <span className="text-zinc-700 font-black">·</span>
                                       <span className="text-indigo-400 font-black">{client.name}</span>
                                     </>
                                   )}
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
                        <td className="hidden sm:table-cell p-4 md:p-6 text-center">
                           <div className={`inline-flex items-center gap-2 px-2 md:px-3 py-1 rounded-full border text-[7px] md:text-[8px] font-black uppercase tracking-widest ${
                             client.paymentStatus === 'PAID' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                           }`}>
                              {client.paymentStatus === 'PAID' ? 'PAID' : 'UNPAID'}
                           </div>
                        </td>
                        <td className="p-3 md:p-6 text-right">
                           <div className="flex items-center justify-end gap-1.5 md:gap-3 flex-nowrap">
                             <button 
                               onClick={() => generateInvoice(client)}
                               disabled={loadingInvoice === client.id}
                               className={`flex p-2 md:px-4 md:py-2 border rounded-lg text-[9px] font-black uppercase tracking-widest transition-all items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${
                                 client.paymentStatus === 'PAID'
                                   ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                                   : 'bg-white/5 border-white/5 text-indigo-400 hover:bg-indigo-500 hover:text-white'
                               }`}
                               title={client.paymentStatus === 'PAID' ? 'Reenviar Link de Pago' : 'Generar Link de Pago'}
                             >
                               {loadingInvoice === client.id ? (
                                 <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                               ) : (
                                 <Link2 className="w-3.5 h-3.5" />
                               )}
                               <span className="hidden lg:inline">{client.paymentStatus === 'PAID' ? 'Reenviar' : 'Link $30'}</span>
                             </button>
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

        {/* Right Column: Growth Metrics & Agents */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Growth Metrics Card (Glassmorphic with Corner border glow lines) */}
          <div className="relative bg-[#0C0C0E] border border-white/5 rounded-3xl p-6 md:p-8 overflow-hidden">
            {/* White corner glow lines */}
            <div className="absolute -top-[1.5px] -right-[1.5px] w-12 h-12 border-t-2 border-r-2 border-white rounded-tr-[24px] pointer-events-none" />
            <div className="absolute -bottom-[1.5px] -left-[1.5px] w-12 h-12 border-b-2 border-l-2 border-white rounded-bl-[24px] pointer-events-none" />
            
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-black tracking-tight text-white">${stats.monthlyRevenue}</span>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">MRR</span>
                </div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1 mt-1">
                  <span>▲</span> +140% THIS MONTH
                </span>
              </div>
              
              {/* Circular Progress Ring */}
              <div className="relative w-11 h-11 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="22" cy="22" r="18" className="stroke-white/5 fill-none" strokeWidth="2.5" />
                  <circle cx="22" cy="22" r="18" className="stroke-emerald-400 fill-none" strokeWidth="2.5" strokeDasharray="113" strokeDashoffset={113 * (1 - 0.24)} strokeLinecap="round" />
                </svg>
                <span className="absolute text-[8px] font-black text-white">24%</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-[9px] font-bold text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-2">
                <span>PLAN PROGRESS</span>
                <span className="text-white">GOAL $300</span>
              </div>
              
              {/* Sleek Bar Chart */}
              <div className="flex items-end justify-between h-20 px-2 pt-2">
                {[
                  { label: 'J', val: 0 },
                  { label: 'F', val: 0 },
                  { label: 'M', val: 0 },
                  { label: 'A', val: 12 },
                  { label: 'M', val: 12 },
                  { label: 'J', val: 42 },
                  { label: 'J', val: 72 }
                ].map((item, idx) => {
                  const maxVal = 72;
                  const pct = maxVal > 0 ? (item.val / maxVal) * 100 : 0;
                  const isCurrent = idx === 6;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-2 group cursor-pointer" title={`$${item.val}`}>
                      <div className="w-3.5 h-16 bg-white/[0.02] border border-white/5 rounded-t-sm relative flex items-end overflow-hidden">
                        <div 
                          className={`w-full rounded-t-sm transition-all duration-500 ${isCurrent ? 'bg-gradient-to-t from-emerald-500 to-teal-400' : 'bg-gradient-to-t from-zinc-800 to-zinc-700'}`} 
                          style={{ height: `${pct}%` }} 
                        />
                        {isCurrent && (
                          <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:8px_8px] pointer-events-none opacity-40 rounded-t-sm" />
                        )}
                      </div>
                      <span className={`text-[8px] font-black tracking-widest ${isCurrent ? 'text-emerald-400' : 'text-zinc-500'}`}>{item.label}</span>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center gap-2 text-[9px] font-black text-zinc-500 uppercase tracking-widest pt-2 border-t border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>+ $24 / MONTH AVERAGE GROWTH</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0C0C0E] border border-white/5 rounded-2xl p-6 md:p-8">
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
                {/* ATTOM Webs Agent */}
                <div className="group p-5 bg-white/[0.02] border border-white/5 rounded-2xl border-emerald-500/30 bg-emerald-500/5 transition-all">
                   <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-emerald-400" />
                         </div>
                         <div>
                            <div className="flex items-center gap-2">
                               <h4 className="text-sm font-black tracking-tighter">ATTOM Webs</h4>
                               <span className="px-1.5 py-0.5 bg-emerald-500 text-black text-[7px] font-black uppercase rounded animate-pulse">NEW</span>
                            </div>
                            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Digital Architect</p>
                         </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-zinc-600 group-hover:text-emerald-400 transition-colors" />
                   </div>
                   <div className="flex items-center gap-4 text-[10px] font-bold mb-4">
                      <div className="flex items-center gap-1.5 text-zinc-500 px-2 py-1 bg-white/5 rounded border border-white/5"><TrendingUp className="w-3 h-3 text-emerald-400" /> Active Leads</div>
                      <div className="flex items-center gap-1.5 text-zinc-500 px-2 py-1 bg-white/5 rounded border border-white/5"><Activity className="w-3 h-3 text-indigo-400" /> Live Hub</div>
                   </div>
                   <Link href="/dashboard/attom" className="block w-full py-2.5 bg-emerald-500 text-black text-center rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all">Manage Webs</Link>
                </div>

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

function ModernStatCard({ label, value, subValue, icon, color, onClick, isActive }: { label: string; value: string; subValue: string; icon: React.ReactNode; color: string; onClick?: () => void; isActive?: boolean }) {
  const colorMap: any = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20'
  };

  return (
    <div 
      onClick={onClick}
      className={`bg-[#0C0C0E] border rounded-xl md:rounded-2xl p-5 md:p-8 group transition-all flex flex-col justify-between min-h-[135px] md:min-h-0 select-none ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      } ${
        isActive 
          ? 'border-indigo-500/40 bg-indigo-500/[0.02]' 
          : 'border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
      }`}
    >
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <div className={`p-2 md:p-3 rounded-lg md:rounded-xl ${colorMap[color]}`}>{icon}</div>
        <div className={`p-1.5 rounded-full ${colorMap[color]} ${isActive ? 'animate-ping' : 'animate-pulse'}`} />
      </div>
      <div>
         <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-0.5 md:mb-1">{label}</p>
         <div className="flex items-end gap-1.5 md:gap-2">
            <h4 className="text-lg md:text-3xl font-black tracking-tighter leading-none">{value}</h4>
            <p className="text-[8px] md:text-[9px] font-bold text-zinc-700 truncate leading-none mb-0.5">{subValue}</p>
         </div>
      </div>
    </div>
  );
}
