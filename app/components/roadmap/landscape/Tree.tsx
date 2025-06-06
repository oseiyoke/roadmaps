import React from 'react';
import { TreeProps } from './types';
import { COLOR_PALETTE, TREE_CONFIG } from './constants';

/**
 * Renders a simple teardrop/oval tree shape matching the image style
 */
const SimpleTree: React.FC<TreeProps> = ({ x, y, size, opacity }) => {
  const { trunk, foliage } = COLOR_PALETTE.trees;
  
  return (
    <g opacity={opacity}>
      {/* Tree trunk - thin rectangle */}
      <rect x={x - 1.5} y={y - size * 0.1} width="3" height={size * 0.3} fill={trunk} />
      
      {/* Tree canopy - teardrop/oval shape */}
      <ellipse 
        cx={x} 
        cy={y - size * 0.4} 
        rx={size * 0.25} 
        ry={size * 0.45} 
        fill={foliage.primary} 
      />
    </g>
  );
};

/**
 * Renders a rounded tree shape with slightly different proportions
 */
const RoundedTree: React.FC<TreeProps> = ({ x, y, size, opacity }) => {
  const { trunk, foliage } = COLOR_PALETTE.trees;
  
  return (
    <g opacity={opacity}>
      {/* Tree trunk */}
      <rect x={x - 1.5} y={y - size * 0.1} width="3" height={size * 0.25} fill={trunk} />
      
      {/* Tree canopy - more circular */}
      <ellipse 
        cx={x} 
        cy={y - size * 0.35} 
        rx={size * 0.3} 
        ry={size * 0.4} 
        fill={foliage.secondary} 
      />
    </g>
  );
};

/**
 * Renders a tall, narrow tree shape
 */
const TallTree: React.FC<TreeProps> = ({ x, y, size, opacity }) => {
  const { trunk, foliage } = COLOR_PALETTE.trees;
  
  return (
    <g opacity={opacity}>
      {/* Tree trunk */}
      <rect x={x - 1.5} y={y - size * 0.1} width="3" height={size * 0.35} fill={trunk} />
      
      {/* Tree canopy - taller oval */}
      <ellipse 
        cx={x} 
        cy={y - size * 0.45} 
        rx={size * 0.2} 
        ry={size * 0.5} 
        fill={foliage.primary} 
      />
    </g>
  );
};

/**
 * Tree component that renders different simple tree variations based on the type prop
 */
export const Tree: React.FC<TreeProps> = (props) => {
  const { type } = props;
  
  switch (type) {
    case TREE_CONFIG.types.CONIFEROUS:
      return <TallTree {...props} />;
    case TREE_CONFIG.types.ROUND:
      return <RoundedTree {...props} />;
    case TREE_CONFIG.types.ABSTRACT:
      return <SimpleTree {...props} />;
    default:
      return <SimpleTree {...props} />;
  }
}; 