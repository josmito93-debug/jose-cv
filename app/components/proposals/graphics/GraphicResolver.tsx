'use client';

import React from 'react';
import * as Bento from './BentoGraphics';

export type GraphicId = 
  | 'panenka-video'
  | 'panenka-web'
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
  | 'milex-notifications';

interface GraphicResolverProps {
  id: GraphicId | string;
}

export default function GraphicResolver({ id }: GraphicResolverProps) {
  switch (id) {
    case 'panenka-video':
      return <Bento.BentoVideo />;
    case 'panenka-web':
      return <Bento.BentoWeb />;
    case 'panenka-advantage':
      return <Bento.BentoAdvantage />;
    case 'panenka-journey':
      return <Bento.BentoJourney />;
    case 'panenka-tracking':
      return <Bento.BentoTracking />;
    case 'panenka-ads':
      return <Bento.BentoAds />;
    case 'panenka-design':
      return <Bento.BentoDesign />;
    case 'coyo-ecosystem':
      return <Bento.BentoEcosystem />;
    case 'coyo-qr':
      return <Bento.BentoQR />;
    case 'coyo-data':
      return <Bento.BentoDataTracking />;
    case 'coyo-clover':
      return <Bento.BentoClover />;
    case 'coyo-content':
      return <Bento.BentoVideo />; // Reusing the high-end video graphic for coyo-content
    case 'coyo-events':
      return <Bento.BentoEvents />;
    case 'coyo-comparison':
      return <Bento.BentoComparison />;
    case 'milex-portfolio':
      return <Bento.BentoMilexPortfolio />;
    case 'milex-services':
      return <Bento.BentoMilexServices />;
    case 'milex-booking':
      return <Bento.BentoMilexBooking />;
    case 'milex-payments':
      return <Bento.BentoMilexPayments />;
    case 'milex-notifications':
      return <Bento.BentoMilexNotifications />;
    default:
      return null;
  }
}
