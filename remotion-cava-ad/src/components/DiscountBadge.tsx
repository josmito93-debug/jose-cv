import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const DiscountBadge: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: frame - delay,
    fps,
    config: {
      tension: 200,
    },
  });

  const rotate = interpolate(spr, [0, 1], [-45, -10]);
  const scale = interpolate(spr, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 150,
        right: 80,
        backgroundColor: '#00FF88',
        color: 'black',
        padding: '20px 40px',
        borderRadius: '20px',
        fontFamily: 'VisbyCF-Bold',
        fontSize: 60,
        fontWeight: 'bold',
        transform: `scale(${scale}) rotate(${rotate}deg)`,
        boxShadow: '0 10px 40px rgba(0, 255, 136, 0.5)',
        zIndex: 30,
      }}
    >
      30% OFF
    </div>
  );
};
