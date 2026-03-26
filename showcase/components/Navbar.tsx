"use client";

import React from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-8 pointer-events-none"
    >
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="w-8 h-8 bg-white flex items-center justify-center">
          <span className="text-black font-bold font-orbitron text-xs">JF</span>
        </div>
        <span className="font-orbitron text-xs tracking-[0.3em] font-bold text-white hidden sm:block">
          CINEMATIC_ENGINE_V1
        </span>
      </div>
      
      <div className="flex gap-8 items-center pointer-events-auto">
        <a 
          href="/" 
          className="text-white font-orbitron text-[10px] tracking-[0.2em] hover:text-[#B71C1C] transition-colors"
        >
          PORTFOLIO
        </a>
        <button className="px-6 py-2 bg-white text-black font-orbitron text-[10px] tracking-[0.2em] font-bold hover:bg-[#B71C1C] hover:text-white transition-all duration-500">
          INQUIRE
        </button>
      </div>
    </motion.nav>
  );
};

export default Navbar;
