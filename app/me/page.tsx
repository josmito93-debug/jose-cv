'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  GraduationCap, 
  Code, 
  Terminal, 
  Database, 
  Cloud, 
  Globe, 
  Mail, 
  MapPin, 
  ArrowLeft,
  Calendar,
  Layers,
  Award,
  ExternalLink,
  User,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { siteData } from '@/lib/cv-data';

export default function CVPage() {
  // Use Spanish version as default based on user preferences
  const data = siteData.es;
  const personal = {
    name: "Jose Figueroa",
    title: data.hero.subtitle,
    summary: data.hero.summary,
    location: "Miami, FL",
    email: "jose@universa.agency",
    github: "https://github.com/josmito93",
    linkedin: "https://linkedin.com/in/jose-figueroa"
  };

  const technicalSkills = {
    frontend: ["React", "Next.js", "TypeScript", "Tailwind", "Webflow"],
    backend: ["Node.js", "Supabase", "PostgreSQL", "Python", "API REST"],
    tools: ["Vercel", "n8n", "Docker", "Git", "Airtable", "GoHighLevel"],
    languages: ["Español (Nativo)", "Inglés (Avanzado)"]
  };

  return (
    <div className="bg-[#0e131f] text-white min-h-screen font-sans selection:bg-[#2ddc80] selection:text-[#0e131f]">
      
      {/* Background Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#2ddc80]/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#2ddc80]/5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full px-8 py-6 backdrop-blur-md border-b border-white/5 bg-[#0e131f]/50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white/60 hover:text-[#2ddc80] transition-colors group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">Regresar a Universa</span>
          </Link>
          <div className="flex items-center gap-4">
            <Image src="/images/universa_logo.png" alt="Logo" width={32} height={32} />
            <span className="text-xl font-black italic tracking-tighter uppercase leading-none">Universa</span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-6xl mx-auto px-8 py-20 lg:py-32">
        
        {/* Profile Header */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center mb-32">
          <div className="lg:col-span-4">
             <div className="relative aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl p-2 bg-[#162033]/50 backdrop-blur-sm">
                <Image src="/profile.png" alt={personal.name} fill className="object-cover rounded-[2.5rem]" />
             </div>
          </div>
          <div className="lg:col-span-8 space-y-8">
             <motion.div 
               initial={{ opacity: 0, x: -20 }}
               animate={{ opacity: 1, x: 0 }}
               className="flex items-center gap-4"
             >
                <div className="h-[2px] w-12 bg-[#2ddc80]" />
                <span className="text-[#2ddc80] font-black text-xs uppercase tracking-[0.4em]">{personal.title}</span>
             </motion.div>
             <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9]">
               {personal.name.split(' ')[0]} <br />
               <span className="text-white/20">{personal.name.split(' ')[1]}</span>
             </h1>
             <p className="text-white/60 text-xl md:text-2xl font-medium leading-relaxed max-w-2xl">
               {personal.summary}
             </p>
             <div className="flex flex-wrap gap-6 pt-4">
                <ContactInfo icon={<MapPin className="w-4 h-4" />} text={personal.location} />
                <ContactInfo icon={<Mail className="w-4 h-4" />} text={personal.email} />
                <Link href={personal.github} target="_blank" className="hover:text-[#2ddc80] transition-colors"><Code /></Link>
                <Link href={personal.linkedin} target="_blank" className="hover:text-[#2ddc80] transition-colors"><Globe /></Link>
             </div>
          </div>
        </section>

        {/* Technical Skills Grid */}
        <section className="mb-40">
           <SectionHeader title="Stack Técnico" subtitle="INGENIERÍA" />
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <SkillGroup icon={<Terminal />} title="Frontend" skills={technicalSkills.frontend} />
              <SkillGroup icon={<Database />} title="Backend" skills={technicalSkills.backend} />
              <SkillGroup icon={<Layers />} title="DevOps & Tools" skills={technicalSkills.tools} />
              <SkillGroup icon={<Globe />} title="Languages" skills={technicalSkills.languages} />
           </div>
        </section>

        {/* Experience Timeline */}
        <section className="mb-40">
           <SectionHeader title="Experiencia" subtitle="TRAYECTORIA" />
           <div className="space-y-12">
              {data.experience.map((exp, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group relative grid grid-cols-1 md:grid-cols-12 gap-8 p-10 rounded-[2.5rem] bg-[#162033]/30 border border-white/5 hover:border-[#2ddc80]/20 transition-all"
                >
                   <div className="md:col-span-3">
                      <div className="flex items-center gap-3 text-[#2ddc80] mb-2">
                         <Calendar className="w-4 h-4" />
                         <span className="text-[10px] font-black uppercase tracking-widest">{exp.date}</span>
                      </div>
                      <h3 className="text-2xl font-black text-white">{exp.title}</h3>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest">{exp.company}</p>
                   </div>
                   <div className="md:col-span-9">
                      <div className="space-y-4 mb-6">
                        {exp.desc.map((bullet, bidx) => (
                          <p key={bidx} className="text-white/60 text-lg leading-relaxed font-medium">
                            • {bullet}
                          </p>
                        ))}
                      </div>
                   </div>
                </motion.div>
              ))}
           </div>
        </section>

        {/* Education & Certs */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-20">
           <div>
              <SectionHeader title="Formación" subtitle="ACADÉMICO" />
              <div className="space-y-8">
                 {data.lists.edu.map((edu, idx) => (
                   <div key={idx} className="p-8 rounded-3xl bg-white/5 border border-white/10">
                      <p className="text-white/60 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: edu }} />
                   </div>
                 ))}
              </div>
           </div>
           <div>
              <SectionHeader title="Ecosistema" subtitle="PROYECTOS" />
              <div className="p-10 rounded-[2.5rem] bg-gradient-to-br from-[#2ddc80]/10 to-transparent border border-[#2ddc80]/20">
                 <h4 className="text-2xl font-black text-white mb-6">Visión Estratégica</h4>
                 <p className="text-white/60 text-lg leading-relaxed mb-8">
                   Mi enfoque combina la rigurosidad técnica de un arquitecto de software con la visión comercial de un estratega digital. He liderado el despliegue de múltiples ecosistemas de alta conversión para marcas globales.
                 </p>
                 <Link href="/#portfolio" className="inline-flex items-center gap-4 px-8 py-4 bg-white text-[#0e131f] rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                    Ver Portafolio Completo
                    <ExternalLink className="w-4 h-4" />
                 </Link>
              </div>
           </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="py-20 px-8 border-t border-white/5 text-center">
         <div className="flex items-center justify-center gap-4 mb-8">
            <Image src="/images/universa_logo.png" alt="Logo" width={32} height={32} />
            <span className="text-xl font-black italic tracking-tighter uppercase leading-none">Universa</span>
         </div>
         <p className="text-white/10 text-[10px] font-black uppercase tracking-[0.4em]">© 2026 Jose Figueroa — All Rights Reserved.</p>
      </footer>
    </div>
  );
}

function ContactInfo({ icon, text }: { icon: any; text: string }) {
  return (
    <div className="flex items-center gap-3 text-white/40 font-bold text-xs">
       <div className="text-[#2ddc80]">{icon}</div>
       <span>{text}</span>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-12 space-y-4">
       <span className="text-[#2ddc80] font-black text-[10px] uppercase tracking-[0.4em]">{subtitle}</span>
       <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-white">{title}</h2>
    </div>
  );
}

function SkillGroup({ icon, title, skills }: { icon: any; title: string; skills: string[] }) {
  return (
    <div className="p-10 rounded-[2.5rem] bg-[#162033]/30 border border-white/5 hover:border-[#2ddc80]/20 transition-all group">
       <div className="w-12 h-12 rounded-xl bg-[#2ddc80]/10 flex items-center justify-center text-[#2ddc80] mb-8 border border-[#2ddc80]/20 group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <h4 className="text-white font-black text-xl mb-6 tracking-tight">{title}</h4>
       <div className="flex flex-wrap gap-2">
          {skills.map((s, idx) => (
            <span key={idx} className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{s}{idx < skills.length - 1 ? ' •' : ''}</span>
          ))}
       </div>
    </div>
  );
}
