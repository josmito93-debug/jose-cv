'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Plus, 
  Globe, 
  User, 
  Mail, 
  Briefcase,
  Layout,
  Rocket
} from 'lucide-react';
import Link from 'next/link';

export default function NewClientPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    contactName: '',
    contactEmail: '',
    plan: 'Design + Hosting',
    deposit: '30'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to Airtable
    setTimeout(() => {
      setLoading(false);
      router.push('/admin/clients');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="flex items-center gap-6">
        <Link href="/admin/clients">
          <motion.button 
            whileHover={{ x: -5 }}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
        </Link>
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-1">Nuevo Proyecto</h2>
          <p className="text-zinc-500 font-medium">Registra un nuevo cliente en el ecosistema Attom.</p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-12 backdrop-blur-3xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] -mr-16 -mt-16"></div>
        
        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">Nombre del Negocio</label>
              <div className="relative group">
                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  required
                  type="text" 
                  value={formData.businessName}
                  onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-16 pr-8 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                  placeholder="Ej: Refrigeración J&F"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">Tipo de Industria</label>
              <div className="relative group">
                <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  required
                  type="text" 
                  value={formData.businessType}
                  onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-16 pr-8 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                  placeholder="Ej: Industrial / E-commerce"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">Nombre de Contacto</label>
              <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  required
                  type="text" 
                  value={formData.contactName}
                  onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-16 pr-8 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                  placeholder="Ej: José Figueroa"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 ml-2">Email</label>
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  required
                  type="email" 
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  className="w-full bg-black/20 border border-white/5 rounded-2xl py-4 pl-16 pr-8 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-bold"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                <Layout className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Revenue Initial</p>
                <p className="text-3xl font-black text-white">${formData.deposit}.00 <span className="text-xs text-zinc-600 ml-1">USD</span></p>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="w-full md:w-auto px-12 py-5 bg-indigo-600 text-white font-black rounded-2xl shadow-2xl shadow-indigo-600/20 flex items-center justify-center gap-4 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Rocket className="w-5 h-5" /> Iniciar Proyecto
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600 justify-center">
        <span>Airtable Sync On</span>
        <div className="w-1 h-1 rounded-full bg-zinc-800" />
        <span>Vercel Gateway Ready</span>
      </div>
    </div>
  );
}
