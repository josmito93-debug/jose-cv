import React from 'react';
import { 
  Composition, 
  Sequence, 
  Video, 
  staticFile, 
  useVideoConfig,
  AbsoluteFill
} from 'remotion';
import { TextOverlay } from './components/TextOverlay';
import { PriceReveal } from './components/PriceReveal';
import { DiscountBadge } from './components/DiscountBadge';

const videos = [
	'IMG_5722_2.mp4',
	'IMG_5723_2.mp4',
	'IMG_5724_2.mp4',
	'IMG_5725_2.mp4',
	'IMG_5726_2.mp4',
	'IMG_5727_2.mp4',
	'IMG_5737_2.mp4',
	'IMG_5738_2.mp4',
	'IMG_5739_2.mp4',
	'IMG_5740_2.mp4',
	'IMG_5742_2.mp4',
	'IMG_5743_2.mp4',
	'IMG_5744_2.mp4',
];

export const AdComposition: React.FC = () => {
  const { fps, durationInFrames } = useVideoConfig();

  // Each video gets ~45 frames (1.5 seconds)
  const clipDuration = Math.floor(durationInFrames / videos.length);

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      <style>{`
        @font-face {
          font-family: 'VisbyCF-Bold';
          src: url('${staticFile('fonts/VisbyCF-BoldOblique.otf')}') format('opentype');
          font-weight: bold;
        }
        @font-face {
          font-family: 'VisbyCF-Heavy';
          src: url('${staticFile('fonts/VisbyCF-HeavyOblique.otf')}') format('opentype');
          font-weight: 900;
        }
        @font-face {
          font-family: 'VisbyCF-Medium';
          src: url('${staticFile('fonts/VisbyCF-Medium.otf')}') format('opentype');
          font-weight: 500;
        }
        @font-face {
          font-family: 'VisbyCF-Light';
          src: url('${staticFile('fonts/VisbyCF-Light.otf')}') format('opentype');
          font-weight: 300;
        }
      `}</style>
      {/* Background Video Sequence */}
      {videos.map((vid, i) => (
        <Sequence key={vid} from={i * clipDuration} durationInFrames={clipDuration}>
          <Video 
            src={staticFile(`videos_mp4/${vid}`)} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover' 
            }}
            muted
            delayRenderTimeoutInMilliseconds={120000}
          />
        </Sequence>
      ))}

      {/* Overlays synchronized with the aggressive VO script */}
      <Sequence from={0} durationInFrames={60}>
        <TextOverlay text="¿Tu hielo se vuelve agua?" fontSize={70} color="#00E5FF" />
      </Sequence>

      <Sequence from={60} durationInFrames={90}>
        <TextOverlay 
          text={[
            "Capacidad: 934 Lt",
            "Temp: Hasta -20 °C",
            "Medidas: 1230 x 1990 x 810 mm",
            "Voltaje: 110v | Potencia: HP",
            "Refrigerante: R404",
            "Termostato Full-Gauge"
          ]} 
          fontSize={50} 
          color="#00E5FF" 
        />
      </Sequence>

      <Sequence from={150} durationInFrames={90}>
        <TextOverlay 
          text={["Cava Khaled", "100 Bolsas Siempre Frías"]} 
          fontSize={110} 
          color="#00FF88" 
        />
      </Sequence>

      <Sequence from={240} durationInFrames={120}>
        <DiscountBadge delay={0} />
        <TextOverlay 
          text={["Ahorra el 30%", "Precio de Fábrica"]} 
          fontSize={90} 
          color="#00FF88" 
        />
      </Sequence>

      <Sequence from={360} durationInFrames={120}>
        <PriceReveal delay={0} />
      </Sequence>

      <Sequence from={480} durationInFrames={120}>
        <TextOverlay 
          text={["¡Cómprala Ya!", "Antes que tu competencia"]} 
          fontSize={100} 
          color="#00FF88" 
        />
      </Sequence>
    </AbsoluteFill>
  );
};

export const Main: React.FC = () => {
  return (
    <Composition
      id="AdComposition"
      component={AdComposition}
      durationInFrames={600}
      fps={30}
      width={720}
      height={1280}
    />
  );
};
