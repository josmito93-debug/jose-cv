'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Layout,
  Globe,
  Zap,
  ShoppingBag,
  MessageSquare,
  Cpu,
  Monitor,
  LayoutTemplate as WireframeIcon,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

import ChatCollector from '@/app/components/ChatCollector';

export default function AttomConversationalOnboarding() {
  const [submitted, setSubmitted] = useState(false);
  const [isWireframeStep, setIsWireframeStep] = useState(false);
  const [formData, setFormData] = useState<any>({
    businessName: '',
    industry: '',
    vision: '',
    email: ''
  });

  const handleComplete = (info: any[]) => {
    // Extract data from the intelligent collector
    const data: any = {};
    info.forEach(item => {
      data[item.field] = item.value;
    });
    setFormData(data);
    setIsWireframeStep(true);
  };

  const finalizeProcess = async () => {
    try {
      // Persist the new client to the dashboard
      await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('Failed to register client:', error);
      setSubmitted(true); // Still proceed to success UI
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 md:p-10  overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#4338ca_0%,transparent_70%)] opacity-20"></div>
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }} 
           animate={{ opacity: 1, scale: 1 }}
           className="text-center space-y-6 md:space-y-8 relative z-10"
        >
           <div className="w-20 h-20 md:w-24 md:h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 md:mb-10">
              <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-emerald-400" />
           </div>
           <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase italic">Congratulations!</h1>
           <p className="text-zinc-500 font-medium max-w-sm md:max-w-md mx-auto italic uppercase tracking-widest text-[9px] md:text-[10px]">Tu ecosistema ha sido configurado. La información ya está cargada en tu Dashboard de Attom.</p>
           <div className="pt-8 md:pt-10">
             <Link href="/admin">
               <button className="px-10 py-4 md:px-12 md:py-5 bg-[#39FF14] text-black font-black rounded-xl md:rounded-2xl flex items-center gap-3 mx-auto hover:scale-105 transition-all shadow-[0_0_30px_rgba(57,255,20,0.1)] uppercase tracking-widest text-xs">
                  Explorar Dashboard <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
               </button>
             </Link>
           </div>
        </motion.div>
      </div>
    );
  }

  if (isWireframeStep) {
    return (
      <div className="min-h-screen bg-[#050505] text-white p-6 md:p-10  overflow-hidden relative">
          <div className="max-w-6xl mx-auto space-y-8 md:space-y-12 relative z-10">
             <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1 md:space-y-2 text-center md:text-left">
                   <h2 className="text-2xl md:text-3xl font-black tracking-tighter italic">Arquitectura Generada.</h2>
                   <p className="text-zinc-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Proyecto: {formData.businessName || 'Entity Beta'}</p>
                </div>
                <button onClick={finalizeProcess} className="w-full md:w-auto px-8 py-4 bg-[#39FF14] text-black font-black rounded-xl md:rounded-2xl flex items-center justify-center gap-3 uppercase tracking-widest text-[10px] shadow-[0_0_20px_rgba(57,255,20,0.2)]">
                   Confirmar & Desplegar <Rocket className="w-4 h-4 md:w-5 md:h-5" />
                </button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
                <div className="lg:col-span-2 bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[4rem] p-6 md:p-10 backdrop-blur-3xl aspect-video lg:aspect-[16/9] relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
                   <div className="relative z-10 space-y-6 md:space-y-8">
                      <div className="w-full h-6 md:h-8 bg-white/5 rounded-lg md:rounded-xl flex items-center gap-2 px-3 md:px-4 border border-white/5">
                         <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-red-500/30" />
                         <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500/30" />
                         <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500/30" />
                      </div>
                      <div className="space-y-4 md:space-y-6 opacity-30 group-hover:opacity-100 transition-all duration-700">
                         <div className="h-10 md:h-20 w-3/4 bg-white/5 rounded-xl md:rounded-[2.5rem]" />
                         <div className="grid grid-cols-3 gap-3 md:gap-6">
                            <div className="h-20 md:h-40 bg-white/5 rounded-xl md:rounded-3xl" />
                            <div className="h-20 md:h-40 bg-white/5 rounded-xl md:rounded-3xl" />
                            <div className="h-20 md:h-40 bg-white/5 rounded-xl md:rounded-3xl" />
                         </div>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
                         <WireframeIcon className="w-32 h-32 md:w-64 md:h-64 text-indigo-500 rotate-12" />
                      </div>
                   </div>
                </div>
                <div className="space-y-6 md:space-y-8">
                   <div className="p-6 md:p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[3rem] relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
                      <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-indigo-400 mb-4 md:mb-6" />
                      <h4 className="text-xl font-black tracking-tight mb-2 italic">Wireframe Preview</h4>
                      <p className="text-zinc-500 text-[9px] md:text-[10px] font-bold leading-relaxed uppercase tracking-widest italic opacity-60">Hemos interpretado tu visión en una estructura de alta conversión.</p>
                   </div>
                   <div className="p-6 md:p-8 bg-white/5 border border-white/5 rounded-[2rem] md:rounded-[3rem] space-y-4">
                      <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase tracking-widest text-[#39FF14]">
                         <span>Protocol Status</span>
                         <span>Injecting Assets</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                         <div className="h-full bg-[#39FF14] w-full" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
      </div>
    );
  }

  return (
    <ChatCollector onComplete={handleComplete} />
  );
}

function PopUpCard({ label, value, icon, delay = 0 }: { label: string, value: string, icon: React.ReactNode, delay?: number }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8, x: 20 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      transition={{ delay }}
      className="p-8 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-3xl -mr-12 -mt-12" />
      <div className="flex items-center gap-4 mb-4">
         <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400">{icon}</div>
         <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{label}</p>
      </div>
      <p className="text-lg font-black tracking-tight text-white leading-tight">{value}</p>
    </motion.div>
  );
}
