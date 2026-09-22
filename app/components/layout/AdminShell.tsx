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
  FileText,
  CreditCard,
  Layers,
  Sparkles
} from 'lucide-react';

interface ShellProps {
  children: React.ReactNode;
}

function NavItem({ href, icon: Icon, label, active, badge }: { href: string; icon: any; label: string; active: boolean; badge?: string }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all group relative ${
        active 
          ? 'text-white font-bold' 
          : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
      }`}
    >
      {active && (
        <motion.div 
          layoutId="pill-admin"
          className="absolute inset-0 bg-[#2ee58f]/10 border border-[#2ee58f]/25 rounded-xl -z-10 shadow-[0_0_20px_rgba(46,229,143,0.1)]"
        />
      )}
      <div className={`transition-transform duration-200 group-hover:scale-110 ${active ? 'text-[#2ee58f]' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-xs tracking-tight">{label}</span>
      {badge && (
        <span className={`ml-auto text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
          active ? 'bg-[#2ee58f]/20 text-[#2ee58f]' : 'bg-white/5 text-zinc-500'
        }`}>
          {badge}
        </span>
      )}
      {active && !badge && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2ee58f] animate-pulse" />}
    </Link>
  );
}

export default function AdminShell({ children }: ShellProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060a08] text-zinc-100 selection:bg-[#2ee58f] selection:text-[#04100b] antialiased flex overflow-hidden font-sans">
      {/* Sidebar - Professional UI/UX Pro Max OLED Style */}
      <aside className="hidden lg:flex w-72 flex-col bg-[#090f0c] border-r border-white/5 relative z-50">
        <div className="p-6 border-b border-white/5">
          <Link href="/admin" className="flex items-center gap-3 px-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2ee58f]/20 to-indigo-500/10 border border-[#2ee58f]/30 flex items-center justify-center group-hover:scale-105 transition-transform overflow-hidden shadow-[0_0_15px_rgba(46,229,143,0.15)]">
              <img 
                src="/images/universa_logo.png" 
                alt="Universa" 
                className="w-6 h-6 object-contain"
                onError={(e) => (e.currentTarget.style.display = 'none')} 
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tight uppercase italic text-white leading-none">
                Universa <span className="text-[#2ee58f]">HQ</span>
              </span>
              <span className="text-[9px] text-zinc-500 font-mono tracking-widest mt-1 uppercase">
                Agency OS v3.0
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <div className="px-4 mb-2.5">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">Core Operations</p>
          </div>
          
          <NavItem href="/admin" icon={LayoutDashboard} label="HQ Overview" active={pathname === '/admin'} />
          <NavItem href="/propuestas" icon={FileText} label="Propuestas & Ventas" active={pathname.startsWith('/propuestas')} badge="19" />
          <NavItem href="/collector" icon={Zap} label="Attom Collector" active={pathname === '/collector'} />

          <div className="px-4 mt-6 mb-2.5">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">Agents & Automation</p>
          </div>
          <NavItem href="/dashboard/attom" icon={Globe} label="ATTOM Lead Center" active={pathname === '/dashboard/attom'} />
          <NavItem href="/hq/n8n" icon={Database} label="N8N Workflow Engine" active={pathname === '/hq/n8n'} />
          <NavItem href="/creador" icon={Sparkles} label="Copywriter & Creador" active={pathname === '/creador'} />

          <div className="px-4 mt-6 mb-2.5">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">Ecosistemas</p>
          </div>
          <NavItem href="/dashboard" icon={Activity} label="Switch to JF.OS" active={pathname === '/dashboard'} />
        </nav>

        {/* User Session Footer */}
        <div className="p-4 border-t border-white/5 bg-[#070c0a]">
          <div className="p-3.5 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl border border-white/5 space-y-3 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#2ee58f]/10 border border-[#2ee58f]/30 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-[#2ee58f]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">José Figueroa</p>
                <p className="text-[9px] font-mono text-[#2ee58f] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2ee58f] animate-pulse" />
                  Online · Superadmin
                </p>
              </div>
            </div>
            
            <Link
              href="/admin/clients/new"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#2ee58f] to-[#25be76] hover:from-[#35f39a] hover:to-[#2ee58f] text-[#04100b] rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(46,229,143,0.2)]"
            >
              <Plus className="w-3.5 h-3.5" /> Registrar Cliente
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 shrink-0 border-b border-white/5 flex items-center justify-between px-4 lg:px-8 bg-[#090f0c]/80 backdrop-blur-xl z-40">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Abrir menú de navegación"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-[#2ee58f] animate-pulse" />
              <h3 className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
                Universa Cloud Node · <span className="text-[#2ee58f]">Vercel & Stripe Synchronized</span>
              </h3>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Link
              href="/propuestas"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#2ee58f]/10 border border-[#2ee58f]/20 text-[#2ee58f] text-xs font-bold hover:bg-[#2ee58f]/20 transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Propuestas Hub</span>
            </Link>

            <a
              href="https://wa.me/17863024923"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-bold transition-colors hidden md:inline-flex items-center gap-1.5"
            >
              <span>WhatsApp Direct</span>
            </a>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 relative scrollbar-thin scrollbar-thumb-white/10">
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
            className="fixed inset-0 z-[100] bg-[#070c0a] p-6 lg:hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#2ee58f]/10 border border-[#2ee58f]/30 flex items-center justify-center">
                    <img 
                      src="/images/universa_logo.png" 
                      alt="Universa" 
                      className="w-5 h-5 object-contain"
                    />
                  </div>
                  <span className="text-lg font-black uppercase text-white tracking-tight">UNIVERSA HQ</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 rounded-xl bg-white/5 text-zinc-400 hover:text-white"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1.5" onClick={() => setIsMobileMenuOpen(false)}>
                <NavItem href="/admin" icon={LayoutDashboard} label="HQ Overview" active={pathname === '/admin'} />
                <NavItem href="/propuestas" icon={FileText} label="Propuestas & Ventas" active={pathname.startsWith('/propuestas')} badge="19" />
                <NavItem href="/collector" icon={Zap} label="Attom Collector" active={pathname === '/collector'} />
                <NavItem href="/dashboard/attom" icon={Globe} label="ATTOM Lead Center" active={pathname === '/dashboard/attom'} />
                <NavItem href="/hq/n8n" icon={Database} label="N8N Workflow Engine" active={pathname === '/hq/n8n'} />
                <NavItem href="/creador" icon={Sparkles} label="Copywriter & Creador" active={pathname === '/creador'} />
                <NavItem href="/dashboard" icon={Activity} label="Switch to JF.OS" active={pathname === '/dashboard'} />
              </nav>
            </div>

            <div className="pt-6 border-t border-white/10">
              <Link
                href="/admin/clients/new"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#2ee58f] text-[#04100b] rounded-xl text-xs font-black uppercase tracking-wider shadow-lg"
              >
                <Plus className="w-4 h-4" /> Registrar Cliente
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
