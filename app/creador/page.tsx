'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Settings, 
  Zap, 
  Image as ImageIcon, 
  Cpu, 
  Layout, 
  Share2, 
  MessageSquare,
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  ChevronDown,
  Sparkles,
  MousePointer2,
  CheckCircle2,
  RefreshCcw,
  Globe,
  PlusCircle,
  FileText,
  Palette,
  MapPin,
  Link as LinkIcon,
  X
} from 'lucide-react';
import PostPreview from '@/app/components/creador/PostPreview';
import { getPromptForFormat } from '@/lib/creador/prompts';

export default function ElCreadorDashboardV2() {
  const [platform, setPlatform] = useState<'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK' | 'OMNI'>('INSTAGRAM');
  const [client, setClient] = useState('Universa Agency');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showBriefModal, setShowBriefModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  
  // Client Briefing State
  const [briefing, setBriefing] = useState({
    businessName: 'Universa Agency',
    brief: 'Somos una agencia de automatización y marketing de alto rendimiento. Ayudamos a negocios a escalar con IA.',
    brandColors: '#39FF14, #050505',
    address: 'Remote / Global',
    viralLinks: ''
  });

  const [copyVariants, setCopyVariants] = useState<string[]>([
    "Descubre el poder de la automatización con Universa. 🚀 Optimizamos tus procesos para que te enfoques en crecer. #Growth #Automation",
    "¿Cansado de perder tiempo en tareas repetitivas? Deja que Universa se encargue de la eficiencia de tu negocio. ⚡️",
    "Soluciones a medida para negocios del futuro. Universa: donde la ingeniería se une con el marketing. 💎"
  ]);

  const stats = [
    { label: 'Avg Engagement', value: '4.8%', icon: <TrendingUp className="w-4 h-4" /> },
    { label: 'Total Reach', value: '124.5K', icon: <Globe className="w-4 h-4" /> },
    { label: 'Content Score', value: '92/100', icon: <Zap className="w-4 h-4" /> }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate Gemini API call with Master Prompts
    const prompt = getPromptForFormat(platform === 'OMNI' ? 'CAROUSEL' : platform as any, briefing);
    console.log('Generating with Master Prompt:', prompt);
    
    setTimeout(() => {
      setIsGenerating(false);
      // In a real scenario, this would come from Gemini
      setCopyVariants([
        `[VARIANTE 1 - EDUCATIVA]\n${briefing.brief.substring(0, 50)}... ¿Sabías que podías automatizar el 80% de tus tareas? con ${briefing.businessName} lo logramos.`,
        `[VARIANTE 2 - VIRAL]\n${briefing.businessName} está rompiendo el mercado. Mira cómo lo logramos desde ${briefing.address}.`,
        `[VARIANTE 3 - VENTA]\nListo para escalar? Únete a la élite con ${briefing.businessName}. Colores de marca: ${briefing.brandColors}`
      ]);
    }, 2000);
  };

  return (
    <div className="h-screen w-full bg-[#050505] text-white flex flex-col overflow-hidden font-inter selection:bg-[#39FF14]/30">
      
      {/* Upper Logic Bar: Context & Platform Selector */}
      <div className="h-20 border-b border-[#1f2937] bg-black/40 backdrop-blur-2xl px-10 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#39FF14] flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.2)]">
                 <Zap className="w-5 h-5 text-black" fill="black" />
              </div>
              <h1 className="text-xl font-black tracking-tighter uppercase italic">El Creador <span className="text-[#39FF14] ml-1">Agent</span></h1>
           </div>
           
           <div className="h-8 w-[1px] bg-white/10" />

           {/* Context Selector & Briefing Action */}
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/5 rounded-xl transition-all">
                <div className="w-2 h-2 rounded-full bg-[#39FF14] animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">{client}</span>
              </div>
              <button 
                onClick={() => setShowBriefModal(true)}
                className="p-2.5 bg-white/5 border border-white/5 rounded-xl hover:border-[#39FF14]/50 text-zinc-500 hover:text-[#39FF14] transition-all"
              >
                <Settings className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-1 bg-white/5 border border-white/5 p-1 rounded-2xl">
           {['OMNI', 'INSTAGRAM', 'FACEBOOK', 'TIKTOK'].map((p: any) => (
             <button 
               key={p}
               onClick={() => setPlatform(p)}
               className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                 platform === p ? 'bg-[#39FF14] text-black shadow-lg' : 'text-zinc-500 hover:text-white'
               }`}
             >
               {p}
             </button>
           ))}
        </div>

        <div className="flex items-center gap-4">
           <button className="px-6 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <Calendar className="w-4 h-4" /> Schedule Queue
           </button>
        </div>
      </div>

      {/* Main Experience: La Fábrica (3 Columns) */}
      <main className="flex-1 overflow-hidden grid grid-cols-12 relative">
        
        {/* Column 1: LA FUENTE (Assets) */}
        <section className="col-span-3 border-r border-[#1f2937] flex flex-col bg-[#070708]">
           <div className="p-8 border-b border-[#1f2937] flex items-center justify-between">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Asset Source (Drive)</h3>
              <PlusCircle className="w-4 h-4 text-zinc-700 cursor-pointer" />
           </div>
           <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-4">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div 
                  key={i}
                  onClick={() => setSelectedAsset(`https://picsum.photos/seed/asset${i}/800/800`)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all ${
                    selectedAsset === `https://picsum.photos/seed/asset${i}/800/800` ? 'border-[#39FF14]' : 'border-transparent opacity-40 hover:opacity-100'
                  }`}
                >
                   <img src={`https://picsum.photos/seed/asset${i}/400/400`} alt="Drive Asset" className="w-full h-full object-cover" />
                </div>
              ))}
           </div>
        </section>

        {/* Column 2: EL AGENTE (Production) */}
        <section className="col-span-5 border-r border-[#1f2937] flex flex-col relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,rgba(57,255,20,0.03),transparent_50%)]">
           <div className="p-8 border-b border-[#1f2937] space-y-4">
              <div className="flex items-center justify-between font-black uppercase tracking-widest text-[9px]">
                 <span className="text-zinc-600">Processing Engine</span>
                 <span className="text-[#39FF14]">Gemini 2.5 Flash</span>
              </div>
              <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[3rem] text-center space-y-6">
                 <div className="flex justify-center -space-x-4 mb-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-[#050505] overflow-hidden">
                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
                      </div>
                    ))}
                 </div>
                 <h2 className="text-2xl font-black italic tracking-tighter italic">La Fábrica</h2>
                 <p className="text-zinc-500 text-[10px] font-bold leading-relaxed px-10 italic uppercase tracking-[0.2em]">
                    {selectedAsset ? "Utilizando Master Prompts para generar variaciones de alto impacto..." : "Selecciona un activo de Drive para iniciar."}
                 </p>
                 <button 
                  onClick={handleGenerate}
                  disabled={!selectedAsset || isGenerating}
                  className="w-full py-4 bg-[#39FF14] text-black font-black rounded-2xl text-[10px] uppercase tracking-widest disabled:opacity-20 transition-all hover:scale-[1.02] shadow-[0_0_30px_rgba(57,255,20,0.2)]"
                 >
                    {isGenerating ? "Generando Magia..." : `Generar ${platform} Content`}
                 </button>
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar-premium">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800 italic">Approval & Copywriting</h4>
              
              <AnimatePresence>
                {copyVariants.map((variant, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] relative group hover:border-[#39FF14]/30 transition-all"
                  >
                     <p className="text-xs font-bold leading-relaxed text-zinc-400 italic mb-8">{variant}</p>
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <button className="px-4 py-2 bg-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-[#39FF14] hover:bg-[#39FF14]/10 transition-all">Editar</button>
                        </div>
                        <button className="px-6 py-2 bg-[#39FF14] text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                           Aprobar
                        </button>
                     </div>
                  </motion.div>
                ))}
              </AnimatePresence>
           </div>
        </section>

        {/* Column 3: EL RESULTADO (Performance & Preview) */}
        <section className="col-span-4 flex flex-col bg-[#050505]">
           <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar-premium">
              
              {/* KPIs (Resultados) */}
              <div className="space-y-6">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Analytics Monitoring</h3>
                 <div className="grid grid-cols-1 gap-4">
                    {stats.map((stat, i) => (
                      <div key={i} className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-[#39FF14]/20 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-600 group-hover:text-[#39FF14] transition-colors">{stat.icon}</div>
                            <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{stat.label}</span>
                         </div>
                         <span className="text-xl font-black italic">{stat.value}</span>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Mockup Preview */}
              <div className="space-y-8">
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Phone Mockup Projection</h3>
                 <PostPreview 
                    platform={platform === 'OMNI' ? 'INSTAGRAM' : platform as any} 
                    image={selectedAsset || 'https://picsum.photos/seed/placeholder/800/800'} 
                    copy={copyVariants[0]}
                    clientName={client}
                 />
              </div>

           </div>
        </section>

      </main>

      {/* Briefing Modal Overlay */}
      <AnimatePresence>
        {showBriefModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBriefModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0a0a0a] border border-[#1f2937] rounded-[3rem] p-12 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-[#39FF14]/5 blur-[100px] -mr-40 -mt-40 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-[#39FF14]/10 border border-[#39FF14]/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#39FF14]" />
                   </div>
                   <div>
                      <h2 className="text-2xl font-black italic tracking-tighter italic">Client Briefing</h2>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Configuración de Marca</p>
                   </div>
                </div>
                <button onClick={() => setShowBriefModal(false)} className="p-3 bg-white/5 rounded-full text-zinc-500 hover:text-white transition-all">
                   <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">Brief del Proyecto / Negocio</label>
                   <textarea 
                    value={briefing.brief}
                    onChange={(e) => setBriefing({...briefing, brief: e.target.value})}
                    className="w-full h-32 bg-white/[0.03] border border-white/5 rounded-[1.5rem] p-6 text-sm font-medium focus:border-[#39FF14]/50 outline-none resize-none transition-all" 
                    placeholder="Describe lo que hace el cliente..."
                   />
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">Colores de Marca</label>
                      <div className="relative">
                         <Palette className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                         <input 
                           type="text" 
                           value={briefing.brandColors}
                           onChange={(e) => setBriefing({...briefing, brandColors: e.target.value})}
                           className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold focus:border-[#39FF14]/50 outline-none transition-all"
                         />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">Ubicación / Dirección</label>
                      <div className="relative">
                         <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                         <input 
                           type="text"
                           value={briefing.address}
                           onChange={(e) => setBriefing({...briefing, address: e.target.value})}
                           className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold focus:border-[#39FF14]/50 outline-none transition-all"
                         />
                      </div>
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-4">Inspiración (Viral Reference Links)</label>
                   <div className="relative">
                      <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                      <input 
                        type="text"
                        value={briefing.viralLinks}
                        onChange={(e) => setBriefing({...briefing, viralLinks: e.target.value})}
                        className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold focus:border-[#39FF14]/50 outline-none transition-all"
                        placeholder="https://tiktok.com/@viral-video-link"
                      />
                   </div>
                </div>

                <button 
                  onClick={() => setShowBriefModal(false)}
                  className="w-full py-5 bg-[#39FF14] text-black font-black rounded-2xl text-[10px] uppercase tracking-widest mt-10 hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(57,255,20,0.1)]"
                >
                  Guardar Configuración
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.02] z-0" style={{ 
        backgroundImage: `radial-gradient(#ffffff 0.5px, transparent 0.5px)`, 
        backgroundSize: '24px 24px' 
      }}></div>
    </div>
  );
}

function MiniMetric({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-white/5 border border-white/5 p-5 rounded-[2rem] text-center">
       <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600 mb-1">{label}</p>
       <p className={`text-xl font-black tracking-tighter ${color}`}>{value}</p>
    </div>
  );
}
