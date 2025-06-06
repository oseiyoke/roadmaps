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
  
  points.forEach((point, i) => {
    if (i === 0) {
      path += ` L 0,${baseY + point.y * amplitude}`;
    }
    
    // Use quadratic bezier curves for smooth hills
    if (i > 0 && i < points.length) {
      const prevPoint = points[i - 1];
      const cpX = (prevPoint.x + point.x) / 2;
      const cpY = baseY + ((prevPoint.y + point.y) / 2) * amplitude;
      path += ` Q ${cpX},${cpY} ${point.x},${baseY + point.y * amplitude}`;
    }
  });
  
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
      id: 'far-hills',
      className: 'landscape-layer-far',
      points: [
        { x: 0, y: 0.3 },
        { x: 400, y: 0.2 },
        { x: 800, y: 0.4 },
        { x: 1200, y: 0.15 },
        { x: 1600, y: 0.35 },
        { x: 2000, y: 0.25 },
        { x: 2400, y: 0.45 },
        { x: 2800, y: 0.2 },
        { x: 3200, y: 0.3 },
        { x: 3600, y: 0.25 },
        { x: width, y: 0.35 }
      ],
      baseY: height * LAYER_CONFIG.farHills.baseY,
      amplitude: LAYER_CONFIG.farHills.amplitude,
      fill: 'url(#farHillGradient)',
      opacity: LAYER_CONFIG.farHills.opacity
    },
    {
      id: 'mid-hills',
      className: 'landscape-layer-mid',
      points: [
        { x: 0, y: 0.25 },
        { x: 300, y: 0.15 },
        { x: 600, y: 0.35 },
        { x: 1000, y: 0.1 },
        { x: 1400, y: 0.4 },
        { x: 1800, y: 0.2 },
        { x: 2200, y: 0.3 },
        { x: 2600, y: 0.15 },
        { x: 3000, y: 0.35 },
        { x: 3400, y: 0.2 },
        { x: width, y: 0.3 }
      ],
      baseY: height * LAYER_CONFIG.midHills.baseY,
      amplitude: LAYER_CONFIG.midHills.amplitude,
      fill: 'url(#midHillGradient)',
      opacity: LAYER_CONFIG.midHills.opacity
    },
    {
      id: 'near-hills',
      className: 'landscape-layer-near',
      points: [
        { x: 0, y: 0.2 },
        { x: 500, y: 0.3 },
        { x: 900, y: 0.1 },
        { x: 1300, y: 0.35 },
        { x: 1700, y: 0.15 },
        { x: 2100, y: 0.25 },
        { x: 2500, y: 0.1 },
        { x: 2900, y: 0.3 },
        { x: 3300, y: 0.15 },
        { x: width, y: 0.25 }
      ],
      baseY: height * LAYER_CONFIG.nearHills.baseY,
      amplitude: LAYER_CONFIG.nearHills.amplitude,
      fill: 'url(#nearHillGradient)',
      opacity: LAYER_CONFIG.nearHills.opacity
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
    const layerType: LayerType = layerIndex === 0 ? 'far' : layerIndex === 1 ? 'mid' : 'near';
    const spacing = layerIndex === 0 ? LAYER_CONFIG.farHills.treeSpacing : 
                   layerIndex === 1 ? LAYER_CONFIG.midHills.treeSpacing : 
                   LAYER_CONFIG.nearHills.treeSpacing;
    
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