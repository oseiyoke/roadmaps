import React from 'react';
import { COLOR_PALETTE } from './constants';

/**
 * SVG definitions component containing all gradients and filters
 * used in the landscape background
 */
export const SVGDefs: React.FC = () => {
  const { terrain, sky } = COLOR_PALETTE;
  
  return (
    <defs>
      {/* Hill gradients for each layer */}
      <linearGradient id="veryFarHillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={terrain.farHills.primary} stopOpacity="0.4" />
        <stop offset="100%" stopColor={terrain.farHills.secondary} stopOpacity="0.2" />
      </linearGradient>
      
      <linearGradient id="farHillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={terrain.farHills.primary} stopOpacity="0.6" />
        <stop offset="100%" stopColor={terrain.farHills.secondary} stopOpacity="0.3" />
      </linearGradient>
      
      <linearGradient id="midHillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={terrain.midHills.primary} stopOpacity="0.7" />
        <stop offset="100%" stopColor={terrain.midHills.secondary} stopOpacity="0.4" />
      </linearGradient>
      
      <linearGradient id="midNearHillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={terrain.midHills.primary} stopOpacity="0.75" />
        <stop offset="100%" stopColor={terrain.midHills.secondary} stopOpacity="0.45" />
      </linearGradient>
      
      <linearGradient id="nearHillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={terrain.nearHills.primary} stopOpacity="0.8" />
        <stop offset="100%" stopColor={terrain.nearHills.secondary} stopOpacity="0.5" />
      </linearGradient>

      <linearGradient id="veryNearHillGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={terrain.nearHills.primary} stopOpacity="0.9" />
        <stop offset="100%" stopColor={terrain.nearHills.secondary} stopOpacity="0.6" />
      </linearGradient>

      {/* Atmospheric overlay gradient */}
      <radialGradient id="atmosphereGradient" cx="50%" cy="30%" r="60%">
        <stop offset="0%" stopColor={sky.medium} stopOpacity="0.2" />
        <stop offset="50%" stopColor={sky.dark} stopOpacity="0.1" />
        <stop offset="100%" stopColor={sky.light} stopOpacity="0" />
      </radialGradient>

      {/* Sky gradient background */}
      <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={sky.light} />
        <stop offset="50%" stopColor={sky.medium} />
        <stop offset="100%" stopColor={sky.dark} />
      </linearGradient>

      {/* Mist blur effect for hills */}
      <filter id="mistBlur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
      </filter>

      {/* Tree blur for distant trees */}
      <filter id="treeBlur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
      </filter>

      {/* Cloud blur for distant clouds */}
      <filter id="cloudBlur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
      </filter>
    </defs>
  );
}; 