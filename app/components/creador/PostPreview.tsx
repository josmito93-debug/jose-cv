'use client';

import { motion } from 'framer-motion';
import { Smartphone, Instagram, Facebook as FbIcon, Share2, MessageCircle, Heart, Bookmark } from 'lucide-react';

interface PostPreviewProps {
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'TIKTOK';
  image: string;
  copy: string;
  clientName: string;
}

export default function PostPreview({ platform, image, copy, clientName }: PostPreviewProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-zinc-900/50 border border-white/5 rounded-[3rem] backdrop-blur-2xl">
      <div className="mb-6 flex items-center gap-3">
         <Smartphone className="w-5 h-5 text-zinc-500" />
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Live Mockup Preview</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-[300px] h-[600px] bg-black border-[10px] border-zinc-800 rounded-[3rem] overflow-hidden relative shadow-2xl"
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-800 rounded-b-2xl z-50"></div>

        {/* Content */}
        <div className="h-full flex flex-col pt-10">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[2px]">
                <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[10px] font-bold">
                   {clientName?.charAt(0) || 'U'}
                </div>
             </div>
             <p className="text-[11px] font-bold">{clientName || 'universa.agency'}</p>
          </div>

          {/* Media */}
          <div className="aspect-square bg-zinc-900 flex items-center justify-center overflow-hidden">
             {image ? (
               <img src={image} alt="Generated Content" className="w-full h-full object-cover" />
             ) : (
               <div className="text-[10px] font-black text-zinc-700 animate-pulse italic uppercase tracking-[0.2em]">Processing Image...</div>
             )}
          </div>

          {/* Actions */}
          <div className="p-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <Heart className="w-5 h-5" />
                <MessageCircle className="w-5 h-5" />
                <Share2 className="w-5 h-5" />
             </div>
             <Bookmark className="w-5 h-5" />
          </div>

          {/* Caption */}
          <div className="px-4 space-y-2 overflow-y-auto flex-1 pb-10">
             <p className="text-[11px] font-bold">{clientName || 'universa.agency'}</p>
             <p className="text-[11px] leading-relaxed text-zinc-400 whitespace-pre-wrap">
                {copy || "Escribiendo contenido de alta conversión para tu proyecto... #ElCreador #Universa"}
             </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/20 rounded-full"></div>
      </motion.div>
    </div>
  );
}
