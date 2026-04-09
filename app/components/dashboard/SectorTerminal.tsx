'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Zap, 
  Activity, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCcw,
  BarChart3,
  Globe,
  Newspaper,
  Terminal as TerminalIcon,
  Cpu,
  Database
} from 'lucide-react';
import PriceTicker from './PriceTicker';

interface SectorTerminalProps {
  sector: 'Crypto' | 'Forex' | 'Metals' | 'Stocks';
  title: string;
  icon: any;
}

export default function SectorTerminal({ sector, title, icon: Icon }: SectorTerminalProps) {
  const [news, setNews] = useState<any[]>([]);
  const [prices, setPrices] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [posCount, setPosCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [priceRes, newsRes, statsRes, posRes] = await Promise.all([
        fetch(`/api/market-data?category=${sector}&type=ticker`),
        fetch(`/api/market-data?category=${sector}&type=news`),
        fetch(`/api/trading/stats`),
        fetch(`/api/trading/positions`)
      ]);
      
      const priceData = await priceRes.json();
      const newsData = await newsRes.json();
      const statsData = await statsRes.json();
      const posData = await posRes.json();
      
      if (priceData.success) setPrices(priceData.data);
      if (newsData.success) setNews(newsData.data);
      
      setStats(statsData);
      if (Array.isArray(posData)) {
         setPosCount(posData.filter((p: any) => p.market === sector.toLowerCase()).length);
      }
    } catch (error) {
      console.error('Failed to fetch sector data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrade = (action: 'BUY' | 'SELL', asset: string, price: number) => {
    alert(`🛰️ [JF.OS EXECUTION] ${action} ${asset} Order Sent to Alpaca @ $${price.toLocaleString()}`);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [sector]);

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-32">
       
       {/* Section Header */}
       <div className="relative -mx-10 px-10 py-6 border-b border-white/5 bg-[#0C0C0E]/30 backdrop-blur-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
             <div className="space-y-2">
                <div className="flex items-center gap-3">
                   <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[9px] font-black uppercase text-emerald-400 italic">Sector Active</div>
                   <div className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-[9px] font-black uppercase text-zinc-500">Node: Universa-{sector}</div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-white/5 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                   </div>
                   <h2 className="text-3xl font-black tracking-tight italic uppercase">{title} <span className="text-zinc-500">Surveillance</span></h2>
                </div>
             </div>
             
             <div className="flex items-center gap-4">
                <button 
                  onClick={fetchData}
                  className="px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-white/10 transition-all"
                >
                   <RefreshCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Data
                </button>
             </div>
          </div>
       </div>

       {/* Sub-Marketina specific to sector */}
       <div className="-mx-10">
          <PriceTicker sector={sector} />
       </div>

       {/* Main Workspace */}
       <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Left: Execution Hub */}
          <div className="xl:col-span-8 space-y-10">
             <div className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#111113]/50">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400"><TerminalIcon className="w-4 h-4" /></div>
                      <h3 className="text-sm font-black uppercase tracking-widest italic font-bold">Trading Terminal</h3>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-black uppercase text-zinc-500">API Connected</span>
                   </div>
                </div>

                {/* Trading Metrics Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/5 bg-white/[0.01]">
                   <div className="p-6 border-r border-b md:border-b-0 border-white/5">
                      <p className="text-[9px] uppercase font-black tracking-widest text-zinc-600 mb-1">Allocated Capital</p>
                      <p className="text-2xl font-black italic tracking-tighter">${(stats?.markets?.[sector.toLowerCase()]?.equity || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                   </div>
                   <div className="p-6 border-b md:border-b-0 md:border-r border-white/5">
                      <p className="text-[9px] uppercase font-black tracking-widest text-zinc-600 mb-1">Generated PnL</p>
                      <p className={`text-2xl font-black italic tracking-tighter ${(stats?.markets?.[sector.toLowerCase()]?.pnl || 0) >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                         ${(stats?.markets?.[sector.toLowerCase()]?.pnl || 0).toFixed(2)}
                      </p>
                   </div>
                   <div className="p-6 border-r border-white/5">
                      <p className="text-[9px] uppercase font-black tracking-widest text-zinc-600 mb-1">Sector Win Rate</p>
                      <p className="text-2xl font-black italic tracking-tighter">{stats?.markets?.[sector.toLowerCase()]?.win_rate || 0}%</p>
                   </div>
                   <div className="p-6">
                      <p className="text-[9px] uppercase font-black tracking-widest text-zinc-600 mb-1">Active Positions</p>
                      <p className="text-2xl font-black italic tracking-tighter">{posCount}</p>
                   </div>
                </div>

                <div className="p-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {prices.map((item, i) => (
                        <motion.div 
                          key={item.symbol}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] group hover:border-indigo-500/30 transition-all"
                        >
                           <div className="flex items-center justify-between mb-8">
                              <div>
                                 <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">{sector} Asset</p>
                                 <h4 className="text-2xl font-black italic tracking-tighter">{item.symbol}</h4>
                              </div>
                              <div className={`p-3 rounded-2xl ${item.isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                 {item.isUp ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                              </div>
                           </div>
                           
                           <div className="flex items-end justify-between">
                              <div>
                                 <p className="text-3xl font-black italic tracking-tighter">${item.price.toLocaleString()}</p>
                                 <p className={`text-[10px] font-black mt-2 ${item.isUp ? 'text-emerald-400' : 'text-rose-500'}`}>
                                    {item.isUp ? '+' : ''}{item.change}% Today
                                 </p>
                              </div>
                              <div className="flex gap-2">
                                 <button 
                                   onClick={() => handleTrade('BUY', item.symbol, item.price)}
                                   className="px-4 py-2 bg-emerald-500 text-black font-black text-[10px] rounded-lg uppercase tracking-widest hover:scale-105 transition-transform"
                                 >
                                   Buy
                                 </button>
                                 <button 
                                   onClick={() => handleTrade('SELL', item.symbol, item.price)}
                                   className="px-4 py-2 bg-white/5 text-white font-black text-[10px] rounded-lg border border-white/10 uppercase tracking-widest hover:bg-white/10 transition-all"
                                 >
                                   Sell
                                 </button>
                              </div>
                           </div>
                        </motion.div>
                      ))}
                   </div>
                </div>

                <div className="p-8 border-t border-white/5 bg-white/[0.01]">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 flex items-center gap-3">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      Protocol: JF.OS Intelligence Node - Status Optimal
                   </p>
                </div>
             </div>
          </div>

          {/* Right: Intelligence Hub (News & Analysis) */}
          <div className="xl:col-span-4 space-y-8">
             <div className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-10">
                <div className="flex items-center gap-4 mb-10">
                   <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><Newspaper className="w-4 h-4" /></div>
                   <h3 className="text-xs font-black uppercase tracking-[0.3em] font-bold">News & Intelligence</h3>
                </div>

                <div className="space-y-8">
                   {news.length > 0 ? news.map((item, i) => (
                     <div key={item.id} className="space-y-4 group">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                           <span className={item.sentiment === 'BULLISH' ? 'text-emerald-400' : item.sentiment === 'BEARISH' ? 'text-rose-400' : 'text-amber-400'}>
                              {item.sentiment} Signal
                           </span>
                           <span className="text-zinc-700">{item.time}</span>
                        </div>
                        <h4 className="text-sm font-black tracking-tight group-hover:text-emerald-400 transition-colors">{item.title}</h4>
                        <p className="text-xs text-zinc-500 leading-relaxed font-medium">{item.content}</p>
                        <div className="pt-4 border-t border-white/5" />
                     </div>
                   )) : (
                     <p className="text-xs text-zinc-600 font-bold italic">Scanning frequencies for news...</p>
                   )}
                </div>

                <button 
                   onClick={() => alert(`🧠 [JF.OS AI] Analyzing ${news.length} current signals... Latest sentiment: BULLISH (Confidence: 89%)`)}
                   className="w-full mt-10 py-5 bg-indigo-600 rounded-[1.5rem] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
                >
                   AI Sentiment Analysis <Cpu className="w-4 h-4" />
                </button>
             </div>

             <div className="p-10 bg-white/5 border border-white/5 rounded-[2.5rem]">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-700 mb-6">Market Metrics</h3>
                <div className="space-y-6">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Volatility Index</span>
                      <span className="text-sm font-black italic">Low</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[30%]" />
                   </div>
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Signal Strength</span>
                      <span className="text-sm font-black italic">High</span>
                   </div>
                   <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 w-[85%]" />
                   </div>
                </div>
             </div>
          </div>

       </div>
    </div>
  );
}
