'use client';

import React from 'react';
import dynamic from 'next/dynamic';

// Dynamic imports for all BentoGraphics components to reduce initial bundle size
const BentoVideo = dynamic(() => import('./BentoGraphics').then(m => m.BentoVideo), { ssr: false });
const BentoWeb = dynamic(() => import('./BentoGraphics').then(m => m.BentoWeb), { ssr: false });
const BentoFuego = dynamic(() => import('./BentoGraphics').then(m => m.BentoFuego), { ssr: false });
const BentoAdvantage = dynamic(() => import('./BentoGraphics').then(m => m.BentoAdvantage), { ssr: false });
const BentoJourney = dynamic(() => import('./BentoGraphics').then(m => m.BentoJourney), { ssr: false });
const BentoTracking = dynamic(() => import('./BentoGraphics').then(m => m.BentoTracking), { ssr: false });
const BentoAds = dynamic(() => import('./BentoGraphics').then(m => m.BentoAds), { ssr: false });
const BentoDesign = dynamic(() => import('./BentoGraphics').then(m => m.BentoDesign), { ssr: false });
const BentoEcosystem = dynamic(() => import('./BentoGraphics').then(m => m.BentoEcosystem), { ssr: false });
const BentoQR = dynamic(() => import('./BentoGraphics').then(m => m.BentoQR), { ssr: false });
const BentoDataTracking = dynamic(() => import('./BentoGraphics').then(m => m.BentoDataTracking), { ssr: false });
const BentoClover = dynamic(() => import('./BentoGraphics').then(m => m.BentoClover), { ssr: false });
const BentoEvents = dynamic(() => import('./BentoGraphics').then(m => m.BentoEvents), { ssr: false });
const BentoComparison = dynamic(() => import('./BentoGraphics').then(m => m.BentoComparison), { ssr: false });
const BentoMilexPortfolio = dynamic(() => import('./BentoGraphics').then(m => m.BentoMilexPortfolio), { ssr: false });
const BentoMilexServices = dynamic(() => import('./BentoGraphics').then(m => m.BentoMilexServices), { ssr: false });
const BentoMilexBooking = dynamic(() => import('./BentoGraphics').then(m => m.BentoMilexBooking), { ssr: false });
const BentoMilexPayments = dynamic(() => import('./BentoGraphics').then(m => m.BentoMilexPayments), { ssr: false });
const BentoMilexNotifications = dynamic(() => import('./BentoGraphics').then(m => m.BentoMilexNotifications), { ssr: false });
const BentoN8nFlow = dynamic(() => import('./BentoGraphics').then(m => m.BentoN8nFlow), { ssr: false });
const BentoInstagram = dynamic(() => import('./BentoGraphics').then(m => m.BentoInstagram), { ssr: false });

export type GraphicId = 
  | 'panenka-video'
  | 'panenka-web'
  | 'fuego-web'
  | 'panenka-advantage'
  | 'panenka-journey'
  | 'panenka-tracking'
  | 'panenka-ads'
  | 'panenka-design'
  | 'coyo-ecosystem'
  | 'coyo-clover'
  | 'coyo-qr'
  | 'coyo-data'
  | 'coyo-content'
  | 'coyo-events'
  | 'coyo-comparison'
  | 'milex-portfolio'
  | 'milex-services'
  | 'milex-booking'
  | 'milex-payments'
  | 'milex-notifications'
  | 'n8n-flow'
  | 'roxe-instagram';

interface GraphicResolverProps {
  id: GraphicId | string;
}

export default function GraphicResolver({ id }: GraphicResolverProps) {
  switch (id) {
    case 'panenka-video':
      return <BentoVideo />;
    case 'panenka-web':
      return <BentoWeb />;
    case 'fuego-web':
      return <BentoFuego />;
    case 'panenka-advantage':
      return <BentoAdvantage />;
    case 'panenka-journey':
      return <BentoJourney />;
    case 'panenka-tracking':
      return <BentoTracking />;
    case 'panenka-ads':
      return <BentoAds />;
    case 'panenka-design':
      return <BentoDesign />;
    case 'coyo-ecosystem':
      return <BentoEcosystem />;
    case 'coyo-qr':
      return <BentoQR />;
    case 'coyo-data':
      return <BentoDataTracking />;
    case 'coyo-clover':
      return <BentoClover />;
    case 'coyo-content':
      return <BentoVideo />; // Reusing the high-end video graphic for coyo-content
    case 'coyo-events':
      return <BentoEvents />;
    case 'coyo-comparison':
      return <BentoComparison />;
    case 'milex-portfolio':
      return <BentoMilexPortfolio />;
    case 'milex-services':
      return <BentoMilexServices />;
    case 'milex-booking':
      return <BentoMilexBooking />;
    case 'milex-payments':
      return <BentoMilexPayments />;
    case 'milex-notifications':
      return <BentoMilexNotifications />;
    case 'n8n-flow':
      return <BentoN8nFlow />;
    case 'roxe-instagram':
      return <BentoInstagram />;
    default:
      return null;
  }
}
