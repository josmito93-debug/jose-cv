'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ROCKS = [
  { id: 1, src: '/images/space-rocks/rock-1.png', top: '15%', left: '8%', size: 120, duration: 8, delay: 0 },
  { id: 2, src: '/images/space-rocks/rock-2.png', top: '35%', right: '10%', size: 180, duration: 12, delay: 1 },
  { id: 3, src: '/images/space-rocks/rock-3.png', top: '65%', left: '12%', size: 150, duration: 10, delay: 2 },
  { id: 4, src: '/images/space-rocks/rock-4.png', top: '80%', right: '15%', size: 100, duration: 7, delay: 0.5 },
  // Duplicate rocks for more density if needed
  { id: 5, src: '/images/space-rocks/rock-1.png', top: '45%', left: '85%', size: 90, duration: 9, delay: 3 },
  { id: 6, src: '/images/space-rocks/rock-3.png', top: '90%', left: '50%', size: 130, duration: 15, delay: 4 },
];

export default function SpaceRocks() {
  return (
    <div className="fixed inset-0 z-5 pointer-events-none overflow-hidden">
      {ROCKS.map((rock) => (
        <motion.div
          key={rock.id}
          initial={{ opacity: 0, y: 0 }}
          animate={{ 
            opacity: [0, 0.9, 0.7],
            y: [-30, 30, -30],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            opacity: { duration: 2 },
            y: { duration: rock.duration, repeat: Infinity, ease: "easeInOut", delay: rock.delay },
            rotate: { duration: rock.duration * 1.5, repeat: Infinity, ease: "easeInOut", delay: rock.delay }
          }}
          style={{
            position: 'absolute',
            top: rock.top,
            left: rock.left,
            right: rock.right,
            width: rock.size,
            height: 'auto',
          }}
          className="filter drop-shadow-[0_0_25px_rgba(45,220,128,0.15)]"
        >
          <img 
            src={rock.src} 
            alt="" 
            className="w-full h-full object-contain"
          />
        </motion.div>
      ))}
    </div>
  );
}
