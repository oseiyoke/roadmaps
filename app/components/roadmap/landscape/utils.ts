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
export const generateHillLayers = (customWidth?: number): HillLayer[] => {
  const { width: defaultWidth, height } = LANDSCAPE_DIMENSIONS;
  const width = customWidth || defaultWidth;
  
  // Generate point arrays that scale with width
  const generateScaledPoints = (basePoints: Array<{xRatio: number, y: number}>) => {
    return basePoints.map(point => ({
      x: point.xRatio * width,
      y: point.y
    }));
  };

  return [
    {
      id: 'very-far-hills',
      className: 'landscape-layer-very-far',
      points: generateScaledPoints([
        { xRatio: 0, y: 0.35 },
        { xRatio: 0.067, y: 0.15 },
        { xRatio: 0.133, y: 0.5 },
        { xRatio: 0.2, y: 0.2 },
        { xRatio: 0.267, y: 0.6 },
        { xRatio: 0.333, y: 0.1 },
        { xRatio: 0.4, y: 0.45 },
        { xRatio: 0.467, y: 0.25 },
        { xRatio: 0.533, y: 0.55 },
        { xRatio: 0.6, y: 0.15 },
        { xRatio: 0.667, y: 0.4 },
        { xRatio: 0.733, y: 0.3 },
        { xRatio: 0.8, y: 0.5 },
        { xRatio: 0.867, y: 0.2 },
        { xRatio: 0.933, y: 0.4 },
        { xRatio: 1.0, y: 0.3 }
      ]),
      baseY: height * LAYER_CONFIG.veryFarHills.baseY,
      amplitude: LAYER_CONFIG.veryFarHills.amplitude * 1.5,
      fill: 'url(#veryFarHillGradient)',
      opacity: LAYER_CONFIG.veryFarHills.opacity
    },
    {
      id: 'far-hills',
      className: 'landscape-layer-far',
      points: generateScaledPoints([
        { xRatio: 0, y: 0.3 },
        { xRatio: 0.044, y: 0.1 },
        { xRatio: 0.089, y: 0.45 },
        { xRatio: 0.133, y: 0.15 },
        { xRatio: 0.178, y: 0.55 },
        { xRatio: 0.222, y: 0.05 },
        { xRatio: 0.267, y: 0.4 },
        { xRatio: 0.311, y: 0.1 },
        { xRatio: 0.356, y: 0.5 },
        { xRatio: 0.4, y: 0.2 },
        { xRatio: 0.444, y: 0.45 },
        { xRatio: 0.489, y: 0.15 },
        { xRatio: 0.533, y: 0.6 },
        { xRatio: 0.578, y: 0.1 },
        { xRatio: 0.622, y: 0.4 },
        { xRatio: 0.667, y: 0.2 },
        { xRatio: 0.711, y: 0.5 },
        { xRatio: 0.756, y: 0.15 },
        { xRatio: 0.8, y: 0.45 },
        { xRatio: 0.844, y: 0.25 },
        { xRatio: 0.889, y: 0.35 },
        { xRatio: 0.933, y: 0.15 },
        { xRatio: 1.0, y: 0.35 }
      ]),
      baseY: height * LAYER_CONFIG.farHills.baseY,
      amplitude: LAYER_CONFIG.farHills.amplitude * 1.4,
      fill: 'url(#farHillGradient)',
      opacity: LAYER_CONFIG.farHills.opacity
    },
    {
      id: 'mid-hills',
      className: 'landscape-layer-mid',
      points: generateScaledPoints([
        { xRatio: 0, y: 0.25 },
        { xRatio: 0.033, y: 0.05 },
        { xRatio: 0.067, y: 0.4 },
        { xRatio: 0.1, y: 0.1 },
        { xRatio: 0.133, y: 0.5 },
        { xRatio: 0.167, y: 0.15 },
        { xRatio: 0.2, y: 0.45 },
        { xRatio: 0.233, y: 0.05 },
        { xRatio: 0.267, y: 0.35 },
        { xRatio: 0.3, y: 0.15 },
        { xRatio: 0.333, y: 0.55 },
        { xRatio: 0.367, y: 0.1 },
        { xRatio: 0.4, y: 0.4 },
        { xRatio: 0.433, y: 0.2 },
        { xRatio: 0.467, y: 0.5 },
        { xRatio: 0.5, y: 0.1 },
        { xRatio: 0.533, y: 0.45 },
        { xRatio: 0.567, y: 0.15 },
        { xRatio: 0.6, y: 0.4 },
        { xRatio: 0.633, y: 0.2 },
        { xRatio: 0.667, y: 0.5 },
        { xRatio: 0.7, y: 0.1 },
        { xRatio: 0.733, y: 0.4 },
        { xRatio: 0.767, y: 0.2 },
        { xRatio: 0.8, y: 0.35 },
        { xRatio: 0.833, y: 0.15 },
        { xRatio: 0.867, y: 0.4 },
        { xRatio: 0.9, y: 0.2 },
        { xRatio: 0.933, y: 0.35 },
        { xRatio: 1.0, y: 0.3 }
      ]),
      baseY: height * LAYER_CONFIG.midHills.baseY,
      amplitude: LAYER_CONFIG.midHills.amplitude * 1.3,
      fill: 'url(#midHillGradient)',
      opacity: LAYER_CONFIG.midHills.opacity
    },
    {
      id: 'mid-near-hills',
      className: 'landscape-layer-mid-near',
      points: generateScaledPoints([
        { xRatio: 0, y: 0.3 },
        { xRatio: 0.044, y: 0.1 },
        { xRatio: 0.089, y: 0.5 },
        { xRatio: 0.133, y: 0.05 },
        { xRatio: 0.178, y: 0.45 },
        { xRatio: 0.222, y: 0.15 },
        { xRatio: 0.267, y: 0.55 },
        { xRatio: 0.311, y: 0.1 },
        { xRatio: 0.356, y: 0.4 },
        { xRatio: 0.4, y: 0.2 },
        { xRatio: 0.444, y: 0.5 },
        { xRatio: 0.489, y: 0.05 },
        { xRatio: 0.533, y: 0.4 },
        { xRatio: 0.578, y: 0.15 },
        { xRatio: 0.622, y: 0.5 },
        { xRatio: 0.667, y: 0.1 },
        { xRatio: 0.711, y: 0.45 },
        { xRatio: 0.756, y: 0.2 },
        { xRatio: 0.8, y: 0.4 },
        { xRatio: 0.844, y: 0.15 },
        { xRatio: 0.889, y: 0.35 },
        { xRatio: 0.933, y: 0.2 },
        { xRatio: 1.0, y: 0.3 }
      ]),
      baseY: height * LAYER_CONFIG.midNearHills.baseY,
      amplitude: LAYER_CONFIG.midNearHills.amplitude * 1.2,
      fill: 'url(#midNearHillGradient)',
      opacity: LAYER_CONFIG.midNearHills.opacity
    },
    {
      id: 'near-hills',
      className: 'landscape-layer-near',
      points: generateScaledPoints([
        { xRatio: 0, y: 0.2 },
        { xRatio: 0.056, y: 0.4 },
        { xRatio: 0.111, y: 0.05 },
        { xRatio: 0.167, y: 0.45 },
        { xRatio: 0.222, y: 0.1 },
        { xRatio: 0.278, y: 0.5 },
        { xRatio: 0.333, y: 0.05 },
        { xRatio: 0.389, y: 0.4 },
        { xRatio: 0.444, y: 0.15 },
        { xRatio: 0.5, y: 0.45 },
        { xRatio: 0.556, y: 0.05 },
        { xRatio: 0.611, y: 0.4 },
        { xRatio: 0.667, y: 0.1 },
        { xRatio: 0.722, y: 0.45 },
        { xRatio: 0.778, y: 0.15 },
        { xRatio: 0.833, y: 0.4 },
        { xRatio: 0.889, y: 0.1 },
        { xRatio: 0.944, y: 0.35 },
        { xRatio: 1.0, y: 0.25 }
      ]),
      baseY: height * LAYER_CONFIG.nearHills.baseY,
      amplitude: LAYER_CONFIG.nearHills.amplitude * 1.2,
      fill: 'url(#nearHillGradient)',
      opacity: LAYER_CONFIG.nearHills.opacity
    },
    {
      id: 'very-near-hills',
      className: 'landscape-layer-very-near',
      points: generateScaledPoints([
        { xRatio: 0, y: 0.25 },
        { xRatio: 0.067, y: 0.45 },
        { xRatio: 0.133, y: 0.1 },
        { xRatio: 0.2, y: 0.4 },
        { xRatio: 0.267, y: 0.15 },
        { xRatio: 0.333, y: 0.5 },
        { xRatio: 0.4, y: 0.1 },
        { xRatio: 0.467, y: 0.4 },
        { xRatio: 0.533, y: 0.2 },
        { xRatio: 0.6, y: 0.45 },
        { xRatio: 0.667, y: 0.15 },
        { xRatio: 0.733, y: 0.4 },
        { xRatio: 0.8, y: 0.2 },
        { xRatio: 0.867, y: 0.35 },
        { xRatio: 0.933, y: 0.2 },
        { xRatio: 1.0, y: 0.3 }
      ]),
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
export const generateTreesOnHills = (hillLayers: HillLayer[], customWidth?: number): Tree[] => {
  const trees: Tree[] = [];
  const { width: defaultWidth } = LANDSCAPE_DIMENSIONS;
  const width = customWidth || defaultWidth;
  
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
export const generateClouds = (customWidth?: number): Cloud[] => {
  const clouds: Cloud[] = [];
  const { width: defaultWidth } = LANDSCAPE_DIMENSIONS;
  const width = customWidth || defaultWidth;
  
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