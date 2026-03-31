'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Cpu, 
  TrendingUp, 
  Globe, 
  Users, 
  Zap, 
  Activity, 
  Database,
  ShieldCheck,
  ArrowLeft,
  Share2,
  FolderOpen,
  LayoutDashboard,
  ChevronRight,
  Search,
  Bell,
  Plus,
  RefreshCcw
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
          layoutId="pill"
          className="absolute inset-0 bg-white/5 border border-white/5 rounded-xl -z-10 shadow-xl"
        />
      )}
      <div className={`transition-transform group-hover:scale-110 ${active ? 'text-emerald-400' : ''}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs font-bold tracking-tight">{label}</span>
      {active && <div className="ml-auto w-1 h-1 rounded-full bg-emerald-400" />}
    </Link>
  );
}

export default function Shell({ children }: ShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentTitle = "JF.OS Terminal";
  const accentColorClass = 'bg-emerald-600';

  return (
    <div className="min-h-screen bg-[#08080A] text-zinc-100 font-inter antialiased flex overflow-hidden">
      {/* Sidebar - Professional Trading Terminal Style */}
      <aside className="hidden lg:flex w-72 flex-col bg-[#0C0C0E] border-r border-white/5 relative z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 px-2">
            <div className={`w-8 h-8 rounded-xl ${accentColorClass} flex items-center justify-center font-black text-xs text-white uppercase italic`}>JF</div>
            <span className="text-sm font-black tracking-tighter uppercase italic">{currentTitle}</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
           <div className="px-5 mb-4">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">Market Sectors</p>
           </div>
           
           <NavItem href="/dashboard" icon={Globe} label="Terminal HQ" active={pathname === '/dashboard'} />
           <NavItem href="/dashboard/crypto" icon={Cpu} label="Crypto Intelligence" active={pathname === '/dashboard/crypto'} />
           <NavItem href="/dashboard/forex" icon={RefreshCcw} label="Forex Surveillance" active={pathname === '/dashboard/forex'} />
           <NavItem href="/dashboard/metals" icon={Zap} label="Metals Command" active={pathname === '/dashboard/metals'} />
           <NavItem href="/dashboard/stocks" icon={TrendingUp} label="Stocks & Equities" active={pathname === '/dashboard/stocks'} />
           
           <div className="px-5 mt-8 mb-4">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">Infrastructure</p>
           </div>
           <NavItem href="/dashboard/settings" icon={ShieldCheck} label="Terminal Status" active={pathname === '/dashboard/settings'} />
        </nav>

        <div className="p-8 border-t border-white/5">
           <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-zinc-800" />
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Luis H.</p>
                    <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Master Operator</p>
                 </div>
              </div>
              <Link href="/dashboard/settings" className="w-full">
                <button className="w-full flex items-center justify-center gap-2 py-2 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
                   System Settings
                </button>
              </Link>
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
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">Live Infrastructure Operational</h3>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input 
                type="text" 
                placeholder="Search markets..." 
                className="bg-white/5 border border-white/5 rounded-xl py-2.5 pl-11 pr-5 text-[10px] font-bold focus:outline-none focus:border-white/10 transition-all w-48"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-zinc-500 relative">
                 <Bell className="w-4 h-4" />
                 <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-500 rounded-full border-2 border-[#0C0C0E]" />
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
               <div className="text-xl font-black italic uppercase">JF.OS</div>
               <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <nav className="space-y-1">
               <NavItem href="/dashboard" icon={Globe} label="Terminal HQ" active={pathname === '/dashboard'} />
               <NavItem href="/dashboard/crypto" icon={Cpu} label="Crypto Intelligence" active={pathname === '/dashboard/crypto'} />
               <NavItem href="/dashboard/forex" icon={RefreshCcw} label="Forex Surveillance" active={pathname === '/dashboard/forex'} />
               <NavItem href="/dashboard/metals" icon={Zap} label="Metals Command" active={pathname === '/dashboard/metals'} />
               <NavItem href="/dashboard/stocks" icon={TrendingUp} label="Stocks & Equities" active={pathname === '/dashboard/stocks'} />
               <div className="pt-8 border-t border-white/5 mt-8">
                <NavItem href="/dashboard/settings" icon={ShieldCheck} label="Terminal Status" active={pathname === '/dashboard/settings'} />
               </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
