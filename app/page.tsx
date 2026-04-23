'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  Search, 
  Zap, 
  BarChart3, 
  ArrowRight, 
  Instagram, 
  Facebook, 
  Palette, 
  Rocket, 
  ShieldCheck, 
  Users, 
  ExternalLink,
  Github,
  Mail,
  Linkedin
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const PROJECTS = [
  { id: 'n1c4', name: 'N1C4 Barber Studio', category: 'Integrated Ecosystem', image: 'https://picsum.photos/seed/n1c4/800/600', link: '/propuestas/n1c4' },
  { id: 'cava', name: 'Cava Travel', category: 'Digital Proposal', image: 'https://picsum.photos/seed/cava/800/600', link: '/propuestas/cava-khaled' },
  { id: 'roxe', name: 'ROXE Ecommerce', category: 'Web Architecture', image: 'https://picsum.photos/seed/roxe/800/600', link: '/propuestas/roxe' },
  { id: 'panenka', name: 'Panenka Restaurant', category: 'Sales Funnel', image: 'https://picsum.photos/seed/panenka/800/600', link: '/propuestas/panenka' },
  { id: 'uncle', name: 'Uncle Coyo', category: 'Growth Strategy', image: 'https://picsum.photos/seed/uncle/800/600', link: '/propuestas/uncle_coyo' },
  { id: 'milex', name: 'Milex Films', category: 'Cinema Portfolio', image: 'https://picsum.photos/seed/milex/800/600', link: '/propuestas/milex-films' },
];

export default function UniversalLanding() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="bg-[#050505] text-white overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black/20 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-2">
            <Image src="/images/universa_logo.png" alt="Universa" width={40} height={40} className="invert" />
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase">Universa</span>
        </div>
        <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
          <a href="#team" className="hover:text-white transition-colors">The Team</a>
          <a href="https://wa.me/17863024923" className="px-6 py-3 bg-white text-black rounded-full hover:scale-105 transition-transform">Get Started</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center pt-20 px-4 overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full" />
          <motion.div 
            style={{ y: useTransform(scrollYProgress, [0, 0.2], [0, 100]) }}
            className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] opacity-40 mix-blend-screen pointer-events-none"
          >
            <Image src="/planetas/universaArtboard 5.png" alt="Planet" width={600} height={600} className="animate-pulse" />
          </motion.div>
        </div>

        <div className="relative z-10 text-center space-y-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-6">
              Next-Gen Digital Architecture
            </span>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.9] text-white">
              Donde la estrategia <br />
              <span className="text-zinc-600">se encuentra con el</span> <br />
              Universo.
            </h1>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-zinc-500 text-lg md:text-xl font-bold max-w-2xl mx-auto"
          >
            Construimos ecosistemas digitales de alto rendimiento que dominan Google, 
            Meta y el mercado global. No diseñamos webs, creamos activos financieros.
          </motion.p>

          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.8 }}
             className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
          >
            <button className="w-full sm:w-auto px-10 py-5 bg-white text-black font-black text-xs uppercase tracking-widest rounded-2xl shadow-2xl hover:bg-emerald-400 transition-all">
              Launch Project
            </button>
            <button className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-2xl backdrop-blur-xl hover:bg-white/10 transition-all">
              View Universe
            </button>
          </motion.div>
        </div>

        {/* Floating Rocks / Grid Effect */}
        <div className="absolute inset-0 pointer-events-none z-0">
           <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-[0.03] mix-blend-overlay" />
           <div className="h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>
      </section>

      {/* Services Section - The Planets */}
      <section id="services" className="py-32 px-6 lg:px-20 space-y-32">
        <SectionHeader 
          eyebrow="Our Domain" 
          title="We build your whole ecosystem" 
          description="Fusionamos ciencia, datos y creatividad para expandir el potencial de tu marca en cada plataforma." 
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <PlanetCard 
            title="Google SEO" 
            description="Dominamos los motores de búsqueda para que tu negocio sea la primera opción."
            image="/planetas/universaArtboard 21.png"
            color="emerald"
            tag="SEO & ADS"
          />
          <PlanetCard 
            title="Web Develop" 
            description="Arquitectura digital robusta, rápida y diseñada para la conversión masiva."
            image="/planetas/universaArtboard 22.png"
            color="indigo"
            tag="ARCHITECTURE"
          />
          <PlanetCard 
            title="Meta Ads" 
            description="Campañas de alta precisión en Facebook que retornan cada dólar invertido."
            image="/planetas/universaArtboard 23.png"
            color="purple"
            tag="ROI FOCUSED"
          />
          <PlanetCard 
            title="Graphic Design" 
            description="Identidad visual de élite que posiciona tu marca en lo más alto del universo."
            image="/planetas/universaArtboard 24.png"
            color="amber"
            tag="BRANDING"
          />
        </div>
      </section>

      {/* Portfolio Carousel - Super Cool Design */}
      <section id="portfolio" className="py-32 bg-[#080808]">
        <div className="px-6 lg:px-20 mb-16">
          <SectionHeader 
            eyebrow="Digital Archive" 
            title="Previous Deployments" 
            description="Cada proyecto es una pieza única de ingeniería digital. Explora nuestras últimas misiones." 
          />
        </div>

        <div className="relative group overflow-hidden">
          <div className="flex animate-scroll hover:[animation-play-state:paused]">
            {[...PROJECTS, ...PROJECTS].map((project, i) => (
              <div key={`${project.id}-${i}`} className="flex-none w-[350px] md:w-[450px] px-4">
                <Link href={project.link} className="block group/card relative aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/5 bg-[#111113]">
                   <Image 
                     src={project.image} 
                     alt={project.name} 
                     fill 
                     className="object-cover grayscale group-hover/card:grayscale-0 group-hover/card:scale-110 transition-all duration-700" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
                   <div className="absolute bottom-10 left-10 right-10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2 block">{project.category}</span>
                      <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">{project.name}</h3>
                      <div className="h-0 group-hover/card:h-12 overflow-hidden transition-all duration-500 mt-4">
                        <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                          View Proposal <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                   </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Funnel Section - Data Driven */}
      <section className="py-32 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Marketing Intelligence</span>
              <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-none">
                We work every step <br />
                <span className="text-zinc-700">of sales funnel</span>
              </h2>
              <p className="text-zinc-500 font-bold leading-relaxed">
                No lanzamos flechas al aire. Diseñamos sistemas que capturan tráfico frío, 
                lo calientan con contenido estratégico y lo convierten en ingresos recurrentes.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
                 <FunnelStep icon={<Users />} title="Cold Traffic" desc="SEO & Awareness" />
                 <FunnelStep icon={<BarChart3 />} title="Nurturing" desc="Copywriting & Content" />
                 <FunnelStep icon={<Zap />} title="Conversion" desc="Optimized Checkout" />
                 <FunnelStep icon={<ShieldCheck />} title="Retention" desc="Automation & Data" />
              </div>
           </div>
           <div className="relative aspect-square rounded-[3rem] bg-white/5 border border-white/10 p-4 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full border border-emerald-500/50 rounded-full animate-[ping_3s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 border border-emerald-500/30 rounded-full animate-[ping_4s_linear_infinite]" />
              </div>
              <div className="relative z-10 p-12 text-center">
                 <Rocket className="w-20 h-20 text-white mx-auto mb-8 animate-bounce" />
                 <h3 className="text-3xl font-black italic tracking-tighter uppercase">98% Faster Growth</h3>
                 <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mt-2">Validated by AI Performance Metrics</p>
              </div>
           </div>
        </div>
      </section>

      {/* Team Section - The Architects */}
      <section id="team" className="py-32 px-6 lg:px-20 bg-[#0C0C0E]">
        <div className="max-w-4xl mx-auto space-y-20">
           <SectionHeader 
             center
             eyebrow="The Minds" 
             title="The Architects" 
             description="Un equipo de especialistas dedicados a empujar los límites de lo posible." 
           />
           
           <div className="flex flex-col md:flex-row items-center justify-center gap-12">
              <motion.div 
                whileHover={{ y: -10 }}
                className="w-full max-w-sm p-8 bg-black border border-white/5 rounded-[2.5rem] relative group"
              >
                 <div className="absolute top-6 right-6 w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-5 h-5 text-emerald-400" />
                 </div>
                 <div className="aspect-square rounded-3xl bg-zinc-900 mb-8 overflow-hidden relative">
                    <Image src="/profile.png" alt="Jose Figueroa" fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                 </div>
                 <div className="space-y-4">
                    <div>
                       <h4 className="text-2xl font-black italic tracking-tighter uppercase">Jose Figueroa</h4>
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Chief Digital Architect</p>
                    </div>
                    <p className="text-xs font-bold text-zinc-600 leading-relaxed">
                      Estratega digital y desarrollador full-stack. Especializado en ecosistemas de alto rendimiento y automatización de procesos mediante IA.
                    </p>
                    <div className="flex items-center gap-4 pt-4">
                       <a href="/admin" className="p-3 bg-white/5 rounded-xl hover:text-emerald-400 transition-colors"><Globe className="w-4 h-4" /></a>
                       <a href="/dashboard/attom" className="p-3 bg-white/5 rounded-xl hover:text-emerald-400 transition-colors"><BarChart3 className="w-4 h-4" /></a>
                       <a href="https://github.com/josmito93-debug" className="p-3 bg-white/5 rounded-xl hover:text-emerald-400 transition-colors"><Github className="w-4 h-4" /></a>
                    </div>
                 </div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 lg:px-20 border-t border-white/5 bg-[#050505]">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-20">
            <div className="space-y-8 max-w-md">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-2">
                    <Image src="/images/universa_logo.png" alt="Universa" width={40} height={40} className="invert" />
                  </div>
                  <span className="text-xl font-black italic tracking-tighter uppercase">Universa</span>
               </div>
               <p className="text-zinc-600 text-sm font-bold leading-relaxed">
                 Llevamos tu marca más allá de los límites convencionales. 
                 Arquitectura digital de alto rendimiento y estrategias de crecimiento galácticas.
               </p>
               <div className="flex items-center gap-6">
                  <Instagram className="w-5 h-5 text-zinc-700 hover:text-white cursor-pointer transition-colors" />
                  <Facebook className="w-5 h-5 text-zinc-700 hover:text-white cursor-pointer transition-colors" />
                  <Linkedin className="w-5 h-5 text-zinc-700 hover:text-white cursor-pointer transition-colors" />
               </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
               <div className="space-y-6">
                  <p className="text-white">Universe</p>
                  <a href="#" className="block hover:text-emerald-400 transition-colors">Hero</a>
                  <a href="#" className="block hover:text-emerald-400 transition-colors">Systems</a>
                  <a href="#" className="block hover:text-emerald-400 transition-colors">Growth</a>
               </div>
               <div className="space-y-6">
                  <p className="text-white">Agencia</p>
                  <a href="#" className="block hover:text-emerald-400 transition-colors">Portfolio</a>
                  <a href="#" className="block hover:text-emerald-400 transition-colors">The Team</a>
                  <a href="#" className="block hover:text-emerald-400 transition-colors">Contact</a>
               </div>
               <div className="space-y-6">
                  <p className="text-white">Admin</p>
                  <Link href="/admin" className="block hover:text-emerald-400 transition-colors">Control Center</Link>
                  <Link href="/dashboard/attom" className="block hover:text-emerald-400 transition-colors">Leads</Link>
               </div>
            </div>
         </div>
         <div className="mt-32 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black uppercase tracking-widest text-zinc-800">
            <p>© 2026 UNIVERSA AGENCY. ALL RIGHTS RESERVED.</p>
            <div className="flex items-center gap-8">
               <span>Terms of Galaxy</span>
               <span>Privacy Mission</span>
            </div>
         </div>
      </footer>

      {/* Styles for the infinite scroll */}
      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-450px * 6)); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
        @media (max-width: 768px) {
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-350px * 6)); }
          }
        }
      `}</style>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description, center = false }: { eyebrow: string; title: string; description: string; center?: boolean }) {
  return (
    <div className={`space-y-6 max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">{eyebrow}</span>
      <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.9] text-white">
        {title.split(' ').map((word, i) => (
          <span key={i} className={i % 2 !== 0 ? 'text-zinc-800' : ''}>{word} </span>
        ))}
      </h2>
      <p className="text-zinc-600 font-bold leading-relaxed">{description}</p>
    </div>
  );
}

function PlanetCard({ title, description, image, color, tag }: { title: string; description: string; image: string; color: string; tag: string }) {
  const colors: any = {
    emerald: 'text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/10',
    indigo: 'text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-500/10',
    purple: 'text-purple-400 border-purple-500/20 group-hover:bg-purple-500/10',
    amber: 'text-amber-400 border-amber-500/20 group-hover:bg-amber-500/10'
  };

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-10 group relative overflow-hidden flex flex-col justify-between min-h-[500px]"
    >
      <div className="absolute top-0 right-0 w-full aspect-square pointer-events-none transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform duration-1000 opacity-60 mix-blend-screen">
         <Image src={image} alt={title} width={400} height={400} className="object-contain" />
      </div>
      
      <div className="relative z-10">
         <span className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest transition-colors ${colors[color]}`}>
           {tag}
         </span>
      </div>

      <div className="relative z-10 space-y-4">
         <h3 className="text-4xl font-black italic tracking-tighter uppercase leading-none">{title}</h3>
         <p className="text-zinc-600 text-xs font-bold leading-relaxed group-hover:text-zinc-400 transition-colors">
           {description}
         </p>
         <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
               Explore Module <ArrowRight className="w-4 h-4" />
            </button>
         </div>
      </div>
    </motion.div>
  );
}

function FunnelStep({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center gap-6 group hover:bg-white/5 transition-all">
       <div className="p-4 bg-white/5 rounded-2xl text-emerald-400 group-hover:bg-emerald-500 group-hover:text-black transition-all">
          {icon}
       </div>
       <div>
          <h4 className="text-sm font-black uppercase tracking-widest text-white">{title}</h4>
          <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">{desc}</p>
       </div>
    </div>
  );
}
