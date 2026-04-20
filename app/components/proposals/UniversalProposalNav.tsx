'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function UniversalProposalNav({ clientName, lang = 'es' }: { clientName: string; lang?: 'en' | 'es' }) {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="flex items-center gap-3"
        >
          <div className="relative w-12 h-12">
            <Image 
              src="/images/universa_logo.png" 
              alt="Universa Agency" 
              fill 
              className="object-contain"
            />
          </div>
          <span className="font-sans font-bold text-lg tracking-tight text-white/90 ml-1">
            Universa Agency
          </span>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
          className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full"
        >
          <div className="w-2 h-2 rounded-full bg-[#2ddc80] animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-tighter text-white/60">
            {lang === 'en' ? 'Proposal for:' : 'Propuesta para:'} <span className="text-white">{clientName}</span>
          </span>
        </motion.div>
      </div>
    </nav>
  );
}
