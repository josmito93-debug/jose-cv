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
  | 'panenka-design';

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
    default:
      return null;
  }
}
