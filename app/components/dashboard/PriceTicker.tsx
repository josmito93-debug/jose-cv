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
    <div className="w-full bg-black/60 border-y border-white/5 py-4 overflow-hidden relative backdrop-blur-sm">
      {/* Decorative center line/edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black via-black/50 to-transparent z-10" />
      
      <motion.div 
        className="flex items-center gap-16 whitespace-nowrap px-10"
        animate={{ x: [0, -1200] }}
        transition={{ 
          duration: 35, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      >
        {displayData.map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="flex items-center gap-4">
            <span className="text-[10px] font-medium uppercase text-zinc-500 tracking-widest">{item.symbol}</span>
            <span className="text-[14px] font-black text-white tracking-tight">
              ${item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`text-[11px] font-bold ${item.isUp ? 'text-[#00FF94]' : 'text-rose-500'}`}>
              {item.isUp ? '+' : ''}{item.change.toFixed(2)}%
            </span>
            <div className="w-1 h-1 rounded-full bg-white/10 mx-2" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
