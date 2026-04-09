'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  isUp: boolean;
  sector: 'Crypto' | 'Metals' | 'Stocks' | 'Forex';
}

const MOCK_DATA: TickerItem[] = [
  // Crypto
  { symbol: 'BTC', price: 68420.50, change: 2.5, isUp: true, sector: 'Crypto' },
  { symbol: 'ETH', price: 3450.12, change: -1.2, isUp: false, sector: 'Crypto' },
  { symbol: 'SOL', price: 185.05, change: 8.4, isUp: true, sector: 'Crypto' },
  { symbol: 'BNB', price: 580.20, change: 0.5, isUp: true, sector: 'Crypto' },
  // Metals
  { symbol: 'GOLD', price: 2175.40, change: 1.2, isUp: true, sector: 'Metals' },
  { symbol: 'SILVER', price: 24.85, change: 0.3, isUp: true, sector: 'Metals' },
  { symbol: 'PLATINUM', price: 920.15, change: -0.8, isUp: false, sector: 'Metals' },
  { symbol: 'PALLADIUM', price: 1045.50, change: -2.1, isUp: false, sector: 'Metals' },
  // Stocks
  { symbol: 'AAPL', price: 172.62, change: 0.4, isUp: true, sector: 'Stocks' },
  { symbol: 'TSLA', price: 175.22, change: -2.4, isUp: false, sector: 'Stocks' },
  { symbol: 'NVDA', price: 890.50, change: 3.2, isUp: true, sector: 'Stocks' },
  { symbol: 'MSFT', price: 420.10, change: 1.1, isUp: true, sector: 'Stocks' },
  // Forex
  { symbol: 'EUR/USD', price: 1.0842, change: 0.1, isUp: true, sector: 'Forex' },
  { symbol: 'GBP/USD', price: 1.2650, change: -0.2, isUp: false, sector: 'Forex' },
  { symbol: 'USD/JPY', price: 151.40, change: 0.4, isUp: true, sector: 'Forex' },
  { symbol: 'AUD/USD', price: 0.6520, change: -0.3, isUp: false, sector: 'Forex' },
];

export default function PriceTicker({ sector }: { sector?: 'Crypto' | 'Metals' | 'Stocks' | 'Forex' }) {
  const [data, setData] = useState<TickerItem[]>([]);

  useEffect(() => {
    const filtered = sector ? MOCK_DATA.filter(item => item.sector === sector) : MOCK_DATA;
    // Duplicate for infinite scroll
    setData([...filtered, ...filtered, ...filtered]);
  }, [sector]);

  if (data.length === 0) return null;

  return (
    <div className="relative w-full h-14 bg-black/40 border-y border-white/5 overflow-hidden flex items-center group backdrop-blur-sm">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black to-transparent z-10" />
      
      <motion.div 
        className="flex items-center gap-16 whitespace-nowrap px-10"
        animate={{ x: [0, -1500] }}
        transition={{ 
          duration: sector ? 30 : 60, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {data.map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex items-center gap-4">
             <div className="flex flex-col items-start">
               <span className="text-[8px] font-black uppercase text-zinc-600 tracking-[0.2em]">{item.sector}</span>
               <span className="text-[11px] font-bold uppercase text-white tracking-widest">{item.symbol}</span>
             </div>
            <span className="text-[14px] font-black text-white tracking-tighter italic">
              {item.price > 10 ? item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : item.price.toFixed(4)}
            </span>
            <span className={`text-[10px] font-black flex items-center gap-1 ${item.isUp ? 'text-emerald-400' : 'text-rose-500'}`}>
              <span className="text-[8px]">{item.isUp ? '▲' : '▼'}</span>
              {item.isUp ? '+' : ''}{item.change.toFixed(2)}%
            </span>
            <div className="w-[1px] h-4 bg-white/10 mx-2" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
