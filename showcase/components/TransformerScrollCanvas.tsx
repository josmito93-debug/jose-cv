"use client";

import React, { useRef, useEffect, useState } from "react";
import { MotionValue, useTransform, useMotionValueEvent } from "framer-motion";

interface Props {
  scrollYProgress: MotionValue<number>;
  totalFrames: number;
  imageFolderPath: string;
  mode?: "scroll" | "splash";
  onComplete?: () => void;
}

const TransformerScrollCanvas: React.FC<Props> = ({
  scrollYProgress,
  totalFrames,
  imageFolderPath,
  mode = "scroll",
  onComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Transform scroll [0..1] to frame index [0..totalFrames-1]
  const frameIndex = useTransform(scrollYProgress, [0, 1], [1, totalFrames]);

  useEffect(() => {
    // Preload all frames
    const preloadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      const imagePromises = Array.from({ length: totalFrames }, (_, i) => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.src = `${imageFolderPath}${i + 1}.jpg`;
          img.onload = () => resolve();
          loadedImages[i] = img;
        });
      });

      await Promise.all(imagePromises);
      setImages(loadedImages);
      setIsLoading(false);
      
      // Draw first frame immediately
      if (loadedImages[0]) drawImage(0, loadedImages);

      // Trigger splash animation if mode is splash
      if (mode === "splash") {
        const { animate } = await import("framer-motion");
        animate(0, 1, {
          duration: 3.5,
          ease: "easeInOut",
          onUpdate: (latest) => {
            scrollYProgress.set(latest);
          },
          onComplete: () => {
             if (onComplete) onComplete();
          }
        });
      }
    };

    preloadImages();
  }, [totalFrames, imageFolderPath]);

  const drawImage = (index: number, loadedImages = images) => {
    const canvas = canvasRef.current;
    if (!canvas || !loadedImages[index]) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = loadedImages[index];
    const dpr = window.devicePixelRatio || 1;

    // High-DPI Scaling
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);

    // Object-fit: contain logic
    const imgRatio = img.width / img.height;
    const canvasRatio = window.innerWidth / window.innerHeight;
    let drawWidth, drawHeight, x, y;

    if (imgRatio > canvasRatio) {
      drawWidth = window.innerWidth;
      drawHeight = window.innerWidth / imgRatio;
      x = 0;
      y = (window.innerHeight - drawHeight) / 2;
    } else {
      drawWidth = window.innerHeight * imgRatio;
      drawHeight = window.innerHeight;
      x = (window.innerWidth - drawWidth) / 2;
      y = 0;
    }

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.drawImage(img, x, y, drawWidth, drawHeight);
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    const roundedIndex = Math.floor(latest);
    if (images.length > 0) {
      drawImage(Math.min(roundedIndex - 1, totalFrames - 1));
    }
  });

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      const latestFrame = Math.floor(frameIndex.get());
      drawImage(Math.min(latestFrame - 1, totalFrames - 1));
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [images, totalFrames, frameIndex]);

  return (
    <div className="relative w-full h-screen bg-[#0b0b0b]">
      <canvas
        ref={canvasRef}
        className="block w-full h-full object-contain"
        aria-hidden="true"
      />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-white font-mono text-xs tracking-widest uppercase">
          Initializing Engine...
        </div>
      )}
    </div>
  );
};

export default TransformerScrollCanvas;
