"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { siteData } from "@/lib/cv-data";
import { 
  Mail, 
  MapPin, 
  ArrowUpRight, 
  Menu, 
  X, 
  LayoutDashboard,
  Globe,
  Zap,
  ArrowRight
} from "lucide-react";

export default function CVPage() {
  const [lang, setLang] = useState<"en" | "es">("es");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const data = siteData[lang];
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const totalFrames = 191;

  // Cinematic Scroll Animation Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    const drawFrame = (frameNumber: number) => {
      const img = images[frameNumber - 1];
      if (img && img.complete) {
        const canvasAspect = canvas.width / canvas.height;
        const imgAspect = img.width / img.height;
        let drawWidth, drawHeight, x, y;

        if (canvasAspect > imgAspect) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgAspect;
          x = 0;
          y = -(drawHeight - canvas.height) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgAspect;
          x = -(drawWidth - canvas.width) / 2;
          y = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
      }
    };

    const handleResize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      const scrollFraction = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(scrollFraction * totalFrames)
      );
      drawFrame(frameIndex + 1);
    };

    const handleScroll = () => {
      const scrollFraction = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(scrollFraction * totalFrames)
      );
      requestAnimationFrame(() => drawFrame(frameIndex + 1));
    };

    // Preload Images
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.onload = () => {
        loadedCount++;
        if (i === 1 || loadedCount === totalFrames) {
          drawFrame(1);
        }
      };
      img.src = `/images/${i}.jpg`;
      images.push(img);
    }
    imagesRef.current = images;

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="bg-[#050505] text-white  selection:bg-indigo-500/30 overflow-x-hidden w-full">
      
      {/* HUD Navbar */}
      <nav className="fixed top-4 md:top-8 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] max-w-7xl z-[100] px-6 md:px-10 py-4 md:py-5 bg-black/40 border border-white/5 backdrop-blur-2xl rounded-[1.5rem] md:rounded-[2.5rem] flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-6 md:gap-10">
          <div className="flex items-center gap-3 group">
            <div className="w-10 h-10 overflow-hidden group-hover:scale-110 transition-transform bg-transparent flex items-center justify-center">
               <img src="/images/universa_logo.png" alt="Universa" className="w-full h-full object-contain" />
            </div>
            <div className="text-xl md:text-2xl font-black tracking-tighter uppercase italic">Universa<span className="text-indigo-500 italic lowercase ml-1 font-bold">Agency</span></div>
          </div>
          <div className="hidden lg:flex items-center gap-8">
            <a href="#skills" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all">{data.titles.nav_skills}</a>
            <a href="#experience" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all">{data.titles.nav_experience}</a>
            <a href="#projects" className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-all">{data.titles.nav_projects}</a>
          </div>
        </div>
        
        <div className="flex items-center gap-3 md:gap-6 font-black text-[10px]">
          <Link href="/hq" className="flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-indigo-600/10 border border-indigo-500/20 rounded-xl md:rounded-2xl text-indigo-400 hover:bg-indigo-600/20 transition-all tracking-[0.2em] uppercase">
            <LayoutDashboard className="w-3.5 h-3.5" /> <span className="hidden sm:inline">HQ</span>
          </Link>
          <div className="flex gap-2 text-zinc-600">
            <button onClick={() => setLang("en")} className={lang === "en" ? "text-white" : "hover:text-zinc-400"}>EN</button>
            <span>/</span>
            <button onClick={() => setLang("es")} className={lang === "es" ? "text-white" : "hover:text-zinc-400"}>ES</button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Cinematic Canvas */}
      <section className="relative h-[180vh] md:h-[250vh]">
        {/* Sticky Background Layer */}
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/20 via-transparent to-[#050505]" />
          
          {/* Hero Content Layer */}
          <div className="relative h-full flex flex-col items-center justify-center px-6 md:px-10 text-center">
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="mb-6 md:mb-8 px-4 md:px-5 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-3"
            >
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]" />
              <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] text-emerald-400 text-balance">Available For Systems Architecture</span>
            </motion.div>

            <motion.h1 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="text-[clamp(3rem,12vw,8.5rem)] font-black tracking-[-0.05em] leading-[0.85] mb-6 uppercase"
            >
              JOSÉ FIGUEROA
            </motion.h1>

            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="text-[clamp(1.2rem,4vw,2.2rem)] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-white to-zinc-500 mb-10"
            >
              {data.hero.subtitle}
            </motion.p>

            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.3 }}
               className="flex flex-col md:flex-row items-center gap-8"
            >
              <a href="mailto:josefigueroa069@gmail.com" className="px-10 py-5 bg-white text-black font-black rounded-2xl flex items-center gap-3 hover:scale-105 transition-all shadow-2xl">
                <Mail className="w-5 h-5" /> Start Conversation
              </a>
              <div className="flex items-center gap-3 text-zinc-500 font-bold tracking-tighter">
                <MapPin className="w-5 h-5 text-indigo-500" /> Caracas, Venezuela
              </div>
            </motion.div>
          </div>

          {/* Infinite Logo Carousel */}
          <div className="absolute bottom-16 w-full py-10 overflow-hidden border-t border-white/5 backdrop-blur-xl">
             <div className="flex gap-20 animate-[scroll-left_40s_linear_infinite] w-max select-none">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-20 items-center">
                    {[
                      { name: "n8n", icon: "n8n", color: "EA4B71" },
                      { name: "n8n", icon: "n8n", color: "EA4B71" }, // Duplicate for visual weight
                      { name: "Webflow", icon: "webflow", color: "4353FF" },
                      { name: "React", icon: "react", color: "61DAFB" },
                      { name: "Vercel", icon: "vercel", color: "FFFFFF" },
                      { name: "Supabase", icon: "supabase", color: "3ECF8E" },
                      { name: "Airtable", icon: "airtable", color: "18BFFF" },
                      { name: "Notion", icon: "notion", color: "FFFFFF" },
                    ].map((logo, idx) => (
                      <div key={idx} className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                        <img src={`https://cdn.simpleicons.org/${logo.icon}/${logo.color}`} alt={logo.name} className="w-6 h-6" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">{logo.name}</span>
                      </div>
                    ))}
                  </div>
                ))}
             </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main id="content" className="relative z-10 space-y-32 md:space-y-64 pb-32 md:pb-64">
        {/* Skills Organism */}
        <section id="skills" className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-baseline gap-4 md:gap-6 mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase">{data.titles.skills_title.split(' ')[0]} <span className="text-indigo-500 opacity-50 underline decoration-4 underline-offset-8">{data.titles.skills_title.split(' ')[1]}</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {data.skills.map((skill, idx) => (
              <motion.div 
                whileHover={{ y: -10 }}
                key={skill.name} 
                className="p-8 md:p-10 bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[3rem] hover:border-indigo-500/30 transition-all duration-500 group"
              >
                <div className="flex justify-between items-start mb-6 md:mb-8">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-indigo-400 transition-colors">
                    <Zap className="w-6 h-6 md:w-7 md:h-7" />
                  </div>
                  <div className="text-right">
                    <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-2">Proficiency</p>
                    <div className="flex gap-0.5 text-yellow-500 text-[10px]">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < skill.score ? "text-yellow-500" : "text-white/10"}>★</span>
                      ))}
                    </div>
                  </div>
                </div>
                <h4 className="text-xl md:text-2xl font-black tracking-tighter mb-2">{skill.name}</h4>
                <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-zinc-500">{skill.level}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experience Timeline */}
        <section id="experience" className="max-w-7xl mx-auto px-6 md:px-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-12 md:mb-20 text-balance">Career <span className="text-indigo-500">Timeline</span></h2>
          <div className="space-y-8 md:space-y-12">
            {data.experience.map((exp, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                key={idx} 
                className="group flex flex-col md:flex-row gap-6 md:gap-10 p-8 md:p-12 bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[4rem] hover:border-indigo-500/20 transition-all"
              >
                <div className="md:w-64 shrink-0">
                  <p className="text-base md:text-lg font-black tracking-tighter text-indigo-400 mb-1">{exp.date}</p>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">{exp.company}</p>
                </div>
                <div className="flex-1">
                  <h4 className="text-2xl md:text-3xl font-black tracking-tighter mb-4 md:mb-6">{exp.title}</h4>
                  <ul className="space-y-3 md:space-y-4">
                    {exp.desc.map((d, i) => (
                      <li key={i} className="text-zinc-500 font-bold leading-relaxed flex gap-3 md:gap-4 text-xs md:text-sm">
                        <span className="text-indigo-500 text-base md:text-lg">›</span> {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Projects Organism */}
        <section id="projects" className="max-w-7xl mx-auto px-6 md:px-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-12 md:mb-20 text-balance">Product <span className="text-indigo-500">Echo</span></h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {data.projects.map((proj, idx) => (
              <motion.div 
                whileHover={{ scale: 0.98 }}
                key={idx} 
                className="bg-white/[0.02] border border-white/5 rounded-[2rem] md:rounded-[4rem] p-8 md:p-12 hover:border-indigo-500/30 transition-all group overflow-hidden"
              >
                <div className="aspect-video rounded-[1.5rem] md:rounded-[2.5rem] mb-8 md:mb-10 overflow-hidden bg-black border border-white/5 relative group">
                  <img 
                    src={`https://api.microlink.io/?url=${encodeURIComponent(proj.link)}&screenshot=true&meta=false&embed=screenshot.url`} 
                    alt={proj.title}
                    className="w-full h-full object-cover object-top opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                  />
                  <a href={proj.link} target="_blank" className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-indigo-600/20 backdrop-blur-sm">
                    <div className="px-6 md:px-8 py-3 md:py-4 bg-white text-black font-black rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 text-xs md:text-sm">
                      View Project <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
                    </div>
                  </a>
                </div>
                <h4 className="text-2xl md:text-3xl font-black tracking-tighter mb-2 uppercase">{proj.title}</h4>
                <p className="text-indigo-400 text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase mb-4 md:mb-6">{proj.subtitle}</p>
                <p className="text-zinc-500 font-bold text-xs md:text-sm leading-relaxed mb-8 md:mb-10">{proj.desc}</p>
                <div className="flex flex-wrap gap-3">
                   <div className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 rounded-lg md:rounded-xl border border-white/10 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-400">Next.js</div>
                   <div className="px-3 md:px-4 py-1.5 md:py-2 bg-white/5 rounded-lg md:rounded-xl border border-white/10 text-[8px] md:text-[9px] font-black uppercase tracking-widest text-zinc-400">Tailwind V4</div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 text-center bg-[#050505] relative z-20">
         <div className="max-w-xl mx-auto px-10">
            <h5 className="text-2xl font-black tracking-tighter mb-4 text-white uppercase italic">José Figueroa. HQ</h5>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800 leading-loose">
               {data.titles.footer_text} <br />
               &copy; 2026 JF.OS - Autonomous Digital Ecosystem
            </p>
         </div>
      </footer>
    </div>
  );
}
