"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { siteData } from "@/lib/cv-data";

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
    <div className="dark-theme text-white font-inter">
      {/* Cinematic Background */}
      <canvas
        ref={canvasRef}
        id="scroll-hero-canvas"
        className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      />
      <div className="hero-bg-overlay fixed top-0 left-0 w-full h-full pointer-events-none z-1" 
           style={{ background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.6) 100%)" }} />

      {/* Navbar */}
      <nav className="navbar glass-panel fixed top-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[1200px] z-[100] px-8 py-4 rounded-full">
        <div className="flex justify-between items-center">
          <div className="logo font-outfit font-bold text-2xl tracking-tighter">JF.</div>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#skills" className="text-slate-400 hover:text-white transition-colors">{data.titles.nav_skills}</a>
            <a href="#experience" className="text-slate-400 hover:text-white transition-colors">{data.titles.nav_experience}</a>
            <a href="#projects" className="text-slate-400 hover:text-white transition-colors">{data.titles.nav_projects}</a>
            <Link href="/collector" className="flex flex-col items-center bg-purple-900/20 border border-purple-500/40 px-4 py-1.5 rounded-full hover:bg-purple-900/40 transition-all group">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                <span className="text-sm font-bold text-purple-200">ATTOMCollector</span>
              </div>
              <span className="text-[10px] text-purple-300/70 -mt-0.5">Recopilación inteligente</span>
            </Link>
          </div>
          <div className="lang-switch flex gap-2 items-center font-bold text-sm">
            <button onClick={() => setLang("en")} className={lang === "en" ? "text-white" : "text-slate-500"}>EN</button>
            <span className="text-slate-500">/</span>
            <button onClick={() => setLang("es")} className={lang === "es" ? "text-white" : "text-slate-500"}>ES</button>
          </div>
        </div>
      </nav>

      <section className="hero-fullscreen relative w-screen h-[250vh] overflow-clip">
        <div className="sticky top-0 w-full h-screen flex items-center justify-center">
          <div className="hero-fullscreen-content relative z-[3] w-full text-center">
            <div className="max-w-[1200px] mx-auto px-5">
              <div className="hero-text-premium opacity-0 animate-[slide-up-fade_1.4s_cubic-bezier(0.16,1,0.3,1)_forwards]">
                <div className="status-pill inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-[#3ECF8E] px-4 py-1.5 rounded-full text-[0.72rem] font-semibold uppercase tracking-[1.5px] mb-6">
                  <span className="w-2 h-2 bg-[#3ECF8E] rounded-full animate-pulse shadow-[0_0_10px_#3ECF8E]"></span>
                  Available for work
                </div>
                
                <h1 className="glitch-text relative text-[clamp(2.5rem,8vw,5rem)] font-extrabold tracking-[-3px] leading-tight mb-4" data-text="JOSÉ FIGUEROA">
                  JOSÉ FIGUEROA
                </h1>
                <h2 className="subtitle-premium text-[clamp(1.2rem,4vw,2rem)] font-semibold gradient-text mb-6">
                  {data.hero.subtitle}
                </h2>
                
                <p className="summary-premium text-lg text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto">
                  {data.hero.summary}
                </p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
                  <a href="mailto:josefigueroa069@gmail.com" className="glass-btn flex items-center gap-3 bg-indigo-600 px-8 py-4 rounded-xl font-bold hover:scale-105 transition-transform shadow-xl shadow-indigo-600/20">
                    <i className="fa-solid fa-envelope"></i> Contact Me
                  </a>
                  <span className="location-badge text-slate-400 flex items-center gap-2">
                    <i className="fa-solid fa-location-dot text-indigo-500 text-xl"></i> Caracas, Venezuela
                  </span>
                </div>
              </div>
            </div>

            {/* Tech Carousel */}
            <div className="absolute bottom-20 w-full overflow-hidden py-6 z-[3]">
               <div className="tech-logos-track flex gap-16 animate-[scroll-left_50s_linear_infinite] w-max items-center">
                  {/* Render logos twice for infinite scroll */}
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-16 items-center">
                      {[
                        { name: "Meta Ads", icon: "meta", color: "0668E1" },
                        { name: "Google Ads", icon: "googleads", color: "F4B400" },
                        { name: "n8n", icon: "n8n", color: "EA4B71" },
                        { name: "Webflow", icon: "webflow", color: "4353FF" },
                        { name: "React", icon: "react", color: "61DAFB" },
                        { name: "Vercel", icon: "vercel", color: "FFFFFF" },
                        { name: "Supabase", icon: "supabase", color: "3ECF8E" },
                        { name: "Airtable", icon: "airtable", color: "18BFFF" },
                        { name: "Notion", icon: "notion", color: "FFFFFF" },
                      ].map(logo => (
                        <div key={logo.name} className="flex items-center gap-2.5 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                          <img src={`https://cdn.simpleicons.org/${logo.icon}/${logo.color}`} alt={logo.name} className="w-5 h-5" />
                          <span className="text-[0.75rem] font-bold uppercase tracking-widest">{logo.name}</span>
                        </div>
                      ))}
                    </div>
                  ))}
               </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[3] opacity-40">
              <div className="w-6 h-10 border-2 border-slate-500 rounded-xl relative after:content-[''] after:absolute after:top-2 after:left-1/2 after:-translate-x-1/2 after:w-1 after:h-1 after:bg-white after:rounded-full after:animate-[scroll-wheel-premium_1.8s_infinite]"></div>
            </div>
          </div>
        </div>
      </section>

      <main className="container max-w-[1240px] mx-auto relative z-10 bg-[#0b0b0b]/85 backdrop-blur-xl border border-white/5 rounded-3xl p-8 md:p-12 -mt-20 mb-20">
        {/* Skills Section */}
        <section id="skills" className="mb-24">
          <h2 className="text-3xl font-outfit font-bold gradient-text text-center mb-12">{data.titles.skills_title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.skills.map(skill => (
              <div key={skill.name} className="flex justify-between items-center p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                <span className="font-medium">{skill.name}</span>
                <div className="text-right">
                  <div className="text-xs text-slate-400 mb-1">{skill.level}</div>
                  <div className="flex gap-0.5 text-yellow-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < skill.score ? "text-yellow-400" : "text-white/20"}>★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-24">
          <h2 className="text-3xl font-outfit font-bold gradient-text text-center mb-12">{data.titles.experience_title}</h2>
          <div className="relative max-w-3xl mx-auto pl-10 border-l border-white/10">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="relative mb-12 group">
                <div className="absolute -left-[51px] top-0 w-[42px] h-[42px] bg-indigo-600 rounded-full flex items-center justify-center border-4 border-[#0b0b0b] shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                   <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="glass-panel p-8 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                  <div className="text-indigo-400 font-bold text-sm mb-2">{exp.date}</div>
                  <h4 className="text-xl font-bold mb-1">{exp.title}</h4>
                  <div className="text-slate-400 mb-4">{exp.company}</div>
                  <ul className="space-y-3">
                    {exp.desc.map((d, i) => (
                      <li key={i} className="text-slate-400 text-sm flex gap-3">
                        <span className="text-indigo-500 font-bold mt-0.5">▹</span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-24 text-white">
          <h2 className="text-3xl font-outfit font-bold gradient-text text-center mb-12">{data.titles.projects_title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.projects.map((proj, idx) => (
              <div key={idx} className="project-card glass-panel p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col hover:border-indigo-500/40 transition-all">
                <div 
                  className="w-full aspect-video rounded-lg mb-6 overflow-hidden bg-white/5 cursor-pointer"
                  onClick={() => window.open(proj.link, '_blank')}
                >
                  <img 
                    src={`https://api.microlink.io/?url=${encodeURIComponent(proj.link)}&screenshot=true&meta=false&embed=screenshot.url`} 
                    alt={proj.title}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-xl font-bold mb-1 flex items-center justify-between">
                  {proj.title}
                  <a href={proj.link} target="_blank" className="text-indigo-400 text-sm hover:underline"><i className="fa-solid fa-arrow-up-right-from-square"></i></a>
                </h4>
                <div className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">{proj.subtitle}</div>
                <p className="text-slate-400 text-sm mb-6 flex-grow">{proj.desc}</p>
                
                <div className="flex gap-3 flex-wrap">
                  {proj.link.includes('webflow.io') ? (
                    <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3 py-1 rounded-md text-[10px] font-bold">
                       <img src="https://cdn.simpleicons.org/webflow/4353FF" className="h-3" /> WEBFLOW
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1 rounded-md text-[10px] font-bold">
                       <img src="https://cdn.simpleicons.org/vercel/FFFFFF" className="h-2.5" /> VERCEL
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: data.titles.stack_title, list: data.lists.stack },
            { title: data.titles.edu_title, list: data.lists.edu },
            { title: data.titles.comp_title, list: data.lists.comp },
          ].map((card, i) => (
            <div key={i} className="glass-panel p-8 bg-white/5 border border-white/10 rounded-2xl">
              <h4 className="text-lg font-bold gradient-text mb-6">{card.title}</h4>
              <ul className="space-y-4">
                {card.list.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-400 flex gap-3" dangerouslySetInnerHTML={{ __html: `<span>▹</span> ${item}` }}></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </main>

      <footer className="py-12 text-center text-slate-500 text-sm border-t border-white/5 relative z-10">
        <p>&copy; 2026 José Figueroa. {data.titles.footer_text}</p>
      </footer>
    </div>
  );
}
