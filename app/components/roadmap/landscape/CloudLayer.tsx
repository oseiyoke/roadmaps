import React from 'react';
import { Cloud } from './Cloud';
import { Cloud as CloudType, LayerType } from './types';

interface CloudLayerProps {
  clouds: CloudType[];
  layer: LayerType;
  applyBlur?: boolean;
}

/**
 * CloudLayer component that renders all clouds for a specific layer
 */
export const CloudLayer: React.FC<CloudLayerProps> = ({ clouds, layer, applyBlur = false }) => {
  const layerClouds = clouds.filter(cloud => cloud.layer === layer);
  const className = `clouds-${layer}`;
  
  return (
    <g className={className} filter={applyBlur ? "url(#cloudBlur)" : undefined}>
      {layerClouds.map((cloud, index) => (
        <Cloud
          key={`cloud-${layer}-${index}`}
          x={cloud.x}
          y={cloud.y}
          scale={cloud.scale}
          opacity={cloud.opacity}
        />
      ))}
    </g>
  );
}; 