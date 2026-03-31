'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Activity } from 'lucide-react';

interface TrendingItem {
  ticker: string;
  price: string;
  change_amount: string;
  change_percentage: string;
}

interface TrendingAssetsProps {
  category: string;
}

export default function TrendingAssets({ category }: TrendingAssetsProps) {
  const [data, setData] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await fetch(`/api/market-data?type=trending&category=${category}`);
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (error) {
        console.error('Trending fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
    const interval = setInterval(fetchTrending, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading || data.length === 0) return null;

  return (
    <div className="bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
          <Activity size={16} />
        </div>
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 italic">Market Trending ({category})</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {data.map((item, i) => (
          <motion.div 
            key={item.ticker}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col gap-1"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-black italic text-white">{item.ticker}</span>
              <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-400">
                <TrendingUp size={10} />
                {parseFloat(item.change_percentage).toFixed(2)}%
              </div>
            </div>
            <span className="text-[10px] font-bold text-zinc-600">${parseFloat(item.price).toFixed(2)}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
