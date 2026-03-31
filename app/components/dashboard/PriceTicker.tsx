'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TickerItem {
  symbol: string;
  price: number;
  change: number;
  isUp: boolean;
}

interface PriceTickerProps {
  category: string;
}

export default function PriceTicker({ category }: PriceTickerProps) {
  const [data, setData] = useState<TickerItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/market-data?category=${category}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error('Ticker fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // 30s update
    return () => clearInterval(interval);
  }, [category]);

  if (loading || data.length === 0) return null;

  // Duplicate data for infinite scroll effect
  const displayData = [...data, ...data, ...data];

  return (
    <div className="w-full bg-[#050505] border-y border-white/5 py-4 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#050505] via-[#050505]/80 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#050505] via-[#050505]/80 to-transparent z-10" />
      
      <motion.div 
        className="flex items-center gap-16 whitespace-nowrap px-8"
        animate={{ x: [0, -1200] }}
        transition={{ 
          duration: 25, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {displayData.map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex items-center gap-4 group">
            <span className="text-[11px] font-black uppercase text-zinc-600 tracking-[0.2em] group-hover:text-indigo-400 transition-colors">{item.symbol}</span>
            <span className="text-[13px] font-black italic text-white tracking-tight drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
              ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: (item.price < 1 ? 5 : 2) })}
            </span>
            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black ${
              item.isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-500'
            }`}>
              {item.isUp ? <TrendingUp size={11} strokeWidth={3} /> : <TrendingDown size={11} strokeWidth={3} />}
              {Math.abs(item.change).toFixed(2)}%
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
