"use client";

import React from "react";
import { motion, MotionValue, useTransform, useMotionValueEvent } from "framer-motion";
import { transformerData } from "@/data/transformerData";

interface Props {
  scrollYProgress: MotionValue<number>;
}

const TransformerExperience: React.FC<Props> = ({ scrollYProgress }) => {
  // Animating HUD opacity and translation based on scroll phases
  const hudOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 1]);
  const scanlineY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <motion.div 
      style={{ opacity: hudOpacity }}
      className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-8 md:p-12"
    >
      {/* Top HUD Row */}
      <div className="flex justify-between items-start">
        <div className="accent-border pl-4">
          <h2 className="text-xs md:text-sm font-bold tracking-[0.3em] text-white">
            UNIT: TRANSFORMER_SEQ_01
          </h2>
          <p className="hud-text mt-1 uppercase">
            Status: Operational // Rendering High-DPI
          </p>
        </div>
        <div className="text-right">
          <p className="hud-text uppercase">Frame Sequence</p>
          <div className="text-xl md:text-2xl font-bold font-orbitron text-white">
            <FrameCounter scrollYProgress={scrollYProgress} /> / 191
          </div>
        </div>
      </div>

      {/* Dynamic Content Overlay (Center-Aligned but pushed to edges) */}
      <div className="flex-1 flex flex-col justify-center gap-24">
        {transformerData.hud.map((phase, i) => (
          <PhaseContent 
            key={i} 
            phase={phase} 
            scrollYProgress={scrollYProgress} 
          />
        ))}
      </div>

      {/* Bottom HUD Row */}
      <div className="flex justify-between items-end">
        <div className="max-w-xs">
          <p className="hud-text uppercase leading-relaxed">
            Precise mechanical reconfiguration driven by kinematic scroll engine.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="w-12 h-1 bg-white/20 relative overflow-hidden">
            <motion.div 
              style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
              className="absolute inset-0 bg-[#B71C1C]" 
            />
          </div>
        </div>
      </div>

      {/* Scanline effect */}
      <motion.div 
        style={{ top: scanlineY }}
        className="absolute left-0 right-0 h-[1px] bg-white/5 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
      />
    </motion.div>
  );
};

const FrameCounter = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
  const [frame, setFrame] = React.useState(0);
  
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setFrame(Math.floor(latest * 191));
  });

  return <span>{frame}</span>;
};

const PhaseContent = ({ phase, scrollYProgress }: { phase: any, scrollYProgress: MotionValue<number> }) => {
  const opacity = useTransform(
    scrollYProgress, 
    [phase.range[0], phase.range[0] + 0.05, phase.range[1] - 0.05, phase.range[1]], 
    [0, 1, 1, 0]
  );
  
  const y = useTransform(
    scrollYProgress,
    [phase.range[0], phase.range[1]],
    [20, -20]
  );

  return (
    <motion.div style={{ opacity, y }} className="max-w-lg">
      <h3 className="text-2xl md:text-4xl font-bold text-white mb-2 italic">
        {phase.title}
      </h3>
      <p className="hud-text text-sm md:text-base border-l border-[#B71C1C] pl-4 py-1 bg-gradient-to-r from-[#B71C1C]/10 to-transparent">
        {phase.caption}
      </p>
    </motion.div>
  );
};

export default TransformerExperience;
