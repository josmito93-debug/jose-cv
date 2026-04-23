import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

interface TextOverlayProps {
  text: string | string[];
  delay?: number;
  color?: string;
  fontSize?: number;
}

export const TextOverlay: React.FC<TextOverlayProps> = ({ 
  text, 
  delay = 0, 
  color = 'white', 
  fontSize = 100 
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const spr = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 12,
    },
  });

  const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const translateY = interpolate(spr, [0, 1], [30, 0]);
  const scale = interpolate(spr, [0, 1], [0.95, 1]);

  const lines = Array.isArray(text) ? text : [text];

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
        textAlign: 'center',
        padding: '0 60px',
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        fontFamily: 'VisbyCF-Heavy',
        color,
        textShadow: '0 4px 20px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.5)',
        zIndex: 100,
        pointerEvents: 'none',
      }}
    >
      {lines.map((line, i) => (
        <div 
          key={i}
          style={{ 
            fontSize: i === 0 ? fontSize : fontSize * 0.7,
            lineHeight: 1,
            marginBottom: '10px',
            letterSpacing: '-2px',
            wordBreak: 'break-word',
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};
