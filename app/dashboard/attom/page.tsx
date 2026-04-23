'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, RefreshCcw, ExternalLink, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function AttomDashboard() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/attom/clients');
      const data = await res.json();
      if (data.success) {
        setClients(data.data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-32">
      
      {/* Header */}
      <div className="relative -mx-10 px-10 py-6 border-b border-white/5 bg-[#0C0C0E]/30 backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded-md text-[9px] font-black uppercase text-purple-400 italic">ATTOM MODULE</div>
              <div className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-[9px] font-black uppercase text-zinc-500">Service: Web Construction</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/5 rounded-2xl text-purple-400">
                <Globe className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black tracking-tight italic uppercase">Webs <span className="text-zinc-500">Pendientes</span></h2>
            </div>
          </div>
          
          <button 
            onClick={fetchClients}
            className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all text-white"
          >
            <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refrescar Lista
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-[#111113]/50 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest italic text-white">Cola de Construcción</h3>
          <span className="text-[10px] font-black text-zinc-500">{clients.length} Proyectos Detectados</span>
        </div>

        <div className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-600">Negocio</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-600">Contacto</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-600">Estado</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-600">Fecha Solicitud</th>
                  <th className="px-10 py-6 text-[9px] font-black uppercase tracking-widest text-zinc-600 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <RefreshCcw className="w-8 h-8 text-purple-500 animate-spin" />
                        <p className="text-[10px] font-black uppercase text-zinc-700 italic">Sincronizando con Airtable...</p>
                      </div>
                    </td>
                  </tr>
                ) : clients.length > 0 ? clients.map((client) => (
                  <tr key={client.id} className="group hover:bg-white/[0.01] transition-colors">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                          <span className="text-lg">🏢</span>
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white italic uppercase tracking-tight">{client.businessName}</h4>
                          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest mt-1">ID: {client.id.substring(0,8)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-zinc-300 uppercase">{client.contactName}</p>
                        <p className="text-[10px] font-bold text-zinc-600">{client.email || client.phone}</p>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase ${
                        client.status === 'PAID' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      }`}>
                        {client.status === 'PAID' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {client.status === 'PAID' ? 'Listo para publicar' : 'Pendiente Construcción'}
                      </div>
                    </td>
                    <td className="px-10 py-8 text-[10px] font-bold text-zinc-500">
                      {new Date(client.date).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-zinc-400 hover:text-white hover:bg-purple-600/20 hover:border-purple-500/30 transition-all">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-10 py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-6 bg-white/5 rounded-full">
                          <AlertCircle className="w-12 h-12 text-zinc-800" />
                        </div>
                        <p className="text-sm font-black text-zinc-700 italic uppercase">No hay proyectos en cola actualmente</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-8 border-t border-white/5 bg-white/[0.01]">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-emerald-500" />
             ATTOM AI System - Intelligence Node Connected
          </p>
        </div>
      </div>

    </div>
  );
}
