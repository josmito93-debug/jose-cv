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
    <div className="w-full bg-black/40 border-y border-white/5 py-3 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
      
      <motion.div 
        className="flex items-center gap-10 whitespace-nowrap px-4"
        animate={{ x: [0, -1035] }}
        transition={{ 
          duration: 30, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {displayData.map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex items-center gap-3">
            <span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{item.symbol}</span>
            <span className="text-xs font-black italic text-white">${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}</span>
            <div className={`flex items-center gap-1 text-[10px] font-bold ${item.isUp ? 'text-emerald-400' : 'text-rose-500'}`}>
              {item.isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {item.change.toFixed(2)}%
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
