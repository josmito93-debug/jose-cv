import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Activity, 
  Wallet, 
  BrainCircuit, 
  Settings, 
  ArrowUpRight, 
  ArrowDownRight,
  LayoutDashboard,
  Bot,
  Zap,
  Bell,
  Menu,
  ChevronDown,
  Lock,
  Home
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_BASE = "/api";

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Real State
  const [stats, setStats] = useState<any>(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [coherence, setCoherence] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, posRes, histRes, cohRes] = await Promise.all([
        fetch(`${API_BASE}/trading/stats`),
        fetch(`${API_BASE}/trading/positions`),
        fetch(`${API_BASE}/trading/history`),
        fetch(`${API_BASE}/trading/coherence`)
      ]);
      
      const statsData = await statsRes.json();
      const posData = await posRes.json();
      const histData = await histRes.json();
      const cohData = await cohRes.json();
      
      setStats(statsData);
      setPositions(Array.isArray(posData) ? posData : []);
      setHistory(Array.isArray(histData) ? histData : []);
      setCoherence(cohData);
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const totalBalance = stats?.equity ? `$${stats.equity.toLocaleString()}` : "$100,000.00";
  const totalPnL = stats?.total_pnl ? `${stats.total_pnl > 0 ? '+' : ''}$${stats.total_pnl.toFixed(2)}` : "+$0.00";
  const pnlPct = stats?.pnl_pct ? `${stats.pnl_pct > 0 ? '+' : ''}${stats.pnl_pct.toFixed(4)}%` : "+0.00%";

  const getPosCount = (market: string) => Array.isArray(positions) ? positions.filter(p => p.market === market).length : 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0e131f] text-white  relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Sidebar omitted for brevity, keeping same structure ... */}
      <aside className={`flex flex-col border-r border-white/10 bg-[#0d1117]/80 backdrop-blur-xl transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <a href="/" className="flex bg-linear-to-b from-accent/10 to-transparent items-center gap-3 px-6 py-8 hover:opacity-80 transition-opacity">
          <Zap className="h-8 w-8 text-accent shrink-0" />
          {isSidebarOpen && <span className="text-2xl font-bold  tracking-tighter">JF.OS</span>}
        </a>

        <nav className="flex-1 space-y-3 px-4 mt-6">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} shrunk={!isSidebarOpen} />
          <NavItem icon={<Activity size={20} />} label="Live Trading" active={activeTab === 'trading'} onClick={() => setActiveTab('trading')} shrunk={!isSidebarOpen} />
          <NavItem icon={<BrainCircuit size={20} />} label="AI Agent" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} shrunk={!isSidebarOpen} />
          <NavItem icon={<Wallet size={20} />} label="Portfolio" active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} shrunk={!isSidebarOpen} />
          
          <a href="/" className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 group hover:bg-accent/10 border border-white/5 hover:border-accent/30 text-white/70 hover:text-accent mt-4`}>
            <Home size={20} className="shrink-0" />
            {isSidebarOpen && <span className="font-medium text-sm">Nexus Command</span>}
          </a>

          <div className="pt-4 pb-2 border-t border-white/5 mt-4" />
          <NavItem icon={<Settings size={20} />} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} shrunk={!isSidebarOpen} />
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center font-bold text-xs">JF</div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">José Figueroa</p>
                <p className="text-xs text-white/40 truncate">Admin Mode</p>
              </div>
            )}
            {isSidebarOpen && <ChevronDown size={14} className="text-white/40" />}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-auto">
        {/* Top Header */}
        <header className="h-24 border-b border-white/10 flex flex-col px-12 bg-[#0e131f]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex-1 flex items-center justify-between py-2">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3.5 hover:bg-white/5 rounded-xl transition-colors">
                <Menu size={20} />
              </button>
              <h1 className="text-xl font-bold  tracking-tight">Financial Intelligence <span className="text-accent">OS</span></h1>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-[0.1em]">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                 Market Active
              </div>
              <button className="relative p-3.5 hover:bg-white/5 rounded-full transition-colors group">
                <Bell size={20} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent rounded-full border-2 border-[#0e131f] shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
              </button>
              <div className="h-10 w-[1px] bg-white/10" />
              <div className="text-right">
                <p className="text-[10px] uppercase text-white/30 font-bold tracking-[0.2em] mb-1">Total Balance</p>
                <p className="text-lg font-bold ">{totalBalance}</p>
              </div>
            </div>
          </div>
          <div className="h-10 border-t border-white/5 overflow-hidden flex items-center">
             <div className="flex gap-12 animate-scroll-ticker whitespace-nowrap text-[10px] font-bold tracking-widest text-white/40 uppercase">
                {positions.map(p => (
                  <span key={p.symbol} className="flex items-center gap-2">
                    <span className="text-white/60">{p.symbol}</span> 
                    <span className={p.change_today >= 0 ? "text-emerald-400" : "text-red-400"}>
                      ${p.current_price.toLocaleString()} {p.change_today >= 0 ? '+' : ''}{p.change_today.toFixed(2)}%
                    </span>
                  </span>
                ))}
                {positions.length === 0 && (
                  <span className="text-white/20">Scanning markets for opportunities... Waiting for bot decision nodes.</span>
                )}
             </div>
          </div>
        </header>

        <div className="p-12 space-y-10 max-w-(--breakpoint-2xl) mx-auto w-full">
          {/* Global Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <StatCard label="Current Capital" value={totalBalance} subValue="Live Equity" icon={<Wallet className="text-accent" />} />
            <StatCard label="Total Profit" value={totalPnL} subValue={pnlPct} icon={<TrendingUp className="text-emerald-400" />} trend={stats?.total_pnl >= 0 ? "up" : "down"} />
            <StatCard label="AI Win Rate" value={stats?.win_rate ? `${stats.win_rate}%` : '0.0%'} subValue="Daily Profit Frequency" icon={<BrainCircuit className="text-amber-400" />} />
            <StatCard label="Active Positions" value={Array.isArray(positions) ? positions.length.toString() : "0"} subValue="Units Holding" icon={<Activity className="text-blue-400" />} />
          </div>

          {/* Market Sectors Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <StatCard label="Crypto Market" value={`$${(stats?.markets?.crypto?.equity || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} subValue={`PnL: $${(stats?.markets?.crypto?.pnl || 0).toFixed(2)} | ${stats?.markets?.crypto?.win_rate || 0}% WR | ${getPosCount('crypto')} Pos`} icon={<Zap className="text-accent" />} trend={(stats?.markets?.crypto?.pnl || 0) >= 0 ? "up" : "down"} />
            <StatCard label="Stocks Market" value={`$${(stats?.markets?.stocks?.equity || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} subValue={`PnL: $${(stats?.markets?.stocks?.pnl || 0).toFixed(2)} | ${stats?.markets?.stocks?.win_rate || 0}% WR | ${getPosCount('stocks')} Pos`} icon={<Activity className="text-emerald-400" />} trend={(stats?.markets?.stocks?.pnl || 0) >= 0 ? "up" : "down"} />
            <StatCard label="Forex Market" value={`$${(stats?.markets?.forex?.equity || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} subValue={`PnL: $${(stats?.markets?.forex?.pnl || 0).toFixed(2)} | ${stats?.markets?.forex?.win_rate || 0}% WR | ${getPosCount('forex')} Pos`} icon={<TrendingUp className="text-blue-400" />} trend={(stats?.markets?.forex?.pnl || 0) >= 0 ? "up" : "down"} />
            <StatCard label="Metals Market" value={`$${(stats?.markets?.metals?.equity || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} subValue={`PnL: $${(stats?.markets?.metals?.pnl || 0).toFixed(2)} | ${stats?.markets?.metals?.win_rate || 0}% WR | ${getPosCount('metals')} Pos`} icon={<ShieldCheck className="text-amber-400" />} trend={(stats?.markets?.metals?.pnl || 0) >= 0 ? "up" : "down"} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Chart Area */}
            <div className="xl:col-span-2 space-y-6">
              <div className="glass-panel p-8 min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-bold ">Portfolio Performance</h3>
                    <p className="text-sm text-white/40">Real-time Alpaca Live Sync</p>
                  </div>
                  <div className="flex gap-2">
                    {['1D', '1W', '1M', '1Y', 'ALL'].map(t => (
                      <button key={t} className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${t === '1M' ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="h-[300px] w-full mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history.length > 0 ? history : []}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(t) => t.split(' ')[0]} />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} domain={['auto', 'auto']} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#161b22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
                        labelFormatter={(t) => `Date: ${t}`}
                      />
                      <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Banking Integration Panel */}
              <div className="glass-panel p-8 overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                   <ShieldCheck size={120} />
                </div>
                <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                         <Activity className="text-white/60" />
                      </div>
                      <div>
                         <h3 className="font-bold flex items-center gap-2">
                            Alpaca Broker Link
                            <Lock size={14} className="text-white/40" />
                         </h3>
                         <p className="text-sm text-white/40">Connected to Paper API (Live Execution Active)</p>
                      </div>
                   </div>
                   <button onClick={fetchData} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-all">
                      Sincronizar
                   </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                      <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Buying Power</p>
                      <p className="text-xl font-bold">${stats?.buying_power?.toLocaleString() || "0.00"}</p>
                   </div>
                   <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                      <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Status</p>
                      <p className="text-xl font-bold text-emerald-400 capitalize">{stats?.status || "Ready"}</p>
                   </div>
                </div>
              </div>
            </div>

            {/* Sidebar widgets */}
            <div className="space-y-8">
              {/* AI Agent Feed */}
              <div className="glass-panel p-8 flex flex-col h-[500px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <Bot size={18} className="text-accent" />
                    Agent Log
                  </h3>
                  <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold uppercase">Active Nodes</span>
                </div>

                {/* Coherence Gauge */}
                <div className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
                      <ShieldCheck size={40} />
                   </div>
                   <div className="flex items-center justify-between mb-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">AI Coherence Index</p>
                      <span className="text-xs font-mono text-accent">UCF v3.3</span>
                   </div>
                   <div className="flex items-end gap-4">
                      <div>
                        <p className="text-4xl font-bold tracking-tighter text-white">
                           {((coherence?.coherence_score || 0.5) * 100).toFixed(1)}%
                        </p>
                        <p className="text-[10px] text-white/40 font-bold uppercase mt-1">Law Alignment (C_IA)</p>
                      </div>
                      <div className="flex-1 h-3 mb-1.5 bg-white/5 rounded-full overflow-hidden flex">
                         <div 
                            className="h-full bg-accent shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-1000" 
                            style={{ width: `${(coherence?.coherence_score || 0.5) * 100}%` }} 
                         />
                      </div>
                   </div>
                   <div className="mt-4 pt-4 border-t border-white/5">
                      <p className="text-[10px] text-white/60 leading-relaxed italic">
                        "{coherence?.last_reason || "Observing structural invariance across market layers."}"
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[8px] font-bold uppercase tracking-widest text-white/20">
                         <span>Omega Score: {(coherence?.omega_score || 0).toFixed(4)}</span>
                         <span className="text-accent">R:R: {(coherence?.expected_rr || 0).toFixed(1)}x</span>
                         <span>Risk Mult: {(coherence?.risk_multiplier || 1).toFixed(1)}x</span>
                      </div>
                   </div>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                  {positions.map(p => (
                    <LogItem key={p.symbol} type="buy" title={`Holding ${p.symbol}`} desc={`${p.qty} units @ $${p.avg_entry_price} (${p.market?.toUpperCase()})`} time="Live" />
                  ))}
                  <LogItem type="system" title="JF.OS Core" desc="Nodes monitoring Crypto, Stocks, Forex & Metals" time="Now" />
                  <LogItem type="system" title="Fix Applied" desc="Fractional Order Bug fixed successfully" time="10m ago" />
                  <LogItem type="system" title="Neural Training" desc="Memory sync with historical pivots" time="Today" />
                </div>

                <button className="w-full mt-6 py-3 rounded-xl bg-accent text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:scale-[1.02] transition-transform">
                   <Zap size={16} /> Optimize Intelligence
                </button>
              </div>

              {/* Status Section */}
              <div className="glass-panel p-8 bg-linear-to-br from-indigo-500/10 to-transparent">
                 <h4 className="font-bold mb-4">Infrastructure Health</h4>
                 <div className="space-y-3">
                    <StatusItem label="Python Engine" status="Online" active />
                    <StatusItem label="Alpaca Gateway" status="Active" active />
                    <StatusItem label="Intelligence Node" status="Synced" active />
                    <StatusItem label="Performance API" status="Online" active />
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-components
const NavItem: React.FC<{ icon: any, label: string, active?: boolean, onClick: () => void, shrunk: boolean }> = ({ icon, label, active, onClick, shrunk }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-200 group ${active ? 'bg-accent text-white shadow-lg shadow-accent/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
  >
    <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>{icon}</span>
    {!shrunk && <span className="font-medium text-sm">{label}</span>}
  </button>
);

const StatCard: React.FC<{ label: string, value: string, subValue: string, icon: any, trend?: 'up' | 'down' }> = ({ label, value, subValue, icon, trend }) => (
  <div className="glass-panel p-8 border-white/5 hover:border-accent/40 hover:bg-white/[0.05] transition-all duration-300 cursor-pointer group hover:shadow-[0_0_30px_rgba(99,102,241,0.1)]">
    <div className="flex items-center justify-between mb-6">
      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent/10 group-hover:scale-110 transition-all duration-300">
        {icon}
      </div>
      {trend && (
        <span className={`text-xs font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
           {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
           {subValue}
        </span>
      )}
      {!trend && <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-full">{subValue}</span>}
    </div>
    <p className="text-xs text-white/30 font-bold uppercase tracking-[0.15em] mb-2">{label}</p>
    <p className="text-3xl font-bold  group-hover:translate-x-1 transition-transform">{value}</p>
  </div>
);

const LogItem: React.FC<{ type: 'buy' | 'sell' | 'system', title: string, desc: string, time: string }> = ({ type, title, desc, time }) => (
  <div className="flex gap-3">
    <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${type === 'buy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : type === 'sell' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]'}`} />
    <div>
      <div className="flex items-center gap-2">
        <p className="text-xs font-bold uppercase tracking-tight">{title}</p>
        <span className="text-[9px] text-white/20">{time}</span>
      </div>
      <p className="text-[10px] text-white/40 leading-relaxed">{desc}</p>
    </div>
  </div>
);

const StatusItem: React.FC<{ label: string, status: string, active?: boolean }> = ({ label, status, active }) => (
  <div className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
    <span className="text-xs text-white/60">{label}</span>
    <div className="flex items-center gap-1.5">
       <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-emerald-400' : 'bg-amber-400'}`} />
       <span className="text-[10px] font-bold text-white/40">{status}</span>
    </div>
  </div>
);

export default App;
