export const LANDSCAPE_DIMENSIONS = {
  width: 4500,
  height: 1000,
} as const;

export const COLOR_PALETTE = {
  sky: {
    light: '#f8f9fa',
    medium: '#e9ecef',
    dark: '#dee2e6',
  },
  terrain: {
    farHills: {
      primary: '#667e58',
      secondary: '#9bba90',
    },
    midHills: {
      primary: '#4b8961',
      secondary: '#93b280',
    },
    nearHills: {
      primary: '#32795b',
      secondary: '#3e654c',
    },
  },
  trees: {
    trunk: '#4d5938',
    foliage: {
      primary: '#3c4637',
      secondary: '#4d5938',
    },
  },
  clouds: '#fbf9ed',
  road: {
    primary: '#203a4b',
    secondary: '#1e3849',
    tertiary: '#274e47',
  },
  marker: '#f28d2f',
} as const;

export const LAYER_CONFIG = {
  veryFarHills: {
    baseY: 0.25,
    amplitude: 300,
    opacity: 0.7,
    treeSpacing: 200,
  },
  farHills: {
    baseY: 0.35,
    amplitude: 250,
    opacity: 0.9,
    treeSpacing: 150,
  },
  midHills: {
    baseY: 0.5,
    amplitude: 200,
    opacity: 0.95,
    treeSpacing: 100,
  },
  midNearHills: {
    baseY: 0.6,
    amplitude: 175,
    opacity: 0.97,
    treeSpacing: 75,
  },
  nearHills: {
    baseY: 0.7,
    amplitude: 150,
    opacity: 1,
    treeSpacing: 50,
  },
  veryNearHills: {
    baseY: 0.8,
    amplitude: 120,
    opacity: 1,
    treeSpacing: 30,
  },
} as const;

export const CLOUD_CONFIG = {
  far: {
    count: 18,
    yRange: { min: 50, max: 200 },
    scaleRange: { min: 0.5, max: 0.8 },
    opacityRange: { min: 0.2, max: 0.3 },
  },
  mid: {
    count: 14,
    yRange: { min: 100, max: 300 },
    scaleRange: { min: 0.7, max: 1.1 },
    opacityRange: { min: 0.3, max: 0.5 },
  },
  near: {
    count: 10,
    yRange: { min: 150, max: 400 },
    scaleRange: { min: 0.9, max: 1.4 },
    opacityRange: { min: 0.4, max: 0.6 },
  },
} as const;

export const TREE_CONFIG = {
  types: {
    CONIFEROUS: 0,
    ROUND: 1,
    ABSTRACT: 2,
  },
  sizeRange: {
    far: { min: 15, max: 30 },
    mid: { min: 20, max: 35 },
    near: { min: 25, max: 40 },
  },
} as const; 