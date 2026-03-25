import React, { useState } from 'react';
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
  Lock
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Simulated equity data
const equityData = [
  { time: '09:00', value: 300 },
  { time: '10:00', value: 340 },
  { time: '11:00', value: 315 },
  { time: '12:00', value: 380 },
  { time: '13:00', value: 410 },
  { time: '14:00', value: 390 },
  { time: '15:00', value: 450 },
  { time: '16:00', value: 520 },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0e131f] text-white font-inter relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Sidebar */}
      <aside className={`flex flex-col border-r border-white/10 bg-[#0d1117]/80 backdrop-blur-xl transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="flex bg-linear-to-b from-accent/10 to-transparent items-center gap-3 px-6 py-8">
          <Zap className="h-8 w-8 text-accent shrink-0" />
          {isSidebarOpen && <span className="text-2xl font-bold font-outfit tracking-tighter">JF.OS</span>}
        </div>

        <nav className="flex-1 space-y-3 px-4 mt-6">
          <NavItem icon={<LayoutDashboard size={20} />} label="Overview" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} shrunk={!isSidebarOpen} />
          <NavItem icon={<Activity size={20} />} label="Live Trading" active={activeTab === 'trading'} onClick={() => setActiveTab('trading')} shrunk={!isSidebarOpen} />
          <NavItem icon={<BrainCircuit size={20} />} label="AI Agent" active={activeTab === 'ai'} onClick={() => setActiveTab('ai')} shrunk={!isSidebarOpen} />
          <NavItem icon={<Wallet size={20} />} label="Portfolio" active={activeTab === 'portfolio'} onClick={() => setActiveTab('portfolio')} shrunk={!isSidebarOpen} />
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
              <h1 className="text-xl font-bold font-outfit tracking-tight">Financial Intelligence <span className="text-accent">OS</span></h1>
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
                <p className="text-lg font-bold font-outfit">$30,420.69</p>
              </div>
            </div>
          </div>
          <div className="h-10 border-t border-white/5 overflow-hidden flex items-center">
             <div className="flex gap-12 animate-scroll-ticker whitespace-nowrap text-[10px] font-bold tracking-widest text-white/40 uppercase">
                <span className="flex items-center gap-2"><span className="text-white/60">BTC/USD</span> <span className="text-emerald-400">$64,231.20 +2.4%</span></span>
                <span className="flex items-center gap-2"><span className="text-white/60">ETH/USD</span> <span className="text-emerald-400">$3,420.15 +1.8%</span></span>
                <span className="flex items-center gap-2"><span className="text-white/60">SPX/USD</span> <span className="text-red-400">$5,120.30 -0.4%</span></span>
                <span className="flex items-center gap-2"><span className="text-white/60">NQ/USD</span> <span className="text-emerald-400">$18,450.40 +0.9%</span></span>
                <span className="flex items-center gap-2"><span className="text-white/60">BTC/USD</span> <span className="text-emerald-400">$64,231.20 +2.4%</span></span>
                <span className="flex items-center gap-2"><span className="text-white/60">ETH/USD</span> <span className="text-emerald-400">$3,420.15 +1.8%</span></span>
             </div>
          </div>
        </header>

        <div className="p-12 space-y-10 max-w-(--breakpoint-2xl) mx-auto w-full">
          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <StatCard label="Current Capital" value="$300.00" subValue="Initial" icon={<Wallet className="text-accent" />} />
            <StatCard label="Projected Monthly" value="$3,150.00" subValue="+10.5%" icon={<TrendingUp className="text-emerald-400" />} trend="up" />
            <StatCard label="AI Win Rate" value="64.2%" subValue="Last 30 Days" icon={<BrainCircuit className="text-amber-400" />} />
            <StatCard label="Risk Drawdown" value="2.41%" subValue="Target < 5%" icon={<ShieldCheck className="text-blue-400" />} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
            {/* Chart Area */}
            <div className="xl:col-span-2 space-y-6">
              <div className="glass-panel p-8 min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-lg font-bold font-outfit">Portfolio Performance</h3>
                    <p className="text-sm text-white/40">Growth toward $30,000 Milestone</p>
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
                    <AreaChart data={equityData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="rgba(255,255,255,0.2)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#161b22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#fff' }}
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
                            Plaid Banking Link
                            <Lock size={14} className="text-white/40" />
                         </h3>
                         <p className="text-sm text-white/40">Conectado con Bank of America (checking ...9012)</p>
                      </div>
                   </div>
                   <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-all">
                      Sincronizar
                   </button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                      <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Available Liquidity</p>
                      <p className="text-xl font-bold">$12,450.00</p>
                   </div>
                   <div className="p-4 rounded-xl bg-white/2 border border-white/5">
                      <p className="text-xs text-white/40 uppercase font-bold tracking-wider mb-1">Last Withdraw</p>
                      <p className="text-xl font-bold">$2,000.00</p>
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
                  <span className="text-[10px] bg-accent/20 text-accent px-2 py-0.5 rounded-full font-bold uppercase">Learning</span>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                  <LogItem type="buy" title="Buy Signal Generated" desc="NASDAQ Trend Follow - High Probability" time="2m ago" />
                  <LogItem type="system" title="Regime Detected" desc="Volatile (ATR > 2.0) - Size Reduced" time="15m ago" />
                  <LogItem type="sell" title="Position Closed" desc="Profit Taken: +2.14% ($8.40)" time="1h ago" />
                  <LogItem type="system" title="Backtesting Sync" desc="Model parameters updated (PPO v2.4)" time="4h ago" />
                  <LogItem type="system" title="Connectivity" desc="Plaid API Sync Completed" time="Yesterday" />
                </div>

                <button className="w-full mt-6 py-3 rounded-xl bg-accent text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-accent/20 hover:scale-[1.02] transition-transform">
                   <Zap size={16} /> Run Quant Optimization
                </button>
              </div>

              {/* Status Section */}
              <div className="glass-panel p-8 bg-linear-to-br from-indigo-500/10 to-transparent">
                 <h4 className="font-bold mb-4">Infrastructure Health</h4>
                 <div className="space-y-3">
                    <StatusItem label="Python Backend" status="Online" active />
                    <StatusItem label="Alpaca API" status="Online" active />
                    <StatusItem label="Plaid Gateway" status="Syncing" />
                    <StatusItem label="Polygon Live Data" status="Online" active />
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
    <p className="text-3xl font-bold font-outfit group-hover:translate-x-1 transition-transform">{value}</p>
  </div>
);

const LogItem: React.FC<{ type: 'buy' | 'sell' | 'system', title: string, desc: string, time: string }> = ({ type, title, desc, time }) => (
  <div className="flex gap-3">
    <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${type === 'buy' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : type === 'sell' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]'}`} />
    <div>
      <div className="flex items-center gap-2">
        <p className="text-xs font-bold">{title}</p>
        <span className="text-[10px] text-white/20">{time}</span>
      </div>
      <p className="text-[11px] text-white/40">{desc}</p>
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
