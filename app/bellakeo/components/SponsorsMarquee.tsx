'use client';

import React from 'react';
import Image from 'next/image';

const SPONSORS = [
  { name: 'Rumix', src: '/sponsors/logo_rumix.png' },
  { name: 'Blue Hookah', src: '/sponsors/logo_blue_hookah.jpg' },
  { name: 'FC Entertainment', src: '/sponsors/logo_fc_entertainment.jpg' },
  { name: 'Indiana Robot Show', src: '/sponsors/logo_indiana_robot_show.jpg' },
];

export const SponsorsMarquee: React.FC = () => {
  // Duplicate sponsors array to ensure a seamless loop
  const list = [...SPONSORS, ...SPONSORS, ...SPONSORS];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 mb-6 overflow-hidden relative">
      {/* Accent title */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="h-px w-6 bg-zinc-800" />
        <span className="text-[9px] font-black uppercase text-zinc-500 tracking-[0.3em]">
          PRODUCIDO POR
        </span>
        <span className="h-px w-6 bg-zinc-800" />
      </div>

      {/* Marquee Wrapper with side fade overlays for a luxury feel */}
      <div className="relative w-full overflow-hidden bg-white/[0.02] border-t border-b border-white/5 py-6">
        {/* Left & Right gradient edge masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#050505] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#050505] to-transparent z-10 pointer-events-none" />

        {/* Scrolling flex row */}
        <div className="flex w-max gap-12 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused]">
          {list.map((sponsor, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center w-[160px] h-16 relative bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 rounded-xl p-3.5 transition-all duration-300 group cursor-pointer"
            >
              <Image
                src={sponsor.src}
                alt={`${sponsor.name} logo`}
                fill
                className="object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Add marquee keyframes directly in style tag for zero-config simplicity */}
      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333%, 0, 0);
          }
        }
      `}</style>
    </div>
  );
};
