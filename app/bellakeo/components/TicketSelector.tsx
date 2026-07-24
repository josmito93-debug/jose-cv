'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Users, Ticket } from 'lucide-react';

export interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  includes: string[];
  icon: React.ReactNode;
  badge?: string;
  color: string;
  soldOut?: boolean;
}

interface TicketSelectorProps {
  tickets: TicketType[];
  selectedTicketId: string;
  onSelect: (ticketId: string) => void;
}

export const TicketSelector: React.FC<TicketSelectorProps> = ({
  tickets,
  selectedTicketId,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-4 py-8">
      {tickets.map((ticket, index) => {
        const isSelected = selectedTicketId === ticket.id;
        const isSoldOut = !!ticket.soldOut;

        return (
          <motion.div
            key={ticket.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={isSoldOut ? undefined : { 
              y: -8, 
              scale: 1.02,
              rotateX: 2,
              rotateY: 2,
              transition: { duration: 0.2 }
            }}
            onClick={() => {
              if (!isSoldOut) {
                onSelect(ticket.id);
              }
            }}
            className={`relative flex flex-col justify-between p-6 rounded-2xl border bg-black/40 backdrop-blur-xl transition-all duration-300 ${
              isSoldOut
                ? 'border-red-500/20 opacity-50 grayscale select-none cursor-not-allowed'
                : isSelected
                  ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.3)] bg-gradient-to-b from-indigo-950/20 to-black/60 cursor-pointer'
                  : 'border-white/10 hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)] cursor-pointer'
            } overflow-hidden`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Holographic background line glow */}
            <div className="absolute -top-[50%] -right-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(99,102,241,0.05)_0%,rgba(0,0,0,0)_70%)] pointer-events-none" />

            {isSoldOut ? (
              <span className="absolute top-4 right-4 bg-red-600 text-white text-[9px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                SOLD OUT
              </span>
            ) : ticket.badge ? (
              <span className="absolute top-4 right-4 bg-indigo-500 text-white text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                {ticket.badge}
              </span>
            ) : null}

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 ${
                  isSoldOut 
                    ? 'text-red-500/40 border-red-500/10'
                    : isSelected 
                      ? 'text-indigo-400 border-indigo-500/30' 
                      : 'text-zinc-400'
                }`}>
                  {ticket.icon}
                </div>
                <h3 className={`text-lg font-black tracking-tight uppercase ${isSoldOut ? 'text-zinc-500 line-through' : 'text-white'}`}>
                  {ticket.name}
                </h3>
              </div>

              <p className="text-xs text-zinc-400 mb-6 font-medium line-clamp-2">
                {ticket.description}
              </p>

              <div className="mb-6">
                <span className={`text-3xl font-black tracking-tighter ${isSoldOut ? 'text-zinc-500 line-through' : 'text-white'}`}>
                  ${ticket.price}
                </span>
                <span className="text-xs text-zinc-500 font-bold ml-1">USD</span>
              </div>

              <div className="space-y-3 mb-8">
                <p className="text-[10px] font-black uppercase tracking-wider text-zinc-500">
                  ¿Qué incluye?
                </p>
                {ticket.includes.map((include, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-zinc-400">
                    {isSoldOut ? (
                      <span className="text-red-500/40 shrink-0 font-bold text-[10px] mt-0.5">✕</span>
                    ) : (
                      <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    )}
                    <span className={isSoldOut ? 'line-through text-zinc-500' : ''}>{include}</span>
                  </div>
                ))}
              </div>
            </div>

            <motion.button
              whileTap={isSoldOut ? undefined : { scale: 0.97 }}
              disabled={isSoldOut}
              className={`w-full py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-300 ${
                isSoldOut
                  ? 'bg-red-950/20 text-red-500 border border-red-500/30 cursor-not-allowed'
                  : isSelected
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]'
                    : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
              }`}
            >
              {isSoldOut ? 'Agotado' : isSelected ? 'Seleccionado' : ticket.id === 'table' ? 'Reservar mesa' : 'Seleccionar'}
            </motion.button>
          </motion.div>
        );
      })}
    </div>
  );
};
