'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight,
  RefreshCcw,
  Plus,
  MoreVertical,
  Activity as ChartIcon,
  Globe,
  BarChart3
} from 'lucide-react';
import PriceTicker from '@/app/components/dashboard/PriceTicker';

export default function ProfessionalFinanceDashboard() {
  const [prices, setPrices] = useState<any>({
    BTC: { price: 68420.50, change: 2.5, status: 'BULLISH' },
    ETH: { price: 3450.12, change: -1.2, status: 'CONSOLIDATION' },
    SOL: { price: 185.05, change: 8.4, status: 'BULLISH' }
  });

  const [botLogs, setBotLogs] = useState([
    { id: 1, type: 'BUY', asset: 'BTC', amount: '0.045', price: '67,200', time: '2m ago' },
    { id: 2, type: 'SELL', asset: 'SOL', amount: '12.500', price: '184', time: '15m ago' },
    { id: 3, type: 'SURVEILLANCE', asset: 'MARKET', amount: '--', price: 'SCANNING', time: 'Active' }
  ]);

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto px-4 lg:px-8 pb-32">
      
      {/* Sectorized Marketina - The animated ticker the user requested */}
      <div className="space-y-1 -mx-10">
        <PriceTicker sector="Crypto" />
        <PriceTicker sector="Metals" />
        <PriceTicker sector="Stocks" />
        <PriceTicker sector="Forex" />
      </div>

      {/* Finance Header - Stakent Style */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-6 border-b border-white/5">
        <div className="space-y-2">
           <div className="flex items-center gap-3">
              <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-[9px] font-black uppercase text-emerald-400 italic">Terminal Active</div>
              <div className="px-2 py-1 bg-white/5 border border-white/5 rounded-md text-[9px] font-black uppercase text-zinc-500">API: Multi-Source AlphaV x EODHD</div>
           </div>
           <h2 className="text-3xl font-black tracking-tight italic">Global <span className="text-zinc-500">Surveillance</span></h2>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden sm:flex flex-col items-end px-6 border-r border-white/5">
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-1">Portfolio Value (Live)</p>
              <p className="text-xl font-black tracking-tighter text-white">$1,240,500.80</p>
           </div>
           <button className="px-8 py-3 bg-white text-black font-black rounded-xl shadow-2xl flex items-center gap-3 hover:bg-zinc-200 transition-all text-xs">
              <Zap className="w-4 h-4" /> Deploy Capital
           </button>
        </div>
      </div>

      {/* Asset Grid - Top Staking Assets Style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(prices).map(([symbol, data]: [string, any]) => (
          <AssetCard 
            key={symbol} 
            symbol={symbol} 
            price={data.price} 
            change={data.change} 
            status={data.status} 
          />
        ))}
      </div>

      {/* Main Trading HUD - Split View */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Bot Execution (Stakent List) */}
        <div className="xl:col-span-8 bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] overflow-hidden">
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#111113]/50">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400"><BarChart3 className="w-4 h-4" /></div>
                <h3 className="text-sm font-black uppercase tracking-widest italic">Autonomous Strategy Execution</h3>
             </div>
             <RefreshCcw className="w-4 h-4 text-zinc-700 hover:text-emerald-400 cursor-pointer transition-colors" />
          </div>

          <div className="p-8 space-y-6">
             {botLogs.map(log => (
               <div key={log.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                  <div className="flex items-center gap-6">
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[10px] ${
                       log.type === 'BUY' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                       log.type === 'SELL' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                       'bg-zinc-800 text-zinc-500 border border-white/5'
                     }`}>
                        {log.type}
                     </div>
                     <div>
                        <p className="text-sm font-black tracking-tight">{log.asset} <span className="text-zinc-600 font-bold ml-2">x {log.amount}</span></p>
                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">{log.time}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-10">
                     <div className="text-right">
                        <p className="text-sm font-black tracking-tight italic">${log.price}</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Execution Hash</p>
                     </div>
                     <MoreVertical className="w-4 h-4 text-zinc-700" />
                  </div>
               </div>
             ))}
          </div>

          <div className="p-8 border-t border-white/5 bg-white/[0.01]">
             <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic font-medium">Neural verification complete: Bot instance Universa-Alpha operational.</span>
             </div>
          </div>
        </div>

        {/* Right Column: Information Data Density */}
        <div className="xl:col-span-4 space-y-8">
           <div className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -mr-16 -mt-16" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 mb-8">Asset Surveillance</h3>
              
              <div className="space-y-10">
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-xs font-black text-zinc-700 uppercase tracking-widest mb-1">Grid Balance</p>
                       <p className="text-3xl font-black tracking-tighter">$124,500 <span className="text-sm text-zinc-600 italic">USD</span></p>
                    </div>
                    <Globe className="w-8 h-8 text-emerald-500/20" />
                 </div>

                 <div className="space-y-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700 mb-2">Cluster Allocation</p>
                    <div className="flex h-1 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 w-[60%]" />
                       <div className="h-full bg-emerald-500 w-[25%]" />
                       <div className="h-full bg-purple-500 w-[15%]" />
                    </div>
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest text-zinc-600 italic">
                       <span>Stocks</span>
                       <span>Crypto</span>
                       <span>Commodities</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="bg-indigo-600 border border-indigo-500 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[80px] -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-700"></div>
              <TrendingUp className="w-8 h-8 mb-6" />
              <h4 className="text-xl font-black tracking-tighter mb-4 italic leading-tight">Bot Intelligence <br /> Protocol.</h4>
              <p className="text-indigo-200 text-xs font-bold leading-relaxed mb-10 opacity-80">El bot está usando n8n para sincronizar señales de Alpha Vantage con tu terminal de ejecución MtApi.</p>
              <button className="w-full py-4 bg-white text-black font-black rounded-2xl text-[10px] uppercase tracking-widest flex items-center justify-center gap-3">
                 Manage Logic <ArrowUpRight className="w-4 h-4" />
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}

function AssetCard({ symbol, price, change, status }: { symbol: string; price: number; change: number; status: string }) {
  const isUp = change > 0;
  return (
    <div className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-white/10 transition-all">
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs italic">
              {symbol}
           </div>
           <div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">{status}</p>
              <h4 className="text-xl font-black tracking-tighter">{symbol}/USD</h4>
           </div>
        </div>
        <div className={`p-3 rounded-xl ${isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} border border-white/5`}>
           {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
        </div>
      </div>
      <div>
         <p className="text-3xl font-black tracking-tighter leading-none mb-2 italic">${price.toLocaleString()}</p>
         <p className={`text-[10px] font-black flex items-center gap-1 ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {isUp ? '+' : ''}{change}% <span className="text-zinc-700 font-bold ml-1">Today</span>
         </p>
      </div>
    </div>
  );
}