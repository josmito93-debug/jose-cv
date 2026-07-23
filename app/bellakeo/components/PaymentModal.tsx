'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-2xl">
      {/* Laser beams / Glowing lines in background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-500/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="text-center p-8 max-w-md w-full relative"
      >
        {/* Floating animated logo text */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotateY: [0, 360, 360],
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block mb-8 relative"
        >
          <div className="text-4xl font-black text-indigo-400 tracking-[0.2em] filter drop-shadow-[0_0_15px_rgba(99,102,241,0.6)] uppercase">
            BK
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-1.5 -right-3 text-indigo-300"
          >
            <Sparkles className="w-4 h-4" />
          </motion.div>
        </motion.div>

        {/* Loading ring */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center">
            <div className="w-16 h-16 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <div className="absolute w-10 h-10 border border-purple-500/10 border-b-purple-400 rounded-full animate-spin [animation-direction:reverse]" />
          </div>
        </div>

        {/* Status text */}
        <motion.h3 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity }}
          className="text-base font-black tracking-widest uppercase text-white mb-2"
        >
          Preparando tu experiencia...
        </motion.h3>
        
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-6">
          Redireccionando al portal seguro de Stripe
        </p>

        {/* Encryption badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/[0.02] border border-white/5 text-zinc-400 text-[10px] font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Conexión Encriptada SSL
        </div>
      </motion.div>
    </div>
  );
};
