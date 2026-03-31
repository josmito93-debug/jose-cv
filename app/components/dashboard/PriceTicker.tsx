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
        setData(json.tickers || []);
      }
    } catch (error) {
      console.error('Ticker fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [category]);

  const getFallbackData = () => {
    const fallbacks: Record<string, TickerItem[]> = {
      Crypto: [
        { symbol: 'BTC', price: 95420.50, change: 1.25, isUp: true },
        { symbol: 'ETH', price: 2740.15, change: -0.45, isUp: false },
        { symbol: 'SOL', price: 185.30, change: 4.12, isUp: true },
        { symbol: 'BNB', price: 590.20, change: 0.85, isUp: true },
        { symbol: 'XRP', price: 2.10, change: -1.20, isUp: false },
      ],
      Metals: [
        { symbol: 'GOLD', price: 2150.80, change: 0.15, isUp: true },
        { symbol: 'SILVER', price: 24.50, change: -0.50, isUp: false },
        { symbol: 'PLAT', price: 980.00, change: 1.10, isUp: true },
        { symbol: 'COPPER', price: 3.85, change: 0.25, isUp: true },
      ],
      Forex: [
        { symbol: 'EUR/USD', price: 1.0850, change: 0.12, isUp: true },
        { symbol: 'GBP/USD', price: 1.2640, change: -0.08, isUp: false },
        { symbol: 'USD/JPY', price: 148.20, change: 0.45, isUp: true },
        { symbol: 'AUD/USD', price: 0.6520, change: -0.30, isUp: false },
      ],
      Stocks: [
        { symbol: 'NVDA', price: 145.20, change: 2.85, isUp: true },
        { symbol: 'TSLA', price: 250.10, change: -1.20, isUp: false },
        { symbol: 'AAPL', price: 185.50, change: 0.75, isUp: true },
        { symbol: 'MSFT', price: 410.20, change: 1.15, isUp: true },
        { symbol: 'AMZN', price: 175.80, change: -0.60, isUp: false },
      ],
    };
    return fallbacks[category as keyof typeof fallbacks] || fallbacks.Crypto;
  };

  const displayItems = data.length > 0 ? data : getFallbackData();
  const displayData = [...displayItems, ...displayItems, ...displayItems, ...displayItems];

  return (
    <div className="w-full bg-black/60 border-y border-white/5 py-4 overflow-hidden relative backdrop-blur-sm">
      {/* Decorative center line/edge fades */}
      <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-black via-black/50 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-black via-black/50 to-transparent z-10" />
      
      <motion.div 
        className="flex items-center gap-16 whitespace-nowrap px-10"
        animate={{ x: [0, -2500] }}
        transition={{ 
          duration: 60, 
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
