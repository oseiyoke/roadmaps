import { Point2D, Tree, Cloud, HillLayer, LayerType, TreeType } from './types';
import { LANDSCAPE_DIMENSIONS, LAYER_CONFIG, CLOUD_CONFIG, TREE_CONFIG } from './constants';

/**
 * Generates a random number within a range
 */
const randomInRange = (min: number, max: number): number => {
  return min + Math.random() * (max - min);
};

/**
 * Interpolates Y position on a hill curve using linear interpolation
 */
export const getYPositionOnHill = (
  xPos: number,
  points: Point2D[],
  baseY: number,
  amplitude: number
): number => {
  // Find the two points that xPos falls between
  let leftPoint = points[0];
  let rightPoint = points[1];
  
  for (let i = 0; i < points.length - 1; i++) {
    if (xPos >= points[i].x && xPos <= points[i + 1].x) {
      leftPoint = points[i];
      rightPoint = points[i + 1];
      break;
    } else if (xPos > points[points.length - 1].x) {
      // Beyond the last point, use the last two points
      leftPoint = points[points.length - 2];
      rightPoint = points[points.length - 1];
    }
  }
  
  // Linear interpolation between the two points
  const t = (xPos - leftPoint.x) / (rightPoint.x - leftPoint.x);
  const interpolatedY = leftPoint.y + (rightPoint.y - leftPoint.y) * t;
  
  return baseY + interpolatedY * amplitude;
};

/**
 * Generates SVG path for smooth hills using quadratic bezier curves
 */
export const generateHillPath = (
  points: Point2D[],
  baseY: number,
  amplitude: number
): string => {
  let path = `M 0,${LANDSCAPE_DIMENSIONS.height}`;
  
  // Start with the first point
  path += ` L 0,${baseY + points[0].y * amplitude}`;
  
  // Use cubic bezier curves for much smoother hills
  for (let i = 0; i < points.length - 1; i++) {
    const currentPoint = points[i];
    const nextPoint = points[i + 1];
    
    const currentY = baseY + currentPoint.y * amplitude;
    const nextY = baseY + nextPoint.y * amplitude;
    
    // Calculate control points for smooth cubic curves
    const controlPoint1X = currentPoint.x + (nextPoint.x - currentPoint.x) * 0.3;
    const controlPoint1Y = currentY;
    const controlPoint2X = currentPoint.x + (nextPoint.x - currentPoint.x) * 0.7;
    const controlPoint2Y = nextY;
    
    path += ` C ${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${nextPoint.x},${nextY}`;
  }
  
  path += ` L ${LANDSCAPE_DIMENSIONS.width},${LANDSCAPE_DIMENSIONS.height} Z`;
  return path;
};

/**
 * Generates hill layer configuration
 */
export const generateHillLayers = (): HillLayer[] => {
  const { width, height } = LANDSCAPE_DIMENSIONS;
  
  return [
    {
      id: 'very-far-hills',
      className: 'landscape-layer-very-far',
      points: [
        { x: 0, y: 0.35 },
        { x: 300, y: 0.15 },
        { x: 600, y: 0.5 },
        { x: 900, y: 0.2 },
        { x: 1200, y: 0.6 },
        { x: 1500, y: 0.1 },
        { x: 1800, y: 0.45 },
        { x: 2100, y: 0.25 },
        { x: 2400, y: 0.55 },
        { x: 2700, y: 0.15 },
        { x: 3000, y: 0.4 },
        { x: 3300, y: 0.3 },
        { x: 3600, y: 0.5 },
        { x: 3900, y: 0.2 },
        { x: 4200, y: 0.4 },
        { x: width, y: 0.3 }
      ],
      baseY: height * LAYER_CONFIG.veryFarHills.baseY,
      amplitude: LAYER_CONFIG.veryFarHills.amplitude * 1.5,
      fill: 'url(#veryFarHillGradient)',
      opacity: LAYER_CONFIG.veryFarHills.opacity
    },
    {
      id: 'far-hills',
      className: 'landscape-layer-far',
      points: [
        { x: 0, y: 0.3 },
        { x: 200, y: 0.1 },
        { x: 400, y: 0.45 },
        { x: 600, y: 0.15 },
        { x: 800, y: 0.55 },
        { x: 1000, y: 0.05 },
        { x: 1200, y: 0.4 },
        { x: 1400, y: 0.1 },
        { x: 1600, y: 0.5 },
        { x: 1800, y: 0.2 },
        { x: 2000, y: 0.45 },
        { x: 2200, y: 0.15 },
        { x: 2400, y: 0.6 },
        { x: 2600, y: 0.1 },
        { x: 2800, y: 0.4 },
        { x: 3000, y: 0.2 },
        { x: 3200, y: 0.5 },
        { x: 3400, y: 0.15 },
        { x: 3600, y: 0.45 },
        { x: 3800, y: 0.25 },
        { x: 4000, y: 0.35 },
        { x: 4200, y: 0.15 },
        { x: width, y: 0.35 }
      ],
      baseY: height * LAYER_CONFIG.farHills.baseY,
      amplitude: LAYER_CONFIG.farHills.amplitude * 1.4,
      fill: 'url(#farHillGradient)',
      opacity: LAYER_CONFIG.farHills.opacity
    },
    {
      id: 'mid-hills',
      className: 'landscape-layer-mid',
      points: [
        { x: 0, y: 0.25 },
        { x: 150, y: 0.05 },
        { x: 300, y: 0.4 },
        { x: 450, y: 0.1 },
        { x: 600, y: 0.5 },
        { x: 750, y: 0.15 },
        { x: 900, y: 0.45 },
        { x: 1050, y: 0.05 },
        { x: 1200, y: 0.35 },
        { x: 1350, y: 0.15 },
        { x: 1500, y: 0.55 },
        { x: 1650, y: 0.1 },
        { x: 1800, y: 0.4 },
        { x: 1950, y: 0.2 },
        { x: 2100, y: 0.5 },
        { x: 2250, y: 0.1 },
        { x: 2400, y: 0.45 },
        { x: 2550, y: 0.15 },
        { x: 2700, y: 0.4 },
        { x: 2850, y: 0.2 },
        { x: 3000, y: 0.5 },
        { x: 3150, y: 0.1 },
        { x: 3300, y: 0.4 },
        { x: 3450, y: 0.2 },
        { x: 3600, y: 0.35 },
        { x: 3750, y: 0.15 },
        { x: 3900, y: 0.4 },
        { x: 4050, y: 0.2 },
        { x: 4200, y: 0.35 },
        { x: width, y: 0.3 }
      ],
      baseY: height * LAYER_CONFIG.midHills.baseY,
      amplitude: LAYER_CONFIG.midHills.amplitude * 1.3,
      fill: 'url(#midHillGradient)',
      opacity: LAYER_CONFIG.midHills.opacity
    },
    {
      id: 'mid-near-hills',
      className: 'landscape-layer-mid-near',
      points: [
        { x: 0, y: 0.3 },
        { x: 200, y: 0.1 },
        { x: 400, y: 0.5 },
        { x: 600, y: 0.05 },
        { x: 800, y: 0.45 },
        { x: 1000, y: 0.15 },
        { x: 1200, y: 0.55 },
        { x: 1400, y: 0.1 },
        { x: 1600, y: 0.4 },
        { x: 1800, y: 0.2 },
        { x: 2000, y: 0.5 },
        { x: 2200, y: 0.05 },
        { x: 2400, y: 0.4 },
        { x: 2600, y: 0.15 },
        { x: 2800, y: 0.5 },
        { x: 3000, y: 0.1 },
        { x: 3200, y: 0.45 },
        { x: 3400, y: 0.2 },
        { x: 3600, y: 0.4 },
        { x: 3800, y: 0.15 },
        { x: 4000, y: 0.35 },
        { x: 4200, y: 0.2 },
        { x: width, y: 0.3 }
      ],
      baseY: height * LAYER_CONFIG.midNearHills.baseY,
      amplitude: LAYER_CONFIG.midNearHills.amplitude * 1.2,
      fill: 'url(#midNearHillGradient)',
      opacity: LAYER_CONFIG.midNearHills.opacity
    },
    {
      id: 'near-hills',
      className: 'landscape-layer-near',
      points: [
        { x: 0, y: 0.2 },
        { x: 250, y: 0.4 },
        { x: 500, y: 0.05 },
        { x: 750, y: 0.45 },
        { x: 1000, y: 0.1 },
        { x: 1250, y: 0.5 },
        { x: 1500, y: 0.05 },
        { x: 1750, y: 0.4 },
        { x: 2000, y: 0.15 },
        { x: 2250, y: 0.45 },
        { x: 2500, y: 0.05 },
        { x: 2750, y: 0.4 },
        { x: 3000, y: 0.1 },
        { x: 3250, y: 0.45 },
        { x: 3500, y: 0.15 },
        { x: 3750, y: 0.4 },
        { x: 4000, y: 0.1 },
        { x: 4250, y: 0.35 },
        { x: width, y: 0.25 }
      ],
      baseY: height * LAYER_CONFIG.nearHills.baseY,
      amplitude: LAYER_CONFIG.nearHills.amplitude * 1.2,
      fill: 'url(#nearHillGradient)',
      opacity: LAYER_CONFIG.nearHills.opacity
    },
    {
      id: 'very-near-hills',
      className: 'landscape-layer-very-near',
      points: [
        { x: 0, y: 0.25 },
        { x: 300, y: 0.45 },
        { x: 600, y: 0.1 },
        { x: 900, y: 0.4 },
        { x: 1200, y: 0.15 },
        { x: 1500, y: 0.5 },
        { x: 1800, y: 0.1 },
        { x: 2100, y: 0.4 },
        { x: 2400, y: 0.2 },
        { x: 2700, y: 0.45 },
        { x: 3000, y: 0.15 },
        { x: 3300, y: 0.4 },
        { x: 3600, y: 0.2 },
        { x: 3900, y: 0.35 },
        { x: 4200, y: 0.2 },
        { x: width, y: 0.3 }
      ],
      baseY: height * LAYER_CONFIG.veryNearHills.baseY,
      amplitude: LAYER_CONFIG.veryNearHills.amplitude * 1.1,
      fill: 'url(#veryNearHillGradient)',
      opacity: LAYER_CONFIG.veryNearHills.opacity
    }
  ];
};

/**
 * Generates trees positioned on hill curves
 */
export const generateTreesOnHills = (hillLayers: HillLayer[]): Tree[] => {
  const trees: Tree[] = [];
  const { width } = LANDSCAPE_DIMENSIONS;
  
  hillLayers.forEach((layer, layerIndex) => {
    const layerType: LayerType = layerIndex <= 1 ? 'far' : layerIndex <= 3 ? 'mid' : 'near';
    let spacing: number;
    
    switch (layerIndex) {
      case 0: // very-far-hills
        spacing = LAYER_CONFIG.veryFarHills.treeSpacing;
        break;
      case 1: // far-hills
        spacing = LAYER_CONFIG.farHills.treeSpacing;
        break;
      case 2: // mid-hills
        spacing = LAYER_CONFIG.midHills.treeSpacing;
        break;
      case 3: // mid-near-hills
        spacing = LAYER_CONFIG.midNearHills.treeSpacing;
        break;
      case 4: // near-hills
        spacing = LAYER_CONFIG.nearHills.treeSpacing;
        break;
      case 5: // very-near-hills
        spacing = LAYER_CONFIG.veryNearHills.treeSpacing;
        break;
      default:
        spacing = 100;
    }
    
    const treeCount = Math.ceil(width / spacing);
    
    for (let i = 0; i < treeCount; i++) {
      const baseX = (i / treeCount) * width;
      const x = baseX + randomInRange(-50, 50); // Add some randomness
      
      // Calculate Y position on the actual hill curve
      const hillY = getYPositionOnHill(x, layer.points, layer.baseY, layer.amplitude);
      
      // Place tree slightly above the hill surface (trees grow upward)
      const y = hillY - 5;
      
      // Size varies by layer - smaller trees farther away
      const sizeRange = TREE_CONFIG.sizeRange[layerType];
      const size = randomInRange(sizeRange.min, sizeRange.max);
      
      const type = Math.floor(Math.random() * 3) as TreeType;
      const opacity = randomInRange(0.3, 0.7);
      
      trees.push({ 
        x, 
        y, 
        size, 
        type, 
        opacity,
        layer: layerType
      });
    }
  });
  
  return trees;
};

/**
 * Generates clouds with different layers for depth
 */
export const generateClouds = (): Cloud[] => {
  const clouds: Cloud[] = [];
  const { width } = LANDSCAPE_DIMENSIONS;
  
  // Generate clouds for each layer
  (Object.keys(CLOUD_CONFIG) as LayerType[]).forEach((layer) => {
    const config = CLOUD_CONFIG[layer];
    
    for (let i = 0; i < config.count; i++) {
      clouds.push({
        x: Math.random() * width,
        y: randomInRange(config.yRange.min, config.yRange.max),
        scale: randomInRange(config.scaleRange.min, config.scaleRange.max),
        opacity: randomInRange(config.opacityRange.min, config.opacityRange.max),
        layer
      });
    }
  });
  
  return clouds;
}; 