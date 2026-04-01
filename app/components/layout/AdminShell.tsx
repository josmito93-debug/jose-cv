'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Users, 
  Globe, 
  ShieldCheck, 
  LayoutDashboard,
  Rocket,
  Search,
  Bell,
  Plus,
  Zap,
  Activity,
  Database,
  ArrowLeft,
  FileText
} from 'lucide-react';

interface ShellProps {
  children: React.ReactNode;
}

function NavItem({ href, icon: Icon, label, active }: { href: string; icon: any; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all group relative ${
        active 
          ? 'text-white' 
          : 'text-zinc-500 hover:text-zinc-300'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="pill-admin"
          className="absolute inset-0 bg-indigo-500/10 border border-indigo-500/20 rounded-xl -z-10 shadow-xl"
        />
      )}
      <div className={`transition-transform group-hover:scale-110 ${active ? 'text-indigo-400' : ''}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs font-bold tracking-tight">{label}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />}
    </Link>
  );
}

export default function AdminShell({ children }: ShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentTitle = "Universa Agency HQ";
  const accentColorClass = 'bg-indigo-600';

  return (
    <div className="min-h-screen bg-[#08080A] text-zinc-100 font-inter antialiased flex overflow-hidden">
      {/* Sidebar - Professional System Admin Style */}
      <aside className="hidden lg:flex w-72 flex-col bg-[#0C0C0E] border-r border-white/5 relative z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20 group hover:scale-105 transition-all">
              <img 
                src="/images/universa_logo.png" 
                alt="Universa" 
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.style.display = 'none')} 
              />
            </div>
            <span className="text-sm font-black tracking-tighter uppercase italic text-white flex flex-col">
              Universa Agency <span className="text-[8px] text-indigo-400 -mt-1 font-bold">Headquarter</span>
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
           <div className="px-5 mb-4">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">HQ Control</p>
           </div>
           
           <NavItem href="/admin" icon={LayoutDashboard} label="HQ Overview" active={pathname === '/admin'} />
           <NavItem href="/admin" icon={Users} label="Client Registry" active={pathname === '/admin'} />
           
           <div className="px-5 mt-8 mb-4">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">Automation</p>
           </div>
           <NavItem href="/collector" icon={Zap} label="Attom Collector" active={pathname === '/collector'} />
           
           <div className="px-5 mt-8 mb-4">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">System</p>
           </div>
           <NavItem href="/dashboard" icon={Globe} label="Switch to JF.OS" active={false} />
        </nav>

        <div className="p-8 border-t border-white/5">
           <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-900/30 border border-indigo-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">José Figueroa</p>
                    <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Active Session</p>
                 </div>
              </div>
              <button 
                onClick={() => window.location.href = '/admin/clients/new'}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[9px] font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-indigo-600/20"
              >
                 <Plus className="w-3.5 h-3.5" /> New Client
              </button>
           </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 shrink-0 border-b border-white/5 flex items-center justify-between px-10 bg-[#0C0C0E]/50 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4">
             <div className="lg:hidden p-2 bg-white/5 rounded-lg cursor-pointer" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-5 h-5" />
             </div>
             <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Node Synchronized with Vercel API</h3>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input 
                type="text" 
                placeholder="Search clients..." 
                className="bg-white/5 border border-white/5 rounded-xl py-2.5 pl-11 pr-5 text-[10px] font-bold focus:outline-none focus:border-white/10 transition-all w-48"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-zinc-500 relative">
                 <Bell className="w-4 h-4" />
                 <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full border-2 border-[#0C0C0E]" />
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10 relative scrollbar-hide">
           {children}
        </section>
      </main>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-[100] bg-[#0C0C0E] p-8 lg:hidden"
          >
            <div className="flex justify-between items-center mb-12">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-indigo-500/20">
                    <img 
                      src="/images/universa_logo.png" 
                      alt="Universa" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xl font-black italic uppercase text-indigo-500">UNIVERSA</span>
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6 text-white" /></button>
            </div>
            <nav className="space-y-1">
               <NavItem href="/admin" icon={LayoutDashboard} label="HQ Overview" active={pathname === '/admin'} />
               <NavItem href="/admin/clients" icon={Users} label="Client Registry" active={pathname === '/admin/clients'} />
               <div className="pt-8 border-t border-white/5 mt-8">
                  <NavItem href="/collector" icon={Zap} label="Attom Collector" active={pathname === '/collector'} />
               </div>
               <div className="pt-4">
                  <NavItem href="/dashboard" icon={Globe} label="Switch to JF.OS" active={false} />
               </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
