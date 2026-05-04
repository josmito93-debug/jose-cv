'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { 
  Globe, 
  Search, 
  Zap, 
  BarChart3, 
  ArrowRight, 
  Camera, 
  Share2, 
  Palette, 
  Rocket, 
  ShieldCheck, 
  Users, 
  ExternalLink,
  Code,
  Mail,
  User,
  Check,
  Activity,
  Megaphone,
  Smartphone,
  Briefcase
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const PROJECTS = [
  { 
    id: 'epse', 
    name: 'EPSE Miami', 
    category: 'Web design project', 
    description: 'Ecosistema y embudo de ventas para LUCHO FBA. Optimización de conversiones y venta de cursos.',
    image: 'https://picsum.photos/seed/epse/400/860', 
    link: 'https://lucho-fba-f7970e78fb5f1813ba9e379e680da.webflow.io',
  },
  { 
    id: 'attom', 
    name: 'ATTOM Collector', 
    category: 'AI System / Web Design', 
    description: 'Sistema de recopilación inteligente con flujos conversacionales de IA para prospección autónoma.',
    image: 'https://picsum.photos/seed/attom/400/860', 
    link: '/collector',
  },
  { 
    id: 'doral', 
    name: 'Doral Fashion Week', 
    category: 'Editorial Platform', 
    description: 'Plataforma digital para exhibir colecciones y conectar marcas globales con talento local.',
    image: 'https://picsum.photos/seed/doral/400/860', 
    link: 'https://doral-fasgion-week-magazine.webflow.io/',
  },
  { 
    id: 'rusty', 
    name: 'Rusty CBD', 
    category: 'E-commerce Platform', 
    description: 'Tienda virtual moderna para productos premium de CBD con enfoque en UX y fluidez de compra.',
    image: 'https://picsum.photos/seed/rusty/400/860', 
    link: 'https://rustycbd.webflow.io',
  },
  { 
    id: 'xclusive', 
    name: 'Xclusive Rental', 
    category: 'Rental Ecosystem', 
    description: 'Plataforma de alquiler de vehículos de lujo en Miami con inventario dinámico.',
    image: 'https://picsum.photos/seed/xclusive/400/860', 
    link: 'https://xclusiverental.webflow.io',
  },
  { 
    id: 'adventure', 
    name: 'Adventure Rental', 
    category: 'Booking System', 
    description: 'Plataforma de reservas para Jet Ski en Austin, TX optimizada para conversiones locales.',
    image: 'https://picsum.photos/seed/adventure/400/860', 
    link: 'https://adventurerental-9e1bee5f1021b4e162fddca.webflow.io',
  },
  { 
    id: 'mustache', 
    name: 'Mustache Barbershop', 
    category: 'Service Platform', 
    description: 'Presencia web moderna para barbería premium con sistema de reservas sencillo.',
    image: 'https://picsum.photos/seed/mustache/400/860', 
    link: 'https://www.mustachebarbershop.com/',
  },
  { 
    id: 'cleaning', 
    name: 'C&J Cleaning', 
    category: 'Corporate Site', 
    description: 'Sitio profesional para agencia de limpieza enfatizando confiabilidad e higiene.',
    image: 'https://picsum.photos/seed/cleaning/400/860', 
    link: 'https://c-j-professional-cleaning.webflow.io',
  },
  { 
    id: 'elemnt', 
    name: 'Elemnt Builders', 
    category: 'Construction Portal', 
    description: 'Portal corporativo para firma de construcción destacando excelencia estructural.',
    image: 'https://picsum.photos/seed/elemnt/400/860', 
    link: 'https://universas-exceptional-site-08ec65.webflow.io',
  },
  { 
    id: 'exumas', 
    name: 'Exumas Wedding', 
    category: 'Luxury Platform', 
    description: 'Portal para planificación de bodas exclusivas en islas privadas de las Bahamas.',
    image: 'https://picsum.photos/seed/exumas/400/860', 
    link: 'https://exumaswedding.webflow.io',
  },
  { 
    id: 'infit', 
    name: 'INFIT DJ Course', 
    category: 'E-learning Portal', 
    description: 'Plataforma digital para masterclass interactiva de DJ y comunidad.',
    image: 'https://picsum.photos/seed/infit/400/860', 
    link: 'https://infitevent.webflow.io',
  },
  { 
    id: 'trimo', 
    name: 'Trimo Cargo', 
    category: 'Logistics System', 
    description: 'Ecosistema de logística para envíos internacionales puerta a puerta.',
    image: 'https://picsum.photos/seed/trimo/400/860', 
    link: 'https://trimo-cargo-6aceb60865ea9521a79a006acc4.webflow.io',
  },
  { 
    id: 'plustextil', 
    name: 'Plustextil', 
    category: 'B2B SEO System', 
    description: 'Estrategia de posicionamiento B2B mediante arquitectura de contenidos industrial.',
    image: 'https://picsum.photos/seed/plus/400/860', 
    link: 'https://plustextil.com',
  },
  { 
    id: 'loiro', 
    name: 'Frigorífico Loiro', 
    category: 'Lead Gen System', 
    description: 'Sitio optimizado para captación de leads en el sector de refrigeración local.',
    image: 'https://picsum.photos/seed/loiro/400/860', 
    link: 'https://www.frigorificoloiro.com',
  },
  { 
    id: 'milenio', 
    name: 'JF Milenio', 
    category: 'Database App', 
    description: 'Aplicación técnica con inventario integrado de +1,000 productos.',
    image: 'https://picsum.photos/seed/milenio/400/860', 
    link: 'https://refrigeracinjfmileniowebsite.vercel.app/ecosistema',
  },
  { 
    id: 'kiiero', 
    name: 'KIIERO Music', 
    category: 'Brand & Ads', 
    description: 'Creación integral de marca y campañas de captación para la industria musical.',
    image: 'https://picsum.photos/seed/kiiero/400/860', 
    link: 'https://kiiero-music-8854cd25dc3932f2197412350d.webflow.io',
  },
  { 
    id: 'nations', 
    name: 'Nations League 7', 
    category: 'Sports Analytics', 
    description: 'Dashboard deportivo visual para tracking de torneos en tiempo real.',
    image: 'https://picsum.photos/seed/nations/400/860', 
    link: 'https://nationsleague7-c2ku.vercel.app',
  },
  { 
    id: 'films58', 
    name: '58Films', 
    category: 'Creative Portfolio', 
    description: 'Portafolio cinematográfico optimizado para performance de video y UX.',
    image: 'https://picsum.photos/seed/58films/400/860', 
    link: 'https://www.58films.tv',
  },
  { 
    id: 'gdream', 
    name: 'G-Dream Travel', 
    category: 'Travel Funnel', 
    description: 'Plataforma de viajes enfocada en UI/UX y conversión de prospectos.',
    image: 'https://picsum.photos/seed/gdream/400/860', 
    link: 'https://golden-dream-travel.webflow.io/',
  }
];

const SERVICES = [
  {
    id: 'google',
    title: 'Google Mastery',
    description: 'Transformamos búsquedas en transacciones. No solo posicionamos; adueñamos el mercado orgánico y pagado.',
    planet: '/planetas/universaArtboard 21.png',
    tag: 'SEO & ADS',
    bullets: ['Technical SEO Audit', 'SEM Strategy', 'Local Maps Control', 'Keyword Domination'],
    icon: Search
  },
  {
    id: 'meta',
    title: 'Social Intelligence',
    description: 'Algoritmos que trabajan para ti. Segmentación quirúrgica y creatividades que detienen el scroll.',
    planet: '/planetas/universaArtboard 23.png',
    tag: 'ROI FOCUSED',
    bullets: ['Facebook Ads scaling', 'Conversion Pixels', 'Retargeting Loops', 'Creative Strategy'],
    icon: Zap
  },
  {
    id: 'architecture',
    title: 'Web Architecture',
    description: 'Ingeniería web de vanguardia. Sitios ultra-rápidos optimizados para convertir cada visitante.',
    planet: '/planetas/universaArtboard 22.png',
    tag: 'HIGH PERFORMANCE',
    bullets: ['Next.js Ecosystem', 'Serverless Speed', 'UX Optimization', 'Mobile First'],
    icon: Globe
  },
  {
    id: 'branding',
    title: 'Graphic Design',
    description: 'Identidad visual de élite que posiciona tu marca en lo más alto del universo.',
    planet: '/planetas/universaArtboard 24.png',
    tag: 'ELITE BRANDING',
    bullets: ['Visual Identity', '3D Motion Design', 'Brand Storytelling', 'Social Content'],
    icon: Palette
  }
];

export default function UniversalLanding() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="bg-[#0e131f] text-white selection:bg-[#2ddc80] selection:text-[#0e131f] font-sans">
      
      {/* Cinematic Background Motion */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            x: [0, 100, -50, 0],
            y: [0, -80, 50, 0],
            scale: [1, 1.1, 0.9, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] bg-[#2ddc80]/15 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            x: [0, -120, 80, 0],
            y: [0, 100, -50, 0],
            scale: [1, 0.8, 1.1, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] -right-[10%] w-[700px] h-[700px] bg-[#2ddc80]/10 blur-[150px] rounded-full"
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      </div>

      {/* Navigation - Clean Floating Logo */}
      <nav className="fixed top-0 w-full z-[100] px-8 py-6 flex justify-between items-center bg-[#0e131f]/20 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center p-1 transition-transform hover:scale-110">
            <Image src="/images/universa_logo.png" alt="Universa" width={48} height={48} />
          </div>
          <span className="text-2xl font-black italic tracking-tighter uppercase leading-none">Universa</span>
        </div>
        <div className="hidden lg:flex items-center gap-12 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          <a href="#services" className="hover:text-[#2ddc80] transition-colors">Servicios</a>
          <a href="#portfolio" className="hover:text-[#2ddc80] transition-colors">Portafolio</a>
          <a href="#team" className="hover:text-[#2ddc80] transition-colors">Equipo</a>
          <Link href="https://wa.me/17863024923" className="px-8 py-4 bg-[#2ddc80] text-[#0e131f] rounded-full hover:scale-105 transition-all duration-300 font-black shadow-lg shadow-[#2ddc80]/10">
            Iniciar Misión
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center pt-48 pb-40 px-8 lg:px-24 text-center">
        <div className="max-w-5xl mx-auto w-full relative z-10 flex flex-col items-center gap-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4"
          >
            <div className="h-[2px] w-8 bg-[#2ddc80]" />
            <span className="text-[#2ddc80] font-black text-[10px] md:text-xs uppercase tracking-[0.4em]">
              Agencia Digital de Alto Rendimiento
            </span>
            <div className="h-[2px] w-8 bg-[#2ddc80]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white leading-[1.1]"
          >
            Donde la estrategia <br />
            <span className="text-[#2ddc80]">se encuentra con el</span> <br />
            Universo.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl font-medium leading-relaxed mt-4"
          >
            Construimos ecosistemas digitales de alto rendimiento que dominan Google, Meta y el mercado global. No diseñamos webs, creamos activos financieros.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-6 mt-8"
          >
             <button className="px-12 py-6 bg-[#2ddc80] text-[#0e131f] font-black text-xs uppercase tracking-widest rounded-full shadow-xl shadow-[#2ddc80]/20 hover:scale-105 transition-transform">
                Lanzar Proyecto
             </button>
             <button className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black text-xs uppercase tracking-widest rounded-full backdrop-blur-xl hover:bg-white/10 transition-all">
                Explorar Universo
             </button>
          </motion.div>
        </div>

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-10 pointer-events-none mix-blend-screen overflow-hidden">
           <Image src="/planetas/universaArtboard 5.png" alt="Planet" width={800} height={800} className="animate-pulse" />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-48 px-8 lg:px-24 relative">
         <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
               <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit mb-12">
                  <div className="text-[#2ddc80] font-black text-[10px] uppercase tracking-[0.4em] mb-6 flex items-center gap-4">
                    NUESTROS DOMINIOS
                    <div className="h-[1px] w-8 bg-[#2ddc80]/30" />
                  </div>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-[0.9] mb-8">
                    Ecosistemas <br /> Integrados.
                  </h2>
                  <p className="text-white/40 text-lg font-medium leading-relaxed max-w-sm">
                    Fusionamos ciencia de datos y creatividad de élite para expandir tu marca en el infinito digital.
                  </p>
               </div>

               <div className="lg:col-span-8 flex flex-col gap-10">
                  {SERVICES.map((service, idx) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="group relative bg-[#0e131f]/70 backdrop-blur-md rounded-[2.5rem] p-12 md:p-16 border-[2.5px] border-transparent overflow-hidden flex flex-col"
                      style={{
                        maskImage: 'linear-gradient(to bottom, transparent, black)',
                        WebkitMaskImage: 'linear-gradient(to bottom, transparent 20%, black 100%)',
                        borderColor: 'rgba(45, 220, 128, 0.4)'
                      }}
                    >
                      <div className="absolute inset-0 z-0 opacity-[0.25] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-3/4 h-20 bg-[#2ddc80]/10 blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      <div className="relative z-10">
                         <div className="flex justify-between items-start mb-12">
                            <div className="w-12 h-12 rounded-xl bg-[#2ddc80]/10 flex items-center justify-center border border-[#2ddc80]/20 group-hover:scale-110 transition-transform">
                               <service.icon className="w-6 h-6 text-[#2ddc80]" strokeWidth={2.5} />
                            </div>
                            <div className="px-4 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full flex items-center gap-2 group-hover:border-[#2ddc80]/30 transition-colors">
                               <div className="w-1.5 h-1.5 rounded-full bg-[#2ddc80] animate-pulse" />
                               <span className="text-white font-black text-[9px] uppercase tracking-widest">{service.tag}</span>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-6">
                               <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white group-hover:text-[#2ddc80] transition-colors leading-none">
                                 {service.title}
                               </h3>
                               <p className="text-white/60 text-base md:text-lg font-medium leading-relaxed">
                                 {service.description}
                               </p>
                               <ul className="space-y-3">
                                  {service.bullets.map((b) => (
                                    <li key={b} className="flex items-center gap-3 text-white/40 text-sm font-medium group-hover:text-white/80 transition-colors">
                                      <div className="w-1.5 h-1.5 rounded-full bg-[#2ddc80]" />
                                      {b}
                                    </li>
                                  ))}
                               </ul>
                            </div>
                            <div className="relative aspect-square opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-screen">
                               <Image src={service.planet} alt={service.title} fill className="object-contain" />
                            </div>
                         </div>
                      </div>
                    </motion.div>
                  ))}
               </div>
            </div>
         </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-48 bg-[#0b0f19] overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 lg:px-24 mb-32">
           <div className="flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="space-y-6">
                 <span className="text-[#2ddc80] font-black text-[10px] uppercase tracking-[0.4em]">ARCHIVO DIGITAL</span>
                 <h2 className="text-4xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
                   Misiones <br /> Completadas.
                 </h2>
              </div>
              <p className="text-white/30 text-lg font-medium max-w-sm md:text-right">
                Ingeniería verificada y despliegues de alto impacto para marcas líderes.
              </p>
           </div>
        </div>

        <div className="relative flex overflow-hidden group/carousel">
           <div className="flex gap-8 animate-[scroll-left_120s_linear_infinite] w-max group-hover/carousel:[animation-play-state:paused]">
              {[...PROJECTS, ...PROJECTS].map((project, idx) => (
                <div
                  key={`${project.id}-${idx}`}
                  className="relative bg-[#0e131f] rounded-[3rem] border border-white/5 overflow-hidden flex flex-col pt-12 px-10 w-[400px] md:w-[480px] h-[600px] md:h-[680px] transition-all duration-500 hover:border-[#2ddc80]/20"
                >
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[60%] bg-gradient-to-b from-[#162033]/50 to-transparent z-0" />
                    <div className="absolute inset-0 z-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />

                    <div className="relative z-10 space-y-6 flex-1">
                       <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/10">
                             <div className="w-3 h-3 bg-[#2ddc80] rounded-full blur-[3px]" />
                          </div>
                          <span className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em]">{project.category}</span>
                       </div>

                       <div className="space-y-3">
                          <h3 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-none">
                            {project.name}
                          </h3>
                          <p className="text-white/50 text-sm md:text-base font-medium leading-relaxed max-w-md line-clamp-3">
                            {project.description}
                          </p>
                       </div>

                       <Link 
                         href={project.link}
                         target="_blank"
                         className="inline-flex px-8 py-4 bg-white text-[#0e131f] rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform"
                       >
                         Habla con un especialista
                       </Link>
                    </div>

                    <div className="relative z-10 mt-8 flex justify-center translate-y-6 group-hover:translate-y-0 transition-transform duration-700">
                       <div className="relative w-[200px] md:w-[240px] aspect-[9/19.5] rounded-[2.5rem] overflow-hidden border-[6px] border-[#1a2333] shadow-2xl z-20 bg-black">
                          <Image src={project.image} alt={project.name} fill className="object-cover" />
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-5 bg-black rounded-b-2xl z-30" />
                       </div>
                       <div className="absolute left-0 bottom-0 w-[180px] md:w-[220px] aspect-[9/19.5] rounded-[2.5rem] overflow-hidden border-[4px] border-[#1a2333]/50 shadow-xl z-10 -translate-x-[20%] translate-y-[20%] opacity-30 group-hover:opacity-50 transition-all duration-700 rotate-[-12deg]">
                          <Image src={project.image} alt={project.name} fill className="object-cover" />
                       </div>
                       <div className="absolute right-0 bottom-0 w-[180px] md:w-[220px] aspect-[9/19.5] rounded-[2.5rem] overflow-hidden border-[4px] border-[#1a2333]/50 shadow-xl z-10 translate-x-[20%] translate-y-[20%] opacity-30 group-hover:opacity-50 transition-all duration-700 rotate-[12deg]">
                          <Image src={project.image} alt={project.name} fill className="object-cover" />
                       </div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#2ddc80]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Team Section - Updated Jose's Profile */}
      <section id="team" className="py-48 px-8 lg:px-24">
         <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-24">
            <div className="relative group">
               <div className="w-[300px] h-[400px] md:w-[450px] md:h-[600px] rounded-[3rem] md:rounded-[4rem] bg-[#0e131f] border border-white/10 p-4 relative overflow-hidden transition-all duration-700 group-hover:border-[#2ddc80]/30 shadow-2xl">
                  <div className="absolute inset-0 bg-[#2ddc80]/10 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative h-full w-full rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                     <Image src="/profile.png" alt="Jose Figueroa" fill className="object-cover scale-110" />
                  </div>
                  <div className="absolute bottom-10 left-10 right-10 bg-[#0e131f]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl translate-y-20 group-hover:translate-y-0 transition-transform duration-700">
                     <p className="text-[#2ddc80] text-[9px] font-black uppercase tracking-widest mb-1">FOUNDER & CEO</p>
                     <p className="text-2xl font-black tracking-tight text-white">Jose Figueroa</p>
                  </div>
               </div>
            </div>

            <div className="flex-1 space-y-12">
               <span className="text-[#2ddc80] font-black text-[10px] uppercase tracking-[0.4em]">EL ARQUITECTO</span>
               <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
                 Ingeniería <br /> & Estrategia.
               </h2>
               <p className="text-white/50 text-xl font-medium leading-relaxed">
                 Fundador y CEO de Universa. Lidero la visión estratégica de la agencia, fusionando ingeniería de software de élite con marketing de alta conversión para dominar mercados digitales.
               </p>
               <div className="flex flex-wrap gap-4 pt-4">
                  <Link href="/me" className="flex items-center gap-6 px-10 py-6 bg-[#2ddc80] text-[#0e131f] rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#2ddc80]/10">
                     Conocer Trayectoria
                     <ArrowRight className="w-4 h-4" />
                  </Link>
               </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-32 px-8 lg:px-24 bg-black border-t border-white/5">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-24">
            <div className="space-y-10 max-w-md">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center p-1">
                    <Image src="/images/universa_logo.png" alt="Universa" width={48} height={48} />
                  </div>
                  <span className="text-3xl font-black italic tracking-tighter uppercase">Universa</span>
               </div>
               <p className="text-white/30 text-lg font-medium leading-relaxed">
                 Expandiendo los límites de la arquitectura digital. Operando desde el corazón del universo digital.
               </p>
               <div className="flex gap-8">
                  <a href="#" className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-white/40 hover:text-[#2ddc80] hover:bg-[#2ddc80]/10 transition-all"><Camera className="w-5 h-5" /></a>
                  <a href="#" className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-white/40 hover:text-[#2ddc80] hover:bg-[#2ddc80]/10 transition-all"><Share2 className="w-5 h-5" /></a>
                  <a href="#" className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-white/40 hover:text-[#2ddc80] hover:bg-[#2ddc80]/10 transition-all"><User className="w-5 h-5" /></a>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-20">
               <div className="space-y-10">
                  <h4 className="text-white text-xs font-black uppercase tracking-[0.4em]">SISTEMA</h4>
                  <ul className="space-y-6 text-[11px] font-black uppercase tracking-widest text-white/20">
                     <li className="hover:text-[#2ddc80] transition-colors"><a href="#services">Dominios</a></li>
                     <li className="hover:text-[#2ddc80] transition-colors"><a href="#portfolio">Misiones</a></li>
                     <li className="hover:text-[#2ddc80] transition-colors"><a href="#team">Equipo</a></li>
                  </ul>
               </div>
               <div className="space-y-10">
                  <h4 className="text-white text-xs font-black uppercase tracking-[0.4em]">CONTROL</h4>
                  <ul className="space-y-6 text-[11px] font-black uppercase tracking-widest text-white/20">
                     <li className="hover:text-[#2ddc80] transition-colors"><Link href="/admin">Admin</Link></li>
                     <li className="hover:text-[#2ddc80] transition-colors"><Link href="/dashboard/attom">Leads</Link></li>
                     <li className="hover:text-[#2ddc80] transition-colors"><a href="https://wa.me/17863024923">WhatsApp</a></li>
                  </ul>
               </div>
            </div>
         </div>
         <div className="mt-40 pt-12 border-t border-white/5 flex justify-between items-center text-[9px] font-black uppercase tracking-[0.4em] text-white/10">
            <p>© 2026 UNIVERSA AGENCY. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-12">
               <span>PRIVACY.SYS</span>
               <span>TERMS.宇宙</span>
            </div>
         </div>
      </footer>

      <style jsx global>{`
        @keyframes scroll-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function DashboardLink({ href, icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link href={href} className="flex items-center gap-4 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-[#2ddc80]/10 hover:border-[#2ddc80]/30 hover:scale-105 transition-all group">
       <div className="text-[#2ddc80] group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </Link>
  );
}
