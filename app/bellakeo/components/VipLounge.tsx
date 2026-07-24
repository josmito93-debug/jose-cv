'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Image from 'next/image';

interface VipLoungeProps {
  onEnter: () => void;
}

export const VipLounge: React.FC<VipLoungeProps> = ({ onEnter }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Target date: August 7th (current year or next)
    const targetDate = new Date();
    targetDate.setMonth(7); // August
    targetDate.setDate(7);
    targetDate.setHours(20, 0, 0, 0); // 8:00 PM

    // If target date is in the past, move it to next year
    if (targetDate.getTime() < Date.now()) {
      targetDate.setFullYear(targetDate.getFullYear() + 1);
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center items-center text-center p-6 overflow-hidden">
      {/* Background cyberpunk atmospheric effects */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid line background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Floating particles */}
      <div className="absolute top-10 w-2 h-2 bg-indigo-400 rounded-full blur-xs opacity-50 animate-bounce" />
      <div className="absolute bottom-20 left-10 w-3 h-3 bg-purple-400 rounded-full blur-xs opacity-30 animate-pulse" />

      {/* Main card panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-4xl bg-black/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 md:p-12 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Holographic border accent lines */}
        <div className="absolute top-0 left-0 w-20 h-px bg-indigo-500" />
        <div className="absolute top-0 left-0 w-px h-20 bg-indigo-500" />
        <div className="absolute bottom-0 right-0 w-20 h-px bg-purple-500" />
        <div className="absolute bottom-0 right-0 w-px h-20 bg-purple-500" />

        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="h-px w-8 bg-indigo-500/30" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400">
            PRESALE ACCESS LOUNGE
          </span>
          <span className="h-px w-8 bg-indigo-500/30" />
        </div>

        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-[280px] h-[210px] md:w-[380px] md:h-[285px] filter drop-shadow-[0_0_30px_rgba(99,102,241,0.35)]"
          >
            <Image
              src="/bellakeo_logo.png"
              alt="BELLakeo LAND"
              fill
              className="object-contain"
              priority
            />
          </motion.div>
        </div>

        <p className="text-zinc-400 text-sm md:text-base max-w-lg mx-auto font-medium mb-12">
          Adéntrate en la fiesta futurista más exclusiva de Memphis. Una fusión de tecnología, sonido inmersivo de alta fidelidad y espectáculos visuales holográficos.
        </p>

        {/* Countdown Timer */}
        <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-12">
          {[
            { value: timeLeft.days, label: 'Días' },
            { value: timeLeft.hours, label: 'Horas' },
            { value: timeLeft.minutes, label: 'Minutos' },
            { value: timeLeft.seconds, label: 'Segundos' },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col bg-white/[0.02] border border-white/5 rounded-xl p-3 md:p-4 backdrop-blur-md">
              <span className="text-xl md:text-3xl font-black text-white tracking-tighter">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-black uppercase text-zinc-500 tracking-wider mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Event Quick Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-b border-white/5 py-8 mb-12 max-w-2xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <Calendar className="w-5 h-5 text-indigo-400" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Fecha</p>
              <p className="text-xs font-bold text-white uppercase">Viernes, 7 Agosto</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Lugar</p>
              <p className="text-xs font-bold text-white uppercase">Blue Hookah, Memphis</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Clock className="w-5 h-5 text-indigo-400" />
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Horario</p>
              <p className="text-xs font-bold text-white uppercase">8:00 PM - 5:00 AM</p>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={onEnter}
          className="relative px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-wider rounded-xl overflow-hidden shadow-lg flex items-center gap-3 mx-auto transition-all"
        >
          <span>Acceder a la Experiencia</span>
          <ArrowRight className="w-4 h-4 text-black" />
        </motion.button>
      </motion.div>
    </div>
  );
};
