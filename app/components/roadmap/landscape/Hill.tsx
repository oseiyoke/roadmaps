import React from 'react';
import { HillProps } from './types';
import { generateHillPath } from './utils';
import { Tree } from './Tree';

/**
 * Hill component that renders a single hill layer with its associated trees
 */
export const Hill: React.FC<HillProps> = ({ layer, trees }) => {
  const { id, className, points, baseY, amplitude, fill, opacity } = layer;
  const path = generateHillPath(points, baseY, amplitude);
  
  // Filter trees for this specific layer
  const layerTrees = trees.filter(tree => {
    const layerType = id.includes('far') ? 'far' : 
                     id.includes('mid') ? 'mid' : 'near';
    return tree.layer === layerType;
  });
  
  // Apply blur to far layer trees for depth effect
  const shouldBlurTrees = id.includes('far');
  
  return (
    <g className={className}>
      {/* Hill path */}
      <path
        d={path}
        fill={fill}
        opacity={opacity}
        filter="url(#mistBlur)"
      />
      
      {/* Trees for this hill layer */}
      <g filter={shouldBlurTrees ? "url(#treeBlur)" : undefined}>
        {layerTrees.map((tree, index) => (
          <Tree
            key={`${id}-tree-${index}`}
            x={tree.x}
            y={tree.y}
            size={tree.size}
            type={tree.type}
            opacity={tree.opacity * opacity}
          />
        ))}
      </g>
    </g>
  );
}; 
