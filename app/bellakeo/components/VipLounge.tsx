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

      {/* Main card panel - max width set to strictly fit most screens without scroll */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-[1920px] 2xl:max-w-7xl bg-black/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-6 md:p-10 shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col md:flex-row items-center gap-8 md:gap-12 mx-auto"
      >
        {/* Holographic border accent lines */}
        <div className="absolute top-0 left-0 w-20 h-px bg-indigo-500" />
        <div className="absolute top-0 left-0 w-px h-20 bg-indigo-500" />
        <div className="absolute bottom-0 right-0 w-20 h-px bg-purple-500" />
        <div className="absolute bottom-0 right-0 w-px h-20 bg-purple-500" />

        {/* Left column: Logo and Text */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <span className="h-px w-8 bg-indigo-500/30" />
            <span className="text-[10px] font-black tracking-[0.3em] uppercase text-indigo-400">
              PRESALE ACCESS LOUNGE
            </span>
          </div>

          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="relative w-[240px] h-[180px] md:w-[340px] md:h-[240px] filter drop-shadow-[0_0_30px_rgba(99,102,241,0.35)] mb-4 md:mb-6"
          >
            <Image
              src="/bellakeo_logo.png"
              alt="BELLakeo LAND"
              fill
              className="object-contain object-center md:object-left"
              priority
            />
          </motion.div>

          <p className="text-zinc-400 text-xs md:text-sm max-w-md font-medium mb-6 md:mb-8">
            Adéntrate en la fiesta futurista más exclusiva de Memphis. Una fusión de tecnología, sonido inmersivo de alta fidelidad y espectáculos visuales holográficos.
          </p>
        </div>

        {/* Right column: Details, Timer and Button */}
        <div className="flex-1 flex flex-col items-center md:items-end w-full">
          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-2 md:gap-4 w-full max-w-md mb-8 md:mb-10">
            {[
              { value: timeLeft.days, label: 'Días' },
              { value: timeLeft.hours, label: 'Horas' },
              { value: timeLeft.minutes, label: 'Minutos' },
              { value: timeLeft.seconds, label: 'Segundos' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col bg-white/[0.02] border border-white/5 rounded-xl p-3 backdrop-blur-md items-center">
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-white/5 py-6 mb-8 md:mb-10 w-full max-w-md">
            <div className="flex items-center md:justify-end gap-3">
              <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Fecha</p>
                <p className="text-[10px] font-bold text-white uppercase line-clamp-1">Viernes, 7 Ago</p>
              </div>
            </div>
            <div className="flex items-center md:justify-end gap-3">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Lugar</p>
                <p className="text-[10px] font-bold text-white uppercase line-clamp-1">Blue Hookah</p>
              </div>
            </div>
            <div className="flex items-center md:justify-end gap-3">
              <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
              <div className="text-left">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">Horario</p>
                <p className="text-[10px] font-bold text-white uppercase line-clamp-1">8:00 PM</p>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onEnter}
            className="relative px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-wider rounded-xl overflow-hidden shadow-lg flex items-center justify-center gap-3 w-full max-w-md transition-all"
          >
            <span>Acceder a la Experiencia</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
