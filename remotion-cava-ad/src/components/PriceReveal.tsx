import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const PriceReveal: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: frame - delay,
    fps,
    config: {
      mass: 0.5,
      stiffness: 150,
      damping: 10,
    },
  });

  const opacity = interpolate(frame - delay, [0, 5], [0, 1], {
    extrapolateLeft: 'clamp',
  });

  const scale = interpolate(spr, [0, 1], [0.5, 1.5]);
  const blur = interpolate(spr, [0, 1], [20, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 20,
      }}
    >
      <div
        style={{
          fontSize: 50,
          color: '#00FF88',
          fontFamily: 'VisbyCF-Medium',
          opacity,
          transform: `translateY(${interpolate(spr, [0, 1], [20, 0])}px)`,
        }}
      >
        Precio Promocional
      </div>
      <div
        style={{
          fontSize: 180,
          color: 'white',
          fontFamily: 'VisbyCF-Heavy',
          fontWeight: '900',
          opacity,
          transform: `scale(${interpolate(spr, [0, 1], [0.8, 1.1])})`,
          filter: `blur(${blur}px)`,
          textShadow: '0 0 50px rgba(0, 255, 136, 0.4)',
        }}
      >
        $1,950
      </div>
      <div
        style={{
          fontSize: 35,
          color: 'white',
          fontFamily: 'VisbyCF-Light',
          marginTop: 10,
          opacity,
        }}
      >
        Pago en divisas
      </div>
    </div>
  );
};
