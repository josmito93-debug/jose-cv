"use client";

import React, { useRef, useState, useEffect } from "react";
import { useScroll } from "framer-motion";
import TransformerScrollCanvas from "@/components/TransformerScrollCanvas";
import TransformerExperience from "@/components/TransformerExperience";
import { transformerData } from "@/data/transformerData";

export default function ShowcasePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<"scroll" | "splash">("scroll");
  
  const { scrollYProgress } = useScroll({
    target: mode === "scroll" ? containerRef : undefined,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("mode") === "splash") {
        setMode("splash");
      }
    }
  }, []);

  const handleComplete = () => {
    if (typeof window !== "undefined") {
      window.parent.postMessage({ type: "TRANSFORM_COMPLETE" }, "*");
    }
  };

  return (
    <main 
      ref={containerRef} 
      className={`bg-[#0b0b0b] selection:bg-[#B71C1C] selection:text-white ${mode === "splash" ? "h-screen overflow-hidden" : "min-h-screen"}`}
    >
      <section 
        className="relative"
        style={{ height: mode === "splash" ? "100vh" : transformerData.scrollLength }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <TransformerScrollCanvas 
            scrollYProgress={scrollYProgress} 
            totalFrames={transformerData.totalFrames} 
            imageFolderPath={transformerData.imageFolderPath} 
            mode={mode}
            onComplete={handleComplete}
          />
          <TransformerExperience scrollYProgress={scrollYProgress} />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-1" />
        </div>
      </section>
    </main>
  );
}
