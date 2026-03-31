'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Calendar } from 'lucide-react';

interface NewsItem {
  title: string;
  url: string;
  source: { name: string };
  publishedAt: string;
  description: string;
  urlToImage?: string;
}

interface SectorNewsProps {
  category: string;
}

export default function SectorNews({ category }: SectorNewsProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(`/api/market-data?type=news&category=${category}`);
        const json = await res.json();
        if (json.success) {
          setNews(json.data);
        }
      } catch (error) {
        console.error('News fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
    const interval = setInterval(fetchNews, 120000); // 2 minutes
    return () => clearInterval(interval);
  }, [category]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-48 bg-white/5 animate-pulse rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-white/5 animate-pulse rounded-[2.5rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-10 mt-10 border-t border-white/5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Newspaper size={18} />
          </div>
          <h3 className="text-xl font-black italic tracking-tight">Daily Intelligence <span className="text-zinc-500 uppercase text-[10px] tracking-[0.4em] ml-3 pl-3 border-l border-white/10 font-black">{category} EPAs</span></h3>
        </div>
        <div className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-zinc-600">Real-Time Sync</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item, i) => (
          <motion.a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group block bg-[#0C0C0E] border border-white/5 rounded-[2.5rem] p-8 hover:border-indigo-500/30 transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="flex flex-col h-full gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-indigo-400/70">
                  <span className="flex items-center gap-1.5"><Calendar size={10} /> {new Date(item.publishedAt).toLocaleDateString()}</span>
                  <span className="bg-white/5 px-2 py-0.5 rounded-md">{item.source?.name}</span>
                </div>
                <h4 className="text-sm font-black leading-snug group-hover:text-indigo-300 transition-colors line-clamp-2">{item.title}</h4>
                <p className="text-[11px] text-zinc-500 line-clamp-3 leading-relaxed">{item.description}</p>
              </div>
              
              <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Read Analysis</span>
                <ExternalLink size={12} className="text-zinc-700 group-hover:text-indigo-400 transition-colors" />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
      
      {news.length === 0 && (
        <div className="text-center py-20 bg-white/[0.02] rounded-[2.5rem] border border-white/5 border-dashed">
          <p className="text-xs text-zinc-600 italic">No news entries detected for this sector yet.</p>
        </div>
      )}
    </div>
  );
}
