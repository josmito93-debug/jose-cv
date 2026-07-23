'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, Users, Plus, X } from 'lucide-react';

interface CheckoutFormProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    attendeeCount: number;
    guests: string[];
  };
  onChange: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  errors: Record<string, string>;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  formData,
  onChange,
  onSubmit,
  errors,
}) => {
  const [guestInput, setGuestInput] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const handleAddGuest = () => {
    if (guestInput.trim() && formData.guests.length < formData.attendeeCount - 1) {
      onChange({
        ...formData,
        guests: [...formData.guests, guestInput.trim()],
      });
      setGuestInput('');
    }
  };

  const handleRemoveGuest = (index: number) => {
    onChange({
      ...formData,
      guests: formData.guests.filter((_, i) => i !== index),
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6 w-full max-w-2xl mx-auto bg-black/40 backdrop-blur-xl border border-white/5 p-6 md:p-8 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <div className="border-b border-white/5 pb-4 mb-6">
        <h3 className="text-sm font-black tracking-wider uppercase text-white">Información del Comprador</h3>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">VINCULA TUS TICKETS Y ACCESOS</p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-indigo-400" />
            Nombre Completo
          </label>
          <div className="relative">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Ingresa tu nombre y apellido"
              className={`w-full bg-black/60 border ${
                errors.fullName ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-indigo-500/50'
              } focus:ring-1 focus:ring-indigo-500/30 rounded-xl px-4 py-3.5 text-xs text-white placeholder-zinc-600 transition-all outline-none`}
            />
          </div>
          {errors.fullName && (
            <p className="text-[10px] text-red-500 font-bold tracking-wide uppercase">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-indigo-400" />
            Correo Electrónico
          </label>
          <div className="relative">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="correo@ejemplo.com"
              className={`w-full bg-black/60 border ${
                errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-indigo-500/50'
              } focus:ring-1 focus:ring-indigo-500/30 rounded-xl px-4 py-3.5 text-xs text-white placeholder-zinc-600 transition-all outline-none`}
            />
          </div>
          {errors.email && (
            <p className="text-[10px] text-red-500 font-bold tracking-wide uppercase">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-indigo-400" />
            Teléfono Móvil
          </label>
          <div className="relative">
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 000-0000"
              className={`w-full bg-black/60 border ${
                errors.phone ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-indigo-500/50'
              } focus:ring-1 focus:ring-indigo-500/30 rounded-xl px-4 py-3.5 text-xs text-white placeholder-zinc-600 transition-all outline-none`}
            />
          </div>
          {errors.phone && (
            <p className="text-[10px] text-red-500 font-bold tracking-wide uppercase">{errors.phone}</p>
          )}
        </div>

        {/* Attendee count (visual feedback only, driven by cart) */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            Cantidad de Asistentes
          </label>
          <div className="w-full bg-white/[0.02] border border-white/5 rounded-xl px-4 py-3.5 text-xs text-indigo-300 font-black">
            {formData.attendeeCount} {formData.attendeeCount === 1 ? 'Persona' : 'Personas'}
          </div>
        </div>

        {/* Dynamic Guest Name inputs if attendee count > 1 */}
        {formData.attendeeCount > 1 && (
          <div className="space-y-3 pt-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
              Nombres de Invitados
            </label>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
              REGISTRA SUS NOMBRES PARA ACCESO PREFERENCIAL (MÁX. {formData.attendeeCount - 1})
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={guestInput}
                onChange={e => setGuestInput(e.target.value)}
                placeholder="Nombre completo del invitado"
                disabled={formData.guests.length >= formData.attendeeCount - 1}
                className="flex-1 bg-black/60 border border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 rounded-xl px-4 py-3 text-xs text-white placeholder-zinc-600 outline-none disabled:opacity-50"
              />
              <button
                type="button"
                onClick={handleAddGuest}
                disabled={formData.guests.length >= formData.attendeeCount - 1}
                className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-40"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              <AnimatePresence>
                {formData.guests.map((guest, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-black uppercase px-3 py-1.5 rounded-full"
                  >
                    <span>{guest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveGuest(idx)}
                      className="text-indigo-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};
