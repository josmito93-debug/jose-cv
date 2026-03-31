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
  Plus
} from 'lucide-react';

interface ShellProps {
  children: React.ReactNode;
}

export default function Shell({ children }: ShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = pathname.startsWith('/admin');
  const isDashboard = pathname.startsWith('/dashboard');
  const isHQ = pathname === '/hq';

  const navLinks = isAdmin ? [
    { name: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: 'Clients CRM', href: '/admin', icon: <Users className="w-4 h-4" /> },
    { name: 'Onboarding', href: '/atom', icon: <Globe className="w-4 h-4" /> },
    { name: 'Data API', href: '/admin/logs', icon: <Zap className="w-4 h-4" /> },
  ] : isDashboard ? [
    { name: 'Overview', href: '/dashboard', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Cryptocurrencies', href: '/dashboard/crypto', icon: <Globe className="w-4 h-4" /> },
    { name: 'Metals & Energy', href: '/dashboard/metals', icon: <Zap className="w-4 h-4" /> },
    { name: 'Forex Assets', href: '/dashboard/forex', icon: <Activity className="w-4 h-4" /> },
    { name: 'Stock Options', href: '/dashboard/stocks', icon: <Database className="w-4 h-4" /> },
  ] : [
    { name: 'HQ Command', href: '/hq', icon: <Cpu className="w-4 h-4" /> },
    { name: 'Finance Agent', href: '/dashboard', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Attom Command', href: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
  ];

  const accentColor = isAdmin ? 'indigo' : isDashboard ? 'emerald' : 'indigo';
  const currentTitle = isAdmin ? "Attom Engine" : isDashboard ? "Finance Intel" : "HQ Operations";
  const currentThemeColor = isAdmin ? "text-indigo-400" : isDashboard ? "text-emerald-400" : "text-indigo-400";
  const currentBgGlow = isAdmin ? "bg-indigo-500/10" : isDashboard ? "bg-emerald-500/10" : "bg-indigo-500/10";
  const currentBorder = isAdmin ? "border-white/5" : isDashboard ? "border-white/5" : "border-white/5";
  const currentShadow = isAdmin ? "shadow-[0_0_20px_rgba(99,102,241,0.15)]" : isDashboard ? "shadow-[0_0_20px_rgba(16,185,129,0.15)]" : "shadow-[0_0_20px_rgba(99,102,241,0.15)]";

  const currentPathLabel = navLinks.find(n => n.href === pathname)?.name || 'Portal';

  return (
    <div className="min-h-screen bg-[#08080A] text-zinc-100 font-inter antialiased flex overflow-hidden">
      {/* Sidebar - Stakent Style */}
      <aside className="hidden lg:flex w-72 flex-col bg-[#0C0C0E] border-r border-white/5 relative z-50">
        <div className="p-8">
          <Link href="/hq" className="flex items-center gap-3 px-2">
            <img src="/universalogo.png" alt="JF.OS Logo" className="h-10 w-auto object-contain" />
            <span className="text-sm font-black tracking-tighter uppercase">{currentTitle}</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all group relative ${
                  isActive 
                    ? 'text-white' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="pill"
                    className={`absolute inset-0 bg-white/5 border border-white/5 rounded-xl -z-10 shadow-xl`}
                  />
                )}
                <div className={`transition-transform group-hover:scale-110 ${isActive ? `text-${accentColor}-400` : ''}`}>{item.icon}</div>
                <span className="text-xs font-bold tracking-tight">{item.name}</span>
                {isActive && <div className={`ml-auto w-1 h-1 rounded-full bg-${accentColor}-400`} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-white/5">
           <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-zinc-800" />
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Jose Figueroa</p>
                    <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Admin Access</p>
                 </div>
              </div>
              <Link href="/dashboard/settings" className="w-full flex items-center justify-center gap-2 py-2 border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
                 Settings
              </Link>
           </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 shrink-0 border-b border-white/5 flex items-center justify-between px-10 bg-[#0C0C0E]/50 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4">
             <div className="lg:hidden p-2 bg-white/5 rounded-lg" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu className="w-5 h-5" />
             </div>
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500">{currentPathLabel}</h3>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                placeholder="Search resources..." 
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
               <img src="/universalogo.png" alt="JF.OS Logo" className="h-10 w-auto object-contain" />
               <button onClick={() => setIsMobileMenuOpen(false)}><X className="w-6 h-6" /></button>
            </div>
            <nav className="space-y-4">
               {navLinks.map((link) => (
                 <Link key={link.href} href={link.href} onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 font-bold tracking-tight">
                       {link.icon} {link.name}
                    </div>
                 </Link>
               ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
