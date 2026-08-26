'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
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
  HelpCircle,
  Users,
  Activity,
  Target,
  Brain,
  Lock,
  RefreshCw,
  BarChart2,
  ShieldAlert,
  CheckCheck,
  MousePointerClick,
  Radio,
  PieChart,
  LineChart,
  Code,
  Lightbulb,
  Share2,
  Send,
  Workflow,
  Sparkle
} from 'lucide-react';
import proposalsData from '@/data/proposals.json';

// --- MARKETING TITANS STRATEGY DATA ---
const titansData = [
  {
    id: 'hormozi',
    name: 'Alex Hormozi',
    book: 'Autor de $100M Offers & $100M Leads',
    badge: 'Category of One & Ecuación de Valor',
    tagline: '"Haz una oferta tan irresistible que la gente se sienta estúpida diciendo que no."',
    reframe: 'Nunca vendas una "página web" (un commodity de $200 donde compites por precio). Vende un Ecosistema de Retorno Asimétrico donde el costo de NO tenerlo es 10 veces mayor que la inversión.',
    universaApp: 'En Universa eliminamos la fricción y el riesgo: creamos la infraestructura completa (diseño a 60fps, catálogo interactivo, pasarelas de pago y tracking de primer orden) entregando un activo comercial llave en mano.',
    color: '#2ee58f',
    icon: Target
  },
  {
    id: 'brunson',
    name: 'Russell Brunson',
    book: 'Fundador de ClickFunnels & DotCom Secrets',
    badge: 'Traffic You Own vs. Rented Land',
    tagline: '"Si tu negocio depende únicamente del feed de Instagram o TikTok, estás construyendo sobre tierra alquilada."',
    reframe: 'Los enlaces genéricos como Linktree y los DMs de Instagram no te pertenecen. Si la red social cambia el algoritmo o cae la cuenta, tu flujo de prospectos desaparece instantáneamente.',
    universaApp: 'El Ecosistema Universa convierte visitas anónimas en Tráfico Propietario mediante Meta Pixel CAPI, Google Tag Manager y captura omnicanal de datos de primer orden (First-Party Data).',
    color: '#38bdf8',
    icon: Database
  },
  {
    id: 'suby',
    name: 'Sabri Suby',
    book: 'Autor de Sell Like Crazy & King of Direct Response',
    badge: 'La Regla del 3% & La Fuga del 97%',
    tagline: '"En cualquier momento, solo el 3% de tu mercado está listo para comprar. El 97% restante se evapora si no tienes retargeting."',
    reframe: 'Los catálogos tradicionales y los DMs solo capturan al 3% (y con fricción). El otro 97% visita tu perfil, duda, se va y jamás regresa porque nadie lo etiquetó.',
    universaApp: 'Instalamos tracking omnicanal para que el 97% de personas que visitan tu web sean nutridas automáticamente con anuncios de retargeting que cuestan centavos de dólar.',
    color: '#a78bff',
    icon: PieChart
  },
  {
    id: 'kennedy',
    name: 'Dan Kennedy',
    book: 'Padrino del Direct Response & Magnetic Marketing',
    badge: 'Activo Comercial vs. Gasto Digital',
    tagline: '"Un sitio web no es un folleto decorativo; es tu mejor vendedor que trabaja 24/7/365 sin pedir comisiones ni vacaciones."',
    reframe: 'Una plantilla básica de WordPress es un costo muerto. Un Ecosistema con pasarelas automáticas (Stripe, Apple Pay, Clover) y checkout optimizado es un activo generador de flujo de caja perpetuo.',
    universaApp: 'Estructuramos cada pantalla con jerarquía de conversión visual, botones de acción inmediata y pasarelas de pago que cierran ventas mientras duermes.',
    color: '#f59e0b',
    icon: DollarSign
  },
  {
    id: 'schwartz',
    name: 'Eugene Schwartz',
    book: 'Autor de Breakthrough Advertising',
    badge: '5 Niveles de Conciencia del Cliente',
    tagline: '"No puedes venderle a un cliente frío de la misma manera que le vendes a alguien que ya tiene la tarjeta en la mano."',
    reframe: 'Las páginas genéricas tratan a todos los usuarios por igual. Un ecosistema de alto nivel segmenta dinámicamente el comportamiento según la temperatura e intención de compra.',
    universaApp: 'Segmentamos automáticamente el tráfico en 3 temperaturas (Cold, Warm, Hot) para disparar eventos de conversión precisos y multiplicar el retorno publicitario.',
    color: '#ec4899',
    icon: Brain
  },
  {
    id: 'voss',
    name: 'Chris Voss',
    book: 'Ex-Negociador del FBI & Autor de Never Split the Difference',
    badge: 'Aversión a la Pérdida & Estatus Subconsciente',
    tagline: '"La aversión a la pérdida es el doble de poderosa que el deseo de ganar. Muéstrale al cliente lo que está perdiendo cada segundo."',
    reframe: 'El cliente no duda por el precio de la web; duda porque no comprende cuántos miles de dólares está regalando hoy a su competencia por no tener tracking profesional.',
    universaApp: 'Usamos ingeniería visual a 60fps y micro-motion acelerado por hardware para transmitir autoridad indiscutible, permitiendo a la marca justificar precios más altos.',
    color: '#10b981',
    icon: ShieldCheck
  }
];

// --- PLAYBOOK DE OBJECIONES DE CIERRE ---
const closingObjections = [
  {
    title: 'Objeción 1: "Un amigo / freelancer me hace la web por $200"',
    psychology: 'Reencuadre Dan Kennedy & Alex Hormozi (Gasto a Fondo Perdido vs. Activo de Retorno Asimétrico)',
    clientSay: 'Oye Jose, estuve cotizando y una persona me hace una página en WordPress o Canva por $200.',
    closerScript: `Comprendo perfectamente, y es tentador irse por ahí al inicio. La diferencia crucial es que un freelancer te va a cobrar $200 por entregarte un archivo de diseño genérico que nadie visita y que no captura data. Eso es un gasto del 100% porque ese dinero nunca regresa.

Nosotros en Universa no construimos páginas de adorno; construimos un activo comercial con Píxel de Meta CAPI, Google Tag Manager, pasarela de pago en 1 clic y fluidez visual a 60fps. Si tu ecosistema convierte tan solo 3 clientes adicionales al mes o recupera el 15% de los carritos que hoy se pierden en WhatsApp, la inversión se paga sola en 60 días y el resto es ganancia neta pura para tu negocio.

¿Prefieres gastar $200 en un folleto digital invisible o invertir en una máquina que te traiga clientes predecibles todos los meses?`,
    bulletPoints: [
      'Reencuadre Financiero: $200 en plantilla = 100% de pérdida (Costo hundido).',
      'Matemática Asimétrica: 3 ventas extra al mes amortizan la inversión completa.',
      'Diferencial Técnico: Píxel CAPI server-side + Pasarelas de 1 clic + Micro-Motion a 60fps.'
    ]
  },
  {
    title: 'Objeción 2: "Yo solo vendo por Instagram DM o WhatsApp, no necesito web"',
    psychology: 'Aversión a la Pérdida Chris Voss & La Regla del 3% de Sabri Suby',
    clientSay: 'La verdad es que a mí me escriben por Instagram y WhatsApp directo, siento que una web no me hace falta.',
    closerScript: `Vender por WhatsApp e Instagram es excelente para cerrar, pero tiene dos problemas mortales que frenan tu crecimiento:

Primero, requiere tu tiempo manual las 24 horas del día. Si alguien quiere ordenar a las 11:00 PM o un domingo y no respondes en 5 minutos, se va con tu competencia.
Segundo y más grave: por cada 100 personas que entran a tu perfil de Instagram hoy, solo 3 te escriben un DM. Las otras 97 personas se van y las pierdes para siempre (0% de retención).

Con tu Ecosistema Universa, esas 97 personas quedan etiquetadas automáticamente por el Píxel. Al día siguiente, cuando abren su Instagram o TikTok, les aparece tu anuncio de recordatorio por centavos de dólar. No estamos reemplazando tu WhatsApp; estamos evitando que regales el 97% de tus clientes potenciales.`,
    bulletPoints: [
      'Elimina el cuello de botella: Ventas y reservas automatizadas 24/7.',
      'La Regla del 3%: Deja de perder al 97% de visitantes que no escriben DM.',
      'Efecto Omnicanal: La web alimenta a tu WhatsApp con prospectos ya calificados.'
    ]
  },
  {
    title: 'Objeción 3: "Ahorita no voy a pagar publicidad, ¿para qué quiero el píxel?"',
    psychology: 'El Efecto Interés Compuesto de Datos (First-Party Data Compound Interest)',
    clientSay: 'Es que este mes no tengo presupuesto para pauta en Facebook o Google, así que el tracking no me urge.',
    closerScript: `Ese es exactamente el motivo por el cual debemos instalarlo HOY mismo. 

El Píxel de Meta y Google no empieza a aprender el día que pagas anuncios; empieza a aprender desde la primera visita orgánica que entra a tu web por tus historias, por Google o por recomendación boca a boca.

Cada visita que entra hoy acumula data sobre el tipo de dispositivo, ubicación, intereses y nivel de intención. Si esperas 4 meses para instalar el píxel, habrás botado a la basura 4 meses de data irrecuperable. Con el Ecosistema activo, cuando decidas invertir tus primeros $50 en anuncios dentro de unos meses, la inteligencia artificial ya sabrá con precisión milimétrica a quién mostrarle tu oferta para darte el retorno más alto.`,
    bulletPoints: [
      'Data Orgánica Gratuita: Cada visita sin pauta entrena a la IA sin costo adicional.',
      'Cero Aprendizaje Frío: Al pautar, no inicias desde cero; vas directo a audiencias con intención.',
      'Activo Acumulativo: La data recopilada es propiedad exclusiva de tu empresa.'
    ]
  }
];

// --- TABLA DE CONTRASTE COMPARATIVO ---
const comparisonDimensions = [
  {
    feature: 'Dominio & Presencia Oficial',
    generic: 'linktr.ee/tumarca o canva.site (Pérdida inmediata de autoridad y estatus)',
    universa: 'tumarca.com oficial (Proyecta empresa consolidada y de alto valor)',
    impact: 'Multiplica la confianza y el estatus'
  },
  {
    feature: 'Captura de Data & Píxel CAPI',
    generic: '0% de data. Imposible rastrear eventos avanzados o crear Lookalikes',
    universa: '100% First-Party Data con Meta Conversions API (CAPI) + GA4 + GTM',
    impact: 'Convierte el tráfico anónimo en audiencias de retargeting eterno'
  },
  {
    feature: 'Ingeniería Visual & Rendimiento',
    generic: 'Plantillas genéricas lentas (>3.5s) con botones idénticos a 10M de usuarios',
    universa: 'Diseño a medida con aceleración GPU a 60fps y carga en < 0.8 segundos',
    impact: 'Permite justificar tickets de precio 2x a 3x más altos'
  },
  {
    feature: 'Pasarelas de Pago Nativas',
    generic: 'Redirecciones externas torpes o transferencias manuales lentas',
    universa: 'Checkout nativo en 1 clic (Apple Pay, Google Pay, Stripe, Clover)',
    impact: 'Reduce el abandono de compra hasta en un 40%'
  },
  {
    feature: 'Indexación en Motores de IA',
    generic: 'Completamente invisible para ChatGPT Search, Perplexity y Google SGE',
    universa: 'Estructuración Schema JSON-LD completa para recomendación por IA local',
    impact: 'Aparece como respuesta destacada en búsquedas por IA'
  },
  {
    feature: 'Tasa de Conversión Promedio',
    generic: 'Entre 0.8% y 1.2% (Pérdida del 99% de los esfuerzos)',
    universa: 'Entre 3.8% y 7.5% (Optimizado con psicología de respuesta directa)',
    impact: 'Hasta 4x a 6x más clientes por la misma cantidad de visitas'
  }
];

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

  // Method & Titans State
  const [selectedTitan, setSelectedTitan] = useState<string>('hormozi');
  const [trafficSimMode, setTrafficSimMode] = useState<'traditional' | 'universa'>('universa');
  const [activeFunnelStage, setActiveFunnelStage] = useState<'cold' | 'warm' | 'hot'>('cold');
  const [activeObjectionIndex, setActiveObjectionIndex] = useState<number>(0);
  const [copiedScriptIndex, setCopiedScriptIndex] = useState<number | null>(null);

  // Ref for GSAP animations
  const metodoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'metodo' && metodoContainerRef.current) {
      const ctx = gsap.context(() => {
        gsap.from('.gsap-reveal', {
          y: 24,
          opacity: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out'
        });
      }, metodoContainerRef);

      return () => ctx.revert();
    }
  }, [activeTab]);

  const handleCopyScript = (scriptText: string, index: number) => {
    navigator.clipboard.writeText(scriptText);
    setCopiedScriptIndex(index);
    setTimeout(() => setCopiedScriptIndex(null), 2500);
  };

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
    <div className="min-h-screen bg-[#04100b] text-[#eaf6ee] font-sans selection:bg-[#2ee58f] selection:text-[#04100b] relative overflow-x-hidden">
      {/* Background Cosmic Grid Texture & Halos */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(140,245,198,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(140,245,198,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-70" />
        <div className="absolute top-[-10%] left-[-10%] w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle,rgba(46,229,143,0.09)_0%,transparent_70%)] blur-[90px]" />
        <div className="absolute top-[30%] right-[-15%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(122,63,242,0.12)_0%,transparent_70%)] blur-[110px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(53,208,194,0.06)_0%,transparent_70%)] blur-[90px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        
        {/* Top Header & Navigation */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-[rgba(140,245,198,0.12)]">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-medium text-[#9fb8ab] hover:text-[#2ee58f] transition-colors">
                ← Volver a /admin
              </Link>
              <span className="text-white/20">/</span>
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#2ee58f] bg-[rgba(4,16,11,0.8)] px-3 py-1 rounded-full border border-[rgba(140,245,198,0.22)] shadow-[0_0_12px_rgba(46,229,143,0.15)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2ee58f] animate-pulse" />
                Pipeline de Cierre & Ventas
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-white flex items-center gap-3">
              Universa Proposals Hub
              <span className="text-xs font-mono text-[#9fb8ab] border border-[rgba(140,245,198,0.2)] px-2.5 py-0.5 rounded-full bg-[rgba(4,16,11,0.6)]">v2.0</span>
            </h1>
            <p className="text-[#9fb8ab] text-sm sm:text-base mt-1.5 max-w-2xl font-light leading-relaxed">
              Control centralizado de propuestas comerciales enviadas, estado de contratos y manifiesto estratégico de cómo y por qué cotizamos sitios web.
            </p>
          </div>

          {/* Navigation Mode Tabs (Home Pill Style) */}
          <div className="flex items-center bg-[rgba(4,16,11,0.85)] p-1.5 rounded-full border border-[rgba(140,245,198,0.18)] self-start lg:self-auto shadow-2xl backdrop-blur-xl">
            <button
              onClick={() => setActiveTab('control')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'control'
                  ? 'bg-[#2ee58f] text-[#04100b] font-bold shadow-[0_0_20px_rgba(46,229,143,0.35)]'
                  : 'text-[#9fb8ab] hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Control ({proposalsList.length})
            </button>
            <button
              onClick={() => setActiveTab('metodo')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'metodo'
                  ? 'bg-[#2ee58f] text-[#04100b] font-bold shadow-[0_0_20px_rgba(46,229,143,0.35)]'
                  : 'text-[#9fb8ab] hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              ¿Cómo & Por Qué Vendemos?
            </button>
            <button
              onClick={() => setActiveTab('calculadora')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
                activeTab === 'calculadora'
                  ? 'bg-[#2ee58f] text-[#04100b] font-bold shadow-[0_0_20px_rgba(46,229,143,0.35)]'
                  : 'text-[#9fb8ab] hover:text-white hover:bg-white/5'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
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
          <div ref={metodoContainerRef} className="mt-8 space-y-16">
            
            {/* HERO MANIFESTO BENTO */}
            <div className="gsap-reveal relative rounded-[28px] p-8 sm:p-12 md:p-14 bg-gradient-to-b from-[rgba(255,255,255,0.03)] via-[rgba(4,16,11,0.7)] to-[#020a06] border border-[rgba(140,245,198,0.18)] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl">
              {/* Background grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(140,245,198,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(140,245,198,0.04)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none opacity-60 mask-radial" />
              
              <div className="max-w-4xl relative z-10">
                {/* Home style badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[rgba(4,16,11,0.8)] border border-[rgba(140,245,198,0.22)] text-[#2ee58f] text-[11px] font-bold uppercase tracking-[0.25em] mb-6 shadow-[0_0_15px_rgba(46,229,143,0.15)]">
                  <span className="w-2 h-2 rounded-full bg-[#2ee58f] animate-pulse shadow-[0_0_8px_#2ee58f]" />
                  Universa Growth Lab · Manifiesto de Cierre Estratégico
                </div>

                <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-[1.12] mb-6">
                  Por qué las marcas líderes compran <span className="text-[#2ee58f] bg-clip-text text-transparent bg-gradient-to-r from-[#8cf5c6] via-[#2ee58f] to-[#35d0c2]">Ecosistemas de Monetización</span> y no simples "páginas web"
                </h2>

                <p className="text-[#9fb8ab] text-base sm:text-lg md:text-xl leading-[1.7] max-w-3xl font-light mb-10">
                  Cualquiera puede ensamblar una plantilla básica en WordPress o Canva por $200. Nosotros construimos <strong>activos comerciales de adquisición y retención asimétrica</strong> con captura de datos de primer orden (First-Party Data), micro-motion a 60fps y tracking CAPI que transforman visitas anónimas en clientes recurrentes.
                </p>

                {/* Modular 4-Pillars Bento Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-[rgba(140,245,198,0.12)]">
                  <div className="p-4 rounded-2xl bg-[rgba(4,16,11,0.6)] border border-[rgba(140,245,198,0.14)] backdrop-blur-md hover:border-[rgba(140,245,198,0.35)] transition-all">
                    <div className="w-8 h-8 rounded-full bg-[#2ee58f]/10 text-[#2ee58f] flex items-center justify-center font-mono font-bold text-xs mb-3 border border-[#2ee58f]/30">
                      01
                    </div>
                    <div className="text-sm font-medium text-white mb-1">100% First-Party Data</div>
                    <div className="text-xs text-[#9fb8ab] leading-relaxed">Meta CAPI & GTM sin fugas de información.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[rgba(4,16,11,0.6)] border border-[rgba(140,245,198,0.14)] backdrop-blur-md hover:border-[rgba(140,245,198,0.35)] transition-all">
                    <div className="w-8 h-8 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center font-mono font-bold text-xs mb-3 border border-[#38bdf8]/30">
                      02
                    </div>
                    <div className="text-sm font-medium text-white mb-1">GPU 60fps Engine</div>
                    <div className="text-xs text-[#9fb8ab] leading-relaxed">Micro-motion y estatus que justifica tickets altos.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[rgba(4,16,11,0.6)] border border-[rgba(140,245,198,0.14)] backdrop-blur-md hover:border-[rgba(140,245,198,0.35)] transition-all">
                    <div className="w-8 h-8 rounded-full bg-[#a789ff]/10 text-[#a789ff] flex items-center justify-center font-mono font-bold text-xs mb-3 border border-[#a789ff]/30">
                      03
                    </div>
                    <div className="text-sm font-medium text-white mb-1">AI Search Schema</div>
                    <div className="text-xs text-[#9fb8ab] leading-relaxed">Optimizado para ChatGPT Search & Google SGE.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[rgba(4,16,11,0.6)] border border-[rgba(140,245,198,0.14)] backdrop-blur-md hover:border-[rgba(140,245,198,0.35)] transition-all">
                    <div className="w-8 h-8 rounded-full bg-[#f59e0b]/10 text-[#f59e0b] flex items-center justify-center font-mono font-bold text-xs mb-3 border border-[#f59e0b]/30">
                      04
                    </div>
                    <div className="text-sm font-medium text-white mb-1">1-Click Checkout</div>
                    <div className="text-xs text-[#9fb8ab] leading-relaxed">Apple Pay, Stripe y Clover con compra inmediata.</div>
                  </div>
                </div>
              </div>

              {/* Ambient Glows */}
              <div className="absolute right-[-10%] bottom-[-20%] w-[550px] h-[550px] bg-[#2ee58f]/10 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute top-[-20%] right-[10%] w-[400px] h-[400px] bg-[#7a3ff2]/12 rounded-full blur-[100px] pointer-events-none" />
            </div>

            {/* SECCIÓN 01: MATRIZ DE LOS 6 TITANES EN BENTO MODULAR */}
            <section className="gsap-reveal space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[rgba(140,245,198,0.12)]">
                <div>
                  <span className="font-bold italic uppercase tracking-[0.28em] text-[11px] text-[#2ee58f] block mb-2">
                    Framework Científico · Direct Response Titans
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-medium text-white tracking-tight">
                    La Matriz de los 6 Titanes del Marketing
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#9fb8ab] max-w-md font-light">
                  Cada pantalla y línea de código de Universa aplica las leyes matemáticas de los estrategas más influyentes del mundo.
                </p>
              </div>

              {/* Bento 3x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {titansData.map((titan, idx) => {
                  const Icon = titan.icon;
                  const isSelected = selectedTitan === titan.id;
                  return (
                    <div
                      key={titan.id}
                      onClick={() => setSelectedTitan(titan.id)}
                      className={`p-6 sm:p-7 rounded-[24px] border flex flex-col justify-between cursor-pointer transition-all duration-300 relative overflow-hidden group ${
                        isSelected
                          ? 'bg-gradient-to-b from-[#0c1f16] to-[#04100b] border-[#2ee58f] shadow-[0_0_30px_rgba(46,229,143,0.18)] translate-y-[-2px]'
                          : 'bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(4,16,11,0.6)] border-[rgba(140,245,198,0.12)] hover:border-[rgba(140,245,198,0.3)] hover:shadow-xl'
                      }`}
                    >
                      <div>
                        {/* Header Node */}
                        <div className="flex items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <span className="w-8 h-8 rounded-full bg-[#0a1a12] border border-[rgba(140,245,198,0.3)] text-[#2ee58f] flex items-center justify-center font-mono font-bold text-xs">
                              0{idx + 1}
                            </span>
                            <div>
                              <h4 className="text-base font-medium text-white group-hover:text-[#2ee58f] transition-colors">
                                {titan.name}
                              </h4>
                              <span className="text-[11px] text-[#9fb8ab] block">{titan.book}</span>
                            </div>
                          </div>

                          <div
                            className="w-8 h-8 rounded-xl flex items-center justify-center"
                            style={{
                              backgroundColor: `${titan.color}15`,
                              color: titan.color,
                              border: `1px solid ${titan.color}35`
                            }}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Tagline */}
                        <blockquote className="text-xs sm:text-sm text-white/90 italic font-serif leading-relaxed mb-4 border-l-2 border-[#2ee58f]/40 pl-3">
                          {titan.tagline}
                        </blockquote>

                        {/* Error vs Solution Visual Pills */}
                        <div className="space-y-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/20 text-red-200/90 leading-relaxed">
                            <span className="text-red-400 font-bold block mb-0.5">✕ El Error Mortal:</span>
                            {titan.reframe}
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#2ee58f]/10 border border-[#2ee58f]/20 text-white/90 leading-relaxed">
                            <span className="text-[#2ee58f] font-bold block mb-0.5">✓ En Universa:</span>
                            {titan.universaApp}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Metric */}
                      <div className="mt-5 pt-3 border-t border-[rgba(140,245,198,0.1)] flex items-center justify-between text-[11px]">
                        <span className="text-[#9fb8ab] font-medium">{titan.badge}</span>
                        <span className="font-mono font-bold text-[#2ee58f] bg-[#2ee58f]/10 px-2 py-0.5 rounded-md">
                          {titan.id === 'hormozi' ? '+320% ROI' : titan.id === 'brunson' ? '100% Data' : titan.id === 'suby' ? '97% Recuperado' : titan.id === 'kennedy' ? '24/7 Sales' : titan.id === 'schwartz' ? '3x Conversión' : '2.5x Ticket'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECCIÓN 02: DIAGRAMA DE FLUJO MODULAR - LA REGLA DEL 3% */}
            <section className="gsap-reveal rounded-[28px] p-8 sm:p-10 bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(2,10,6,0.8)] border border-[rgba(140,245,198,0.16)] backdrop-blur-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="font-bold italic uppercase tracking-[0.28em] text-[11px] text-[#2ee58f] block mb-1">
                    Diagrama de Flujo y Adquisición Omnicanal
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                    La Regla del 3% vs. La Trampa de la "Tierra Alquilada"
                  </h3>
                  <p className="text-xs sm:text-sm text-[#9fb8ab] mt-1 font-light">
                    Por qué centralizar tu tráfico en un Linktree o un Instagram DM te hace perder el 97% de tu inversión.
                  </p>
                </div>

                {/* Simulation Toggle */}
                <div className="flex items-center bg-[#020a06] p-1.5 rounded-2xl border border-[rgba(140,245,198,0.2)] shadow-xl self-start md:self-auto">
                  <button
                    onClick={() => setTrafficSimMode('traditional')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      trafficSimMode === 'traditional'
                        ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-lg'
                        : 'text-[#9fb8ab] hover:text-white'
                    }`}
                  >
                    ✕ Modo Linktree / DM
                  </button>
                  <button
                    onClick={() => setTrafficSimMode('universa')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      trafficSimMode === 'universa'
                        ? 'bg-[#2ee58f] text-[#04100b] shadow-[0_0_20px_rgba(46,229,143,0.4)]'
                        : 'text-[#9fb8ab] hover:text-white'
                    }`}
                  >
                    ✓ Ecosistema Universa
                  </button>
                </div>
              </div>

              {/* Visual Flowchart Diagram */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Node 1: Entry */}
                <div className="lg:col-span-3 p-6 rounded-[22px] bg-[#04100b] border border-[rgba(140,245,198,0.14)] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-7 h-7 rounded-full bg-[#38bdf8]/10 text-[#38bdf8] flex items-center justify-center font-bold text-xs border border-[#38bdf8]/30">
                        A
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#9fb8ab]">Entrada de Tráfico</span>
                    </div>
                    <div className="text-3xl font-black text-white font-mono mb-1">1,000</div>
                    <div className="text-xs text-[#2ee58f] font-semibold mb-2">Visitas Mensuales</div>
                    <p className="text-xs text-[#9fb8ab] leading-relaxed">
                      Procedentes de Instagram Reels, Stories, TikTok, anuncios o recomendaciones locales.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 text-[11px] font-mono text-[#38bdf8]">
                    100% Tráfico Inicial
                  </div>
                </div>

                {/* Node 2: The Core Split (Graphic Bars) */}
                <div className="lg:col-span-6 space-y-4">
                  {/* The 3% Hot Segment */}
                  <div className="p-5 rounded-[22px] bg-[#04100b] border border-[#2ee58f]/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#2ee58f]" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">3% · Compradores Inmediatos</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-[#2ee58f] bg-[#2ee58f]/10 px-2.5 py-0.5 rounded-md">
                        30 Ventas
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-2">
                      <div className="bg-[#2ee58f] h-full rounded-full w-[3%]" />
                    </div>
                    <p className="text-xs text-[#9fb8ab]">
                      Tienen alta urgencia y compran sin importar la plataforma.
                    </p>
                  </div>

                  {/* The 97% Critical Leak vs Capture */}
                  <div className={`p-5 rounded-[22px] border transition-all duration-300 ${
                    trafficSimMode === 'traditional'
                      ? 'bg-red-950/20 border-red-500/30'
                      : 'bg-[#061910] border-[#38bdf8]/40 shadow-[0_0_25px_rgba(56,189,248,0.12)]'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${trafficSimMode === 'traditional' ? 'bg-red-400' : 'bg-[#38bdf8]'}`} />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">97% · Visitantes Indecisos (970 Personas)</span>
                      </div>
                      <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-md ${
                        trafficSimMode === 'traditional' ? 'text-red-400 bg-red-500/10' : 'text-[#38bdf8] bg-[#38bdf8]/10'
                      }`}>
                        970 Prospectos
                      </span>
                    </div>

                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mb-3">
                      <div className={`h-full rounded-full w-[97%] transition-all duration-500 ${
                        trafficSimMode === 'traditional' ? 'bg-red-500' : 'bg-gradient-to-r from-[#38bdf8] to-[#2ee58f]'
                      }`} />
                    </div>

                    <p className="text-xs text-[#9fb8ab] leading-relaxed">
                      {trafficSimMode === 'traditional'
                        ? '✕ Sin píxel propio ni dominio oficial. Los 970 usuarios se van sin dejar rastro (0% First-Party Data). El dinero se pierde para siempre.'
                        : '✓ El 100% queda registrado por Meta Conversions API (CAPI) y Google Tag Manager. Se crean 50,000 clones en Lookalikes y se activan campañas de retargeting de $0.15/click que recuperan +145 ventas.'}
                    </p>
                  </div>
                </div>

                {/* Node 3: Resulting Capital Balance */}
                <div className={`lg:col-span-3 p-6 rounded-[22px] border flex flex-col justify-between transition-all duration-300 ${
                  trafficSimMode === 'traditional'
                    ? 'bg-[#140808] border-red-500/30'
                    : 'bg-gradient-to-b from-[#0c1f16] to-[#04100b] border-[#2ee58f]/40 shadow-2xl'
                }`}>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#9fb8ab] block mb-1">
                      Retorno Comercial Final
                    </span>
                    <div className={`text-4xl font-black font-mono mb-1 ${
                      trafficSimMode === 'traditional' ? 'text-red-400' : 'text-[#2ee58f]'
                    }`}>
                      {trafficSimMode === 'traditional' ? '30 Clientes' : '175 Clientes'}
                    </div>
                    <div className="text-xs font-semibold text-white/80 mb-2">
                      {trafficSimMode === 'traditional' ? 'Tasa de Conversión: 3%' : 'Tasa de Conversión Total: 17.5%'}
                    </div>
                    <p className="text-xs text-[#9fb8ab] leading-relaxed">
                      {trafficSimMode === 'traditional'
                        ? 'Estás trabajando y gastando tiempo para regalarle tu audiencia al algoritmo de Meta.'
                        : 'Activo digital de alto rendimiento. Multiplicador de 5.8x sobre la misma cantidad de visitas.'}
                    </p>
                  </div>

                  <div className={`mt-4 pt-3 border-t text-xs font-bold ${
                    trafficSimMode === 'traditional' ? 'border-red-500/20 text-red-400' : 'border-[#2ee58f]/20 text-[#2ee58f]'
                  }`}>
                    {trafficSimMode === 'traditional' ? '✕ Pérdida del 97% de Clientes' : '✓ Dominio de Mercado y Retención'}
                  </div>
                </div>
              </div>
            </section>

            {/* SECCIÓN 03: EL EMBUDO TÉRMICO 3D EN FORMATO BENTO */}
            <section className="gsap-reveal space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[rgba(140,245,198,0.12)]">
                <div>
                  <span className="font-bold italic uppercase tracking-[0.28em] text-[11px] text-[#2ee58f] block mb-2">
                    Segmentación Psicológica · Eugene Schwartz Framework
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-medium text-white tracking-tight">
                    El Embudo Térmico & Automatización de Eventos CAPI
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#9fb8ab] max-w-md font-light">
                  Un prospecto frío necesita autoridad; un prospecto tibio necesita eliminar dudas; un prospecto caliente necesita checkout en 1 clic.
                </p>
              </div>

              {/* 3 Columns Thermal Bento */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Cold Thermal Card */}
                <div
                  onClick={() => setActiveFunnelStage('cold')}
                  className={`p-7 rounded-[26px] border flex flex-col justify-between transition-all cursor-pointer ${
                    activeFunnelStage === 'cold'
                      ? 'bg-gradient-to-b from-[#081822] to-[#04100b] border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.2)] translate-y-[-2px]'
                      : 'bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(4,16,11,0.6)] border-[rgba(140,245,198,0.12)] hover:border-sky-400/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-400 bg-sky-400/10 px-3 py-1 rounded-full border border-sky-400/30">
                        <Snowflake className="w-3.5 h-3.5" />
                        Tráfico Frío (Cold)
                      </span>
                      <span className="font-mono text-xs text-[#9fb8ab]">Nivel 1</span>
                    </div>

                    <h4 className="text-lg font-medium text-white mb-2">Captura de Identidad & Huella</h4>
                    <p className="text-xs text-[#9fb8ab] leading-relaxed mb-4">
                      Personas que nunca han escuchado de ti. Al aterrizar en tu dominio, el Píxel Server-Side registra su ID de Meta/Google y geolocalización sin demora (&lt;0.8s).
                    </p>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-sky-300 space-y-1 mb-4">
                      <div className="text-[10px] text-white/40 uppercase font-sans">Evento CAPI Disparado:</div>
                      <div>PageView + UserParams</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[rgba(140,245,198,0.1)] text-xs text-sky-400 font-semibold">
                    → Creación de Lookalikes al 1% (50,000 Clones)
                  </div>
                </div>

                {/* Warm Thermal Card */}
                <div
                  onClick={() => setActiveFunnelStage('warm')}
                  className={`p-7 rounded-[26px] border flex flex-col justify-between transition-all cursor-pointer ${
                    activeFunnelStage === 'warm'
                      ? 'bg-gradient-to-b from-[#1c1608] to-[#04100b] border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.2)] translate-y-[-2px]'
                      : 'bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(4,16,11,0.6)] border-[rgba(140,245,198,0.12)] hover:border-amber-400/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                        <Sun className="w-3.5 h-3.5" />
                        Tráfico Tibio (Warm)
                      </span>
                      <span className="font-mono text-xs text-[#9fb8ab]">Nivel 2</span>
                    </div>

                    <h4 className="text-lg font-medium text-white mb-2">Detección de Intención & Retención</h4>
                    <p className="text-xs text-[#9fb8ab] leading-relaxed mb-4">
                      Prospectos que vieron tu carta, cotizaron un servicio o leyeron reseñas. El sistema detecta scroll &gt; 60% y añade al carrito.
                    </p>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-amber-300 space-y-1 mb-4">
                      <div className="text-[10px] text-white/40 uppercase font-sans">Evento CAPI Disparado:</div>
                      <div>ViewContent + AddToCart</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[rgba(140,245,198,0.1)] text-xs text-amber-400 font-semibold">
                    → Retargeting Dinámico (ROAS 4.5x)
                  </div>
                </div>

                {/* Hot Thermal Card */}
                <div
                  onClick={() => setActiveFunnelStage('hot')}
                  className={`p-7 rounded-[26px] border flex flex-col justify-between transition-all cursor-pointer ${
                    activeFunnelStage === 'hot'
                      ? 'bg-gradient-to-b from-[#0c1f16] to-[#04100b] border-[#2ee58f] shadow-[0_0_30px_rgba(46,229,143,0.25)] translate-y-[-2px]'
                      : 'bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(4,16,11,0.6)] border-[rgba(140,245,198,0.12)] hover:border-[#2ee58f]/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#2ee58f] bg-[#2ee58f]/10 px-3 py-1 rounded-full border border-[#2ee58f]/30">
                        <Flame className="w-3.5 h-3.5" />
                        Tráfico Caliente (Hot)
                      </span>
                      <span className="font-mono text-xs text-[#9fb8ab]">Nivel 3</span>
                    </div>

                    <h4 className="text-lg font-medium text-white mb-2">1-Click Checkout & Maximización de LTV</h4>
                    <p className="text-xs text-[#9fb8ab] leading-relaxed mb-4">
                      Compra en 1 segundo con Apple Pay o Clover sin formularios innecesarios. Sincroniza al CRM y ofrece One-Click Upsells automáticos.
                    </p>

                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 font-mono text-[11px] text-[#2ee58f] space-y-1 mb-4">
                      <div className="text-[10px] text-white/40 uppercase font-sans">Evento CAPI Disparado:</div>
                      <div>Purchase + HighLTVTag</div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[rgba(140,245,198,0.1)] text-xs text-[#2ee58f] font-semibold">
                    → Incremento del Ticket Promedio (+20% a +35%)
                  </div>
                </div>
              </div>
            </section>

            {/* SECCIÓN 04: MATRIZ DE GUERRA DE ESTATUS (BATTLE CARDS) */}
            <section className="gsap-reveal space-y-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-2 border-b border-[rgba(140,245,198,0.12)]">
                <div>
                  <span className="font-bold italic uppercase tracking-[0.28em] text-[11px] text-[#2ee58f] block mb-2">
                    Destrucción de Commodity · Dan Kennedy & David Ogilvy
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-medium text-white tracking-tight">
                    Matriz de Estatus: Enlace Genérico vs. Ecosistema Universa
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#9fb8ab] max-w-md font-light">
                  La ingeniería visual y la infraestructura técnica son las que permiten cobrar tickets altos en el mercado estadounidense.
                </p>
              </div>

              <div className="space-y-3.5">
                {comparisonDimensions.map((dim, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-[22px] bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[rgba(4,16,11,0.6)] border border-[rgba(140,245,198,0.12)] hover:border-[rgba(140,245,198,0.28)] transition-all grid grid-cols-1 lg:grid-cols-12 gap-4 items-center"
                  >
                    <div className="lg:col-span-3">
                      <div className="text-xs font-bold text-white uppercase tracking-wider">{dim.feature}</div>
                      <div className="text-[11px] text-[#2ee58f] mt-0.5 font-medium">{dim.impact}</div>
                    </div>

                    <div className="lg:col-span-4 p-3.5 rounded-xl bg-red-950/20 border border-red-500/20 text-xs text-white/70">
                      <div className="text-red-400 font-bold mb-1 flex items-center gap-1.5">
                        <span>✕</span> Enlace Genérico / $200
                      </div>
                      <p>{dim.generic}</p>
                    </div>

                    <div className="lg:col-span-5 p-3.5 rounded-xl bg-[#0c1a13] border border-[#2ee58f]/30 text-xs text-white/95 shadow-[0_0_20px_rgba(46,229,143,0.06)]">
                      <div className="text-[#2ee58f] font-bold mb-1 flex items-center gap-1.5">
                        <span>✓</span> Ecosistema Universa Growth Lab
                      </div>
                      <p>{dim.universa}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* SECCIÓN 05: ARSENAL DEL CLOSER (TERMINAL DE CIERRE DE OBJECIONES) */}
            <section className="gsap-reveal rounded-[28px] p-8 sm:p-10 bg-gradient-to-br from-[#0c1b14] via-[#07130d] to-[#020a06] border border-[#2ee58f]/40 shadow-2xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="font-bold italic uppercase tracking-[0.28em] text-[11px] text-[#2ee58f] block mb-1">
                    Playbook de Negociación en Vivo · Chris Voss & Alex Hormozi
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-medium text-white tracking-tight">
                    Arsenal de Cierre en Llamadas & WhatsApp
                  </h3>
                  <p className="text-xs text-[#9fb8ab] mt-0.5 font-light">
                    Guiones exactos de reencuadre financiero para cerrar propuestas de alto valor al instante.
                  </p>
                </div>

                <div className="text-[11px] font-mono text-[#2ee58f] bg-[#2ee58f]/10 border border-[#2ee58f]/30 px-3 py-1.5 rounded-xl self-start md:self-auto">
                  Click en un botón para copiar el script
                </div>
              </div>

              {/* Objection Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                {closingObjections.map((obj, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveObjectionIndex(idx)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      activeObjectionIndex === idx
                        ? 'bg-[#13221b] border-[#2ee58f] text-white shadow-[0_0_20px_rgba(46,229,143,0.25)]'
                        : 'bg-[#04100b] border-[rgba(140,245,198,0.12)] text-[#9fb8ab] hover:text-white hover:border-[rgba(140,245,198,0.25)]'
                    }`}
                  >
                    <div className="text-xs font-bold text-white truncate mb-1">
                      {obj.title.split(':')[0]}
                    </div>
                    <div className="text-[11px] text-[#9fb8ab] truncate">
                      {obj.title.split(':')[1]}
                    </div>
                  </button>
                ))}
              </div>

              {/* Active Objection Terminal Box */}
              {(() => {
                const currentObj = closingObjections[activeObjectionIndex];
                return (
                  <div className="bg-[#04100b] rounded-[24px] p-6 sm:p-8 border border-[rgba(140,245,198,0.18)] space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(140,245,198,0.1)] pb-4">
                      <div>
                        <span className="text-xs font-bold text-[#2ee58f] uppercase tracking-wider block mb-1">
                          {currentObj.psychology}
                        </span>
                        <h4 className="text-lg sm:text-xl font-medium text-white">
                          "{currentObj.clientSay}"
                        </h4>
                      </div>

                      <button
                        onClick={() => handleCopyScript(currentObj.closerScript, activeObjectionIndex)}
                        className="inline-flex items-center justify-center gap-2 bg-[#2ee58f] hover:bg-[#28c77c] text-[#04100b] text-xs font-bold py-2.5 px-5 rounded-full transition-all shadow-[0_0_15px_rgba(46,229,143,0.3)] self-start sm:self-auto"
                      >
                        {copiedScriptIndex === activeObjectionIndex ? (
                          <>
                            <Check className="w-4 h-4 text-[#04100b]" />
                            ¡Script Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" />
                            Copiar Script al Portapapeles
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-black/50 p-6 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-bold text-[#9fb8ab] uppercase tracking-widest block mb-2 font-mono">
                        Guion de Respuesta Recomendado:
                      </span>
                      <p className="text-xs sm:text-sm text-white/90 whitespace-pre-line leading-[1.75] font-sans">
                        {currentObj.closerScript}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentObj.bulletPoints.map((bp, i) => (
                        <div key={i} className="p-3.5 rounded-xl bg-white/5 border border-white/5 text-[11px] text-[#9fb8ab] leading-relaxed">
                          ✓ {bp}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </section>

            {/* SECCIÓN 06: ROADMAP EN 3 FASES MODULARES & CTA */}
            <section className="gsap-reveal rounded-[28px] p-8 sm:p-10 bg-gradient-to-b from-[rgba(255,255,255,0.02)] to-[#020a06] border border-[rgba(140,245,198,0.16)] backdrop-blur-xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-9 h-9 rounded-full bg-[#0a1a12] border border-[rgba(140,245,198,0.3)] text-[#2ee58f] flex items-center justify-center font-bold text-xs font-mono">
                  06
                </span>
                <div>
                  <h3 className="text-2xl font-medium text-white tracking-tight">
                    Formato Estándar de Cotización en 3 Fases Modulares
                  </h3>
                  <p className="text-xs text-[#9fb8ab]">Desglose transparente que permite al cliente contratar por etapas o adquirir el ecosistema 360°</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                <div className="p-6 rounded-[22px] bg-[#04100b] border border-[rgba(140,245,198,0.14)] flex flex-col justify-between hover:border-[rgba(140,245,198,0.35)] transition-all">
                  <div>
                    <span className="text-xs font-bold text-[#2ee58f] uppercase tracking-wider block mb-1">Fase 01</span>
                    <h4 className="text-base font-medium text-white mb-2">Core Web & UX/UI Mobile</h4>
                    <p className="text-xs text-[#9fb8ab] leading-relaxed mb-4">
                      Diseño a medida, catálogo interactivo, velocidad &lt; 0.8s y pasarelas nativas (Apple Pay, Stripe).
                    </p>
                  </div>
                  <div className="font-mono text-sm font-bold text-[#2ee58f] bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 self-start">
                    $600 – $1,200 USD
                  </div>
                </div>

                <div className="p-6 rounded-[22px] bg-[#04100b] border border-[rgba(140,245,198,0.14)] flex flex-col justify-between hover:border-[rgba(140,245,198,0.35)] transition-all">
                  <div>
                    <span className="text-xs font-bold text-[#a789ff] uppercase tracking-wider block mb-1">Fase 02</span>
                    <h4 className="text-base font-medium text-white mb-2">Producción UGC & Audiovisual</h4>
                    <p className="text-xs text-[#9fb8ab] leading-relaxed mb-4">
                      Fotografía de producto en bloque, videos UGC para TikTok/Reels y optimización visual de Instagram.
                    </p>
                  </div>
                  <div className="font-mono text-sm font-bold text-[#a789ff] bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 self-start">
                    $350 – $800 USD
                  </div>
                </div>

                <div className="p-6 rounded-[22px] bg-[#04100b] border border-[rgba(140,245,198,0.14)] flex flex-col justify-between hover:border-[rgba(140,245,198,0.35)] transition-all">
                  <div>
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-1">Fase 03</span>
                    <h4 className="text-base font-medium text-white mb-2">Tracking CAPI & Retargeting</h4>
                    <p className="text-xs text-[#9fb8ab] leading-relaxed mb-4">
                      Meta Pixel Server-Side, Google Tag Manager, recuperación de carritos y creación de Lookalikes.
                    </p>
                  </div>
                  <div className="font-mono text-sm font-bold text-sky-400 bg-black/40 px-3 py-1.5 rounded-lg border border-white/5 self-start">
                    $300 – $600 USD
                  </div>
                </div>
              </div>

              {/* Action Banner to Calculator */}
              <div className="mt-8 p-6 rounded-[22px] bg-gradient-to-r from-[#0c1f16] to-[#04100b] border border-[rgba(140,245,198,0.25)] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-medium text-white">¿Listo para estructurar una propuesta en vivo?</h4>
                  <p className="text-xs text-[#9fb8ab]">Usa nuestro cotizador paramétrico para calcular precios y paquetes modulares en segundos.</p>
                </div>
                <button
                  onClick={() => setActiveTab('calculadora')}
                  className="inline-flex items-center gap-2 bg-[#2ee58f] hover:bg-[#28c77c] text-[#04100b] font-bold text-xs py-3 px-6 rounded-full transition-all shadow-[0_0_20px_rgba(46,229,143,0.3)] whitespace-nowrap"
                >
                  <Calculator className="w-4 h-4" />
                  Ir al Cotizador Rápido →
                </button>
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
