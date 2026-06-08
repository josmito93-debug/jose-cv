'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  Database,
  Layers,
  Globe,
  Mail,
  MapPin,
  Calendar,
  ExternalLink,
  Code,
  Zap,
  ArrowUpRight,
  Briefcase,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { siteData } from '@/lib/cv-data';

const SpaceRocks = dynamic(() => import('@/app/components/proposals/SpaceRocks'), { ssr: false });

export default function MePage() {
  const data = siteData.es;

  const personal = {
    name: 'Jose Figueroa',
    title: data.hero.subtitle,
    summary: data.hero.summary,
    location: 'Miami, FL',
    email: 'jose@universa.agency',
    github: 'https://github.com/josmito93',
    linkedin: 'https://linkedin.com/in/jose-figueroa',
  };

  const technicalSkills = {
    frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind', 'Webflow'],
    backend: ['Node.js', 'Supabase', 'PostgreSQL', 'Python', 'API REST'],
    tools: ['Vercel', 'n8n', 'Docker', 'Git', 'Airtable', 'GoHighLevel'],
    languages: ['Español (Nativo)', 'Inglés (Avanzado)'],
  };

  const techLogos = [
    { name: 'n8n', icon: 'n8n', color: 'EA4B71' },
    { name: 'Webflow', icon: 'webflow', color: '4353FF' },
    { name: 'React', icon: 'react', color: '61DAFB' },
    { name: 'Vercel', icon: 'vercel', color: 'FFFFFF' },
    { name: 'Supabase', icon: 'supabase', color: '3ECF8E' },
    { name: 'Airtable', icon: 'airtable', color: '18BFFF' },
    { name: 'Notion', icon: 'notion', color: 'FFFFFF' },
    { name: 'TypeScript', icon: 'typescript', color: '3178C6' },
    { name: 'Next.js', icon: 'nextdotjs', color: 'FFFFFF' },
  ];

  return (
    <main className="bg-[#0e131f] min-h-screen selection:bg-[#2ddc80] selection:text-[#0e131f] relative overflow-hidden">

      {/* ── Cinematic Animated Background Orbs ── */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 100, -50, 0], y: [0, -80, 50, 0], scale: [1, 1.1, 0.9, 1] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-[10%] -left-[5%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(45,220,128,0.15)_0%,transparent_70%)]"
        />
        <motion.div
          animate={{ x: [0, -120, 80, 0], y: [0, 100, -50, 0], scale: [1, 0.8, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[40%] -right-[10%] w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(45,220,128,0.1)_0%,transparent_70%)]"
        />
        <motion.div
          animate={{ x: [0, 50, -100, 0], y: [0, -50, 100, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[-10%] left-[15%] w-[450px] h-[450px] rounded-full bg-[radial-gradient(circle,rgba(45,220,128,0.12)_0%,transparent_70%)]"
        />
      </div>

      {/* ── Space Rocks (atmospheric) ── */}
      <SpaceRocks />

      {/* ── Floating Nav (same as proposals) ── */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="flex items-center gap-3"
          >
            <div className="relative w-10 h-10">
              <Image src="/images/universa_logo.png" alt="Universa Agency" fill className="object-contain" />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight text-white/90 ml-1">Universa Agency</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
            className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full"
          >
            <div className="w-2 h-2 rounded-full bg-[#2ddc80] animate-pulse shadow-[0_0_8px_#2ddc80]" />
            <span className="text-[10px] font-bold uppercase tracking-tighter text-white/60">
              Perfil — <span className="text-white">Jose Figueroa</span>
            </span>
          </motion.div>
        </div>
      </nav>

      <div className="relative z-10 w-full">

        {/* ══════════════════════════════════════════
            HERO — Full-screen, proposal layout
        ══════════════════════════════════════════ */}
        <section className="relative min-h-[90dvh] md:min-h-screen flex flex-col justify-center px-6 pt-32 md:pt-48 pb-20 md:pb-40 overflow-hidden bg-[#0e131f]">

          {/* Background aura */}
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.15, 0.1], x: [0, 30, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="absolute -top-[10%] -right-[5%] w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle,rgba(45,220,128,0.1)_0%,transparent_70%)]"
            />
            <div
              className="absolute inset-0 opacity-[0.02]"
              style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/carbon-fibre.png')" }}
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 items-center">

              {/* Left — Text block */}
              <div className="lg:col-span-7 flex flex-col items-start gap-8 md:gap-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  className="flex items-center gap-4"
                >
                  <div className="h-[2px] w-12 bg-[#2ddc80]" />
                  <span className="text-[#2ddc80] font-black text-[10px] md:text-xs uppercase tracking-[0.4em]">
                    Curriculum Vitae
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.1 }}
                  className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter text-white leading-[0.9] uppercase"
                >
                  {personal.name.split(' ')[0]}&nbsp;<br />
                  {personal.name.split(' ')[1]}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
                  className="text-base md:text-xl text-white/70 max-w-xl font-medium leading-relaxed"
                >
                  {personal.summary}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.3 }}
                  className="flex flex-wrap gap-5 pt-2"
                >
                  <ContactChip icon={<MapPin className="w-3.5 h-3.5" />} text={personal.location} />
                  <ContactChip icon={<Mail className="w-3.5 h-3.5" />} text={personal.email} />
                  <Link
                    href={personal.github}
                    target="_blank"
                    className="flex items-center gap-2 text-white/40 hover:text-[#2ddc80] text-[11px] font-black uppercase tracking-widest transition-colors"
                  >
                    <Code className="w-3.5 h-3.5" /> GitHub
                  </Link>
                  <Link
                    href={personal.linkedin}
                    target="_blank"
                    className="flex items-center gap-2 text-white/40 hover:text-[#2ddc80] text-[11px] font-black uppercase tracking-widest transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" /> LinkedIn
                  </Link>
                </motion.div>
              </div>

              {/* Right — Photo + Status card */}
              <div className="lg:col-span-5 flex flex-col gap-6 items-start lg:items-end">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.4 }}
                  className="relative w-full max-w-sm lg:max-w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl"
                >
                  <Image src="/profile.png" alt={personal.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0e131f]/80 via-transparent to-transparent" />
                  {/* Luxury bottom glow border */}
                  <div
                    className="absolute inset-0 rounded-[2.5rem] border-[2.5px] border-transparent pointer-events-none"
                    style={{
                      WebkitMaskImage: 'linear-gradient(to bottom, transparent 20%, black 100%)',
                      borderColor: 'rgba(45, 220, 128, 0.5)',
                    }}
                  />
                </motion.div>

                {/* Status card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.55 }}
                  className="relative group bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[2rem] w-full overflow-hidden shadow-2xl"
                >
                  <div className="absolute -bottom-1/2 -right-1/2 w-48 h-48 bg-[#2ddc80]/20 blur-[60px] rounded-full group-hover:bg-[#2ddc80]/30 transition-colors" />
                  <span className="text-[#2ddc80] text-[10px] uppercase tracking-widest font-black mb-2 relative z-10 block">
                    Estado Actual
                  </span>
                  <p className="text-white font-black text-xl md:text-2xl tracking-tight leading-tight uppercase relative z-10">
                    Disponible para proyectos
                  </p>
                </motion.div>
              </div>

            </div>
          </div>

          {/* Tech stack carousel (bottom) */}
          <div className="absolute bottom-0 w-full py-6 md:py-8 overflow-hidden backdrop-blur-sm border-t border-white/5">
            <div className="flex gap-20 animate-[scroll-left_40s_linear_infinite] w-max select-none">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-20 items-center">
                  {techLogos.map((logo, idx) => (
                    <div key={idx} className="flex items-center gap-4 opacity-40 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                      <img
                        src={`https://cdn.simpleicons.org/${logo.icon}/${logo.color}`}
                        alt={logo.name}
                        className="w-5 h-5 md:w-6 md:h-6 object-contain"
                      />
                      <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white">
                        {logo.name}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            STACK TÉCNICO
        ══════════════════════════════════════════ */}
        <section className="py-24 md:py-48 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 pointer-events-none opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,220,128,0.15)_0%,transparent_70%)]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">

              {/* Sticky header */}
              <div className="lg:col-span-4 flex flex-col items-start lg:sticky lg:top-32 h-fit">
                <ProposalLabel text="Ingeniería" />
                <SectionTitle text="Stack Técnico" />
                <div className="bg-[#2ddc80] px-6 py-4 rounded-2xl flex flex-col gap-1 items-start shadow-lg shadow-[#2ddc80]/10 mt-2">
                  <span className="text-[#0e131f] text-[10px] font-black uppercase tracking-widest opacity-60">Área</span>
                  <span className="text-[#0e131f] text-2xl font-black tracking-tight">Fullstack + AI</span>
                </div>
              </div>

              {/* Cards */}
              <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
                {[
                  { icon: <Terminal className="w-5 h-5 text-[#2ddc80]" />, title: 'Frontend', skills: technicalSkills.frontend },
                  { icon: <Database className="w-5 h-5 text-[#2ddc80]" />, title: 'Backend', skills: technicalSkills.backend },
                  { icon: <Layers className="w-5 h-5 text-[#2ddc80]" />, title: 'DevOps & Tools', skills: technicalSkills.tools },
                  { icon: <Globe className="w-5 h-5 text-[#2ddc80]" />, title: 'Idiomas', skills: technicalSkills.languages },
                ].map((group, index) => (
                  <LuxuryCard key={index} delay={index * 0.05}>
                    <div className="mb-8 flex-shrink-0 w-10 h-10 rounded-lg bg-[#2ddc80]/10 flex items-center justify-center border border-[#2ddc80]/20 shadow-[0_0_20px_rgba(45,220,128,0.1)] group-hover:scale-110 transition-transform duration-500">
                      {group.icon}
                    </div>
                    <h3 className="text-white font-black text-2xl md:text-3xl tracking-tight uppercase group-hover:text-[#2ddc80] transition-colors leading-none mb-4">
                      {group.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 mt-4">
                      {group.skills.map((s, idx) => (
                        <span key={idx} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-black uppercase tracking-widest hover:border-[#2ddc80]/30 hover:text-white transition-all">
                          {s}
                        </span>
                      ))}
                    </div>
                  </LuxuryCard>
                ))}
              </div>

            </div>
          </div>

          <Divider />
        </section>

        {/* ══════════════════════════════════════════
            EXPERIENCIA
        ══════════════════════════════════════════ */}
        <section className="py-24 md:py-48 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">

              <div className="lg:col-span-4 flex flex-col items-start lg:sticky lg:top-32 h-fit">
                <ProposalLabel text="Trayectoria" />
                <SectionTitle text="Experiencia" />
                <div className="bg-[#2ddc80] px-6 py-4 rounded-2xl flex flex-col gap-1 items-start shadow-lg shadow-[#2ddc80]/10 mt-2">
                  <span className="text-[#0e131f] text-[10px] font-black uppercase tracking-widest opacity-60">Años activo</span>
                  <span className="text-[#0e131f] text-2xl font-black tracking-tight">2022 – Present</span>
                </div>
              </div>

              <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
                {data.experience.map((exp, idx) => (
                  <LuxuryCard key={idx} delay={idx * 0.05}>
                    <div className="mb-8 flex-shrink-0 w-10 h-10 rounded-lg bg-[#2ddc80]/10 flex items-center justify-center border border-[#2ddc80]/20 shadow-[0_0_20px_rgba(45,220,128,0.1)] group-hover:scale-110 transition-transform duration-500">
                      <Briefcase className="w-5 h-5 text-[#2ddc80]" />
                    </div>
                    <div className="flex items-center gap-3 text-[#2ddc80] mb-3">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{exp.date}</span>
                    </div>
                    <h3 className="text-white font-black text-2xl md:text-3xl tracking-tight uppercase group-hover:text-[#2ddc80] transition-colors leading-none mb-1">
                      {exp.title}
                    </h3>
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-8">{exp.company}</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
                      {exp.desc.map((bullet, bidx) => (
                        <li key={bidx} className="flex items-start gap-3 text-sm md:text-base text-white/50 font-medium leading-relaxed group-hover:text-white/70 transition-colors">
                          <div className="mt-1.5 w-1.5 h-1.5 flex-shrink-0 rounded-full bg-[#2ddc80] shadow-[0_0_8px_#2ddc80]" />
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </LuxuryCard>
                ))}
              </div>

            </div>
          </div>

          <Divider />
        </section>

        {/* ══════════════════════════════════════════
            FORMACIÓN + VISIÓN ESTRATÉGICA
        ══════════════════════════════════════════ */}
        <section className="py-24 md:py-48 px-6 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full z-0 pointer-events-none opacity-20">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,220,128,0.15)_0%,transparent_70%)]" />
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">

              <div className="lg:col-span-4 flex flex-col items-start lg:sticky lg:top-32 h-fit">
                <ProposalLabel text="Académico" />
                <SectionTitle text="Formación" />
              </div>

              <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
                {data.lists.edu.map((edu, idx) => (
                  <LuxuryCard key={idx} delay={idx * 0.05}>
                    <div className="mb-6 flex-shrink-0 w-10 h-10 rounded-lg bg-[#2ddc80]/10 flex items-center justify-center border border-[#2ddc80]/20 shadow-[0_0_20px_rgba(45,220,128,0.1)] group-hover:scale-110 transition-transform duration-500">
                      <Zap className="w-5 h-5 text-[#2ddc80]" />
                    </div>
                    <p
                      className="text-white/70 text-base md:text-lg font-medium leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: edu }}
                    />
                  </LuxuryCard>
                ))}

                {/* Strategic Vision – full-width CTA card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="relative group overflow-hidden rounded-[2.5rem] bg-[#2ddc80] p-10 md:p-14 shadow-2xl shadow-[#2ddc80]/20"
                >
                  <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
                  <p className="text-[#2ddc80]/60 text-[10px] font-black uppercase tracking-widest mb-4 relative z-10">Visión Estratégica</p>
                  <h3 className="text-[#0e131f] font-black text-2xl md:text-3xl tracking-tight leading-tight uppercase relative z-10 mb-6">
                    Ingeniería + Negocio<br />en un mismo lenguaje.
                  </h3>
                  <p className="text-[#0e131f]/70 text-base md:text-lg font-medium leading-relaxed relative z-10 mb-8 max-w-lg">
                    Mi enfoque combina la rigurosidad técnica de un arquitecto de software con la visión comercial de un estratega digital. He liderado ecosistemas de alta conversión para marcas globales.
                  </p>
                  <Link
                    href="/#portfolio"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#0e131f] text-white rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform relative z-10 group/btn"
                  >
                    Ver Portafolio Completo
                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </Link>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            FOOTER
        ══════════════════════════════════════════ */}
        <footer className="py-16 px-6 border-t border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative w-9 h-9">
                <Image src="/images/universa_logo.png" alt="Logo" fill className="object-contain" />
              </div>
              <span className="text-white font-black text-lg italic tracking-tighter uppercase">Universa</span>
            </div>
            <p className="text-white/15 text-[10px] font-black uppercase tracking-[0.4em] text-center">
              © 2026 Jose Figueroa — All Rights Reserved.
            </p>
            <Link
              href="/"
              className="flex items-center gap-2 text-white/40 hover:text-[#2ddc80] transition-colors text-xs font-black uppercase tracking-widest"
            >
              Regresar a Universa
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </footer>

      </div>
    </main>
  );
}

/* ── Sub-components ── */

function ProposalLabel({ text }: { text: string }) {
  return (
    <div className="text-[#2ddc80] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 flex items-center gap-4">
      {text}
      <div className="h-[1px] w-8 bg-[#2ddc80]/30" />
    </div>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-[0.9] uppercase mb-6">
      {text}
    </h2>
  );
}

function ContactChip({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-white/40 font-bold text-[11px] uppercase tracking-widest">
      <span className="text-[#2ddc80]">{icon}</span>
      <span>{text}</span>
    </div>
  );
}

function LuxuryCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="group relative bg-[#0e131f]/70 backdrop-blur-md rounded-[2.5rem] transition-all duration-500 overflow-hidden flex flex-col p-10 md:p-14"
    >
      {/* Texture overlay */}
      <div
        className="absolute inset-0 z-0 opacity-[0.25] bg-repeat bg-[length:50px_50px] pointer-events-none"
        style={{ backgroundImage: "url('/images/texture.png')" }}
      />
      {/* Luxury gradient border */}
      <div
        className="absolute inset-0 rounded-[2.5rem] border-[2.5px] border-transparent transition-all duration-500 z-10 pointer-events-none"
        style={{
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 20%, black 100%)',
          borderColor: 'rgba(45, 220, 128, 0.5)',
        }}
      />
      {/* Bottom hover glow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 bg-[#2ddc80]/10 blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

function Divider() {
  return (
    <div className="w-full max-w-7xl mx-auto h-[1px] bg-white/5 mt-32 md:mt-48 shadow-[0_-10px_30px_rgba(45,220,128,0.05)]" />
  );
}
