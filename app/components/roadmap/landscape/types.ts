export interface Point2D {
  x: number;
  y: number;
}

export type LayerType = 'far' | 'mid' | 'near';

export type TreeType = 0 | 1 | 2; // Coniferous, Round, Abstract

export interface Tree {
  x: number;
  y: number;
  size: number;
  type: TreeType;
  opacity: number;
  layer: LayerType;
}

export interface Cloud {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  layer: LayerType;
}

export interface HillLayer {
  id: string;
  className: string;
  points: Point2D[];
  baseY: number;
  amplitude: number;
  fill: string;
  opacity: number;
}

export interface LandscapeBackgroundProps {
  width: number;
  height: number;
}

export interface TreeProps {
  x: number;
  y: number;
  size: number;
  type: TreeType;
  opacity: number;
}

export interface CloudProps {
  x: number;
  y: number;
  scale: number;
  opacity: number;
}

export interface HillProps {
  layer: HillLayer;
  trees: Tree[];
} 