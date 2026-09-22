'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
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
  Link2,
  RefreshCw,
  LayoutGrid,
  List,
  Sparkles,
  ChevronRight,
  Send,
  SlidersHorizontal,
  DollarSign,
  Layers,
  Shield,
  Eye,
  Check
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
  'sin', 'nombre', 'negocio', 'owner', 'unknown'
]);

function normalizeStr(str: any): string {
  if (!str) return '';
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

function matchClientAndProject(client: any, project: any): boolean {
  if (!client || !project) return false;

  const cId = normalizeStr(client.id || '');
  const cClientId = normalizeStr(client.info?.clientId || '');
  const pId = normalizeStr(project.id || '');
  const pName = normalizeStr(project.name || '');

  if (cId && (cId === pId || cId === pName)) return true;
  if (cClientId && (cClientId === pId || cClientId === pName)) return true;
  if (client.rawProjectName && normalizeStr(client.rawProjectName) === pName) return true;

  const busLower = normalizeStr(client.business || client.name || '');
  
  if (busLower === pName) return true;
  
  const busClean = busLower.replace(/[^a-z0-9]/g, '');
  const projClean = pName.replace(/[^a-z0-9]/g, '');
  if (busClean && projClean && busClean === projClean) return true;
  
  if (busClean && projClean && (busClean.includes(projClean) || projClean.includes(busClean))) return true;
  if (busLower.includes(pName) || pName.includes(busLower)) return true;
  
  const busWords = busLower.split(/[\s-_.]+/)
    .map((w: string) => w.replace(/[^a-z0-9]/g, ''))
    .filter((w: string) => w.length >= 2 && !COMMON_STOPWORDS.has(w));
  const projWords = pName.split(/[\s-_.]+/)
    .map((w: string) => w.replace(/[^a-z0-9]/g, ''))
    .filter((w: string) => w.length >= 2 && !COMMON_STOPWORDS.has(w));
  
  const hasSharedWord = busWords.some((w: string) => 
    projWords.some((pw: string) => pw === w || (pw.length > 3 && w.length > 3 && (pw.includes(w) || w.includes(pw))))
  );
  if (hasSharedWord) return true;
  
  const aliases = project.targets?.production?.alias || [];
  for (const alias of aliases) {
    const aliasNorm = normalizeStr(alias);
    const aliasClean = aliasNorm.replace(/[^a-z0-9]/g, '');
    if (busClean && aliasClean && (busClean === aliasClean || aliasClean.includes(busClean) || busClean.includes(aliasClean))) return true;
    
    const aliasWords = aliasNorm.split(/[\s.-]+/)
      .map((w: string) => w.replace(/[^a-z0-9]/g, ''))
      .filter((w: string) => w.length >= 2 && !COMMON_STOPWORDS.has(w));
    const hasSharedAliasWord = busWords.some((w: string) =>
      aliasWords.some((aw: string) => aw === w || (aw.length > 3 && w.length > 3 && (aw.includes(w) || w.includes(aw))))
    );
    if (hasSharedAliasWord) return true;
  }
  
  return false;
}

function cleanProjectName(name: string): string {
  if (!name) return '';
  
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
    
  cleaned = cleaned.replace(/-[a-z0-9]{4}$/i, '');
  cleaned = cleaned.replace(/[-_]+/g, ' ');

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    paidPayments: 0
  });

  const [filterStatus, setFilterStatus] = useState<'ALL' | 'LIVE' | 'PENDING_PAYMENT' | 'PAID'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'recent' | 'name' | 'mrr'>('recent');

  // Modals and Drawers
  const [paymentModal, setPaymentModal] = useState<{ visible: boolean; business: string; url: string; copied: boolean } | null>(null);
  const [selectedClient, setSelectedClient] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchData = useCallback(async (showIndicator = false) => {
    if (showIndicator) setIsRefreshing(true);
    try {
      const [clientsRes, vercelRes] = await Promise.all([
        fetch('/api/clients'),
        fetch('/api/vercel/projects')
      ]);
      
      const clientsData = await clientsRes.json();
      const vercelData = await vercelRes.json();

      let unifiedClients: any[] = [];

      if (vercelData.success && vercelData.projects) {
        unifiedClients = vercelData.projects.map((project: any) => {
          const atClient = clientsData.clients?.find((c: any) => matchClientAndProject(c, project));

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

          const paymentSlug = project.name || project.id;
          const autoPaymentUrl = `https://universaagency.com/pay/${paymentSlug}`;

          return {
            id: atClient?.info?.clientId || project.name || project.id,
            name: ensureString(atClient?.name) || 'Unknown Owner',
            business: ensureString(project.brandName || atClient?.business || cleanProjectName(project.name)),
            rawProjectName: project.name,
            status: 'DEPLOYED',
            paymentStatus: ensureString(atClient?.paymentStatus) || 'UNPAID',
            monthlyPrice: atClient?.monthlyPrice || 30,
            vercelUrl: bestUrl,
            aliases: aliases,
            paymentUrl: autoPaymentUrl,
            lastDeploy: project.updatedAt,
            isVercelMaster: true,
            atData: atClient || null
          };
        });

        const extraClients = (clientsData.clients || []).filter((c: any) => {
          const wasMatched = vercelData.projects.some((p: any) => matchClientAndProject(c, p));
          return !wasMatched;
        });

        unifiedClients = [...unifiedClients, ...extraClients.map((c: any) => {
          const fallbackSlug = c.info?.clientId || c.id;
          return {
            ...c,
            name: ensureString(c.name) || 'Unknown Owner',
            business: ensureString(c.business) || 'Sin Negocio',
            paymentStatus: ensureString(c.paymentStatus) || 'UNPAID',
            monthlyPrice: c.monthlyPrice || 30,
            paymentUrl: `https://universaagency.com/pay/${fallbackSlug}`,
            aliases: [],
            isVercelMaster: false,
            status: 'PENDING'
          };
        })];

        setClients(unifiedClients);
        setVercelProjects(vercelData.projects);
        
        const paidClients = unifiedClients.filter((c: any) => c.paymentStatus === 'PAID');
        const pendingCount = unifiedClients.filter((c: any) => c.paymentStatus !== 'PAID').length;
        
        let totalRevenue = 0;
        let uniquePaidCount = 0;
        const seenPaidProjectKeys = new Set<string>();

        paidClients.forEach((c: any) => {
          const key = (c.rawProjectName || c.id || '').toLowerCase().trim();
          const price = Number(c.monthlyPrice || 30);

          if (key && !seenPaidProjectKeys.has(key)) {
            seenPaidProjectKeys.add(key);
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
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(false), 15000);
    return () => clearInterval(interval);
  }, [fetchData]);

  // Filter & Sort Logic
  const filteredClients = useMemo(() => {
    let result = clients.filter(client => {
      if (filterStatus === 'LIVE' && client.status !== 'DEPLOYED') return false;
      if (filterStatus === 'PENDING_PAYMENT' && client.paymentStatus === 'PAID') return false;
      if (filterStatus === 'PAID' && client.paymentStatus !== 'PAID') return false;

      const rawQuery = searchQuery.trim();
      if (!rawQuery) return true;

      const normQuery = normalizeStr(rawQuery);
      const queryTokens = normQuery.split(/\s+/).filter(Boolean);

      const paymentSynonyms = client.paymentStatus === 'PAID' 
        ? ['paid', 'pagado', 'al dia', 'cobrado', 'activo'] 
        : ['unpaid', 'pendiente', 'impago', 'por cobrar', 'deuda', 'gratis'];
      
      const statusSynonyms = client.status === 'DEPLOYED' 
        ? ['live', 'activo', 'online', 'en linea', 'vercel', 'desplegado'] 
        : ['pending', 'offline', 'inactivo', 'proceso'];

      const aliases = Array.isArray(client.aliases) ? client.aliases : [];

      const searchableFields = [
        client.business,
        client.name,
        client.rawProjectName,
        client.vercelUrl,
        client.id,
        client.paymentStatus,
        client.status,
        ...paymentSynonyms,
        ...statusSynonyms,
        ...aliases,
        `$${client.monthlyPrice || 30}`,
        `${client.monthlyPrice || 30}`,
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
      ].filter(Boolean).map(val => normalizeStr(val));

      const aggregateText = searchableFields.join(' ');
      const aggregateClean = aggregateText.replace(/[^a-z0-9]/g, '');

      return queryTokens.every(token => {
        const tokenClean = token.replace(/[^a-z0-9]/g, '');
        if (aggregateText.includes(token)) return true;
        if (tokenClean.length >= 2 && aggregateClean.includes(tokenClean)) return true;
        return false;
      });
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'name') {
        return (a.business || '').localeCompare(b.business || '');
      }
      if (sortBy === 'mrr') {
        return (b.monthlyPrice || 30) - (a.monthlyPrice || 30);
      }
      // 'recent' by default
      const timeA = a.lastDeploy ? new Date(a.lastDeploy).getTime() : 0;
      const timeB = b.lastDeploy ? new Date(b.lastDeploy).getTime() : 0;
      return timeB - timeA;
    });

    return result;
  }, [clients, searchQuery, filterStatus, sortBy]);

  const copyDirectPaymentLink = async (client: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const slug = client.rawProjectName || client.id;
    const url = client.paymentUrl || `https://universaagency.com/pay/${slug}`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed'; 
        ta.style.left = '-9999px';
        document.body.appendChild(ta); 
        ta.focus(); 
        ta.select();
        document.execCommand('copy'); 
        ta.remove();
      }
      setCopiedId(client.id);
      showToast(`¡Link copiado para ${client.business}!`);
      setTimeout(() => setCopiedId(null), 2500);

      fetch('/api/billing/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientId: slug, businessName: client.business })
      }).catch(() => {});
    } catch (err) {
      console.error('Error copying direct link:', err);
    }
  };

  const openShareModal = (client: any, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const slug = client.rawProjectName || client.id;
    const url = client.paymentUrl || `https://universaagency.com/pay/${slug}`;
    setPaymentModal({
      visible: true,
      business: client.business,
      url: url,
      copied: false
    });

    fetch('/api/billing/invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clientId: slug, businessName: client.business })
    }).catch(() => {});
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
      showToast('¡Link de pago copiado al portapapeles!');
      setTimeout(() => setPaymentModal(prev => prev ? { ...prev, copied: false } : null), 2500);
    } catch {}
  };

  const getWhatsAppMessage = (client: any, type: 'billing' | 'reminder' | 'welcome') => {
    const slug = client.rawProjectName || client.id;
    const url = client.paymentUrl || `https://universaagency.com/pay/${slug}`;
    let text = '';
    
    if (type === 'billing') {
      text = `¡Hola! Te saluda Jose Figueroa de Universa Agency. Te comparto el enlace seguro para la renovación y mantenimiento mensual de la web de ${client.business} ($30 USD/mes):\n\n${url}\n\nQuedo a tu disposición ante cualquier duda.`;
    } else if (type === 'reminder') {
      text = `¡Hola ${client.name || ''}! Te recuerdo amablemente que el servicio de hosting y mantenimiento web de ${client.business} está listo para ser procesado:\n\n${url}\n\n¡Muchas gracias por tu confianza!`;
    } else {
      text = `¡Hola! Tu sitio web de ${client.business} ya se encuentra 100% online y optimizado:\n${client.vercelUrl || ''}\n\nPuedes gestionar tu suscripción mensual en:\n${url}`;
    }
    
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-24 font-sans selection:bg-[#2ee58f] selection:text-[#04100b]">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 right-6 z-[300] bg-[#111e17] border border-[#2ee58f]/40 text-white px-4 py-3 rounded-2xl shadow-[0_0_30px_rgba(46,229,143,0.25)] flex items-center gap-3 backdrop-blur-xl"
          >
            <div className="w-6 h-6 rounded-full bg-[#2ee58f]/20 text-[#2ee58f] flex items-center justify-center">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Hero */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2ee58f]/10 border border-[#2ee58f]/20 text-[#2ee58f] text-[10px] font-bold uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2ee58f] animate-pulse" />
              HQ Production Node
            </span>
            <span className="text-xs text-white/30">/</span>
            <span className="text-xs text-white/50 font-mono">Agency Control v3.0</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase italic">
            Agency <span className="text-[#2ee58f]">Headquarter</span>
          </h1>
          <p className="text-white/50 text-xs sm:text-sm mt-1 max-w-xl">
            Gestión centralizada de infraestructura web, clientes activos, sincronización en vivo de Vercel & Stripe, y facturación recurrente.
          </p>
        </div>
        
        {/* Top Header Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white flex items-center gap-2 transition-all disabled:opacity-50"
            title="Sincronizar datos de Vercel y Airtable"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#2ee58f]' : 'text-zinc-400'}`} />
            <span className="hidden sm:inline">Sincronizar</span>
          </button>

          <Link href="/propuestas">
            <button className="px-4 py-2.5 bg-[#2ee58f]/10 border border-[#2ee58f]/30 text-[#2ee58f] hover:bg-[#2ee58f]/20 font-bold rounded-xl shadow-lg flex items-center gap-2 transition-all text-xs">
              <FileText className="w-4 h-4" />
              <span>Propuestas & Ventas</span>
            </button>
          </Link>

          <Link href="/admin/clients/new">
            <button className="px-5 py-2.5 bg-white text-black font-black rounded-xl shadow-2xl flex items-center gap-2 hover:bg-zinc-200 transition-all text-xs">
              <Plus className="w-4 h-4" />
              <span>Registrar Cliente</span>
            </button>
          </Link>
        </div>
      </div>

      {/* KPI Cards - UI/UX Pro Max Interactive Bento Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        <ModernStatCard 
          label="Total Clientes" 
          value={stats.totalClients.toString()} 
          subValue="Base activa registrada" 
          icon={<Users className="w-4 h-4 text-[#2ee58f]" />} 
          badgeColor="emerald"
          onClick={() => setFilterStatus('ALL')}
          isActive={filterStatus === 'ALL'}
          highlight="100% Sincronizado"
        />
        <ModernStatCard 
          label="Live en Vercel" 
          value={stats.activeProjects.toString()} 
          subValue="Deployments online" 
          icon={<Globe className="w-4 h-4 text-sky-400" />} 
          badgeColor="sky"
          onClick={() => setFilterStatus('LIVE')}
          isActive={filterStatus === 'LIVE'}
          highlight="99.9% Uptime"
        />
        <ModernStatCard 
          label="MRR Activo" 
          value={`$${stats.monthlyRevenue.toLocaleString()}`} 
          subValue={`${stats.paidPayments} planes activos ($30)`} 
          icon={<CreditCard className="w-4 h-4 text-indigo-400" />} 
          badgeColor="indigo"
          onClick={() => setFilterStatus('PAID')}
          isActive={filterStatus === 'PAID'}
          highlight="Recurrente"
        />
        <ModernStatCard 
          label="Pagos Pendientes" 
          value={stats.pendingPayments.toString()} 
          subValue="Requiere seguimiento" 
          icon={<AlertCircle className="w-4 h-4 text-amber-400" />} 
          badgeColor="amber"
          onClick={() => setFilterStatus('PENDING_PAYMENT')}
          isActive={filterStatus === 'PENDING_PAYMENT'}
          highlight="Acción Requerida"
        />
      </div>

      {/* Main Grid: Inventory (8 cols) + Right Analytics & Agents (4 cols) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Client Inventory */}
        <div className="xl:col-span-8 bg-[#090f0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          
          {/* Inventory Top Toolbar */}
          <div className="p-5 sm:p-6 border-b border-white/5 bg-[#0d1511]/70 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                <span>Inventario de Sitios Web</span>
                <span className="text-[10px] font-mono text-[#2ee58f] bg-[#2ee58f]/10 border border-[#2ee58f]/20 px-2 py-0.5 rounded-full">
                  {filteredClients.length} de {clients.length}
                </span>
              </h3>
            </div>

            {/* View Mode & Sorter */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center bg-black/40 border border-white/10 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#2ee58f] text-[#04100b]' : 'text-zinc-400 hover:text-white'}`}
                  title="Vista Lista"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#2ee58f] text-[#04100b]' : 'text-zinc-400 hover:text-white'}`}
                  title="Vista Tarjetas Bento"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black/40 border border-white/10 text-xs font-semibold text-zinc-300 rounded-xl px-3 py-2 focus:outline-none focus:border-[#2ee58f]"
              >
                <option value="recent">Más recientes</option>
                <option value="name">Nombre (A-Z)</option>
                <option value="mrr">Mayor MRR</option>
              </select>
            </div>
          </div>

          {/* Filter Chips & Search Bar */}
          <div className="p-4 sm:p-5 border-b border-white/5 bg-[#0a110e]/40 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Status Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {(['ALL', 'LIVE', 'PAID', 'PENDING_PAYMENT'] as const).map((st) => {
                const isSelected = filterStatus === st;
                const label = st === 'ALL' ? 'Todos' : st === 'LIVE' ? 'Live Vercel' : st === 'PAID' ? 'Pagados ($30)' : 'Pendientes';
                const count = st === 'ALL' ? clients.length : st === 'LIVE' ? stats.activeProjects : st === 'PAID' ? stats.paidPayments : stats.pendingPayments;
                return (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#2ee58f] text-[#04100b] shadow-[0_0_15px_rgba(46,229,143,0.25)]'
                        : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 border border-white/5'
                    }`}
                  >
                    <span>{label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${isSelected ? 'bg-black/20 text-black font-black' : 'bg-white/5 text-zinc-500'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Instant Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Buscar cliente, web, dominio, slug, estado..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#111e17] border border-white/10 rounded-xl py-2 pl-10 pr-20 text-xs font-medium w-full focus:outline-none focus:border-[#2ee58f] text-white placeholder:text-zinc-500 transition-all" 
              />
              {searchQuery && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <span className="text-[10px] font-mono text-[#2ee58f] bg-[#2ee58f]/10 px-1.5 py-0.5 rounded border border-[#2ee58f]/20">
                    {filteredClients.length}
                  </span>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-zinc-400 hover:text-white text-xs p-1"
                    title="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* LIST VIEW MODE */}
          {viewMode === 'list' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-white/5 bg-black/20">
                    <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500">Cliente / Negocio</th>
                    <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Vercel Status</th>
                    <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-center">Facturación</th>
                    <th className="p-4 sm:p-5 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Acciones Rápidas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {loading ? (
                    [1, 2, 3, 4, 5].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="p-8 bg-white/[0.02]" />
                      </tr>
                    ))
                  ) : filteredClients.length > 0 ? (
                    filteredClients.map((client) => {
                      const isDeployed = client.status === 'DEPLOYED';
                      const isPaid = client.paymentStatus === 'PAID';

                      return (
                        <tr 
                          key={client.id} 
                          onClick={() => setSelectedClient(client)}
                          className="group hover:bg-[#2ee58f]/[0.03] transition-colors cursor-pointer"
                        >
                          <td className="p-4 sm:p-5">
                            <div className="flex items-center gap-3.5">
                              {/* Favicon / Avatar */}
                              <div className="w-10 h-10 rounded-xl bg-[#111e17] border border-white/10 flex items-center justify-center overflow-hidden shrink-0 relative group-hover:border-[#2ee58f]/40 transition-colors">
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
                                  className="fallback-txt font-black text-xs uppercase text-[#2ee58f] absolute inset-0 items-center justify-center" 
                                  style={{ display: client.vercelUrl ? 'none' : 'flex' }}
                                >
                                  {(client.business || 'P').charAt(0)}
                                </span>
                              </div>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-bold text-white truncate group-hover:text-[#2ee58f] transition-colors">
                                    {client.business}
                                  </p>
                                  {client.name === 'Pendiente (Attom Link)' && (
                                    <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 text-[8px] font-black uppercase rounded border border-indigo-500/30">Lead Ingest</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] font-mono text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                    /{client.rawProjectName || client.id}
                                  </span>
                                  {client.name && client.name !== 'Unknown Owner' && client.name !== 'Sin Nombre' && (
                                    <span className="text-[11px] text-zinc-400 truncate">
                                      · {client.name}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Vercel Sync */}
                          <td className="p-4 sm:p-5 text-center">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${
                              isDeployed 
                                ? 'bg-[#2ee58f]/10 text-[#2ee58f] border-[#2ee58f]/30' 
                                : 'bg-red-500/10 text-red-400 border-red-500/30'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isDeployed ? 'bg-[#2ee58f] animate-pulse' : 'bg-red-400'}`} />
                              <span>{isDeployed ? 'Live Vercel' : 'Offline'}</span>
                            </div>
                          </td>

                          {/* Payment Status */}
                          <td className="p-4 sm:p-5 text-center">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${
                              isPaid 
                                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' 
                                : 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                            }`}>
                              <span>{isPaid ? `$${client.monthlyPrice || 30} PAID` : 'PENDIENTE'}</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-4 sm:p-5 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-nowrap" onClick={(e) => e.stopPropagation()}>
                              {/* 1-Click Copy $30 Link */}
                              <button 
                                onClick={(e) => copyDirectPaymentLink(client, e)}
                                className={`px-3 py-1.5 border rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                                  copiedId === client.id
                                    ? 'bg-[#2ee58f] text-[#04100b] border-[#2ee58f] shadow-lg shadow-[#2ee58f]/20 scale-105'
                                    : isPaid
                                      ? 'bg-[#2ee58f]/10 border-[#2ee58f]/30 text-[#2ee58f] hover:bg-[#2ee58f] hover:text-[#04100b]'
                                      : 'bg-white/5 border-white/10 text-indigo-400 hover:bg-indigo-500 hover:text-white'
                                }`}
                                title="Copiar Link de Pago $30 al portapapeles"
                              >
                                {copiedId === client.id ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>¡Copiado!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" />
                                    <span>Copiar $30</span>
                                  </>
                                )}
                              </button>

                              {/* WhatsApp Direct */}
                              <a
                                href={getWhatsAppMessage(client, 'billing')}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/10 text-zinc-400 transition-colors"
                                title="Enviar recordatorio de cobro por WhatsApp"
                              >
                                <Send className="w-3.5 h-3.5" />
                              </a>

                              {/* Live Web Link */}
                              {client.vercelUrl && (
                                <a 
                                  href={client.vercelUrl} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-xl bg-white/5 hover:bg-[#2ee58f] hover:text-[#04100b] border border-white/10 text-zinc-400 transition-colors"
                                  title="Abrir web oficial en producción"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}

                              {/* Inspect drawer trigger */}
                              <button
                                onClick={() => setSelectedClient(client)}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-zinc-400 hover:text-white transition-colors"
                                title="Ver detalles y opciones avanzadas"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-16 text-center">
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">No se encontraron clientes que coincidan con el filtro</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* GRID BENTO VIEW MODE */}
          {viewMode === 'grid' && (
            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredClients.map((client) => {
                const isDeployed = client.status === 'DEPLOYED';
                const isPaid = client.paymentStatus === 'PAID';

                return (
                  <motion.div
                    key={client.id}
                    layout
                    onClick={() => setSelectedClient(client)}
                    className="p-5 rounded-2xl bg-gradient-to-b from-[#0f1914] to-[#0a110e] border border-white/10 hover:border-[#2ee58f]/40 transition-all cursor-pointer flex flex-col justify-between space-y-4 group hover:shadow-2xl"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-[#111e17] border border-white/10 flex items-center justify-center overflow-hidden">
                            {client.vercelUrl ? (
                              <img 
                                src={getFaviconUrl(client.vercelUrl) || ''} 
                                alt="" 
                                className="w-4 h-4 object-contain"
                              />
                            ) : (
                              <span className="text-[10px] font-black text-[#2ee58f]">
                                {(client.business || 'P').charAt(0)}
                              </span>
                            )}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white group-hover:text-[#2ee58f] transition-colors line-clamp-1">
                              {client.business}
                            </h4>
                            <span className="text-[10px] font-mono text-zinc-500">
                              /{client.rawProjectName || client.id}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                          isPaid ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                        }`}>
                          {isPaid ? `$${client.monthlyPrice || 30} PAID` : 'PENDIENTE'}
                        </span>
                      </div>

                      {client.vercelUrl && (
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-[11px] font-mono text-zinc-400 truncate flex items-center justify-between">
                          <span className="truncate">{client.vercelUrl}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-500 shrink-0 ml-1" />
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => copyDirectPaymentLink(client, e)}
                        className="flex-1 py-2 px-3 rounded-xl bg-[#2ee58f]/10 hover:bg-[#2ee58f] text-[#2ee58f] hover:text-[#04100b] text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 border border-[#2ee58f]/20"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar $30</span>
                      </button>

                      <a
                        href={getWhatsAppMessage(client, 'billing')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-white border border-white/10 text-zinc-400 transition-colors"
                        title="Enviar por WhatsApp"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

        </div>

        {/* Right Column: Growth Analytics & Autonomous Agents */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Revenue Analytics Bento Card */}
          <div className="bg-[#090f0c] border border-white/10 rounded-3xl p-6 md:p-7 relative overflow-hidden shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">
                  Monthly Recurring Revenue (MRR)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    ${stats.monthlyRevenue.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-zinc-500">USD/mes</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#2ee58f] font-bold mt-1.5">
                  <span>▲</span>
                  <span>+140% crecimiento este mes</span>
                </div>
              </div>
              
              {/* Target Milestone Progress */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="24" cy="24" r="20" className="stroke-white/10 fill-none" strokeWidth="3" />
                  <circle 
                    cx="24" 
                    cy="24" 
                    r="20" 
                    className="stroke-[#2ee58f] fill-none" 
                    strokeWidth="3" 
                    strokeDasharray="126" 
                    strokeDashoffset={126 * (1 - Math.min(stats.monthlyRevenue / 300, 1))} 
                    strokeLinecap="round" 
                  />
                </svg>
                <span className="absolute text-[9px] font-black text-white font-mono">
                  {Math.round((stats.monthlyRevenue / 300) * 100)}%
                </span>
              </div>
            </div>

            {/* Monthly Trend Chart */}
            <div className="space-y-3 bg-black/40 p-4 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                <span>Evolución de Planes</span>
                <span className="text-[#2ee58f]">Meta $300 MRR</span>
              </div>

              <div className="flex items-end justify-between h-20 px-2 pt-2">
                {[
                  { label: 'Ene', val: 0 },
                  { label: 'Feb', val: 0 },
                  { label: 'Mar', val: 0 },
                  { label: 'Abr', val: 12 },
                  { label: 'May', val: 12 },
                  { label: 'Jun', val: 42 },
                  { label: 'Jul', val: stats.monthlyRevenue || 72 }
                ].map((item, idx) => {
                  const maxVal = Math.max(stats.monthlyRevenue, 72);
                  const pct = maxVal > 0 ? (item.val / maxVal) * 100 : 0;
                  const isCurrent = idx === 6;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-1.5 group cursor-pointer" title={`$${item.val} USD`}>
                      <div className="w-4 h-16 bg-white/[0.03] border border-white/5 rounded-t-md relative flex items-end overflow-hidden">
                        <div 
                          className={`w-full rounded-t-md transition-all duration-500 ${isCurrent ? 'bg-gradient-to-t from-[#2ee58f] to-[#25be76]' : 'bg-gradient-to-t from-zinc-800 to-zinc-700'}`} 
                          style={{ height: `${Math.max(pct, 8)}%` }} 
                        />
                      </div>
                      <span className={`text-[8px] font-black uppercase tracking-wider ${isCurrent ? 'text-[#2ee58f]' : 'text-zinc-500'}`}>
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-2 border-t border-white/5">
                <span>Planes de $30 USD Activos:</span>
                <span className="font-bold text-white font-mono">{stats.paidPayments} clientes</span>
              </div>
            </div>
          </div>

          {/* Autonomous Operations Hub Card */}
          <div className="bg-[#090f0c] border border-white/10 rounded-3xl p-6 md:p-7 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Ecosistemas & Agentes Universa
              </h3>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#2ee58f]/10 border border-[#2ee58f]/20 text-[#2ee58f] text-[9px] font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ee58f] animate-pulse" />
                Live Node
              </div>
            </div>

            <div className="space-y-3">
              {/* Proposals Hub Agent Card */}
              <Link
                href="/propuestas"
                className="group p-4 bg-[#111e17] hover:bg-[#14251c] border border-[#2ee58f]/30 rounded-2xl flex items-center justify-between transition-all shadow-[0_0_20px_rgba(46,229,143,0.06)]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#2ee58f]/10 border border-[#2ee58f]/30 flex items-center justify-center text-[#2ee58f]">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white group-hover:text-[#2ee58f] transition-colors">Propuestas & Ventas</h4>
                      <span className="px-1.5 py-0.2 rounded text-[7px] font-black uppercase bg-[#2ee58f] text-[#04100b]">19 ACTIVAS</span>
                    </div>
                    <p className="text-[10px] text-zinc-400">Pipeline $21,955 USD · Pitch Píxel & Retargeting</p>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#2ee58f] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              {/* ATTOM Lead Center */}
              <Link
                href="/dashboard/attom"
                className="group p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">ATTOM Digital Architect</h4>
                    <p className="text-[10px] text-zinc-500">Lead Ingestion & Web Generation Center</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </Link>

              {/* n8n Automator */}
              <Link
                href="/hq/n8n"
                className="group p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">n8n Workflow Engine</h4>
                    <p className="text-[10px] text-zinc-500">Automator & Webhook Handlers</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </Link>

              {/* Copywriter AI */}
              <Link
                href="/creador"
                className="group p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 rounded-2xl flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">Creador & Copywriter</h4>
                    <p className="text-[10px] text-zinc-500">Generador de contenido persuasivo</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* SLIDE-OVER DRAWER: CLIENT DEEP DIVE INSPECTOR */}
      <AnimatePresence>
        {selectedClient && (
          <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-md flex justify-end" onClick={() => setSelectedClient(null)}>
            <motion.div
              initial={{ opacity: 0, x: 400 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 400 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-[#090f0c] border-l border-white/10 h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-start justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#111e17] border border-[#2ee58f]/30 flex items-center justify-center overflow-hidden">
                      {selectedClient.vercelUrl ? (
                        <img 
                          src={getFaviconUrl(selectedClient.vercelUrl) || ''} 
                          alt="" 
                          className="w-6 h-6 object-contain"
                        />
                      ) : (
                        <span className="text-sm font-black text-[#2ee58f]">
                          {(selectedClient.business || 'P').charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">{selectedClient.business}</h3>
                      <p className="text-xs text-zinc-400 font-mono">/{selectedClient.rawProjectName || selectedClient.id}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedClient(null)}
                    className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Details Body */}
                <div className="space-y-6 mt-6">
                  {/* Status Pills */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#0e1612] border border-white/5">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Estado de Hosting</span>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#2ee58f] animate-pulse" />
                        <span className="text-sm font-bold text-white">Online en Vercel</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#0e1612] border border-white/5">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold block mb-1">Estado de Pago</span>
                      <span className={`text-sm font-black ${selectedClient.paymentStatus === 'PAID' ? 'text-[#2ee58f]' : 'text-amber-400'}`}>
                        {selectedClient.paymentStatus === 'PAID' ? `$${selectedClient.monthlyPrice || 30} USD Cobrado` : 'Pendiente de Cobro'}
                      </span>
                    </div>
                  </div>

                  {/* Domain & Aliases */}
                  {selectedClient.vercelUrl && (
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                      <span className="text-[10px] text-zinc-500 uppercase font-bold">Dominio Principal en Producción:</span>
                      <a 
                        href={selectedClient.vercelUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-xs font-mono text-[#2ee58f] hover:underline flex items-center gap-1.5"
                      >
                        <span>{selectedClient.vercelUrl}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}

                  {/* Payment Link Box */}
                  <div className="p-4 rounded-2xl bg-[#111e17] border border-[#2ee58f]/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#2ee58f] uppercase font-bold">Portal de Pago $30 USD</span>
                      <span className="text-[10px] font-mono text-zinc-400">Stripe Auto-Recurring</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-zinc-300 truncate">
                      {selectedClient.paymentUrl}
                    </div>
                    <button
                      onClick={() => copyDirectPaymentLink(selectedClient)}
                      className="w-full py-2.5 bg-[#2ee58f] text-[#04100b] rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:bg-[#28c77c] transition-all"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copiar Enlace de Pago</span>
                    </button>
                  </div>

                  {/* WhatsApp Quick Templates */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-zinc-500 uppercase font-bold block">Plantillas de Mensajes de WhatsApp:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <a
                        href={getWhatsAppMessage(selectedClient, 'billing')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/5 text-center text-[10px] font-bold text-white hover:text-[#2ee58f] transition-all"
                      >
                        Cobro Mensual
                      </a>
                      <a
                        href={getWhatsAppMessage(selectedClient, 'reminder')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/5 text-center text-[10px] font-bold text-white hover:text-[#2ee58f] transition-all"
                      >
                        Recordatorio
                      </a>
                      <a
                        href={getWhatsAppMessage(selectedClient, 'welcome')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/5 text-center text-[10px] font-bold text-white hover:text-[#2ee58f] transition-all"
                      >
                        Web Lista
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-6 border-t border-white/10 flex items-center gap-3">
                <button
                  onClick={() => openShareModal(selectedClient)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/10"
                >
                  Opciones de Compartir
                </button>
                {selectedClient.vercelUrl && (
                  <a
                    href={selectedClient.vercelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-5 bg-white text-black rounded-xl text-xs font-black uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center gap-2"
                  >
                    <span>Abrir Web</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: SHARE & PAYMENT OPTIONS */}
      <AnimatePresence>
        {paymentModal?.visible && (
          <div
            className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setPaymentModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#0b120e] border border-white/10 rounded-3xl p-6 sm:p-8 w-full max-w-lg shadow-2xl space-y-6"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#2ee58f]/10 border border-[#2ee58f]/30 flex items-center justify-center text-[#2ee58f]">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">Link de Pago Generado</span>
                    <h3 className="text-base font-bold text-white">{paymentModal.business}</h3>
                  </div>
                </div>
                <button onClick={() => setPaymentModal(null)} className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 bg-[#111e17] border border-[#2ee58f]/30 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#2ee58f]">Monto Mensual</p>
                  <p className="text-3xl font-black text-white">$30<span className="text-xs text-white/50">/mes</span></p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase font-bold text-zinc-500">Concepto</p>
                  <p className="text-xs font-bold text-zinc-300">Hosting + Mantenimiento</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Enlace Directo</span>
                <div className="p-3 bg-black/50 border border-white/10 rounded-xl text-xs font-mono text-zinc-300 truncate">
                  {paymentModal.url}
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={copyPaymentLink}
                  className={`w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                    paymentModal.copied
                      ? 'bg-[#2ee58f] text-[#04100b] shadow-lg shadow-[#2ee58f]/20'
                      : 'bg-white text-black hover:bg-zinc-200'
                  }`}
                >
                  {paymentModal.copied ? (
                    <><CheckCircle2 className="w-4 h-4" /> ¡Copiado al Portapapeles!</>
                  ) : (
                    <><Copy className="w-4 h-4" /> Copiar Link de Pago</>
                  )}
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`¡Hola! Te comparto el enlace para el hosting y mantenimiento mensual de la web de ${paymentModal.business} ($30 USD/mes):\n\n${paymentModal.url}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Enviar por WhatsApp</span>
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function ModernStatCard({ 
  label, 
  value, 
  subValue, 
  icon, 
  badgeColor, 
  onClick, 
  isActive,
  highlight
}: { 
  label: string; 
  value: string; 
  subValue: string; 
  icon: React.ReactNode; 
  badgeColor: 'emerald' | 'sky' | 'indigo' | 'amber'; 
  onClick?: () => void; 
  isActive?: boolean;
  highlight?: string;
}) {
  return (
    <div 
      onClick={onClick}
      className={`bg-[#090f0c] border rounded-2xl md:rounded-3xl p-5 md:p-6 group transition-all duration-300 flex flex-col justify-between min-h-[140px] select-none ${
        onClick ? 'cursor-pointer active:scale-[0.98]' : ''
      } ${
        isActive 
          ? 'border-[#2ee58f] bg-[#2ee58f]/[0.04] shadow-[0_0_25px_rgba(46,229,143,0.12)]' 
          : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">{icon}</div>
        {highlight && (
          <span className="text-[9px] font-mono text-zinc-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
            {highlight}
          </span>
        )}
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-none">{value}</h4>
          <p className="text-[10px] font-medium text-zinc-500 truncate leading-none">{subValue}</p>
        </div>
      </div>
    </div>
  );
}
