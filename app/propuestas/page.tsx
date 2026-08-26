'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  Copy, 
  Check, 
  Search, 
  Filter, 
  TrendingUp, 
  DollarSign, 
  Zap, 
  Layers, 
  Flame, 
  Snowflake, 
  Sun, 
  Cpu, 
  BarChart3, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  ArrowUpRight, 
  MessageCircle, 
  Sliders, 
  Calculator, 
  Award,
  Database,
  Crosshair,
  Smartphone,
  ChevronRight,
  Eye,
  HelpCircle
} from 'lucide-react';
import proposalsData from '@/data/proposals.json';

type TabMode = 'control' | 'metodo' | 'calculadora';

interface ProposalItem {
  slug: string;
  client: string;
  title: string;
  status: string;
  investment: number;
  originalInvestment?: number;
  phasesCount: number;
  phases: any[];
  summary: string;
  isContract?: boolean;
  paymentSplit?: string;
  category: 'Aceptada' | 'En Negociación' | 'Pendiente' | 'Archivada';
}

export default function PropuestasHubPage() {
  const [activeTab, setActiveTab] = useState<TabMode>('control');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Aceptada' | 'En Negociación' | 'Pendiente'>('ALL');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [selectedProposal, setSelectedProposal] = useState<ProposalItem | null>(null);

  // Proposal Calculator State
  const [calcTier, setCalcTier] = useState<'landing' | 'ecommerce' | 'ecosystem'>('ecommerce');
  const [includePixel, setIncludePixel] = useState(true);
  const [includeSeo, setIncludeSeo] = useState(true);
  const [includeBooking, setIncludeBooking] = useState(false);
  const [includeContent, setIncludeContent] = useState(false);

  // Parse all proposals into structured list
  const proposalsList = useMemo<ProposalItem[]>(() => {
    return Object.entries(proposalsData).map(([slug, data]: [string, any]) => {
      const phases = data.phases || [];
      const totalInv = phases.reduce((acc: number, p: any) => acc + (p.investment || 0), 0);
      const originalInv = phases.reduce((acc: number, p: any) => acc + (p.originalInvestment || p.investment || 0), 0);

      // Categorize status
      const statusLower = (data.status || '').toLowerCase();
      let category: 'Aceptada' | 'En Negociación' | 'Pendiente' | 'Archivada' = 'Pendiente';
      
      if (statusLower.includes('aceptad') || statusLower.includes('firmad') || statusLower.includes('contrato digital')) {
        category = 'Aceptada';
      } else if (statusLower.includes('estrategia') || statusLower.includes('integrado') || statusLower.includes('comercial')) {
        category = 'En Negociación';
      } else {
        category = 'Pendiente';
      }

      return {
        slug,
        client: data.client || 'Cliente Sin Nombre',
        title: data.title || 'Propuesta de Ecosistema Web',
        status: data.status || 'Propuesta Activa',
        investment: totalInv,
        originalInvestment: originalInv > totalInv ? originalInv : undefined,
        phasesCount: phases.length,
        phases,
        summary: data.summary || '',
        isContract: !!data.isContract,
        paymentSplit: data.paymentSplit,
        category
      };
    });
  }, []);

  // Filtered proposals
  const filteredProposals = useMemo(() => {
    return proposalsList.filter(p => {
      const matchesSearch = 
        p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.slug.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || p.category === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [proposalsList, searchQuery, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const totalPipeline = proposalsList.reduce((acc, p) => acc + p.investment, 0);
    const acceptedCount = proposalsList.filter(p => p.category === 'Aceptada').length;
    const acceptedRevenue = proposalsList.filter(p => p.category === 'Aceptada').reduce((acc, p) => acc + p.investment, 0);
    const inNegotiationCount = proposalsList.filter(p => p.category === 'En Negociación').length;
    const inNegotiationRevenue = proposalsList.filter(p => p.category === 'En Negociación').reduce((acc, p) => acc + p.investment, 0);
    const pendingCount = proposalsList.filter(p => p.category === 'Pendiente').length;

    return {
      totalPipeline,
      acceptedCount,
      acceptedRevenue,
      inNegotiationCount,
      inNegotiationRevenue,
      pendingCount,
      totalCount: proposalsList.length,
      averageTicket: Math.round(totalPipeline / (proposalsList.length || 1))
    };
  }, [proposalsList]);

  // Copy proposal link helper
  const handleCopyLink = (slug: string) => {
    const url = `${window.location.origin}/propuestas/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // WhatsApp follow-up link
  const getWhatsAppFollowup = (p: ProposalItem) => {
    const text = encodeURIComponent(
      `¡Hola ${p.client}! Te saluda Jose Figueroa de Universa Growth Lab. Te comparto el enlace directo a tu propuesta digital personalizada para que puedas revisarla en detalle con tu equipo: https://www.universaagency.com/propuestas/${p.slug}\n\nQuedo a tu total disposición para cualquier consulta.`
    );
    return `https://wa.me/?text=${text}`;
  };

  // Calculator price calculation
  const calculatedPrice = useMemo(() => {
    let base = calcTier === 'landing' ? 450 : calcTier === 'ecommerce' ? 1000 : 1850;
    if (includePixel) base += 250;
    if (includeSeo) base += 300;
    if (includeBooking) base += 250;
    if (includeContent) base += 450;
    return base;
  }, [calcTier, includePixel, includeSeo, includeBooking, includeContent]);

  return (
    <div className="min-h-screen bg-[#070b09] text-[#e3ece7] font-sans selection:bg-[#2ee58f] selection:text-[#04100b] relative overflow-x-hidden">
      {/* Background Cosmic Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(46,229,143,0.08)_0%,transparent_70%)]" />
        <div className="absolute top-[30%] right-[-15%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(167,137,255,0.06)_0%,transparent_70%)]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(46,229,143,0.05)_0%,transparent_70%)]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Header & Navigation */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-semibold text-white/50 hover:text-[#2ee58f] transition-colors">
                ← Volver a /admin
              </Link>
              <span className="text-white/20">/</span>
              <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2ee58f] uppercase tracking-widest bg-[#2ee58f]/10 px-2.5 py-1 rounded-full border border-[#2ee58f]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ee58f] animate-pulse" />
                Pipeline de Cierre & Ventas
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              Universa Proposals Hub
              <span className="text-sm font-normal text-white/40 border border-white/10 px-2.5 py-0.5 rounded-md">v2.0</span>
            </h1>
            <p className="text-white/60 text-sm sm:text-base mt-1 max-w-2xl">
              Control centralizado de propuestas comerciales enviadas, estado de contratos y manifiesto estratégico de cómo y por qué cotizamos sitios web.
            </p>
          </div>

          {/* Navigation Mode Tabs */}
          <div className="flex items-center bg-[#0d1511] p-1.5 rounded-2xl border border-white/10 self-start md:self-auto shadow-2xl">
            <button
              onClick={() => setActiveTab('control')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'control'
                  ? 'bg-[#2ee58f] text-[#04100b] shadow-[0_0_20px_rgba(46,229,143,0.35)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              Control de Propuestas ({proposalsList.length})
            </button>
            <button
              onClick={() => setActiveTab('metodo')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'metodo'
                  ? 'bg-[#2ee58f] text-[#04100b] shadow-[0_0_20px_rgba(46,229,143,0.35)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              ¿Cómo & Por Qué Vendemos Web?
            </button>
            <button
              onClick={() => setActiveTab('calculadora')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'calculadora'
                  ? 'bg-[#2ee58f] text-[#04100b] shadow-[0_0_20px_rgba(46,229,143,0.35)]'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Cotizador Rápido
            </button>
          </div>
        </header>

        {/* TAB 1: CONTROL DE PROPUESTAS */}
        {activeTab === 'control' && (
          <div className="mt-8 space-y-8">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-gradient-to-b from-[#111c16] to-[#0b120e] p-5 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
                  <span>Total Cotizado</span>
                  <DollarSign className="w-4 h-4 text-[#2ee58f]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  ${stats.totalPipeline.toLocaleString()} <span className="text-xs font-medium text-white/40">USD</span>
                </div>
                <div className="text-xs text-white/40 mt-1">
                  En {stats.totalCount} propuestas enviadas
                </div>
                <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20 bg-[#2ee58f]/5 rounded-full blur-xl" />
              </div>

              <div className="bg-gradient-to-b from-[#111c16] to-[#0b120e] p-5 rounded-2xl border border-[#2ee58f]/30 relative overflow-hidden shadow-[0_0_25px_rgba(46,229,143,0.08)]">
                <div className="flex items-center justify-between text-[#2ee58f] text-xs font-semibold uppercase tracking-wider mb-2">
                  <span>Aceptadas / Firmadas</span>
                  <CheckCircle2 className="w-4 h-4 text-[#2ee58f]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  ${stats.acceptedRevenue.toLocaleString()} <span className="text-xs font-medium text-white/40">USD</span>
                </div>
                <div className="text-xs text-[#2ee58f]/80 mt-1 font-semibold">
                  {stats.acceptedCount} clientes formalizados
                </div>
                <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20 bg-[#2ee58f]/10 rounded-full blur-xl" />
              </div>

              <div className="bg-gradient-to-b from-[#111c16] to-[#0b120e] p-5 rounded-2xl border border-[#a78bff]/30 relative overflow-hidden">
                <div className="flex items-center justify-between text-[#a78bff] text-xs font-semibold uppercase tracking-wider mb-2">
                  <span>En Negociación</span>
                  <Clock className="w-4 h-4 text-[#a78bff]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  ${stats.inNegotiationRevenue.toLocaleString()} <span className="text-xs font-medium text-white/40">USD</span>
                </div>
                <div className="text-xs text-[#a78bff]/80 mt-1 font-semibold">
                  {stats.inNegotiationCount} propuestas activas
                </div>
                <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20 bg-[#a78bff]/10 rounded-full blur-xl" />
              </div>

              <div className="bg-gradient-to-b from-[#111c16] to-[#0b120e] p-5 rounded-2xl border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between text-white/50 text-xs font-semibold uppercase tracking-wider mb-2">
                  <span>Ticket Promedio</span>
                  <TrendingUp className="w-4 h-4 text-[#2ee58f]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  ${stats.averageTicket.toLocaleString()} <span className="text-xs font-medium text-white/40">USD</span>
                </div>
                <div className="text-xs text-white/40 mt-1">
                  Ecosistemas de alto valor
                </div>
                <div className="absolute right-[-10px] bottom-[-10px] w-20 h-20 bg-[#2ee58f]/5 rounded-full blur-xl" />
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#0d1511] p-3 rounded-2xl border border-white/10">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, slug o servicio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#131e18] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#2ee58f]"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setStatusFilter('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === 'ALL'
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-white/60 hover:text-white'
                  }`}
                >
                  Todas ({proposalsList.length})
                </button>
                <button
                  onClick={() => setStatusFilter('Aceptada')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === 'Aceptada'
                      ? 'bg-[#2ee58f] text-[#04100b]'
                      : 'bg-white/5 text-[#2ee58f] hover:bg-[#2ee58f]/10'
                  }`}
                >
                  Aceptadas / Firmadas ({stats.acceptedCount})
                </button>
                <button
                  onClick={() => setStatusFilter('En Negociación')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === 'En Negociación'
                      ? 'bg-[#a78bff] text-[#04100b]'
                      : 'bg-white/5 text-[#a78bff] hover:bg-[#a78bff]/10'
                  }`}
                >
                  En Negociación ({stats.inNegotiationCount})
                </button>
                <button
                  onClick={() => setStatusFilter('Pendiente')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === 'Pendiente'
                      ? 'bg-amber-400 text-black'
                      : 'bg-white/5 text-amber-300 hover:bg-amber-400/10'
                  }`}
                >
                  Pendientes ({stats.pendingCount})
                </button>
              </div>
            </div>

            {/* Proposals Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProposals.map((p) => {
                const isAceptada = p.category === 'Aceptada';
                const isNegociacion = p.category === 'En Negociación';

                return (
                  <motion.div
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-gradient-to-b from-[#0f1713] to-[#090e0b] rounded-2xl p-5 border flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                      isAceptada
                        ? 'border-[#2ee58f]/40 hover:border-[#2ee58f]'
                        : isNegociacion
                        ? 'border-[#a78bff]/30 hover:border-[#a78bff]'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div>
                      {/* Card Header Status */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          isAceptada
                            ? 'bg-[#2ee58f]/10 text-[#2ee58f] border-[#2ee58f]/30'
                            : isNegociacion
                            ? 'bg-[#a78bff]/10 text-[#a78bff] border-[#a78bff]/30'
                            : 'bg-amber-400/10 text-amber-300 border-amber-400/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            isAceptada ? 'bg-[#2ee58f]' : isNegociacion ? 'bg-[#a78bff]' : 'bg-amber-400'
                          }`} />
                          {p.status}
                        </span>

                        <span className="font-mono text-xs text-white/30">
                          /{p.slug}
                        </span>
                      </div>

                      {/* Client Name & Project Title */}
                      <h3 className="text-xl font-bold text-white mb-1">
                        {p.client}
                      </h3>
                      <p className="text-xs font-semibold text-[#2ee58f]/90 line-clamp-1 mb-2 uppercase tracking-wide">
                        {p.title}
                      </p>
                      <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-4">
                        {p.summary || "Ecosistema digital completo diseñado para captura de data, autoridad y conversión."}
                      </p>

                      {/* Pricing Breakdown Pill */}
                      <div className="bg-black/40 border border-white/5 rounded-xl p-3 mb-4">
                        <div className="flex items-baseline justify-between">
                          <span className="text-[11px] text-white/40 uppercase font-semibold">Inversión Total:</span>
                          <div className="flex items-baseline gap-2">
                            {p.originalInvestment && (
                              <span className="text-xs text-white/30 line-through font-mono">
                                ${p.originalInvestment.toLocaleString()}
                              </span>
                            )}
                            <span className="text-lg font-black text-white font-mono">
                              ${p.investment.toLocaleString()} <span className="text-xs text-white/50 font-normal">USD</span>
                            </span>
                          </div>
                        </div>

                        {p.paymentSplit && (
                          <div className="text-[10px] text-white/40 mt-1 flex items-center justify-between border-t border-white/5 pt-1">
                            <span>Estructura de pagos:</span>
                            <span className="font-mono text-[#2ee58f] font-semibold">{p.paymentSplit} USD</span>
                          </div>
                        )}

                        <div className="text-[10px] text-white/40 mt-1 flex items-center justify-between">
                          <span>Fases incluidas:</span>
                          <span className="font-semibold text-white/70">{p.phasesCount} Fases de entrega</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/propuestas/${p.slug}`}
                          target="_blank"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#2ee58f] hover:bg-[#28c77c] text-[#04100b] font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-[0_0_15px_rgba(46,229,143,0.2)]"
                        >
                          Ver Propuesta Digital
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          onClick={() => handleCopyLink(p.slug)}
                          title="Copiar enlace de la propuesta"
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
                        >
                          {copiedSlug === p.slug ? (
                            <Check className="w-4 h-4 text-[#2ee58f]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <a
                          href={getWhatsAppFollowup(p)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] font-semibold text-white/50 hover:text-[#2ee58f] inline-flex items-center gap-1 transition-colors"
                        >
                          <MessageCircle className="w-3 h-3 text-[#2ee58f]" />
                          Seguimiento WhatsApp
                        </a>

                        <button
                          onClick={() => setSelectedProposal(p)}
                          className="text-[11px] font-semibold text-white/40 hover:text-white inline-flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          Desglose Rápido
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: EL MÉTODO UNIVERSA (PRESENTACIÓN COMERCIAL Y MANIFIESTO DE VENTAS) */}
        {activeTab === 'metodo' && (
          <div className="mt-8 space-y-12">
            
            {/* Hero Manifesto */}
            <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-[#0c1a13] via-[#09120e] to-[#040806] border border-[#2ee58f]/30 overflow-hidden shadow-2xl">
              <div className="max-w-3xl relative z-10">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2ee58f]/10 border border-[#2ee58f]/30 text-[#2ee58f] text-xs font-bold uppercase tracking-widest mb-4">
                  <Award className="w-3.5 h-3.5" />
                  El Estándar de Cierre Universa
                </span>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-4">
                  Por qué vendemos <span className="text-[#2ee58f]">Ecosistemas Web</span> y no simples "páginas de internet"
                </h2>
                <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                  Cualquiera puede hacer un diseño básico en una plantilla. Nosotros construimos <strong>activos comerciales de alta retención</strong> con captura de datos omnicanal, píxel de conversión e ingeniería visual a 60fps que transforman visitas anónimas en clientes rentables y recurrentes.
                </p>
              </div>
              <div className="absolute right-[-5%] bottom-[-10%] w-[450px] h-[450px] bg-[#2ee58f]/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* PILAR 1: LA MÁQUINA DE DATA Y RETARGETING */}
            <section className="bg-[#0b120e] rounded-3xl p-8 sm:p-10 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-[#2ee58f]/10 border border-[#2ee58f]/30 text-[#2ee58f] flex items-center justify-center font-bold text-sm">
                  01
                </span>
                <h3 className="text-2xl font-bold text-white">
                  La Máquina de Data, Meta Pixel & Audiencias Inteligentes
                </h3>
              </div>

              <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-8 max-w-4xl">
                La mayoría de los dueños de negocio cometen el grave error de dirigir tráfico a un Instagram DM o a un Linktree genérico. <strong>Cada persona que entra a tu perfil y no escribe un mensaje se evapora para siempre (0% de data).</strong> Con tu propia web y el Píxel activo, el 100% de los visitantes son etiquetados para alimentarte con campañas de retargeting de costo ultra-bajo.
              </p>

              {/* Temperature Funnel Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0f1914] rounded-2xl p-6 border border-sky-400/20 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-400/10 px-3 py-1 rounded-full border border-sky-400/30">
                      <Snowflake className="w-3.5 h-3.5" />
                      Tráfico Frío (Cold)
                    </span>
                    <span className="text-xs text-white/30 font-mono">Etapa 1</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Captura de Identidad & Dispositivo</h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Personas que nunca te han comprado. Al aterrizar en tu dominio, el Píxel registra su ID de Facebook/TikTok/Google, ubicación, intereses y comportamiento exacto.
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-sky-400 font-semibold">
                    → Creación de Audiencias Similares (Lookalikes)
                  </div>
                </div>

                <div className="bg-[#0f1914] rounded-2xl p-6 border border-amber-400/20 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                      <Sun className="w-3.5 h-3.5" />
                      Tráfico Tibio (Warm)
                    </span>
                    <span className="text-xs text-white/30 font-mono">Etapa 2</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Interés Activo & Consideración</h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Usuarios que vieron el menú, cotizaron un servicio, leyeron testimonios o añadieron al carrito. Ya confían en tu marca pero necesitan el empujón final.
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-amber-400 font-semibold">
                    → Campañas de Retargeting directo con ofertas
                  </div>
                </div>

                <div className="bg-[#0f1914] rounded-2xl p-6 border border-[#2ee58f]/20 relative overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2ee58f] bg-[#2ee58f]/10 px-3 py-1 rounded-full border border-[#2ee58f]/30">
                      <Flame className="w-3.5 h-3.5" />
                      Tráfico Caliente (Hot)
                    </span>
                    <span className="text-xs text-white/30 font-mono">Etapa 3</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Compradores & Creadores de LTV</h4>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Clientes que completaron el checkout o reservaron una cita. Su perfil de compra se envía a la IA publicitaria para encontrar clones exactos con alta disposición de pago.
                  </p>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-[#2ee58f] font-semibold">
                    → Up-selling automático y fidelización
                  </div>
                </div>
              </div>

              {/* Golden Rule Callout */}
              <div className="mt-6 bg-[#13221b] border-l-4 border-[#2ee58f] p-4 sm:p-5 rounded-r-2xl">
                <p className="text-sm text-white font-medium">
                  <strong>La Ley de Universa:</strong> "Si no tienes una página web con píxel instalado hoy, estás regalándole el 90% de tus potenciales clientes a tu competencia. Aunque no inviertas en anuncios este mes, el píxel ya está acumulando la data que te permitirá escalar cuando decidas pautar."
                </p>
              </div>
            </section>

            {/* PILAR 2: AUTORIDAD DE MARCA VS. LINKS GENÉRICOS */}
            <section className="bg-[#0b120e] rounded-3xl p-8 sm:p-10 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-[#2ee58f]/10 border border-[#2ee58f]/30 text-[#2ee58f] flex items-center justify-center font-bold text-sm">
                  02
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Autoridad de Marca vs. El "Linktree" y Catálogos Genéricos
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="bg-[#140e0e] rounded-2xl p-6 border border-red-500/20">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-4">
                    <span>✕</span> Enlace Genérico (Linktree, Canva, PDF, Links Gratis)
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-white/60">
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span><strong>Sin dominio propio:</strong> Tu cliente ve <code>linktr.ee/tumarca</code> en vez de <code>tumarca.com</code>. Pérdida inmediata de estatus.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span><strong>Sin captura de data:</strong> No puedes instalar el Píxel de Meta ni Google Tag Manager a nivel de evento avanzado.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span><strong>Diseño genérico y frío:</strong> Botones grises iguales a los de 10 millones de personas. 0% identidad de marca.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-400">✗</span>
                      <span><strong>Conversión pobre:</strong> Tasa promedio de conversión menor al 1.2%.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-[#0c1a13] rounded-2xl p-6 border border-[#2ee58f]/30 shadow-[0_0_30px_rgba(46,229,143,0.06)]">
                  <div className="flex items-center gap-2 text-[#2ee58f] font-bold text-sm mb-4">
                    <span>✓</span> Ecosistema Web a Medida Universa Growth Lab
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-white/80">
                    <li className="flex items-start gap-2">
                      <span className="text-[#2ee58f]">✓</span>
                      <span><strong>Dominio propio oficial:</strong> Proyecta una empresa consolidada y establecida en el mercado estadounidense e internacional.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#2ee58f]">✓</span>
                      <span><strong>Brand DNA Completo:</strong> Tu paleta cromática exacta, tipografía de autor y narrativa persuasiva orientada a ventas.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#2ee58f]">✓</span>
                      <span><strong>100% de Data Propietaria:</strong> Cada clic, scroll, producto visto y formulario queda grabado para retargeting eterno.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#2ee58f]">✓</span>
                      <span><strong>Conversión Elevada:</strong> Tasas de conversión optimizadas del 3.5% al 7.2%.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* PILAR 3: INGENIERÍA VISUAL, ANIMACIONES & SEO */}
            <section className="bg-[#0b120e] rounded-3xl p-8 sm:p-10 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-[#2ee58f]/10 border border-[#2ee58f]/30 text-[#2ee58f] flex items-center justify-center font-bold text-sm">
                  03
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Ingeniería Visual, Micro-animaciones a 60fps & SEO Local
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-[#0f1713] p-6 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-[#2ee58f]/10 text-[#2ee58f] flex items-center justify-center mb-3">
                    <Zap className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">El Cariño en los Detalles & Micro-Motion</h4>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                    Las animaciones en Universa no son un adorno: son <strong>psicología de retención</strong>. Usamos aceleración por hardware (GPU) y curvas de animación elásticas que hacen que la web se sienta viva, moderna y cara, permitiendo a nuestros clientes justificar tickets más altos.
                  </p>
                </div>

                <div className="bg-[#0f1713] p-6 rounded-2xl border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-[#a78bff]/10 text-[#a78bff] flex items-center justify-center mb-3">
                    <Globe className="w-5 h-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Dominación de Búsqueda (Google + IA)</h4>
                  <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                    Configuramos Datos Estructurados (Schema Markup), velocidad de carga inferior a 1 segundo y optimización para los nuevos motores de búsqueda basados en IA como <strong>ChatGPT Search, Perplexity y Google SGE</strong>, asegurando que tu negocio aparezca cuando buscan soluciones en tu ciudad.
                  </p>
                </div>
              </div>
            </section>

            {/* PILAR 4: CÓMO ESTRUCTURAMOS UNA PROPUESTA COMERCIAL */}
            <section className="bg-[#0b120e] rounded-3xl p-8 sm:p-10 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-9 h-9 rounded-xl bg-[#2ee58f]/10 border border-[#2ee58f]/30 text-[#2ee58f] flex items-center justify-center font-bold text-sm">
                  04
                </span>
                <h3 className="text-2xl font-bold text-white">
                  Formato Estándar de Cotización Universa en 3 Fases
                </h3>
              </div>

              <div className="space-y-4 mt-6">
                <div className="p-5 rounded-2xl bg-[#0f1713] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#2ee58f] uppercase tracking-wider">Fase 01</span>
                    <h4 className="text-lg font-bold text-white">Infraestructura Web Core, UX/UI & Mobile-First</h4>
                    <p className="text-xs text-white/50 max-w-xl">
                      Diseño a medida, catálogo o carta digital interactiva, carga ultra-rápida y pasarela de pago (Stripe, Apple Pay, Clover).
                    </p>
                  </div>
                  <div className="text-sm font-mono font-bold text-white bg-black/40 px-4 py-2 rounded-xl border border-white/10 whitespace-nowrap self-start sm:self-auto">
                    $600 – $1,200 USD
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0f1713] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-[#a78bff] uppercase tracking-wider">Fase 02</span>
                    <h4 className="text-lg font-bold text-white">Producción Audiovisual, UGC & Activos de Marca</h4>
                    <p className="text-xs text-white/50 max-w-xl">
                      Fotografía de producto profesional en bloque, videos UGC para TikTok/Reels y optimización visual de Instagram.
                    </p>
                  </div>
                  <div className="text-sm font-mono font-bold text-white bg-black/40 px-4 py-2 rounded-xl border border-white/10 whitespace-nowrap self-start sm:self-auto">
                    $350 – $800 USD
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#0f1713] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Fase 03</span>
                    <h4 className="text-lg font-bold text-white">Tracking Avanzado, Meta Pixel, SEO & Retargeting</h4>
                    <p className="text-xs text-white/50 max-w-xl">
                      Instalación de eventos de conversión, recuperación de carritos abandonados, Google Tag Manager y setup de audiencias.
                    </p>
                  </div>
                  <div className="text-sm font-mono font-bold text-white bg-black/40 px-4 py-2 rounded-xl border border-white/10 whitespace-nowrap self-start sm:self-auto">
                    $300 – $600 USD
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 3: CALCULADORA Y GENERADOR DE PROPUESTAS */}
        {activeTab === 'calculadora' && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#0b120e] rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">Cotizador Rápido de Ecosistemas</h3>
                <p className="text-xs sm:text-sm text-white/50">
                  Configura los módulos requeridos por el cliente para calcular la inversión recomendada y generar la estructura de la propuesta.
                </p>
              </div>

              {/* Tier Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/60 block mb-3">
                  1. Nivel de Infraestructura Digital
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setCalcTier('landing')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      calcTier === 'landing'
                        ? 'bg-[#2ee58f]/10 border-[#2ee58f] text-white shadow-[0_0_20px_rgba(46,229,143,0.2)]'
                        : 'bg-[#0f1713] border-white/10 text-white/60 hover:border-white/30'
                    }`}
                  >
                    <div className="font-bold text-sm text-white mb-1">Landing Page Pro</div>
                    <div className="text-xs text-white/40 mb-2">Captación rápida de leads</div>
                    <div className="font-mono text-sm font-bold text-[#2ee58f]">$450 USD</div>
                  </button>

                  <button
                    onClick={() => setCalcTier('ecommerce')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      calcTier === 'ecommerce'
                        ? 'bg-[#2ee58f]/10 border-[#2ee58f] text-white shadow-[0_0_20px_rgba(46,229,143,0.2)]'
                        : 'bg-[#0f1713] border-white/10 text-white/60 hover:border-white/30'
                    }`}
                  >
                    <div className="font-bold text-sm text-white mb-1">E-Commerce / Menu</div>
                    <div className="text-xs text-white/40 mb-2">Catálogo & checkout online</div>
                    <div className="font-mono text-sm font-bold text-[#2ee58f]">$1,000 USD</div>
                  </button>

                  <button
                    onClick={() => setCalcTier('ecosystem')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      calcTier === 'ecosystem'
                        ? 'bg-[#2ee58f]/10 border-[#2ee58f] text-white shadow-[0_0_20px_rgba(46,229,143,0.2)]'
                        : 'bg-[#0f1713] border-white/10 text-white/60 hover:border-white/30'
                    }`}
                  >
                    <div className="font-bold text-sm text-white mb-1">Ecosistema 360°</div>
                    <div className="text-xs text-white/40 mb-2">Plataforma custom + SaaS</div>
                    <div className="font-mono text-sm font-bold text-[#2ee58f]">$1,850 USD</div>
                  </button>
                </div>
              </div>

              {/* Modules Toggles */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-white/60 block mb-3">
                  2. Módulos Estratégicos Adicionales
                </label>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-4 rounded-xl bg-[#0f1713] border border-white/5 cursor-pointer hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={includePixel}
                        onChange={(e) => setIncludePixel(e.target.checked)}
                        className="w-4 h-4 rounded text-[#2ee58f] focus:ring-[#2ee58f] bg-black/40 border-white/20"
                      />
                      <div>
                        <div className="text-sm font-bold text-white">Meta Pixel + Full Funnel Tracking</div>
                        <div className="text-xs text-white/40">Tracking de conversiones, Google Tag Manager y audiencias de retargeting</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#2ee58f]">+$250 USD</span>
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-xl bg-[#0f1713] border border-white/5 cursor-pointer hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={includeSeo}
                        onChange={(e) => setIncludeSeo(e.target.checked)}
                        className="w-4 h-4 rounded text-[#2ee58f] focus:ring-[#2ee58f] bg-black/40 border-white/20"
                      />
                      <div>
                        <div className="text-sm font-bold text-white">SEO Local + Preparación IA (ChatGPT/Perplexity)</div>
                        <div className="text-xs text-white/40">Schema Markup estructurado e indexación en Google Maps</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#2ee58f]">+$300 USD</span>
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-xl bg-[#0f1713] border border-white/5 cursor-pointer hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={includeBooking}
                        onChange={(e) => setIncludeBooking(e.target.checked)}
                        className="w-4 h-4 rounded text-[#2ee58f] focus:ring-[#2ee58f] bg-black/40 border-white/20"
                      />
                      <div>
                        <div className="text-sm font-bold text-white">Motor de Reservas / Citas en Tiempo Real</div>
                        <div className="text-xs text-white/40">Integración con Google Calendar, recordatorios por email y cobro de depósitos</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#2ee58f]">+$250 USD</span>
                  </label>

                  <label className="flex items-center justify-between p-4 rounded-xl bg-[#0f1713] border border-white/5 cursor-pointer hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={includeContent}
                        onChange={(e) => setIncludeContent(e.target.checked)}
                        className="w-4 h-4 rounded text-[#2ee58f] focus:ring-[#2ee58f] bg-black/40 border-white/20"
                      />
                      <div>
                        <div className="text-sm font-bold text-white">Producción de Contenido (Fotos Pro + UGC Video)</div>
                        <div className="text-xs text-white/40">Sesión en bloque de producto y videos promocionales para redes</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#2ee58f]">+$450 USD</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Live Pricing Summary Box */}
            <div className="bg-[#0b120e] rounded-3xl p-6 sm:p-8 border border-[#2ee58f]/30 flex flex-col justify-between h-fit sticky top-6 shadow-2xl">
              <div>
                <div className="text-xs font-bold text-[#2ee58f] uppercase tracking-wider mb-2">
                  Resumen de Propuesta
                </div>
                <h4 className="text-xl font-black text-white mb-6">
                  {calcTier === 'landing' ? 'Landing Page de Captación' : calcTier === 'ecommerce' ? 'E-Commerce & Ordering' : 'Ecosistema 360° Omnicanal'}
                </h4>

                <div className="space-y-3 text-xs text-white/70 border-b border-white/10 pb-6 mb-6">
                  <div className="flex justify-between">
                    <span>Infraestructura Base:</span>
                    <span className="font-mono font-bold text-white">
                      ${calcTier === 'landing' ? '450' : calcTier === 'ecommerce' ? '1,000' : '1,850'} USD
                    </span>
                  </div>
                  {includePixel && (
                    <div className="flex justify-between text-sky-400">
                      <span>+ Píxel & Retargeting:</span>
                      <span className="font-mono font-bold">$250 USD</span>
                    </div>
                  )}
                  {includeSeo && (
                    <div className="flex justify-between text-amber-400">
                      <span>+ SEO Local & Búsqueda IA:</span>
                      <span className="font-mono font-bold">$300 USD</span>
                    </div>
                  )}
                  {includeBooking && (
                    <div className="flex justify-between text-[#a78bff]">
                      <span>+ Motor de Reservas:</span>
                      <span className="font-mono font-bold">$250 USD</span>
                    </div>
                  )}
                  {includeContent && (
                    <div className="flex justify-between text-[#2ee58f]">
                      <span>+ Producción Contenido:</span>
                      <span className="font-mono font-bold">$450 USD</span>
                    </div>
                  )}
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm font-bold text-white uppercase">Inversión Total:</span>
                  <span className="text-3xl font-black text-[#2ee58f] font-mono">
                    ${calculatedPrice.toLocaleString()} <span className="text-xs text-white/40">USD</span>
                  </span>
                </div>

                <div className="text-[11px] text-white/40 mb-6">
                  Plan de pagos estándar: 50% al iniciar (${Math.round(calculatedPrice/2)}) + 50% a la entrega (${Math.round(calculatedPrice/2)})
                </div>
              </div>

              <div className="space-y-2">
                <a
                  href={`https://wa.me/17863024923?text=${encodeURIComponent(
                    `Hola Jose, quiero cotizar un ${
                      calcTier === 'landing' ? 'Landing Page Pro' : calcTier === 'ecommerce' ? 'E-Commerce & Ordering' : 'Ecosistema 360°'
                    } con inversión estimada de $${calculatedPrice} USD.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-[#2ee58f] hover:bg-[#28c77c] text-[#04100b] font-bold text-sm py-3 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(46,229,143,0.3)]"
                >
                  <MessageCircle className="w-4 h-4" />
                  Enviar Cotización por WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: Desglose Rápido de Propuesta */}
      <AnimatePresence>
        {selectedProposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0b120e] border border-white/10 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative"
            >
              <div className="flex items-start justify-between gap-4 mb-4 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#2ee58f] uppercase tracking-wider">
                    {selectedProposal.status}
                  </span>
                  <h3 className="text-2xl font-bold text-white mt-1">
                    {selectedProposal.client}
                  </h3>
                  <p className="text-xs font-semibold text-white/50">{selectedProposal.title}</p>
                </div>
                <button
                  onClick={() => setSelectedProposal(null)}
                  className="p-2 rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase text-white/40 tracking-wider mb-2">Resumen Ejecutivo</h4>
                  <p className="text-sm text-white/70 leading-relaxed bg-[#0f1713] p-4 rounded-2xl border border-white/5">
                    {selectedProposal.summary || "Ecosistema de alta conversión diseñado a medida."}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase text-white/40 tracking-wider mb-3">Fases de Entrega ({selectedProposal.phasesCount})</h4>
                  <div className="space-y-3">
                    {selectedProposal.phases.map((ph: any, idx: number) => (
                      <div key={idx} className="bg-[#0f1713] p-4 rounded-2xl border border-white/5">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-sm text-white">{ph.name || `Fase ${idx + 1}`}</span>
                          <span className="font-mono text-sm font-bold text-[#2ee58f]">${ph.investment || 0} USD</span>
                        </div>
                        {ph.items && ph.items.length > 0 && (
                          <ul className="space-y-1 text-xs text-white/50">
                            {ph.items.map((it: any, i: number) => (
                              <li key={i}>• {it.title}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <span className="text-xs text-white/40 block">Inversión Total:</span>
                    <span className="text-2xl font-black text-white font-mono">${selectedProposal.investment.toLocaleString()} USD</span>
                  </div>

                  <Link
                    href={`/propuestas/${selectedProposal.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 bg-[#2ee58f] text-[#04100b] font-bold text-xs py-2.5 px-5 rounded-xl shadow-lg hover:bg-[#28c77c] transition-all"
                  >
                    Ver Propuesta Completa ↗
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
