'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowUpRight, Globe, Zap, DollarSign } from 'lucide-react';

const projects = [
  {
    name: "Uncle Coyo",
    url: "https://unclecoyo.vercel.app/#menu",
    description: "Custom Mexican Food Platform",
    gradient: "from-[#f97316] to-[#ea580c]",
    icon: "🌮"
  },
  {
    name: "Empizzados",
    url: "https://empizzados-main.vercel.app",
    description: "High-Conversion Pizza Store",
    gradient: "from-[#ef4444] to-[#dc2626]",
    icon: "🍕"
  },
  {
    name: "Machete Burger",
    url: "https://macheteburger.vercel.app",
    description: "Premium Burger Ordering System",
    gradient: "from-[#fbbf24] to-[#d97706]",
    icon: "🍔"
  }
];

interface RelatedProjectsProps {
  lang?: 'en' | 'es';
}

export default function RelatedProjects({ lang = 'es' }: RelatedProjectsProps) {
  const content = {
    en: {
      title: "YOU MAY BE INTERESTED",
      subtitle: "We build custom platforms with private domains designed to bypass 3rd-party commissions and maximize your delivery profits.",
      cta: "See Example",
      badge: "PROFIT MAXIMIZER"
    },
    es: {
      title: "TAMBIÉN TE PUEDE INTERESAR",
      subtitle: "Construimos plataformas personalizadas con dominios propios diseñadas para evitar comisiones de terceros y maximizar tus ganancias por delivery.",
      cta: "Ver Ejemplo",
      badge: "MÁXIMO RENDIMIENTO"
    }
  }[lang];

  return (
    <section className="py-32 px-6 bg-[#080b14] border-t border-white/5 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[120px] rounded-full" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6"
          >
            <Zap className="w-3 h-3 text-indigo-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">
              {content.badge}
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-6 uppercase"
          >
            {content.title}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-zinc-500 text-lg md:text-xl max-w-3xl mx-auto font-medium"
          >
            {content.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.a
              key={index}
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white/[0.03] border border-white/5 rounded-[2.5rem] p-8 md:p-10 overflow-hidden flex flex-col h-full"
            >
              {/* Card Gradient Background Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="text-5xl mb-8 group-hover:scale-110 transition-transform duration-500 w-fit">
                  {project.icon}
                </div>
                
                <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter mb-2 group-hover:text-indigo-400 transition-colors">
                  {project.name}
                </h3>
                
                <p className="text-zinc-500 font-medium mb-12 flex-1">
                  {project.description}
                </p>
                
                <div className="flex items-center gap-3 text-white font-black text-xs uppercase tracking-widest border-t border-white/5 pt-8">
                  {content.cta}
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </div>
              </div>

              {/* Decorative Corner Icon */}
              <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe className="w-32 h-32 text-white" />
              </div>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 flex justify-center"
        >
          <div className="flex items-center gap-8 opacity-20 hover:opacity-50 transition-opacity grayscale hover:grayscale-0">
             <DollarSign className="w-8 h-8 text-white" />
             <div className="h-8 w-[1px] bg-white/20" />
             <span className="text-xs font-black uppercase tracking-[0.4em] text-white">Direct Profit Model</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
